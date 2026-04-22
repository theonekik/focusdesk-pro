import React, { useState, useEffect } from 'react';
import { FileText, Search, Pin, Trash2, Plus } from 'lucide-react';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const API_URL = 'http://localhost:5000/api/notes';

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async (query = '') => {
    try {
      const response = await fetch(`${API_URL}?search=${query}`);
      const data = await response.json();
      setNotes(data);
      if (activeNote && !data.find(n => n.id === activeNote.id)) {
        setActiveNote(null);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const createNote = async () => {
    const newNote = { title: 'Untitled Note', content: '', is_pinned: 0 };
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNote),
      });
      const data = await response.json();
      setNotes([...notes, data]);
      setActiveNote(data);
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const saveNote = async (note) => {
    setIsSaving(true);
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(note),
      });
      setNotes(notes.map(n => n.id === note.id ? note : n));
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteNote = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setNotes(notes.filter(n => n.id !== id));
      if (activeNote?.id === id) setActiveNote(null);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const togglePin = async (note) => {
    const updatedNote = { ...note, is_pinned: note.is_pinned === 1 ? 0 : 1 };
    await saveNote(updatedNote);
  };

  return (
    <div className="flex h-full gap-6">
      <div className="w-80 space-y-6">
        <div className="card-premium space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search notes..."
                className="w-full pl-10 p-2 rounded-premium border border-slate-200 dark:border-dark-700 bg-white dark:bg-dark-900 outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  fetchNotes(e.target.value);
                }}
              />
            </div>
            <button onClick={createNote} className="p-2 bg-primary-500 text-white rounded-premium hover:bg-primary-600 transition-all">
              <Plus size={20} />
            </button>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-300px)]">
            {notes.sort((a, b) => b.is_pinned - a.is_pinned || new Date(b.updated_at) - new Date(a.updated_at))
              .map(note => (
                <div
                  key={note.id}
                  onClick={() => setActiveNote(note)}
                  className={`p-3 rounded-premium cursor-pointer transition-all group flex items-center justify-between ${activeNote?.id === note.id ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600' : 'hover:bg-slate-100 dark:hover:bg-dark-700'}`}
                >
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate block">{note.title}</span>
                      {note.is_pinned && <Pin size={12} className="text-primary-500 shrink-0" />}
                    </div>
                    <div className="text-xs text-slate-500 truncate">{note.content.slice(0, 40)}</div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }} className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="flex-1">
        {activeNote ? (
          <div className="card-premium h-full flex flex-col gap-4">
            <div className="flex justify-between items-center mb-4">
              <input
                type="text"
                className="text-2xl font-bold bg-transparent outline-none w-full mr-4"
                value={activeNote.title}
                onChange={(e) => {
                  const updated = { ...activeNote, title: e.target.value };
                  setActiveNote(updated);
                  saveNote(updated);
                }}
              />
              <button onClick={() => togglePin(activeNote)} className={`p-2 rounded-premium transition-all ${activeNote.is_pinned ? 'text-primary-500 bg-primary-50 dark:bg-primary-900/30' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-700'}`}>
                <Pin size={20} />
              </button>
            </div>
            <textarea
              className="flex-1 w-full p-4 rounded-premium border border-slate-200 dark:border-dark-700 bg-white dark:bg-dark-900 outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none"
              value={activeNote.content}
              onChange={(e) => {
                const updated = { ...activeNote, content: e.target.value };
                setActiveNote(updated);
                saveNote(updated);
              }}
              placeholder="Start typing your thoughts..."
            />
            <div className="flex justify-between items-center mt-4">
              <div className="text-xs text-slate-500">
                {isSaving ? 'Saving...' : 'All changes saved'}
              </div>
            </div>
          </div>
        ) : (
          <div className="card-premium h-full flex items-center justify-center text-slate-500 text-center">
            <div className="flex flex-col items-center gap-4">
              <FileText size={64} className="opacity-20" />
              <p>Select a note to view or create a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
