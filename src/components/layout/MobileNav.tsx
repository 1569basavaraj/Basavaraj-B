import React from 'react';
import { useStore } from '../../services/store';
import { Compass, Home, Library, Radio, Search, User as UserIcon } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeView, setActiveView } = useStore();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a0c14]/95 backdrop-blur-xl border-t border-white/[0.08] px-2 py-1.5 flex items-center justify-around select-none">
      <button
        onClick={() => setActiveView('home')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors ${
          activeView === 'home' ? 'text-violet-400 font-semibold' : 'text-slate-400 hover:text-white'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px]">Home</span>
      </button>

      <button
        onClick={() => setActiveView('search')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors ${
          activeView === 'search' ? 'text-violet-400 font-semibold' : 'text-slate-400 hover:text-white'
        }`}
      >
        <Search className="w-5 h-5" />
        <span className="text-[10px]">Search</span>
      </button>

      <button
        onClick={() => setActiveView('discover')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors ${
          activeView === 'discover' ? 'text-violet-400 font-semibold' : 'text-slate-400 hover:text-white'
        }`}
      >
        <Compass className="w-5 h-5" />
        <span className="text-[10px]">Discover</span>
      </button>

      <button
        onClick={() => setActiveView('library')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors ${
          activeView === 'library' || activeView === 'playlist' ? 'text-violet-400 font-semibold' : 'text-slate-400 hover:text-white'
        }`}
      >
        <Library className="w-5 h-5" />
        <span className="text-[10px]">Library</span>
      </button>

      <button
        onClick={() => setActiveView('jam')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors relative ${
          activeView === 'jam' ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-white'
        }`}
      >
        <Radio className="w-5 h-5" />
        <span className="text-[10px]">Live</span>
        <span className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
      </button>

      <button
        onClick={() => setActiveView('settings')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors ${
          activeView === 'settings' ? 'text-violet-400 font-semibold' : 'text-slate-400 hover:text-white'
        }`}
      >
        <UserIcon className="w-5 h-5" />
        <span className="text-[10px]">You</span>
      </button>
    </nav>
  );
};
