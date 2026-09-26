import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  withTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', withTagline = false }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2.5 group cursor-pointer select-none ${className}`}>
      {/* Original BASSnBEATS Sound Wave Logo Mark */}
      <div className={`relative ${iconSizes[size]} rounded-xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-cyan-500 p-0.5 flex items-center justify-center shadow-lg shadow-violet-900/30 group-hover:shadow-violet-600/40 transition-shadow`}>
        <div className="w-full h-full bg-[#0a0c14] rounded-[10px] flex items-center justify-center overflow-hidden relative">
          {/* Sonic Soundwave Frequency Bars forming the stylized 'B' */}
          <div className="flex items-center gap-[2.5px] px-1.5 h-full">
            <span className="w-[3px] h-3 bg-cyan-400 rounded-full animate-wave-1"></span>
            <span className="w-[3px] h-5 bg-violet-400 rounded-full animate-wave-2"></span>
            <span className="w-[3.5px] h-6.5 bg-fuchsia-400 rounded-full animate-wave-3"></span>
            <span className="w-[3px] h-4 bg-violet-400 rounded-full animate-wave-4"></span>
            <span className="w-[2.5px] h-2 bg-cyan-400 rounded-full animate-wave-1"></span>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <div className={`font-display font-extrabold tracking-tight text-white flex items-center ${textSizes[size]}`}>
          BASS<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400">n</span>BEATS
        </div>
        {withTagline && (
          <span className="text-[10px] font-medium tracking-widest text-slate-400 uppercase -mt-0.5">
            Your Sound. Your Vibe.
          </span>
        )}
      </div>
    </div>
  );
};
