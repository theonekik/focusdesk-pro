const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Create or update note
router.post('/', (req, res) => {
  const { id, title, content, is_pinned } = req.body;

  if (id) {
    // Update existing note
    const stmt = db.prepare('UPDATE notes SET title = ?, content = ?, is_pinned = ? WHERE id = ?');
    try {
      stmt.run(title || 'Untitled Note', content || '', is_pinned ? 1 : 0, id);
      res.json({ message: 'Note updated' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    // Create new note
    const stmt = db.prepare('INSERT INTO notes (title, content, is_pinned) VALUES (?, ?, ?)');
    try {
      const info = stmt.run(title || 'Untitled Note', content || '', is_pinned ? 1 : 0);
      res.json({ id: info.lastInsertRowid, title, content });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
});

// Get all notes
router.get('/', (req, res) => {
  const { search } = req.query;
  let query = 'SELECT * FROM notes';
  const params = [];

  if (search) {
    query += ' WHERE title LIKE ? OR content LIKE ?';
    params.push(`%${search}%`, `%${search}%`);
  }

  try {
    const notes = db.prepare(query).all(...params);
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete note
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM notes WHERE id = ?').run(id);
    res.json({ message: 'Note deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
