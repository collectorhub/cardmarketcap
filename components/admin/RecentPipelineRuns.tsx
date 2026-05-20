"use client";

import React from 'react';
import { CheckCircle2, XCircle, ChevronRight, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

interface PipelineRun {
  id: string;
  job: string;
  time: string;
  duration: string;
  status: string;
  error?: string;
}

interface RecentPipelineRunsProps {
  runs: PipelineRun[];
}

export default function RecentPipelineRuns({ runs }: RecentPipelineRunsProps) {
  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
      
      {/* Container Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50 dark:border-slate-800/80 pb-5 mb-5">
        <div className="space-y-1">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 tracking-tight font-heading">
            <Activity className="h-4 w-4 text-[#00BA88]" />
            <span>Recent Pipeline Runs</span>
          </h2>
          <p className="text-slate-400 dark:text-slate-500 text-[13px] font-medium font-sans">
            Automated ingestion log sequences.
          </p>
        </div>
        
        {/* Signature Live Logs Pill Badge */}
        <span className="self-start sm:self-center text-[10px] font-bold text-[#00BA88] bg-[#00BA88]/10 px-2.5 py-1 rounded-md tracking-wide uppercase font-sans">
          Live Logs
        </span>
      </div>

      {/* Runs Stream Array Stack */}
      <div className="space-y-3.5">
        {runs.map((run, index) => {
          const isSuccess = run.status === 'success';

          return (
            <motion.div 
              key={run.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, type: "spring", stiffness: 260, damping: 22 }}
              className={cn(
                "p-4 rounded-2xl border flex flex-col gap-3 transition-all font-sans group hover:-translate-y-0.5",
                isSuccess 
                  ? "border-slate-100/80 dark:border-slate-800/60 bg-white dark:bg-slate-950/20 hover:bg-slate-50/40 dark:hover:bg-slate-950/60 hover:border-slate-200 dark:hover:border-slate-700" 
                  : "border-red-100 dark:border-red-950/40 bg-red-500/[0.01] dark:bg-red-500/[0.02]"
              )}
            >
              {/* Primary Identity Row */}
              <div className="flex justify-between items-center gap-4">
                <span className={cn(
                  "font-extrabold text-[13px] tracking-tight group-hover:text-[#00BA88] transition-colors truncate max-w-[200px] xs:max-w-xs",
                  isSuccess ? "text-slate-800 dark:text-slate-200" : "text-red-900 dark:text-red-400"
                )}>
                  {run.job}
                </span>
                
                {/* Process Status Indicator */}
                <span className={cn(
                  "inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wide shrink-0",
                  isSuccess ? "text-emerald-500" : "text-red-500"
                )}>
                  {isSuccess ? (
                    <CheckCircle2 size={13} strokeWidth={2.5} className="text-emerald-500" />
                  ) : (
                    <XCircle size={13} strokeWidth={2.5} className="text-red-500 animate-pulse" />
                  )}
                  <span>{run.status}</span>
                </span>
              </div>

              {/* Technical Monospace Diagnostics Row */}
              <div className="flex items-center gap-x-4 flex-wrap text-[10px] font-bold text-slate-400 dark:text-slate-500 font-mono">
                <span className="bg-slate-50 dark:bg-slate-800/50 px-1.5 py-0.5 rounded border border-slate-100/60 dark:border-slate-800">
                  ID: {run.id}
                </span>
                <span>
                  Dur: <strong className="text-slate-700 dark:text-slate-400 font-bold">{run.duration}</strong>
                </span>
                <span className="ml-auto font-sans text-slate-400 font-medium">
                  {run.time}
                </span>
              </div>

              {/* Advanced Crash Stack Diagnostic Window */}
              {run.error && (
                <div className="p-3 bg-red-500/[0.03] dark:bg-red-950/20 rounded-xl border border-red-200/40 dark:border-red-900/30 text-[11px] text-red-500 dark:text-red-400 font-mono font-medium leading-relaxed tracking-tight break-all">
                  <span className="font-black underline uppercase tracking-widest text-[9px] block mb-1 text-red-600 dark:text-red-500 font-sans">
                    Crash Stack Trace:
                  </span>
                  {run.error}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* View All Actions Button */}
      <button className="w-full mt-4 text-center cursor-pointer py-3 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-100 dark:border-slate-800/80 rounded-2xl text-[13px] font-bold tracking-tight transition-all flex items-center justify-center gap-1 group active:scale-[0.99] font-sans">
        <span>View All Process Histories</span>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
      </button>
      
    </div>
  );
}