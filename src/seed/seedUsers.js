const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Clear existing users to prevent duplication errors
    await User.deleteMany();

    await User.create([
      {
        name: 'The Manager',
        email: 'manager@gmail.com',
        password: 'Manager@123',
        role: 'manager'
      },
      {
        name: 'The User',
        email: 'user@gmail.com',
        password: 'User@123',
        role: 'user'
      }
    ]);

    console.log('Database successfully seeded with default users!');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding data: ${error.message}`);
    process.exit(1);
  }
};

seedUsers();