"use client";

import React from 'react';
import { Play, CheckCircle2, XCircle, Loader2, ArrowUpRight, Percent, ShieldAlert, Image } from 'lucide-react';
import { PipelineJob } from '@/types/pipeline';
import { cn } from "@/lib/utils";

interface PipelineJobRowProps {
  job: PipelineJob;
  onForceKill: (id: string) => void;
}

export default function PipelineJobRow({ job, onForceKill }: PipelineJobRowProps) {
  
  const designConfig = {
    ebay_scraper: { label: "eBay Linker Scraper", icon: ArrowUpRight, baseColor: "text-blue-500" },
    price_charting_sync: { label: "PriceCharting Ingest", icon: Percent, baseColor: "text-purple-500" },
    psa_ingestion: { label: "PSA Pop Registry Worker", icon: ShieldAlert, baseColor: "text-amber-500" },
    image_cdn_optimize: { label: "Image CDN Resizer", icon: Image, baseColor: "text-emerald-500" },
  };

  const statusStyles = {
    running: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    completed: "bg-[#00BA88]/10 text-[#00BA88] border-[#00BA88]/20",
    failed: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    queued: "bg-slate-500/10 text-slate-400 border-slate-500/20"
  };

  const { label, icon: SourceIcon, baseColor } = designConfig[job.target_source];

  return (
    <div className="p-4 md:p-5 bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/80 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 font-inter">
      
      {/* CORE WORKER TELEMETRY INFO */}
      <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-4 min-w-0">
        
        {/* SOURCE BRAND ICON OVERLAY */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-100 dark:border-slate-800/60 text-slate-400 shrink-0">
          <SourceIcon size={20} className={baseColor} />
        </div>

        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
              {label}
            </h3>
            <span className={cn(
              "text-[8px] px-2 py-0.5 rounded-md font-black tracking-widest uppercase border flex items-center gap-1",
              statusStyles[job.status]
            )}>
              {job.status === 'running' && <Loader2 size={10} className="animate-spin" />}
              <span>{job.status}</span>
            </span>
          </div>

          {/* PROGRESS METERS SECTION */}
          <div className="w-full space-y-1">
            <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-500 font-mono">
              <span>Rows processed: <strong className="text-slate-700 dark:text-slate-300 font-bold">{job.records_processed.toLocaleString()}</strong></span>
              <span>{job.progress_percent}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-200/20 dark:border-slate-800/10">
              <div 
                className={cn(
                  "h-full transition-all duration-500 rounded-full",
                  job.status === 'failed' ? 'bg-rose-500' : job.status === 'completed' ? 'bg-[#00BA88]' : 'bg-blue-500'
                )}
                style={{ width: `${job.progress_percent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* MATRIX METRICS SPECS PANEL */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex items-center gap-4 lg:gap-8 bg-slate-50/50 dark:bg-slate-950/30 px-4 py-3 rounded-xl border border-slate-100 dark:border-slate-800/40 text-[11px] font-mono shrink-0">
        <div>
          <span className="block text-slate-400 dark:text-slate-500 text-[9px] font-sans font-medium uppercase tracking-wider">Speed Ingestion</span>
          <span className="text-slate-800 dark:text-slate-200 font-black">{job.speed_rate}</span>
        </div>
        <div>
          <span className="block text-slate-400 dark:text-slate-500 text-[9px] font-sans font-medium uppercase tracking-wider">Elapsed Time</span>
          <span className="text-slate-800 dark:text-slate-200 font-bold">{job.duration}</span>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <span className="block text-slate-400 dark:text-slate-500 text-[9px] font-sans font-medium uppercase tracking-wider">Initialization Stamp</span>
          <span className="text-slate-400 dark:text-slate-500 font-medium text-[10px]">{job.started_at}</span>
        </div>
      </div>

      {/* ERROR CONTEXT MESSAGE FALLBACK OR ACTION TRIGGER */}
      <div className="w-full lg:w-32 shrink-0 flex justify-end">
        {job.status === 'running' ? (
          <button
            onClick={() => onForceKill(job.id)}
            className="w-full px-3 py-2 text-xs font-bold text-rose-500 hover:text-white border border-rose-500/20 hover:bg-rose-500 rounded-xl transition-all cursor-pointer text-center"
          >
            Kill Process
          </button>
        ) : job.status === 'failed' ? (
          <div className="text-[10px] text-rose-500 font-medium flex items-start gap-1 bg-rose-500/5 p-2 rounded-lg border border-rose-500/10 w-full truncate">
            <XCircle size={12} className="shrink-0 mt-0.5" />
            <span className="truncate">{job.error_message || "Network Timeout Exception"}</span>
          </div>
        ) : (
          <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-950/40 border border-slate-200/30 dark:border-slate-800/30 rounded-lg w-full justify-center">
            <CheckCircle2 size={12} className="text-[#00BA88]" />
            <span>Task Logged</span>
          </div>
        )}
      </div>

    </div>
  );
}