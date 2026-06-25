const express = require('express');
const User = require('../models/User'); // Ensure the 'U' in User is capitalized matching your file
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, async (req, res, next) => {
  try {
    const users = await User.find().select('name email role');
    res.status(200).json({ status: 'success', data: { users } });
  } catch (error) {
    next(error);
  }
});

module.exports = router;