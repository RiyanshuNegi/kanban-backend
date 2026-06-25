const authService = require('../services/authService.js');
const generateToken = require('../utils/generateToken');

exports.signup = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);
    
    // Generate JWT
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    next(error); // Passes the error to your global error handler
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const user = await authService.validateCredentials(email, password);
    
    // Generate JWT
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    next(error);
  }
};