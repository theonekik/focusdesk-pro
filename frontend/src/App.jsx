import React, { useState } from 'react';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import {
  LayoutDashboard,
  CheckSquare,
  Timer,
  FileText,
  Activity,
  Calendar,
  Wrench,
  Sun,
  Moon
} from 'lucide-react';
import TaskManager from './components/TaskManager';
import Pomodoro from './components/Pomodoro';
import Notes from './components/Notes';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-200 rounded-premium
      ${active ? 'bg-primary-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-dark-700'}`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </div>
);

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <ThemeProvider>
      <ThemeContext.Consumer>
        {({ theme, toggleTheme }) => (
          <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-dark-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
            {/* Sidebar */}
            <aside className="w-64 h-full bg-white dark:bg-dark-800 border-r border-slate-200 dark:border-dark-700 flex flex-col transition-colors duration-300">
              <div className="p-6 mb-4">
                <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400 flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white">F</div>
                  FocusDesk Pro
                </h1>
              </div>

              <nav className="flex-1 px-4 space-y-2">
                <SidebarItem
                  icon={LayoutDashboard}
                  label="Dashboard"
                  active={activeTab === 'dashboard'}
                  onClick={() => setActiveTab('dashboard')}
                />
                <SidebarItem
                  icon={CheckSquare}
                  label="Tasks"
                  active={activeTab === 'tasks'}
                  onClick={() => setActiveTab('tasks')}
                />
                <SidebarItem
                  icon={Timer}
                  label="Pomodoro"
                  active={activeTab === 'pomodoro'}
                  onClick={() => setActiveTab('pomodoro')}
                />
                <SidebarItem
                  icon={FileText}
                  label="Notes"
                  active={activeTab === 'notes'}
                  onClick={() => setActiveTab('notes')}
                />
                <SidebarItem
                  icon={Activity}
                  label="Habits"
                  active={activeTab === 'habits'}
                  onClick={() => setActiveTab('habits')}
                />
                <SidebarItem
                  icon={Calendar}
                  label="Planner"
                  active={activeTab === 'planner'}
                  onClick={() => setActiveTab('planner')}
                />
                <SidebarItem
                  icon={Wrench}
                  label="Utilities"
                  active={activeTab === 'utilities'}
                  onClick={() => setActiveTab('utilities')}
                />
              </nav>

              <div className="p-4 border-t border-slate-200 dark:border-dark-700">
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-3 px-4 py-3 w-full text-left transition-all duration-200 rounded-premium text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-dark-700"
                >
                  {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                  <span className="font-medium">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                </button>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 h-full overflow-y-auto p-8 transition-colors duration-300">
              <header className="mb-8 flex justify-between items-center">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </h2>
                <div className="text-sm text-slate-500 font-medium">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </header>

              <div className="transition-all duration-300">
                {activeTab === 'dashboard' && <div className="text-xl text-slate-600 dark:text-slate-400">Welcome to your FocusDesk Pro Dashboard. Modules will appear here soon!</div>}
                {activeTab === 'tasks' && <TaskManager />}
                {activeTab === 'pomodoro' && <Pomodoro />}
                {activeTab === 'notes' && <Notes />}
                {activeTab === 'habits' && <div className="text-xl text-slate-600 dark:text-slate-400">Habit Tracker is under construction...</div>}
                {activeTab === 'planner' && <div className="text-xl text-slate-600 dark:text-slate-400">Daily Planner is under construction...</div>}
                {activeTab === 'utilities' && <div className="text-xl text-slate-600 dark:text-slate-400">Utility Tools are under construction...</div>}
              </div>
            </main>
          </div>
        );
      })
    </ThemeProvider>
  );
};

export default App;
