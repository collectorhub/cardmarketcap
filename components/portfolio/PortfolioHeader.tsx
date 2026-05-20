"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, ShieldAlert, Activity } from 'lucide-react';
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  isRefreshing: boolean;
  onRefresh: () => void;
  metrics?: {
    totalAnomalies?: number;
    activePipelines?: number;
  };
}

export default function DashboardHeader({ 
  isRefreshing, 
  onRefresh,
  metrics = { totalAnomalies: 17231, activePipelines: 3 }
}: DashboardHeaderProps) {
  
  return (
    <header className="w-full pt-4 pb-0 px-4 md:px-0">
      {/* 1. TOP SECTION (Title + Admin Metadata Row) */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-6">
        
        {/* Left Content Area */}
        <div className="space-y-1 py-1 text-center lg:text-left w-full lg:w-auto">
          <div className="flex items-center justify-center lg:justify-start gap-2">
            <span className="h-2 w-2 rounded-full bg-[#00BA88] animate-pulse" />
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">
              System Monitoring Engine
            </p>
          </div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight"
          >
            Operational <span className="text-[#00BA88]">Control Center</span>
          </motion.h1>
          
          <p className="text-slate-500 dark:text-slate-400 text-[13px] font-medium max-w-md mx-auto lg:mx-0">
            Live infrastructure ingestion states and database schema compliance logs.
          </p>
        </div>

        {/* Right Content Area: System Health Ledger */}
        <div className="w-full sm:w-auto bg-white dark:bg-slate-900 px-5 py-4 rounded-[20px] border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-row items-center justify-between sm:justify-start gap-4 sm:gap-10">
          
          {/* Active Anomalies Count */}
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center gap-1">
              <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-[0.05em]">
                Active Failures
              </p>
              <ShieldAlert size={11} className="text-amber-500" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[18px] md:text-[22px] font-black text-slate-900 dark:text-white leading-none tracking-tight">
                {metrics.totalAnomalies?.toLocaleString()}
              </span>
              <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-50/50 dark:bg-amber-500/10 text-amber-500 border border-amber-100 dark:border-amber-500/20">
                <span className="text-[9px] font-extrabold uppercase tracking-wide">QA Risk</span>
              </div>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="h-8 w-[1px] bg-slate-100 dark:bg-slate-800" />

          {/* Sync & Pipelines Trackers */}
          <div className="flex gap-6 sm:gap-8">
            <div className="flex flex-col gap-1">
              <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-[0.05em]">
                Pipelines
              </p>
              <div className="flex items-baseline gap-1">
                <p className="text-[18px] md:text-[22px] font-black text-slate-900 dark:text-white leading-none">
                  {metrics.activePipelines}
                </p>
                <span className="text-[10px] font-bold text-emerald-500 font-mono">Live</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-1">
              <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-[0.05em]">
                Cluster State
              </p>
              <p className="text-[13px] font-black text-[#00BA88] uppercase tracking-wider flex items-center gap-1 mt-0.5">
                <Activity size={12} className="animate-pulse" /> Healthy
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* 2. SUB-ACTION HEADER ROW */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        
        {/* Left Side: Empty or context selector tab space if you add alternative views later */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500">
          <span>Targeting Context:</span>
          <span className="font-mono bg-slate-100 dark:bg-slate-800/60 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300 text-[11px]">
            Production Cluster (Primary)
          </span>
        </div>

        {/* Action Controls Side */}
        <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
          
          {/* Operational Micro-Copy Timestamp */}
          <div className="text-left">
            <p className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
              Last Global Refresh
            </p>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">
              May 19, 2026 - 17:48:03
            </p>
          </div>
          
          {/* Revalidation Action Button */}
          <button 
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-[#00BA88] text-white rounded-2xl text-[13px] font-black hover:bg-[#00a377] transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            <RefreshCw className={cn("h-4 w-4 stroke-[3px]", isRefreshing && "animate-spin")} />
            <span>{isRefreshing ? "Revalidating Engine..." : "Trigger Safe Revalidation"}</span>
          </button>

        </div>
      </div>
    </header>
  );
}