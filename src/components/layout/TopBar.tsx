import React from 'react';
import { useStore } from '../../services/store';
import { ShieldCheck, Sparkles, User as UserIcon } from 'lucide-react';

export const TopBar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    user,
    setIsAuthModalOpen,
    setAuthModalMode,
    switchUserRole,
  } = useStore();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3.5 bg-[#090a0f]/90 backdrop-blur-xl border-b border-white/[0.06] select-none">
      {/* Zone 1: Single element Brand Zone */}
      <button
        onClick={() => setActiveView('home')}
        className="flex items-center gap-2.5 text-left text-lg font-extrabold tracking-tight text-white font-display hover:opacity-90 transition-opacity focus:outline-none"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 inline-block shadow-sm shadow-fuchsia-500/50"></span>
        <span>BASSnBEATS</span>
      </button>

      {/* Zone 2: 4-6 Clean text navigation links */}
      <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
        <button
          onClick={() => setActiveView('home')}
          className={`hover:text-white transition-colors cursor-pointer ${
            activeView === 'home' ? 'text-white font-semibold underline underline-offset-8 decoration-violet-500' : ''
          }`}
        >
          Home
        </button>
        <button
          onClick={() => setActiveView('discover')}
          className={`hover:text-white transition-colors cursor-pointer ${
            activeView === 'discover' ? 'text-white font-semibold underline underline-offset-8 decoration-violet-500' : ''
          }`}
        >
          Discover
        </button>
        <button
          onClick={() => setActiveView('search')}
          className={`hover:text-white transition-colors cursor-pointer ${
            activeView === 'search' ? 'text-white font-semibold underline underline-offset-8 decoration-violet-500' : ''
          }`}
        >
          Search
        </button>
        <button
          onClick={() => setActiveView('jam')}
          className={`hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeView === 'jam' ? 'text-white font-semibold underline underline-offset-8 decoration-violet-500' : ''
          }`}
        >
          <span>Live Jam</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        </button>
        <button
          onClick={() => setActiveView('subscription')}
          className={`hover:text-white transition-colors cursor-pointer ${
            activeView === 'subscription' ? 'text-white font-semibold underline underline-offset-8 decoration-violet-500' : ''
          }`}
        >
          Plans
        </button>
        <button
          onClick={() => setActiveView('stats')}
          className={`hover:text-white transition-colors cursor-pointer ${
            activeView === 'stats' ? 'text-white font-semibold underline underline-offset-8 decoration-violet-500' : ''
          }`}
        >
          Statistics
        </button>
      </nav>

      {/* Zone 3: 1-2 Primary Actions */}
      <div className="flex items-center gap-3">
        {/* Role Quick Switcher for testing/demo */}
        <div className="hidden lg:flex items-center gap-1 p-1 bg-white/[0.04] border border-white/[0.08] rounded-lg text-xs">
          <button
            onClick={() => switchUserRole('listener')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              user?.role === 'USER' || !user ? 'bg-violet-600 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Listener
          </button>
          <button
            onClick={() => switchUserRole('artist')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              user?.role === 'ARTIST' ? 'bg-violet-600 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Artist
          </button>
          <button
            onClick={() => switchUserRole('admin')}
            className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
              user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' ? 'bg-fuchsia-600 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Admin</span>
          </button>
        </div>

        {user ? (
          <div className="flex items-center gap-2.5">
            {user.plan === 'free' ? (
              <button
                onClick={() => setActiveView('subscription')}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-full transition-all shadow-md shadow-violet-900/30 whitespace-nowrap flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-cyan-300" />
                <span>Upgrade</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveView('subscription')}
                className="px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase text-violet-300 bg-violet-950/60 border border-violet-500/30 rounded-full hover:bg-violet-900/40 transition-colors whitespace-nowrap"
              >
                {user.plan === 'premium_plus' ? 'Audiophile' : 'Premium'}
              </button>
            )}

            <button
              onClick={() => setActiveView('settings')}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] transition-colors"
            >
              <img
                src={user.avatarUrl}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-6 h-6 rounded-full object-cover ring-1 ring-violet-500/50"
              />
              <span className="hidden sm:inline text-xs font-medium text-slate-200 truncate max-w-[100px]">
                {user.name.split(' ')[0]}
              </span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setAuthModalMode('login');
                setIsAuthModalOpen(true);
              }}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors"
            >
              Log In
            </button>
            <button
              onClick={() => {
                setAuthModalMode('register');
                setIsAuthModalOpen(true);
              }}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-full transition-colors flex items-center gap-1"
            >
              <UserIcon className="w-3 h-3" />
              <span>Sign Up</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
