import { useState, useEffect } from 'react';
import { BarChart3, CheckCircle2, Sparkles } from 'lucide-react';
import { Poll } from '../types';
import { defaultPolls } from '../data/candidates';

export default function Polls() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [votedPolls, setVotedPolls] = useState<Record<string, string>>({});

  useEffect(() => {
    const storedPolls = localStorage.getItem('mathclub-polls');
    const storedVotes = localStorage.getItem('mathclub-poll-votes');
    
    if (storedPolls) {
      setPolls(JSON.parse(storedPolls));
    } else {
      setPolls(defaultPolls);
      localStorage.setItem('mathclub-polls', JSON.stringify(defaultPolls));
    }
    
    if (storedVotes) {
      setVotedPolls(JSON.parse(storedVotes));
    }
  }, []);

  const handleVote = (pollId: string, optionId: string) => {
    if (votedPolls[pollId]) return;

    const updated = polls.map((poll) => {
      if (poll.id === pollId) {
        return {
          ...poll,
          options: poll.options.map((opt) =>
            opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
          ),
          totalVotes: poll.totalVotes + 1,
        };
      }
      return poll;
    });

    const newVotedPolls = { ...votedPolls, [pollId]: optionId };
    
    setPolls(updated);
    setVotedPolls(newVotedPolls);
    localStorage.setItem('mathclub-polls', JSON.stringify(updated));
    localStorage.setItem('mathclub-poll-votes', JSON.stringify(newVotedPolls));
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-300 text-sm font-medium mb-4">
            <BarChart3 className="w-4 h-4" />
            Community Polls
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Space Grotesk' }}>
            Live Polls
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Vote on key topics and see what the math community thinks. 
            These polls help candidates understand your priorities.
          </p>
        </div>

        {/* Polls */}
        <div className="space-y-8">
          {polls.map((poll) => {
            const hasVoted = !!votedPolls[poll.id];
            const maxVotes = Math.max(...poll.options.map((o) => o.votes));

            return (
              <div
                key={poll.id}
                className="rounded-2xl bg-white/5 border border-white/10 p-6 sm:p-8"
              >
                <h2 className="text-xl font-bold text-white mb-6" style={{ fontFamily: 'Space Grotesk' }}>
                  {poll.question}
                </h2>

                <div className="space-y-3">
                  {poll.options.map((option) => {
                    const percentage = poll.totalVotes > 0 
                      ? Math.round((option.votes / poll.totalVotes) * 100) 
                      : 0;
                    const isSelected = votedPolls[poll.id] === option.id;
                    const isWinning = option.votes === maxVotes && hasVoted;

                    return (
                      <button
                        key={option.id}
                        onClick={() => handleVote(poll.id, option.id)}
                        disabled={hasVoted}
                        className={`w-full relative overflow-hidden rounded-xl border transition-all duration-300 ${
                          hasVoted
                            ? isSelected
                              ? 'border-indigo-500/40 bg-indigo-500/10'
                              : 'border-white/10 bg-white/5'
                            : 'border-white/10 bg-white/5 hover:border-indigo-500/30 hover:bg-white/10 cursor-pointer'
                        }`}
                      >
                        {/* Progress Bar */}
                        {hasVoted && (
                          <div
                            className={`absolute inset-y-0 left-0 transition-all duration-1000 ease-out ${
                              isWinning ? 'bg-indigo-500/15' : 'bg-white/5'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        )}

                        <div className="relative flex items-center justify-between p-4">
                          <div className="flex items-center gap-3">
                            {hasVoted && isSelected && (
                              <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                            )}
                            <span className={`text-sm font-medium ${isSelected ? 'text-indigo-300' : 'text-slate-300'}`}>
                              {option.label}
                            </span>
                          </div>
                          
                          {hasVoted && (
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-bold ${isWinning ? 'text-indigo-400' : 'text-slate-400'}`}>
                                {percentage}%
                              </span>
                              <span className="text-slate-600 text-xs">
                                ({option.votes})
                              </span>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <p className="text-slate-500 text-sm">
                    {poll.totalVotes} total votes
                  </p>
                  {hasVoted && (
                    <span className="inline-flex items-center gap-1.5 text-emerald-400 text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      You voted
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Disclaimer */}
        <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
          <div className="flex items-center justify-center gap-2 text-slate-300 font-medium mb-2">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            Note
          </div>
          <p className="text-slate-400 text-sm">
            These are informal community polls to gauge student preferences. 
            They are not official election votes. The official election will be held on February 15, 2026.
          </p>
        </div>
      </div>
    </div>
  );
}
