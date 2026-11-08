'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { 
  Database, Check, Copy, ExternalLink, X, 
  Sparkles, ShieldCheck, AlertCircle, RefreshCw
} from 'lucide-react';
import { getDatabaseStatus } from '@/lib/supabase';

export default function DatabaseSettingsModal() {
  const { isDbModalOpen, setIsDbModalOpen } = useApp();
  const [copied, setCopied] = useState(false);

  if (!isDbModalOpen) return null;

  const dbStatus = getDatabaseStatus();

  const handleCopySql = () => {
    fetch('/api/schema-sql')
      .then(res => res.text())
      .catch(() => '')
      .finally(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Database & Realtime Live Sync
              </h3>
              <p className="text-xs text-slate-500">
                Recommended Live Cloud Engine: <strong>Supabase (PostgreSQL + Realtime)</strong>
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDbModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current status pill */}
        <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Engine:</span>
            <span className={`text-[11px] font-black px-2.5 py-1 rounded-full uppercase ${
              dbStatus.isConfigured 
                ? 'bg-emerald-100 text-emerald-800' 
                : 'bg-indigo-100 text-indigo-800'
            }`}>
              {dbStatus.provider}
            </span>
          </div>
          <p className="text-xs text-slate-600 font-medium">
            {dbStatus.statusText}
          </p>
        </div>

        {/* How to Connect on Vercel */}
        <div className="mt-5 space-y-4 text-xs">
          <h4 className="font-extrabold text-slate-900 text-sm">
            🚀 Vercel Live Sync Setup Guide (1-Minute Setup):
          </h4>

          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-bold text-indigo-600 block mb-0.5">Step 1: Create Free Supabase Project</span>
              <p className="text-slate-600">
                Visit <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-indigo-600 font-bold underline inline-flex items-center gap-1">supabase.com <ExternalLink className="w-3 h-3 inline" /></a> and create a free project in 30 seconds.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-bold text-indigo-600 block mb-0.5">Step 2: Run the SQL Schema</span>
              <p className="text-slate-600">
                Open Supabase SQL Editor and execute the script inside <code>supabase_schema.sql</code> (provided in the repository). It sets up all tables with Realtime replication enabled.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-bold text-indigo-600 block mb-0.5">Step 3: Add to Vercel Environment Variables</span>
              <p className="text-slate-600">
                In your Vercel Project Settings &rarr; <strong>Environment Variables</strong>, add:
              </p>
              <div className="mt-1.5 font-mono text-[11px] bg-slate-900 text-slate-200 p-2.5 rounded-lg space-y-1">
                <div>NEXT_PUBLIC_SUPABASE_URL=https://your-id.supabase.co</div>
                <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Works 100% offline & demo mode without keys too!
          </span>
          <button
            onClick={() => setIsDbModalOpen(false)}
            className="btn-2d-primary px-6 py-2 text-xs"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}

