import React, { useState, useEffect } from 'react';
import { CheckCircle, Plus, Trash2, Calendar, Trophy } from 'lucide-react';

const HabitTracker = () => {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState({ name: '', frequency: 'daily' });

  const API_URL = 'http://localhost:5000/api/habits';

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setHabits(data);
    } catch (error) {
      console.error('Error fetching habits:', error);
    }
  };

  const addHabit = async (e) => {
    e.preventDefault();
    if (!newHabit.name.trim()) return;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newHabit),
      });
      const data = await response.json();
      setHabits([...habits, data]);
      setNewHabit({ name: '', frequency: 'daily' });
    } catch (error) {
      console.error('Error adding habit:', error);
    }
  };

  const toggleHabit = async (habit) => {
    const today = new Date().toISOString().split('T')[0];
    const isCompletedToday = habit.completedDates.includes(today);

    try {
      await fetch(`${API_URL}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ habit_id: habit.id, date: today }),
      });
      fetchHabits();
    } catch (error) {
      console.error('Error marking habit complete:', error);
    }
  };

  const deleteHabit = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setHabits(habits.filter(h => h.id !== id));
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="card-premium">
        <form onSubmit={addHabit} className="flex gap-4">
          <input
            type="text"
            placeholder="New habit (e.g., Meditate, Read 10 pages...)"
            className="flex-1 p-3 rounded-premium border border-slate-200 dark:border-dark-700 bg-white dark:bg-dark-900 outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            value={newHabit.name}
            onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
          />
          <select
            className="p-3 rounded-premium border border-slate-200 dark:border-dark-700 bg-white dark:bg-dark-900 outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            value={newHabit.frequency}
            onChange={(e) => setNewHabit({ ...newHabit, frequency: e.target.value })}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
          <button type="submit" className="bg-primary-500 text-white px-6 rounded-premium hover:bg-primary-600 transition-all flex items-center gap-2">
            <Plus size={20} /> Add
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {habits.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-500">No habits tracked yet. Start building a better you! 🚀</div>
        ) : (
          habits.map(habit => (
            <div key={habit.id} className="card-premium flex items-center justify-between group transition-all hover:shadow-lg">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleHabit(habit)}
                  className={`p-3 rounded-full transition-all ${habit.completedDates.includes(new Date().toISOString().split('T')[0]) ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-dark-700 text-slate-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'}`}
                >
                  <CheckCircle size={24} />
                </button>
                <div>
                  <div className="font-semibold text-lg">{habit.name}</div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Trophy size={14} className="text-amber-500" />
                    <span>Streak: {habit.streak} days</span>
                  </div>
                </div>
              </div>
              <button onClick={() => deleteHabit(habit.id)} className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 transition-all">
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HabitTracker;
