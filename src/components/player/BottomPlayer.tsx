import React, { useEffect } from 'react';
import { useStore } from '../../services/store';
import { formatTime } from '../../utils/formatters';
import {
  Download,
  Heart,
  ListMusic,
  Maximize2,
  Mic2,
  MoreHorizontal,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Share2,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from 'lucide-react';

export const BottomPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    audioQuality,
    togglePlayPause,
    seek,
    nextTrack,
    prevTrack,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeat,
    likedTrackIds,
    toggleLikeTrack,
    isLyricsOpen,
    setIsLyricsOpen,
    isQueueDrawerOpen,
    setIsQueueDrawerOpen,
    setIsNowPlayingOpen,
    openShareModal,
    openAddToPlaylist,
    downloadTrack,
    downloadedTracks,
  } = useStore();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input/textarea
      if (
        ['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName) ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.code === 'ArrowRight') {
        seek(Math.min(duration, currentTime + 5));
      } else if (e.code === 'ArrowLeft') {
        seek(Math.max(0, currentTime - 5));
      } else if (e.key.toLowerCase() === 'm') {
        toggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlayPause, seek, toggleMute, currentTime, duration]);

  if (!currentTrack) return null;

  const isLiked = likedTrackIds.includes(currentTrack.id);
  const isDownloaded = downloadedTracks.some((d) => d.track.id === currentTrack.id);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0d0f18]/95 backdrop-blur-2xl border-t border-white/[0.08] text-white select-none shadow-2xl">
      {/* Mobile Top Thin Progress Line */}
      <div
        className="md:hidden w-full h-1 bg-white/[0.1] cursor-pointer"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const pct = clickX / rect.width;
          seek(pct * duration);
        }}
      >
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-cyan-400"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="max-w-[1920px] mx-auto px-4 py-2.5 md:py-3 flex items-center justify-between gap-2 md:gap-6">
        {/* Left: Track Info & Artwork */}
        <div className="flex items-center gap-3.5 min-w-0 w-1/3 md:w-1/4">
          <div
            onClick={() => setIsNowPlayingOpen(true)}
            className="relative w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden shrink-0 group cursor-pointer shadow-md shadow-black/50"
          >
            <img
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Maximize2 className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsNowPlayingOpen(true)}
                className="text-xs md:text-sm font-semibold text-white hover:underline truncate text-left"
              >
                {currentTrack.title}
              </button>
              {currentTrack.isExplicit && (
                <span className="px-1 py-0.2 rounded bg-white/10 text-[9px] font-bold text-slate-400 shrink-0">
                  E
                </span>
              )}
            </div>
            <p className="text-[11px] md:text-xs text-slate-400 truncate">
              {currentTrack.artistName}
            </p>
          </div>

          <button
            onClick={() => toggleLikeTrack(currentTrack.id)}
            className={`p-1.5 rounded-full hover:bg-white/[0.08] transition-colors shrink-0 ${
              isLiked ? 'text-rose-500' : 'text-slate-400 hover:text-white'
            }`}
            title={isLiked ? 'Unlike' : 'Like'}
          >
            <Heart className={`w-4 h-4 md:w-5 md:h-5 ${isLiked ? 'fill-rose-500' : ''}`} />
          </button>
        </div>

        {/* Center: Controls & Scrub Bar (Desktop) */}
        <div className="flex flex-col items-center gap-1.5 w-full md:w-2/4 max-w-2xl">
          {/* Main Controls */}
          <div className="flex items-center gap-4 md:gap-6">
            <button
              onClick={toggleShuffle}
              className={`hidden sm:block p-1.5 rounded-full transition-colors ${
                isShuffle ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
              }`}
              title="Shuffle"
            >
              <Shuffle className="w-4 h-4" />
            </button>

            <button
              onClick={prevTrack}
              className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/[0.08] transition-colors"
              title="Previous"
            >
              <SkipBack className="w-4 h-4 md:w-5 md:h-5 fill-current" />
            </button>

            <button
              onClick={togglePlayPause}
              className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 hover:scale-105 active:scale-95 transition-transform flex items-center justify-center text-white shadow-lg shadow-violet-900/40"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-white" />
              ) : (
                <Play className="w-5 h-5 fill-white translate-x-0.5" />
              )}
            </button>

            <button
              onClick={nextTrack}
              className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/[0.08] transition-colors"
              title="Next"
            >
              <SkipForward className="w-4 h-4 md:w-5 md:h-5 fill-current" />
            </button>

            <button
              onClick={cycleRepeat}
              className={`hidden sm:block p-1.5 rounded-full transition-colors ${
                repeatMode !== 'off' ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
              }`}
              title={`Repeat: ${repeatMode}`}
            >
              {repeatMode === 'one' ? (
                <Repeat1 className="w-4 h-4" />
              ) : (
                <Repeat className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Time & Scrubber (Desktop) */}
          <div className="hidden md:flex items-center gap-3 w-full text-[11px] text-slate-400 font-mono-tabular">
            <span className="w-9 text-right">{formatTime(currentTime)}</span>
            <div
              className="flex-1 h-1.5 bg-white/[0.12] hover:h-2 rounded-full cursor-pointer relative group transition-all"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const pct = clickX / rect.width;
                seek(pct * duration);
              }}
            >
              <div
                className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 rounded-full relative"
                style={{ width: `${progressPercent}%` }}
              >
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"></span>
              </div>
            </div>
            <span className="w-9 text-left">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: Audio Quality, Lyrics, Queue, Volume, Actions */}
        <div className="flex items-center justify-end gap-2 md:gap-3 w-1/3 md:w-1/4">
          {/* Audio Quality indicator */}
          <div className="hidden xl:flex items-center">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-violet-950/70 border border-violet-500/30 text-violet-300">
              {audioQuality === 'lossless' ? 'Hi-Res Lossless' : `${audioQuality} 320k`}
            </span>
          </div>

          <button
            onClick={() => setIsLyricsOpen(!isLyricsOpen)}
            className={`p-2 rounded-lg transition-colors ${
              isLyricsOpen
                ? 'bg-violet-600/30 text-violet-400 border border-violet-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
            }`}
            title="Lyrics"
          >
            <Mic2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsQueueDrawerOpen(!isQueueDrawerOpen)}
            className={`p-2 rounded-lg transition-colors ${
              isQueueDrawerOpen
                ? 'bg-violet-600/30 text-violet-400 border border-violet-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
            }`}
            title="Queue"
          >
            <ListMusic className="w-4 h-4" />
          </button>

          {/* Volume Control (Desktop) */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="text-slate-400 hover:text-white p-1"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-20 h-1 bg-white/[0.15] accent-violet-400 rounded-lg cursor-pointer"
            />
          </div>

          {/* Extra Track Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => downloadTrack(currentTrack)}
              className={`p-2 rounded-lg transition-colors ${
                isDownloaded
                  ? 'text-cyan-400'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
              }`}
              title={isDownloaded ? 'Downloaded' : 'Download for Offline'}
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={() =>
                openShareModal(
                  currentTrack.title,
                  currentTrack.artistName,
                  `https://bassnbeats.app/track/${currentTrack.id}`
                )
              }
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => openAddToPlaylist(currentTrack)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              title="Add to Playlist"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
