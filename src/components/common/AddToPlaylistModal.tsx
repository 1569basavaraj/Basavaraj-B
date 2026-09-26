import React, { useState } from 'react';
import { useStore } from '../../services/store';
import { Check, Plus, X } from 'lucide-react';

export const AddToPlaylistModal: React.FC = () => {
  const {
    isAddToPlaylistOpen,
    setIsAddToPlaylistOpen,
    trackToAddToPlaylist,
    userPlaylists,
    addTrackToPlaylist,
    setIsCreatePlaylistOpen,
  } = useStore();

  const [addedIds, setAddedIds] = useState<string[]>([]);

  if (!isAddToPlaylistOpen || !trackToAddToPlaylist) return null;

  const handleToggle = (playlistId: string) => {
    addTrackToPlaylist(playlistId, trackToAddToPlaylist.id);
    setAddedIds((prev) => [...prev, playlistId]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#12141e] border border-white/[0.1] rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-5 text-white animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <h3 className="text-sm font-bold font-display text-white">
            Add to Playlist
          </h3>
          <button
            onClick={() => setIsAddToPlaylistOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-3">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.04] mb-3">
            <img
              src={trackToAddToPlaylist.coverUrl}
              alt={trackToAddToPlaylist.title}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-lg object-cover"
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {trackToAddToPlaylist.title}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {trackToAddToPlaylist.artistName}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsAddToPlaylistOpen(false);
              setIsCreatePlaylistOpen(true);
            }}
            className="w-full flex items-center gap-2.5 p-2.5 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-xs font-medium text-violet-300 transition-colors mb-3"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Playlist</span>
          </button>

          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-1 mb-2">
            Your Playlists
          </p>

          <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
            {userPlaylists.length === 0 ? (
              <p className="text-xs text-slate-500 py-3 text-center">
                No user playlists yet. Create one above!
              </p>
            ) : (
              userPlaylists.map((pl) => {
                const isAlreadyIn =
                  pl.trackIds.includes(trackToAddToPlaylist.id) ||
                  addedIds.includes(pl.id);

                return (
                  <button
                    key={pl.id}
                    onClick={() => handleToggle(pl.id)}
                    disabled={isAlreadyIn}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors text-left group"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-medium text-slate-200 truncate">
                        {pl.title}
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono-tabular">
                        {pl.trackIds.length} tracks
                      </p>
                    </div>

                    {isAlreadyIn ? (
                      <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium shrink-0">
                        <Check className="w-3.5 h-3.5" />
                        <span>Added</span>
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 group-hover:text-white shrink-0">
                        + Add
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="pt-2 border-t border-white/[0.08] flex justify-end">
          <button
            onClick={() => setIsAddToPlaylistOpen(false)}
            className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-xs font-semibold text-white transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
