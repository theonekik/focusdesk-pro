const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Create task
router.post('/', (req, res) => {
  const { title, description, priority, due_date, is_recurring, recurrence_interval } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  const stmt = db.prepare(`
    INSERT INTO tasks (title, description, priority, due_date, is_recurring, recurrence_interval)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  try {
    const info = stmt.run(title, description || null, priority || 'medium', due_date || null, is_recurring ? 1 : 0, recurrence_interval || null);
    res.json({ id: info.lastInsertRowid, title });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all tasks
router.get('/', (req, res) => {
  const { status, priority } = req.query;
  let query = 'SELECT * FROM tasks';
  const params = [];

  if (status) {
    query += ' WHERE status = ?';
    params.push(status);
  } else if (priority) {
    query += ' WHERE priority = ?';
    params.push(priority);
  }

  try {
    const tasks = db.prepare(query).all(...params);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update task
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, priority, due_date, status, is_recurring, recurrence_interval } = req.body;

  const stmt = db.prepare(`
    UPDATE tasks
    SET title = ?, description = ?, priority = ?, due_date = ?, status = ?, is_recurring = ?, recurrence_interval = ?
    WHERE id = ?
  `);

  try {
    stmt.run(title, description, priority, status, is_recurring ? 1 : 0, recurrence_interval, id);
    res.json({ message: 'Task updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete task
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
