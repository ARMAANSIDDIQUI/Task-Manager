const mongoose = require('mongoose');

// We use this function to get our app talking to the MongoDB database
const connectDB = async () => {
  try {
    // Try to connect using the URI from our .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to MongoDB: ${conn.connection.host}`);
  } catch (error) {
    // If something goes wrong, we'll log the error and stop the server
    console.error(`Darn, connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
