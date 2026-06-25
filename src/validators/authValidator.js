const { body } = require('express-validator');

const signupRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required'),
  body('email')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['manager', 'user']).withMessage('Invalid role assigned')
];

const loginRules = [
  body('email')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
];

module.exports = { signupRules, loginRules };