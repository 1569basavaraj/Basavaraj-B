import React, { useEffect, useRef } from 'react';
import { useStore } from '../../services/store';
import { ChevronDown, Maximize2, Minimize2, Music2, Play } from 'lucide-react';

export const LyricsView: React.FC = () => {
  const {
    currentTrack,
    currentTime,
    seek,
    isLyricsOpen,
    setIsLyricsOpen,
    isPlaying,
    togglePlayPause,
  } = useStore();

  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const activeLineRef = useRef<HTMLParagraphElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const lyrics = currentTrack?.lyrics || [];

  // Find the index of the currently active line
  let activeIndex = -1;
  for (let i = lyrics.length - 1; i >= 0; i--) {
    if (currentTime >= lyrics[i].time) {
      activeIndex = i;
      break;
    }
  }

  // Smooth auto-scroll to the active line
  useEffect(() => {
    if (activeLineRef.current && containerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeIndex]);

  if (!isLyricsOpen || !currentTrack) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#07080e]/95 backdrop-blur-3xl text-white flex flex-col transition-all duration-300 ${
        isFullscreen ? 'p-6 sm:p-12' : 'p-4 sm:p-8'
      }`}
    >
      {/* Dynamic Ambient Background Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-30 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-violet-600/30 rounded-full blur-[180px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-fuchsia-600/30 rounded-full blur-[180px]" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 flex items-center justify-between pb-6 max-w-4xl mx-auto w-full border-b border-white/[0.08]">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsLyricsOpen(false)}
            className="p-2 rounded-full hover:bg-white/[0.08] text-slate-300 hover:text-white transition-colors"
            title="Close Lyrics"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-base sm:text-lg font-bold font-display text-white">
              {currentTrack.title}
            </h2>
            <p className="text-xs text-slate-400">
              {currentTrack.artistName} · Timed Real-Time Lyrics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-full hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-5 h-5" />
            ) : (
              <Maximize2 className="w-5 h-5" />
            )}
          </button>
        </div>
      </header>

      {/* Center Lyrics Flow */}
      <main
        ref={containerRef}
        className="relative z-10 flex-1 overflow-y-auto max-w-3xl mx-auto w-full py-12 px-4 scroll-smooth space-y-7"
      >
        {lyrics.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center mb-4 text-violet-400">
              <Music2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-display text-white mb-2">
              Instrumental or No Lyrics Available
            </h3>
            <p className="text-sm text-slate-400 max-w-md">
              Enjoy the soundwaves and instrumental frequencies of "{currentTrack.title}".
            </p>
          </div>
        ) : (
          lyrics.map((line, idx) => {
            const isActive = idx === activeIndex;
            const isPast = idx < activeIndex;

            return (
              <p
                key={line.id}
                ref={isActive ? activeLineRef : null}
                onClick={() => seek(line.time)}
                className={`cursor-pointer transition-all duration-300 font-display select-none ${
                  isActive
                    ? 'text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-fuchsia-200 to-cyan-300 scale-[1.02] origin-left'
                    : isPast
                    ? 'text-lg sm:text-2xl font-semibold text-slate-300 opacity-60 hover:opacity-90'
                    : 'text-lg sm:text-2xl font-semibold text-slate-400 opacity-30 hover:opacity-75'
                }`}
              >
                {line.text}
              </p>
            );
          })
        )}

        {/* Copyright notice at bottom of lyrics */}
        {lyrics.length > 0 && currentTrack.lyricsCopyright && (
          <div className="pt-12 text-xs text-slate-400 border-t border-white/[0.06]">
            <p>{currentTrack.lyricsCopyright}</p>
            <p className="text-[11px] mt-1 text-slate-400">
              Licensed and synchronized by BASSnBEATS Content Registry.
            </p>
          </div>
        )}
      </main>

      {/* Floating mini-control pill */}
      <footer className="relative z-10 py-3 max-w-xs mx-auto w-full flex items-center justify-center">
        <button
          onClick={togglePlayPause}
          className="flex items-center gap-2 px-5 py-2 rounded-full bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white shadow-lg shadow-violet-900/40 transition-transform active:scale-95"
        >
          <Play className={`w-3.5 h-3.5 ${isPlaying ? 'fill-white' : ''}`} />
          <span>{isPlaying ? 'Pause Track' : 'Resume Track'}</span>
        </button>
      </footer>
    </div>
  );
};
