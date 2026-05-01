const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

const path = require('path');
const auth = require('./routes/authRoutes');
const projects = require('./routes/projectRoutes');
const tasks = require('./routes/taskRoutes');

// Mount routers
app.use('/api/auth', auth);
app.use('/api/projects', projects);
app.use('/api/tasks', tasks); 
app.use('/api/projects/:projectId/tasks', tasks);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../', 'frontend', 'dist', 'index.html'))
  );
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
