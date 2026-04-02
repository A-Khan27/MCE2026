import { useState, useEffect } from 'react';
import {
  BarChart3,
  Plus,
  Save,
  Trash2,
  X,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Poll } from '../../types';
import { defaultPolls } from '../../data/candidates';

export default function AdminPolls() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [editPoll, setEditPoll] = useState<Poll | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('mathclub-polls');
    if (stored) {
      setPolls(JSON.parse(stored));
    } else {
      setPolls(defaultPolls);
      localStorage.setItem('mathclub-polls', JSON.stringify(defaultPolls));
    }
  }, []);

  const savePolls = (updated: Poll[]) => {
    setPolls(updated);
    localStorage.setItem('mathclub-polls', JSON.stringify(updated));
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreate = () => {
    setEditPoll({
      id: 'poll-' + Date.now(),
      question: '',
      options: [
        { id: 'opt-1', label: '', votes: 0 },
        { id: 'opt-2', label: '', votes: 0 },
      ],
      totalVotes: 0,
    });
    setIsCreating(true);
  };

  const handleEdit = (poll: Poll) => {
    setEditPoll({ ...poll, options: poll.options.map((o) => ({ ...o })) });
    setIsCreating(false);
  };

  const handleSave = () => {
    if (!editPoll || !editPoll.question.trim()) {
      showToast('Question is required!', 'error');
      return;
    }
    const validOptions = editPoll.options.filter((o) => o.label.trim());
    if (validOptions.length < 2) {
      showToast('At least 2 options required!', 'error');
      return;
    }

    const poll = { ...editPoll, options: validOptions };

    let updated: Poll[];
    if (isCreating) {
      updated = [...polls, poll];
      showToast('Poll created!');
    } else {
      updated = polls.map((p) => (p.id === poll.id ? poll : p));
      showToast('Poll updated!');
    }

    savePolls(updated);
    setEditPoll(null);
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    savePolls(polls.filter((p) => p.id !== id));
    showToast('Poll deleted.', 'error');
  };

  const handleResetVotes = (id: string) => {
    const updated = polls.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          options: p.options.map((o) => ({ ...o, votes: 0 })),
          totalVotes: 0,
        };
      }
      return p;
    });
    savePolls(updated);
    localStorage.removeItem('mathclub-poll-votes');
    showToast('Votes reset successfully!');
  };

  const addOption = () => {
    if (!editPoll) return;
    setEditPoll({
      ...editPoll,
      options: [
        ...editPoll.options,
        { id: 'opt-' + Date.now(), label: '', votes: 0 },
      ],
    });
  };

  const removeOption = (index: number) => {
    if (!editPoll || editPoll.options.length <= 2) return;
    setEditPoll({
      ...editPoll,
      options: editPoll.options.filter((_, i) => i !== index),
    });
  };

  const updateOption = (index: number, label: string) => {
    if (!editPoll) return;
    const options = editPoll.options.map((o, i) =>
      i === index ? { ...o, label } : o
    );
    setEditPoll({ ...editPoll, options });
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
            <BarChart3 className="w-6 h-6 text-orange-400" />
            Manage Polls
          </h1>
          <p className="text-slate-400 text-sm mt-1">{polls.length} active polls</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium hover:bg-orange-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          Create Poll
        </button>
      </div>

      {/* Edit Form */}
      {editPoll && (
        <div className="rounded-2xl bg-white/5 border border-indigo-500/20 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-bold">
              {isCreating ? 'New Poll' : 'Edit Poll'}
            </h3>
            <button
              onClick={() => { setEditPoll(null); setIsCreating(false); }}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">Question *</label>
            <input
              type="text"
              value={editPoll.question}
              onChange={(e) => setEditPoll({ ...editPoll, question: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all"
              placeholder="What would you like to ask?"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">
              Options ({editPoll.options.length})
            </label>
            <div className="space-y-2">
              {editPoll.options.map((opt, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={opt.label}
                    onChange={(e) => updateOption(i, e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all text-sm"
                    placeholder={`Option ${i + 1}`}
                  />
                  {editPoll.options.length > 2 && (
                    <button
                      onClick={() => removeOption(i)}
                      className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addOption}
                className="flex items-center gap-1 text-indigo-400 text-sm hover:text-indigo-300 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Option
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => { setEditPoll(null); setIsCreating(false); }}
              className="px-4 py-2 rounded-xl text-slate-400 text-sm hover:text-white hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all"
            >
              <Save className="w-4 h-4" />
              Save Poll
            </button>
          </div>
        </div>
      )}

      {/* Polls List */}
      <div className="space-y-4">
        {polls.map((poll) => {
          const maxVotes = Math.max(...poll.options.map((o) => o.votes));
          return (
            <div
              key={poll.id}
              className="rounded-2xl bg-white/5 border border-white/10 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-white font-bold text-lg flex-1" style={{ fontFamily: 'Space Grotesk' }}>
                  {poll.question}
                </h3>
                <div className="flex gap-1 ml-4 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(poll)}
                    className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-all"
                    title="Edit"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleResetVotes(poll.id)}
                    className="p-2 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-all"
                    title="Reset votes"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(poll.id)}
                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {poll.options.map((option) => {
                  const pct = poll.totalVotes > 0 ? Math.round((option.votes / poll.totalVotes) * 100) : 0;
                  const isWinning = option.votes === maxVotes && option.votes > 0;
                  return (
                    <div key={option.id} className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5">
                      <div
                        className={`absolute inset-y-0 left-0 ${isWinning ? 'bg-indigo-500/15' : 'bg-white/5'}`}
                        style={{ width: `${pct}%` }}
                      />
                      <div className="relative flex items-center justify-between p-3">
                        <span className="text-slate-300 text-sm">{option.label}</span>
                        <span className={`text-sm font-medium ${isWinning ? 'text-indigo-400' : 'text-slate-500'}`}>
                          {pct}% ({option.votes})
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="text-slate-500 text-sm mt-3">{poll.totalVotes} total votes</p>
            </div>
          );
        })}
      </div>

      {polls.length === 0 && (
        <div className="text-center py-16 rounded-2xl bg-white/5 border border-white/10">
          <BarChart3 className="w-16 h-16 text-slate-700 mx-auto mb-4" />
          <p className="text-slate-400 text-lg font-medium">No polls yet</p>
          <p className="text-slate-600 text-sm mt-1">Create your first community poll.</p>
        </div>
      )}
    </div>
  );
}
