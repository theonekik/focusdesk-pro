import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, Trophy, FileText, Timer } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    tasks: 0,
    pomodoroSessions: 0,
    habitsCompleted: 0,
    recentNotes: []
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [tasksRes, pomodoroRes, habitsRes, notesRes] = await Promise.all([
          fetch('http://localhost:5000/api/tasks'),
          fetch('http://localhost:5000/api/pomodoro/stats'),
          fetch('http://localhost:5000/api/habits'),
          fetch('http://localhost:5000/api/notes')
        ]);

        const tasks = await tasksRes.json();
        const pomodoroStats = await pomodoroRes.json();
        const habits = await habitsRes.json();
        const notes = await notesRes.json();

        setStats({
          tasks: tasks.filter(t => t.status === 'pending').length,
          pomodoroSessions: pomodoroStats.reduce((acc, curr) => acc + curr.session_count, 0),
          habitsCompleted: habits.filter(h => h.completedDates.includes(new Date().toISOString().split('T')[0])).length,
          recentNotes: notes.slice(0, 3)
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchAllData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Summary Cards */}
      <div className="card-premium flex items-center gap-4">
        <div className="p-3 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-lg">
          <CheckCircle size={24} />
        </div>
        <div>
          <div className="text-sm text-slate-500">Pending Tasks</div>
          <div className="text-2xl font-bold">{stats.tasks}</div>
        </div>
      </div>

      <div className="card-premium flex items-center gap-4">
        <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-lg">
          <Timer size={24} />
        </div>
        <div>
          <div className="text-sm text-slate-500">Focus Sessions</div>
          <div className="text-2xl font-bold">{stats.pomodoroSessions}</div>
        </div>
      </div>

      <div className="card-premium flex items-center gap-4">
        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-lg">
          <Trophy size={24} />
        </div>
        <div>
          <div className="text-sm text-slate-500">Habits Today</div>
          <div className="text-2xl font-bold">{stats.habitsCompleted}</div>
        </div>
      </div>

      {/* Detailed Sections */}
      <div className="card-premium md:col-span-2 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={20} className="text-primary-500" />
          <span className="font-semibold">Focus Overview</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-dark-700 rounded-premium text-center">
            <div className="text-sm text-slate-500 mb-1">Current Status</div>
            <div className="font-medium">Ready for next session</div>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-dark-700 rounded-premium text-center">
            <div className="text-sm text-slate-500 mb-1">Daily Goal</div>
            <div className="font-medium">4 Pomodoros</div>
          </div>
        </div>
      </div>

      <div className="card-premium space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <FileText size={20} className="text-primary-500" />
          <span className="font-semibold">Recent Notes</span>
        </div>
        <div className="space-y-2">
          {stats.recentNotes.length === 0 ? (
            <div className="text-sm text-slate-400">No notes yet.</div>
          ) : (
            stats.recentNotes.map(note => (
              <div key={note.id} className="p-2 bg-slate-50 dark:bg-dark-700 rounded-lg text-sm truncate cursor-pointer hover:bg-slate-100 dark:hover:bg-dark-600 transition-all">
                {note.title}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
