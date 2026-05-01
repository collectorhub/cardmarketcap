"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Info, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from "@/lib/utils";

interface ChartPoint {
  x: number;
  y: number;
  label: string;
}

interface PerformanceStat {
  label: string;
  val: string;
  sub?: string;
  status: 'pos' | 'neg' | 'neutral';
}

interface PortfolioPerformanceProps {
  title?: string;
  currentValue: string;
  percentageChange: string;
  timeframeLabel: string; // e.g., "(7D)"
  chartData: ChartPoint[];
  yAxisLabels: string[];
  stats: PerformanceStat[];
  onTimeframeChange?: (tab: string) => void;
}

export default function PerformanceChart({
  title = "Portfolio Performance",
  currentValue,
  percentageChange,
  timeframeLabel,
  chartData,
  yAxisLabels,
  stats,
  onTimeframeChange
}: PortfolioPerformanceProps) {
  const [activeTab, setActiveTab] = useState('7D');

  const handleTabClick = (t: string) => {
    setActiveTab(t);
    if (onTimeframeChange) onTimeframeChange(t);
  };

  // Generate path strings dynamically based on passed chartData
  const linePath = chartData.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaPath = `${linePath} V150 H0 Z`;
  const lastPoint = chartData[chartData.length - 1];

  return (
    <div className="group/chart h-full flex flex-col">
      {/* 1. Header Area: Title, Value, and Toggles */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">{title}</h3>
            <Info size={14} className="text-slate-300 dark:text-slate-600 opacity-0 group-hover/chart:opacity-100 transition-opacity cursor-help" />
          </div>
          <div className="flex items-baseline gap-3">
            <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {currentValue}
            </p>
            <p className="text-xs font-bold text-emerald-500 flex items-center gap-1">
              <TrendingUp size={12} /> {percentageChange} {timeframeLabel}
            </p>
          </div>
        </div>

        {/* Timeframe Toggles */}
        <div className="flex gap-1 bg-slate-50 dark:bg-[#050b18] p-1.5 rounded-xl border border-slate-100 dark:border-slate-800/50 shadow-inner">
          {['7D', '30D', '90D', '1Y', 'All'].map((t) => (
            <button
              key={t}
              onClick={() => handleTabClick(t)}
              className={cn(
                "px-4 py-2 text-[11px] font-black rounded-lg transition-all duration-200 uppercase tracking-wider",
                activeTab === t
                  ? "bg-[#10b981] text-white shadow-[0_4px_12px_rgba(16,185,129,0.2)]"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/40"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Content Area: SVG Chart and Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 flex-1">
        {/* Left: Interactive SVG Chart */}
        <div className="md:col-span-7 h-64 flex gap-4">
          {/* Y-Axis Labels */}
          <div className="flex flex-col justify-between py-1 text-[10px] font-bold text-slate-400 text-right w-10 shrink-0">
            {yAxisLabels.map((label, i) => <span key={i}>{label}</span>)}
          </div>

          <div className="flex-1 flex flex-col justify-between relative">
            <div className="flex-1 relative">
              <svg viewBox="0 0 400 150" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>

                <motion.path
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  d={areaPath}
                  fill="url(#chartGrad)"
                />

                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  d={linePath}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="4"
                  strokeDasharray="1 8"
                  strokeLinecap="round"
                  className="drop-shadow-[0_4px_10px_rgba(16,185,129,0.3)]"
                />

                {/* Live Node Indicator */}
                <g>
                  <motion.circle
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                    cx={lastPoint.x}
                    cy={lastPoint.y}
                    r="8"
                    fill="#10b981"
                  />
                  <circle cx={lastPoint.x} cy={lastPoint.y} r="4" fill="#10b981" className="drop-shadow-[0_0_8px_#10b981]" />
                  <circle cx={lastPoint.x} cy={lastPoint.y} r="1.5" fill="white" />
                </g>
              </svg>
            </div>

            {/* X-Axis Labels from chartData */}
            <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 tracking-tighter">
              {chartData.map((point, i) => (
                <span key={i}>{point.label}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Performance Metrics */}
        <div className="md:col-span-5 flex flex-col justify-between border-l border-slate-50 dark:border-slate-800 pl-0 md:pl-8 space-y-3">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Performance Overview</p>
          
          {stats.map((item, i) => (
            <div key={i} className="flex justify-between items-center group/item border-b border-slate-50 dark:border-slate-800 pb-2 last:border-0">
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{item.label}</p>
              <div className="text-right">
                <p className={cn(
                  "text-[12px] font-black flex items-center justify-end gap-1",
                  item.status === 'pos' ? "text-emerald-500" : item.status === 'neg' ? "text-red-500" : "text-slate-900 dark:text-white"
                )}>
                  {item.status === 'pos' && <TrendingUp size={10} />}
                  {item.status === 'neg' && <TrendingDown size={10} />}
                  {item.val}
                </p>
                {item.sub && (
                  <p className={cn(
                    "text-[9px] font-bold", 
                    item.status === 'pos' ? "text-emerald-500/80" : "text-red-500/80"
                  )}>
                    {item.status === 'pos' ? '↗' : '↘'} {item.sub}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}