const Task = require('../models/Task');
const Project = require('../models/Project');

// Get all tasks for a project
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignedTo createdBy', 'name email')
      .sort('-createdAt');
    res.status(200).json({ success: true, data: tasks });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Create task
exports.createTask = async (req, res) => {
  try {
    // RBAC: Only Admins can create tasks
    if (req.user.role !== 'Admin') {
      return res.status(401).json({ success: false, message: 'Only Admins can create tasks' });
    }

    req.body.project = req.params.projectId;
    req.body.createdBy = req.user.id;

    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const task = await Task.create(req.body);
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // RBAC: Members can only update tasks assigned to them
    const isAssigned = task.assignedTo.some(id => id.toString() === req.user.id);
    if (req.user.role !== 'Admin' && !isAssigned) {
      return res.status(401).json({ success: false, message: 'You can only update tasks assigned to you' });
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: task });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // RBAC: Members can only delete tasks assigned to them
    const isAssigned = task.assignedTo.some(id => id.toString() === req.user.id);
    if (req.user.role !== 'Admin' && !isAssigned) {
      return res.status(401).json({ success: false, message: 'You can only delete tasks assigned to you' });
    }

    await task.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Get Dashboard Stats
exports.getStats = async (req, res) => {
    try {
        const userId = req.user.id;
        let query = {};
        let projectQuery = {};

        if(req.user.role !== 'Admin') {
            query = { assignedTo: userId };
            projectQuery = { members: userId };
        }

        const totalTasks = await Task.countDocuments(query);
        const todoTasks = await Task.countDocuments({ ...query, status: 'Todo' });
        const inProgressTasks = await Task.countDocuments({ ...query, status: 'In Progress' });
        const completedTasks = await Task.countDocuments({ ...query, status: 'Completed' });
        const totalProjects = await Project.countDocuments(projectQuery);
        
        const overdueTasks = await Task.countDocuments({
            ...query,
            status: { $ne: 'Completed' },
            dueDate: { $lt: new Date() }
        });

        res.status(200).json({
            success: true,
            data: {
                totalTasks,
                todoTasks,
                inProgressTasks,
                completedTasks,
                overdueTasks,
                totalProjects
            }
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}
