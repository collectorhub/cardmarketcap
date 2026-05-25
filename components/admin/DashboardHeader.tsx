"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  isRefreshing: boolean;
  onRefresh: () => void;
}

export default function DashboardHeader({ isRefreshing, onRefresh }: DashboardHeaderProps) {
  return (
    <header className="w-full pt-18 md:pt-0 px-4 md:px-0 border-slate-100 dark:border-slate-800 font-inter">
      <div className="flex items-start justify-between gap-4">
        
        {/* Left Side: Consolidated Operational Title (Strict Left-Align Everywhere) */}
        <div className="space-y-1.5 text-left flex-1 min-w-0">
          <div className="flex items-center justify-start gap-2">
            <span className="h-2 w-2 rounded-full bg-[#00BA88] animate-pulse shrink-0" />
            <p className="text-[10px] font-bold uppercase tracking-[0.05em] text-slate-400 dark:text-slate-500 font-inter">
              System Monitoring Engine
            </p>
          </div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-sora"
          >
            Operational <span className="text-[#00BA88]">Control Center</span>
          </motion.h1>
          
          <p className="hidden md:block text-slate-500 dark:text-slate-400 text-[10px] md:text-[13px] font-medium max-w-xl font-inter leading-relaxed">
            Live infrastructure ingestion states and database schema compliance logs.
          </p>

          {/* Inline Timestamp for Mobile Only */}
          <div className="hidden pt-1">
            <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 font-inter">
              Synced: <span className="font-bold text-slate-600 dark:text-slate-400">May 19, 2026 - 17:48:03</span>
            </p>
          </div>
        </div>

        {/* Right Side: Micro-aligned Controls */}
        <div className="flex items-center gap-5 shrink-0 self-start md:self-center">
          
          {/* Last Global Refresh Timestamp - Hidden on mobile viewports */}
          <div className="text-right hidden md:block font-inter">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap leading-tight">
              Last Global Refresh
            </p>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5 whitespace-nowrap">
              May 19, 2026 - 17:48:03
            </p>
          </div>
          
          {/* Revalidation Control (Full Text Button on Desktop, Icon-Only Container on Mobile) */}
          <button 
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Trigger Safe Revalidation"
            className="flex items-center justify-center gap-2 cursor-pointer p-3 md:px-5 md:py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none shadow-xs font-inter"
          >
            <RefreshCw size={15} className={cn("text-slate-500 stroke-[2.5]", isRefreshing && "animate-spin")} />
            <span className="text-[13px] font-bold tracking-tight whitespace-nowrap hidden md:inline">
              {isRefreshing ? "Revalidating Engine..." : "Trigger Safe Revalidation"}
            </span>
          </button>
          
        </div>
      </div>
    </header>
  );
}