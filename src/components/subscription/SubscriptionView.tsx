import React, { useState } from 'react';
import { useStore } from '../../services/store';
import { Check, HelpCircle, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { SEED_PLANS } from '../../data/seedData';

export const SubscriptionView: React.FC = () => {
  const {
    user,
    setSelectedCheckoutPlan,
    setIsCheckoutModalOpen,
  } = useStore();

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-12 pb-24">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-600/20 text-violet-300 text-xs font-semibold border border-violet-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>BASSnBEATS Premium</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight">
          Sound Without Limits.
        </h1>
        <p className="text-sm text-slate-400">
          Choose the tier that unlocks your audiophile potential with 24-bit lossless playback and offline listening.
        </p>

        {/* Billing Switch */}
        <div className="pt-2 flex items-center justify-center gap-2">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              billingCycle === 'monthly'
                ? 'bg-violet-600 text-white shadow-md'
                : 'bg-white/[0.04] text-slate-400 hover:text-white'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              billingCycle === 'yearly'
                ? 'bg-violet-600 text-white shadow-md'
                : 'bg-white/[0.04] text-slate-400 hover:text-white'
            }`}
          >
            <span>Annual Plan</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-400 text-slate-950 font-bold uppercase">
              2 Months Free
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {SEED_PLANS.map((plan) => {
          const isCurrentPlan = user?.plan === plan.id;
          const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;

          return (
            <div
              key={plan.id}
              className={`p-6 sm:p-8 rounded-3xl border flex flex-col justify-between transition-all ${
                plan.popular
                  ? 'bg-violet-950/40 border-violet-500 shadow-2xl shadow-violet-950/60 relative scale-105'
                  : 'bg-white/[0.02] border-white/[0.08]'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-md">
                  Most Popular
                </div>
              )}

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {plan.badge}
                </span>
                <h3 className="text-2xl font-bold font-display text-white mt-1">
                  {plan.name}
                </h3>

                <div className="my-5 flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-extrabold font-display text-white font-mono-tabular">
                    ${price}
                  </span>
                  <span className="text-xs text-slate-400">
                    /{billingCycle === 'monthly' ? 'month' : 'year'}
                  </span>
                </div>

                <div className="space-y-3 py-6 border-t border-white/[0.08]">
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-3 text-xs text-slate-200">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => {
                    if (isCurrentPlan) return;
                    setSelectedCheckoutPlan(plan);
                    setIsCheckoutModalOpen(true);
                  }}
                  disabled={isCurrentPlan}
                  className={`w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    isCurrentPlan
                      ? 'bg-white/[0.08] text-slate-400 cursor-default'
                      : plan.popular
                      ? 'bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 hover:opacity-95 text-white shadow-xl shadow-violet-900/40'
                      : 'bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/[0.1]'
                  }`}
                >
                  {isCurrentPlan ? 'Current Active Plan' : `Upgrade to ${plan.name}`}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature Comparison Table */}
      <div className="max-w-4xl mx-auto p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
        <h3 className="text-base font-bold font-display text-white">
          Plan Comparison Breakdown
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-white/[0.06] text-slate-400">
                <th className="py-2.5">Feature</th>
                <th className="py-2.5 text-center">Free</th>
                <th className="py-2.5 text-center text-violet-400 font-bold">Premium</th>
                <th className="py-2.5 text-center text-cyan-400 font-bold">Premium Plus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-slate-300">
              <tr>
                <td className="py-2.5">Audio Quality</td>
                <td className="py-2.5 text-center text-slate-500">160 kbps</td>
                <td className="py-2.5 text-center text-slate-200">320 kbps High-Fi</td>
                <td className="py-2.5 text-center text-cyan-300 font-bold">24-bit 96kHz Lossless</td>
              </tr>
              <tr>
                <td className="py-2.5">Offline Downloads</td>
                <td className="py-2.5 text-center text-slate-500">None</td>
                <td className="py-2.5 text-center">Unlimited</td>
                <td className="py-2.5 text-center">Unlimited Hi-Res</td>
              </tr>
              <tr>
                <td className="py-2.5">Ad-Free Playback</td>
                <td className="py-2.5 text-center text-slate-500">Ad-Supported</td>
                <td className="py-2.5 text-center text-emerald-400 font-bold">100% Ad-Free</td>
                <td className="py-2.5 text-center text-emerald-400 font-bold">100% Ad-Free</td>
              </tr>
              <tr>
                <td className="py-2.5">Live Jam Rooms</td>
                <td className="py-2.5 text-center text-slate-500">Listener Only</td>
                <td className="py-2.5 text-center">Host & Join</td>
                <td className="py-2.5 text-center">Priority Host Pass</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
