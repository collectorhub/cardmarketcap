"use client";

import React from 'react';
import { ArrowRight, Check, Ban, ShieldCheck } from 'lucide-react';
import { ProposedMatchItem } from './page';
import { cn } from "@/lib/utils";

interface MatchingRowItemProps {
  item: ProposedMatchItem;
  onAction: (id: string, action: 'approve' | 'reject') => void;
}

export default function MatchingRowItem({ item, onAction }: MatchingRowItemProps) {
  
  const scoreBadges = {
    high: "bg-[#00BA88]/5 text-[#00BA88] border-[#00BA88]/10 dark:bg-[#00BA88]/10",
    medium: "bg-amber-500/5 text-amber-500 border-amber-500/10 dark:bg-amber-500/10",
    low: "bg-rose-500/5 text-rose-500 border-rose-500/10 dark:bg-rose-500/10",
  };

  return (
    <div className="p-4 md:p-5 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl flex flex-col xl:flex-row xl:items-center justify-between gap-5 shadow-xs font-inter relative group hover:border-slate-300 dark:hover:border-slate-700/80 hover:shadow-sm transition-all duration-200">
      
      {/* COMPARISON WORKSPACE MATRIX */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-9 gap-4 items-center">
        
        {/* SIDE A: RAW SCRAPED DATA */}
        <div className="md:col-span-4 space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 text-[9px] font-black tracking-widest uppercase bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded">
              {item.source_platform.replace('_', ' ')}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
              {item.scraped_raw_meta.scraped_at}
            </span>
          </div>
          <h4 className="text-xs md:text-sm font-bold text-slate-800 dark:text-slate-200 leading-snug break-words tracking-tight">
            {item.scraped_title}
          </h4>
          <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-950/40 px-2 py-1 rounded-md w-fit border border-slate-100 dark:border-slate-800/30">
            <span>Set: <span className="text-slate-600 dark:text-slate-300 font-medium">{item.scraped_raw_meta.set_guess || "none"}</span></span>
            <span className="text-slate-200 dark:text-slate-800">•</span>
            <span>Grade: <span className="text-slate-600 dark:text-slate-300 font-medium">{item.scraped_raw_meta.grade_guess || "RAW"}</span></span>
          </div>
        </div>

        {/* MIDDLE ALIGNMENT LINK INDICATOR */}
        <div className="md:col-span-1 flex md:flex-col items-center justify-center gap-1.5 py-2 md:py-0">
          <div className="h-px w-full bg-slate-100 dark:bg-slate-800 md:hidden" />
          <div className="flex flex-col items-center gap-1 shrink-0 px-2">
            <ArrowRight size={15} className="rotate-90 md:rotate-0 text-slate-300 dark:text-slate-700 group-hover:text-slate-400 dark:group-hover:text-slate-500 transition-colors duration-200" />
            <span className={cn(
              "text-[9px] px-1.5 py-0.5 rounded uppercase font-black tracking-wider border select-none",
              scoreBadges[item.confidence_score]
            )}>
              {item.confidence_score}
            </span>
          </div>
          <div className="h-px w-full bg-slate-100 dark:bg-slate-800 md:hidden" />
        </div>

        {/* SIDE B: PROPOSED TARGET MASTER ROW */}
        <div className="md:col-span-4 flex items-center gap-3 bg-slate-50/60 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/40 group-hover:bg-slate-50 dark:group-hover:bg-slate-950/60 transition-colors duration-200">
          {item.proposed_canonical.image_url ? (
            <img 
              src={item.proposed_canonical.image_url} 
              alt="" 
              className="w-10 h-14 object-cover rounded-md border border-slate-200 dark:border-slate-800 shrink-0 shadow-xs" 
            />
          ) : (
            <div className="w-10 h-14 bg-slate-200/60 dark:bg-slate-800/60 rounded-md border border-slate-200/80 dark:border-slate-800/80 shrink-0 flex items-center justify-center text-slate-400 dark:text-slate-500 text-[9px] font-black tracking-wider select-none">
              CARD
            </div>
          )}
          <div className="space-y-0.5 min-w-0 flex-1">
            <div className="flex items-center gap-1 text-[9px] text-[#00BA88] font-black uppercase tracking-widest">
              <ShieldCheck size={11} strokeWidth={2.5} />
              <span>Proposed Target</span>
            </div>
            <h5 className="text-xs md:text-sm font-bold text-slate-900 dark:text-white truncate tracking-tight">
              {item.proposed_canonical.name}
            </h5>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide truncate">
              {item.proposed_canonical.set_name}
            </p>
            <p className="text-[9px] font-mono text-slate-400 dark:text-slate-600 truncate">
              ID: {item.proposed_canonical.id}
            </p>
          </div>
        </div>
      </div>

      {/* INTERACTION ACTION CONTROLS */}
      <div className="flex sm:flex-row xl:flex-col items-center justify-end gap-2 shrink-0 border-t xl:border-t-0 border-slate-100 dark:border-slate-800/60 pt-3 xl:pt-0 w-full xl:w-36">
        <button
          onClick={() => onAction(item.id, 'approve')}
          className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-4 py-2.5 xl:py-2.1 w-full rounded-xl text-xs font-bold text-white bg-[#00BA88] hover:bg-[#00a377] transition-all cursor-pointer shadow-sm shadow-[#00BA88]/10 hover:shadow-md hover:shadow-[#00BA88]/15"
        >
          <Check size={14} strokeWidth={2.5} />
          <span>Approve Link</span>
        </button>
        
        <button
          onClick={() => onAction(item.id, 'reject')}
          className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-4 py-2.5 xl:py-2.1 w-full rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-500 hover:border-rose-500/30 hover:bg-rose-500/5 dark:hover:bg-rose-500/10 transition-all cursor-pointer"
          title="Reject / Flag Match"
        >
          <Ban size={14} strokeWidth={2} />
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400 group-hover:text-rose-500 transition-colors">Reject Link</span>
        </button>
      </div>
    </div>
  );
}