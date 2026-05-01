import { Info, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export const GrowthSummaryCard = ({ meta }: { meta: any }) => {
  return (
    <div className="h-full bg-white dark:bg-slate-900 rounded-[24px] border border-slate-100 dark:border-slate-800 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Since Watchlist Created
          </h3>
          <Info size={14} className="text-slate-300 cursor-help shrink-0" />
        </div>
        
        {/* Value Section */}
        <div className="space-y-1 mb-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Total Increase
          </p>
          <p className="text-2xl font-extrabold text-white tracking-tight">
            ${meta.totalIncrease.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
            <TrendingUp size={14} /> {meta.totalIncreasePercent}%
          </p>
        </div>

        {/* Enhanced Sparkline Visualization */}
        <div className="h-16 w-full mt-2">
          <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <defs>
              <linearGradient id="growthGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* 1. Main Area Fill */}
            <motion.path 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              d="M0,35 L20,32 L40,36 L60,25 L80,18 L100,8 V40 H0 Z" 
              fill="url(#growthGrad)" 
            />

            {/* 2. The Dotted Performance Line */}
            <motion.path 
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              d="M0,35 L20,32 L40,36 L60,25 L80,18 L100,8" 
              fill="none" 
              stroke="#10b981" 
              strokeWidth="2"
              strokeDasharray="1 4" 
              strokeLinecap="round" 
              className="drop-shadow-[0_2px_4px_rgba(16,185,129,0.3)]"
            />

            {/* 3. Terminal "Live" Indicator */}
            <g>
              <motion.circle 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                cx="100" 
                cy="8" 
                r="3" 
                fill="#10b981"
              />
              <circle 
                cx="100" 
                cy="8" 
                r="1.5" 
                fill="#10b981" 
                className="drop-shadow-[0_0_4px_#10b981]"
              />
              <circle 
                cx="100" 
                cy="8" 
                r="0.7" 
                fill="white" 
              />
            </g>
          </svg>
        </div>
      </div>

      {/* Footer Section */}
      <div className="pt-6 border-t border-slate-50 dark:border-slate-800 space-y-5">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Created
            </p>
            <p className="text-[13px] font-bold text-slate-800 dark:text-slate-200">
              {meta.createdAt}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Initial Value
            </p>
            <p className="text-[13px] font-bold text-slate-800 dark:text-slate-200">
              ${meta.initialValue.toLocaleString()}
            </p>
          </div>
      </div>
    </div>
  );
};