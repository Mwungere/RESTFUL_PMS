const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const prisma = require('./utils/prisma');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth.routes');
const vehicleRoutes = require('./routes/vehicle.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Initialize parking lot
const initializeParkingLot = async () => {
    try {
        const parkingLot = await prisma.parkingLot.findFirst();
        if (!parkingLot) {
            await prisma.parkingLot.create({
                data: {}
            });
            console.log('Parking lot initialized');
        }
    } catch (error) {
        console.error('Error initializing parking lot:', error);
    }
};

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await prisma.$connect();
        console.log('Connected to database');
        await initializeParkingLot();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};

startServer(); 