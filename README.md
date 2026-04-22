# FocusDesk Pro

FocusDesk Pro is a professional, production-ready productivity suite designed to combine essential daily organization tools into one intuitive and modern interface.

## 🚀 Features

- **Smart Task Manager**: Full CRUD capabilities with priority levels, due dates, and overdue detection.
- **Pomodoro Focus System**: Customizable focus/break timers with session tracking and statistics.
- **Quick Notes Workspace**: Searchable, pinnable rich text notes with automatic persistence.
- **Habit Tracker**: Track daily habits with automated streak calculation and completion history.
- **Planner**: Hourly schedule planning with a visual time-grid interface.
- **Utility Tools**: Built-in calculator, unit converter, password generator, and quick paste clipboard.
- **Unified Dashboard**: A central hub providing a high-level overview of tasks, focus sessions, and habits.

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS, Lucide-React (Icons)
- **Backend**: Node.js, Express
- **Persistence**: SQLite (better-sqlite3)

## 📂 Project Structure

```
focusdesk-pro/
├── backend/
│   ├── db/               # Database configuration and schema
│   ├── routes/           # API endpoints for each module
│   └── index.js          # Express server entry point
├── frontend/
│   ├── src/
│   │   ├── components/    # Feature-specific UI modules
│   │   ├── context/       # Global state (Theme, etc.)
│   │   ├── hooks/         # Custom React hooks
│   │   └── utils/         # Helper functions
│   └── index.html
└── README.md
```

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v16+)
- npm

### Setup Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/focusdesk-pro.git
   cd focusdesk-pro
   ```

2. Setup Backend:
   ```bash
   cd backend
   npm install
   npm start
   ```

3. Setup Frontend:
   ```bash
   cd frontend
   npm install
 { la- la la }
   npm start
   ```

## 📈 Future Improvements
- User Authentication (JWT/OAuth)
- Cloud Synchronization
- Integration with Google Calendar/Apple Calendar
- Customizable Pomodoro Intervals
- Advanced Data Visualization for Habits

## 📄 License
Distributed under the MIT License. See `LICENSE` for more details.
