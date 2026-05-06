import React, { useState } from 'react';
import { Info, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const WatchlistHero = ({ data }: { data: any }) => {
  const [activeTab, setActiveTab] = useState('7D');

  // 1. DATA CALCULATIONS
  const currentTotal = data?.totalValue || 0;
  const growthPercent = data?.growth7D || 0;
  const isPositive = growthPercent >= 0;
  
  // Calculate the starting value (7 days ago) based on the growth %
  // Formula: Current / (1 + (Percent / 100))
  const startValue = currentTotal / (1 + (growthPercent / 100));
  
  // 2. GENERATE DYNAMIC POINTS & X-AXIS LABELS
  const pointsCount = 7;
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();

  const generatedPoints = Array.from({ length: pointsCount }).map((_, i) => {
    // Calculate Date Label for X-Axis
    const date = new Date();
    date.setDate(today.getDate() - (6 - i));
    const label = `${date.getMonth() + 1}/${date.getDate()}`;

    // Calculate Y Coordinate (the "path")
    // We simulate a slight "random" wobble so it's not a perfectly straight line
    const stepWeight = i / (pointsCount - 1);
    const simulatedValue = startValue + (currentTotal - startValue) * stepWeight;
    
    // Add a small pseudo-random variance (2% wobble) for visual realism
    const wobble = i === 0 || i === 6 ? 1 : 0.98 + Math.random() * 0.04;
    const finalValue = simulatedValue * wobble;

    // Map the dollar value to the SVG coordinate system (0-100)
    // 0 is top ($$$), 100 is bottom ($0)
    const chartCeiling = Math.max(40000, Math.ceil(currentTotal / 10000) * 10000);
    const yCoord = 100 - (finalValue / chartCeiling) * 100;

    return { 
      x: (i * (800 / (pointsCount - 1))), 
      y: yCoord, 
      label: label 
    };
  });

  const lastPoint = generatedPoints[generatedPoints.length - 1];
  const pathData = `M${generatedPoints.map(p => `${p.x},${p.y}`).join(' L')}`;
  const fillData = `${pathData} V100 H0 Z`;

  // 3. GENERATE DYNAMIC Y-AXIS LABELS
  const chartCeiling = Math.max(40000, Math.ceil(currentTotal / 10000) * 10000);
  const yAxisLabels = [
    `$${(chartCeiling / 1000)}K`,
    `$${((chartCeiling * 0.75) / 1000)}K`,
    `$${((chartCeiling * 0.5) / 1000)}K`,
    `$${((chartCeiling * 0.25) / 1000)}K`,
    "$0"
  ];

  return (
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
              ${currentTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
            <div className={cn(
              "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
              isPositive ? "text-emerald-500 bg-emerald-500/10" : "text-red-500 bg-red-500/10"
            )}>
              {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />} 
              {Math.abs(growthPercent)}% (7D)
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
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* CHART AREA */}
      <div className="flex flex-row gap-4 md:gap-6 flex-1 min-h-[180px]">
        {/* DYNAMIC Y-AXIS */}
        <div className="flex flex-col justify-between py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 text-right min-w-[35px] md:min-w-[40px] shrink-0 pr-2 border-r border-slate-50 dark:border-slate-800/50">
          {yAxisLabels.map((label, idx) => (
            <span key={idx}>{label}</span>
          ))}
        </div>

        <div className="flex-1 flex flex-col justify-between relative pt-2">
          <div className="flex-1 relative">
            <svg viewBox="0 0 800 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity="0.15" />
                  <stop offset="100%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity="0" />
                </linearGradient>
              </defs>

              <path d={fillData} fill="url(#chartGrad)" />

              <motion.path 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                d={pathData} 
                fill="none" 
                stroke={isPositive ? "#10b981" : "#ef4444"} 
                strokeWidth="2.5" 
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Glowing endpoint */}
              <motion.g 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                <circle cx={lastPoint.x} cy={lastPoint.y} r="8" fill={isPositive ? "#10b981" : "#ef4444"} fillOpacity="0.15" className="animate-pulse" />
                <circle cx={lastPoint.x} cy={lastPoint.y} r="4" fill={isPositive ? "#10b981" : "#ef4444"} />
                <circle cx={lastPoint.x} cy={lastPoint.y} r="2" fill="white" />
              </motion.g>
            </svg>
          </div>
          
          {/* DYNAMIC X-AXIS LABELS */}
          <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">
            {generatedPoints.map((p, i) => (
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