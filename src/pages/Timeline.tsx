import { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, Clock, CircleDot } from 'lucide-react';
import { TimelineEvent } from '../types';
import { timelineEvents as defaultTimeline } from '../data/candidates';

export default function Timeline() {
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('mathclub-timeline');
    if (stored) {
      setTimelineEvents(JSON.parse(stored));
    } else {
      setTimelineEvents(defaultTimeline);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm font-medium mb-4">
            <Calendar className="w-4 h-4" />
            Key Dates
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Space Grotesk' }}>
            Election Timeline
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Stay updated with all the important dates and milestones of the Math Club Election 2026.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-indigo-500 to-slate-700" />

          <div className="space-y-8">
            {timelineEvents.map((event, index) => {
              const getStatusStyles = () => {
                switch (event.status) {
                  case 'completed':
                    return {
                      dot: 'bg-emerald-500 ring-emerald-500/20',
                      card: 'border-emerald-500/20',
                      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
                      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                      badgeText: 'Completed',
                    };
                  case 'active':
                    return {
                      dot: 'bg-indigo-500 ring-indigo-500/20 animate-pulse',
                      card: 'border-indigo-500/30 bg-indigo-500/5',
                      icon: <CircleDot className="w-4 h-4 text-indigo-400" />,
                      badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
                      badgeText: 'In Progress',
                    };
                  case 'upcoming':
                    return {
                      dot: 'bg-slate-600 ring-slate-600/20',
                      card: 'border-white/10',
                      icon: <Clock className="w-4 h-4 text-slate-400" />,
                      badge: 'bg-white/5 text-slate-400 border-white/10',
                      badgeText: 'Upcoming',
                    };
                }
              };

              const styles = getStatusStyles();

              return (
                <div key={index} className="relative flex items-start gap-6 sm:gap-8">
                  {/* Dot */}
                  <div className={`relative z-10 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0 ring-4 ${styles.dot} bg-slate-900 border border-white/10`}>
                    {event.icon}
                  </div>

                  {/* Card */}
                  <div className={`flex-1 p-5 sm:p-6 rounded-2xl bg-white/5 border ${styles.card} transition-all hover:bg-white/[0.07]`}>
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${styles.badge}`}>
                        {styles.icon}
                        {styles.badgeText}
                      </span>
                      <span className="text-slate-500 text-sm">{event.date}</span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                      {event.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-16 p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/20">
          <h3 className="text-white font-bold mb-2 flex items-center gap-2">
            📋 Election Rules
          </h3>
          <ul className="space-y-2 text-slate-400 text-sm">
            <li>• All registered Math Department students are eligible to vote.</li>
            <li>• Each student gets exactly one vote.</li>
            <li>• Bring your student ID card on election day.</li>
            <li>• Campaigning within 50 meters of the polling station is prohibited.</li>
            <li>• Results are final and announced by the Election Committee.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
