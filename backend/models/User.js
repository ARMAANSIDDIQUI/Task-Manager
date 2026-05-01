const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// This defines how we store user info in our database
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'We need a name for the user'],
  },
  email: {
    type: String,
    required: [true, 'Email is mandatory'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please use a real email address',
    ],
  },
  password: {
    type: String,
    required: [true, 'Every account needs a password'],
    minlength: 6,
    select: false, // This keeps the password hidden when we fetch users unless we ask for it
  },
  role: {
    type: String,
    enum: ['Member', 'Admin'],
    default: 'Member',
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
});

// Before we save a user, we'll hash their password if it's new or changed
userSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// This little helper checks if the password they typed matches our hashed version
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
