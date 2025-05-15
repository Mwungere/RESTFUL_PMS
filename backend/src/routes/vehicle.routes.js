const express = require('express');
const router = express.Router();
const { getAllVehicles, getMyVehicles, updateVehicleStatus, registerVehicle } = require('../controllers/vehicle.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');
const { vehicleStatusValidation, additionalVehicleValidation, validate } = require('../middleware/validate.middleware');

// Protected routes - require authentication
router.use(protect);

// Client routes
router.get('/my-vehicles', getMyVehicles);
router.post('/register', additionalVehicleValidation, validate, registerVehicle);

// Admin routes
router.get('/', restrictTo('ADMIN'), getAllVehicles);
router.patch('/:id/status',
    restrictTo('ADMIN'),
    vehicleStatusValidation,
    validate,
    updateVehicleStatus
);

module.exports = router; 