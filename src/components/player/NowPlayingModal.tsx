import React from 'react';
import { useStore } from '../../services/store';
import { formatTime } from '../../utils/formatters';
import { AudioVisualizer } from './AudioVisualizer';
import {
  ChevronDown,
  Download,
  Heart,
  ListMusic,
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
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';

export const NowPlayingModal: React.FC = () => {
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
    setAudioQuality,
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
    isNowPlayingOpen,
    setIsNowPlayingOpen,
    setIsLyricsOpen,
    setIsQueueDrawerOpen,
    openShareModal,
    openAddToPlaylist,
    downloadTrack,
    downloadedTracks,
    setActiveView,
    setSelectedArtistId,
  } = useStore();

  if (!isNowPlayingOpen || !currentTrack) return null;

  const isLiked = likedTrackIds.includes(currentTrack.id);
  const isDownloaded = downloadedTracks.some((d) => d.track.id === currentTrack.id);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 bg-[#090b12] text-white flex flex-col justify-between overflow-y-auto animate-in fade-in duration-200">
      {/* Dynamic Ambient Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-violet-600 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-fuchsia-600 rounded-full blur-[160px]" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-cyan-600 rounded-full blur-[150px]" />
      </div>

      {/* Top Bar */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 max-w-4xl mx-auto w-full">
        <button
          onClick={() => setIsNowPlayingOpen(false)}
          className="p-2 rounded-full hover:bg-white/[0.08] text-slate-300 hover:text-white transition-colors"
          title="Minimize"
        >
          <ChevronDown className="w-6 h-6" />
        </button>

        <div className="text-center">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
            Playing From {currentTrack.albumTitle || 'BASSnBEATS Catalog'}
          </span>
          <p className="text-xs font-medium text-slate-200">
            {currentTrack.genre}
          </p>
        </div>

        <button
          onClick={() => openAddToPlaylist(currentTrack)}
          className="p-2 rounded-full hover:bg-white/[0.08] text-slate-300 hover:text-white transition-colors"
          title="Options"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </header>

      {/* Center Body: Large Artwork & Visualizer */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 max-w-md mx-auto w-full py-4">
        {/* Large Album Artwork */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-2xl overflow-hidden shadow-2xl shadow-violet-950/60 ring-1 ring-white/10 group mb-6">
          <img
            src={currentTrack.coverUrl}
            alt={currentTrack.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Audio Visualizer Wave */}
        <div className="w-full mb-4 px-2">
          <AudioVisualizer isPlaying={isPlaying} barCount={36} className="w-full h-8" />
        </div>

        {/* Track Title and Artist */}
        <div className="w-full flex items-center justify-between mb-4">
          <div className="min-w-0 flex-1 pr-4">
            <h1 className="text-xl sm:text-2xl font-bold font-display text-white truncate">
              {currentTrack.title}
            </h1>
            <button
              onClick={() => {
                setSelectedArtistId(currentTrack.artistId);
                setActiveView('artist');
                setIsNowPlayingOpen(false);
              }}
              className="text-sm font-medium text-slate-400 hover:text-violet-400 transition-colors truncate block text-left"
            >
              {currentTrack.artistName}
            </button>
          </div>

          <button
            onClick={() => toggleLikeTrack(currentTrack.id)}
            className={`p-2.5 rounded-full hover:bg-white/[0.08] transition-colors ${
              isLiked ? 'text-rose-500' : 'text-slate-400 hover:text-white'
            }`}
            title={isLiked ? 'Unlike' : 'Like'}
          >
            <Heart className={`w-6 h-6 ${isLiked ? 'fill-rose-500' : ''}`} />
          </button>
        </div>

        {/* Progress Slider */}
        <div className="w-full mb-5">
          <div
            className="w-full h-2 bg-white/[0.12] rounded-full cursor-pointer relative group"
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
              <span className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg"></span>
            </div>
          </div>
          <div className="flex justify-between text-xs text-slate-400 font-mono-tabular mt-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="w-full flex items-center justify-between px-2 mb-6">
          <button
            onClick={toggleShuffle}
            className={`p-2 rounded-full transition-colors ${
              isShuffle ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
            }`}
            title="Shuffle"
          >
            <Shuffle className="w-5 h-5" />
          </button>

          <button
            onClick={prevTrack}
            className="p-2 text-slate-300 hover:text-white transition-colors"
            title="Previous"
          >
            <SkipBack className="w-6 h-6 fill-current" />
          </button>

          <button
            onClick={togglePlayPause}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 hover:scale-105 active:scale-95 transition-transform flex items-center justify-center text-white shadow-xl shadow-violet-900/50"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 fill-white" />
            ) : (
              <Play className="w-7 h-7 fill-white translate-x-0.5" />
            )}
          </button>

          <button
            onClick={nextTrack}
            className="p-2 text-slate-300 hover:text-white transition-colors"
            title="Next"
          >
            <SkipForward className="w-6 h-6 fill-current" />
          </button>

          <button
            onClick={cycleRepeat}
            className={`p-2 rounded-full transition-colors ${
              repeatMode !== 'off' ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
            }`}
            title={`Repeat: ${repeatMode}`}
          >
            {repeatMode === 'one' ? (
              <Repeat1 className="w-5 h-5" />
            ) : (
              <Repeat className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Volume Slider */}
        <div className="w-full flex items-center gap-3 px-2 mb-6">
          <button
            onClick={toggleMute}
            className="text-slate-400 hover:text-white p-1"
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
            className="w-full h-1.5 bg-white/[0.15] accent-violet-400 rounded-lg cursor-pointer"
          />
        </div>
      </main>

      {/* Bottom Tray: Audio Quality, Lyrics, Queue, Share */}
      <footer className="relative z-10 px-6 py-4 bg-[#0a0c14]/90 border-t border-white/[0.08] max-w-4xl mx-auto w-full flex items-center justify-between">
        {/* Audio Quality selector */}
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <select
            value={audioQuality}
            onChange={(e) => setAudioQuality(e.target.value as any)}
            className="bg-white/[0.06] border border-white/[0.1] rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="low" className="bg-[#0f1118]">Low (96k)</option>
            <option value="normal" className="bg-[#0f1118]">Normal (192k)</option>
            <option value="high" className="bg-[#0f1118]">High (320k)</option>
            <option value="lossless" className="bg-[#0f1118]">Lossless (24-bit/96kHz)</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsNowPlayingOpen(false);
              setIsLyricsOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-xs font-medium text-slate-200 transition-colors"
          >
            <Mic2 className="w-3.5 h-3.5" />
            <span>Lyrics</span>
          </button>

          <button
            onClick={() => {
              setIsNowPlayingOpen(false);
              setIsQueueDrawerOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-xs font-medium text-slate-200 transition-colors"
          >
            <ListMusic className="w-3.5 h-3.5" />
            <span>Queue</span>
          </button>

          <button
            onClick={() => downloadTrack(currentTrack)}
            className={`p-2 rounded-lg hover:bg-white/[0.08] transition-colors ${
              isDownloaded ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
            }`}
            title="Download"
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
            className="p-2 rounded-lg hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
};
