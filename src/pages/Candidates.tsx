import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Trophy, Target, Star } from 'lucide-react';
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
  profilePicture?: string;
  symbol?: string;
  promises: string[];
  vision: string;
  achievements: string[];
  socials?: {
    email?: string;
  };
};

export default function CandidateDetail() {
  const { id } = useParams();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCandidate(id);
    }
  }, [id]);

  async function fetchCandidate(candidateId: string) {
    try {
      console.log('Looking for candidate id:', candidateId);

      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('id', candidateId)
        .maybeSingle();

      console.log('Candidate query result:', data, error);

      if (error || !data) {
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
        socials: data.socials || {},
      });
    } catch (err) {
      console.error('Error fetching candidate:', err);
      setCandidate(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-400 text-lg">Loading candidate profile...</p>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center px-4">
        <h1 className="text-3xl font-bold mb-4">Candidate Not Found</h1>
        <p className="text-slate-400 mb-6">The candidate profile you are looking for does not exist.</p>
        <Link
          to="/candidates"
          className="px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 transition text-white"
        >
          Back to Candidates
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/candidates"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Candidates
        </Link>

        <div className="rounded-3xl bg-white/5 border border-white/10 overflow-hidden">
          <div className={`h-48 bg-gradient-to-r ${candidate.color}`} />

          <div className="px-6 sm:px-10 pb-10 relative">
            <div className="-mt-16 mb-6 flex flex-col sm:flex-row sm:items-end gap-6">
              <div className="relative">
                {candidate.profilePicture ? (
                  <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-slate-950 shadow-2xl">
                    <img
                      src={candidate.profilePicture}
                      alt={candidate.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className={`w-32 h-32 rounded-3xl bg-gradient-to-br ${candidate.color} flex items-center justify-center text-5xl border-4 border-slate-950 shadow-2xl`}>
                    {candidate.avatar}
                  </div>
                )}
                {candidate.symbol && (
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-xl overflow-hidden border-2 border-slate-950 bg-white/10">
                    <img src={candidate.symbol} alt="Symbol" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl font-bold">{candidate.name}</h1>
                <p className="text-indigo-400 font-medium mt-1">
                  {candidate.position} • {candidate.year} • {candidate.department}
                </p>
                <p className="text-slate-300 italic mt-3">{candidate.tagline}</p>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-8">
                <section>
                  <h2 className="text-xl font-bold mb-3">Biography</h2>
                  <p className="text-slate-300 leading-relaxed">{candidate.bio || 'No biography available.'}</p>
                </section>

                <section>
                  <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-indigo-400" />
                    Vision
                  </h2>
                  <p className="text-slate-300 leading-relaxed">{candidate.vision || 'No vision statement available.'}</p>
                </section>

                <section>
                  <h2 className="text-xl font-bold mb-3">Promises</h2>
                  <ul className="space-y-2">
                    {candidate.promises?.length > 0 ? (
                      candidate.promises.map((promise, index) => (
                        <li key={index} className="text-slate-300 flex gap-2">
                          <span className="text-indigo-400">•</span>
                          {promise}
                        </li>
                      ))
                    ) : (
                      <li className="text-slate-500">No promises listed.</li>
                    )}
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    Achievements
                  </h2>
                  <ul className="space-y-2">
                    {candidate.achievements?.length > 0 ? (
                      candidate.achievements.map((achievement, index) => (
                        <li key={index} className="text-slate-300 flex gap-2">
                          <span className="text-emerald-400">✓</span>
                          {achievement}
                        </li>
                      ))
                    ) : (
                      <li className="text-slate-500">No achievements listed.</li>
                    )}
                  </ul>
                </section>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    Candidate Info
                  </h3>
                  <div className="space-y-3 text-sm">
                    <p><span className="text-slate-500">Position:</span> <span className="text-white">{candidate.position}</span></p>
                    <p><span className="text-slate-500">Department:</span> <span className="text-white">{candidate.department}</span></p>
                    <p><span className="text-slate-500">Year:</span> <span className="text-white">{candidate.year}</span></p>
                  </div>
                </div>

                <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                  <h3 className="text-lg font-bold mb-4">Contact</h3>
                  <div className="space-y-3">
                    {candidate.socials?.email ? (
                      <a
                        href={`mailto:${candidate.socials.email}`}
                        className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
                      >
                        <Mail className="w-4 h-4 text-indigo-400" />
                        {candidate.socials.email}
                      </a>
                    ) : (
                      <p className="text-slate-500 text-sm">No contact info available.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}