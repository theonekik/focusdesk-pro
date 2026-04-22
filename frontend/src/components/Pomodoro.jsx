import React, { useState, useEffect, useRef } from 'react';
import { Timer, Play, Pause, RotateCcw, BarChart3, Award } from 'lucide-react';

const Pomodoro = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // focus, short, long
  const [sessions, setSessions] = useState(0);
  const [stats, setStats] = useState([]);
  const timerRef = useRef(null);

  const API_URL = 'http://localhost:5000/api/pomodoro';

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(0);
    setMinutes(mode === 'focus' ? 25 : mode === 'short' ? 5 : 15);
  };

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          handleTimerComplete();
        }
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, minutes, seconds]);

  const handleTimerComplete = async () => {
    setIsActive(false);
    const duration = mode === 'focus' ? 25 : mode === 'short' ? 5 : 15;

    try {
      await fetch(`${API_URL}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duration, type: mode }),
      });
      setSessions(prev => prev + 1);
      fetchStats();
    } catch (error) {
      console.error('Error logging session:', error);
    }

    alert(`${mode.charAt(0).toUpperCase() + mode.slice(1)} session completed!`);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    setSeconds(0);
    setMinutes(newMode === 'focus' ? 25 : newMode === 'short' ? 5 : 15);
  };

  const getModeColor = (m) => {
    switch (m) {
      case 'focus': return 'text-primary-600 dark:text-primary-400';
      case 'short': return 'text-emerald-600 dark:text-emerald-400';
      case 'long': return 'text-blue-600 dark:text-blue-400';
      default: return 'text-slate-600';
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="card-premium text-center space-y-6 py-12">
        <div className="flex justify-center gap-4 mb-8">
          {[
            { id: 'focus', label: 'Focus', min: 25 },
            { id: 'short', label: 'Short Break', min: 5 },
            { id: 'long', label: 'Long Break', min: 15 },
          ].map(m => (
            <button
              key={m.id}
              onClick={() => switchMode(m.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${mode === m.id ? 'bg-primary-500 text-white shadow-md' : 'bg-slate-100 dark:bg-dark-700 text-slate-500'}`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className={`text-8xl font-bold tabular-nums ${getModeColor(mode)} transition-colors duration-300`}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={toggleTimer}
            className={`p-4 rounded-full transition-all ${isActive ? 'bg-amber-500 text-white' : 'bg-primary-500 text-white'} shadow-lg hover:scale-105 active:scale-95`}
          >
            {isActive ? <Pause size={32} /> : <Play size={32} />}
          </button>
          <button
            onClick={resetTimer}
            className="p-4 rounded-full bg-slate-100 dark:bg-dark-700 text-slate-500 hover:bg-slate-200 dark:hover:bg-dark-600 transition-all"
          >
            <RotateCcw size={32} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-premium flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-lg">
              <Award size={24} />
            </div>
            <div>
              <div className="text-sm text-slate-500">Total Focus Sessions</div>
              <div className="text-2xl font-bold">{sessions}</div>
            </div>
          </div>
        </div>

        <div className="card-premium space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={20} className="text-primary-500" />
            <span className="font-semibold">Session Distribution</span>
          </div>
          <div className="space-y-2">
            {stats.length === 0 ? (
              <div className="text-sm text-slate-400">No session data available yet.</div>
            ) : (
              stats.map((s, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="capitalize">{s.type}</span>
                  <span className="font-medium">{s.total_duration} mins</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pomodoro;
