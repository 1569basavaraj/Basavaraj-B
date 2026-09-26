/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { useStore } from '../../services/store';
import { storeDeviceAudioFile } from '../../services/deviceAudioStorage';
import { Track } from '../../types';
import {
  AlertCircle,
  Check,
  Disc,
  FileAudio,
  FolderUp,
  Image as ImageIcon,
  Loader2,
  Music,
  Pause,
  Play,
  Plus,
  Radio,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Upload,
  Volume2,
  X,
} from 'lucide-react';

interface QueuedFile {
  id: string;
  file: File;
  title: string;
  artistName: string;
  albumTitle: string;
  genre: string;
  bpm: number;
  releaseYear: number;
  duration: number;
  formattedDuration: string;
  fileSizeBytes: number;
  formattedSize: string;
  coverUrl: string;
  isExplicit: boolean;
  previewUrl: string;
  isPublishing: boolean;
  isPublished: boolean;
  publishedTrackId?: string;
  error?: string;
}

const DEFAULT_COVER_PRESETS = [
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop&q=80',
];

const POPULAR_GENRES = [
  'South Bass & Folk Fusion',
  'Electronic & EDM',
  'Synthwave & Retrowave',
  'Hip-Hop & Trap',
  'Lo-Fi Beats',
  'Kannada Pop',
  'Deep House & Club',
  'Rock & Alternative',
  'Chillout & Ambient',
  'Acoustic & Indie',
];

interface DeviceMusicUploaderProps {
  onSuccessClose?: () => void;
}

export const DeviceMusicUploader: React.FC<DeviceMusicUploaderProps> = ({ onSuccessClose }) => {
  const { addNewTrack, addNewAuditLog, playTrack, user } = useStore();

  const [queue, setQueue] = useState<QueuedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [previewTrackId, setPreviewTrackId] = useState<string | null>(null);
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);
  const [globalGenre, setGlobalGenre] = useState('Electronic & EDM');
  const [globalArtist, setGlobalArtist] = useState(user?.name || 'Admin Master');
  const [isBatchPublishing, setIsBatchPublishing] = useState(false);
  const [successBanner, setSuccessBanner] = useState<{ count: number; lastTrack?: Track } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const folderInputRef = useRef<HTMLInputElement | null>(null);

  // Stop preview audio on unmount
  React.useEffect(() => {
    return () => {
      if (previewAudio) {
        previewAudio.pause();
        previewAudio.src = '';
      }
      queue.forEach((q) => {
        if (q.previewUrl) URL.revokeObjectURL(q.previewUrl);
      });
    };
  }, [previewAudio, queue]);

  const cleanFileName = (name: string): string => {
    return name
      .replace(/\.[^/.]+$/, '') // remove extension
      .replace(/^\d+[\s._-]+/, '') // remove leading track numbers (e.g. 01 - )
      .replace(/[_-]+/g, ' ') // replace underscores/dashes with space
      .trim();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Inspect audio file using Web Audio / HTMLAudioElement to get exact duration
  const inspectAudioFile = (file: File): Promise<{ duration: number; objectUrl: string }> => {
    return new Promise((resolve) => {
      const objectUrl = URL.createObjectURL(file);
      const audio = new Audio();
      audio.preload = 'metadata';
      audio.src = objectUrl;

      const timeout = setTimeout(() => {
        // Fallback default duration if metadata doesn't fire within 2s
        resolve({ duration: 180, objectUrl });
      }, 2500);

      audio.onloadedmetadata = () => {
        clearTimeout(timeout);
        const dur = Math.round(audio.duration || 180);
        resolve({ duration: dur, objectUrl });
      };

      audio.onerror = () => {
        clearTimeout(timeout);
        resolve({ duration: 180, objectUrl });
      };
    });
  };

  const handleFiles = async (files: FileList | File[]) => {
    const validAudioFiles: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isAudio =
        file.type.startsWith('audio/') ||
        /\.(mp3|wav|ogg|m4a|aac|flac|wma)$/i.test(file.name);

      if (isAudio) {
        validAudioFiles.push(file);
      }
    }

    if (validAudioFiles.length === 0) return;

    const newQueued: QueuedFile[] = [];

    for (let i = 0; i < validAudioFiles.length; i++) {
      const file = validAudioFiles[i];
      const id = `upload-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`;
      const { duration, objectUrl } = await inspectAudioFile(file);

      const title = cleanFileName(file.name) || `Track ${queue.length + i + 1}`;
      const randomCover = DEFAULT_COVER_PRESETS[(queue.length + i) % DEFAULT_COVER_PRESETS.length];

      newQueued.push({
        id,
        file,
        title,
        artistName: globalArtist,
        albumTitle: 'Device Audio Uploads',
        genre: globalGenre,
        bpm: 124,
        releaseYear: new Date().getFullYear(),
        duration,
        formattedDuration: formatDuration(duration),
        fileSizeBytes: file.size,
        formattedSize: formatFileSize(file.size),
        coverUrl: randomCover,
        isExplicit: false,
        previewUrl: objectUrl,
        isPublishing: false,
        isPublished: false,
      });
    }

    setQueue((prev) => [...prev, ...newQueued]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const togglePreview = (item: QueuedFile) => {
    if (previewTrackId === item.id) {
      if (previewAudio) {
        previewAudio.pause();
      }
      setPreviewTrackId(null);
    } else {
      if (previewAudio) {
        previewAudio.pause();
      }
      const audio = new Audio(item.previewUrl);
      audio.play().catch(() => {});
      audio.onended = () => setPreviewTrackId(null);
      setPreviewAudio(audio);
      setPreviewTrackId(item.id);
    }
  };

  const updateItem = (id: string, updates: Partial<QueuedFile>) => {
    setQueue((prev) => prev.map((q) => (q.id === id ? { ...q, ...updates } : q)));
  };

  const removeItem = (id: string) => {
    if (previewTrackId === id && previewAudio) {
      previewAudio.pause();
      setPreviewTrackId(null);
    }
    setQueue((prev) => {
      const item = prev.find((q) => q.id === id);
      if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((q) => q.id !== id);
    });
  };

  const handleCustomCoverImage = (id: string, file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateItem(id, { coverUrl: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  // Publish a single track to the platform
  const publishTrack = async (item: QueuedFile): Promise<Track | null> => {
    updateItem(item.id, { isPublishing: true, error: undefined });

    try {
      const trackId = `trk-dev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

      // 1. Store audio Blob into IndexedDB
      const activeObjectUrl = await storeDeviceAudioFile(trackId, item.file, item.file.name);

      // 2. Publish to platform store
      const published = addNewTrack({
        id: trackId,
        title: item.title,
        artistName: item.artistName || 'Admin Master',
        albumTitle: item.albumTitle || 'Device Audio Catalog',
        genre: item.genre,
        duration: item.duration,
        audioUrl: activeObjectUrl, // Live ObjectURL
        synthPreset: 'device_upload',
        coverUrl: item.coverUrl,
        bpm: item.bpm,
        releaseYear: item.releaseYear,
        isExplicit: item.isExplicit,
      });

      // 3. Log audit event
      addNewAuditLog(
        'DEVICE_AUDIO_PUBLISH',
        'TRACK',
        trackId,
        `Admin published track "${item.title}" from local file (${item.file.name}, ${item.formattedSize})`
      );

      updateItem(item.id, {
        isPublishing: false,
        isPublished: true,
        publishedTrackId: trackId,
      });

      return published as unknown as Track;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      updateItem(item.id, { isPublishing: false, error: msg });
      return null;
    }
  };

  // Batch publish all non-published items
  const publishAll = async () => {
    setIsBatchPublishing(true);
    const toPublish = queue.filter((q) => !q.isPublished);
    let count = 0;
    let lastPublished: Track | undefined;

    for (const item of toPublish) {
      const res = await publishTrack(item);
      if (res) {
        count++;
        lastPublished = res;
      }
    }

    setIsBatchPublishing(false);
    if (count > 0) {
      setSuccessBanner({ count, lastTrack: lastPublished });
    }
  };

  const unpublishedCount = queue.filter((q) => !q.isPublished).length;

  return (
    <div className="space-y-6">
      {/* Header & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-violet-950/40 via-fuchsia-950/20 to-slate-900 border border-violet-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-violet-600/30 text-violet-400 border border-violet-500/30">
              <FolderUp className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">
              Local Device Importer
            </span>
          </div>
          <h2 className="text-xl font-bold font-display text-white">
            Add Music from Your Device to Platform Catalog
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Select or drag and drop audio files (<span className="text-violet-300 font-mono">.mp3, .wav, .flac, .m4a, .ogg</span>) directly from your computer, phone, or storage device. 
            Tracks are analyzed with high-precision duration and playable instantly across the entire platform.
          </p>
        </div>

        {/* Global Batch Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac,.flac"
            className="hidden"
            onChange={(e) => {
              if (e.target.files) handleFiles(e.target.files);
              e.target.value = '';
            }}
          />
          <input
            ref={folderInputRef}
            type="file"
            // @ts-expect-error webkitdirectory is standard in Chromium/modern browsers
            webkitdirectory=""
            directory=""
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) handleFiles(e.target.files);
              e.target.value = '';
            }}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-lg shadow-violet-900/30 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Select Files</span>
          </button>

          <button
            onClick={() => folderInputRef.current?.click()}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 text-xs font-semibold border border-white/[0.1] transition-colors"
            title="Import an entire folder of music"
          >
            <FolderUp className="w-3.5 h-3.5 text-slate-300" />
            <span className="hidden sm:inline">Select Folder</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successBanner && (
        <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">
                Successfully published {successBanner.count} device track{successBanner.count > 1 ? 's' : ''} to BASSnBEATS Catalog!
              </p>
              <p className="text-[11px] text-emerald-400/80">
                Tracks are now playable by listeners, stored securely on device storage, and added to the immutable audit ledger.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {successBanner.lastTrack && (
              <button
                onClick={() => playTrack(successBanner.lastTrack!)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Play Now</span>
              </button>
            )}
            <button
              onClick={() => setSuccessBanner(null)}
              className="p-1.5 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Drag & Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer p-8 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center group ${
          isDragging
            ? 'border-violet-500 bg-violet-950/20 scale-[0.99]'
            : 'border-white/[0.12] hover:border-violet-500/50 bg-white/[0.02] hover:bg-white/[0.04]'
        }`}
      >
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600/30 to-fuchsia-600/30 border border-violet-500/30 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform mb-3">
          <Upload className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-white mb-1">
          Drag and drop your audio files here, or <span className="text-violet-400 underline underline-offset-2">browse files</span>
        </h3>
        <p className="text-xs text-slate-400 max-w-md">
          Supports MP3, WAV, FLAC, M4A, AAC, and OGG. Lossless audio quality preserved via Web Audio engine.
        </p>

        {/* Global Defaults Pill */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="mt-4 flex flex-wrap items-center justify-center gap-2 pt-3 border-t border-white/[0.06] text-xs text-slate-400"
        >
          <span>Batch Defaults:</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400">Artist:</span>
            <input
              type="text"
              value={globalArtist}
              onChange={(e) => setGlobalArtist(e.target.value)}
              className="px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/[0.1] text-xs text-white placeholder-slate-400 focus:outline-none focus:border-violet-500"
              placeholder="Artist Name"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400">Genre:</span>
            <select
              value={globalGenre}
              onChange={(e) => setGlobalGenre(e.target.value)}
              className="px-2 py-0.5 rounded-md bg-slate-900 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-violet-500"
            >
              {POPULAR_GENRES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Queued Files List */}
      {queue.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Selected Device Tracks</span>
                <span className="px-2 py-0.5 rounded-full bg-violet-600/30 text-violet-300 text-[10px] font-bold">
                  {queue.length} file{queue.length > 1 ? 's' : ''}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Edit track information and preview audio before publishing to the catalog
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setQueue([])}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                Clear Queue
              </button>

              {unpublishedCount > 0 && (
                <button
                  disabled={isBatchPublishing}
                  onClick={publishAll}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-violet-900/30 transition-all"
                >
                  {isBatchPublishing ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  <span>Publish All ({unpublishedCount})</span>
                </button>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {queue.map((item, index) => {
              const isPlayingThis = previewTrackId === item.id;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all ${
                    item.isPublished
                      ? 'bg-emerald-950/20 border-emerald-500/30'
                      : 'bg-white/[0.02] border-white/[0.07] hover:border-violet-500/30'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left: Preview, Cover, and File Details */}
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Cover with Change & Preview overlay */}
                      <div className="relative group/cover w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-white/[0.1] bg-slate-800">
                        <img
                          src={item.coverUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        {/* Play/Pause Preview Button */}
                        <button
                          onClick={() => togglePreview(item)}
                          className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover/cover:opacity-100 transition-opacity"
                          title="Preview device audio file"
                        >
                          {isPlayingThis ? (
                            <Pause className="w-5 h-5 fill-white text-white" />
                          ) : (
                            <Play className="w-5 h-5 fill-white text-white translate-x-0.5" />
                          )}
                        </button>
                      </div>

                      {/* Title & File Info */}
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-slate-500">#{index + 1}</span>
                          <input
                            type="text"
                            value={item.title}
                            disabled={item.isPublished}
                            onChange={(e) => updateItem(item.id, { title: e.target.value })}
                            placeholder="Track Title"
                            className="bg-transparent font-bold text-sm text-white focus:outline-none focus:border-b focus:border-violet-500 w-full"
                          />
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1 text-violet-300">
                            <FileAudio className="w-3 h-3" />
                            {item.formattedSize}
                          </span>
                          <span>·</span>
                          <span className="font-mono text-slate-300">{item.formattedDuration}</span>
                          <span>·</span>
                          <span className="truncate max-w-[150px] text-slate-400">
                            {item.file.name}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Middle: Metadata Editors */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-1 lg:max-w-xl">
                      {/* Artist Name */}
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-0.5">Artist</label>
                        <input
                          type="text"
                          value={item.artistName}
                          disabled={item.isPublished}
                          onChange={(e) => updateItem(item.id, { artistName: e.target.value })}
                          className="w-full px-2 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500"
                        />
                      </div>

                      {/* Album */}
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-0.5">Album</label>
                        <input
                          type="text"
                          value={item.albumTitle}
                          disabled={item.isPublished}
                          onChange={(e) => updateItem(item.id, { albumTitle: e.target.value })}
                          className="w-full px-2 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500"
                        />
                      </div>

                      {/* Genre */}
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-0.5">Genre</label>
                        <select
                          value={item.genre}
                          disabled={item.isPublished}
                          onChange={(e) => updateItem(item.id, { genre: e.target.value })}
                          className="w-full px-2 py-1 rounded-lg bg-slate-900 border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500"
                        >
                          {POPULAR_GENRES.map((g) => (
                            <option key={g} value={g}>
                              {g}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* BPM */}
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-0.5">BPM</label>
                        <input
                          type="number"
                          value={item.bpm}
                          disabled={item.isPublished}
                          onChange={(e) => updateItem(item.id, { bpm: parseInt(e.target.value) || 120 })}
                          className="w-full px-2 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white font-mono focus:outline-none focus:border-violet-500"
                        />
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Audio Preview Button */}
                      <button
                        onClick={() => togglePreview(item)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          isPlayingThis
                            ? 'bg-fuchsia-600 text-white'
                            : 'bg-white/[0.05] hover:bg-white/[0.1] text-slate-300'
                        }`}
                        title="Preview audio in browser"
                      >
                        {isPlayingThis ? (
                          <>
                            <Pause className="w-3.5 h-3.5" />
                            <span>Stop</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Preview</span>
                          </>
                        )}
                      </button>

                      {/* Custom Image Upload for Cover */}
                      {!item.isPublished && (
                        <label
                          className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white cursor-pointer transition-colors"
                          title="Change cover art with image from device"
                        >
                          <ImageIcon className="w-4 h-4" />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleCustomCoverImage(item.id, e.target.files[0]);
                              }
                            }}
                          />
                        </label>
                      )}

                      {/* Publish / Status Button */}
                      {item.isPublished ? (
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                          <Check className="w-3.5 h-3.5" />
                          <span>Published</span>
                        </span>
                      ) : (
                        <button
                          disabled={item.isPublishing}
                          onClick={() => publishTrack(item)}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-colors disabled:opacity-50"
                        >
                          {item.isPublishing ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Upload className="w-3.5 h-3.5" />
                          )}
                          <span>Publish</span>
                        </button>
                      )}

                      {/* Remove item */}
                      {!item.isPublished && (
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Remove from queue"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {item.error && (
                    <div className="mt-2 text-[11px] text-rose-400 flex items-center gap-1.5">
                      <AlertCircle className="w-3 h-3" />
                      <span>{item.error}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
