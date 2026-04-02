import { useState, useEffect } from 'react';
import {
  Calendar,
  Plus,
  Save,
  Trash2,
  GripVertical,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { TimelineEvent } from '../../types';
import { timelineEvents as defaultTimeline } from '../../data/candidates';

const statusOptions: { label: string; value: TimelineEvent['status']; color: string }[] = [
  { label: 'Completed', value: 'completed', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  { label: 'Active', value: 'active', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  { label: 'Upcoming', value: 'upcoming', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
];

const iconOptions = ['📝', '🔒', '📢', '🎤', '⏸️', '🗳️', '🏆', '📅', '🎯', '⚡', '🔔', '🎊', '📋', '🤝'];

export default function AdminTimeline() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editEvent, setEditEvent] = useState<TimelineEvent | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('mathclub-timeline');
    if (stored) {
      setEvents(JSON.parse(stored));
    } else {
      setEvents(defaultTimeline);
      localStorage.setItem('mathclub-timeline', JSON.stringify(defaultTimeline));
    }
  }, []);

  const saveEvents = (updated: TimelineEvent[]) => {
    setEvents(updated);
    localStorage.setItem('mathclub-timeline', JSON.stringify(updated));
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setEditEvent({ ...events[index] });
    setIsCreating(false);
  };

  const handleCreate = () => {
    setEditEvent({ date: '', title: '', description: '', status: 'upcoming', icon: '📅' });
    setEditIndex(null);
    setIsCreating(true);
  };

  const handleSave = () => {
    if (!editEvent || !editEvent.title.trim() || !editEvent.date.trim()) {
      showToast('Date and title are required!', 'error');
      return;
    }

    let updated: TimelineEvent[];
    if (isCreating) {
      updated = [...events, editEvent];
      showToast('Event added successfully!');
    } else if (editIndex !== null) {
      updated = events.map((e, i) => (i === editIndex ? editEvent : e));
      showToast('Event updated!');
    } else {
      return;
    }

    saveEvents(updated);
    setEditEvent(null);
    setEditIndex(null);
    setIsCreating(false);
  };

  const handleDelete = (index: number) => {
    const updated = events.filter((_, i) => i !== index);
    saveEvents(updated);
    showToast('Event removed.', 'error');
  };

  const moveEvent = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= events.length) return;
    const updated = [...events];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    saveEvents(updated);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium shadow-xl ${
            toast.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2" style={{ fontFamily: 'Space Grotesk' }}>
            <Calendar className="w-6 h-6 text-emerald-400" />
            Manage Timeline
          </h1>
          <p className="text-slate-400 text-sm mt-1">{events.length} events configured</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      {/* Edit Form */}
      {editEvent && (
        <div className="rounded-2xl bg-white/5 border border-indigo-500/20 p-6 space-y-4">
          <h3 className="text-white font-bold">
            {isCreating ? 'New Event' : 'Edit Event'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">Date *</label>
              <input
                type="text"
                value={editEvent.date}
                onChange={(e) => setEditEvent({ ...editEvent, date: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all"
                placeholder="e.g. Feb 15, 2026"
              />
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">Title *</label>
              <input
                type="text"
                value={editEvent.title}
                onChange={(e) => setEditEvent({ ...editEvent, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all"
                placeholder="Event title"
              />
            </div>
          </div>
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">Description</label>
            <textarea
              value={editEvent.description}
              onChange={(e) => setEditEvent({ ...editEvent, description: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all resize-none"
              placeholder="What happens at this event?"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">Status</label>
              <div className="flex gap-2">
                {statusOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setEditEvent({ ...editEvent, status: opt.value })}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                      editEvent.status === opt.value
                        ? opt.color + ' border-current'
                        : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">Icon</label>
              <div className="flex flex-wrap gap-2">
                {iconOptions.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setEditEvent({ ...editEvent, icon })}
                    className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all ${
                      editEvent.icon === icon
                        ? 'bg-indigo-500/20 border-2 border-indigo-500 scale-110'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => { setEditEvent(null); setEditIndex(null); setIsCreating(false); }}
              className="px-4 py-2 rounded-xl text-slate-400 text-sm hover:text-white hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>
      )}

      {/* Events List */}
      <div className="space-y-2">
        {events.map((event, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group"
          >
            <div className="flex flex-col gap-0.5">
              <button
                onClick={() => moveEvent(index, 'up')}
                className="p-1 text-slate-600 hover:text-slate-300 transition-colors"
                disabled={index === 0}
              >
                <GripVertical className="w-4 h-4 rotate-180" />
              </button>
              <button
                onClick={() => moveEvent(index, 'down')}
                className="p-1 text-slate-600 hover:text-slate-300 transition-colors"
                disabled={index === events.length - 1}
              >
                <GripVertical className="w-4 h-4" />
              </button>
            </div>

            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-xl flex-shrink-0">
              {event.icon}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-white font-medium text-sm">{event.title}</h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                    event.status === 'completed'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : event.status === 'active'
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                  }`}
                >
                  {event.status}
                </span>
              </div>
              <p className="text-slate-500 text-xs mt-0.5">{event.date} — {event.description}</p>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleEdit(index)}
                className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-all"
              >
                <Save className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(index)}
                className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
