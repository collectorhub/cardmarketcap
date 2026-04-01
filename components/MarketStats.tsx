"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownRight, Info, Activity, Zap, BarChart3, TrendingUp } from 'lucide-react'
import { cn } from "@/lib/utils"

interface MarketStatsProps {
  initialStats: any[]
}

interface StatCardProps {
  label: string
  value: string
  change: string
  isPositive: boolean
  icon: React.ElementType
  data: number[] 
  index: number
  subtext?: string
}

const getPath = (data: number[], width: number, height: number) => {
  const step = width / (data.length - 1);
  const points = data.map((val, i) => ({
    x: i * step,
    y: height - (val / 100) * height
  }));

  return points.reduce((acc, point, i, a) => {
    if (i === 0) return `M ${point.x},${point.y}`;
    const p0 = a[i - 1];
    const cp1x = p0.x + (point.x - p0.x) / 2;
    return `${acc} C ${cp1x},${p0.y} ${cp1x},${point.y} ${point.x},${point.y}`;
  }, "");
};

function StatCard({ label, value, change, isPositive, icon: Icon, data, index, subtext }: StatCardProps) {
  const color = isPositive ? "#00BA88" : "#EF4444";
  const pathData = getPath(data, 100, 40);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
      className="group relative overflow-hidden rounded-[1.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 transition-all duration-300 hover:border-[#00BA88]/40 shadow-sm"
    >
      <div className="relative z-10 flex flex-col gap-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 group-hover:bg-[#00BA88]/10 group-hover:border-[#00BA88]/30 transition-all duration-300">
              <Icon className="h-5 w-5 text-slate-500 dark:text-slate-400 group-hover:text-[#00BA88] transition-colors" />
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] leading-none">
                  {label}
                </span>
                {subtext && (
                  <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter mt-1 opacity-80">
                    {subtext}
                  </span>
                )}
            </div>
          </div>
          <Info className="h-3.5 w-3.5 text-slate-300 dark:text-slate-700 hover:text-[#00BA88] transition-colors cursor-help" />
        </div>

        <div className="flex items-end justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-xl xl:text-2xl font-black tracking-tight text-slate-900 dark:text-white truncate">
              {value}
            </h3>
            <div className={cn(
              "flex items-center gap-1 text-[11px] font-black mt-1 px-2 py-0.5 rounded-full w-fit",
              isPositive 
                ? "text-[#00BA88] bg-[#00BA88]/10" 
                : "text-red-500 bg-red-500/10"
            )}>
              {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {change}
            </div>
          </div>

          <div className="h-10 w-20 flex-shrink-0 mb-1">
            <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id={`grad-${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
              </defs>
              <motion.path 
                d={`${pathData} L 100,40 L 0,40 Z`} 
                fill={`url(#grad-${index})`} 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ duration: 1 }} 
              />
              <motion.path 
                d={pathData} 
                fill="none" 
                stroke={color} 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                initial={{ pathLength: 0 }} 
                animate={{ pathLength: 1 }} 
                transition={{ duration: 1.5, ease: "easeInOut" }} 
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-slate-50 dark:bg-slate-800/30 blur-2xl group-hover:bg-[#00BA88]/10 transition-colors duration-500" />
    </motion.div>
  )
}

export function MarketStats({ initialStats }: MarketStatsProps) {
  const iconMap: Record<string, any> = {
    "Total Market Cap": Activity,
    "Tracked Cards": Zap,
    "Avg Card (24h)": BarChart3,
    "PSA 10 Index": TrendingUp,
    "Modern 100": BarChart3,
  };

  // We slice the data to ONLY the first 4 items to keep the grid perfectly clean
  const displayStats = (initialStats || []).slice(0, 4);

  if (displayStats.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-slate-50 dark:bg-slate-900 rounded-[1.5rem] animate-pulse border border-slate-100 dark:border-slate-800" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {displayStats.map((s, i) => (
        <StatCard 
          key={s.label} 
          index={i}
          label={s.label}
          value={s.value}
          change={s.change}
          isPositive={s.trend === "up"}
          icon={iconMap[s.label] || Activity}
          data={Array.from({ length: 8 }, () => Math.floor(Math.random() * 50) + 30)}
        />
      ))}
    </div>
  )
}