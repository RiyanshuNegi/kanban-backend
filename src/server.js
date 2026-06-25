const dotenv = require('dotenv');

// 1. Safety Net: Catch synchronous exceptions not handled anywhere else
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(`${err.name}: ${err.message}`);
  process.exit(1);
});

// Load environment variables before anything else
dotenv.config();

// Require app and DB after loading env vars
const app = require('./app');
const connectDB = require('./config/db');

// 2. Initialize Database Connection
connectDB();

// 3. Start the Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

// 4. Safety Net: Catch asynchronous promise rejections (e.g., DB connection loss)
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down gracefully...');
  console.error(`${err.name}: ${err.message}`);
  
  // Close the server to finish ongoing requests before exiting
  server.close(() => {
    process.exit(1);
  });
});
