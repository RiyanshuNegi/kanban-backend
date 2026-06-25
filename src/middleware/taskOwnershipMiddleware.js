const Task = require('../models/Task.js');
const ApiError = require('../utils/ApiError.js');

const checkTaskOwnership = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return next(new ApiError(404, 'Task not found'));
    }

    // Managers bypass ownership checks
    if (req.user.role === 'manager') {
      req.task = task; // Attach task to avoid querying DB again in controller
      return next();
    }

    // For regular users, verify assignment
    if (task.assignedTo && task.assignedTo.toString() !== req.user.id) {
      return next(new ApiError(403, 'You can only modify tasks assigned to you'));
    }

    req.task = task;
    next();
  } catch (error) {
    next(new ApiError(500, 'Error verifying task ownership'));
  }
};

module.exports = checkTaskOwnership;