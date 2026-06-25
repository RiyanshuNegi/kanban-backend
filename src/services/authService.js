const User = require('../models/User');
const ApiError = require('../utils/ApiError');

const registerUser = async (userData) => {
  const { name, email, password, role } = userData;
  
  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ApiError(400, 'A user with this email already exists');
  }

  // Create and return the new user
  const user = await User.create({
    name,
    email,
    password, // Hashing is handled by the Mongoose pre-save hook in your User model
    role: role || 'user'
  });

  return user;
};

const validateCredentials = async (email, password) => {
  // Find user and explicitly select the password field if you set it to select: false in the model
  const user = await User.findOne({ email });
  
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }
  
  return user;
};

module.exports = { registerUser, validateCredentials };