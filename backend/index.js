require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db/database');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const taskRoutes = require('./routes/tasks');
const pomodoroRoutes = require('./routes/pomodoro');
const notesRoutes = require('./routes/notes');
app.use('/api/tasks', taskRoutes);
app.use('/api/pomodoro', pomodoroRoutes);
app.use('/api/notes', notesRoutes);

// Health check

// Health check

// Health check

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Basic Database check
app.get('/api/db-status', (req, res) => {
  try {
    const result = db.prepare('SELECT 1').get();
    res.json({ connected: !!result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Middleware for error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`FocusDesk Pro Backend running on port ${PORT}`);
});
