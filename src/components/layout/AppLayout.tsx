import React from 'react';
import { useStore } from '../../services/store';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { BottomPlayer } from '../player/BottomPlayer';
import { NowPlayingModal } from '../player/NowPlayingModal';
import { LyricsView } from '../player/LyricsView';
import { QueueDrawer } from '../player/QueueDrawer';

// Views
import { HomePage } from '../home/HomePage';
import { LandingPage } from '../landing/LandingPage';
import { SearchPage } from '../search/SearchPage';
import { DiscoverPage } from '../discover/DiscoverPage';
import { LibraryPage } from '../library/LibraryPage';
import { PlaylistDetailView } from '../playlist/PlaylistDetailView';
import { ArtistDetailView } from '../artist/ArtistDetailView';
import { AlbumDetailView } from '../album/AlbumDetailView';
import { ListeningStatsView } from '../stats/ListeningStatsView';
import { DownloadsView } from '../offline/DownloadsView';
import { JamRoomView } from '../social/JamRoomView';
import { SubscriptionView } from '../subscription/SubscriptionView';
import { SettingsView } from '../profile/SettingsView';
import { ArtistDashboard } from '../artist/ArtistDashboard';
import { AdminDashboard } from '../admin/AdminDashboard';

// Modals
import { AuthModal } from '../auth/AuthModal';
import { CheckoutModal } from '../subscription/CheckoutModal';
import { CreatePlaylistModal } from '../playlist/CreatePlaylistModal';
import { AddToPlaylistModal } from '../common/AddToPlaylistModal';
import { ShareModal } from '../common/ShareModal';
import { Heart } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const { activeView, setActiveView, likedTrackIds, tracks, playTrack } = useStore();

  // If user explicitly chooses the Landing Page view
  if (activeView === 'landing') {
    return (
      <main className="min-h-screen bg-[#090a0f]">
        <LandingPage />
        <BottomPlayer />
        <NowPlayingModal />
        <LyricsView />
        <QueueDrawer />
        <AuthModal />
        <CheckoutModal />
        <ShareModal />
      </main>
    );
  }

  // Liked Songs dedicated view helper
  const renderLikedView = () => {
    const likedTracks = tracks.filter((t) => likedTrackIds.includes(t.id));
    return (
      <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 pb-24 text-white">
        <div className="flex items-center gap-6 pt-4">
          <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl bg-gradient-to-br from-rose-500 via-pink-600 to-violet-800 flex items-center justify-center text-white shadow-2xl shadow-rose-950/50 shrink-0">
            <Heart className="w-16 h-16 fill-white" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              Playlist
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-white mt-1">
              Liked Songs
            </h1>
            <p className="text-xs text-slate-300 mt-2 font-mono-tabular">
              {likedTracks.length} favorite tracks
            </p>
          </div>
        </div>

        {likedTracks.length === 0 ? (
          <div className="py-20 text-center text-xs text-slate-400">
            No liked songs yet. Tap the heart on any song to save it here!
          </div>
        ) : (
          <div className="space-y-1">
            {likedTracks.map((track, i) => (
              <div
                key={track.id}
                onClick={() => playTrack(track, likedTracks)}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center text-xs font-mono-tabular text-slate-500">
                    {i + 1}
                  </span>
                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div>
                    <p className="text-xs font-semibold text-white">{track.title}</p>
                    <p className="text-[11px] text-slate-400">{track.artistName}</p>
                  </div>
                </div>
                <span className="text-xs font-mono-tabular text-slate-400">
                  {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#090a0f] text-slate-100 select-none">
      {/* Desktop Left Sidebar */}
      <div className="hidden md:flex shrink-0">
        <Sidebar />
      </div>

      {/* Main App Content Viewport */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <TopBar />

        {/* Dynamic Route View container */}
        <main className="flex-1 overflow-y-auto">
          {activeView === 'home' && <HomePage />}
          {activeView === 'search' && <SearchPage />}
          {activeView === 'discover' && <DiscoverPage />}
          {activeView === 'library' && <LibraryPage />}
          {activeView === 'playlist' && <PlaylistDetailView />}
          {activeView === 'artist' && <ArtistDetailView />}
          {activeView === 'album' && <AlbumDetailView />}
          {activeView === 'liked' && renderLikedView()}
          {activeView === 'stats' && <ListeningStatsView />}
          {activeView === 'downloads' && <DownloadsView />}
          {activeView === 'jam' && <JamRoomView />}
          {activeView === 'subscription' && <SubscriptionView />}
          {activeView === 'settings' && <SettingsView />}
          {activeView === 'artist_dashboard' && <ArtistDashboard />}
          {activeView === 'admin' && <AdminDashboard />}
        </main>

        {/* Persistent Bottom Audio Player */}
        <BottomPlayer />

        {/* Mobile Persistent Bottom Nav */}
        <MobileNav />
      </div>

      {/* Global Overlays & Modals */}
      <NowPlayingModal />
      <LyricsView />
      <QueueDrawer />
      <AuthModal />
      <CheckoutModal />
      <CreatePlaylistModal />
      <AddToPlaylistModal />
      <ShareModal />
    </div>
  );
};
