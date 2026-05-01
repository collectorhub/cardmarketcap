import { Info, TrendingUp } from 'lucide-react';

export const GrowthSummaryCard = ({ meta }: { meta: any }) => {
  return (
    <div className="h-full bg-white dark:bg-slate-900 rounded-[24px] border border-slate-100 dark:border-slate-800 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col justify-between">
      <div>
        {/* Header - Consistent Font Size with Watchlist Overview */}
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
          <p className="text-2xl font-bold text-emerald-500 tracking-tight">
            ${meta.totalIncrease.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
            <TrendingUp size={14} /> {meta.totalIncreasePercent}%
          </p>
        </div>

        {/* Sparkline Visualization - Matches image_b99f39.png */}
        <div className="h-16 w-full mt-2">
          <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <path
              d="M0 35 L12 32 L24 36 L36 28 L48 31 L60 22 L75 26 L88 18 L100 12"
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M0 35 L12 32 L24 36 L36 28 L48 31 L60 22 L75 26 L88 18 L100 12 V40 H0 Z"
              fill="url(#growthGrad)"
              className="opacity-[0.08]"
            />
            <defs>
              <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Footer Section - Matches image_ba0bf8.png labeling */}
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