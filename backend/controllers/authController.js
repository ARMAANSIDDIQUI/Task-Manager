const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Handle new user registrations
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Create a new user in the database
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    // Send back the token so they're logged in immediately
    sendTokenResponse(user, 201, res);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Check credentials and log the user in
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Simple validation: make sure both fields are there
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password' });
    }

    // Look for the user and include the password field (which is hidden by default)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Wait, those credentials don\'t look right' });
    }

    // Compare the password they typed with the hashed one in DB
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Wait, those credentials don\'t look right' });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Just fetch the current user's details
exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ 
    success: true, 
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};

// Search for users by email (for adding team members)
exports.searchUsers = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(200).json({ success: true, data: [] });
    }

    const users = await User.find({
      email: { $regex: email, $options: 'i' },
    }).limit(5).select('name email');

    res.status(200).json({ success: true, data: users });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// This little helper signs a JWT token and sends it back to the client
const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};
