import React, { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, Calendar } from 'lucide-react';

const DailyPlanner = () => {
  const [blocks, setBlocks] = useState([]);
  const [newBlock, setNewBlock] = useState({ title: '', start_time: '', end_time: '', description: '' });

  const API_URL = 'http://localhost:5000/api/planner';

  useEffect(() => {
    fetchBlocks();
  }, []);

  const fetchBlocks = async () => {
    try {
      const response = await fetch(`${API_URL}/blocks`);
      const data = await response.json();
      setBlocks(data);
    } catch (error) {
      console.error('Error fetching blocks:', error);
    }
  };

  const addBlock = async (e) => {
    e.preventDefault();
    if (!newBlock.title || !newBlock.start_time || !newBlock.end_time) return;

    try {
      const response = await fetch(`${API_URL}/blocks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
C:\projects\aiworkspace\focusdesk-pro\backend\routes\planner.js_title: newBlock.title,
        startTime: newBlock.start_time,
        endTime: newBlock.end_time,
        description: newBlock.description
      }),
      });
      if (response.ok) {
        fetchBlocks();
        setNewBlock({ title: '', start_time: '', end_time: '', description: '' });
      }
    } catch (error) {
      console.error('Error adding block:', error);
    }
  };

  const deleteBlock = async (id) => {
    try {
      await fetch(`${API_URL}/blocks/${id}`, { method: 'DELETE' });
      fetchBlocks();
    } catch (error) {
      console.error('Error deleting block:', error);
    }
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="card-premium">
        <form onSubmit={addBlock} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-slate-500">Block Title</label>
            <input
              type="text"
              placeholder="e.g., Deep Work, Meeting..."
              className="w-full p-3 rounded-premium border border-slate-200 dark:border-dark-700 bg-white dark:bg-dark-900 outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              value={newBlock.title}
              onChange={(e) => setNewBlock({ ...newBlock, title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-500">Start Time</label>
            <input
              type="time"
              className="w-full p-3 rounded-premium border border-slate-200 dark:border-dark-700 bg-white dark:bg-dark-900 outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              value={newBlock.start_time}
              onChange={(e) => setNewBlock({ ...newBlock, start_time: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-500">End Time</label>
            <input
              type="time"
              className="w-full p-3 rounded-premium border border-slate-200 dark:border-dark-700 bg-white dark:bg-dark-900 outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              value={newBlock.end_time}
              onChange={(e) => setNewBlock({ ...newBlock, end_time: e.target.value })}
            />
          </div>
          <button type="submit" className="bg-primary-500 text-white p-3 rounded-premium hover:bg-primary-600 transition-all flex items-center justify-center gap-2">
            <Plus size={20} /> Add Block
          </button>
        </form>
      </div>

      <div className="relative border-l-2 border-slate-200 dark:border-dark-700 ml-12 space-y-0">
        {hours.map(hour => {
          const timeString = `${hour === 0 ? 12 : hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
          const blocksAtHour = blocks.filter(b => {
            const [h] = b.start_time.split(':');
            return parseInt(h) === hour;
          });

          return (
            <div key={hour} className="relative h-24 border-b border-slate-100 dark:border-dark-800 flex">
              <div className="absolute -left-14 top-0 w-12 text-right text-xs font-medium text-slate-400">
                {timeString}
              </div>
              <div className="flex-1 relative">
                {blocksAtHour.map(block => (
                  <div
                    key={block.id}
                    className="absolute left-2 right-2 p-2 rounded-premium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 border border-primary-200 dark:border-primary-800 shadow-sm flex justify-between items-center"
                    style={{ top: '4px', height: 'calc(100% - 8px)' }}
                  >
                    <span className="font-medium truncate">{block.title}</span>
                    <button onClick={() => deleteBlock(block.id)} className="p-1 text-slate-400 hover:text-red-500 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DailyPlanner;
