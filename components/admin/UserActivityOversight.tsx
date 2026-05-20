"use client";

import React from 'react';
import { Users, ChevronRight, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import { CollectorActivity } from '@/app/(root)/admin/page'; // Adjust path based on your exact file locations

interface UserActivityOversightProps {
  activities: CollectorActivity[];
  totalWatchlists?: number;
}

export default function UserActivityOversight({ activities, totalWatchlists = 0 }: UserActivityOversightProps) {
  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col h-full">
      
      {/* 1. COMPONENT HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50 dark:border-slate-800/80 pb-5 mb-5">
        <div className="space-y-1">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 tracking-tight font-heading">
            <Users className="h-4 w-4 text-[#00BA88]" />
            <span>Collector Activity Stream</span>
          </h2>
          <p className="text-slate-400 dark:text-slate-500 text-[13px] font-medium font-sans">
            Realtime user interaction and catalog reports.
          </p>
        </div>
        
        <span className="self-start sm:self-center text-[10px] font-bold text-[#00BA88] bg-[#00BA88]/10 px-2.5 py-1 rounded-md tracking-wide uppercase font-sans">
          Live Feed
        </span>
      </div>

      {/* 2. ACTIVITY STREAM CARDS */}
      <div className="space-y-3.5 flex-1">
        {activities.map((log, index) => {
          const isFlagged = log.type === 'flagged';
          const isWatchlist = log.type === 'watchlist';

          return (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, type: "spring", stiffness: 260, damping: 22 }}
              className={cn(
                "p-4 rounded-2xl border flex flex-col gap-2.5 transition-all font-sans group hover:-translate-y-0.5",
                isFlagged
                  ? "border-red-100 dark:border-red-950/40 bg-red-500/[0.01] dark:bg-red-500/[0.02]"
                  : "border-slate-100/80 dark:border-slate-800/60 bg-white dark:bg-slate-950/20 hover:bg-slate-50/40 dark:hover:bg-slate-950/60 hover:border-slate-200 dark:hover:border-slate-700"
              )}
            >
              {/* Event Metadata Line */}
              <div className="flex justify-between items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "font-extrabold tracking-tight",
                    isFlagged ? "text-red-900 dark:text-red-400" : "text-slate-800 dark:text-slate-200"
                  )}>
                    {log.user}
                  </span>
                  
                  <span className={cn(
                    "text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-sm",
                    isFlagged && "bg-red-500/10 text-red-500",
                    isWatchlist && "bg-blue-500/10 text-blue-500",
                    log.type === 'portfolio' && "bg-emerald-500/10 text-emerald-500"
                  )}>
                    {log.type}
                  </span>
                </div>
                
                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 shrink-0 font-mono">
                  {log.time}
                </span>
              </div>

              {/* Action / Detail Line */}
              <div className="flex items-start justify-between gap-3">
                <p className={cn(
                  "text-[13px] font-bold leading-snug tracking-tight group-hover:text-[#00BA88] transition-colors",
                  isFlagged ? "text-slate-700 dark:text-slate-300" : "text-slate-600 dark:text-slate-400"
                )}>
                  {log.detail}
                </p>

                {log.meta && (
                  <span className={cn(
                    "text-[11px] font-bold font-mono px-2 py-0.5 rounded-md border shrink-0",
                    isFlagged 
                      ? "bg-red-50 dark:bg-red-950/30 text-red-500 border-red-100/60 dark:border-red-900/40" 
                      : "bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-100 dark:border-slate-800"
                  )}>
                    {log.meta}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 3. AGGREGATED STATS FOOTER MODULE */}
      <div className="pt-4 mt-2 border-t border-slate-50 dark:border-slate-800/60 space-y-3">
        <div className="p-3.5 rounded-2xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-100/60 dark:border-slate-800/60 flex items-center justify-between gap-4 text-xs font-sans">
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className="text-[#00BA88]" />
            <span className="font-bold text-slate-600 dark:text-slate-400">Total User Watchlists Live</span>
          </div>
          <span className="font-mono text-sm font-black text-slate-900 dark:text-white">
            {totalWatchlists.toLocaleString()}
          </span>
        </div>
      </div>

      {/* 4. PRIMARY DRILLDOWN ACTION TRIGGER */}
      {/* <button className="w-full mt-4 text-center cursor-pointer py-3 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-100 dark:border-slate-800/80 rounded-2xl text-[13px] font-bold tracking-tight transition-all flex items-center justify-center gap-1 group active:scale-[0.99] font-sans">
        <span>Manage User Portfolio Clusters</span>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
      </button> */}

    </div>
  );
}