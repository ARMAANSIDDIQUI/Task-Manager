const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

const path = require('path');

// Load environment variables from the backend root
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedAdmin = async () => {
  try {
    // Connect to the database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB for seeding...');

    const email = 'armaansiddiqui.pms@gmail.com';
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log('User already exists. Updating role to Admin...');
      existingUser.role = 'Admin';
      await existingUser.save();
      console.log('User updated to Admin successfully!');
    } else {
      console.log('Creating new Admin user...');
      await User.create({
        name: 'Armaan Siddiqui',
        email: email,
        password: 'admin123', // You should change this later!
        role: 'Admin'
      });
      console.log('Admin user created successfully! (Password: admin123)');
    }

    process.exit();
  } catch (err) {
    console.error('Error seeding admin:', err.message);
    process.exit(1);
  }
};

seedAdmin();
