import React from 'react';
import { useStore } from '../../services/store';
import { formatBytes, formatTime } from '../../utils/formatters';
import { DownloadCloud, HardDrive, Play, Trash2, WifiOff } from 'lucide-react';

export const DownloadsView: React.FC = () => {
  const {
    downloadedTracks,
    removeDownload,
    clearDownloads,
    playTrack,
    currentTrack,
    isPlaying,
    isOfflineMode,
    toggleOfflineMode,
  } = useStore();

  const totalBytes = downloadedTracks.reduce((acc, d) => acc + d.fileSizeBytes, 0);

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 pb-24">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <DownloadCloud className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              Offline Storage
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            Downloaded Tracks
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Encrypted offline media saved directly to your browser device storage
          </p>
        </div>

        {/* Offline Mode Switch */}
        <button
          onClick={toggleOfflineMode}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            isOfflineMode
              ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-950/50'
              : 'bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 border border-white/[0.1]'
          }`}
        >
          <WifiOff className="w-4 h-4" />
          <span>{isOfflineMode ? 'Offline Mode Active' : 'Simulate Offline Mode'}</span>
        </button>
      </div>

      {/* Storage Bar Card */}
      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <HardDrive className="w-4 h-4 text-violet-400" />
            <span>Local Device Cache</span>
          </div>
          <span className="text-slate-400 font-mono-tabular">
            {formatBytes(totalBytes)} used of 5.0 GB allocated
          </span>
        </div>

        <div className="w-full h-2 rounded-full bg-white/[0.08] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full"
            style={{ width: `${Math.min(100, (totalBytes / (5 * 1024 * 1024 * 1024)) * 100 + 5)}%` }}
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-slate-500 font-mono-tabular">
            {downloadedTracks.length} tracks ready for offline playback
          </span>
          {downloadedTracks.length > 0 && (
            <button
              onClick={() => {
                if (confirm('Clear all offline downloaded tracks?')) clearDownloads();
              }}
              className="text-[11px] text-rose-400 hover:text-rose-300 transition-colors"
            >
              Clear Storage
            </button>
          )}
        </div>
      </div>

      {/* Downloads List */}
      <div className="space-y-2">
        {downloadedTracks.length === 0 ? (
          <div className="py-20 text-center space-y-2">
            <DownloadCloud className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">
              No downloaded tracks yet
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Tap the download icon on any song or album to save tracks for offline road trips, flights, or zero-reception areas.
            </p>
          </div>
        ) : (
          downloadedTracks.map(({ track, downloadedAt, fileSizeBytes, quality }, i) => {
            const isPlayingThis = currentTrack?.id === track.id && isPlaying;
            return (
              <div
                key={track.id}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                  isPlayingThis
                    ? 'bg-violet-600/15 border-violet-500/30'
                    : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.05]'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 shadow-md group">
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => playTrack(track, downloadedTracks.map((d) => d.track))}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                    >
                      <Play className="w-4 h-4 fill-white text-white" />
                    </button>
                  </div>

                  <div className="min-w-0">
                    <p className={`text-xs font-semibold truncate ${isPlayingThis ? 'text-violet-400' : 'text-white'}`}>
                      {track.title}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {track.artistName} · {quality.toUpperCase()} 320k
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono-tabular text-slate-400">
                  <span className="hidden sm:inline">{formatBytes(fileSizeBytes)}</span>
                  <span>{formatTime(track.duration)}</span>
                  <button
                    onClick={() => removeDownload(track.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Delete Download"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
