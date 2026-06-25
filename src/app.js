const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const taskRoutes = require('./routes/taskRoutes.js');
const connectDB = require('./config/db');
// Route Imports
const authRoutes = require('./routes/authRoutes.js');
// const taskRoutes = require('./routes/task.routes'); // Uncomment when you build tasks

// Utility Imports
const ApiError = require('./utils/ApiError');

const app = express();

// --- 1. Global Middleware ---
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'https://kanban-frontend-git-main-rn7msd-gmailcoms-projects.vercel.app/',
    'https://kanban-frontend-gilt-beta.vercel.app' // Replace with Vercel URL
  ], 
  credentials: true
}));

app.use(async (req, res, next) => {
  await connectDB();
  next();
});
app.use(helmet()); // Set security HTTP headers
app.use(express.json()); // Parse incoming JSON payloads

// Enable HTTP request logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.use('/api/users', require('./routes/userRoutes.js')); 

app.use((req, res, next) => {
    next(new ApiError(404, `Cannot find ${req.originalUrl} on this server`));
});

// --- 4. Global Error Handling Middleware ---
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const status = err.status || 'error';

    // Send structured error response
    res.status(statusCode).json({
        status: status,
        message: err.message || 'Internal Server Error',
        // Optionally include stack trace in development mode only
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
});

app.get('/', (req, res) => {
  res.status(200).json({ status: "Online", message: "Kanban API is fully operational." });
});
module.exports = app;