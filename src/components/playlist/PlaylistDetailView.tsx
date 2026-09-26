import React, { useState } from 'react';
import { useStore } from '../../services/store';
import { formatTime } from '../../utils/formatters';
import {
  Clock,
  Download,
  FolderHeart,
  Heart,
  ListPlus,
  MoreHorizontal,
  Play,
  Share2,
  Shuffle,
  Trash2,
} from 'lucide-react';

export const PlaylistDetailView: React.FC = () => {
  const {
    selectedPlaylistId,
    playlists,
    tracks,
    playTrack,
    currentTrack,
    isPlaying,
    likedTrackIds,
    toggleLikeTrack,
    deletePlaylist,
    removeTrackFromPlaylist,
    user,
    openShareModal,
    downloadTrack,
    downloadedTracks,
    addToQueue,
    playNextInQueue,
    openAddToPlaylist,
  } = useStore();

  const [activeMenuTrackId, setActiveMenuTrackId] = useState<string | null>(null);

  const playlist = playlists.find((p) => p.id === selectedPlaylistId) || playlists[0];
  const playlistTracks = tracks.filter((t) => playlist.trackIds.includes(t.id));
  const totalDuration = playlistTracks.reduce((acc, t) => acc + t.duration, 0);
  const isOwner = user?.id === playlist.ownerId || playlist.ownerId === 'usr-1';

  const handlePlayAll = (shuffle = false) => {
    if (playlistTracks.length === 0) return;
    let list = [...playlistTracks];
    if (shuffle) {
      list = list.sort(() => Math.random() - 0.5);
    }
    playTrack(list[0], list);
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 pb-24">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 sm:gap-8 pt-4">
        <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden shadow-2xl shadow-violet-950/50 shrink-0 ring-1 ring-white/10">
          <img
            src={playlist.coverUrl}
            alt={playlist.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-2.5 text-center md:text-left flex-1 min-w-0">
          <span className="text-xs font-bold uppercase tracking-wider text-violet-400">
            {playlist.isPublic ? 'Public Playlist' : 'Private Playlist'}
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-display text-white tracking-tight truncate">
            {playlist.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl line-clamp-2">
            {playlist.description}
          </p>

          <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-slate-400 font-mono-tabular pt-1">
            <span className="font-semibold text-slate-200">{playlist.ownerName}</span>
            <span>·</span>
            <span>{playlistTracks.length} tracks</span>
            <span>·</span>
            <span>{Math.round(totalDuration / 60)} mins</span>
          </div>
        </div>
      </div>

      {/* Action Controls Bar */}
      <div className="flex items-center gap-4 py-2 border-b border-white/[0.06]">
        <button
          onClick={() => handlePlayAll(false)}
          className="w-13 h-13 rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 hover:scale-105 active:scale-95 transition-transform flex items-center justify-center text-white shadow-xl shadow-violet-900/40"
          title="Play All"
        >
          <Play className="w-6 h-6 fill-white translate-x-0.5" />
        </button>

        <button
          onClick={() => handlePlayAll(true)}
          className="p-3 rounded-full hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors"
          title="Shuffle Playlist"
        >
          <Shuffle className="w-5 h-5" />
        </button>

        <button
          onClick={() =>
            openShareModal(
              playlist.title,
              `Curated by ${playlist.ownerName}`,
              `https://bassnbeats.app/playlist/${playlist.id}`
            )
          }
          className="p-3 rounded-full hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors"
          title="Share Playlist"
        >
          <Share2 className="w-5 h-5" />
        </button>

        {isOwner && (
          <button
            onClick={() => {
              if (confirm(`Delete playlist "${playlist.title}"?`)) {
                deletePlaylist(playlist.id);
              }
            }}
            className="p-3 rounded-full hover:bg-white/[0.08] text-slate-400 hover:text-rose-400 transition-colors"
            title="Delete Playlist"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Tracklist Table */}
      <div className="space-y-1">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-3 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-white/[0.06]">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-6 sm:col-span-5">Title</div>
          <div className="hidden sm:block col-span-4">Album</div>
          <div className="col-span-5 sm:col-span-2 text-right flex items-center justify-end gap-1">
            <Clock className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Track Rows */}
        {playlistTracks.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            This playlist has no tracks yet. Search for songs to add them!
          </div>
        ) : (
          playlistTracks.map((track, i) => {
            const isPlayingThis = currentTrack?.id === track.id && isPlaying;
            const isLiked = likedTrackIds.includes(track.id);
            const isDownloaded = downloadedTracks.some((d) => d.track.id === track.id);

            return (
              <div
                key={track.id}
                className={`grid grid-cols-12 gap-3 px-4 py-2.5 rounded-xl items-center text-xs transition-colors group relative ${
                  isPlayingThis ? 'bg-violet-600/15 text-violet-300' : 'hover:bg-white/[0.04] text-slate-300'
                }`}
              >
                {/* Index / Play Button */}
                <div className="col-span-1 text-center font-mono-tabular">
                  <span className="group-hover:hidden">{i + 1}</span>
                  <button
                    onClick={() => playTrack(track, playlistTracks)}
                    className="hidden group-hover:inline-block text-white"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                  </button>
                </div>

                {/* Track & Artist */}
                <div className="col-span-6 sm:col-span-5 flex items-center gap-3 min-w-0">
                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-lg object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <p className={`font-semibold truncate ${isPlayingThis ? 'text-violet-400' : 'text-white'}`}>
                      {track.title}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {track.artistName}
                    </p>
                  </div>
                </div>

                {/* Album */}
                <div className="hidden sm:block col-span-4 text-slate-400 truncate">
                  {track.albumTitle || 'Single'}
                </div>

                {/* Duration & Quick Actions */}
                <div className="col-span-5 sm:col-span-2 flex items-center justify-end gap-2 text-right">
                  <button
                    onClick={() => toggleLikeTrack(track.id)}
                    className={`p-1 hover:text-white ${isLiked ? 'text-rose-500' : 'text-slate-500 opacity-0 group-hover:opacity-100'}`}
                    title={isLiked ? 'Unlike' : 'Like'}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500' : ''}`} />
                  </button>

                  <button
                    onClick={() => downloadTrack(track)}
                    className={`p-1 hover:text-white ${isDownloaded ? 'text-cyan-400' : 'text-slate-500 opacity-0 group-hover:opacity-100'}`}
                    title="Download"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() =>
                      setActiveMenuTrackId(
                        activeMenuTrackId === track.id ? null : track.id
                      )
                    }
                    className="p-1 text-slate-500 hover:text-white opacity-0 group-hover:opacity-100"
                    title="More"
                  >
                    <MoreHorizontal className="w-3.5 h-3.5" />
                  </button>

                  <span className="font-mono-tabular text-slate-400 w-10">
                    {formatTime(track.duration)}
                  </span>
                </div>

                {/* Dropdown Menu for Track */}
                {activeMenuTrackId === track.id && (
                  <div className="absolute right-6 top-10 z-30 w-44 rounded-xl bg-[#141624] border border-white/[0.1] shadow-2xl p-1 text-xs text-slate-200">
                    <button
                      onClick={() => {
                        addToQueue(track);
                        setActiveMenuTrackId(null);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-white/[0.08] flex items-center gap-2"
                    >
                      <ListPlus className="w-3.5 h-3.5" />
                      <span>Add to Queue</span>
                    </button>
                    <button
                      onClick={() => {
                        playNextInQueue(track);
                        setActiveMenuTrackId(null);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-white/[0.08] flex items-center gap-2"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Play Next</span>
                    </button>
                    <button
                      onClick={() => {
                        openAddToPlaylist(track);
                        setActiveMenuTrackId(null);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-white/[0.08] flex items-center gap-2"
                    >
                      <FolderHeart className="w-3.5 h-3.5" />
                      <span>Add to Playlist</span>
                    </button>
                    {isOwner && (
                      <button
                        onClick={() => {
                          removeTrackFromPlaylist(playlist.id, track.id);
                          setActiveMenuTrackId(null);
                        }}
                        className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-rose-500/20 text-rose-400 flex items-center gap-2"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove from Playlist</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
