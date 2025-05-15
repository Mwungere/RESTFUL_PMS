const prisma = require('../utils/prisma');

exports.getAllVehicles = async (req, res) => {
    try {
        const { status } = req.query;
        const where = {};

        // Add status filter if provided
        if (status && ['PENDING', 'ACCEPTED', 'REJECTED'].includes(status)) {
            where.status = status;
        }

        const vehicles = await prisma.vehicle.findMany({
            where,
            include: {
                owner: {
                    select: {
                        email: true,
                        firstName: true,
                        lastName: true
                    }
                }
            },
            orderBy: {
                registeredAt: 'desc'
            }
        });

        res.json(vehicles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getMyVehicles = async (req, res) => {
    try {
        const vehicles = await prisma.vehicle.findMany({
            where: {
                ownerId: req.user.id
            },
            include: {
                owner: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            },
            orderBy: {
                registeredAt: 'desc'
            }
        });

        res.json(vehicles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.registerVehicle = async (req, res) => {
    try {
        const { plateNumber } = req.body;

        // Check if vehicle with this plate number already exists
        const existingVehicle = await prisma.vehicle.findUnique({
            where: { plateNumber }
        });

        if (existingVehicle) {
            return res.status(400).json({ message: 'Vehicle with this plate number already exists' });
        }

        // Create new vehicle registration
        const vehicle = await prisma.vehicle.create({
            data: {
                plateNumber,
                ownerId: req.user.id
            },
            include: {
                owner: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });

        res.status(201).json({
            message: 'Vehicle registered successfully',
            vehicle
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateVehicleStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const vehicle = await prisma.vehicle.findUnique({
            where: { id: req.params.id },
            include: {
                owner: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });

        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle registration not found' });
        }

        // If the status is being changed to 'accepted'
        if (status === 'ACCEPTED') {
            // Get or create parking lot
            let parkingLot = await prisma.parkingLot.findFirst();
            if (!parkingLot) {
                parkingLot = await prisma.parkingLot.create({
                    data: {}
                });
            }

            // Check if parking lot is full
            if (parkingLot.usedSlots >= parkingLot.totalSlots) {
                return res.status(400).json({ message: 'No parking slots available' });
            }

            // Check if vehicle is already parked
            if (vehicle.status === 'ACCEPTED') {
                return res.status(400).json({ message: 'Vehicle already has a slot' });
            }

            // Use a transaction to update both vehicle and parking lot
            const result = await prisma.$transaction(async (prisma) => {
                const updatedVehicle = await prisma.vehicle.update({
                    where: { id: vehicle.id },
                    data: {
                        status,
                        slotNumber: parkingLot.usedSlots + 1
                    },
                    include: {
                        owner: {
                            select: {
                                firstName: true,
                                lastName: true
                            }
                        }
                    }
                });

                await prisma.parkingLot.update({
                    where: { id: parkingLot.id },
                    data: {
                        usedSlots: parkingLot.usedSlots + 1
                    }
                });

                return updatedVehicle;
            });

            return res.json({
                message: 'Vehicle status updated successfully',
                vehicle: result
            });
        } else {
            // For 'REJECTED' or 'PENDING' status
            // If the vehicle was previously accepted, free up the slot
            if (vehicle.status === 'ACCEPTED') {
                await prisma.$transaction(async (prisma) => {
                    await prisma.vehicle.update({
                        where: { id: vehicle.id },
                        data: {
                            status,
                            slotNumber: null
                        }
                    });

                    const parkingLot = await prisma.parkingLot.findFirst();
                    if (parkingLot) {
                        await prisma.parkingLot.update({
                            where: { id: parkingLot.id },
                            data: {
                                usedSlots: Math.max(0, parkingLot.usedSlots - 1)
                            }
                        });
                    }
                });
            } else {
                await prisma.vehicle.update({
                    where: { id: vehicle.id },
                    data: {
                        status,
                        slotNumber: null
                    }
                });
            }

            const updatedVehicle = await prisma.vehicle.findUnique({
                where: { id: vehicle.id },
                include: {
                    owner: {
                        select: {
                            firstName: true,
                            lastName: true
                        }
                    }
                }
            });

            res.json({
                message: 'Vehicle status updated successfully',
                vehicle: updatedVehicle
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}; 