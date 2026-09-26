import React from 'react';
import { useStore } from '../../services/store';
import { Logo } from '../common/Logo';
import {
  BarChart3,
  Compass,
  DownloadCloud,
  Headphones,
  Heart,
  Home,
  Library,
  PlusCircle,
  Radio,
  Search,
  Settings,
  Sparkles,
  WifiOff,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    playlists,
    userPlaylists,
    likedTrackIds,
    downloadedTracks,
    selectedPlaylistId,
    setSelectedPlaylistId,
    setIsCreatePlaylistOpen,
    isOfflineMode,
    toggleOfflineMode,
    audioQuality,
  } = useStore();

  const handlePlaylistClick = (playlistId: string) => {
    setSelectedPlaylistId(playlistId);
    setActiveView('playlist');
  };

  return (
    <aside className="w-64 bg-[#0a0c14] border-r border-white/[0.06] flex flex-col h-screen select-none shrink-0 z-20">
      {/* Brand Header */}
      <div className="p-5 pb-3">
        <div onClick={() => setActiveView('home')}>
          <Logo size="md" withTagline={true} />
        </div>
      </div>

      {/* Offline Mode Alert banner if active */}
      {isOfflineMode && (
        <div className="mx-4 mb-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs text-amber-300">
          <div className="flex items-center gap-2">
            <WifiOff className="w-3.5 h-3.5" />
            <span className="font-medium">Offline Mode</span>
          </div>
          <button
            onClick={toggleOfflineMode}
            className="text-[11px] underline hover:text-amber-200"
          >
            Go Online
          </button>
        </div>
      )}

      {/* Primary Navigation */}
      <div className="px-3 py-2 space-y-1">
        <button
          onClick={() => setActiveView('home')}
          className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            activeView === 'home'
              ? 'bg-violet-600/15 text-violet-400 font-semibold border border-violet-500/20'
              : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
          }`}
        >
          <Home className={`w-4 h-4 ${activeView === 'home' ? 'text-violet-400' : 'text-slate-400'}`} />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveView('search')}
          className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            activeView === 'search'
              ? 'bg-violet-600/15 text-violet-400 font-semibold border border-violet-500/20'
              : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
          }`}
        >
          <Search className={`w-4 h-4 ${activeView === 'search' ? 'text-violet-400' : 'text-slate-400'}`} />
          <span>Search</span>
        </button>

        <button
          onClick={() => setActiveView('discover')}
          className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            activeView === 'discover'
              ? 'bg-violet-600/15 text-violet-400 font-semibold border border-violet-500/20'
              : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
          }`}
        >
          <Compass className={`w-4 h-4 ${activeView === 'discover' ? 'text-violet-400' : 'text-slate-400'}`} />
          <span>Discover</span>
        </button>

        <button
          onClick={() => setActiveView('library')}
          className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            activeView === 'library'
              ? 'bg-violet-600/15 text-violet-400 font-semibold border border-violet-500/20'
              : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
          }`}
        >
          <Library className={`w-4 h-4 ${activeView === 'library' ? 'text-violet-400' : 'text-slate-400'}`} />
          <span>Your Library</span>
        </button>
      </div>

      <div className="h-px bg-white/[0.06] mx-4 my-2"></div>

      {/* Curated Subsections */}
      <div className="px-3 py-1 space-y-1">
        <button
          onClick={() => setActiveView('liked')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
            activeView === 'liked'
              ? 'bg-rose-500/15 text-rose-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white">
              <Heart className="w-3 h-3 fill-white" />
            </div>
            <span>Liked Songs</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono-tabular">
            {likedTrackIds.length}
          </span>
        </button>

        <button
          onClick={() => setActiveView('downloads')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
            activeView === 'downloads'
              ? 'bg-cyan-500/15 text-cyan-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white">
              <DownloadCloud className="w-3 h-3" />
            </div>
            <span>Downloads</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono-tabular">
            {downloadedTracks.length}
          </span>
        </button>

        <button
          onClick={() => setActiveView('jam')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
            activeView === 'jam'
              ? 'bg-emerald-500/15 text-emerald-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white">
              <Radio className="w-3 h-3" />
            </div>
            <span>Live Jam Room</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </button>

        <button
          onClick={() => setActiveView('stats')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
            activeView === 'stats'
              ? 'bg-violet-500/15 text-violet-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center text-white">
              <BarChart3 className="w-3 h-3" />
            </div>
            <span>Listening Stats</span>
          </div>
        </button>
      </div>

      <div className="h-px bg-white/[0.06] mx-4 my-2"></div>

      {/* Playlists Header */}
      <div className="px-4 py-1.5 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Playlists
        </span>
        <button
          onClick={() => setIsCreatePlaylistOpen(true)}
          className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/[0.06] transition-colors"
          title="Create Playlist"
        >
          <PlusCircle className="w-4 h-4" />
        </button>
      </div>

      {/* Playlist Scroll List */}
      <div className="flex-1 overflow-y-auto px-3 py-1 space-y-0.5">
        {userPlaylists.map((pl) => (
          <button
            key={pl.id}
            onClick={() => handlePlaylistClick(pl.id)}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs truncate transition-colors flex items-center justify-between group ${
              activeView === 'playlist' && selectedPlaylistId === pl.id
                ? 'bg-white/[0.08] text-white font-medium'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
            }`}
          >
            <span className="truncate">{pl.title}</span>
            <span className="text-[10px] text-slate-600 group-hover:text-slate-500 font-mono-tabular shrink-0 ml-2">
              {pl.trackIds.length} tracks
            </span>
          </button>
        ))}

        <div className="pt-2 pb-1">
          <span className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
            Curated For You
          </span>
        </div>

        {playlists.slice(0, 5).map((pl) => (
          <button
            key={pl.id}
            onClick={() => handlePlaylistClick(pl.id)}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs truncate transition-colors flex items-center justify-between group ${
              activeView === 'playlist' && selectedPlaylistId === pl.id
                ? 'bg-white/[0.08] text-white font-medium'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
            }`}
          >
            <span className="truncate">{pl.title}</span>
          </button>
        ))}
      </div>

      {/* Bottom Footer Info */}
      <div className="p-3 bg-white/[0.02] border-t border-white/[0.06] space-y-2">
        <div className="flex items-center justify-between text-xs px-2 text-slate-400">
          <span className="flex items-center gap-1.5 text-[11px]">
            <Headphones className="w-3.5 h-3.5 text-violet-400" />
            <span className="uppercase font-semibold tracking-wider text-slate-400">Stream</span>
          </span>
          <span className="px-1.5 py-0.5 rounded bg-violet-950/60 border border-violet-500/30 text-[10px] font-bold text-violet-300 uppercase tracking-wide">
            {audioQuality}
          </span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => setActiveView('settings')}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Settings</span>
          </button>

          <button
            onClick={() => setActiveView('subscription')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-cyan-300 hover:text-cyan-200 bg-cyan-950/40 hover:bg-cyan-950/60 border border-cyan-800/40 transition-colors"
          >
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Plans</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
