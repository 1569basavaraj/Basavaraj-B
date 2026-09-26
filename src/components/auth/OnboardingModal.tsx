import React, { useState } from 'react';
import { useStore } from '../../services/store';
import { Check, Compass, Sparkles } from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const {
    genres,
    artists,
    updateUserPreferences,
    setIsAuthModalOpen,
    setActiveView,
  } = useStore();

  const [step, setStep] = useState(1);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([
    'South Bass & Folk Fusion',
    'EDM & Dance',
    'Synthwave & Retrowave',
  ]);
  const [selectedArtists, setSelectedArtists] = useState<string[]>([
    'Kavya Rao',
    'Neon Voyager',
  ]);
  const [selectedMood, setSelectedMood] = useState<string>('Energetic & Bass Heavy');

  const toggleGenre = (genreName: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genreName)
        ? prev.filter((g) => g !== genreName)
        : [...prev, genreName]
    );
  };

  const toggleArtist = (artistName: string) => {
    setSelectedArtists((prev) =>
      prev.includes(artistName)
        ? prev.filter((a) => a !== artistName)
        : [...prev, artistName]
    );
  };

  const moods = [
    { id: 'energetic', name: 'Energetic & Bass Heavy', desc: 'Punchy 808s, EDM drops & rhythm' },
    { id: 'chill', name: 'Chill & Relaxed', desc: 'Warm lo-fi, acoustic melodies & ambient' },
    { id: 'focus', name: 'Deep Focus & Study', desc: 'Zero vocal distraction, smooth beats' },
    { id: 'workout', name: 'Gym & Adrenaline', desc: 'Maximum BPM & heavy workout motivation' },
  ];

  const handleFinish = () => {
    updateUserPreferences(selectedGenres, selectedArtists);
    setIsAuthModalOpen(false);
    setActiveView('home');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#12141f] border border-white/[0.1] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl p-6 text-white animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Progress Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-violet-400">
              Onboarding · Step {step} of 3
            </span>
            <h3 className="text-lg font-bold font-display text-white">
              {step === 1 && 'What kind of music do you love?'}
              {step === 2 && 'Choose artists you love'}
              {step === 3 && 'Choose your listening mood'}
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono-tabular">
            {step}/3
          </span>
        </div>

        {/* Step 1: Genres */}
        {step === 1 && (
          <div className="py-4 flex-1 overflow-y-auto pr-1">
            <p className="text-xs text-slate-400 mb-3">
              Select at least 3 genres to personalize your daily mixes and algorithmic radar.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {genres.map((g) => {
                const isSelected = selectedGenres.includes(g.name);
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => toggleGenre(g.name)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-violet-600/20 border-violet-500 text-white shadow-sm shadow-violet-900/40'
                        : 'bg-white/[0.03] border-white/[0.08] text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <span className="truncate pr-1">{g.name}</span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Artists */}
        {step === 2 && (
          <div className="py-4 flex-1 overflow-y-auto pr-1">
            <p className="text-xs text-slate-400 mb-3">
              Pick creators that match your vibe. We'll prioritize their releases and collaborations.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {artists.map((art) => {
                const isSelected = selectedArtists.includes(art.name);
                return (
                  <button
                    key={art.id}
                    type="button"
                    onClick={() => toggleArtist(art.name)}
                    className={`p-3 rounded-xl border flex flex-col items-center text-center transition-all ${
                      isSelected
                        ? 'bg-violet-600/20 border-violet-500 text-white shadow-md'
                        : 'bg-white/[0.03] border-white/[0.08] text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <img
                      src={art.avatarUrl}
                      alt={art.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-full object-cover mb-2 ring-1 ring-white/10"
                    />
                    <span className="text-xs font-semibold truncate w-full">
                      {art.name}
                    </span>
                    <span className="text-[10px] text-slate-500 truncate w-full">
                      {art.genres[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Mood */}
        {step === 3 && (
          <div className="py-4 flex-1 overflow-y-auto pr-1 space-y-2.5">
            <p className="text-xs text-slate-400 mb-3">
              What state of mind are you looking to unlock right now?
            </p>
            {moods.map((m) => {
              const isSelected = selectedMood === m.name;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedMood(m.name)}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-violet-600/20 border-violet-500 shadow-md shadow-violet-900/40'
                      : 'bg-white/[0.03] border-white/[0.08] hover:border-white/20'
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-bold text-white mb-0.5">
                      {m.name}
                    </h4>
                    <p className="text-[11px] text-slate-400">{m.desc}</p>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-violet-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Footer Navigation */}
        <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-slate-300 transition-colors"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white shadow-md shadow-violet-900/30 transition-colors"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 hover:opacity-90 text-xs font-bold text-white shadow-lg shadow-violet-900/40 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>Start Listening</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
