"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownRight, Info, Activity, Zap, BarChart3, TrendingUp, Megaphone } from 'lucide-react'
import { cn } from "@/lib/utils"

interface MarketStatsProps {
  initialStats: any[]
}

interface StatCardProps {
  label: string
  value: string
  change?: string
  isPositive?: boolean
  icon: React.ElementType
  data?: number[] 
  index: number
  subtext?: string
  isAd?: boolean
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

function StatCard({ label, value, change, isPositive, icon: Icon, data, index, subtext, isAd }: StatCardProps) {
  const color = isPositive ? "#00BA88" : "#EF4444";
  const pathData = data ? getPath(data, 100, 40) : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
      className={cn(
        "group relative flex flex-col h-full min-w-0 overflow-hidden rounded-xl md:rounded-[1.5rem] border transition-all duration-300 md:shadow-sm",
        // MOBILE: p-1.5 | DESKTOP: p-6 (restored)
        "p-1.5 md:p-6", 
        isAd 
          ? "border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/30 dark:bg-emerald-950/20" 
          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-[#00BA88]/40"
      )}
    >
      <div className="relative z-10 flex flex-col h-full justify-between gap-2 md:gap-5">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-1.5 md:gap-3 min-w-0 w-full">
            {/* Desktop Icon Restored: hidden on mobile, flex on md+ */}
            <div className={cn(
                "hidden md:flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all duration-300",
                isAd 
                    ? "bg-emerald-500 text-white border-emerald-400" 
                    : "bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700/50 group-hover:bg-[#00BA88]/10 group-hover:border-[#00BA88]/30"
            )}>
              <Icon className={cn("h-5 w-5 transition-colors", isAd ? "text-white" : "text-slate-500 dark:text-slate-400 group-hover:text-[#00BA88]")} />
            </div>
            
            <div className="flex flex-col min-w-0 w-full">
                <span className={cn(
                    "text-[7px] md:text-[10px] font-black uppercase tracking-wider block w-full leading-tight md:leading-none md:tracking-[0.15em]",
                    isAd ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"
                )}>
                  {label}
                </span>
                {subtext && (
                  <span className="hidden sm:block text-[8px] md:text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter mt-0.5 md:mt-1 opacity-80 leading-tight">
                    {subtext}
                  </span>
                )}
            </div>
          </div>
          {/* Info Icon: Restored for Desktop only */}
          {!isAd && <Info className="hidden md:block h-3.5 w-3.5 text-slate-300 dark:text-slate-700 hover:text-[#00BA88] transition-colors cursor-help" />}
        </div>

        {/* Value & Trend Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-1 md:gap-2 mt-auto">
          <div className="min-w-0">
            <h3 className={cn(
                "text-[10px] sm:text-sm md:text-xl xl:text-2xl font-black tracking-tight truncate",
                isAd ? "text-emerald-700 dark:text-emerald-300" : "text-slate-900 dark:text-white"
            )}>
              {value}
            </h3>

            <div className={cn(
                "flex items-center gap-0.5 md:gap-1 text-[7px] md:text-[11px] font-black mt-0.5 md:mt-1 px-1 md:px-2 py-0.5 rounded-full w-fit shrink-0",
                isPositive 
                    ? "text-[#00BA88] bg-[#00BA88]/10" 
                    : "text-red-500 bg-red-500/10"
            )}>
                {isPositive ? <ArrowUpRight className="h-2 w-2 md:h-3 md:w-3" /> : <ArrowDownRight className="h-2 w-2 md:h-3 md:w-3" />}
                {change}
            </div>
          </div>

          {/* Sparkline: Restored Desktop Area Fill + Animation */}
          {data && (
            <div className="h-3 w-6 sm:h-6 sm:w-12 md:h-10 md:w-20 shrink-0 ml-auto md:ml-0 md:mb-1 opacity-60 md:opacity-100">
                <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                    <defs>
                        <linearGradient id={`grad-${index}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                            <stop offset="100%" stopColor={color} stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    {/* Fill visible on desktop (hidden via stroke-only logic on mobile if needed, but here we just restore full path) */}
                    <motion.path 
                        d={`${pathData} L 100,40 L 0,40 Z`} 
                        fill={`url(#grad-${index})`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hidden md:block" // Keep mobile clean with line only
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
          )}
        </div>
      </div>
      
      {/* Background Decorative Circle: Restored for Desktop */}
      <div className="hidden md:block absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-slate-50 dark:bg-slate-800/30 blur-2xl group-hover:bg-[#00BA88]/10 transition-colors duration-500" />
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

  const displayStats = (initialStats || []).slice(0, 4);

  return (
    <div className="w-full">
        {/* Force 5 columns, keeping the desktop gap of 4/6 */}
        <div className="grid grid-cols-5 gap-1 md:gap-4 lg:gap-6 items-stretch">
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

            <StatCard 
                index={4}
                label="Promoted Ad"
                value="Grading"
                icon={Megaphone}
                isAd={true}
            />
        </div>
    </div>
  )
}