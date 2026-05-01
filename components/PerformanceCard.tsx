import React, { useMemo } from 'react';
import { Info, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

interface PerformanceStat {
  label: string;
  val: string;
  sub?: string;
  status: 'pos' | 'neg' | 'neutral';
}

interface PerformanceCardProps {
  title: string;
  currentValue: string;
  percentageChange: string;
  isPositive: boolean;
  timeframes: string[];
  activeTimeframe: string;
  onTimeframeChange: (t: string) => void;
  yAxisLabels: string[];
  xAxisLabels: string[];
  chartPathData: string;
  chartFillData: string;
  stats?: PerformanceStat[];
  infoTooltip?: string;
  showInsights?: boolean;
}

const PerformanceCard: React.FC<PerformanceCardProps> = ({
  title,
  currentValue,
  percentageChange,
  isPositive,
  timeframes,
  activeTimeframe,
  onTimeframeChange,
  yAxisLabels,
  xAxisLabels,
  chartPathData,
  chartFillData,
  stats = [],
  infoTooltip,
  showInsights = true 
}) => {
  // Fix: Extract the last coordinate from the path string to keep the indicator perfectly attached
  const lastPoint = useMemo(() => {
    const coords = chartPathData.match(/(-?\d+\.?\d*)[,\s](-?\d+\.?\d*)\s*$/);
    return { 
      x: coords ? coords[1] : "400", 
      y: coords ? coords[2] : "50" 
    };
  }, [chartPathData]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[24px] border border-slate-100 dark:border-slate-800 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] group/card">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">{title}</h3>
            <Info 
              size={14} 
              title={infoTooltip}
              className="text-slate-300 dark:text-slate-600 opacity-0 group-hover/card:opacity-100 transition-opacity cursor-help" 
            />
          </div>
          <div className="flex items-baseline gap-3">
            <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {currentValue}
            </p>
            <p className={cn(
              "text-xs font-bold flex items-center gap-1",
              isPositive ? "text-emerald-500" : "text-red-500"
            )}>
              {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {percentageChange}
            </p>
          </div>
        </div>

        <div className="flex gap-1 bg-slate-50 dark:bg-[#050b18] p-1.5 rounded-xl border border-slate-100 dark:border-slate-800/50 shadow-inner">
          {timeframes.map((t) => (
            <button
              key={t}
              onClick={() => onTimeframeChange(t)}
              className={cn(
                "px-4 py-2 text-[11px] font-black rounded-lg transition-all duration-200 uppercase tracking-wider",
                activeTimeframe === t
                  ? "bg-[#10b981] text-white shadow-[0_4px_12px_rgba(16,185,129,0.2)] dark:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/40"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className={cn(
          "h-64 flex gap-4 transition-all duration-500",
          showInsights ? "md:col-span-7" : "md:col-span-12"
        )}>
          
          <div className="flex flex-col justify-between py-1 text-[10px] font-bold text-slate-400 text-right w-10 shrink-0">
            {yAxisLabels.map((label, idx) => <span key={idx}>{label}</span>)}
          </div>

          <div className="flex-1 flex flex-col justify-between relative">
            <div className="flex-1 relative overflow-visible">
              <svg viewBox="0 0 400 150" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>

                <motion.path
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={`fill-${chartFillData}`}
                  transition={{ duration: 1, delay: 0.2 }}
                  d={chartFillData}
                  fill="url(#chartGrad)"
                />

                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  key={`line-${chartPathData}`}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  d={chartPathData}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeDasharray="1 6"
                  strokeLinecap="round"
                  className="drop-shadow-[0_4px_10px_rgba(16,185,129,0.3)]"
                />

                {/* Updated: Pulse Indicator now uses the dynamic lastPoint coordinate */}
                <g transform={`translate(${lastPoint.x}, ${lastPoint.y})`}>
                  <motion.circle
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                    r="8" fill="#10b981"
                  />
                  <circle r="4" fill="#10b981" className="drop-shadow-[0_0_8px_#10b981]" />
                  <circle r="1.5" fill="white" />
                </g>
              </svg>
            </div>

            <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 tracking-tighter">
              {xAxisLabels.map((label, idx) => <span key={idx}>{label}</span>)}
            </div>
          </div>
        </div>

        {showInsights && (
          <div className="md:col-span-5 flex flex-col justify-between border-l border-slate-50 dark:border-slate-800 pl-0 md:pl-8 space-y-3">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
              Performance Overview
            </p>
            
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
        )}
      </div>
    </div>
  );
};

export default PerformanceCard;