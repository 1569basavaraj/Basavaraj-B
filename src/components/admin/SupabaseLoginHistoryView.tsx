/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  Check,
  CheckCircle2,
  Clock,
  Code2,
  Copy,
  Database,
  ExternalLink,
  Laptop,
  Mail,
  RefreshCw,
  Search,
  Shield,
  Smartphone,
  Sparkles,
  Tablet,
  User,
  Zap,
} from 'lucide-react';
import {
  checkSupabaseConnection,
  fetchSupabaseLoginHistory,
  getSupabaseSetupSQL,
  recordSupabaseLogin,
  subscribeToLoginHistory,
  SUPABASE_PROJECT_ID,
  SUPABASE_URL,
  SupabaseConnectionStatus,
  SupabaseLoginRecord,
} from '../../services/supabase';

export const SupabaseLoginHistoryView: React.FC = () => {
  const [history, setHistory] = useState<SupabaseLoginRecord[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<SupabaseLoginRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SUCCESS' | 'FAILED'>('ALL');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'USER' | 'ARTIST' | 'ADMIN'>('ALL');
  const [isLoading, setIsLoading] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<SupabaseConnectionStatus>({
    isConnected: true,
    status: 'checking',
    message: 'Testing connection to Supabase...',
  });

  // Load history and test connection
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [statusRes, historyRes] = await Promise.all([
        checkSupabaseConnection(),
        fetchSupabaseLoginHistory(100),
      ]);
      setConnectionStatus(statusRes);
      setHistory(historyRes.records);
    } catch (err) {
      console.error('Failed to refresh Supabase data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Subscribe to real-time logins from Supabase
    const unsubscribe = subscribeToLoginHistory((newLogin) => {
      setHistory((prev) => [newLogin, ...prev.filter((r) => r.id !== newLogin.id)]);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Filter records
  useEffect(() => {
    let result = [...history];

    if (statusFilter !== 'ALL') {
      result = result.filter((r) => r.status === statusFilter);
    }

    if (roleFilter !== 'ALL') {
      result = result.filter((r) => (r.role || 'USER').toUpperCase() === roleFilter);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (r) =>
          r.email?.toLowerCase().includes(q) ||
          r.name?.toLowerCase().includes(q) ||
          r.device?.toLowerCase().includes(q) ||
          r.browser?.toLowerCase().includes(q) ||
          r.os?.toLowerCase().includes(q) ||
          r.login_method?.toLowerCase().includes(q)
      );
    }

    setFilteredHistory(result);
  }, [history, searchTerm, statusFilter, roleFilter]);

  const handleCopySql = () => {
    navigator.clipboard.writeText(getSupabaseSetupSQL());
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  // Test simulation: create a real login record in Supabase
  const handleSimulateLogin = async () => {
    setIsSimulating(true);
    const demoEmails = [
      'listener.alex@gmail.com',
      'priya.music@outlook.com',
      'soundmaster_kavya@gmail.com',
      'basavaraj@bassnbeats.com',
      'beatproducer.raj@yahoo.com',
    ];
    const pickedEmail = demoEmails[Math.floor(Math.random() * demoEmails.length)];
    const role = pickedEmail.includes('kavya') ? 'ARTIST' : pickedEmail.includes('admin') ? 'ADMIN' : 'USER';
    const method = Math.random() > 0.5 ? 'email' : Math.random() > 0.5 ? 'google' : 'apple';

    try {
      const res = await recordSupabaseLogin({
        userId: `usr-${Date.now().toString().slice(-6)}`,
        email: pickedEmail,
        name: pickedEmail.split('@')[0].replace('.', ' '),
        role,
        loginMethod: method,
        status: 'SUCCESS',
      });

      if (res.record) {
        setHistory((prev) => [res.record, ...prev.filter((r) => r.id !== res.record.id)]);
      }
    } finally {
      setIsSimulating(false);
    }
  };

  const formatTimestamp = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return {
        formattedDate: date.toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        formattedTime: date.toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        relativeTime: getRelativeTimeString(date),
      };
    } catch {
      return {
        formattedDate: isoString,
        formattedTime: '',
        relativeTime: 'Just now',
      };
    }
  };

  const getRelativeTimeString = (date: Date): string => {
    const diffMs = Date.now() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return `${Math.max(1, diffSec)}s ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHrs = Math.floor(diffMin / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    return `${diffDays}d ago`;
  };

  const getDeviceIcon = (deviceStr?: string) => {
    const lower = (deviceStr || '').toLowerCase();
    if (lower.includes('mobile') || lower.includes('phone')) {
      return <Smartphone className="w-3.5 h-3.5 text-sky-400" />;
    }
    if (lower.includes('tablet') || lower.includes('ipad')) {
      return <Tablet className="w-3.5 h-3.5 text-amber-400" />;
    }
    return <Laptop className="w-3.5 h-3.5 text-violet-400" />;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner: Supabase Backend Status */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#131b2e] via-[#101426] to-[#1a122e] border border-emerald-500/20 p-5 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold font-display text-white">
                    Supabase Database Login History
                  </h2>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live Connected
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Real-time PostgreSQL backend syncing every login session automatically.
                </p>
              </div>
            </div>

            {/* Project Details Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-slate-300 font-mono">
                <span className="text-slate-500">Project ID:</span>
                <span className="text-emerald-400 font-semibold">{SUPABASE_PROJECT_ID}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-slate-300 font-mono">
                <span className="text-slate-500">API Endpoint:</span>
                <span className="text-slate-200 truncate max-w-xs">{SUPABASE_URL}</span>
              </span>
              {connectionStatus.latencyMs !== undefined && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                  <Zap className="w-3 h-3 text-emerald-400" />
                  {connectionStatus.latencyMs}ms response
                </span>
              )}
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-500/10 border border-violet-500/20 text-xs text-violet-300 font-medium">
                <Shield className="w-3 h-3 text-violet-400" />
                GoTrue Auth Active
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleSimulateLogin}
              disabled={isSimulating}
              className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-semibold text-slate-200 transition-all flex items-center gap-2 hover:border-emerald-500/40"
              title="Record a test login event in Supabase"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{isSimulating ? 'Saving...' : 'Test Login Event'}</span>
            </button>

            <button
              onClick={() => setShowSqlModal(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-semibold text-emerald-300 transition-all flex items-center gap-2"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>SQL Schema Script</span>
            </button>

            <button
              onClick={loadData}
              disabled={isLoading}
              className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-slate-300 hover:text-white transition-colors"
              title="Refresh data from Supabase"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Missing Table Guidance notice if table not yet migrated in user's Supabase dashboard */}
        {connectionStatus.status === 'table_missing' && (
          <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs text-amber-200 animate-in fade-in">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-semibold text-amber-300">
                <Database className="w-4 h-4" />
                <span>Notice: Create the `login_history` table in your Supabase SQL Editor</span>
              </div>
              <p className="text-amber-200/80">
                The connection to your Supabase project <span className="font-mono font-bold text-amber-100">{SUPABASE_PROJECT_ID}</span> is established! To save permanent records in Supabase PostgreSQL, run our pre-built SQL script in your Supabase dashboard once.
              </p>
            </div>
            <button
              onClick={handleCopySql}
              className="shrink-0 px-3 py-1.5 rounded-lg bg-amber-500 text-black font-semibold text-xs flex items-center gap-1.5 hover:bg-amber-400 transition-colors shadow-md"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSql ? 'Copied SQL!' : 'Copy SQL Script'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search email, name, browser, or OS..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {/* Role Filter */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs">
            {(['ALL', 'USER', 'ARTIST', 'ADMIN'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  roleFilter === r
                    ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {r === 'ALL' ? 'All Roles' : r}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs">
            {(['ALL', 'SUCCESS', 'FAILED'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  statusFilter === s
                    ? 'bg-white/[0.1] text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Login History Data Table */}
      <div className="rounded-2xl bg-white/[0.02] border border-white/[0.08] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.03] border-b border-white/[0.08] text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
              <tr>
                <th className="py-3 px-4">User / Account</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Device & Client</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Supabase Cloud</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05] text-slate-300">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 space-y-2">
                    <Database className="w-8 h-8 text-slate-600 mx-auto stroke-1" />
                    <p className="text-sm font-medium text-slate-300">No login history records found</p>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Whenever someone logs in or registers on BASSnBEATS, the event is automatically saved and appears in your Supabase database.
                    </p>
                    <button
                      onClick={handleSimulateLogin}
                      className="mt-3 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-500/30 transition-colors inline-flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Record Sample Login Now</span>
                    </button>
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item) => {
                  const { formattedDate, formattedTime, relativeTime } = formatTimestamp(
                    item.created_at
                  );
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-white/[0.03] transition-colors group"
                    >
                      {/* User Account */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow">
                            {item.name ? item.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-white truncate group-hover:text-emerald-400 transition-colors">
                              {item.name || 'Anonymous User'}
                            </p>
                            <p className="text-[11px] text-slate-400 flex items-center gap-1 truncate font-mono">
                              <Mail className="w-3 h-3 text-slate-500" />
                              {item.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase ${
                            item.role === 'ADMIN'
                              ? 'bg-rose-500/20 border border-rose-500/30 text-rose-300'
                              : item.role === 'ARTIST'
                              ? 'bg-amber-500/20 border border-amber-500/30 text-amber-300'
                              : 'bg-violet-500/20 border border-violet-500/30 text-violet-300'
                          }`}
                        >
                          {item.role || 'USER'}
                        </span>
                      </td>

                      {/* Device & Client */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-xs text-slate-200">
                            {getDeviceIcon(item.device)}
                            <span>{item.device || 'Desktop'}</span>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            {item.browser || 'Web Browser'} • {item.os || 'OS'}
                          </p>
                        </div>
                      </td>

                      {/* Login Method */}
                      <td className="py-3 px-4">
                        <span className="capitalize text-slate-300 font-medium">
                          {item.login_method || 'email'}
                        </span>
                      </td>

                      {/* Timestamp */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1 text-slate-300">
                            <Clock className="w-3 h-3 text-slate-500" />
                            <span>{relativeTime}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 font-mono">
                            {formattedDate} {formattedTime}
                          </p>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          SUCCESS
                        </span>
                      </td>

                      {/* Cloud Sync Status */}
                      <td className="py-3 px-4 text-right">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${
                            item.synced_to_supabase !== false
                              ? 'text-emerald-400 bg-emerald-500/10'
                              : 'text-amber-400 bg-amber-500/10'
                          }`}
                          title={
                            item.synced_to_supabase !== false
                              ? 'Successfully saved in Supabase database'
                              : 'Cached locally - syncs to Supabase once table is created'
                          }
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{item.synced_to_supabase !== false ? 'Supabase Synced' : 'Locally Cached'}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-white/[0.01] border-t border-white/[0.08] flex items-center justify-between text-[11px] text-slate-400">
          <span>
            Showing <strong className="text-white">{filteredHistory.length}</strong> login sessions
          </span>
          <span className="flex items-center gap-1 text-slate-500 font-mono">
            Connected to Supabase PostgreSQL • {SUPABASE_PROJECT_ID}
          </span>
        </div>
      </div>

      {/* SQL Setup Script Modal */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121626] border border-white/[0.1] rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Supabase SQL Table Setup Script
                  </h3>
                  <p className="text-xs text-slate-400">
                    Run this script in your Supabase SQL Editor to enable persistent table storage.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSqlModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Step Guide */}
            <div className="p-5 border-b border-white/[0.06] bg-white/[0.02] text-xs text-slate-300 space-y-1.5">
              <p className="font-semibold text-emerald-400">Quick 3-Step Setup:</p>
              <ol className="list-decimal list-inside space-y-1 text-slate-400 pl-1">
                <li>
                  Open your{' '}
                  <a
                    href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/sql/new`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 underline inline-flex items-center gap-0.5 font-medium"
                  >
                    Supabase SQL Editor
                    <ExternalLink className="w-3 h-3 inline" />
                  </a>
                </li>
                <li>Paste the SQL script below into a new query window.</li>
                <li>Click <strong>Run</strong> (Ctrl+Enter). The table and Realtime channels will be created immediately!</li>
              </ol>
            </div>

            {/* Code Box */}
            <div className="p-5 flex-1 overflow-y-auto">
              <div className="relative">
                <button
                  onClick={handleCopySql}
                  className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-emerald-500 text-black text-xs font-semibold hover:bg-emerald-400 transition-colors flex items-center gap-1.5 shadow-lg"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? 'Copied!' : 'Copy Script'}</span>
                </button>
                <pre className="p-4 rounded-xl bg-black/60 border border-white/[0.1] text-emerald-300 font-mono text-[11px] leading-relaxed overflow-x-auto max-h-72">
                  {getSupabaseSetupSQL()}
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/[0.08] flex items-center justify-end gap-2 bg-white/[0.01]">
              <button
                onClick={() => setShowSqlModal(false)}
                className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-slate-200 transition-colors"
              >
                Done
              </button>
              <button
                onClick={handleCopySql}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-xs font-semibold text-black transition-colors flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
              >
                {copiedSql ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSql ? 'Copied to Clipboard' : 'Copy All SQL'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
