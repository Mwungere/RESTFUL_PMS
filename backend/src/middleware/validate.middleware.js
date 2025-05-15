const { validationResult, body } = require('express-validator');

exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

exports.registerValidation = [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('firstName')
        .notEmpty()
        .withMessage('First name is required')
        .trim()
        .isLength({ min: 2 })
        .withMessage('First name must be at least 2 characters long'),
    body('lastName')
        .notEmpty()
        .withMessage('Last name is required')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Last name must be at least 2 characters long'),
    body('plateNumber')
        .notEmpty()
        .withMessage('Vehicle plate number is required')
        .matches(/^[A-Za-z0-9 -]+$/)
        .withMessage('Vehicle plate number can only contain letters, numbers, spaces and hyphens')
];

exports.additionalVehicleValidation = [
    body('plateNumber')
        .notEmpty()
        .withMessage('Vehicle plate number is required')
        .matches(/^[A-Za-z0-9 -]+$/)
        .withMessage('Vehicle plate number can only contain letters, numbers, spaces and hyphens')
];

exports.loginValidation = [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

exports.vehicleStatusValidation = [
    body('status')
        .isIn(['PENDING', 'ACCEPTED', 'REJECTED'])
        .withMessage('Invalid status value')
]; 