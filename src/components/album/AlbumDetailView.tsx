import React from 'react';
import { useStore } from '../../services/store';
import { formatTime } from '../../utils/formatters';
import { Bookmark, Clock, Download, Heart, Play, Share2, Shuffle } from 'lucide-react';

export const AlbumDetailView: React.FC = () => {
  const {
    selectedAlbumId,
    albums,
    tracks,
    playTrack,
    currentTrack,
    isPlaying,
    savedAlbumIds,
    toggleSaveAlbum,
    likedTrackIds,
    toggleLikeTrack,
    setSelectedArtistId,
    setActiveView,
    openShareModal,
    downloadTrack,
    downloadedTracks,
  } = useStore();

  const album = albums.find((a) => a.id === selectedAlbumId) || albums[0];
  const isSaved = savedAlbumIds.includes(album.id);
  const albumTracks = tracks.filter((t) => album.trackIds.includes(t.id));
  const totalDuration = albumTracks.reduce((acc, t) => acc + t.duration, 0);

  const handlePlayAll = (shuffle = false) => {
    if (albumTracks.length === 0) return;
    let list = [...albumTracks];
    if (shuffle) list = list.sort(() => Math.random() - 0.5);
    playTrack(list[0], list);
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 pb-24">
      {/* Album Header */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 sm:gap-8 pt-4">
        <div className="w-52 h-52 sm:w-60 sm:h-60 rounded-3xl overflow-hidden shadow-2xl shadow-violet-950/60 shrink-0 ring-1 ring-white/10">
          <img
            src={album.coverUrl}
            alt={album.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-2 text-center md:text-left flex-1 min-w-0">
          <span className="text-xs font-bold uppercase tracking-wider text-violet-400">
            Album · {album.genre}
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-display text-white tracking-tight truncate">
            {album.title}
          </h1>

          <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-slate-300">
            <button
              onClick={() => {
                setSelectedArtistId(album.artistId);
                setActiveView('artist');
              }}
              className="font-bold text-white hover:underline"
            >
              {album.artistName}
            </button>
            <span>·</span>
            <span>{album.releaseDate.split('-')[0]}</span>
            <span>·</span>
            <span>{albumTracks.length} songs</span>
            <span>·</span>
            <span>{Math.round(totalDuration / 60)} minutes</span>
          </div>

          <p className="text-[11px] text-slate-500 font-mono-tabular">
            {album.label}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 py-2 border-b border-white/[0.06]">
        <button
          onClick={() => handlePlayAll(false)}
          className="w-13 h-13 rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 hover:scale-105 active:scale-95 transition-transform flex items-center justify-center text-white shadow-xl shadow-violet-900/40"
          title="Play Album"
        >
          <Play className="w-6 h-6 fill-white translate-x-0.5" />
        </button>

        <button
          onClick={() => handlePlayAll(true)}
          className="p-3 rounded-full hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors"
          title="Shuffle Album"
        >
          <Shuffle className="w-5 h-5" />
        </button>

        <button
          onClick={() => toggleSaveAlbum(album.id)}
          className={`p-3 rounded-full hover:bg-white/[0.08] transition-colors ${
            isSaved ? 'text-violet-400' : 'text-slate-400 hover:text-white'
          }`}
          title={isSaved ? 'Saved in Library' : 'Save to Library'}
        >
          <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-violet-400' : ''}`} />
        </button>

        <button
          onClick={() =>
            openShareModal(
              album.title,
              `Album by ${album.artistName}`,
              `https://bassnbeats.app/album/${album.id}`
            )
          }
          className="p-3 rounded-full hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors"
          title="Share Album"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {/* Track List */}
      <div className="space-y-1">
        <div className="grid grid-cols-12 gap-3 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-white/[0.06]">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-8">Title</div>
          <div className="col-span-3 text-right flex items-center justify-end gap-1">
            <Clock className="w-3.5 h-3.5" />
          </div>
        </div>

        {albumTracks.map((track, i) => {
          const isPlayingThis = currentTrack?.id === track.id && isPlaying;
          const isLiked = likedTrackIds.includes(track.id);
          const isDownloaded = downloadedTracks.some((d) => d.track.id === track.id);

          return (
            <div
              key={track.id}
              className={`grid grid-cols-12 gap-3 px-4 py-2.5 rounded-xl items-center text-xs transition-colors group ${
                isPlayingThis ? 'bg-violet-600/15 text-violet-300' : 'hover:bg-white/[0.04] text-slate-300'
              }`}
            >
              <div className="col-span-1 text-center font-mono-tabular">
                <span className="group-hover:hidden">{i + 1}</span>
                <button
                  onClick={() => playTrack(track, albumTracks)}
                  className="hidden group-hover:inline-block text-white"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                </button>
              </div>

              <div className="col-span-8 flex items-center justify-between pr-4">
                <div>
                  <p className={`font-semibold ${isPlayingThis ? 'text-violet-400' : 'text-white'}`}>
                    {track.title}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {track.artistName}
                  </p>
                </div>
              </div>

              <div className="col-span-3 flex items-center justify-end gap-2 text-right">
                <button
                  onClick={() => toggleLikeTrack(track.id)}
                  className={`p-1 hover:text-white ${isLiked ? 'text-rose-500' : 'text-slate-500 opacity-0 group-hover:opacity-100'}`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500' : ''}`} />
                </button>

                <button
                  onClick={() => downloadTrack(track)}
                  className={`p-1 hover:text-white ${isDownloaded ? 'text-cyan-400' : 'text-slate-500 opacity-0 group-hover:opacity-100'}`}
                >
                  <Download className="w-3.5 h-3.5" />
                </button>

                <span className="font-mono-tabular text-slate-400 w-10">
                  {formatTime(track.duration)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Copyright Notice */}
      <div className="pt-6 border-t border-white/[0.06] text-xs text-slate-400">
        <p>{album.copyright}</p>
        <p className="text-[10px] text-slate-400 mt-1">
          Catalog ID: BASS-REC-{album.id.toUpperCase()}
        </p>
      </div>
    </div>
  );
};
