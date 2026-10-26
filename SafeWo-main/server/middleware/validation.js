const { validationResult, check } = require('express-validator');

// Middleware to catch and format express-validator errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }
  next();
};

const registerValidation = [
  check('name', 'Full Name is required (minimum 2 characters)').trim().isLength({ min: 2 }),
  check('email', 'Please include a valid email address').isEmail().normalizeEmail(),
  check('phone', 'Please include a valid phone number (minimum 8 digits)').trim().isLength({ min: 8 }),
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  validate,
];

const loginValidation = [
  check('email', 'Please provide a valid email').isEmail().normalizeEmail(),
  check('password', 'Password is required').exists(),
  validate,
];

const incidentValidation = [
  check('title', 'Title is required (maximum 120 characters)').trim().notEmpty().isLength({ max: 120 }),
  check('description', 'Description is required').trim().notEmpty(),
  check('category', 'Valid category is required').isIn([
    'Harassment',
    'Theft',
    'Stalking',
    'Unsafe Area',
    'Suspicious Activity',
    'Violence',
    'Accident',
    'Other',
  ]),
  check('severity', 'Valid severity is required').isIn(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  check('latitude', 'Valid latitude is required').isFloat({ min: -90, max: 90 }),
  check('longitude', 'Valid longitude is required').isFloat({ min: -180, max: 180 }),
  check('address', 'Location address is required').trim().notEmpty(),
  validate,
];

const contactValidation = [
  check('name', 'Contact name is required').trim().notEmpty(),
  check('relationship', 'Relationship is required').trim().notEmpty(),
  check('phone', 'Valid phone number is required').trim().isLength({ min: 7 }),
  validate,
];

const safeZoneValidation = [
  check('name', 'Safe zone name is required').trim().notEmpty(),
  check('type', 'Valid safe zone type is required').isIn([
    'Home',
    'College',
    'Office',
    'Hostel',
    'Family House',
    'Other',
  ]),
  check('address', 'Address is required').trim().notEmpty(),
  check('latitude', 'Valid latitude is required').isFloat({ min: -90, max: 90 }),
  check('longitude', 'Valid longitude is required').isFloat({ min: -180, max: 180 }),
  check('radius', 'Radius must be between 50 and 5000 meters').optional().isFloat({ min: 50, max: 5000 }),
  validate,
];

const sosValidation = [
  check('latitude', 'Valid latitude is required').isFloat({ min: -90, max: 90 }),
  check('longitude', 'Valid longitude is required').isFloat({ min: -180, max: 180 }),
  validate,
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  incidentValidation,
  contactValidation,
  safeZoneValidation,
  sosValidation,
};
