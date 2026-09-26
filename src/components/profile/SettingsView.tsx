import React, { useEffect, useState } from 'react';
import { useStore } from '../../services/store';
import { EqualizerPreset } from '../../services/audioPlayer';
import { AudioQuality } from '../../types';
import {
  Clock,
  Database,
  Globe2,
  HardDrive,
  Headphones,
  Laptop,
  Lock,
  LogOut,
  Shield,
  Sliders,
  Smartphone,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { fetchSupabaseLoginHistory, SUPABASE_PROJECT_ID, SupabaseLoginRecord } from '../../services/supabase';

export const SettingsView: React.FC = () => {
  const {
    user,
    logout,
    audioQuality,
    setAudioQuality,
    equalizerPreset,
    setEqualizerPreset,
    language,
    setLanguage,
    switchUserRole,
  } = useStore();

  const [crossfade, setCrossfade] = useState(3);
  const [dataSaver, setDataSaver] = useState(false);
  const [userLogins, setUserLogins] = useState<SupabaseLoginRecord[]>([]);

  useEffect(() => {
    fetchSupabaseLoginHistory(5).then((res) => {
      if (res.records) {
        setUserLogins(res.records.slice(0, 5));
      }
    });
  }, []);

  const languages = [
    { code: 'en', name: 'English (US)' },
    { code: 'hi', name: 'हिन्दी (Hindi)' },
    { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
    { code: 'ta', name: 'தமிழ் (Tamil)' },
    { code: 'te', name: 'తెలుగు (Telugu)' },
    { code: 'ml', name: 'മലയാളം (Malayalam)' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)' },
  ];

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-8 pb-24 text-white">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
          Settings & Preferences
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Manage your audio fidelity, playback hardware, language, and account
        </p>
      </div>

      {/* User Profile Card */}
      {user && (
        <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={user.avatarUrl}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-full object-cover ring-2 ring-violet-500/50"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{user.name}</h3>
                <span className="px-2 py-0.5 rounded-full bg-violet-600/30 text-[10px] font-bold text-violet-300 uppercase tracking-wider">
                  {user.plan}
                </span>
              </div>
              <p className="text-xs text-slate-400">@{user.username} · {user.email}</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Role: <strong className="text-slate-300">{user.role}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-rose-500/20 text-xs font-semibold text-rose-300 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}

      {/* Audio Quality & Streaming */}
      <section className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-5">
        <div className="flex items-center gap-2">
          <Headphones className="w-5 h-5 text-violet-400" />
          <h2 className="text-base font-bold font-display text-white">
            Audio Streaming Quality
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(
            [
              { id: 'low', label: 'Low (96 kbps)', desc: 'Saves data, optimized for 3G networks' },
              { id: 'normal', label: 'Normal (192 kbps)', desc: 'Standard balanced streaming' },
              { id: 'high', label: 'High (320 kbps)', desc: 'Crisp studio audio output' },
              { id: 'lossless', label: 'Lossless 24-bit 96kHz', desc: 'Uncompressed studio master quality' },
            ] as const
          ).map((q) => (
            <button
              key={q.id}
              onClick={() => setAudioQuality(q.id as AudioQuality)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                audioQuality === q.id
                  ? 'bg-violet-600/20 border-violet-500 shadow-sm shadow-violet-900/40'
                  : 'bg-white/[0.02] border-white/[0.06] hover:border-white/20'
              }`}
            >
              <p className="text-xs font-bold text-white mb-0.5">{q.label}</p>
              <p className="text-[11px] text-slate-400">{q.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Equalizer & Sonic Character */}
      <section className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold font-display text-white">
              Parametric Hardware Equalizer
            </h2>
          </div>
          <span className="text-xs text-cyan-400 font-semibold uppercase">
            Active: {equalizerPreset.replace('_', ' ')}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {(
            [
              { id: 'flat', label: 'Flat Reference' },
              { id: 'bass_boost', label: 'Sub-Bass Boost' },
              { id: 'vocal', label: 'Vocal Clarity' },
              { id: 'club', label: 'Club / Dancefloor' },
              { id: 'acoustic', label: 'Acoustic Warmth' },
              { id: 'treble_boost', label: 'Treble Enhancer' },
            ] as const
          ).map((preset) => (
            <button
              key={preset.id}
              onClick={() => setEqualizerPreset(preset.id as EqualizerPreset)}
              className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                equalizerPreset === preset.id
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                  : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </section>

      {/* Playback Controls & Crossfade */}
      <section className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
        <h2 className="text-base font-bold font-display text-white">
          Playback Transition & Data
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-white">Track Crossfade</p>
              <p className="text-[11px] text-slate-400">Crossfade between songs seamlessly</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="12"
                value={crossfade}
                onChange={(e) => setCrossfade(parseInt(e.target.value, 10))}
                className="w-24 accent-violet-400"
              />
              <span className="text-xs font-mono-tabular w-8 text-right text-slate-300">{crossfade}s</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
            <div>
              <p className="text-xs font-semibold text-white">Data Saver Mode</p>
              <p className="text-[11px] text-slate-400">Reduces bandwidth and limits animated visualizers</p>
            </div>
            <button
              onClick={() => setDataSaver(!dataSaver)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                dataSaver ? 'bg-violet-600' : 'bg-white/[0.1]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  dataSaver ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* Language Selector */}
      <section className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
        <div className="flex items-center gap-2">
          <Globe2 className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-bold font-display text-white">
            Display & Regional Language
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => setLanguage(l.code)}
              className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                language === l.code
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                  : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white'
              }`}
            >
              {l.name}
            </button>
          ))}
        </div>
      </section>

      {/* Supabase Security & Login History */}
      <section className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold font-display text-white">
              Supabase Login History & Security
            </h2>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Project: {SUPABASE_PROJECT_ID}
          </span>
        </div>

        <p className="text-xs text-slate-400">
          Your account sessions are automatically tracked and saved in your Supabase database.
        </p>

        <div className="space-y-2">
          {userLogins.length === 0 ? (
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center text-xs text-slate-400">
              No recent login records found in Supabase.
            </div>
          ) : (
            userLogins.map((rec) => (
              <div
                key={rec.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Shield className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {rec.device || 'Desktop'} • {rec.browser || 'Web Browser'} ({rec.os || 'OS'})
                    </p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {new Date(rec.created_at).toLocaleString()} • Method: {rec.login_method || 'email'}
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {rec.status}
                </span>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Connected Devices */}
      <section className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
        <h2 className="text-base font-bold font-display text-white">
          Active Devices
        </h2>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 rounded-xl bg-violet-600/10 border border-violet-500/20">
            <div className="flex items-center gap-3">
              <Laptop className="w-5 h-5 text-violet-400" />
              <div>
                <p className="text-xs font-semibold text-white">BASSnBEATS Web Player</p>
                <p className="text-[10px] text-violet-300 font-mono-tabular">Active playback device</p>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-slate-500" />
              <div>
                <p className="text-xs font-semibold text-slate-300">Android PWA / Mobile</p>
                <p className="text-[10px] text-slate-500 font-mono-tabular">Last active 3 hours ago</p>
              </div>
            </div>
            <span className="text-[10px] text-slate-500">Standby</span>
          </div>
        </div>
      </section>
    </div>
  );
};
