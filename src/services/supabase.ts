/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase project credentials provided by the user
export const SUPABASE_PROJECT_ID = 'dckjwkphlkstclfwdpna';
export const SUPABASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co`;
export const SUPABASE_ANON_KEY = 'sb_publishable_mlaq4vWlPJcj6NaEHceiNw_wkv0qxhf';

/**
 * Record structure for the Supabase `login_history` database table
 */
export interface SupabaseLoginRecord {
  id: string;
  user_id: string;
  email: string;
  name: string;
  role: string;
  ip_address?: string;
  user_agent?: string;
  device?: string;
  browser?: string;
  os?: string;
  login_method?: 'email' | 'google' | 'apple' | 'demo' | 'admin';
  status: 'SUCCESS' | 'FAILED' | 'CHALLENGE';
  created_at: string;
  synced_to_supabase?: boolean;
}

export interface SupabaseConnectionStatus {
  isConnected: boolean;
  status: 'connected' | 'checking' | 'table_missing' | 'error';
  message: string;
  latencyMs?: number;
  lastChecked?: string;
  totalRecordsCount?: number;
}

// Initialize Supabase Client
export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: 'public',
  },
});

// Local cache key for offline resilience & immediate UI response
const LOCAL_LOGIN_CACHE_KEY = 'bnb_supabase_login_history';

/**
 * Helper to extract client environment info (Browser, OS, Device)
 */
export function getClientDeviceInfo(): {
  device: string;
  browser: string;
  os: string;
  userAgent: string;
} {
  if (typeof window === 'undefined' || !navigator) {
    return {
      device: 'Desktop',
      browser: 'Web Browser',
      os: 'Unknown OS',
      userAgent: 'Unknown',
    };
  }

  const ua = navigator.userAgent;
  let browser = 'Unknown Browser';
  if (ua.includes('Firefox')) browser = 'Mozilla Firefox';
  else if (ua.includes('Edg/')) browser = 'Microsoft Edge';
  else if (ua.includes('Chrome')) browser = 'Google Chrome';
  else if (ua.includes('Safari')) browser = 'Apple Safari';
  else if (ua.includes('Opera') || ua.includes('OPR/')) browser = 'Opera';

  let os = 'Unknown OS';
  if (ua.includes('Win')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('like Mac')) os = 'iOS';

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const device = isMobile ? (ua.includes('iPad') ? 'Tablet' : 'Mobile Phone') : 'Desktop PC';

  return { device, browser, os, userAgent: ua };
}

/**
 * Records a user login into Supabase `login_history` table.
 * Automatically saves locally as well for immediate UI response and offline support.
 */
export async function recordSupabaseLogin(params: {
  userId: string;
  email: string;
  name?: string;
  role?: string;
  loginMethod?: 'email' | 'google' | 'apple' | 'demo' | 'admin';
  status?: 'SUCCESS' | 'FAILED' | 'CHALLENGE';
}): Promise<{ success: boolean; record: SupabaseLoginRecord; error?: string }> {
  const info = getClientDeviceInfo();
  const recordId = typeof crypto !== 'undefined' && crypto.randomUUID 
    ? crypto.randomUUID() 
    : `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const nowIso = new Date().toISOString();

  const newRecord: SupabaseLoginRecord = {
    id: recordId,
    user_id: params.userId,
    email: params.email,
    name: params.name || params.email.split('@')[0],
    role: params.role || 'USER',
    ip_address: 'Client IP (Logged via Supabase)',
    user_agent: info.userAgent,
    device: info.device,
    browser: info.browser,
    os: info.os,
    login_method: params.loginMethod || 'email',
    status: params.status || 'SUCCESS',
    created_at: nowIso,
    synced_to_supabase: false,
  };

  // 1. Immediately cache in local storage so the history appears instantly in UI
  try {
    const cached = getLocalLoginHistory();
    const updated = [newRecord, ...cached.filter((r) => r.id !== newRecord.id)].slice(0, 100);
    localStorage.setItem(LOCAL_LOGIN_CACHE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Could not write to local login history cache:', err);
  }

  // 2. Persist to Supabase Database
  try {
    const { data, error } = await supabase
      .from('login_history')
      .insert([
        {
          id: newRecord.id,
          user_id: newRecord.user_id,
          email: newRecord.email,
          name: newRecord.name,
          role: newRecord.role,
          ip_address: newRecord.ip_address,
          user_agent: newRecord.user_agent,
          device: newRecord.device,
          browser: newRecord.browser,
          os: newRecord.os,
          login_method: newRecord.login_method,
          status: newRecord.status,
          created_at: newRecord.created_at,
        },
      ])
      .select();

    if (error) {
      console.warn('Supabase insert warning:', error.message);
      return { success: false, record: newRecord, error: error.message };
    }

    newRecord.synced_to_supabase = true;
    // Update synced flag in local storage
    try {
      const cached = getLocalLoginHistory();
      const updated = cached.map((r) => (r.id === newRecord.id ? { ...r, synced_to_supabase: true } : r));
      localStorage.setItem(LOCAL_LOGIN_CACHE_KEY, JSON.stringify(updated));
    } catch {}

    return { success: true, record: data?.[0] ? { ...data[0], synced_to_supabase: true } : newRecord };
  } catch (err: any) {
    console.error('Failed to save login to Supabase:', err);
    return { success: false, record: newRecord, error: err?.message || 'Network error' };
  }
}

/**
 * Retrieves the local cache of login history
 */
export function getLocalLoginHistory(): SupabaseLoginRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_LOGIN_CACHE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Fetches login history from Supabase, merging with local records
 */
export async function fetchSupabaseLoginHistory(limit = 50): Promise<{
  records: SupabaseLoginRecord[];
  isFromSupabase: boolean;
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('login_history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      // If table doesn't exist yet (PGRST205) or permission error, return local cache
      const local = getLocalLoginHistory();
      return {
        records: local,
        isFromSupabase: false,
        error: error.message,
      };
    }

    if (data && Array.isArray(data)) {
      const formatted: SupabaseLoginRecord[] = data.map((d: any) => ({
        ...d,
        synced_to_supabase: true,
      }));

      // Merge with any unsynced local records
      const local = getLocalLoginHistory();
      const unsynced = local.filter((l) => !formatted.some((f) => f.id === l.id));
      const combined = [...unsynced, ...formatted].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      // Refresh cache
      try {
        localStorage.setItem(LOCAL_LOGIN_CACHE_KEY, JSON.stringify(combined.slice(0, 100)));
      } catch {}

      return { records: combined, isFromSupabase: true };
    }

    return { records: getLocalLoginHistory(), isFromSupabase: false };
  } catch (err: any) {
    return {
      records: getLocalLoginHistory(),
      isFromSupabase: false,
      error: err?.message || 'Failed to connect to Supabase',
    };
  }
}

/**
 * Tests connection to Supabase instance and checks if `login_history` table exists
 */
export async function checkSupabaseConnection(): Promise<SupabaseConnectionStatus> {
  const startTime = performance.now();
  try {
    const { data, error, count } = await supabase
      .from('login_history')
      .select('*', { count: 'exact', head: true });

    const latency = Math.round(performance.now() - startTime);

    if (error) {
      if (error.code === 'PGRST205') {
        return {
          isConnected: true,
          status: 'table_missing',
          message: 'Connected to Supabase! The "login_history" table is not yet created in the schema.',
          latencyMs: latency,
          lastChecked: new Date().toLocaleTimeString(),
          totalRecordsCount: getLocalLoginHistory().length,
        };
      }

      return {
        isConnected: false,
        status: 'error',
        message: `Supabase Error: ${error.message}`,
        latencyMs: latency,
        lastChecked: new Date().toLocaleTimeString(),
      };
    }

    return {
      isConnected: true,
      status: 'connected',
      message: 'Active and synced with Supabase PostgreSQL database',
      latencyMs: latency,
      lastChecked: new Date().toLocaleTimeString(),
      totalRecordsCount: count ?? undefined,
    };
  } catch (err: any) {
    const latency = Math.round(performance.now() - startTime);
    return {
      isConnected: false,
      status: 'error',
      message: err?.message || 'Could not reach Supabase endpoint',
      latencyMs: latency,
      lastChecked: new Date().toLocaleTimeString(),
    };
  }
}

/**
 * Subscribes to real-time changes on the Supabase `login_history` table
 */
export function subscribeToLoginHistory(
  onNewLogin: (record: SupabaseLoginRecord) => void
): () => void {
  try {
    const channel = supabase
      .channel('public:login_history')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'login_history' },
        (payload) => {
          if (payload.new) {
            onNewLogin({
              ...(payload.new as SupabaseLoginRecord),
              synced_to_supabase: true,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (err) {
    console.warn('Realtime subscription error:', err);
    return () => {};
  }
}

/**
 * Returns the exact copyable SQL schema script for user's Supabase SQL Editor
 */
export function getSupabaseSetupSQL(): string {
  return `-- ==============================================================
-- BASSnBEATS: Supabase Database Schema for Login History
-- Project ID: ${SUPABASE_PROJECT_ID}
-- Run this in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- ==============================================================

-- 1. Create table for storing authentication & login sessions
CREATE TABLE IF NOT EXISTS public.login_history (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    email TEXT NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'USER',
    ip_address TEXT,
    user_agent TEXT,
    device TEXT,
    browser TEXT,
    os TEXT,
    login_method TEXT DEFAULT 'email',
    status TEXT DEFAULT 'SUCCESS',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create index on user_id, email, and created_at for fast querying
CREATE INDEX IF NOT EXISTS idx_login_history_user_id ON public.login_history (user_id);
CREATE INDEX IF NOT EXISTS idx_login_history_email ON public.login_history (email);
CREATE INDEX IF NOT EXISTS idx_login_history_created_at ON public.login_history (created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.login_history ENABLE ROW LEVEL SECURITY;

-- 4. Create policies to allow the client app to write and read login entries
DROP POLICY IF EXISTS "Allow anonymous and authenticated insert" ON public.login_history;
CREATE POLICY "Allow anonymous and authenticated insert"
ON public.login_history
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anonymous and authenticated select" ON public.login_history;
CREATE POLICY "Allow anonymous and authenticated select"
ON public.login_history
FOR SELECT
TO anon, authenticated
USING (true);

-- 5. Enable Supabase Realtime for instant live updates in Admin & Profile
ALTER PUBLICATION supabase_realtime ADD TABLE public.login_history;
`;
}
