import React, { useState } from 'react';
import { useStore } from '../../services/store';
import { FolderPlus, Image as ImageIcon, X } from 'lucide-react';
import { ALBUM_SOUNDSCAPE_IMAGE, ALBUM_SYNTHWAVE_IMAGE } from '../../data/seedData';

export const CreatePlaylistModal: React.FC = () => {
  const {
    isCreatePlaylistOpen,
    setIsCreatePlaylistOpen,
    createPlaylist,
    setSelectedPlaylistId,
    setActiveView,
  } = useStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCover, setSelectedCover] = useState(ALBUM_SYNTHWAVE_IMAGE);

  if (!isCreatePlaylistOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newPl = createPlaylist(title.trim(), description.trim(), selectedCover);
    setSelectedPlaylistId(newPl.id);
    setActiveView('playlist');
    setIsCreatePlaylistOpen(false);
    setTitle('');
    setDescription('');
  };

  const coverOptions = [
    { label: 'Synthwave', url: ALBUM_SYNTHWAVE_IMAGE },
    { label: 'Dawn Soundscape', url: ALBUM_SOUNDSCAPE_IMAGE },
    { label: 'Lo-Fi Chill', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80' },
    { label: 'Dark Bass', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#12141e] border border-white/[0.1] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 text-white animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-violet-400" />
            <h3 className="text-base font-bold font-display text-white">
              Create New Playlist
            </h3>
          </div>
          <button
            onClick={() => setIsCreatePlaylistOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Playlist Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Midnight Heavy Bass Drops"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Give your playlist a mood, backstory, or genre description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-xs focus:outline-none focus:border-violet-500 transition-colors resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Choose Artwork Cover
            </label>
            <div className="grid grid-cols-4 gap-2">
              {coverOptions.map((opt) => (
                <div
                  key={opt.label}
                  onClick={() => setSelectedCover(opt.url)}
                  className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                    selectedCover === opt.url
                      ? 'border-violet-500 shadow-lg shadow-violet-900/50 scale-105'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={opt.url}
                    alt={opt.label}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsCreatePlaylistOpen(false)}
              className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-50 text-xs font-semibold text-white shadow-lg shadow-violet-900/30 transition-all"
            >
              Create Playlist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
