"use client";

import React from 'react';
import { BarChart2, Info, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface IngestionMatch {
  platform: string;
  matched: number;
  unmatched: number;
  percentage: number;
}

interface PipelineOversightProps {
  matches: IngestionMatch[];
}

export default function PipelineOversight({ matches }: PipelineOversightProps) {
  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
      
      {/* Container Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50 dark:border-slate-800/80 pb-5 mb-5">
        <div className="space-y-1">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
            <BarChart2 className="h-4 w-4 text-[#00BA88]" /> 
            <span>Core Pipeline Ingestion Oversight</span>
            <Info size={12} className="text-slate-300 dark:text-slate-600 cursor-help" />
          </h2>
          <p className="text-slate-400 dark:text-slate-500 text-[13px] font-medium">
            Realtime match success evaluations against primary third-party APIs.
          </p>
        </div>
        
        {/* Premium Log Indicator Badge */}
        <div className="self-start sm:self-center flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold text-[#00BA88] bg-[#00BA88]/10 border border-[#00BA88]/10 tracking-wide uppercase whitespace-nowrap">
          <span className="h-1.5 w-1.5 rounded-full bg-[#00BA88] animate-pulse" />
          <span>Live Ingestion Monitor</span>
        </div>
      </div>
      
      {/* Structured Pipeline Rows Grid */}
      <div className="space-y-3.5">
        {matches.map((match, index) => (
          <motion.div 
            key={match.platform}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, type: "spring", stiffness: 260, damping: 22 }}
            className="p-4 rounded-2xl border border-slate-100/70 dark:border-slate-800/40 bg-slate-50/30 dark:bg-slate-950/20 hover:bg-slate-50/70 dark:hover:bg-slate-950/40 hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-200 space-y-3 group"
          >
            {/* Top Identity and Stats Metadata Row */}
            <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 text-xs">
              
              {/* Platform Title Identifier */}
              <div className="flex items-center gap-2">
                <CheckCircle size={13} className="text-slate-300 dark:text-slate-600 group-hover:text-[#00BA88] transition-colors" />
                <span className="font-extrabold text-slate-800 dark:text-slate-200 tracking-tight text-[13px]">
                  {match.platform}
                </span>
              </div>
              
              {/* Complex Alignment Technical Metrics */}
              <div className="flex items-center gap-2.5 font-mono text-[11px] text-slate-400 dark:text-slate-500 self-stretch xs:self-auto justify-between xs:justify-end">
                <span>
                  <strong className="text-slate-900 dark:text-white font-black text-xs">
                    {match.matched.toLocaleString()}
                  </strong>{" "}
                  linked
                </span>
                
                <span className="h-3 w-[1px] bg-slate-200 dark:bg-slate-800 hidden xs:block" />
                
                <span>
                  {match.unmatched.toLocaleString()} unlinked
                </span>
                
                {/* Clean 10% Opacity Percentage Pill */}
                <span className="font-sans font-black px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] tracking-tight ml-0.5 min-w-[42px] text-center">
                  {match.percentage}%
                </span>
              </div>
            </div>
            
            {/* Smooth Track/Progress Bar Element */}
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800/60 rounded-full overflow-hidden relative border border-slate-200/10">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${match.percentage}%` }}
                transition={{ 
                  delay: index * 0.05 + 0.1, 
                  duration: 0.9, 
                  ease: [0.16, 1, 0.3, 1] 
                }}
                className="h-full bg-gradient-to-r from-emerald-500 to-[#00BA88] rounded-full relative"
              />
            </div>

          </motion.div>
        ))}
      </div>
    </div>
  );
}