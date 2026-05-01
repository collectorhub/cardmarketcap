import React, { useState } from 'react';
import { Info, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const WatchlistHero = ({ data }: { data: any }) => {
  const [activeTab, setActiveTab] = useState('7D');

  const points = [
    { x: 0, y: 65, label: 'May 12' },
    { x: 133, y: 65, label: 'May 13' },
    { x: 266, y: 50, label: 'May 14' },
    { x: 400, y: 50, label: 'May 15' },
    { x: 533, y: 40, label: 'May 16' },
    { x: 666, y: 25, label: 'May 17' },
    { x: 800, y: 15, label: 'May 18' },
  ];

  const lastPoint = points[points.length - 1];
  const pathData = `M${points.map(p => `${p.x},${p.y}`).join(' L')}`;
  const fillData = `${pathData} V100 H0 Z`;

  return (
    /* 1. Added h-full and flex-col to ensure it fills the grid span */
    <div className="bg-white dark:bg-slate-900 rounded-[20px] border border-slate-100 dark:border-slate-800 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] h-full flex flex-col justify-between group/card">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Watchlist Overview</h3>
            <Info size={14} className="text-slate-300 cursor-help" />
          </div>
          <div className="flex items-center gap-3">
            <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
               ${data?.totalValue?.toLocaleString() || '32,415.20'}
            </p>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-500">
              <TrendingUp size={14} /> {data?.growth7D || '9.72'}% (7D)
            </div>
          </div>
        </div>
        
        {/* TAB TOGGLES */}
        <div className="flex w-full md:w-auto gap-1 bg-slate-50 dark:bg-slate-950 p-1 rounded-xl border border-slate-100 dark:border-slate-800/50">
          {['7D', '30D', '90D', '1Y', 'All'].map((t) => (
            <button 
              key={t}
              onClick={() => setActiveTab(t)}
              className={cn(
                "flex-1 md:flex-none px-4 py-2 text-[10px] font-bold rounded-lg transition-all uppercase",
                activeTab === t 
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20" 
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* CHART AREA - 2. Removed fixed h-48 and used flex-1 to occupy remaining space */}
      <div className="flex flex-row gap-4 md:gap-6 flex-1 min-h-[180px]">
        
        {/* LEFT Y-AXIS LABELS */}
        <div className="flex flex-col justify-between py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 text-right min-w-[35px] md:min-w-[40px] shrink-0 pr-2">
          <span>$40K</span>
          <span>$30K</span>
          <span>$20K</span>
          <span>$10K</span>
          <span>$0</span>
        </div>

        <div className="flex-1 flex flex-col justify-between relative">
          <div className="flex-1 relative">
            {/* 3. Changed preserveAspectRatio to none and ensured h-full to stretch path */}
            <svg viewBox="0 0 800 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
              </defs>

              <path d={fillData} fill="url(#chartGrad)" />

              <motion.path 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                d={pathData} 
                fill="none" 
                stroke="#10b981" 
                strokeWidth="2.5" 
                strokeDasharray="1 12"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <motion.g 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                <circle cx={lastPoint.x} cy={lastPoint.y} r="8" fill="#10b981" fillOpacity="0.15" className="animate-pulse" />
                <circle cx={lastPoint.x} cy={lastPoint.y} r="4" fill="#10b981" />
                <circle cx={lastPoint.x} cy={lastPoint.y} r="2" fill="white" />
              </motion.g>
            </svg>
          </div>
          
          <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">
            {points.map((p, i) => (
              <span key={i} className={cn(i % 2 !== 0 ? "hidden sm:inline" : "")}>
                {p.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};