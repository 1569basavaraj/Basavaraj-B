import React, { useState } from 'react';
import { useStore } from '../../services/store';
import {
  DownloadCloud,
  FolderPlus,
  Heart,
  Music,
  Plus,
  Search,
} from 'lucide-react';

export const LibraryPage: React.FC = () => {
  const {
    userPlaylists,
    playlists,
    likedTrackIds,
    downloadedTracks,
    artists,
    followedArtistIds,
    albums,
    savedAlbumIds,
    setIsCreatePlaylistOpen,
    setSelectedPlaylistId,
    setSelectedArtistId,
    setSelectedAlbumId,
    setActiveView,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'playlists' | 'liked' | 'artists' | 'albums' | 'downloads'>('playlists');
  const [searchFilter, setSearchFilter] = useState('');

  const followedArtistsList = artists.filter((a) => followedArtistIds.includes(a.id));
  const savedAlbumsList = albums.filter((alb) => savedAlbumIds.includes(alb.id));

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 pb-24">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            Your Library
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Playlists, favorites, followed artists, and offline saved tracks
          </p>
        </div>

        <button
          onClick={() => setIsCreatePlaylistOpen(true)}
          className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white flex items-center gap-1.5 shadow-md shadow-violet-900/30 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Playlist</span>
        </button>
      </div>

      {/* Tabs and Search filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
        {/* Tab Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {(
            [
              { id: 'playlists', label: `Playlists (${userPlaylists.length})` },
              { id: 'liked', label: `Liked Songs (${likedTrackIds.length})` },
              { id: 'artists', label: `Artists (${followedArtistIds.length})` },
              { id: 'albums', label: `Albums (${savedAlbumIds.length})` },
              { id: 'downloads', label: `Downloads (${downloadedTracks.length})` },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => {
                if (t.id === 'liked') setActiveView('liked');
                else if (t.id === 'downloads') setActiveView('downloads');
                else setActiveTab(t.id);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                activeTab === t.id
                  ? 'bg-white/[0.1] text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Filter input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search your library..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder-slate-400 focus:outline-none focus:border-violet-500"
          />
        </div>
      </div>

      {/* Playlists Tab */}
      {activeTab === 'playlists' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {/* Create Card */}
          <div
            onClick={() => setIsCreatePlaylistOpen(true)}
            className="aspect-square rounded-2xl border-2 border-dashed border-white/[0.1] hover:border-violet-500/50 p-4 flex flex-col items-center justify-center text-center cursor-pointer group transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <FolderPlus className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-white">
              Create Playlist
            </span>
            <span className="text-[10px] text-slate-500 mt-1">
              Custom collection
            </span>
          </div>

          {/* User Playlists */}
          {userPlaylists
            .filter((p) =>
              p.title.toLowerCase().includes(searchFilter.toLowerCase())
            )
            .map((pl) => (
              <div
                key={pl.id}
                onClick={() => {
                  setSelectedPlaylistId(pl.id);
                  setActiveView('playlist');
                }}
                className="p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.05] transition-all cursor-pointer group"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden mb-2.5 shadow-md">
                  <img
                    src={pl.coverUrl}
                    alt={pl.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-xs font-bold text-white truncate">
                  {pl.title}
                </h4>
                <p className="text-[10px] text-slate-400 font-mono-tabular">
                  {pl.trackIds.length} tracks · Playlist
                </p>
              </div>
            ))}
        </div>
      )}

      {/* Artists Tab */}
      {activeTab === 'artists' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {followedArtistsList.length === 0 ? (
            <div className="col-span-full py-16 text-center space-y-2">
              <p className="text-sm font-semibold text-slate-300">
                You haven't followed any artists yet
              </p>
              <p className="text-xs text-slate-500">
                Explore Discover or Search to find creators to follow.
              </p>
            </div>
          ) : (
            followedArtistsList
              .filter((a) =>
                a.name.toLowerCase().includes(searchFilter.toLowerCase())
              )
              .map((art) => (
                <div
                  key={art.id}
                  onClick={() => {
                    setSelectedArtistId(art.id);
                    setActiveView('artist');
                  }}
                  className="p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] transition-all text-center cursor-pointer group"
                >
                  <img
                    src={art.avatarUrl}
                    alt={art.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-full object-cover mx-auto mb-2 ring-1 ring-white/10"
                  />
                  <h4 className="text-xs font-bold text-white truncate">
                    {art.name}
                  </h4>
                  <p className="text-[10px] text-slate-400">Artist</p>
                </div>
              ))
          )}
        </div>
      )}

      {/* Albums Tab */}
      {activeTab === 'albums' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {savedAlbumsList.length === 0 ? (
            <div className="col-span-full py-16 text-center space-y-2">
              <p className="text-sm font-semibold text-slate-300">
                No saved albums in your library
              </p>
              <p className="text-xs text-slate-500">
                Save full albums to keep your favorites organized.
              </p>
            </div>
          ) : (
            savedAlbumsList
              .filter((alb) =>
                alb.title.toLowerCase().includes(searchFilter.toLowerCase())
              )
              .map((alb) => (
                <div
                  key={alb.id}
                  onClick={() => {
                    setSelectedAlbumId(alb.id);
                    setActiveView('album');
                  }}
                  className="p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] transition-all cursor-pointer group"
                >
                  <img
                    src={alb.coverUrl}
                    alt={alb.title}
                    referrerPolicy="no-referrer"
                    className="aspect-square w-full rounded-xl object-cover mb-2.5 shadow-md"
                  />
                  <h4 className="text-xs font-bold text-white truncate">
                    {alb.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 truncate">
                    {alb.artistName} · {alb.releaseDate.split('-')[0]}
                  </p>
                </div>
              ))
          )}
        </div>
      )}
    </div>
  );
};
