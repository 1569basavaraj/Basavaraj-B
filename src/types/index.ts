export type AudioQuality = 'low' | 'normal' | 'high' | 'lossless';

export type UserRole = 'USER' | 'PREMIUM' | 'ARTIST' | 'ADMIN' | 'SUPER_ADMIN';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
  plan: 'free' | 'premium' | 'premium_plus';
  emailVerified: boolean;
  country: string;
  favoriteGenres: string[];
  favoriteArtists: string[];
  listeningMinutes: number;
  streakDays: number;
  createdAt: string;
}

export interface TimedLyricLine {
  id: string;
  time: number; // in seconds
  text: string;
}

export interface Track {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  albumId?: string;
  albumTitle?: string;
  coverUrl: string;
  duration: number; // in seconds
  audioUrl?: string; // audio source or synth preset key
  synthPreset?: string; // key for Web Audio synthesizer
  genre: string;
  releaseYear: number;
  bpm: number;
  plays: number;
  likes: number;
  isExplicit?: boolean;
  isFeatured?: boolean;
  lyrics?: TimedLyricLine[];
  lyricsCopyright?: string;
}

export interface Artist {
  id: string;
  name: string;
  avatarUrl: string;
  heroUrl?: string;
  bio: string;
  monthlyListeners: number;
  isVerified: boolean;
  genres: string[];
  topTrackIds: string[];
  albumIds: string[];
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    website?: string;
  };
}

export interface Album {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  coverUrl: string;
  releaseDate: string;
  genre: string;
  trackIds: string[];
  totalDuration: number; // in seconds
  label: string;
  copyright: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  ownerId: string;
  ownerName: string;
  trackIds: string[];
  isPublic: boolean;
  isCollaborative: boolean;
  followersCount: number;
  createdAt: string;
}

export interface Genre {
  id: string;
  name: string;
  slug: string;
  accentColor: string;
  secondaryColor: string;
  iconName: string;
  description: string;
}

export interface ListeningHistoryItem {
  id: string;
  trackId: string;
  listenedAt: string;
  completionPercentage: number;
  device: string;
}

export interface DownloadedTrack {
  track: Track;
  downloadedAt: string;
  fileSizeBytes: number;
  quality: AudioQuality;
}

export interface SubscriptionPlan {
  id: 'free' | 'premium' | 'premium_plus';
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  popular?: boolean;
  badge?: string;
}

export interface ModerationReport {
  id: string;
  contentId: string;
  contentType: 'track' | 'album' | 'playlist' | 'artist' | 'user';
  contentTitle: string;
  reportedBy: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'removed';
  createdAt: string;
  notes?: string;
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  resource: string;
  resourceId: string;
  timestamp: string;
  ipAddress: string;
  details: string;
}

export interface JamRoom {
  id: string;
  name: string;
  hostName: string;
  hostAvatar: string;
  activeTrackId: string;
  currentPlaybackSeconds: number;
  listenerCount: number;
  isLive: boolean;
  listeners: { id: string; name: string; avatar: string }[];
  reactions: { id: string; emoji: string; userName: string; timestamp: number }[];
}

export type ActiveView = 
  | 'home'
  | 'discover'
  | 'search'
  | 'library'
  | 'playlist'
  | 'album'
  | 'artist'
  | 'liked'
  | 'history'
  | 'stats'
  | 'downloads'
  | 'jam'
  | 'subscription'
  | 'settings'
  | 'artist_dashboard'
  | 'admin'
  | 'landing';
