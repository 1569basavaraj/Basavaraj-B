import React, { useState } from 'react';
import { useStore } from '../../services/store';
import { DeviceMusicUploader } from './DeviceMusicUploader';
import { SupabaseLoginHistoryView } from './SupabaseLoginHistoryView';
import {
  AlertTriangle,
  Award,
  Ban,
  CheckCircle,
  Database,
  FileCheck,
  Flame,
  FolderUp,
  LayoutDashboard,
  Music2,
  Pause,
  Play,
  Radio,
  Search,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  TrendingUp,
  UploadCloud,
  Users,
  XCircle,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    user,
    tracks,
    artists,
    albums,
    playlists,
    moderationReports,
    resolveModeration,
    auditLogs,
    addNewAuditLog,
    deleteTrack,
    setActiveView,
    playTrack,
    currentTrack,
    isPlaying,
    togglePlayPause,
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    'analytics' | 'catalog' | 'device_upload' | 'moderation' | 'users' | 'supabase_logins' | 'audit'
  >('analytics');
  const [userSearch, setUserSearch] = useState('');

  // Demo users list for admin management
  const [usersList, setUsersList] = useState([
    { id: 'usr-1', name: 'Basavaraj', email: '1569basavaraj@gmail.com', role: 'USER', plan: 'premium', status: 'active', streams: 1420 },
    { id: 'usr-2', name: 'Rohan Sharma', email: 'rohan.sharma@example.com', role: 'USER', plan: 'free', status: 'active', streams: 380 },
    { id: 'usr-3', name: 'Elena Vance', email: 'elena.vance@sound.io', role: 'PREMIUM', plan: 'premium_plus', status: 'active', streams: 2840 },
    { id: 'usr-4', name: 'Aarav M', email: 'aarav.m@indie.in', role: 'ARTIST', plan: 'premium', status: 'active', streams: 8900 },
    { id: 'usr-5', name: 'Spam Bot 99', email: 'bot99@throwaway.net', role: 'USER', plan: 'free', status: 'suspended', streams: 12 },
  ]);

  const toggleUserStatus = (userId: string) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === 'active' ? 'suspended' : 'active';
          addNewAuditLog('USER_STATUS_CHANGE', 'USER', userId, `Changed user status to ${nextStatus}`);
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const filteredUsers = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 pb-24 text-white">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-fuchsia-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-fuchsia-400">
              System Control · Super Admin
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            BASSnBEATS Administration Console
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time analytics, user access control, moderation queue, and audit ledger
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] overflow-x-auto">
          {(
            [
              { id: 'analytics', label: 'Analytics' },
              { id: 'catalog', label: `Catalog (${tracks.length})` },
              { id: 'device_upload', label: 'Device Music Import' },
              { id: 'supabase_logins', label: '⚡ Supabase Logins' },
              { id: 'moderation', label: `Moderation (${moderationReports.filter(r => r.status === 'pending').length})` },
              { id: 'users', label: 'Users' },
              { id: 'audit', label: 'Audit Logs' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === t.id
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Analytics Dashboard */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          {/* Top 6 KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Daily Active (DAU)
              </span>
              <p className="text-xl sm:text-2xl font-extrabold font-display text-white font-mono-tabular">
                42,850
              </p>
              <span className="text-[10px] text-emerald-400">+8.4%</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Monthly Active (MAU)
              </span>
              <p className="text-xl sm:text-2xl font-extrabold font-display text-white font-mono-tabular">
                380,200
              </p>
              <span className="text-[10px] text-emerald-400">+19.2%</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Premium Paid Ratio
              </span>
              <p className="text-xl sm:text-2xl font-extrabold font-display text-violet-400 font-mono-tabular">
                24.6%
              </p>
              <span className="text-[10px] text-violet-300">93.5k subscribers</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Monthly Revenue (MRR)
              </span>
              <p className="text-xl sm:text-2xl font-extrabold font-display text-emerald-400 font-mono-tabular">
                $468,500
              </p>
              <span className="text-[10px] text-emerald-400">+12% ARR projection</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Catalog Tracks
              </span>
              <p className="text-xl sm:text-2xl font-extrabold font-display text-white font-mono-tabular">
                {tracks.length}
              </p>
              <span className="text-[10px] text-slate-400">100% encoded</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Churn Rate
              </span>
              <p className="text-xl sm:text-2xl font-extrabold font-display text-rose-400 font-mono-tabular">
                1.8%
              </p>
              <span className="text-[10px] text-emerald-400">Industry low</span>
            </div>
          </div>

          {/* Revenue Chart and Stream Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold font-display text-white">
                  Stream Growth & Bandwidth
                </h3>
                <span className="text-xs text-slate-400 font-mono-tabular">
                  Total: 1.48M streams today
                </span>
              </div>

              {/* Bar simulation */}
              <div className="h-44 flex items-end justify-between gap-2 pt-6">
                {[45, 60, 52, 78, 88, 92, 100].map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-violet-600 to-fuchsia-500"
                      style={{ height: `${v}%` }}
                    />
                    <span className="text-[10px] text-slate-500 font-mono-tabular">
                      Day {i + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
              <h3 className="text-base font-bold font-display text-white">
                Platform Health & Encoders
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02]">
                  <span>Audio CDN Edge Nodes</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Operational (14ms latency)
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02]">
                  <span>Lossless FLAC Stream Transcoder</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    100% capacity available
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02]">
                  <span>Payment Gateway Webhook Sync</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Connected & Verified
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-400" />
                    <span className="font-semibold text-emerald-200">Supabase Backend (dckjwkphlkstclfwdpna)</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('supabase_logins')}
                    className="text-xs text-emerald-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>View Login History &rarr;</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Moderation Queue */}
      {activeTab === 'moderation' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold font-display text-white">
              Content Moderation Queue
            </h2>
            <p className="text-xs text-slate-400">
              Audit flagged metadata, copyright claims, and explicit content reports
            </p>
          </div>

          <div className="space-y-3">
            {moderationReports.map((report) => (
              <div
                key={report.id}
                className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">
                      {report.contentTitle}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/[0.06] text-slate-300">
                      {report.contentType}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        report.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-300'
                          : report.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {report.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">
                    Reason: <span className="text-amber-300">{report.reason}</span>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Reported by {report.reportedBy} on {report.createdAt} · {report.notes}
                  </p>
                </div>

                {report.status === 'pending' && (
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => resolveModeration(report.id, 'approved')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white flex items-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => resolveModeration(report.id, 'rejected')}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject & Flag</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: User Management */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold font-display text-white">
                Platform Accounts & Roles
              </h2>
              <p className="text-xs text-slate-400">
                Inspect user tiers, adjust permissions, and enforce security policies
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search user by name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder-slate-400 focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            {filteredUsers.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{u.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-violet-600/30 text-violet-300 font-bold uppercase">
                      {u.plan}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        u.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {u.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{u.email} · {u.streams} lifetime streams</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleUserStatus(u.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      u.status === 'active'
                        ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300'
                        : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300'
                    }`}
                  >
                    {u.status === 'active' ? 'Suspend' : 'Restore'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Music Catalog Management */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div>
              <h2 className="text-lg font-bold font-display text-white">
                Global Music Catalog ({tracks.length} Tracks)
              </h2>
              <p className="text-xs text-slate-400">
                Publish, inspect, audition, and manage tracks across the streaming network
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('device_upload')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-xs font-bold shadow-lg shadow-violet-900/30 transition-all"
              >
                <FolderUp className="w-4 h-4" />
                <span>Add Music from Device</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {tracks.map((track) => {
              const isCurrentPlaying = currentTrack?.id === track.id && isPlaying;
              const isDeviceTrack =
                track.synthPreset === 'device_upload' ||
                track.audioUrl?.startsWith('blob:') ||
                track.audioUrl?.startsWith('device-audio://');

              return (
                <div
                  key={track.id}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                    currentTrack?.id === track.id
                      ? 'bg-violet-950/20 border-violet-500/40'
                      : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative group/play w-10 h-10 rounded-lg overflow-hidden shrink-0">
                      <img
                        src={track.coverUrl}
                        alt={track.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => {
                          if (currentTrack?.id === track.id) {
                            togglePlayPause();
                          } else {
                            playTrack(track);
                          }
                        }}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover/play:opacity-100 transition-opacity"
                        title="Play Track"
                      >
                        {isCurrentPlaying ? (
                          <Pause className="w-4 h-4 fill-white" />
                        ) : (
                          <Play className="w-4 h-4 fill-white translate-x-0.5" />
                        )}
                      </button>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold text-white">{track.title}</p>
                        {isDeviceTrack && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-fuchsia-500/20 text-fuchsia-300 font-bold uppercase tracking-wider">
                            Device Audio
                          </span>
                        )}
                        {track.isExplicit && (
                          <span className="text-[9px] px-1 rounded bg-slate-800 text-slate-400 font-bold">
                            E
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {track.artistName} · {track.genre} · {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')} · {(track.plays / 1000).toFixed(0)}k streams
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (currentTrack?.id === track.id) {
                          togglePlayPause();
                        } else {
                          playTrack(track);
                        }
                      }}
                      className={`p-2 rounded-lg text-xs font-semibold transition-colors ${
                        isCurrentPlaying
                          ? 'bg-violet-600 text-white'
                          : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300'
                      }`}
                      title={isCurrentPlaying ? 'Pause' : 'Play Track'}
                    >
                      {isCurrentPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Remove track "${track.title}" from catalog?`)) {
                          deleteTrack(track.id);
                        }
                      }}
                      className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Delete Track"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Device Music Import */}
      {activeTab === 'device_upload' && (
        <DeviceMusicUploader />
      )}

      {/* Tab: Supabase Live Database Login History */}
      {activeTab === 'supabase_logins' && (
        <SupabaseLoginHistoryView />
      )}

      {/* Tab 5: Audit Ledger */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold font-display text-white">
              Immutable Admin Action Ledger
            </h2>
            <p className="text-xs text-slate-400">
              Every sensitive action is logged with admin credentials, IP address, and timestamp
            </p>
          </div>

          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1 font-mono text-xs"
              >
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-violet-400 font-bold">{log.action}</span>
                  <span className="text-[11px]">{log.timestamp}</span>
                </div>
                <p className="text-slate-200">{log.details}</p>
                <div className="flex items-center gap-3 text-[10px] text-slate-500">
                  <span>Resource: {log.resource} ({log.resourceId})</span>
                  <span>IP: {log.ipAddress}</span>
                  <span>Admin: {log.adminName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
