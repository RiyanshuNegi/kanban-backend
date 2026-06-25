const express = require('express');
const authController = require('../controllers/authController.js');
const { signupRules, loginRules } = require('../validators/authValidator.js');
const validate = require('../middleware/validateMiddleware.js');

const router = express.Router();

// POST /api/auth/signup
router.post(
  '/signup', 
  signupRules, 
  validate, 
  authController.signup
);

// POST /api/auth/login
router.post(
  '/login', 
  loginRules, 
  validate, 
  authController.login
);

module.exports = router;