import React, { useState } from 'react';
import { useStore } from '../../services/store';
import { Check, Copy, ExternalLink, Share2, X } from 'lucide-react';

export const ShareModal: React.FC = () => {
  const { isShareModalOpen, setIsShareModalOpen, shareItem } = useStore();
  const [copied, setCopied] = useState(false);

  if (!isShareModalOpen || !shareItem) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareItem.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#12141e] border border-white/[0.1] rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-5 text-white animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-violet-400" />
            <h3 className="text-sm font-bold font-display text-white">
              Share Music
            </h3>
          </div>
          <button
            onClick={() => setIsShareModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4">
          <p className="text-xs text-slate-400 mb-1">Sharing</p>
          <h4 className="text-base font-bold text-white truncate">
            {shareItem.title}
          </h4>
          <p className="text-xs text-slate-300 mb-4">{shareItem.subtitle}</p>

          <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.04] border border-white/[0.08]">
            <input
              type="text"
              readOnly
              value={shareItem.url}
              className="bg-transparent text-xs text-slate-300 w-full focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white flex items-center gap-1 shrink-0 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-2">
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: shareItem.title,
                  text: `Listen to ${shareItem.title} on BASSnBEATS!`,
                  url: shareItem.url,
                }).catch(() => {});
              } else {
                handleCopy();
              }
            }}
            className="w-full py-2 px-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open System Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};
