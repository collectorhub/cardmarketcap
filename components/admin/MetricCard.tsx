"use client";

import React from 'react';
import { CheckCircle2, LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  sub: string;
  icon: LucideIcon;
  color: string;
}

export default function MetricCard({ label, value, sub, icon: Icon, color }: MetricCardProps) {
  return (
    <div className="w-full font-inter">
      {/* Horizontal touch swipe layer active on mobile screen boundaries.
        The wrapper flattens nicely into a responsive block on desktop.
      */}
      <div className="w-full overflow-x-auto scrollbar-none snap-x snap-mandatory px-1 md:px-0">
        <div className="flex md:grid md:grid-cols-1 gap-0 min-w-max md:min-w-0">
          <div className="w-[285px] sm:w-[320px] md:w-auto snap-start shrink-0 p-1">
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[22px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative overflow-hidden group hover:border-slate-200/80 dark:hover:border-slate-700 transition-all duration-300 hover:shadow-[0_12px_40px_rgb(0,0,0,0.04)] hover:-translate-y-0.5 select-none h-full flex flex-col justify-between"
            >
              {/* Top Details Row */}
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1 min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400 dark:text-slate-500">
                    {label}
                  </p>
                  <h3 className="text-2xl md:text-[26px] font-black text-slate-900 dark:text-white leading-none tracking-tight">
                    {value}
                  </h3>
                </div>
                
                {/* Decorative Icon Container */}
                <div className={cn(
                  "p-2.5 rounded-xl transition-all duration-300 group-hover:scale-110 shrink-0", 
                  color
                )}>
                  <Icon className="h-4.5 w-4.5 stroke-[2.5]" />
                </div>
              </div>
              
              {/* Bottom Context Badge Row */}
              <div className="mt-5 pt-3.5 border-t border-slate-50 dark:border-slate-800/60 flex items-center justify-between gap-2">
                
                {/* DB Entity Mapping Badge */}
                <span className="text-[10px] font-bold bg-slate-50 dark:bg-slate-800/50 px-2 py-0.5 rounded-md border border-slate-100/70 dark:border-slate-800 text-slate-400 dark:text-slate-500 truncate max-w-[140px] tracking-wide">
                  {sub}
                </span>
                
                {/* Production Cluster Status Indicator */}
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50/40 dark:bg-emerald-500/10 text-emerald-500 border border-emerald-100/50 dark:border-emerald-500/20 shrink-0">
                  <CheckCircle2 size={10} strokeWidth={3} className="animate-pulse" />
                  <span className="text-[9px] font-extrabold uppercase tracking-wide">Stable</span>
                </div>
                
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}