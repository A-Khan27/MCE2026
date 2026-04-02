import { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  Trash2,
  MessageSquare,
  Filter,
  ThumbsUp,
  AlertCircle,
  CheckCheck,
  Clock,
} from 'lucide-react';
import { WishlistItem } from '../../types';
import { defaultWishes } from '../../data/candidates';

type FilterType = 'all' | 'pending' | 'approved';

export default function AdminWishlist() {
  const [wishes, setWishes] = useState<WishlistItem[]>([]);
  const [filter, setFilter] = useState<FilterType>('pending');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('mathclub-wishes');
    if (stored) {
      setWishes(JSON.parse(stored));
    } else {
      setWishes(defaultWishes);
      localStorage.setItem('mathclub-wishes', JSON.stringify(defaultWishes));
    }
  }, []);

  const saveWishes = (updated: WishlistItem[]) => {
    setWishes(updated);
    localStorage.setItem('mathclub-wishes', JSON.stringify(updated));
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleApprove = (id: string) => {
    const updated = wishes.map((w) =>
      w.id === id ? { ...w, approved: true } : w
    );
    saveWishes(updated);
    showToast('Post approved successfully!');
  };

  const handleReject = (id: string) => {
    const updated = wishes.map((w) =>
      w.id === id ? { ...w, approved: false } : w
    );
    saveWishes(updated);
    showToast('Post rejected.');
  };

  const handleDelete = (id: string) => {
    const updated = wishes.filter((w) => w.id !== id);
    saveWishes(updated);
    setDeleteConfirm(null);
    showToast('Post deleted permanently.', 'error');
  };

  const handleApproveAll = () => {
    const updated = wishes.map((w) => ({ ...w, approved: true }));
    saveWishes(updated);
    showToast('All posts approved!');
  };

  const filtered = wishes.filter((w) => {
    if (filter === 'pending') return !w.approved;
    if (filter === 'approved') return w.approved;
    return true;
  });

  const pendingCount = wishes.filter((w) => !w.approved).length;
  const approvedCount = wishes.filter((w) => w.approved).length;

  const formatTime = (timestamp: number) => {
    const d = new Date(timestamp);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium shadow-xl animate-in fade-in slide-in-from-right ${
            toast.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <XCircle className="w-4 h-4" />
          )}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold text-white flex items-center gap-2"
            style={{ fontFamily: 'Space Grotesk' }}
          >
            <MessageSquare className="w-6 h-6 text-purple-400" />
            Manage Posts
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Review, approve or reject community wishlist posts.
          </p>
        </div>

        {pendingCount > 0 && (
          <button
            onClick={handleApproveAll}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-all"
          >
            <CheckCheck className="w-4 h-4" />
            Approve All ({pendingCount})
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 bg-white/5 rounded-xl p-1.5 w-fit">
        {[
          { key: 'pending' as FilterType, label: 'Pending', count: pendingCount, icon: Clock },
          { key: 'approved' as FilterType, label: 'Approved', count: approvedCount, icon: CheckCircle2 },
          { key: 'all' as FilterType, label: 'All Posts', count: wishes.length, icon: Filter },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === tab.key
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              <span
                className={`px-1.5 py-0.5 rounded-full text-xs ${
                  filter === tab.key
                    ? 'bg-white/10 text-white'
                    : 'bg-white/5 text-slate-500'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Posts List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-white/5 border border-white/10">
          <CheckCircle2 className="w-16 h-16 text-emerald-500/20 mx-auto mb-4" />
          <p className="text-slate-400 text-lg font-medium">
            {filter === 'pending'
              ? 'No pending posts!'
              : filter === 'approved'
              ? 'No approved posts yet.'
              : 'No posts found.'}
          </p>
          <p className="text-slate-600 text-sm mt-1">
            {filter === 'pending'
              ? 'All community posts have been reviewed.'
              : 'Posts will appear here as they are submitted.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((wish) => (
            <div
              key={wish.id}
              className={`p-5 rounded-2xl border transition-all ${
                wish.approved
                  ? 'bg-white/5 border-white/10'
                  : 'bg-amber-500/[0.03] border-amber-500/10'
              }`}
            >
              <div className="flex gap-4">
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 leading-relaxed mb-3">
                    {wish.content}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <span className="text-slate-400 font-medium">
                      by {wish.author}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white/5 text-slate-400">
                      {wish.category}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <ThumbsUp className="w-3 h-3" />
                      {wish.votes} votes
                    </span>
                    <span className="text-slate-600">
                      {formatTime(wish.timestamp)}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        wish.approved
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}
                    >
                      {wish.approved ? '✓ Approved' : '⏳ Pending'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  {!wish.approved ? (
                    <button
                      onClick={() => handleApprove(wish.id)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-all"
                      title="Approve"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Approve
                    </button>
                  ) : (
                    <button
                      onClick={() => handleReject(wish.id)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-medium hover:bg-amber-500/20 transition-all"
                      title="Reject"
                    >
                      <XCircle className="w-4 h-4" />
                      Unapprove
                    </button>
                  )}

                  {deleteConfirm === wish.id ? (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleDelete(wish.id)}
                        className="flex items-center gap-1 px-2 py-2 rounded-lg bg-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/30 transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                        Yes
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-2 py-2 rounded-lg bg-white/5 text-slate-400 text-xs hover:bg-white/10 transition-all"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(wish.id)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
        <div className="text-slate-500 text-sm">
          <p className="font-medium text-slate-400 mb-1">Moderation Guidelines</p>
          <p>
            Only approved posts are visible on the public Community Voice page.
            Pending posts are hidden from the public until reviewed. Deleted posts
            cannot be recovered.
          </p>
        </div>
      </div>
    </div>
  );
}
