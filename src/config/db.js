const mongoose = require('mongoose');

// We cache the connection here
let isConnected = false; 

const connectDB = async () => {
  if (isConnected) {
    console.log("Using existing MongoDB connection");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      // These options are optimized for Serverless/Vercel
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      // Prevents mongoose from buffering queries before connection is established
      bufferCommands: false 
    });

    isConnected = db.connections[0].readyState === 1;
    console.log("New MongoDB connection established");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Failed to connect to Database");
  }
};

module.exports = connectDB;