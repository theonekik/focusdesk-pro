const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Create habit
router.post('/', (req, res) => {
  const { name, frequency } = req.body;
  if (!name) return res.status(400).json({ error: 'Habit name is required' });

  const stmt = db.prepare('INSERT INTO habits (name, frequency) VALUES (?, ?)');
  try {
    const info = stmt.run(name, frequency || 'daily');
    res.json({ id: info.lastInsertRowid, name, frequency: frequency || 'daily' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all habits and their completion history
router.get('/', (req, res) => {
  try {
    const habits = db.prepare('SELECT * FROM habits').all();
    const results = habits.map(habit => {
      const logs = db.prepare('SELECT completed_date FROM habit_logs WHERE habit_id = ?').all(habit.id);
      const completedDates = logs.map(l => l.completed_date);

      // Calculate streak
      let streak = 0;
      const today = new Date();
      let checkDate = new Date(today);
      checkDate.setHours(0,0,0,0);

      // Sort logs descending to check streak
      const sortedLogs = [...completedDates].sort((a, b) => new Date(b) - new Date(a));

      for (const date of sortedLogs) {
        const logDate = new Date(date);
        logDate.setHours(0,0,0,0);
        if (logDate.getTime() === checkDate.getTime()) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }

      return { ...habit, streak, completedDates };
    });
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark habit completed for today
router.post('/complete', (req, res) => {
  const { habit_id, date } = req.body;
  if (!habit_id) return res.status(400).json({ error: 'Habit ID is required' });

  const today = date || new Date().toISOString().split('T')[0];
  const stmt = db.prepare('INSERT OR IGNORE INTO habit_logs (habit_id, completed_date) VALUES (?, ?)');
  try {
    stmt.run(habit_id, today);
    res.json({ message: 'Habit marked completed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete habit
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM habits WHERE id = ?').run(id);
    db.prepare('DELETE FROM habit_logs WHERE habit_id = ?').run(id);
    res.json({ message: 'Habit deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
