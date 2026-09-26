import React from 'react';
import { useStore } from '../../services/store';
import { formatTime } from '../../utils/formatters';
import {
  ArrowDown,
  ArrowUp,
  BookmarkPlus,
  Play,
  Shuffle,
  Trash2,
  X,
} from 'lucide-react';

export const QueueDrawer: React.FC = () => {
  const {
    queue,
    queueIndex,
    currentTrack,
    playTrack,
    removeFromQueue,
    clearQueue,
    reorderQueue,
    toggleShuffle,
    isShuffle,
    isQueueDrawerOpen,
    setIsQueueDrawerOpen,
    createPlaylist,
    openAddToPlaylist,
  } = useStore();

  if (!isQueueDrawerOpen) return null;

  const nowPlaying = currentTrack || queue[queueIndex];
  const upcomingTracks = queue.slice(queueIndex + 1);

  const handleSaveQueueAsPlaylist = () => {
    const pl = createPlaylist(
      `Queue Mix · ${new Date().toLocaleDateString()}`,
      `Created from active listening queue with ${queue.length} tracks`
    );
    // Add all queue tracks
    queue.forEach((t) => {
      openAddToPlaylist(t);
    });
    alert(`Saved ${queue.length} tracks as new playlist "${pl.title}"!`);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-[#0c0e17]/95 backdrop-blur-2xl border-l border-white/[0.08] text-white flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
      {/* Header */}
      <header className="px-5 py-4 flex items-center justify-between border-b border-white/[0.08]">
        <div>
          <h2 className="text-base font-bold font-display text-white">
            Play Queue
          </h2>
          <span className="text-xs text-slate-400 font-mono-tabular">
            {queue.length} tracks in queue
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={toggleShuffle}
            className={`p-2 rounded-lg transition-colors ${
              isShuffle ? 'text-cyan-400 bg-cyan-950/40' : 'text-slate-400 hover:text-white'
            }`}
            title="Shuffle Queue"
          >
            <Shuffle className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsQueueDrawerOpen(false)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Queue Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Now Playing Section */}
        {nowPlaying && (
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-violet-400 block mb-2.5">
              Now Playing
            </span>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-violet-600/10 border border-violet-500/20">
              <img
                src={nowPlaying.coverUrl}
                alt={nowPlaying.title}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white truncate">
                  {nowPlaying.title}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {nowPlaying.artistName}
                </p>
                <span className="text-[10px] text-violet-300 font-mono-tabular">
                  {formatTime(nowPlaying.duration)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Next In Queue */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Next Up ({upcomingTracks.length})
            </span>
            {queue.length > 1 && (
              <button
                onClick={clearQueue}
                className="text-[11px] text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>

          {upcomingTracks.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center italic">
              Queue is empty. Add songs from your library, search, or playlists!
            </p>
          ) : (
            <div className="space-y-1.5">
              {upcomingTracks.map((track, i) => {
                const actualIndex = queueIndex + 1 + i;
                return (
                  <div
                    key={`${track.id}-${actualIndex}`}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/[0.04] transition-colors group"
                  >
                    <button
                      onClick={() => playTrack(track, queue)}
                      className="relative w-9 h-9 rounded-md overflow-hidden shrink-0"
                    >
                      <img
                        src={track.coverUrl}
                        alt={track.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Play className="w-3.5 h-3.5 fill-white text-white" />
                      </div>
                    </button>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-slate-200 truncate">
                        {track.title}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {track.artistName}
                      </p>
                    </div>

                    <span className="text-[10px] text-slate-500 font-mono-tabular shrink-0">
                      {formatTime(track.duration)}
                    </span>

                    {/* Reorder Buttons */}
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      {i > 0 && (
                        <button
                          onClick={() => reorderQueue(actualIndex, actualIndex - 1)}
                          className="p-1 text-slate-400 hover:text-white"
                          title="Move up"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                      )}
                      {i < upcomingTracks.length - 1 && (
                        <button
                          onClick={() => reorderQueue(actualIndex, actualIndex + 1)}
                          className="p-1 text-slate-400 hover:text-white"
                          title="Move down"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        onClick={() => removeFromQueue(actualIndex)}
                        className="p-1 text-slate-400 hover:text-rose-400"
                        title="Remove"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer: Save Queue as Playlist */}
      <footer className="p-4 border-t border-white/[0.08] bg-white/[0.02]">
        <button
          onClick={handleSaveQueueAsPlaylist}
          disabled={queue.length === 0}
          className="w-full py-2.5 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] disabled:opacity-50 text-xs font-semibold text-slate-200 transition-colors flex items-center justify-center gap-2"
        >
          <BookmarkPlus className="w-4 h-4 text-violet-400" />
          <span>Save Queue as Playlist</span>
        </button>
      </footer>
    </div>
  );
};
