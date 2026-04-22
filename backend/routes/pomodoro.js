const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Log focus session
router.post('/sessions', (req, res) => {
  const { duration, type } = req.body;
  if (!duration || !type) return res.status(400).json({ error: 'Duration and type are required' });

  const stmt = db.prepare(`
    INSERT INTO focus_sessions (duration, type)
    VALUES (?, ?)
  `);

  try {
    const info = stmt.run(duration, type);
    res.json({ id: info.lastInsertRowid, duration, type });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get focus statistics
router.get('/stats', (req, res) => {
  try {
    const stats = db.prepare(`
      SELECT
        type,
        SUM(duration) as total_duration,
        COUNT(*) as session_count
      FROM focus_sessions
      GROUP BY type
    `).all();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
