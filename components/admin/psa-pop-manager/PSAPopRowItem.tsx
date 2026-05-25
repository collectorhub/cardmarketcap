"use client";

import React from 'react';
import { ArrowRight, Check, Ban, AlertTriangle, ShieldCheck, Layers } from 'lucide-react';
import { PSAPopulationItem } from '@/types/psa';
import { cn } from "@/lib/utils";

interface PSAPopRowItemProps {
  item: PSAPopulationItem;
  onAction: (id: string, action: 'approve' | 'reject' | 'adjust_variant') => void;
}

export default function PSAPopRowItem({ item, onAction }: PSAPopRowItemProps) {
  
  const issueStyles = {
    none: "bg-emerald-500/5 text-emerald-500 border-emerald-500/10 dark:bg-emerald-500/10",
    reverse_holo_mixup: "bg-amber-500/5 text-amber-500 border-amber-500/10 dark:bg-amber-500/10",
    variant_mismatch: "bg-rose-500/5 text-rose-500 border-rose-500/10 dark:bg-rose-500/10",
    unlinked_pop: "bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800 dark:border-slate-700"
  };

  return (
    <div className="p-4 md:p-5 bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/80 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xs font-inter hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-150">
      
      {/* MAIN CONTENT REGION */}
      <div className="flex-1 flex flex-col md:flex-row items-stretch md:items-center gap-4">
        
        {/* LEFT COMPARTMENT: SCRAPED SOURCE RAW LOG DATA */}
        <div className="flex-1 min-w-0 space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-1.5 py-0.5 text-[8px] font-black tracking-widest uppercase bg-slate-900 text-white dark:bg-slate-800 dark:text-slate-300 rounded-sm">
              PSA POP
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono tracking-wide">
              Prefix Block: {item.cert_prefix}
            </span>
          </div>

          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug tracking-tight break-words pr-2">
            {item.scraped_psa_name}
          </h3>

          {/* COMPACT MATRIX GRADE BREAKDOWNS CHIPS */}
          <div className="inline-flex flex-wrap gap-1 bg-slate-50 dark:bg-slate-950/40 p-1.5 rounded-xl border border-slate-100 dark:border-slate-800/40 font-mono text-[9px] max-w-full">
            <div className="px-2 py-1 bg-white dark:bg-slate-900 rounded-md border border-slate-200/40 dark:border-slate-800/30">
              <span className="text-slate-400 font-medium mr-1">PSA 10</span>
              <span className="text-slate-900 dark:text-slate-200 font-black">{item.grade_breakdown.psa_10}</span>
            </div>
            <div className="px-2 py-1 bg-white dark:bg-slate-900 rounded-md border border-slate-200/40 dark:border-slate-800/30">
              <span className="text-slate-400 font-medium mr-1">PSA 9</span>
              <span className="text-slate-900 dark:text-slate-200 font-black">{item.grade_breakdown.psa_9}</span>
            </div>
            <div className="px-2 py-1 bg-white dark:bg-slate-900 rounded-md border border-slate-200/40 dark:border-slate-800/30">
              <span className="text-slate-400 font-medium mr-1">PSA 8</span>
              <span className="text-slate-900 dark:text-slate-200 font-black">{item.grade_breakdown.psa_8}</span>
            </div>
            <div className="px-2 py-1 bg-white dark:bg-slate-900 rounded-md border border-slate-200/40 dark:border-slate-800/30">
              <span className="text-slate-400 font-medium mr-1">≤7</span>
              <span className="text-slate-900 dark:text-slate-200 font-black">{item.grade_breakdown.psa_7_or_lower}</span>
            </div>
            <div className="px-2 py-1 bg-rose-500/5 rounded-md border border-rose-500/10">
              <span className="text-rose-400 font-medium mr-1">QUAL</span>
              <span className="text-rose-500 dark:text-rose-400 font-black">{item.grade_breakdown.qualifiers}</span>
            </div>
          </div>
        </div>

        {/* CENTER INTERSECTION INDICATOR */}
        <div className="flex md:flex-col items-center justify-center gap-1 shrink-0 px-2">
          <ArrowRight size={14} className="rotate-90 md:rotate-0 text-slate-300 dark:text-slate-700 hidden sm:block" />
          <span className={cn(
            "text-[8px] px-1.5 py-0.5 rounded-sm font-black tracking-wider uppercase border whitespace-nowrap",
            issueStyles[item.issue_type]
          )}>
            {item.issue_type === 'none' ? 'Match Stable' : item.issue_type.replace(/_/g, ' ')}
          </span>
        </div>

        {/* RIGHT COMPARTMENT: PROPOSED CANONICAL FRONTEND PROXY PROFILES */}
        <div className="flex-1 min-w-0 flex items-center gap-3 bg-slate-50/60 dark:bg-slate-950/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800/30">
          <div className="w-9 h-12 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-center text-slate-400 shrink-0">
            <Layers size={14} />
          </div>
          
          <div className="space-y-0.5 min-w-0 flex-1 font-inter">
            <div className="flex items-center gap-1 text-[8px] text-[#00BA88] font-black uppercase tracking-wider">
              <ShieldCheck size={10} strokeWidth={2.5} />
              <span>Proxy Registry Target</span>
            </div>
            
            {item.proposed_canonical ? (
              <>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate tracking-tight">
                  {item.proposed_canonical.name}
                </h4>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                  <span className="uppercase font-bold tracking-wide text-slate-500">{item.proposed_canonical.set_name}</span>
                  <span>•</span>
                  <span className="font-mono text-[9px]">ID: {item.proposed_canonical.id}</span>
                </div>
              </>
            ) : (
              <p className="text-xs font-semibold text-rose-500 italic pt-0.5">
                Registry target link disconnected.
              </p>
            )}
          </div>
        </div>

      </div>

      {/* ACTION BLOCK SYSTEM */}
      <div className="flex flex-row lg:flex-col items-center justify-end gap-1.5 shrink-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800/60 pt-3 lg:pt-0 w-full lg:w-36 font-inter">
        <button
          onClick={() => onAction(item.id, 'approve')}
          className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-3 py-2 w-full rounded-xl text-xs font-black bg-[#00BA88] hover:bg-[#00a377] text-white transition-all cursor-pointer shadow-xs"
        >
          <Check size={12} strokeWidth={3} />
          <span>Approve Pop</span>
        </button>
        
        {item.issue_type !== 'none' && (
          <button
            onClick={() => onAction(item.id, 'adjust_variant')}
            className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-3 py-2 w-full rounded-xl text-xs font-bold text-amber-500 bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/20 transition-all cursor-pointer"
          >
            <AlertTriangle size={12} />
            <span>Fix Variant</span>
          </button>
        )}

        <button
          onClick={() => onAction(item.id, 'reject')}
          className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-3 py-2 w-full rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-500 hover:border-rose-500/30 hover:bg-rose-500/5 transition-all cursor-pointer"
        >
          <Ban size={12} strokeWidth={2.5} />
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Reject</span>
        </button>
      </div>

    </div>
  );
}