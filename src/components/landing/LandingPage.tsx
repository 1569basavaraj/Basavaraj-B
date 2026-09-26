import React from 'react';
import { useStore } from '../../services/store';
import { Logo } from '../common/Logo';
import {
  ArrowRight,
  Check,
  Disc3,
  Download,
  Flame,
  Globe2,
  Headphones,
  Mic2,
  Play,
  Radio,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import { HERO_BANNER_IMAGE, SEED_PLANS } from '../../data/seedData';

export const LandingPage: React.FC = () => {
  const {
    setActiveView,
    setIsAuthModalOpen,
    setAuthModalMode,
    setSelectedCheckoutPlan,
    setIsCheckoutModalOpen,
    playTrack,
    tracks,
  } = useStore();

  const handleStartListening = () => {
    setAuthModalMode('register');
    setIsAuthModalOpen(true);
  };

  const handleExploreMusic = () => {
    setActiveView('home');
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 selection:bg-fuchsia-500/30 selection:text-fuchsia-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#090a0f]/80 backdrop-blur-xl border-b border-white/[0.06] px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <Logo size="md" withTagline={true} />

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setAuthModalMode('login');
              setIsAuthModalOpen(true);
            }}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Log In
          </button>
          <button
            onClick={handleStartListening}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 hover:opacity-90 text-xs font-bold text-white shadow-lg shadow-violet-900/30 transition-all flex items-center gap-1.5"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 pt-16 pb-24 md:pt-24 md:pb-32 max-w-7xl mx-auto overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-violet-600/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-40 right-10 w-[400px] h-[300px] bg-fuchsia-600/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>Next-Generation Streaming Engine · Hi-Res 24-bit Lossless</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-display tracking-tight text-white leading-[1.08]">
            Your Sound. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400">
              Your Vibe.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto leading-relaxed">
            Experience music with subterranean bass, synchronized real-time lyrics, offline encrypted downloads, and curated South Indian beats to global synthwave.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={handleStartListening}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 hover:opacity-95 text-sm font-bold text-white shadow-xl shadow-violet-900/40 transition-transform active:scale-95"
            >
              Start Listening Free
            </button>
            <button
              onClick={handleExploreMusic}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-sm font-semibold text-slate-200 transition-colors flex items-center justify-center gap-2"
            >
              <Disc3 className="w-4 h-4 text-violet-400" />
              <span>Explore Music Catalog</span>
            </button>
          </div>
        </div>

        {/* Hero Artwork Mockup */}
        <div className="mt-12 md:mt-16 relative rounded-3xl overflow-hidden border border-white/[0.1] shadow-2xl max-w-4xl mx-auto group">
          <img
            src={HERO_BANNER_IMAGE}
            alt="BASSnBEATS Sound Experience"
            referrerPolicy="no-referrer"
            className="w-full h-auto object-cover max-h-[460px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f] via-transparent to-transparent flex items-end p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-cyan-300 font-bold">Now Streaming</span>
                <h3 className="text-lg font-bold text-white">Raga Resonance · Kavya Rao</h3>
                <p className="text-xs text-slate-300">South Bass & Folk Fusion · 124 BPM</p>
              </div>
              <button
                onClick={() => playTrack(tracks[0])}
                className="px-5 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white flex items-center gap-2 shadow-lg shadow-violet-900/40"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Play Preview Track</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 10 Core Platform Pillars */}
      <section className="px-6 py-20 bg-white/[0.01] border-y border-white/[0.05]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
              Built for Sonic Perfection
            </h2>
            <p className="text-sm text-slate-400">
              Every detail engineered to give you the deepest, most immersive listening experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center">
                <Headphones className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold font-display text-white">
                Studio-Grade 24-bit Lossless
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Stream in pristine 96kHz master clarity. Built-in 3-band parametric EQ and custom sub-bass boost filters.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-fuchsia-600/20 text-fuchsia-400 flex items-center justify-center">
                <Mic2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold font-display text-white">
                Synchronized Timed Lyrics
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Line-by-line real-time lyrics that scroll in lockstep with the vocals. Tap any line to seek playback instantly.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold font-display text-white">
                Offline Mode & Downloads
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Download your favorite playlists and albums locally. Enjoy zero-buffer playback without an internet connection.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                <Radio className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold font-display text-white">
                Live Jam Listening Rooms
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tune in to collaborative listening sessions. React with live emojis and discover what your squad is spinning.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold font-display text-white">
                South Bass & Regional Waves
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dedicated home for Kannada, Tamil, Telugu, and Punjabi electronic fusion, alongside global mainstream hits.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold font-display text-white">
                Artist & Creator First
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direct artist portal, transparent stream analytics, copyright protection, and rapid metadata publishing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-violet-400">
            Subscription Plans
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Choose Your Vibe
          </h2>
          <p className="text-sm text-slate-400">
            Ad-supported streaming forever free, or unlock lossless audio and offline playback with Premium.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {SEED_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`p-6 rounded-3xl border flex flex-col justify-between transition-all ${
                plan.popular
                  ? 'bg-violet-950/30 border-violet-500 shadow-xl shadow-violet-950/50 relative scale-105'
                  : 'bg-white/[0.02] border-white/[0.08]'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-md">
                  Most Popular
                </div>
              )}

              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {plan.badge}
                </span>
                <h3 className="text-xl font-bold font-display text-white mt-1">
                  {plan.name}
                </h3>
                <div className="my-4 flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold font-display text-white font-mono-tabular">
                    ${plan.monthlyPrice}
                  </span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>

                <div className="space-y-2.5 py-4 border-t border-white/[0.06]">
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => {
                    setSelectedCheckoutPlan(plan);
                    setIsCheckoutModalOpen(true);
                  }}
                  className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-95 text-white shadow-lg shadow-violet-900/40'
                      : 'bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/[0.1]'
                  }`}
                >
                  {plan.monthlyPrice === 0 ? 'Start Free' : `Upgrade to ${plan.name}`}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] px-6 py-12 bg-[#06070a] text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <Logo size="sm" withTagline={true} />
            <p className="text-[11px] text-slate-400 mt-2">
              © 2026 BASSnBEATS Inc. All rights reserved. Your Sound. Your Vibe.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <button onClick={() => setActiveView('discover')} className="hover:text-white transition-colors">
              Discover
            </button>
            <button onClick={() => setActiveView('subscription')} className="hover:text-white transition-colors">
              Plans
            </button>
            <button onClick={() => setActiveView('admin')} className="hover:text-white transition-colors">
              Admin Suite
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
