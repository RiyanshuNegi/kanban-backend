const express = require('express');
const taskController = require('../controllers/taskController.js');
const protect = require('../middleware/authMiddleware.js');
const restrictTo = require('../middleware/roleMiddleware.js');
const checkTaskOwnership = require('../middleware/taskOwnershipMiddleware.js');
const validate = require('../middleware/validateMiddleware.js');
const { createTaskRules, updateTaskRules } = require('../validators/taskValidator.js');

const router = express.Router();

// 1. All routes below require a valid JWT token
router.use(protect);

// 2. Base Routes (/api/tasks)
router.route('/')
  .get(taskController.getAllTasks) // Any authenticated user can view the board
  .post(
    restrictTo('manager'), // Only managers can create
    createTaskRules, 
    validate, 
    taskController.createTask
  );

// 3. Specific ID Routes (/api/tasks/:id)
router.route('/:id')
  .put(
    checkTaskOwnership, // Checks if user owns it OR is a manager
    updateTaskRules, 
    validate, 
    taskController.updateTask
  )
  .delete(
    restrictTo('manager'), // Only managers can delete
    taskController.deleteTask
  );

// 4. Status Update Route (/api/tasks/:id/status)
router.patch(
  '/:id/status',
  checkTaskOwnership,
  updateTaskRules, // We can reuse the update validation rules here
  validate,
  taskController.updateTask // We can reuse the update controller method here
);

module.exports = router;