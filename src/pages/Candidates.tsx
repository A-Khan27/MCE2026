import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Award, Target, BookOpen, Shield } from 'lucide-react';
import { Candidate } from '../types';
import { candidates as defaultCandidates } from '../data/candidates';

export default function Candidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('mathclub-candidates');
    if (stored) {
      setCandidates(JSON.parse(stored));
    } else {
      setCandidates(defaultCandidates);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-4">
            <Award className="w-4 h-4" />
            GS Race
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Space Grotesk' }}>
            Our Candidates
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Four passionate mathematicians. One vision for the future. 
            Click on any candidate to explore their full platform.
          </p>
        </div>

        {/* Candidate Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {candidates.map((candidate, index) => (
            <Link
              key={candidate.id}
              to={`/candidates/${candidate.id}`}
              className="group relative rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${candidate.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              
              <div className="relative p-8">
                <div className="flex items-start gap-6">
                  {/* Profile Picture / Avatar */}
                  <div className="flex-shrink-0 relative">
                    {candidate.profilePicture ? (
                      <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl group-hover:scale-110 transition-transform duration-500">
                        <img
                          src={candidate.profilePicture}
                          alt={candidate.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${candidate.color} flex items-center justify-center text-4xl shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                        {candidate.avatar}
                      </div>
                    )}
                    {/* Election Symbol Badge */}
                    {candidate.symbol && (
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl overflow-hidden border-2 border-slate-950 shadow-lg bg-white/10 backdrop-blur-sm">
                        <img
                          src={candidate.symbol}
                          alt="Election Symbol"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>
                        {candidate.name}
                      </h2>
                      <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-medium">
                        #{index + 1}
                      </span>
                    </div>
                    <p className="text-indigo-400 font-medium mb-1">
                      {candidate.position} Candidate
                    </p>
                    <p className="text-slate-400 text-sm mb-3">
                      {candidate.year} • {candidate.department}
                    </p>
                    <p className="text-slate-300 text-sm italic mb-4">{candidate.tagline}</p>
                    
                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-4">
                      {candidate.bio}
                    </p>

                    {/* Quick Stats */}
                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Target className="w-4 h-4 text-emerald-400" />
                        <span className="text-slate-300">{candidate.promises.length} Promises</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <BookOpen className="w-4 h-4 text-purple-400" />
                        <span className="text-slate-300">{candidate.achievements.length} Achievements</span>
                      </div>
                      {candidate.symbol && (
                        <div className="flex items-center gap-2 text-sm">
                          <Shield className="w-4 h-4 text-amber-400" />
                          <span className="text-slate-300">Symbol Assigned</span>
                        </div>
                      )}
                    </div>

                    {/* Top Promises Preview */}
                    <div className="flex flex-wrap gap-2">
                      {candidate.promises.slice(0, 3).map((promise, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs"
                        >
                          {promise.length > 30 ? promise.substring(0, 30) + '...' : promise}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end text-indigo-400 text-sm font-medium group-hover:text-indigo-300 transition-colors">
                  View Full Profile
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Comparison Note */}
        <div className="mt-16 text-center">
          <div className="inline-block p-6 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-slate-300 text-sm">
              💡 <strong className="text-white">Tip:</strong> Click on any candidate to see their detailed platform, 
              vision statement, and complete list of promises.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
