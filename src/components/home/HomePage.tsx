import React from 'react';
import { useStore } from '../../services/store';
import { getTimeGreeting } from '../../utils/formatters';
import { Play } from 'lucide-react';
import { HERO_BANNER_IMAGE } from '../../data/seedData';

export const HomePage: React.FC = () => {
  const {
    user,
    tracks,
    playlists,
    artists,
    albums,
    playTrack,
    currentTrack,
    isPlaying,
    setActiveView,
    setSelectedPlaylistId,
    setSelectedArtistId,
    setSelectedAlbumId,
  } = useStore();

  const greeting = getTimeGreeting();
  const userName = user?.name ? user.name.split(' ')[0] : 'Music Lover';

  // Quick resume items (mix of playlists & top tracks)
  const quickItems = [
    { id: playlists[0].id, title: playlists[0].title, image: playlists[0].coverUrl, type: 'playlist' },
    { id: playlists[1].id, title: playlists[1].title, image: playlists[1].coverUrl, type: 'playlist' },
    { id: playlists[2].id, title: playlists[2].title, image: playlists[2].coverUrl, type: 'playlist' },
    { id: tracks[0].id, title: tracks[0].title, image: tracks[0].coverUrl, type: 'track', track: tracks[0] },
    { id: tracks[3].id, title: tracks[3].title, image: tracks[3].coverUrl, type: 'track', track: tracks[3] },
    { id: tracks[11].id, title: tracks[11].title, image: tracks[11].coverUrl, type: 'track', track: tracks[11] },
  ];

  return (
    <div className="p-4 sm:p-8 space-y-9 max-w-7xl mx-auto pb-24">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-white/[0.08] shadow-2xl bg-gradient-to-r from-violet-950/60 via-[#10121d] to-[#0a0c14] p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="relative z-10 max-w-xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-xs font-semibold uppercase tracking-widest text-cyan-300">
              Personalized Audio Stream
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-white tracking-tight leading-tight">
            {greeting}, {userName}.
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Your customized Daily Mix is freshly tuned with heavy bass frequencies, South Indian folk fusions, and late-night synthwave.
          </p>
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => playTrack(tracks[0], tracks)}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 hover:opacity-95 text-xs font-bold text-white shadow-lg shadow-violet-900/40 transition-transform active:scale-95 flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Resume Playback</span>
            </button>
            <button
              onClick={() => setActiveView('discover')}
              className="px-5 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-xs font-semibold text-slate-200 transition-colors"
            >
              Explore Radar
            </button>
          </div>
        </div>

        <div className="relative w-full md:w-72 h-44 rounded-2xl overflow-hidden shadow-xl ring-1 ring-white/10 shrink-0">
          <img
            src={HERO_BANNER_IMAGE}
            alt="Hero Banner"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
            <span className="text-xs font-bold text-white">BASSnBEATS Curated</span>
          </div>
        </div>
      </div>

      {/* Quick Resume Grid (6 items) */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickItems.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                if (item.type === 'track' && item.track) {
                  playTrack(item.track);
                } else {
                  setSelectedPlaylistId(item.id);
                  setActiveView('playlist');
                }
              }}
              className="group flex items-center justify-between p-2 pr-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] transition-all cursor-pointer shadow-sm overflow-hidden"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-lg object-cover shrink-0 shadow-md"
                />
                <span className="text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-white truncate">
                  {item.title}
                </span>
              </div>
              <button
                className="w-9 h-9 rounded-full bg-violet-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md hover:scale-105 shrink-0"
                title="Play"
              >
                <Play className="w-4 h-4 fill-white translate-x-0.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Made For You / Daily Mix */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold font-display text-white">
              Made For You
            </h2>
            <p className="text-xs text-slate-400">
              Algorithmic playlists customized from your listening patterns
            </p>
          </div>
          <button
            onClick={() => setActiveView('discover')}
            className="text-xs text-violet-400 hover:text-violet-300 font-semibold transition-colors"
          >
            See all
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {playlists.slice(0, 5).map((pl) => (
            <div
              key={pl.id}
              onClick={() => {
                setSelectedPlaylistId(pl.id);
                setActiveView('playlist');
              }}
              className="group p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.05] transition-all cursor-pointer flex flex-col justify-between"
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
                  className="absolute bottom-2.5 right-2.5 w-10 h-10 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-xl transition-all hover:scale-105"
                  title="Play Playlist"
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

      {/* Trending Now (Tracks with plays) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold font-display text-white">
              Trending Tracks
            </h2>
            <p className="text-xs text-slate-400">
              Hottest streams on the BASSnBEATS network right now
            </p>
          </div>
          <button
            onClick={() => setActiveView('discover')}
            className="text-xs text-violet-400 hover:text-violet-300 font-semibold transition-colors"
          >
            See all
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {tracks.slice(0, 6).map((track, i) => {
            const isThisPlaying = currentTrack?.id === track.id && isPlaying;
            return (
              <div
                key={track.id}
                onClick={() => playTrack(track, tracks)}
                className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer group ${
                  isThisPlaying
                    ? 'bg-violet-600/15 border-violet-500/30'
                    : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.06]'
                }`}
              >
                <div className="w-5 text-center text-xs font-mono-tabular text-slate-500">
                  {i + 1}
                </div>

                <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 shadow-md">
                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play className="w-4 h-4 fill-white text-white" />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <p className={`text-xs font-semibold truncate ${isThisPlaying ? 'text-violet-400' : 'text-white'}`}>
                    {track.title}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {track.artistName}
                  </p>
                </div>

                <span className="text-[11px] text-slate-500 font-mono-tabular shrink-0">
                  {(track.plays / 1000).toFixed(0)}k plays
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Artists */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold font-display text-white">
              Featured Artists
            </h2>
            <p className="text-xs text-slate-400">
              Producers, composers, and performers pushing sonic boundaries
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {artists.slice(0, 6).map((art) => (
            <div
              key={art.id}
              onClick={() => {
                setSelectedArtistId(art.id);
                setActiveView('artist');
              }}
              className="p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] transition-all cursor-pointer text-center group"
            >
              <div className="relative aspect-square rounded-full overflow-hidden mb-3 mx-auto max-w-[130px] ring-2 ring-white/10 group-hover:ring-violet-500/50 transition-all shadow-lg">
                <img
                  src={art.avatarUrl}
                  alt={art.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <h4 className="text-xs font-bold text-white truncate mb-0.5">
                {art.name}
              </h4>
              <p className="text-[10px] text-slate-400 truncate">
                Artist
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Albums */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold font-display text-white">
              Popular Albums
            </h2>
            <p className="text-xs text-slate-400">
              Full-length conceptual records and EP masterpieces
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {albums.map((alb) => (
            <div
              key={alb.id}
              onClick={() => {
                setSelectedAlbumId(alb.id);
                setActiveView('album');
              }}
              className="p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] transition-all cursor-pointer group"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden mb-3 shadow-lg">
                <img
                  src={alb.coverUrl}
                  alt={alb.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <h4 className="text-xs font-bold text-white truncate mb-0.5">
                {alb.title}
              </h4>
              <p className="text-[10px] text-slate-400 truncate">
                {alb.artistName} · {alb.releaseDate.split('-')[0]}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
