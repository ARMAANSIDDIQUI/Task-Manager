const Project = require('../models/Project');
const User = require('../models/User');

// Get all projects the user is involved in
exports.getProjects = async (req, res) => {
  try {
    let query;
    // Admins see everything, Members only see their own projects
    if (req.user.role === 'Admin') {
      query = Project.find().populate('admin members', 'name email');
    } else {
      query = Project.find({
        $or: [{ admin: req.user.id }, { members: req.user.id }],
      }).populate('admin members', 'name email');
    }

    const projects = await query;
    res.status(200).json({ success: true, data: projects });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Oops, couldn\'t fetch projects' });
  }
};

// Create a new project (Admins only)
exports.createProject = async (req, res) => {
  try {
    // Attach the current user as the project admin
    req.body.admin = req.user.id;
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Failed to create project' });
  }
};

// Update project details (Admins only)
exports.updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Double check that the user is actually the admin of this project
    if (project.admin.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(401).json({ success: false, message: 'Not allowed to edit this' });
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: project });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Update failed' });
  }
};

// Delete a project (Admins only)
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Only the admin of the project can delete it
    if (project.admin.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(401).json({ success: false, message: 'Not allowed to delete this' });
    }

    await project.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Delete failed' });
  }
};
