"use client";

import React from "react";
import {
  BarChart3,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { cn } from "@/lib/utils";

function ChartSummary({
  label,
  value,
  positive,
  align = "left",
}: {
  label: string;
  value: string;
  positive?: boolean;
  align?: "left" | "right";
}) {
  return (
    <div
      className={cn(
        "px-5 py-4 md:px-6",
        align === "right" &&
          "md:text-right"
      )}
    >
      <p className="text-[8px] font-black uppercase tracking-[0.12em] text-slate-400">
        {label}
      </p>

      <p
        className={cn(
          "mt-1 text-[11px] font-black tabular-nums text-slate-950 dark:text-white",
          positive === true &&
            "text-emerald-500 dark:text-emerald-400",
          positive === false &&
            "text-rose-500 dark:text-rose-400"
        )}
      >
        {value}
      </p>
    </div>
  );
}

export default function PriceHistoryPanel({
  selectedGrade,
  currentDisplayPrice,
  chartStats,
  timeframes,
  selectedTimeframe,
  onTimeframeChange,
  svgPath,
}: {
  selectedGrade: string;
  currentDisplayPrice: string;
  chartStats: {
    low: string;
    high: string;
    change: string;
    changePercent: string;
    positive: boolean;
  };
  timeframes: string[];
  selectedTimeframe: string;
  onTimeframeChange: (
    timeframe: string
  ) => void;
  svgPath: string;
}) {
  return (
    <section className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.035)] dark:border-white/5 dark:bg-slate-900">
      <div className="flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between md:p-6">
        <div>
          <p className="mb-2 text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">
            Current Value ({selectedGrade})
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-4xl font-black tracking-[-0.05em] tabular-nums text-slate-950 dark:text-white md:text-5xl">
              {currentDisplayPrice}
            </span>

            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-black",
                chartStats.positive
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "bg-rose-500/10 text-rose-500"
              )}
            >
              {chartStats.positive ? (
                <TrendingUp size={12} />
              ) : (
                <TrendingDown size={12} />
              )}

              {chartStats.changePercent}
            </span>
          </div>
        </div>

        <div className="flex max-w-full gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1 dark:bg-white/5">
          {timeframes.map(
            (timeframe) => (
              <button
                key={timeframe}
                type="button"
                onClick={() =>
                  onTimeframeChange(
                    timeframe
                  )
                }
                className={cn(
                  "shrink-0 rounded-lg px-3 py-2 text-[9px] font-black uppercase transition",
                  selectedTimeframe ===
                    timeframe
                    ? "bg-[#00BA88] text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                {timeframe}
              </button>
            )
          )}
        </div>
      </div>

      <div className="relative h-[270px] border-y border-slate-100 bg-gradient-to-b from-white to-slate-50/60 px-4 py-5 dark:border-white/5 dark:from-slate-900 dark:to-white/[0.02] md:h-[330px] md:px-6">
        {svgPath ? (
          <svg
            viewBox="0 0 720 280"
            preserveAspectRatio="none"
            className="h-full w-full"
          >
            <defs>
              <linearGradient
                id="cmcChartArea"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#00BA88"
                  stopOpacity="0.22"
                />

                <stop
                  offset="100%"
                  stopColor="#00BA88"
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>

            {[40, 90, 140, 190, 240].map(
              (y) => (
                <line
                  key={y}
                  x1="0"
                  x2="720"
                  y1={y}
                  y2={y}
                  stroke="currentColor"
                  className="text-slate-200 dark:text-white/5"
                  strokeWidth="1"
                />
              )
            )}

            <path
              d={`${svgPath} L 698 256 L 22 256 Z`}
              fill="url(#cmcChartArea)"
            />

            <path
              d={svgPath}
              fill="none"
              stroke="#00BA88"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <circle
              cx="698"
              cy="80"
              r="5"
              fill="#00BA88"
              stroke="white"
              strokeWidth="3"
            />
          </svg>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
            <BarChart3 size={28} />
            <span className="text-[10px] font-black uppercase tracking-[0.18em]">
              No Price Stream
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 divide-y divide-slate-100 md:grid-cols-3 md:divide-x md:divide-y-0 dark:divide-white/5">
        <ChartSummary
          label="Timeframe Low"
          value={chartStats.low}
        />

        <ChartSummary
          label="30D Change"
          value={`${chartStats.positive ? "+" : "-"} ${chartStats.change} (${chartStats.changePercent})`}
          positive={chartStats.positive}
        />

        <ChartSummary
          label="Timeframe High"
          value={chartStats.high}
          align="right"
        />
      </div>
    </section>
  );
}
