const { body } = require('express-validator');

const createTaskRules = [
  body('title').trim().notEmpty().withMessage('Task title is required'),
  body('description').optional().trim(),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority level'),
  body('status').optional().isIn(['todo', 'in_progress', 'done']).withMessage('Invalid status'),
  body('assignedTo').optional().isMongoId().withMessage('Invalid user ID format')
];

const updateTaskRules = [
  body('status').optional().isIn(['todo', 'in_progress', 'done']).withMessage('Invalid status'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority level')
];

module.exports = { createTaskRules, updateTaskRules };