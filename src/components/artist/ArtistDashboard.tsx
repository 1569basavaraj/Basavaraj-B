import React, { useState } from 'react';
import { useStore } from '../../services/store';
import {
  BarChart3,
  Check,
  Disc,
  DollarSign,
  FileAudio,
  Plus,
  Radio,
  Upload,
  Users,
} from 'lucide-react';
import { ALBUM_SYNTHWAVE_IMAGE } from '../../data/seedData';

export const ArtistDashboard: React.FC = () => {
  const {
    user,
    tracks,
    addNewTrack,
    deleteTrack,
    playTrack,
    setActiveView,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'upload' | 'catalog'>('overview');

  // Track upload form state
  const [title, setTitle] = useState('');
  const [albumTitle, setAlbumTitle] = useState('Singles 2026');
  const [genre, setGenre] = useState('South Bass & Folk Fusion');
  const [bpm, setBpm] = useState(128);
  const [duration, setDuration] = useState(195);
  const [isExplicit, setIsExplicit] = useState(false);
  const [rawLyrics, setRawLyrics] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const artistTracks = tracks.filter(
    (t) => t.artistId === user?.id || t.artistName === user?.name || t.artistName === 'Kavya Rao'
  );

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsUploading(true);

    setTimeout(() => {
      // Parse raw lyrics into timed lines
      const parsedLyrics = rawLyrics
        .split('\n')
        .filter((l) => l.trim().length > 0)
        .map((text, i) => ({
          id: `lyr-${Date.now()}-${i}`,
          time: 5 + i * 12,
          text: text.trim(),
        }));

      addNewTrack({
        title: title.trim(),
        artistId: user?.id || 'art-1',
        artistName: user?.name || 'Kavya Rao',
        albumTitle,
        genre,
        duration: parseInt(duration.toString(), 10) || 195,
        bpm: parseInt(bpm.toString(), 10) || 128,
        isExplicit,
        coverUrl: ALBUM_SYNTHWAVE_IMAGE,
        lyrics: parsedLyrics.length > 0 ? parsedLyrics : undefined,
      });

      setIsUploading(false);
      setUploadSuccess(true);
      setTitle('');
      setRawLyrics('');
      setTimeout(() => {
        setUploadSuccess(false);
        setActiveTab('catalog');
      }, 1500);
    }, 1200);
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 pb-24 text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Radio className="w-4 h-4 text-violet-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-violet-300">
              BASSnBEATS for Artists
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            Artist Studio · {user?.name || 'Kavya Rao'}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your master tracks, publish new audio, and monitor global listener telemetry
          </p>
        </div>

        {/* Tab selection */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'overview'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'catalog'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Catalog ({artistTracks.length})
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
              activeTab === 'upload'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload Music</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Overview & Metrics */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Top 4 Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Monthly Listeners
              </span>
              <p className="text-2xl sm:text-3xl font-extrabold font-display text-white font-mono-tabular">
                1.42M
              </p>
              <span className="text-[10px] text-emerald-400">+14.2% from last month</span>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Total Streams
              </span>
              <p className="text-2xl sm:text-3xl font-extrabold font-display text-white font-mono-tabular">
                8.94M
              </p>
              <span className="text-[10px] text-emerald-400">+22.4% velocity</span>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Catalog Tracks
              </span>
              <p className="text-2xl sm:text-3xl font-extrabold font-display text-white font-mono-tabular">
                {artistTracks.length}
              </p>
              <span className="text-[10px] text-violet-300">All published & active</span>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Estimated Royalties
              </span>
              <p className="text-2xl sm:text-3xl font-extrabold font-display text-emerald-400 font-mono-tabular">
                $14,280
              </p>
              <span className="text-[10px] text-slate-400">Next payout April 15</span>
            </div>
          </div>

          {/* Top performing tracks */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
            <h3 className="text-base font-bold font-display text-white">
              Release Performance Breakdown
            </h3>

            <div className="space-y-2">
              {artistTracks.map((track) => (
                <div
                  key={track.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-xs font-semibold text-white">{track.title}</p>
                      <p className="text-[11px] text-slate-400">{track.genre} · {track.bpm} BPM</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono-tabular text-slate-300">
                    <span>{(track.plays / 1000).toFixed(0)}k streams</span>
                    <span className="text-emerald-400 font-semibold">
                      ${((track.plays * 0.0035)).toFixed(0)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Upload Music System */}
      {activeTab === 'upload' && (
        <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/[0.08] shadow-2xl space-y-6">
          <div>
            <h2 className="text-xl font-bold font-display text-white">
              Upload New Audio Release
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Supports WAV, FLAC, and high-bitrate MP3. Waveforms, streaming bitrate tiers, and normalization are generated automatically.
            </p>
          </div>

          {uploadSuccess ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">
                Release Successfully Published!
              </h3>
              <p className="text-xs text-slate-300">
                "{title}" is now encoded, validated, and available for global streaming on BASSnBEATS.
              </p>
            </div>
          ) : (
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* Mock Audio File Upload Box */}
              <div className="border-2 border-dashed border-white/[0.15] hover:border-violet-500 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-white/[0.01]">
                <FileAudio className="w-10 h-10 text-violet-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-white">
                  Drop master audio file here or click to browse
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  FLAC 24-bit 96kHz or WAV up to 200MB
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Song Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Midnight Sonic Cascade"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Album / Collection
                  </label>
                  <input
                    type="text"
                    value={albumTitle}
                    onChange={(e) => setAlbumTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Genre
                  </label>
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="South Bass & Folk Fusion" className="bg-[#12141f]">South Bass</option>
                    <option value="Synthwave & Retrowave" className="bg-[#12141f]">Synthwave</option>
                    <option value="EDM & Dance" className="bg-[#12141f]">EDM & Dance</option>
                    <option value="Lo-Fi Chill & Beats" className="bg-[#12141f]">Lo-Fi Chill</option>
                    <option value="Hip-Hop & Trap" className="bg-[#12141f]">Hip-Hop / Trap</option>
                    <option value="Neo-Soul & R&B" className="bg-[#12141f]">Neo-Soul</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Tempo (BPM)
                  </label>
                  <input
                    type="number"
                    value={bpm}
                    onChange={(e) => setBpm(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.1] text-xs font-mono text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Duration (Sec)
                  </label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.1] text-xs font-mono text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Lyrics (One line per row for auto-sync)
                </label>
                <textarea
                  rows={4}
                  placeholder="Enter track lyrics here line by line..."
                  value={rawLyrics}
                  onChange={(e) => setRawLyrics(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-violet-500 resize-none font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="explicit"
                  checked={isExplicit}
                  onChange={(e) => setIsExplicit(e.target.checked)}
                  className="rounded bg-white/10 border-white/20 text-violet-600 focus:ring-0"
                />
                <label htmlFor="explicit" className="text-xs text-slate-300">
                  Contains explicit content / language
                </label>
              </div>

              <button
                type="submit"
                disabled={isUploading || !title.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 hover:opacity-95 disabled:opacity-50 text-xs font-bold text-white shadow-lg shadow-violet-900/40 transition-all flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Processing Audio & Normalizing...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Publish Release Worldwide</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Tab 3: Catalog Management */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold font-display text-white">
              Published Catalog
            </h3>
            <button
              onClick={() => setActiveTab('upload')}
              className="px-3.5 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Track</span>
            </button>
          </div>

          <div className="space-y-2">
            {artistTracks.map((track) => (
              <div
                key={track.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div>
                    <p className="text-xs font-semibold text-white">{track.title}</p>
                    <p className="text-[11px] text-slate-400">
                      {track.albumTitle || 'Single'} · {track.genre} · {track.releaseYear}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => playTrack(track, artistTracks)}
                    className="px-3 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-xs font-medium text-slate-200"
                  >
                    Play
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Remove track "${track.title}" from catalog?`)) {
                        deleteTrack(track.id);
                      }
                    }}
                    className="text-xs text-rose-400 hover:text-rose-300 p-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
