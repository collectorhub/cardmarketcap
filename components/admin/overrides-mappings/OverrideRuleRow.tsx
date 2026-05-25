"use client";

import React from 'react';
import { ArrowRight, Trash2, Shield, ToggleLeft, ToggleRight, Sparkles, Ban, HelpCircle } from 'lucide-react';
import { OverrideRule } from '@/types/overrides';
import { cn } from "@/lib/utils";

interface OverrideRuleRowProps {
  rule: OverrideRule;
  onToggleStatus: (id: string) => void;
  onDeleteRule: (id: string) => void;
}

export default function OverrideRuleRow({ rule, onToggleStatus, onDeleteRule }: OverrideRuleRowProps) {
  
  const typeConfigs = {
    alias_cleanup: { label: "Alias Map", icon: Sparkles, color: "text-blue-500 bg-blue-500/5 border-blue-500/10" },
    global_exclusion: { label: "Exclusion Block", icon: Ban, color: "text-rose-500 bg-rose-500/5 border-rose-500/10" },
    frontend_helper: { label: "Frontend Link", icon: HelpCircle, color: "text-purple-500 bg-purple-500/5 border-purple-500/10" }
  };

  const { label, icon: TypeIcon, color: typeStyle } = typeConfigs[rule.type];

  return (
    <div className="p-4 md:p-5 bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/80 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 font-inter">
      
      {/* TEXT MAP TRANSFORMATION COMPARISON */}
      <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 min-w-0">
        
        {/* RAW INCOMING BUFFER BLOCK */}
        <div className="flex-1 p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/50 rounded-xl min-w-0">
          <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-wider text-slate-400 mb-1">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            <span>Raw Scraped Pattern</span>
          </div>
          <p className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 truncate">
            {rule.raw_incoming_string}
          </p>
        </div>

        {/* INTERSECTION SPLIT DIRECTIONAL FLAG */}
        <div className="flex sm:flex-col items-center justify-center gap-1 shrink-0 px-1">
          <ArrowRight size={13} className="rotate-90 sm:rotate-0 text-slate-300 dark:text-slate-700" />
          <span className={cn("text-[8px] px-1.5 py-0.5 rounded-sm font-black tracking-widest uppercase border", typeStyle)}>
            {label}
          </span>
        </div>

        {/* OUTGOING NORMALIZATION MAPPED TARGET */}
        <div className="flex-1 p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/50 rounded-xl min-w-0">
          <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-wider text-[#00BA88] mb-1">
            <Shield size={9} strokeWidth={3} />
            <span>Target Output (cmc_card_frontend)</span>
          </div>
          <p className={cn(
            "text-xs font-bold truncate",
            rule.type === 'global_exclusion' ? 'text-rose-500 line-through font-mono' : 'text-slate-900 dark:text-slate-100'
          )}>
            {rule.type === 'global_exclusion' ? '[REJECT & DROP RECORD STREAM]' : rule.mapped_canonical_target}
          </p>
        </div>

      </div>

      {/* FOOTER AUDIT STAMPS */}
      <div className="flex flex-wrap lg:flex-nowrap items-center justify-between lg:justify-end gap-4 border-t lg:border-t-0 border-slate-100 dark:border-slate-800/40 pt-3 lg:pt-0 shrink-0">
        
        {/* INTERNAL TELEMETRY MATRIX */}
        <div className="flex items-center gap-4 text-right text-[10px] font-mono text-slate-400 dark:text-slate-500">
          <div>
            <span className="block text-[8px] uppercase tracking-wider font-sans text-slate-400/80 font-semibold">Engine Scope</span>
            <span className="text-slate-700 dark:text-slate-300 font-bold">{rule.scope_target}</span>
          </div>
          <div className="hidden sm:block">
            <span className="block text-[8px] uppercase tracking-wider font-sans text-slate-400/80 font-semibold">Secured By</span>
            <span className="text-slate-600 dark:text-slate-400 font-medium">{rule.created_by}</span>
          </div>
        </div>

        {/* ACTION BUTTON ROW */}
<div className="flex items-center gap-3">
  
  {/* HIGH-VISIBILITY UX STATUS TOGGLE CARD SWITCH */}
  <button
    onClick={() => onToggleStatus(rule.id)}
    className={cn(
      "h-7 px-2.5 rounded-lg border text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all cursor-pointer select-none duration-150",
      rule.status === 'active'
        ? "bg-[#00BA88] border-[#00a377] text-white shadow-xs hover:bg-[#00a377]"
        : "bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/60 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
    )}
    title={rule.status === 'active' ? 'Suspend Override Rule' : 'Activate Override Rule'}
  >
    {/* Visual Dot Pulse Indicator */}
    <span className={cn(
      "h-1.5 w-1.5 rounded-full",
      rule.status === 'active' ? "bg-white animate-pulse" : "bg-slate-400 dark:bg-slate-600"
    )} />
    
    <span>{rule.status === 'active' ? 'Active' : 'Paused'}</span>
  </button>

  {/* SEPARATOR BORDER WALL */}
  <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

  {/* PURGE BUTTON */}
  <button
    onClick={() => onDeleteRule(rule.id)}
    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/5 rounded-xl border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
    title="Purge Translation Rule"
  >
    <Trash2 size={14} strokeWidth={2.5} />
  </button>
</div>
      </div>

    </div>
  );
}