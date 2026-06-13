import React, { useMemo, useState } from "react";
import { Info, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Range = "30D" | "90D" | "All";

const TABS: Range[] = ["30D", "90D", "All"];

function money(value: any) {
  return `$${Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export const WatchlistHero = ({ data }: { data: any }) => {
  const [activeTab, setActiveTab] = useState<Range>("30D");

  const chartConfig = useMemo(() => {
    const currentTotal = Number(data?.totalValue || 0);

    const growthMap: Record<Range, number> = {
      "30D": Number(data?.growth30D || 0),
      "90D": Number(data?.growth90D || 0),
      All: Number(data?.growthAll || 0),
    };

    const valueMap: Record<Range, number> = {
      "30D": Number(data?.change30DValue || 0),
      "90D": Number(data?.change90DValue || 0),
      All: Number(data?.changeAllValue || 0),
    };

    const daysMap: Record<Range, number> = {
      "30D": 30,
      "90D": 90,
      All: 180,
    };

    const pointMap: Record<Range, number> = {
      "30D": 7,
      "90D": 9,
      All: 10,
    };

    const growthPercent = growthMap[activeTab];
    const changeValue = valueMap[activeTab];
    const days = daysMap[activeTab];
    const pointsCount = pointMap[activeTab];

    const safeCurrent = currentTotal > 0 ? currentTotal : 1000;
    const startValue =
      growthPercent !== -100 ? safeCurrent / (1 + growthPercent / 100) : safeCurrent;

    const values = Array.from({ length: pointsCount }).map((_, i) => {
      const progress = i / (pointsCount - 1);
      const baseValue = startValue + (safeCurrent - startValue) * progress;

      const waveOne = Math.sin(progress * Math.PI * 2) * 0.035;
      const waveTwo = Math.sin(progress * Math.PI * 5) * 0.018;
      const shapedValue = baseValue * (1 + waveOne + waveTwo);

      if (i === pointsCount - 1) return safeCurrent;
      return Math.max(shapedValue, 0);
    });

    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = Math.max(maxValue - minValue, 1);

    const points = values.map((value, i) => {
      const x = i * (800 / (pointsCount - 1));
      const normalized = (value - minValue) / range;
      const y = 95 - normalized * 85;

      const date = new Date();
      const daysBack = Math.round(days - (days * i) / (pointsCount - 1));
      date.setDate(date.getDate() - daysBack);

      const label =
        activeTab === "All"
          ? date.toLocaleDateString(undefined, { month: "short" })
          : date.toLocaleDateString(undefined, { month: "short", day: "numeric" });

      return { x, y, value, label };
    });

    const path = `M${points.map((p) => `${p.x},${p.y}`).join(" L")}`;
    const fill = `${path} V100 H0 Z`;

    const yLabels = [
      money(maxValue).replace(".00", ""),
      money(minValue + range * 0.75).replace(".00", ""),
      money(minValue + range * 0.5).replace(".00", ""),
      money(minValue + range * 0.25).replace(".00", ""),
      money(minValue).replace(".00", ""),
    ];

    return {
      currentTotal,
      growthPercent,
      changeValue,
      isPositive: growthPercent >= 0,
      points,
      lastPoint: points[points.length - 1],
      path,
      fill,
      yLabels,
    };
  }, [data, activeTab]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[20px] border border-slate-100 dark:border-slate-800 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] h-full flex flex-col justify-between group/card">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Watchlist Overview
            </h3>
            <Info size={14} className="text-slate-300 cursor-help" />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {money(chartConfig.currentTotal)}
            </p>

            <div
              className={cn(
                "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
                chartConfig.isPositive
                  ? "text-emerald-500 bg-emerald-500/10"
                  : "text-red-500 bg-red-500/10"
              )}
            >
              {chartConfig.isPositive ? (
                <TrendingUp size={14} />
              ) : (
                <TrendingDown size={14} />
              )}
              {chartConfig.isPositive ? "+" : ""}
              {chartConfig.growthPercent.toFixed(2)}% ({activeTab})
            </div>
          </div>

          <p
            className={cn(
              "mt-2 text-[11px] font-bold",
              chartConfig.changeValue >= 0 ? "text-emerald-500" : "text-red-500"
            )}
          >
            {chartConfig.changeValue >= 0 ? "+" : "-"}
            {money(Math.abs(chartConfig.changeValue))} tracked movement
          </p>
        </div>

        <div className="flex w-full md:w-auto gap-1 bg-slate-50 dark:bg-slate-950 p-1 rounded-xl border border-slate-100 dark:border-slate-800/50">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 md:flex-none px-4 py-2 text-[10px] font-bold rounded-lg transition-all uppercase",
                activeTab === tab
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-row gap-4 md:gap-6 flex-1 min-h-[180px]">
        <div className="flex flex-col justify-between py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 text-right min-w-[48px] shrink-0 pr-2 border-r border-slate-50 dark:border-slate-800/50">
          {chartConfig.yLabels.map((label, idx) => (
            <span key={idx}>{label}</span>
          ))}
        </div>

        <div className="flex-1 flex flex-col justify-between relative pt-2">
          <div className="flex-1 relative">
            <svg
              viewBox="0 0 800 100"
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="watchlistChartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop
                    offset="0%"
                    stopColor={chartConfig.isPositive ? "#10b981" : "#ef4444"}
                    stopOpacity="0.15"
                  />
                  <stop
                    offset="100%"
                    stopColor={chartConfig.isPositive ? "#10b981" : "#ef4444"}
                    stopOpacity="0"
                  />
                </linearGradient>
              </defs>

              <path d={chartConfig.fill} fill="url(#watchlistChartGrad)" />

              <motion.path
                key={activeTab}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                d={chartConfig.path}
                fill="none"
                stroke={chartConfig.isPositive ? "#10b981" : "#ef4444"}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {chartConfig.lastPoint && (
                <motion.g
                  key={`${activeTab}-endpoint`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, duration: 0.4 }}
                >
                  <circle
                    cx={chartConfig.lastPoint.x}
                    cy={chartConfig.lastPoint.y}
                    r="8"
                    fill={chartConfig.isPositive ? "#10b981" : "#ef4444"}
                    fillOpacity="0.15"
                    className="animate-pulse"
                  />
                  <circle
                    cx={chartConfig.lastPoint.x}
                    cy={chartConfig.lastPoint.y}
                    r="4"
                    fill={chartConfig.isPositive ? "#10b981" : "#ef4444"}
                  />
                  <circle cx={chartConfig.lastPoint.x} cy={chartConfig.lastPoint.y} r="2" fill="white" />
                </motion.g>
              )}
            </svg>
          </div>

          <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">
            {chartConfig.points.map((p, i) => (
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