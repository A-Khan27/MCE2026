import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle2, Star, Quote, Target, Trophy, Lightbulb, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';

type Candidate = {
  id: string;
  name: string;
  position: string;
  department: string;
  year: string;
  tagline: string;
  bio: string;
  avatar: string;
  color: string;
  profilePicture: string;
  symbol: string;
  promises: string[];
  vision: string;
  achievements: string[];
  socials: {
    email: string;
  };
};

export default function CandidateDetail() {
  const { id } = useParams<{ id: string }>();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [otherCandidates, setOtherCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCandidate(id);
      fetchOtherCandidates(id);
    }
  }, [id]);

  async function fetchCandidate(candidateId: string) {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('id', candidateId)
        .maybeSingle();

      if (error || !data) {
        console.error('Candidate fetch error:', error);
        setCandidate(null);
        return;
      }

      setCandidate({
        id: String(data.id),
        name: data.name,
        position: data.position,
        department: data.department,
        year: data.year,
        tagline: data.tagline,
        bio: data.bio || '',
        avatar: data.avatar || '🎓',
        color: data.color || 'from-blue-500 to-indigo-600',
        profilePicture: data.profile_picture || '',
        symbol: data.symbol || '',
        promises: data.promises || [],
        vision: data.vision || '',
        achievements: data.achievements || [],
        socials: data.socials || { email: '' },
      });
    } catch (err) {
      console.error('Error fetching candidate:', err);
      setCandidate(null);
    } finally {
      setLoading(false);
    }
  }

  async function fetchOtherCandidates(currentId: string) {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .neq('id', currentId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Other candidates fetch error:', error);
        return;
      }

      const formatted = (data || []).map((c: any) => ({
        id: String(c.id),
        name: c.name,
        position: c.position,
        department: c.department,
        year: c.year,
        tagline: c.tagline,
        bio: c.bio || '',
        avatar: c.avatar || '🎓',
        color: c.color || 'from-blue-500 to-indigo-600',
        profilePicture: c.profile_picture || '',
        symbol: c.symbol || '',
        promises: c.promises || [],
        vision: c.vision || '',
        achievements: c.achievements || [],
        socials: c.socials || { email: '' },
      }));

      setOtherCandidates(formatted);
    } catch (err) {
      console.error('Error fetching other candidates:', err);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 pt-24 flex items-center justify-center">
        <div className="text-center text-white text-xl">Loading candidate...</div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-slate-950 pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Candidate Not Found</h1>
          <Link to="/candidates" className="text-indigo-400 hover:text-indigo-300">
            ← Back to Candidates
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/candidates"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to All Candidates
        </Link>

        <div className="relative rounded-3xl overflow-hidden mb-8">
          <div className={`absolute inset-0 bg-gradient-to-br ${candidate.color} opacity-10`} />
          <div className="absolute inset-0 bg-slate-950/60" />

          <div className="relative p-8 sm:p-12">
            <div className="flex flex-col sm:flex-row items-start gap-8">
              <div className="flex-shrink-0 relative">
                {candidate.profilePicture ? (
                  <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-3xl overflow-hidden border-3 border-white/20 shadow-2xl ring-4 ring-white/10">
                    <img
                      src={candidate.profilePicture}
                      alt={candidate.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className={`w-32 h-32 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-br ${candidate.color} flex items-center justify-center text-7xl shadow-2xl`}>
                    {candidate.avatar}
                  </div>
                )}
                {candidate.symbol && (
                  <div className="absolute -bottom-3 -right-3 w-14 h-14 rounded-2xl overflow-hidden border-3 border-slate-950 shadow-xl bg-white/10 backdrop-blur-sm ring-2 ring-white/20">
                    <img
                      src={candidate.symbol}
                      alt="Election Symbol"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <h1 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>
                    {candidate.name}
                  </h1>
                  <span className={`px-4 py-1.5 rounded-full bg-gradient-to-r ${candidate.color} text-white text-sm font-semibold shadow-lg`}>
                    {candidate.position}
                  </span>
                </div>

                <p className="text-indigo-300 font-medium mb-1">
                  {candidate.year} • {candidate.department}
                </p>
                <p className="text-xl text-slate-300 italic mb-4">{candidate.tagline}</p>

                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Mail className="w-4 h-4" />
                    <a href={`mailto:${candidate.socials.email}`} className="hover:text-indigo-400 transition-colors">
                      {candidate.socials.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {candidate.symbol && (
          <div className="mb-8 rounded-2xl bg-white/5 border border-white/10 p-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg flex-shrink-0">
                <img
                  src={candidate.symbol}
                  alt="Election Symbol"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-5 h-5 text-amber-400" />
                  <h3 className="text-white font-bold text-lg" style={{ fontFamily: 'Space Grotesk' }}>
                    Election Symbol
                  </h3>
                </div>
                <p className="text-slate-400 text-sm">
                  This is the official election symbol for <strong className="text-slate-300">{candidate.name}</strong>.
                  Look for this symbol on the ballot paper on Election Day.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="rounded-2xl bg-white/5 border border-white/10 p-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2" style={{ fontFamily: 'Space Grotesk' }}>
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                About
              </h2>
              <p className="text-slate-300 leading-relaxed">{candidate.bio}</p>
            </section>

            <section className="rounded-2xl bg-white/5 border border-white/10 p-8 relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${candidate.color}`} />
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2" style={{ fontFamily: 'Space Grotesk' }}>
                <Quote className="w-5 h-5 text-indigo-400" />
                Vision Statement
              </h2>
              <blockquote className="text-slate-300 leading-relaxed text-lg italic pl-4">
                "{candidate.vision}"
              </blockquote>
            </section>

            <section className="rounded-2xl bg-white/5 border border-white/10 p-8">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2" style={{ fontFamily: 'Space Grotesk' }}>
                <Target className="w-5 h-5 text-emerald-400" />
                Promises & Plans
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {candidate.promises.map((promise, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300 text-sm">{promise}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-8">
            {candidate.profilePicture && (
              <section className="rounded-2xl overflow-hidden border border-white/10">
                <div className="aspect-square">
                  <img
                    src={candidate.profilePicture}
                    alt={candidate.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className={`p-4 bg-gradient-to-r ${candidate.color}`}>
                  <p className="text-white font-bold text-center text-lg">{candidate.name}</p>
                  <p className="text-white/80 text-center text-sm">{candidate.position} Candidate</p>
                </div>
              </section>
            )}

            <section className="rounded-2xl bg-white/5 border border-white/10 p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2" style={{ fontFamily: 'Space Grotesk' }}>
                <Trophy className="w-5 h-5 text-yellow-400" />
                Achievements
              </h2>
              <div className="space-y-3">
                {candidate.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Star className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-1" />
                    <span className="text-slate-300 text-sm">{achievement}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl bg-white/5 border border-white/10 p-6">
              <h2 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'Space Grotesk' }}>
                At a Glance
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Position</span>
                  <span className="text-white text-sm font-medium">{candidate.position}</span>
                </div>
                <div className="h-px bg-white/10" />
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Year</span>
                  <span className="text-white text-sm font-medium">{candidate.year}</span>
                </div>
                <div className="h-px bg-white/10" />
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Department</span>
                  <span className="text-white text-sm font-medium">{candidate.department}</span>
                </div>
                <div className="h-px bg-white/10" />
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Promises</span>
                  <span className="text-emerald-400 text-sm font-bold">{candidate.promises.length}</span>
                </div>
                {candidate.symbol && (
                  <>
                    <div className="h-px bg-white/10" />
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm">Symbol</span>
                      <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/20">
                        <img src={candidate.symbol} alt="Symbol" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </section>

            <div className={`rounded-2xl bg-gradient-to-br ${candidate.color} p-6 text-center`}>
              <h3 className="text-white font-bold text-lg mb-2">Have Questions?</h3>
              <p className="text-white/80 text-sm mb-4">
                Reach out to {candidate.name.split(' ')[0]} directly.
              </p>
              <a
                href={`mailto:${candidate.socials.email}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl font-medium text-sm transition-colors backdrop-blur-sm"
              >
                <Mail className="w-4 h-4" />
                Send Email
              </a>
            </div>
          </div>
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'Space Grotesk' }}>
            Other Candidates
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {otherCandidates.map((c) => (
              <Link
                key={c.id}
                to={`/candidates/${c.id}`}
                className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all"
              >
                <div className="relative flex-shrink-0">
                  {c.profilePicture ? (
                    <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-white/20 group-hover:scale-110 transition-transform">
                      <img src={c.profilePicture} alt={c.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                      {c.avatar}
                    </div>
                  )}
                  {c.symbol && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-md overflow-hidden border border-slate-950 bg-white/10">
                      <img src={c.symbol} alt="Symbol" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-white font-semibold">{c.name}</h3>
                  <p className="text-slate-400 text-sm">{c.year}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}