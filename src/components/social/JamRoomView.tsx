import React from 'react';
import { useStore } from '../../services/store';
import { formatTime } from '../../utils/formatters';
import { MessageSquare, Play, Radio, Share2, Sparkles, Users } from 'lucide-react';

export const JamRoomView: React.FC = () => {
  const {
    jamRoom,
    sendJamReaction,
    tracks,
    playTrack,
    currentTrack,
    isPlaying,
    openShareModal,
  } = useStore();

  const activeTrack = tracks.find((t) => t.id === jamRoom.activeTrackId) || tracks[0];
  const reactionEmojis = ['🔥', '⚡', '❤️', '🚀', '🔊', '🙌', '💯'];

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Live Listening Session
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            {jamRoom.name}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Hosted by <strong className="text-slate-200">{jamRoom.hostName}</strong> · Synchronized real-time playback
          </p>
        </div>

        <button
          onClick={() =>
            openShareModal(
              jamRoom.name,
              `Join ${jamRoom.hostName}'s live Jam Room!`,
              `https://bassnbeats.app/jam/${jamRoom.id}`
            )
          }
          className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-white flex items-center gap-1.5 transition-colors self-start sm:self-auto border border-white/[0.08]"
        >
          <Share2 className="w-4 h-4" />
          <span>Invite Friends</span>
        </button>
      </div>

      {/* Main Room Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Audio Stage */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-violet-950/40 via-[#101322] to-[#0a0c16] border border-white/[0.08] shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <img
              src={activeTrack.coverUrl}
              alt={activeTrack.title}
              referrerPolicy="no-referrer"
              className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl object-cover shadow-2xl ring-1 ring-white/10 shrink-0"
            />
            <div className="text-center sm:text-left space-y-2">
              <span className="px-2.5 py-0.5 rounded-full bg-violet-600/30 border border-violet-500/40 text-[10px] font-bold uppercase text-violet-300">
                Broadcasting to Room
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
                {activeTrack.title}
              </h2>
              <p className="text-xs text-slate-300">
                {activeTrack.artistName} · {activeTrack.genre}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => playTrack(activeTrack)}
                  className="px-5 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-95 text-xs font-bold text-white shadow-lg shadow-violet-900/40 flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{isPlaying ? 'Synced with Room' : 'Tune In to Jam'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Real-Time Emoji Reaction Bar */}
          <div className="pt-6 border-t border-white/[0.08]">
            <span className="text-xs font-semibold text-slate-400 block mb-2.5">
              Drop a Live Reaction:
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {reactionEmojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => sendJamReaction(emoji)}
                  className="w-10 h-10 rounded-xl bg-white/[0.05] hover:bg-white/[0.12] hover:scale-110 active:scale-95 transition-all text-lg flex items-center justify-center border border-white/[0.06]"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Active Listeners & Reaction Stream */}
        <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold font-display text-white">
                  Listeners in Room
                </h3>
              </div>
              <span className="text-xs font-mono-tabular text-emerald-400 font-bold">
                {jamRoom.listenerCount} online
              </span>
            </div>

            {/* Listener avatars list */}
            <div className="space-y-2.5">
              {jamRoom.listeners.map((listener) => (
                <div
                  key={listener.id}
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.02]"
                >
                  <img
                    src={listener.avatar}
                    alt={listener.name}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-violet-500/40"
                  />
                  <span className="text-xs font-medium text-slate-200">
                    {listener.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Live Reactions Ticker */}
          <div className="pt-4 border-t border-white/[0.06]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Recent Reactions
            </span>
            <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
              {jamRoom.reactions.map((r) => (
                <span
                  key={r.id}
                  className="px-2.5 py-1 rounded-lg bg-white/[0.04] text-xs text-slate-300 flex items-center gap-1.5 animate-in zoom-in-75 duration-200"
                >
                  <span>{r.emoji}</span>
                  <span className="text-[10px] text-slate-400">{r.userName}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
