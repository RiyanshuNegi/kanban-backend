const Task = require('../models/Task.js');
const ApiError = require('../utils/ApiError');

exports.createTask = async (req, res, next) => {
  try {
    const task = await Task.create({
      ...req.body,
      createdBy: req.user.id // Taken securely from the token, not the body
    });

    res.status(201).json({ status: 'success', data: { task } });
  } catch (error) {
    next(error);
  }
};

exports.getAllTasks = async (req, res, next) => {
  try {
    let query = {};

    // Check if there is a search query in the URL (e.g., ?search=UI)
    if (req.query.search) {
      const keyword = req.query.search;
      query = {
        $or: [
          { title: { $regex: keyword, $options: 'i' } }, // 'i' makes it case-insensitive
          { description: { $regex: keyword, $options: 'i' } }
        ]
      };
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 }); // Sorts newest tasks first

    res.status(200).json({ status: 'success', results: tasks.length, data: { tasks } });
  } catch (error) {
    next(error);
  }
};
exports.updateTask = async (req, res, next) => {
  try {
    // We use req.task from the ownership middleware so we don't query the DB twice
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('assignedTo', 'name');

    res.status(200).json({ status: 'success', data: { task: updatedTask } });
  } catch (error) {
    next(error);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    
    if (!task) return next(new ApiError(404, 'Task not found'));

    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    next(error);
  }
};