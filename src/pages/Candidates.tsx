import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Mail, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { candidates as defaultCandidates } from '../data/candidates';

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

export default function Candidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCandidates();
  }, []);

  async function loadCandidates() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        const formatted: Candidate[] = data.map((c: any) => ({
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
          socials: c.socials || {},
        }));

        setCandidates(formatted);
      } else {
        setCandidates(
          defaultCandidates.map((c: any) => ({
            ...c,
            id: String(c.id),
          }))
        );
      }
    } catch (err) {
      console.error('Error loading candidates:', err);
      setCandidates(
        defaultCandidates.map((c: any) => ({
          ...c,
          id: String(c.id),
        }))
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <Users className="w-14 h-14 text-slate-700 mx-auto mb-4 animate-pulse" />
          <p className="text-slate-400 text-lg">Loading candidates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Meet the Candidates</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Explore the profiles, promises, and visions of candidates running in the MathClub Elections 2026.
          </p>
        </div>

        {candidates.length === 0 ? (
          <div className="text-center py-16 rounded-2xl bg-white/5 border border-white/10">
            <Users className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-400 text-lg font-medium">No candidates available</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {candidates.map((candidate) => (
              <div
                key={candidate.id}
                className="rounded-3xl bg-white/5 border border-white/10 overflow-hidden hover:border-white/20 transition-all hover:translate-y-[-2px]"
              >
                <div className={`h-28 bg-gradient-to-r ${candidate.color}`} />

                <div className="p-6 relative">
                  <div className="-mt-16 mb-4">
                    {candidate.profilePicture ? (
                      <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-slate-950 shadow-2xl">
                        <img
                          src={candidate.profilePicture}
                          alt={candidate.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div
                        className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${candidate.color} flex items-center justify-center text-4xl border-4 border-slate-950 shadow-2xl`}
                      >
                        {candidate.avatar}
                      </div>
                    )}
                  </div>

                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h2 className="text-xl font-bold">{candidate.name}</h2>
                      <p className="text-indigo-400 text-sm font-medium">
                        {candidate.position}
                      </p>
                    </div>

                    {candidate.symbol && (
                      <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/20 bg-white/10 flex-shrink-0">
                        <img
                          src={candidate.symbol}
                          alt="Symbol"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <p className="text-slate-400 text-sm mb-2">
                    {candidate.year} • {candidate.department}
                  </p>

                  <p className="text-slate-300 text-sm italic mb-4 line-clamp-2">
                    {candidate.tagline}
                  </p>

                  <p className="text-slate-400 text-sm mb-5 line-clamp-3">
                    {candidate.bio || 'No biography available.'}
                  </p>

                  <div className="flex items-center justify-between gap-3">
                    {candidate.socials?.email ? (
                      <a
                        href={`mailto:${candidate.socials.email}`}
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
                      >
                        <Mail className="w-4 h-4 text-indigo-400" />
                        Contact
                      </a>
                    ) : (
                      <span className="text-slate-600 text-sm">No contact info</span>
                    )}

                    <Link
                      to={`/candidates/${candidate.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm transition-colors"
                    >
                      View Profile
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}