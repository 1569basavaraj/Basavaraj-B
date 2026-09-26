import React, { useState } from 'react';
import { useStore } from '../../services/store';
import confetti from 'canvas-confetti';
import { Check, CreditCard, Lock, ShieldCheck, Sparkles, X } from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    selectedCheckoutPlan,
    user,
  } = useStore();

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isCheckoutModalOpen || !selectedCheckoutPlan) return null;

  const price = billingCycle === 'monthly'
    ? selectedCheckoutPlan.monthlyPrice
    : selectedCheckoutPlan.yearlyPrice;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      // Trigger Confetti!
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#8b5cf6', '#ec4899', '#06b6d4', '#eab308'],
        });
      } catch {
        // Fallback if canvas is unavailable
      }

      // Upgrade User Plan
      if (user) {
        user.plan = selectedCheckoutPlan.id as 'free' | 'premium' | 'premium_plus';
        localStorage.setItem('bnb_user', JSON.stringify(user));
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#12141e] border border-white/[0.1] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 text-white animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold font-display text-white">
              Upgrade to {selectedCheckoutPlan.name}
            </h3>
          </div>
          <button
            onClick={() => {
              setIsCheckoutModalOpen(false);
              setIsSuccess(false);
            }}
            className="text-slate-400 hover:text-white p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-xl font-bold font-display text-white">
                Welcome to {selectedCheckoutPlan.name}!
              </h4>
              <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
                Your account is now activated with unlimited high-fidelity audio, offline listening, and zero interruptions.
              </p>
            </div>
            <button
              onClick={() => {
                setIsCheckoutModalOpen(false);
                setIsSuccess(false);
              }}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-xs font-semibold text-white shadow-lg shadow-violet-900/40"
            >
              Start High-Fi Streaming
            </button>
          </div>
        ) : (
          <form onSubmit={handleCheckout} className="py-4 space-y-4">
            {/* Billing Cycle Switch */}
            <div className="flex items-center justify-center p-1 bg-white/[0.04] rounded-xl border border-white/[0.08]">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Monthly (${selectedCheckoutPlan.monthlyPrice}/mo)
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors relative ${
                  billingCycle === 'yearly'
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Yearly (${selectedCheckoutPlan.yearlyPrice}/yr)
                <span className="ml-1 text-[9px] px-1 py-0.2 rounded bg-cyan-400 text-slate-950 font-bold uppercase">
                  Save 20%
                </span>
              </button>
            </div>

            {/* Plan Highlights */}
            <div className="p-3.5 rounded-xl bg-violet-950/30 border border-violet-500/20 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-violet-300 block">
                Included Features
              </span>
              {selectedCheckoutPlan.features.slice(0, 4).map((feat, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-200">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Test Payment Form */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  required
                  defaultValue={user?.name || 'Basavaraj'}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Card Information (Test Mode Enabled)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    defaultValue="4242 •••• •••• 4242"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.1] text-xs font-mono text-white focus:outline-none focus:border-violet-500"
                  />
                  <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Expires
                  </label>
                  <input
                    type="text"
                    required
                    defaultValue="12/28"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.1] text-xs font-mono text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    CVC
                  </label>
                  <input
                    type="text"
                    required
                    defaultValue="999"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.1] text-xs font-mono text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3 px-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>256-bit encrypted checkout</span>
                </span>
                <span className="font-bold text-white font-mono-tabular">
                  Total: ${price}
                </span>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 hover:opacity-90 disabled:opacity-50 text-xs font-bold text-white uppercase tracking-wider shadow-lg shadow-violet-900/40 transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Authorizing Payment...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Pay ${price} & Activate</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
