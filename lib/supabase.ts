import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-supabase-url') &&
  !supabaseAnonKey.includes('your-anon-key')
);

let client: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
  }
}

export const supabase = client;

export interface DatabaseStatus {
  isConfigured: boolean;
  provider: 'Supabase PostgreSQL (Live Realtime)' | 'Local Persistent Storage (Ready for Supabase)';
  url?: string;
  statusText: string;
}

export function getDatabaseStatus(): DatabaseStatus {
  if (isSupabaseConfigured) {
    return {
      isConfigured: true,
      provider: 'Supabase PostgreSQL (Live Realtime)',
      url: supabaseUrl,
      statusText: 'Connected to live cloud database with instant Realtime synchronization.',
    };
  }
  return {
    isConfigured: false,
    provider: 'Local Persistent Storage (Ready for Supabase)',
    statusText: 'Running in offline-first mode with full localStorage persistence. Connect Supabase anytime for multi-device live sync!',
  };
}

