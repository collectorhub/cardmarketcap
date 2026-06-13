import { Info, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

interface GrowthSummaryProps {
  meta: {
    totalIncrease?: number;
    totalIncreasePercent?: number;
    createdAt?: string | null;
    initialValue?: number;
  };
}

function money(value: any) {
  return `$${Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value?: string | null) {
  if (!value) return "N/A";

  const date = new Date(String(value).replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const GrowthSummaryCard = ({ meta }: GrowthSummaryProps) => {
  const totalIncrease = Number(meta?.totalIncrease || 0);
  const percent = Number(meta?.totalIncreasePercent || 0);
  const initialValue = Number(meta?.initialValue || 0);
  const isPositive = totalIncrease >= 0;

  const path = isPositive
    ? "M0,35 L20,32 L40,36 L60,25 L80,18 L100,8"
    : "M0,8 L20,13 L40,10 L60,22 L80,28 L100,35";

  return (
    <div className="h-full bg-white dark:bg-slate-900 rounded-[24px] border border-slate-100 dark:border-slate-800 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Since Watchlist Created
          </h3>
          <Info size={14} className="text-slate-300 cursor-help shrink-0" />
        </div>

        <div className="space-y-1 mb-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Total Movement
          </p>

          <p className="text-2xl font-inter font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isPositive ? "+" : "-"}
            {money(Math.abs(totalIncrease))}
          </p>

          <p
            className={`text-[10px] font-bold flex items-center gap-1 ${
              isPositive ? "text-emerald-500" : "text-red-500"
            }`}
          >
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {isPositive ? "+" : "-"}
            {Math.abs(percent).toFixed(2)}%
          </p>
        </div>

        <div className="h-16 w-full mt-2">
          <svg
            viewBox="0 0 100 40"
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="growthGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop
                  offset="0%"
                  stopColor={isPositive ? "#10b981" : "#ef4444"}
                  stopOpacity="0.25"
                />
                <stop
                  offset="100%"
                  stopColor={isPositive ? "#10b981" : "#ef4444"}
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>

            <motion.path
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              d={`${path} V40 H0 Z`}
              fill="url(#growthGrad)"
            />

            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              d={path}
              fill="none"
              stroke={isPositive ? "#10b981" : "#ef4444"}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-50 dark:border-slate-800 space-y-5">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Created
          </p>
          <p className="text-[13px] font-bold text-slate-800 dark:text-slate-200">
            {formatDate(meta?.createdAt)}
          </p>
        </div>

        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Initial Value
          </p>
          <p className="text-[13px] font-bold text-slate-800 dark:text-slate-200">
            {money(initialValue)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GrowthSummaryCard;