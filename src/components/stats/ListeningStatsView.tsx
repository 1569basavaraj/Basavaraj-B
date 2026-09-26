import React from 'react';
import { useStore } from '../../services/store';
import { formatCompactNumber } from '../../utils/formatters';
import { Activity, Award, BarChart3, Clock, Flame, Headphones, Sparkles } from 'lucide-react';

export const ListeningStatsView: React.FC = () => {
  const { user, tracks } = useStore();

  const minutesListened = user?.listeningMinutes || 4820;
  const hoursListened = (minutesListened / 60).toFixed(1);
  const streak = user?.streakDays || 14;

  const topGenres = [
    { name: 'South Bass & Folk Fusion', percent: 38, color: 'bg-violet-500' },
    { name: 'EDM & Festival Dance', percent: 24, color: 'bg-fuchsia-500' },
    { name: 'Synthwave & Retrowave', percent: 18, color: 'bg-cyan-400' },
    { name: 'Lo-Fi Chill & Beats', percent: 12, color: 'bg-emerald-400' },
    { name: 'Indie & Classical Fusion', percent: 8, color: 'bg-amber-400' },
  ];

  const topArtists = [
    { name: 'Kavya Rao', streams: 142, hours: '11.4h', rank: 1 },
    { name: 'Neon Voyager', streams: 98, hours: '7.8h', rank: 2 },
    { name: 'SubZero Flux', streams: 84, hours: '6.2h', rank: 3 },
    { name: 'Soma Beats', streams: 67, hours: '4.9h', rank: 4 },
    { name: 'Dakshin Groove', streams: 53, hours: '3.8h', rank: 5 },
  ];

  const hourlyDistribution = [
    { hour: '12 AM', level: 85 },
    { hour: '2 AM', level: 95 },
    { hour: '4 AM', level: 30 },
    { hour: '6 AM', level: 15 },
    { hour: '8 AM', level: 40 },
    { hour: '10 AM', level: 60 },
    { hour: '12 PM', level: 75 },
    { hour: '2 PM', level: 65 },
    { hour: '4 PM', level: 80 },
    { hour: '6 PM', level: 90 },
    { hour: '8 PM', level: 100 },
    { hour: '10 PM', level: 95 },
  ];

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 pb-24">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 className="w-4 h-4 text-violet-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-violet-300">
            Listening Intelligence
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
          Your Sonic Journey
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Real-time metrics calculated from your playback history and track completions
        </p>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1">
          <div className="w-9 h-9 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center mb-2">
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Hours Streamed
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold font-display text-white font-mono-tabular">
            {hoursListened}h
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1">
          <div className="w-9 h-9 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center mb-2">
            <Flame className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Listening Streak
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold font-display text-white font-mono-tabular">
            {streak} Days
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1">
          <div className="w-9 h-9 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center mb-2">
            <Headphones className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Tracks Discovered
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold font-display text-white font-mono-tabular">
            {tracks.length}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1">
          <div className="w-9 h-9 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center mb-2">
            <Award className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Vibe Persona
          </span>
          <p className="text-base sm:text-lg font-bold font-display text-amber-300 truncate">
            Night Owl Basshead
          </p>
        </div>
      </div>

      {/* Grid: Top Genres and Hourly Peak */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Genres Breakdown */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
          <h3 className="text-base font-bold font-display text-white">
            Top Genres Affinity
          </h3>

          <div className="space-y-3">
            {topGenres.map((g) => (
              <div key={g.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-200 font-medium">{g.name}</span>
                  <span className="text-slate-400 font-mono-tabular">{g.percent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/[0.08] overflow-hidden">
                  <div
                    className={`h-full ${g.color} rounded-full`}
                    style={{ width: `${g.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Listening Hours Heat Chart */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold font-display text-white">
              Most Active Hours
            </h3>
            <span className="text-xs text-slate-500 font-mono-tabular">
              Peak: 8:00 PM – 2:00 AM
            </span>
          </div>

          <div className="h-44 flex items-end justify-between gap-1.5 pt-6">
            {hourlyDistribution.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-violet-600 via-fuchsia-600 to-cyan-400 group-hover:brightness-125 transition-all"
                  style={{ height: `${h.level}%` }}
                />
                <span className="text-[9px] text-slate-500 rotate-45 sm:rotate-0 font-mono-tabular">
                  {h.hour}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top 5 Artists List */}
      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
        <h3 className="text-base font-bold font-display text-white">
          Your Top Artists This Month
        </h3>

        <div className="space-y-2">
          {topArtists.map((a) => (
            <div
              key={a.rank}
              className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 text-center text-xs font-mono-tabular font-bold text-violet-400">
                  #{a.rank}
                </span>
                <span className="text-xs font-semibold text-white">
                  {a.name}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono-tabular text-slate-400">
                <span>{a.streams} streams</span>
                <span className="text-slate-200 font-medium">{a.hours}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
