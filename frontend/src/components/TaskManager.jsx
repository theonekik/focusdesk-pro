import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, Circle, Clock, AlertCircle } from 'lucide-react';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium', due_date: '' });
  const [filter, setFilter] = useState('all');

  const API_URL = 'http://localhost:5000/api/tasks';

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_URL}?status=${filter === 'completed' ? 'completed' : (filter === 'pending' ? 'pending' : '')}`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      const data = await response.json();
      setTasks([...tasks, data]);
      setNewTask({ title: '', description: '', priority: 'medium', due_date: '' });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const toggleTaskStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
    } catch (error) {
      console.error('Error toggling task status:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-50 dark:bg-red-900/30';
      case 'medium': return 'text-amber-500 bg-amber-50 dark:bg-amber-900/30';
      case 'low': return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30';
      default: return 'text-slate-500 bg-slate-50 dark:bg-slate-900/30';
    }
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && tasks.find(t => t.id === tasks[0]?.id)?.status !== 'completed';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="card-premium">
        <form onSubmit={addTask} className="flex flex-col gap-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="What needs to be done?"
              className="flex-1 p-3 rounded-premium border border-slate-200 dark:border-dark-700 bg-white dark:bg-dark-900 outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            <select
              className="p-3 rounded-premium border border-slate-200 dark:border-dark-700 bg-white dark:bg-dark-900 outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <button type="submit" className="bg-primary-500 text-white p-3 rounded-premium hover:bg-primary-600 transition-all flex items-center gap-2">
              <Plus size={20} /> Add
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Description (optional)"
              className="flex-1 p-3 rounded-premium border border-slate-200 dark:border-dark-700 bg-white dark:bg-dark-900 outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            <input
              type="date"
              className="p-3 rounded-premium border border-slate-200 dark:border-dark-700 bg-white dark:bg-dark-900 outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              value={newTask.due_date}
              onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
            />
          </div>
        </form>
      </div>

      <div className="flex gap-2 mb-6">
        {['all', 'pending', 'completed'].map(f => (
          <button
            key={f}
            onClick={() => { setFilter(f); fetchTasks(); }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === f ? 'bg-primary-500 text-white' : 'bg-white dark:bg-dark-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-dark-700'}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-12 text-slate-500">No tasks found. Time to relax! ☕</div>
        ) : (
          tasks.map(task => (
            <div key={task.id} className="card-premium flex items-center gap-4 group transition-all hover:shadow-lg">
              <div onClick={() => toggleTaskStatus(task.id, task.status)} className="cursor-pointer text-slate-400 hover:text-primary-500 transition-colors">
                {task.status === 'completed' ? <CheckCircle className="text-emerald-500" size={24} /> : <Circle size={24} />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`font-medium ${task.status === 'completed' ? 'line-through text-slate-400' : ''}`}>
                    {task.title}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {task.description}
                </div>
                <div className="flex gap-3 mt-2">
                  {task.due_date && (
                    <div className={`flex items-center gap-1 text-xs font-medium ${isOverdue(task.due_date) ? 'text-red-500' : 'text-slate-400'}`}>
                      <Clock size={14} /> {task.due_date}
                    </div>
                  )}
                  {isOverdue(task.due_date) && (
                    <div className="flex items-center gap-1 text-xs font-medium text-red-500">
                      <AlertCircle size={14} /> Overdue
                    </div>
                  )}
                </div>
              </div>
              <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 transition-all">
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskManager;
