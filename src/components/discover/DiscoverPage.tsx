import React from 'react';
import { useStore } from '../../services/store';
import { Flame, Play, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { ALBUM_SOUNDSCAPE_IMAGE, ALBUM_SYNTHWAVE_IMAGE } from '../../data/seedData';

export const DiscoverPage: React.FC = () => {
  const {
    tracks,
    playlists,
    artists,
    albums,
    playTrack,
    setActiveView,
    setSelectedPlaylistId,
    setSelectedArtistId,
    setSelectedAlbumId,
  } = useStore();

  const moods = [
    { title: 'Late Night Drive', desc: 'Analog synths & highway vibrations', color: 'from-fuchsia-600 to-indigo-800', img: ALBUM_SYNTHWAVE_IMAGE },
    { title: 'Sub-Bass Workout', desc: 'Trap 808s and heavyweight kicks', color: 'from-rose-600 to-amber-700', img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600' },
    { title: 'Monsoon Chai Chill', desc: 'Acoustic fingerpicking & soft rain', color: 'from-cyan-600 to-blue-900', img: ALBUM_SOUNDSCAPE_IMAGE },
    { title: 'Coding Flow State', desc: 'Continuous lo-fi beats with zero lyric clutter', color: 'from-emerald-600 to-teal-900', img: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600' },
  ];

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-9 pb-24">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
            Curated Discovery
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
          Discover New Soundwaves
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Handpicked editorial selections, rising indie producers, and soundscapes from across the subcontinent and beyond.
        </p>
      </div>

      {/* Mood Radar Bento Cards */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold font-display text-white">
          Select Your Sonic Mood
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {moods.map((m, i) => (
            <div
              key={i}
              onClick={() => {
                setSelectedPlaylistId(playlists[i % playlists.length].id);
                setActiveView('playlist');
              }}
              className="relative h-44 rounded-2xl overflow-hidden cursor-pointer group shadow-xl border border-white/[0.08] transition-all hover:scale-[1.02]"
            >
              <img
                src={m.img}
                alt={m.title}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${m.color} opacity-80 mix-blend-multiply`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end">
                <h3 className="text-base font-bold text-white mb-0.5">
                  {m.title}
                </h3>
                <p className="text-[11px] text-white/80 line-clamp-1">
                  {m.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Rising Artists Spotlight */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold font-display text-white">
              Rising Independent Artists
            </h2>
            <p className="text-xs text-slate-400">
              Fresh talent gaining rapid algorithmic velocity
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {artists.map((art) => (
            <div
              key={art.id}
              onClick={() => {
                setSelectedArtistId(art.id);
                setActiveView('artist');
              }}
              className="p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] transition-all text-center cursor-pointer group"
            >
              <img
                src={art.avatarUrl}
                alt={art.name}
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-full object-cover mx-auto mb-2 ring-1 ring-white/10 group-hover:ring-violet-500 transition-all shadow-md"
              />
              <h4 className="text-xs font-bold text-white truncate">
                {art.name}
              </h4>
              <p className="text-[10px] text-slate-400 truncate">
                {(art.monthlyListeners / 1000).toFixed(0)}k listeners
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Curated Editorial Playlists */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold font-display text-white">
              BASSnBEATS Editorial Series
            </h2>
            <p className="text-xs text-slate-400">
              Flagship mixes curated and mastered by our sound engineers
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {playlists.map((pl) => (
            <div
              key={pl.id}
              onClick={() => {
                setSelectedPlaylistId(pl.id);
                setActiveView('playlist');
              }}
              className="p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden mb-3 shadow-lg">
                <img
                  src={pl.coverUrl}
                  alt={pl.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const trackList = tracks.filter((t) => pl.trackIds.includes(t.id));
                    if (trackList.length > 0) playTrack(trackList[0], trackList);
                  }}
                  className="absolute bottom-2.5 right-2.5 w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-xl transition-all hover:scale-105"
                >
                  <Play className="w-4 h-4 fill-white translate-x-0.5" />
                </button>
              </div>

              <div>
                <h3 className="text-xs font-bold text-white truncate mb-1">
                  {pl.title}
                </h3>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  {pl.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
