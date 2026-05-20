"use client";

import React from 'react';
import { ShieldAlert, Info, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

interface QaAlert {
  label: string;
  count: number;
  priority: string;
  table: string;
}

interface QaIntegrityReportProps {
  alerts: QaAlert[];
}

export default function QaIntegrityReport({ alerts }: QaIntegrityReportProps) {
  const totalAnomalies = alerts.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-6 font-inter">
      
      {/* 1. COMPONENT HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50 dark:border-slate-800/80 pb-5">
        <div className="space-y-1">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
            <ShieldAlert className="h-4 w-4 text-[#00BA88]" /> 
            <span className="font-sora">System Integrity & QA Reporting</span>
            <Info size={12} className="text-slate-300 dark:text-slate-600 cursor-help" />
          </h2>
          <p className="text-slate-400 dark:text-slate-500 text-[13px] font-medium font-inter">
            Active data validation failures isolating broken records before frontend compilation.
          </p>
        </div>
        
        {/* Absolute High-End Warning Badge */}
        <div className="self-start sm:self-center flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 dark:bg-red-500/10 text-red-500 border border-red-100/60 dark:border-red-500/20 text-xs font-bold tracking-tight shadow-2xs font-inter">
          <AlertTriangle size={12} strokeWidth={2.5} className="animate-bounce" />
          <span>{totalAnomalies.toLocaleString()} Active Anomalies</span>
        </div>
      </div>

      {/* 2. SPECIFIC ANOMALIES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {alerts.map((alert, index) => (
          <motion.div 
            key={alert.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03, type: "spring", stiffness: 260, damping: 22 }}
            className="p-4 rounded-2xl border border-slate-100/80 dark:border-slate-800/60 bg-white dark:bg-slate-950/20 hover:bg-slate-50/40 dark:hover:bg-slate-950/60 hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-200 flex items-center justify-between gap-4 group font-inter"
          >
            {/* Left Content Area - Inter applied with full text wrap support */}
            <div className="space-y-1.5 min-w-0 flex-1 font-inter">
              <p className="text-[13px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#00BA88] transition-colors font-inter">
                {alert.label}
              </p>
              <span className="inline-block text-[10px] font-bold bg-slate-50 dark:bg-slate-800/60 px-1.5 py-0.5 rounded text-slate-400 dark:text-slate-500 border border-slate-100/50 dark:border-slate-800 tracking-wide">
                {alert.table}
              </span>
            </div>
            
            {/* Right Metric & Pill Actions Layout - Clean Inter Alignment */}
            <div className="text-right flex flex-row items-center gap-4 shrink-0 font-inter">
              <span className="text-[16px] font-black text-slate-900 dark:text-white tracking-tight">
                {alert.count.toLocaleString()}
              </span>
              
              <span className={cn(
                "text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border w-[76px] text-center block shadow-2xs",
                alert.priority === 'critical' && "bg-red-50/50 dark:bg-red-500/10 text-red-500 border-red-100 dark:border-red-500/20",
                alert.priority === 'high' && "bg-orange-50/50 dark:bg-orange-500/10 text-orange-500 border-orange-100 dark:border-orange-500/20",
                alert.priority === 'medium' && "bg-amber-50/50 dark:bg-amber-500/10 text-amber-500 border-amber-100 dark:border-amber-500/20",
                alert.priority === 'low' && "bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-100 dark:border-slate-700"
              )}>
                {alert.priority}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}