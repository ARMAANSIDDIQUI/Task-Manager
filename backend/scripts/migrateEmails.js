const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const connectDB = require('../config/db');

const path = require('path');
// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const migrateEmails = async () => {
  try {
    await connectDB();

    const users = await User.find({});
    let updatedCount = 0;

    console.log(`Found ${users.length} users. Checking for case corrections...`);

    for (const user of users) {
      const originalEmail = user.email;
      const lowercasedEmail = originalEmail.toLowerCase();

      if (originalEmail !== lowercasedEmail) {
        console.log(`Updating: ${originalEmail} -> ${lowercasedEmail}`);
        
        // We use findOneAndUpdate to bypass the pre-save hook if we want, 
        // but here we actually want to ensure it's saved correctly.
        // However, if there's a collision (e.g. A@gmail.com and a@gmail.com both exist),
        // we should handle it.
        
        try {
          user.email = lowercasedEmail;
          await user.save();
          updatedCount++;
        } catch (saveErr) {
          console.error(`Failed to update ${originalEmail}: ${saveErr.message}`);
          if (saveErr.code === 11000) {
            console.error(`Conflict: ${lowercasedEmail} already exists!`);
          }
        }
      }
    }

    console.log(`Migration complete. Updated ${updatedCount} users.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

migrateEmails();
