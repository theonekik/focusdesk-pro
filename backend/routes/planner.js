const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Get planner schedule (blocks)
router.get('/schedule', (req, res) => {
  try {
    // In this version, we integrate directly with tasks that have due dates or specific time slots
    const tasks = db.prepare('SELECT * FROM tasks WHERE due_date IS NOT NULL').all();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create/Update schedule block
router.post('/blocks', (req, res) => {
  const { title, startTime, endTime, description } = req.body;
  // For the sake of a focused implementation, we'll use a dedicated table for planner blocks
  // Let's ensure the table exists first (should be in database.js, but we can run it here for safety)
  db.exec(`CREATE TABLE IF NOT EXISTS planner_blocks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    start_time TEXT,
    end_time TEXT,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  const stmt = db.prepare('INSERT INTO planner_blocks (title, start_time, end_time, description) VALUES (?, ?, ?, ?)');
  try {
    const info = stmt.run(title, startTime, endTime, description);
    res.json({ id: info.lastInsertRowid, title });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/blocks', (req, res) => {
  try {
    const blocks = db.prepare('SELECT * FROM planner_blocks').all();
    res.json(blocks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/blocks/:id', (req, res) => {
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM planner_blocks WHERE id = ?').run(id);
    res.json({ message: 'Block deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
