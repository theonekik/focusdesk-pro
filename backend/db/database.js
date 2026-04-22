const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'db/focusdesk.db'), { verbose: console.log });

// Initialize Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT DEFAULT 'medium',
    due_date TEXT,
    status TEXT DEFAULT 'pending',
    is_recurring INTEGER DEFAULT 0,
    recurrence_interval TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT,
    is_pinned INTEGER DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS habits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    frequency TEXT DEFAULT 'daily',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS habit_logs (
    habit_id INTEGER,
    completed_date TEXT,
    PRIMARY KEY (habit_id, completed_date),
    FOREIGN KEY (habit_id REFERENCES habits(id))
  );

  CREATE TABLE IF NOT EXISTS focus_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    duration INTEGER,
    type TEXT,
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

module.exports = db;
