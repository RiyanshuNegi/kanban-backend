const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

const protect = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new ApiError(401, 'Not authorized, token missing'));
    }

    // Verify token identity
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user and ensure they still exist in the database
    const currentUser = await User.findById(decoded.id).select('-password');
    if (!currentUser) {
      return next(new ApiError(401, 'The user belonging to this token no longer exists'));
    }

    // Grant access to protected route
    req.user = currentUser;
    next();
  } catch (error) {
    return next(new ApiError(401, 'Not authorized, token invalid or expired'));
  }
};

module.exports = protect;