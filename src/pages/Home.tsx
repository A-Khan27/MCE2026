import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, MessageSquare, Calendar, BarChart3, ChevronRight, Sparkles, Target, Trophy } from 'lucide-react';
import { Candidate } from '../types';
import { candidates as defaultCandidates } from '../data/candidates';

export default function Home() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  
  // Countdown State
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Load Candidates
  useEffect(() => {
    const stored = localStorage.getItem('mathclub-candidates');
    if (stored) {
      setCandidates(JSON.parse(stored));
    } else {
      setCandidates(defaultCandidates);
    }
  }, []);

  // Countdown Logic
  useEffect(() => {
    // Set the date we're counting down to: April 8, 2026 at 10:00:00 AM
    const targetDate = new Date("April 8, 2026 10:00:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Meet the Candidates',
      description: 'Learn about each candidate\'s vision, promises, and achievements.',
      link: '/candidates',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: 'Community Voice',
      description: 'Share what you want from the next Math Club leadership.',
      link: '/wishlist',
      color: 'from-purple-500 to-pink-600',
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: 'Election Timeline',
      description: 'Stay updated with key dates and events.',
      link: '/timeline',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Live Polls',
      description: 'Vote on what matters most to you.',
      link: '/polls',
      color: 'from-orange-500 to-red-600',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl" />
        </div>

        {/* Floating Math Symbols */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {['∫', 'π', '∑', '∞', 'Δ', '√', 'θ', 'λ', '', 'ε', '∇', 'φ'].map((symbol, i) => (
            <span
              key={i}
              className="absolute text-white/5 font-bold select-none"
              style={{
                fontSize: `${Math.random() * 60 + 30}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                fontFamily: 'serif',
              }}
            >
              {symbol}
            </span>
          ))}
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-8 backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            Department of Mathematics
          </div>
          
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'Space Grotesk' }}>
            Math Club
            <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Elections 2026
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed">
            Your vote shapes the future of our mathematical community. 
            Explore candidates, share your voice, and make your choice count.
          </p>

          {/* Countdown Timer Integrated */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-12">
            <TimeBox value={timeLeft.days} label="Days" />
            <TimeBox value={timeLeft.hours} label="Hours" />
            <TimeBox value={timeLeft.minutes} label="Minutes" />
            <TimeBox value={timeLeft.seconds} label="Seconds" />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/candidates"
              className="group px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-semibold text-lg shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 flex items-center gap-2 hover:scale-105"
            >
              Meet the Candidates
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/wishlist"
              className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 text-white rounded-2xl font-semibold text-lg hover:bg-white/10 transition-all duration-300 hover:scale-105"
            >
              Share Your Voice
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 rounded-full bg-white/40 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-950 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/50 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Space Grotesk' }}>
              Everything You Need
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Stay informed, make your voice heard, and participate in the democratic process.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Link
                key={feature.title}
                to={feature.link}
                className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Candidates Preview */}
      <section className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium mb-4">
              <Trophy className="w-4 h-4" />
              GS Candidates
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Space Grotesk' }}>
              Who's Running?
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Get to know the candidates who want to lead your Math Club.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {candidates.map((candidate) => (
              <Link
                key={candidate.id}
                to={`/candidates/${candidate.id}`}
                className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${candidate.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                <div className="relative">
                  {/* Profile Picture or Emoji */}
                  <div className="mb-4 relative inline-block">
                    {candidate.profilePicture ? (
                      <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg group-hover:scale-110 transition-transform duration-500">
                        <img src={candidate.profilePicture} alt={candidate.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="text-5xl">{candidate.avatar}</div>
                    )}
                    {candidate.symbol && (
                      <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-lg overflow-hidden border-2 border-slate-950 shadow-md bg-white/10">
                        <img src={candidate.symbol} alt="Symbol" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-white font-bold text-lg mb-1">{candidate.name}</h3>
                  <p className="text-indigo-400 text-sm font-medium mb-2">{candidate.year} • {candidate.department}</p>
                  <p className="text-slate-400 text-sm italic">{candidate.tagline}</p>
                  <div className="mt-4 flex items-center text-indigo-400 text-sm font-medium group-hover:text-indigo-300 transition-colors">
                    View Profile
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-950 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Target className="w-6 h-6" />, value: '4', label: 'Candidates' },
              { icon: <Users className="w-6 h-6" />, value: '200+', label: 'Eligible Voters' },
              { icon: <Calendar className="w-6 h-6" />, value: '7', label: 'Election Events' },
              { icon: <MessageSquare className="w-6 h-6" />, value: '∞', label: 'Ideas Welcome' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 mb-3">
                  {stat.icon}
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1" style={{ fontFamily: 'Space Grotesk' }}>
                  {stat.value}
                </div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10" />
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6" style={{ fontFamily: 'Space Grotesk' }}>
            Your Opinion Matters
          </h2>
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
            Don't just vote — tell the candidates what you need. Share your expectations, 
            ideas, and feedback on our Community Voice board.
          </p>
          <Link
            to="/wishlist"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-semibold text-lg shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-105"
          >
            <MessageSquare className="w-5 h-5" />
            Share What You Want
          </Link>
        </div>
      </section>
    </div>
  );
}

// Internal Component for Countdown Boxes
function TimeBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center w-20 h-24 sm:w-28 sm:h-32 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl hover:bg-white/10 transition-colors duration-300">
      <span className="text-3xl sm:text-5xl font-bold text-white font-mono tracking-tighter">
        {value < 10 ? `0${value}` : value}
      </span>
      <span className="text-xs sm:text-sm uppercase tracking-widest text-indigo-300 mt-2 font-medium">
        {label}
      </span>
    </div>
  );
}