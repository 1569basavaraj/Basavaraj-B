import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  ActiveView,
  Album,
  Artist,
  AudioQuality,
  AuditLog,
  DownloadedTrack,
  Genre,
  JamRoom,
  ListeningHistoryItem,
  ModerationReport,
  Playlist,
  SubscriptionPlan,
  Track,
  User,
} from '../types';
import {
  DEMO_ADMIN,
  DEMO_USER,
  SEED_ALBUMS,
  SEED_ARTISTS,
  SEED_AUDIT_LOGS,
  SEED_GENRES,
  SEED_MODERATION_REPORTS,
  SEED_PLANS,
  SEED_PLAYLISTS,
  SEED_TRACKS,
} from '../data/seedData';
import { audioPlayer, AudioPlayer, EqualizerPreset } from './audioPlayer';
import { deleteDeviceAudioFile } from './deviceAudioStorage';
import { recordSupabaseLogin } from './supabase';

interface StoreContextType {
  // Web Audio Player Service
  audioPlayer: AudioPlayer;

  // Navigation
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  selectedPlaylistId: string | null;
  setSelectedPlaylistId: (id: string | null) => void;
  selectedArtistId: string | null;
  setSelectedArtistId: (id: string | null) => void;
  selectedAlbumId: string | null;
  setSelectedAlbumId: (id: string | null) => void;

  // Auth & User
  user: User | null;
  isAuthenticated: boolean;
  login: (
    email: string,
    password?: string,
    loginMethod?: 'email' | 'google' | 'apple' | 'demo' | 'admin'
  ) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, username: string) => Promise<boolean>;
  updateUserPreferences: (genres: string[], artists: string[]) => void;
  switchUserRole: (role: 'listener' | 'artist' | 'admin') => void;

  // Catalog
  tracks: Track[];
  artists: Artist[];
  albums: Album[];
  playlists: Playlist[];
  genres: Genre[];

  // Library & Favorites
  likedTrackIds: string[];
  toggleLikeTrack: (trackId: string) => void;
  followedArtistIds: string[];
  toggleFollowArtist: (artistId: string) => void;
  savedAlbumIds: string[];
  toggleSaveAlbum: (albumId: string) => void;
  userPlaylists: Playlist[];
  createPlaylist: (title: string, description: string, coverUrl?: string) => Playlist;
  deletePlaylist: (playlistId: string) => void;
  addTrackToPlaylist: (playlistId: string, trackId: string) => void;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;

  // Player state
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: 'off' | 'all' | 'one';
  queue: Track[];
  queueIndex: number;
  audioQuality: AudioQuality;
  equalizerPreset: EqualizerPreset;
  playTrack: (track: Track, contextQueue?: Track[]) => void;
  togglePlayPause: () => void;
  seek: (seconds: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  addToQueue: (track: Track) => void;
  playNextInQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  reorderQueue: (fromIndex: number, toIndex: number) => void;
  setAudioQuality: (quality: AudioQuality) => void;
  setEqualizerPreset: (preset: EqualizerPreset) => void;

  // Modals & Panels
  isNowPlayingOpen: boolean;
  setIsNowPlayingOpen: (open: boolean) => void;
  isQueueDrawerOpen: boolean;
  setIsQueueDrawerOpen: (open: boolean) => void;
  isLyricsOpen: boolean;
  setIsLyricsOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register' | 'forgot' | 'onboarding';
  setAuthModalMode: (mode: 'login' | 'register' | 'forgot' | 'onboarding') => void;
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (open: boolean) => void;
  selectedCheckoutPlan: SubscriptionPlan | null;
  setSelectedCheckoutPlan: (plan: SubscriptionPlan | null) => void;
  isCreatePlaylistOpen: boolean;
  setIsCreatePlaylistOpen: (open: boolean) => void;
  isShareModalOpen: boolean;
  setIsShareModalOpen: (open: boolean) => void;
  shareItem: { title: string; subtitle: string; url: string } | null;
  openShareModal: (title: string, subtitle: string, url: string) => void;
  isAddToPlaylistOpen: boolean;
  setIsAddToPlaylistOpen: (open: boolean) => void;
  trackToAddToPlaylist: Track | null;
  openAddToPlaylist: (track: Track) => void;

  // Offline & History
  downloadedTracks: DownloadedTrack[];
  downloadTrack: (track: Track) => void;
  removeDownload: (trackId: string) => void;
  clearDownloads: () => void;
  isOfflineMode: boolean;
  toggleOfflineMode: () => void;
  listeningHistory: ListeningHistoryItem[];
  clearHistory: () => void;

  // Admin & Moderation
  moderationReports: ModerationReport[];
  resolveModeration: (id: string, action: 'approved' | 'rejected' | 'removed') => void;
  auditLogs: AuditLog[];
  addNewAuditLog: (action: string, resource: string, resourceId: string, details: string) => void;
  addNewTrack: (newTrack: Partial<Track>) => void;
  deleteTrack: (trackId: string) => void;

  // Social Jam Room
  jamRoom: JamRoom;
  sendJamReaction: (emoji: string) => void;

  // Language & Theme
  language: string;
  setLanguage: (lang: string) => void;
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);

  // User State
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('bnb_user');
      return saved ? JSON.parse(saved) : DEMO_USER;
    } catch {
      return DEMO_USER;
    }
  });

  // Music Catalog State
  const [tracks, setTracks] = useState<Track[]>(() => {
    try {
      const saved = localStorage.getItem('bnb_tracks');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((t: Track) => {
            const seedMatch = SEED_TRACKS.find((s) => s.id === t.id);
            if (seedMatch && (!t.audioUrl || t.audioUrl.trim() === '' || t.audioUrl.includes('raw.githubusercontent.com'))) {
              return { ...t, audioUrl: seedMatch.audioUrl };
            }
            return t;
          });
        }
      }
      return SEED_TRACKS;
    } catch {
      return SEED_TRACKS;
    }
  });
  const [artists] = useState<Artist[]>(SEED_ARTISTS);
  const [albums] = useState<Album[]>(SEED_ALBUMS);
  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    try {
      const saved = localStorage.getItem('bnb_playlists');
      return saved ? JSON.parse(saved) : SEED_PLAYLISTS;
    } catch {
      return SEED_PLAYLISTS;
    }
  });
  const [genres] = useState<Genre[]>(SEED_GENRES);

  // Library & Favorites
  const [likedTrackIds, setLikedTrackIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bnb_liked_tracks');
      return saved ? JSON.parse(saved) : ['trk-1', 'trk-4', 'trk-10', 'trk-15', 'trk-12'];
    } catch {
      return ['trk-1', 'trk-4', 'trk-10', 'trk-15', 'trk-12'];
    }
  });

  const [followedArtistIds, setFollowedArtistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bnb_followed_artists');
      return saved ? JSON.parse(saved) : ['art-1', 'art-2', 'art-6'];
    } catch {
      return ['art-1', 'art-2', 'art-6'];
    }
  });

  const [savedAlbumIds, setSavedAlbumIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bnb_saved_albums');
      return saved ? JSON.parse(saved) : ['alb-1', 'alb-2'];
    } catch {
      return ['alb-1', 'alb-2'];
    }
  });

  // Player State
  const [currentTrack, setCurrentTrack] = useState<Track | null>(SEED_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(SEED_TRACKS[0].duration);
  const [volume, setVolumeState] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');
  const [queue, setQueue] = useState<Track[]>(SEED_TRACKS.slice(0, 8));
  const [queueIndex, setQueueIndex] = useState<number>(0);
  const [audioQuality, setAudioQualityState] = useState<AudioQuality>('high');
  const [equalizerPreset, setEqualizerPresetState] = useState<EqualizerPreset>('bass_boost');

  // Modals & Drawers
  const [isNowPlayingOpen, setIsNowPlayingOpen] = useState(false);
  const [isQueueDrawerOpen, setIsQueueDrawerOpen] = useState(false);
  const [isLyricsOpen, setIsLyricsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot' | 'onboarding'>('login');
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [selectedCheckoutPlan, setSelectedCheckoutPlan] = useState<SubscriptionPlan | null>(null);
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareItem, setShareItem] = useState<{ title: string; subtitle: string; url: string } | null>(null);
  const [isAddToPlaylistOpen, setIsAddToPlaylistOpen] = useState(false);
  const [trackToAddToPlaylist, setTrackToAddToPlaylist] = useState<Track | null>(null);

  // Offline & Downloads
  const [downloadedTracks, setDownloadedTracks] = useState<DownloadedTrack[]>(() => {
    try {
      const saved = localStorage.getItem('bnb_downloads');
      return saved ? JSON.parse(saved) : [
        { track: SEED_TRACKS[0], downloadedAt: '2026-03-24', fileSizeBytes: 8420000, quality: 'high' },
        { track: SEED_TRACKS[3], downloadedAt: '2026-03-23', fileSizeBytes: 9120000, quality: 'high' },
      ];
    } catch {
      return [];
    }
  });
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  // Listening History
  const [listeningHistory, setListeningHistory] = useState<ListeningHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('bnb_history');
      return saved ? JSON.parse(saved) : [
        { id: 'h-1', trackId: 'trk-1', listenedAt: '10 minutes ago', completionPercentage: 100, device: 'Chrome / macOS' },
        { id: 'h-2', trackId: 'trk-4', listenedAt: '1 hour ago', completionPercentage: 85, device: 'BASSnBEATS PWA' },
        { id: 'h-3', trackId: 'trk-15', listenedAt: 'Yesterday', completionPercentage: 100, device: 'Chrome / macOS' },
        { id: 'h-4', trackId: 'trk-12', listenedAt: 'Yesterday', completionPercentage: 92, device: 'Android' },
      ];
    } catch {
      return [];
    }
  });

  // Admin & Moderation
  const [moderationReports, setModerationReports] = useState<ModerationReport[]>(SEED_MODERATION_REPORTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(SEED_AUDIT_LOGS);

  // Jam Room
  const [jamRoom, setJamRoom] = useState<JamRoom>({
    id: 'jam-live-1',
    name: 'BASSnBEATS Weekend Pulse Room',
    hostName: 'Kavya Rao',
    hostAvatar: SEED_ARTISTS[0].avatarUrl,
    activeTrackId: 'trk-1',
    currentPlaybackSeconds: 42,
    listenerCount: 148,
    isLive: true,
    listeners: [
      { id: 'u1', name: 'Basavaraj', avatar: DEMO_USER.avatarUrl },
      { id: 'u2', name: 'Rohan Sharma', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
      { id: 'u3', name: 'Elena Vance', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
      { id: 'u4', name: 'Aarav M', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' }
    ],
    reactions: [
      { id: 'r1', emoji: '🔥', userName: 'Basavaraj', timestamp: Date.now() - 5000 },
      { id: 'r2', emoji: '⚡', userName: 'Elena', timestamp: Date.now() - 2000 }
    ]
  });

  // Language & Theme
  const [language, setLanguageState] = useState<string>(() => localStorage.getItem('bnb_lang') || 'en');
  const [theme, setThemeState] = useState<'dark' | 'light'>('dark');

  // Connect AudioPlayer callbacks and audio graph
  useEffect(() => {
    const unsubProgress = audioPlayer.onProgress((p) => {
      setCurrentTime(p.currentTime);
      if (p.duration > 0 && Math.abs(duration - p.duration) > 1) {
        setDuration(p.duration);
      }
    });

    const unsubEnded = audioPlayer.onTrackEnded(() => {
      nextTrack();
    });

    audioPlayer.setEqualizer(equalizerPreset);
    audioPlayer.setQuality(audioQuality);

    return () => {
      unsubProgress();
      unsubEnded();
    };
  }, [equalizerPreset, audioQuality, duration]);

  // Sync state to LocalStorage
  useEffect(() => {
    if (user) localStorage.setItem('bnb_user', JSON.stringify(user));
    else localStorage.removeItem('bnb_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('bnb_liked_tracks', JSON.stringify(likedTrackIds));
  }, [likedTrackIds]);

  useEffect(() => {
    localStorage.setItem('bnb_followed_artists', JSON.stringify(followedArtistIds));
  }, [followedArtistIds]);

  useEffect(() => {
    localStorage.setItem('bnb_saved_albums', JSON.stringify(savedAlbumIds));
  }, [savedAlbumIds]);

  useEffect(() => {
    localStorage.setItem('bnb_playlists', JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    localStorage.setItem('bnb_tracks', JSON.stringify(tracks));
  }, [tracks]);

  useEffect(() => {
    localStorage.setItem('bnb_downloads', JSON.stringify(downloadedTracks));
  }, [downloadedTracks]);

  useEffect(() => {
    localStorage.setItem('bnb_history', JSON.stringify(listeningHistory));
  }, [listeningHistory]);

  // Audio Playback Controls
  const playTrack = (track: Track, contextQueue?: Track[]) => {
    if (contextQueue && contextQueue.length > 0) {
      setQueue(contextQueue);
      const foundIdx = contextQueue.findIndex((t) => t.id === track.id);
      setQueueIndex(foundIdx >= 0 ? foundIdx : 0);
    } else {
      if (!queue.some((t) => t.id === track.id)) {
        setQueue((prev) => [track, ...prev]);
        setQueueIndex(0);
      } else {
        const idx = queue.findIndex((t) => t.id === track.id);
        setQueueIndex(idx);
      }
    }

    setCurrentTrack(track);
    setDuration(track.duration);
    setCurrentTime(0);
    setIsPlaying(true);
    audioPlayer.playTrack(track, 0);

    // Record to history
    addTrackToHistory(track);
  };

  const togglePlayPause = () => {
    if (!currentTrack) {
      if (tracks.length > 0) playTrack(tracks[0]);
      return;
    }
    if (isPlaying) {
      audioPlayer.pause();
      setIsPlaying(false);
    } else {
      audioPlayer.resume();
      setIsPlaying(true);
    }
  };

  const seek = (seconds: number) => {
    setCurrentTime(seconds);
    audioPlayer.seek(seconds);
  };

  const nextTrack = () => {
    if (queue.length === 0) return;
    if (repeatMode === 'one' && currentTrack) {
      seek(0);
      audioPlayer.playTrack(currentTrack, 0);
      setIsPlaying(true);
      return;
    }

    let nextIdx = queueIndex + 1;
    if (isShuffle) {
      nextIdx = Math.floor(Math.random() * queue.length);
    } else if (nextIdx >= queue.length) {
      if (repeatMode === 'all') {
        nextIdx = 0;
      } else {
        audioPlayer.pause();
        setIsPlaying(false);
        return;
      }
    }

    setQueueIndex(nextIdx);
    const target = queue[nextIdx];
    if (target) {
      setCurrentTrack(target);
      setDuration(target.duration);
      setCurrentTime(0);
      setIsPlaying(true);
      audioPlayer.playTrack(target, 0);
      addTrackToHistory(target);
    }
  };

  const prevTrack = () => {
    if (currentTime > 3) {
      seek(0);
      return;
    }
    if (queue.length === 0) return;
    let prevIdx = queueIndex - 1;
    if (prevIdx < 0) {
      prevIdx = queue.length - 1;
    }
    setQueueIndex(prevIdx);
    const target = queue[prevIdx];
    if (target) {
      setCurrentTrack(target);
      setDuration(target.duration);
      setCurrentTime(0);
      setIsPlaying(true);
      audioPlayer.playTrack(target, 0);
      addTrackToHistory(target);
    }
  };

  const setVolume = (vol: number) => {
    setVolumeState(vol);
    if (vol === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
    audioPlayer.setVolume(vol);
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      audioPlayer.setVolume(volume || 0.85);
    } else {
      setIsMuted(true);
      audioPlayer.setVolume(0);
    }
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
  };

  const cycleRepeat = () => {
    if (repeatMode === 'off') setRepeatMode('all');
    else if (repeatMode === 'all') setRepeatMode('one');
    else setRepeatMode('off');
  };

  const addToQueue = (track: Track) => {
    setQueue((prev) => [...prev, track]);
  };

  const playNextInQueue = (track: Track) => {
    setQueue((prev) => {
      const copy = [...prev];
      copy.splice(queueIndex + 1, 0, track);
      return copy;
    });
  };

  const removeFromQueue = (index: number) => {
    setQueue((prev) => prev.filter((_, i) => i !== index));
    if (index < queueIndex) {
      setQueueIndex((prev) => prev - 1);
    }
  };

  const clearQueue = () => {
    if (currentTrack) {
      setQueue([currentTrack]);
      setQueueIndex(0);
    } else {
      setQueue([]);
      setQueueIndex(0);
    }
  };

  const reorderQueue = (fromIndex: number, toIndex: number) => {
    setQueue((prev) => {
      const result = [...prev];
      const [removed] = result.splice(fromIndex, 1);
      result.splice(toIndex, 0, removed);
      return result;
    });
  };

  const setAudioQuality = (quality: AudioQuality) => {
    setAudioQualityState(quality);
    audioPlayer.setQuality(quality);
  };

  const setEqualizerPreset = (preset: EqualizerPreset) => {
    setEqualizerPresetState(preset);
    audioPlayer.setEqualizer(preset);
  };

  // Likes & Follows
  const toggleLikeTrack = (trackId: string) => {
    setLikedTrackIds((prev) => {
      const exists = prev.includes(trackId);
      if (exists) {
        return prev.filter((id) => id !== trackId);
      } else {
        return [...prev, trackId];
      }
    });
  };

  const toggleFollowArtist = (artistId: string) => {
    setFollowedArtistIds((prev) => {
      const exists = prev.includes(artistId);
      if (exists) {
        return prev.filter((id) => id !== artistId);
      } else {
        return [...prev, artistId];
      }
    });
  };

  const toggleSaveAlbum = (albumId: string) => {
    setSavedAlbumIds((prev) => {
      const exists = prev.includes(albumId);
      if (exists) {
        return prev.filter((id) => id !== albumId);
      } else {
        return [...prev, albumId];
      }
    });
  };

  // Playlists
  const userPlaylists = playlists.filter((p) => p.ownerId === user?.id || p.ownerId === 'usr-1');

  const createPlaylist = (title: string, description: string, coverUrl?: string): Playlist => {
    const newPlaylist: Playlist = {
      id: `pl-${Date.now()}`,
      title: title || 'My New Playlist',
      description: description || 'Created with BASSnBEATS',
      coverUrl: coverUrl || SEED_PLAYLISTS[0].coverUrl,
      ownerId: user?.id || 'usr-1',
      ownerName: user?.name || 'Basavaraj',
      trackIds: [],
      isPublic: true,
      isCollaborative: false,
      followersCount: 1,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setPlaylists((prev) => [newPlaylist, ...prev]);
    return newPlaylist;
  };

  const deletePlaylist = (playlistId: string) => {
    setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
    if (selectedPlaylistId === playlistId) {
      setSelectedPlaylistId(null);
      setActiveView('library');
    }
  };

  const addTrackToPlaylist = (playlistId: string, trackId: string) => {
    setPlaylists((prev) =>
      prev.map((p) => {
        if (p.id === playlistId) {
          if (!p.trackIds.includes(trackId)) {
            return { ...p, trackIds: [...p.trackIds, trackId] };
          }
        }
        return p;
      })
    );
  };

  const removeTrackFromPlaylist = (playlistId: string, trackId: string) => {
    setPlaylists((prev) =>
      prev.map((p) => {
        if (p.id === playlistId) {
          return { ...p, trackIds: p.trackIds.filter((id) => id !== trackId) };
        }
        return p;
      })
    );
  };

  // Downloads & Offline
  const downloadTrack = (track: Track) => {
    if (downloadedTracks.some((d) => d.track.id === track.id)) return;
    const item: DownloadedTrack = {
      track,
      downloadedAt: new Date().toISOString().split('T')[0],
      fileSizeBytes: Math.floor(Math.random() * 4000000) + 6000000,
      quality: audioQuality,
    };
    setDownloadedTracks((prev) => [...prev, item]);
  };

  const removeDownload = (trackId: string) => {
    setDownloadedTracks((prev) => prev.filter((d) => d.track.id !== trackId));
  };

  const clearDownloads = () => {
    setDownloadedTracks([]);
  };

  const toggleOfflineMode = () => {
    setIsOfflineMode(!isOfflineMode);
  };

  // Listening History
  const addTrackToHistory = (track: Track) => {
    const item: ListeningHistoryItem = {
      id: `hist-${Date.now()}`,
      trackId: track.id,
      listenedAt: 'Just now',
      completionPercentage: 100,
      device: 'BASSnBEATS Web Studio',
    };
    setListeningHistory((prev) => [item, ...prev.filter((h) => h.trackId !== track.id)].slice(0, 30));

    // Update user listening stats
    if (user) {
      setUser({
        ...user,
        listeningMinutes: user.listeningMinutes + Math.round(track.duration / 60),
      });
    }
  };

  const clearHistory = () => {
    setListeningHistory([]);
  };

  // Auth Functions
  const login = async (
    email: string,
    _password?: string,
    loginMethod: 'email' | 'google' | 'apple' | 'demo' | 'admin' = 'email'
  ): Promise<boolean> => {
    let loggedUser: User;
    if (email.toLowerCase().includes('admin')) {
      loggedUser = DEMO_ADMIN;
      setUser(DEMO_ADMIN);
    } else {
      loggedUser = {
        ...DEMO_USER,
        email,
      };
      setUser(loggedUser);
    }
    setIsAuthModalOpen(false);

    // Automatically record to Supabase database!
    recordSupabaseLogin({
      userId: loggedUser.id,
      email: loggedUser.email,
      name: loggedUser.name,
      role: loggedUser.role,
      loginMethod,
      status: 'SUCCESS',
    }).catch((err) => console.warn('Supabase login recording error:', err));

    return true;
  };

  const logout = () => {
    setUser(null);
    setActiveView('landing');
  };

  const register = async (name: string, email: string, username: string): Promise<boolean> => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      username,
      email,
      avatarUrl: DEMO_USER.avatarUrl,
      role: 'USER',
      plan: 'free',
      emailVerified: false,
      country: 'India',
      favoriteGenres: [],
      favoriteArtists: [],
      listeningMinutes: 0,
      streakDays: 1,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUser(newUser);
    setAuthModalMode('onboarding');

    // Automatically record to Supabase database!
    recordSupabaseLogin({
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      loginMethod: 'email',
      status: 'SUCCESS',
    }).catch((err) => console.warn('Supabase register login recording error:', err));

    return true;
  };

  const updateUserPreferences = (selectedGenres: string[], selectedArtists: string[]) => {
    if (user) {
      setUser({
        ...user,
        favoriteGenres: selectedGenres,
        favoriteArtists: selectedArtists,
      });
    }
  };

  const switchUserRole = (targetRole: 'listener' | 'artist' | 'admin') => {
    let switchedUser: User;
    if (targetRole === 'admin') {
      switchedUser = DEMO_ADMIN;
      setUser(DEMO_ADMIN);
      setActiveView('admin');
    } else if (targetRole === 'artist') {
      switchedUser = {
        ...DEMO_USER,
        id: 'art-1',
        name: 'Kavya Rao',
        username: 'kavyarao_official',
        role: 'ARTIST',
        avatarUrl: SEED_ARTISTS[0].avatarUrl,
      };
      setUser(switchedUser);
      setActiveView('artist_dashboard');
    } else {
      switchedUser = DEMO_USER;
      setUser(DEMO_USER);
      setActiveView('home');
    }

    // Automatically record role switch session to Supabase database!
    recordSupabaseLogin({
      userId: switchedUser.id,
      email: switchedUser.email,
      name: switchedUser.name,
      role: switchedUser.role,
      loginMethod: targetRole === 'admin' ? 'admin' : 'demo',
      status: 'SUCCESS',
    }).catch((err) => console.warn('Supabase role login recording error:', err));
  };

  // Admin & Catalog Management
  const resolveModeration = (id: string, action: 'approved' | 'rejected' | 'removed') => {
    setModerationReports((prev) =>
      prev.map((rep) => (rep.id === id ? { ...rep, status: action, notes: `Resolved by Super Admin as ${action}` } : rep))
    );
    addNewAuditLog('MODERATION_ACTION', 'REPORT', id, `Super Admin marked report as ${action}`);
  };

  const addNewAuditLog = (action: string, resource: string, resourceId: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      adminId: user?.id || 'admin',
      adminName: user?.name || 'Super Admin',
      action,
      resource,
      resourceId,
      timestamp: new Date().toLocaleString(),
      ipAddress: '127.0.0.1',
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const addNewTrack = (newTrack: Partial<Track>) => {
    const trackItem: Track = {
      id: newTrack.id || `trk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: newTrack.title || 'Untitled Track',
      artistId: newTrack.artistId || user?.id || 'art-admin',
      artistName: newTrack.artistName || (user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' ? 'Super Admin' : user?.name || 'Kavya Rao'),
      albumId: newTrack.albumId || 'alb-device',
      albumTitle: newTrack.albumTitle || 'Device Audio Catalog',
      coverUrl: newTrack.coverUrl || SEED_TRACKS[0].coverUrl,
      duration: newTrack.duration || 180,
      audioUrl: newTrack.audioUrl,
      synthPreset: newTrack.synthPreset,
      genre: newTrack.genre || 'Electronic',
      releaseYear: newTrack.releaseYear || new Date().getFullYear(),
      bpm: newTrack.bpm || 128,
      plays: 1,
      likes: 0,
      isExplicit: newTrack.isExplicit || false,
      isFeatured: newTrack.isFeatured || false,
      lyrics: newTrack.lyrics,
      lyricsCopyright: newTrack.lyricsCopyright,
    };
    setTracks((prev) => [trackItem, ...prev]);
    addNewAuditLog('UPLOAD_TRACK', 'TRACK', trackItem.id, `Published track: "${trackItem.title}" (${trackItem.genre})`);
    return trackItem;
  };

  const deleteTrack = (trackId: string) => {
    setTracks((prev) => prev.filter((t) => t.id !== trackId));
    deleteDeviceAudioFile(trackId).catch(() => {});
    addNewAuditLog('DELETE_TRACK', 'TRACK', trackId, `Deleted track ID ${trackId}`);
  };

  // Share and AddToPlaylist helpers
  const openShareModal = (title: string, subtitle: string, url: string) => {
    setShareItem({ title, subtitle, url });
    setIsShareModalOpen(true);
  };

  const openAddToPlaylist = (track: Track) => {
    setTrackToAddToPlaylist(track);
    setIsAddToPlaylistOpen(true);
  };

  // Jam Reactions
  const sendJamReaction = (emoji: string) => {
    const reaction = {
      id: `react-${Date.now()}`,
      emoji,
      userName: user?.name || 'Listener',
      timestamp: Date.now(),
    };
    setJamRoom((prev) => ({
      ...prev,
      reactions: [reaction, ...prev.reactions].slice(0, 10),
    }));
  };

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('bnb_lang', lang);
  };

  const setTheme = (t: 'dark' | 'light') => {
    setThemeState(t);
  };

  return (
    <StoreContext.Provider
      value={{
        activeView,
        setActiveView,
        selectedPlaylistId,
        setSelectedPlaylistId,
        selectedArtistId,
        setSelectedArtistId,
        selectedAlbumId,
        setSelectedAlbumId,
        user,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        updateUserPreferences,
        switchUserRole,
        tracks,
        artists,
        albums,
        playlists,
        genres,
        likedTrackIds,
        toggleLikeTrack,
        followedArtistIds,
        toggleFollowArtist,
        savedAlbumIds,
        toggleSaveAlbum,
        userPlaylists,
        createPlaylist,
        deletePlaylist,
        addTrackToPlaylist,
        removeTrackFromPlaylist,
        audioPlayer,
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        isShuffle,
        repeatMode,
        queue,
        queueIndex,
        audioQuality,
        equalizerPreset,
        playTrack,
        togglePlayPause,
        seek,
        nextTrack,
        prevTrack,
        setVolume,
        toggleMute,
        toggleShuffle,
        cycleRepeat,
        addToQueue,
        playNextInQueue,
        removeFromQueue,
        clearQueue,
        reorderQueue,
        setAudioQuality,
        setEqualizerPreset,
        isNowPlayingOpen,
        setIsNowPlayingOpen,
        isQueueDrawerOpen,
        setIsQueueDrawerOpen,
        isLyricsOpen,
        setIsLyricsOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        selectedCheckoutPlan,
        setSelectedCheckoutPlan,
        isCreatePlaylistOpen,
        setIsCreatePlaylistOpen,
        isShareModalOpen,
        setIsShareModalOpen,
        shareItem,
        openShareModal,
        isAddToPlaylistOpen,
        setIsAddToPlaylistOpen,
        trackToAddToPlaylist,
        openAddToPlaylist,
        downloadedTracks,
        downloadTrack,
        removeDownload,
        clearDownloads,
        isOfflineMode,
        toggleOfflineMode,
        listeningHistory,
        clearHistory,
        moderationReports,
        resolveModeration,
        auditLogs,
        addNewAuditLog,
        addNewTrack,
        deleteTrack,
        jamRoom,
        sendJamReaction,
        language,
        setLanguage,
        theme,
        setTheme,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used inside StoreProvider');
  }
  return ctx;
};
