import { useState, useEffect } from 'react';
import { ThumbsUp, Send, Filter, TrendingUp, Clock, MessageSquare, Sparkles, Info } from 'lucide-react';
import { WishlistItem } from '../types';
import { defaultWishes } from '../data/candidates';

const categories = [
  'All',
  '📚 Academic',
  '🎉 Events',
  '💼 Career',
  '🤝 Community',
  '💡 Innovation',
  '🏆 Competitions',
];

export default function Wishlist() {
  const [wishes, setWishes] = useState<WishlistItem[]>([]);
  const [newWish, setNewWish] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [newCategory, setNewCategory] = useState('📚 Academic');
  const [sortBy, setSortBy] = useState<'votes' | 'newest'>('votes');
  const [userId] = useState(() => 'user-' + Math.random().toString(36).substr(2, 9));
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWish.trim() || !newAuthor.trim()) return;

    const wish: WishlistItem = {
      id: Date.now().toString(),
      author: newAuthor.trim(),
      content: newWish.trim(),
      category: newCategory,
      votes: 0,
      timestamp: Date.now(),
      votedBy: [],
      approved: false, // Needs admin approval
    };

    const updated = [wish, ...wishes];
    saveWishes(updated);
    setNewWish('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleVote = (id: string) => {
    const updated = wishes.map((w) => {
      if (w.id === id) {
        const hasVoted = w.votedBy.includes(userId);
        return {
          ...w,
          votes: hasVoted ? w.votes - 1 : w.votes + 1,
          votedBy: hasVoted
            ? w.votedBy.filter((v) => v !== userId)
            : [...w.votedBy, userId],
        };
      }
      return w;
    });
    saveWishes(updated);
  };

  // Only show approved wishes on public page
  const approvedWishes = wishes.filter((w) => w.approved);

  const filtered = approvedWishes
    .filter((w) => selectedCategory === 'All' || w.category === selectedCategory)
    .sort((a, b) => (sortBy === 'votes' ? b.votes - a.votes : b.timestamp - a.timestamp));

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Community Driven
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Space Grotesk' }}>
            Community Voice
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Tell the candidates what you want from the Math Club. 
            Post your ideas, upvote what matters to you, and shape the future together.
          </p>
        </div>

        {/* Submitted Toast */}
        {submitted && (
          <div className="mb-6 flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
            <Info className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-medium">Your wish has been submitted! 🎉</p>
              <p className="text-emerald-500 text-xs mt-0.5">It will appear publicly after review by the election committee.</p>
            </div>
          </div>
        )}

        {/* Submit Form */}
        <form onSubmit={handleSubmit} className="mb-10 rounded-2xl bg-white/5 border border-white/10 p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-400" />
            Share Your Wish
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Your name"
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all"
            />
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500/50 transition-all appearance-none cursor-pointer"
            >
              {categories.slice(1).map((cat) => (
                <option key={cat} value={cat} className="bg-slate-900">
                  {cat}
                </option>
              ))}
            </select>
          </div>
          
          <textarea
            placeholder="What do you want from the next Math Club leadership? Share your ideas, expectations, or suggestions..."
            value={newWish}
            onChange={(e) => setNewWish(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all resize-none mb-4"
          />
          
          <div className="flex items-center justify-between flex-wrap gap-3">
            <button
              type="submit"
              disabled={!newWish.trim() || !newAuthor.trim()}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              <Send className="w-4 h-4" />
              Post Your Wish
            </button>
            <p className="text-slate-600 text-xs flex items-center gap-1">
              <Info className="w-3 h-3" />
              Posts are reviewed before appearing publicly.
            </p>
          </div>
        </form>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <Filter className="w-4 h-4 text-slate-400 mt-2" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('votes')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                sortBy === 'votes'
                  ? 'bg-white/10 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Top
            </button>
            <button
              onClick={() => setSortBy('newest')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                sortBy === 'newest'
                  ? 'bg-white/10 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="w-4 h-4" />
              New
            </button>
          </div>
        </div>

        {/* Results count */}
        <p className="text-slate-500 text-sm mb-4">{filtered.length} {filtered.length === 1 ? 'wish' : 'wishes'} found</p>

        {/* Wishes List */}
        <div className="space-y-4">
          {filtered.map((wish, index) => (
            <div
              key={wish.id}
              className="group flex gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/[0.07] transition-all duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Vote Button */}
              <button
                onClick={() => handleVote(wish.id)}
                className={`flex flex-col items-center gap-1 pt-1 transition-all ${
                  wish.votedBy.includes(userId)
                    ? 'text-indigo-400'
                    : 'text-slate-500 hover:text-indigo-400'
                }`}
              >
                <ThumbsUp
                  className={`w-5 h-5 transition-transform hover:scale-125 ${
                    wish.votedBy.includes(userId) ? 'fill-indigo-400' : ''
                  }`}
                />
                <span className="text-sm font-bold">{wish.votes}</span>
              </button>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-slate-200 leading-relaxed mb-3">{wish.content}</p>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm text-slate-400 font-medium">— {wish.author}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-slate-400 text-xs">
                    {wish.category}
                  </span>
                  <span className="text-slate-600 text-xs">{formatTime(wish.timestamp)}</span>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-slate-500 text-lg mb-2">No wishes found</p>
              <p className="text-slate-600 text-sm">
                {selectedCategory !== 'All' 
                  ? 'Try a different category or be the first to post in this one!'
                  : 'Be the first to share what you want from the Math Club!'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
