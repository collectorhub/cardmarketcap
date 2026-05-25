"use client";

import React from 'react';
import { Calendar, DollarSign, Check, Ban, AlertCircle, ArrowUpRight, Percent, ShieldCheck } from 'lucide-react';
import { TransactionSale } from '@/types/pricing';
import { cn } from "@/lib/utils";

interface TransactionRowItemProps {
  sale: TransactionSale;
  onApproveSale: (id: string) => void;
  onQuarantineSale: (id: string) => void;
}

export default function TransactionRowItem({ sale, onApproveSale, onQuarantineSale }: TransactionRowItemProps) {
  
  const anomalyLabels = {
    price_spike: "Abnormal Price Spike",
    suspicious_shill: "Potential Shill Bidding",
    polluted_title_match: "Junk Title Cross-Pollution",
    none: "Stable Ingestion Data"
  };

  return (
    <div className={cn(
      "p-4 md:p-5 bg-white dark:bg-slate-900 border rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 font-inter transition-all duration-150",
      sale.is_outlier 
        ? "border-rose-500/30 dark:border-rose-500/20 bg-rose-500/[0.02] shadow-xs" 
        : "border-slate-200/70 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
    )}>
      
      {/* LEFT SIDE: INGESTION TELEMETRY & TEXT METADATA */}
      <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 min-w-0">
        
        {/* BRAND IDENTITY STREAM ICON COVERLAY */}
        <div className={cn(
          "p-3 rounded-xl border shrink-0 flex items-center justify-center transition-colors",
          sale.source_platform === 'ebay' 
            ? "bg-blue-500/[0.04] dark:bg-blue-500/10 border-blue-500/10 text-blue-500" 
            : "bg-purple-500/[0.04] dark:bg-purple-500/10 border-purple-500/10 text-purple-500"
        )}>
          {sale.source_platform === 'ebay' ? (
            <ArrowUpRight size={18} className="stroke-[2.5]" />
          ) : (
            <Percent size={16} className="stroke-[2.5]" />
          )}
        </div>

        {/* METADATA INFO STACK */}
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn(
              "text-[8px] px-1.5 py-0.5 rounded-md font-black tracking-widest uppercase border",
              sale.source_platform === 'ebay' 
                ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" 
                : "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
            )}>
              {sale.source_platform.replace('_', ' ')} FEED
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500 font-mono font-medium">
              <Calendar size={11} className="stroke-[2.5]" />
              {sale.sale_date}
            </span>
          </div>

          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate pr-2 tracking-tight">
            {sale.card_title}
          </h3>

          {/* ATTRIBUTE TAG POOL */}
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
            <span className={cn(
              "px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase border tracking-wider",
              sale.grade_status === 'graded' 
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" 
                : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-transparent"
            )}>
              {sale.grade_status === 'graded' ? (sale.grade_value || "Graded") : "Raw"}
            </span>

            {sale.is_outlier ? (
              <span className="text-rose-500 dark:text-rose-400 font-bold flex items-center gap-1 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 rounded-md text-[9px] uppercase tracking-wider animate-pulse">
                <AlertCircle size={10} className="stroke-[3]" />
                {anomalyLabels[sale.anomaly_reason || 'none']}
              </span>
            ) : (
              <span className="text-[#00BA88] font-bold flex items-center gap-1 bg-[#00BA88]/5 dark:bg-[#00BA88]/10 border border-[#00BA88]/10 px-1.5 py-0.5 rounded-md text-[9px] uppercase tracking-wider">
                <ShieldCheck size={10} className="stroke-[2.5]" />
                <span>Verified Match</span>
              </span>
            )}
          </div>
        </div>

      </div>

      {/* MID SECTION: FINANCIAL METRIC CONTAINER BANNER */}
      <div className={cn(
        "flex lg:flex-col items-center justify-between lg:justify-center px-4 py-2.5 border rounded-xl min-w-0 lg:w-36 shrink-0 font-mono",
        sale.is_outlier
          ? "bg-rose-500/[0.03] border-rose-500/10"
          : "bg-slate-50/50 dark:bg-slate-950/40 border-slate-100 dark:border-slate-800/40"
      )}>
        <span className="block text-slate-400 dark:text-slate-500 text-[9px] font-sans font-black uppercase tracking-widest lg:text-center">Sale Price</span>
        <div className={cn(
          "flex items-center text-sm font-black tracking-tight",
          sale.is_outlier ? "text-rose-500 dark:text-rose-400" : "text-slate-900 dark:text-emerald-400"
        )}>
          <DollarSign size={13} className="text-slate-400 dark:text-slate-500 -mr-0.5 shrink-0 stroke-[2.5]" />
          <span>{sale.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      </div>

      {/* RIGHT SIDE: AUDIT GOVERNANCE INTERACTIVE SWITCHES */}
      <div className="flex flex-row lg:flex-col items-center justify-end gap-2 border-t lg:border-t-0 border-slate-100 dark:border-slate-800/60 pt-3 lg:pt-0 w-full lg:w-40 font-inter shrink-0">
        
        {sale.is_outlier ? (
          <>
            {/* FORCE VERIFY TRIGGER BUTTON */}
            <button
              onClick={() => onApproveSale(sale.id)}
              className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 h-9 px-3 w-full rounded-xl text-xs font-black uppercase tracking-wider text-[#00BA88] bg-[#00BA88]/5 hover:bg-[#00BA88]/10 border border-[#00BA88]/20 transition-all cursor-pointer"
            >
              <Check size={12} strokeWidth={3} />
              <span>Allow Sale</span>
            </button>

            {/* QUARANTINE TRIGGER BUTTON */}
            <button
              onClick={() => onQuarantineSale(sale.id)}
              className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 h-9 px-3 w-full rounded-xl text-xs font-black uppercase tracking-wider bg-rose-500 hover:bg-rose-600 text-white border border-rose-600 transition-all cursor-pointer shadow-xs"
            >
              <Ban size={11} strokeWidth={2.5} />
              <span>Quarantine</span>
            </button>
          </>
        ) : (
          /* RECESS/DIM COMPONENT WHEN TRANSACTIONS ARE ALREADY COMPLIANT */
          <button
            onClick={() => onQuarantineSale(sale.id)}
            className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 h-9 px-3 w-full rounded-xl border border-slate-200 dark:border-slate-800/80 text-slate-400 dark:text-slate-500 hover:text-rose-500 hover:border-rose-500/30 hover:bg-rose-500/5 opacity-60 hover:opacity-100 transition-all cursor-pointer text-xs font-bold font-inter"
            title="Flag price anomaly or shill bid signature"
          >
            <AlertCircle size={12} strokeWidth={2.5} />
            <span>Flag Anomaly</span>
          </button>
        )}

  </div>
</div>
  );
}