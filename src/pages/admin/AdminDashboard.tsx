import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  MessageSquare,
  BarChart3,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { WishlistItem, Candidate, Poll, TimelineEvent } from '../../types';
import { candidates as defaultCandidates, timelineEvents as defaultTimeline, defaultPolls } from '../../data/candidates';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCandidates: 0,
    totalWishes: 0,
    pendingWishes: 0,
    approvedWishes: 0,
    totalPollVotes: 0,
    totalPolls: 0,
    upcomingEvents: 0,
    totalEvents: 0,
  });
  const [recentPending, setRecentPending] = useState<WishlistItem[]>([]);

  useEffect(() => {
    // Candidates
    const storedCandidates = localStorage.getItem('mathclub-candidates');
    const candidatesList: Candidate[] = storedCandidates
      ? JSON.parse(storedCandidates)
      : defaultCandidates;

    // Wishes
    const storedWishes = localStorage.getItem('mathclub-wishes');
    const wishes: WishlistItem[] = storedWishes ? JSON.parse(storedWishes) : [];
    const pending = wishes.filter((w) => !w.approved);
    const approved = wishes.filter((w) => w.approved);

    // Polls
    const storedPolls = localStorage.getItem('mathclub-polls');
    const polls: Poll[] = storedPolls ? JSON.parse(storedPolls) : defaultPolls;
    const totalPollVotes = polls.reduce((acc, p) => acc + p.totalVotes, 0);

    // Timeline
    const storedTimeline = localStorage.getItem('mathclub-timeline');
    const timeline: TimelineEvent[] = storedTimeline
      ? JSON.parse(storedTimeline)
      : defaultTimeline;
    const upcomingEvents = timeline.filter((e) => e.status === 'upcoming').length;

    setStats({
      totalCandidates: candidatesList.length,
      totalWishes: wishes.length,
      pendingWishes: pending.length,
      approvedWishes: approved.length,
      totalPollVotes,
      totalPolls: polls.length,
      upcomingEvents,
      totalEvents: timeline.length,
    });

    setRecentPending(pending.slice(0, 5));
  }, []);

  const statCards = [
    {
      icon: Users,
      label: 'Candidates',
      value: stats.totalCandidates,
      sub: 'registered candidates',
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-400',
      link: '/admin/candidates',
    },
    {
      icon: MessageSquare,
      label: 'Community Posts',
      value: stats.totalWishes,
      sub: `${stats.pendingWishes} pending review`,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-400',
      link: '/admin/wishlist',
      alert: stats.pendingWishes > 0,
    },
    {
      icon: BarChart3,
      label: 'Poll Votes',
      value: stats.totalPollVotes,
      sub: `across ${stats.totalPolls} polls`,
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-500/10',
      textColor: 'text-orange-400',
      link: '/admin/polls',
    },
    {
      icon: Calendar,
      label: 'Timeline',
      value: stats.totalEvents,
      sub: `${stats.upcomingEvents} upcoming`,
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-500/10',
      textColor: 'text-emerald-400',
      link: '/admin/timeline',
    },
  ];

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-6 h-6 text-red-400" />
          <h1
            className="text-2xl sm:text-3xl font-bold text-white"
            style={{ fontFamily: 'Space Grotesk' }}
          >
            Admin Dashboard
          </h1>
        </div>
        <p className="text-slate-400">
          Manage elections, moderate posts, and keep everything running smoothly.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              to={card.link}
              className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/[0.07] transition-all duration-300"
            >
              {card.alert && (
                <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              )}
              <div
                className={`w-12 h-12 rounded-xl ${card.bgColor} flex items-center justify-center ${card.textColor} mb-4 group-hover:scale-110 transition-transform`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div
                className="text-3xl font-bold text-white mb-1"
                style={{ fontFamily: 'Space Grotesk' }}
              >
                {card.value}
              </div>
              <div className="text-white font-medium text-sm">{card.label}</div>
              <div className="text-slate-500 text-xs mt-1">{card.sub}</div>
            </Link>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Posts */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              Pending Approval
            </h2>
            <Link
              to="/admin/wishlist"
              className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {recentPending.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-12 h-12 text-emerald-500/30 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">All posts approved!</p>
              <p className="text-slate-600 text-xs">No pending reviews.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentPending.map((wish) => (
                <div
                  key={wish.id}
                  className="p-4 rounded-xl bg-white/5 border border-white/5"
                >
                  <p className="text-slate-300 text-sm line-clamp-2 mb-2">
                    {wish.content}
                  </p>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-slate-500">by {wish.author}</span>
                    <span className="text-slate-600">
                      {formatTime(wish.timestamp)}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs">
                      Pending
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            Quick Actions
          </h2>

          <div className="space-y-3">
            <Link
              to="/admin/wishlist"
              className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium text-sm">
                  Review Pending Posts
                </p>
                <p className="text-slate-500 text-xs">
                  {stats.pendingWishes} posts waiting for approval
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              to="/admin/candidates"
              className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium text-sm">
                  Manage Candidates
                </p>
                <p className="text-slate-500 text-xs">
                  Add, edit, or remove candidate profiles
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              to="/admin/timeline"
              className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium text-sm">
                  Update Timeline
                </p>
                <p className="text-slate-500 text-xs">
                  Edit dates, statuses and event details
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              to="/admin/polls"
              className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium text-sm">Manage Polls</p>
                <p className="text-slate-500 text-xs">
                  Create, edit or reset community polls
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
