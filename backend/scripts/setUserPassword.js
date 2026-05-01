const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const connectDB = require('../config/db');

const path = require('path');
// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const setUserPassword = async () => {
  try {
    await connectDB();

    const email = 'a@gmail.com'; // Lowercased as per new policy
    const newPassword = '123456';

    const user = await User.findOne({ email });

    if (!user) {
      console.log(`User with email ${email} not found.`);
      process.exit(1);
    }

    user.password = newPassword;
    await user.save();

    console.log(`Successfully updated password for ${email}`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

setUserPassword();
