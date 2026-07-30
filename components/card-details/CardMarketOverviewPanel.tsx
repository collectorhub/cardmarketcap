"use client";

import React, {
  useMemo,
} from "react";
import {
  BarChart3,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { cn } from "@/lib/utils";

function formatAxisMoney(
  value: number
) {
  if (!Number.isFinite(value)) {
    return "$0";
  }

  if (value >= 1000) {
    return `$${(
      value / 1000
    ).toFixed(
      value >= 10000 ? 0 : 1
    )}K`;
  }

  return `$${Math.round(value)}`;
}

function ChartSummary({
  label,
  value,
  positive,
  align = "left",
}: {
  label: string;
  value: string;
  positive?: boolean;
  align?: "left" | "center" | "right";
}) {
  return (
    <div
      className={cn(
        "px-4 py-4 md:px-5",
        align === "center" &&
          "text-center",
        align === "right" &&
          "text-right"
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

export default function CardMarketOverviewPanel({
  card,
  cardName,
  cardSet,
  cardType,
  grades,
  selectedGrade,
  onGradeChange,
  currentDisplayPrice,
  chartStats,
  chartData,
  timeframes,
  selectedTimeframe,
  onTimeframeChange,
  svgPath,
}: {
  card: any;
  cardName: string;
  cardSet: string;
  cardType: string;
  grades: string[];
  selectedGrade: string;
  onGradeChange: (
    grade: string
  ) => void;
  currentDisplayPrice: string;
  chartStats: {
    low: string;
    high: string;
    change: string;
    changePercent: string;
    positive: boolean;
  };
  chartData: number[];
  timeframes: string[];
  selectedTimeframe: string;
  onTimeframeChange: (
    timeframe: string
  ) => void;
  svgPath: string;
}) {
  const clean = (
    value: any,
    fallback = "—"
  ) =>
    value === null ||
    value === undefined ||
    value === ""
      ? fallback
      : String(value);

  const axis = useMemo(() => {
    if (!chartData.length) {
      return {
        labels: [
          600,
          500,
          400,
          300,
          200,
        ],
        endY: 140,
      };
    }

    const minimum =
      Math.min(...chartData);

    const maximum =
      Math.max(...chartData);

    const range =
      maximum - minimum || 1;

    const padding =
      Math.max(
        range * 0.18,
        maximum * 0.035,
        5
      );

    const low =
      Math.max(
        0,
        minimum - padding
      );

    const high =
      maximum + padding;

    const labels = Array.from(
      { length: 5 },
      (_, index) =>
        high -
        ((high - low) / 4) *
          index
    );

    const last =
      chartData[
        chartData.length - 1
      ];

    const endY =
      24 +
      (1 -
        (last - minimum) /
          range) *
        232;

    return {
      labels,
      endY:
        Number.isFinite(endY)
          ? Math.max(
              24,
              Math.min(
                256,
                endY
              )
            )
          : 140,
    };
  }, [chartData]);

  return (
    <div className="space-y-4">
      {/* Card identity is intentionally rendered directly on the page,
          not inside another bordered panel. */}
      <header className="px-1 pt-1 md:px-2 md:pt-2">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-[#00BA88]/20 bg-[#00BA88]/10 px-2 py-1 text-[8px] font-black uppercase tracking-[0.13em] text-[#00BA88]">
            Rank #{card.rank || "124"}
          </span>

          <span className="text-[9px] font-black uppercase tracking-[0.17em] text-slate-400">
            Market Index
          </span>
        </div>

        <h1 className="max-w-3xl text-3xl font-black uppercase leading-[0.94] tracking-[-0.04em] text-slate-950 dark:text-white sm:text-4xl lg:text-[42px]">
          {cardName}
        </h1>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.09em] text-slate-500">
          <span>
            {clean(
              card.set_code ||
                card.setCode ||
                cardSet
            )}
          </span>

          <span className="text-slate-300">
            |
          </span>

          <span>
            {clean(card.number)}
          </span>

          <span className="text-slate-300">
            |
          </span>

          <span>
            {clean(cardType)}
          </span>
        </div>

        <div className="cmc-tab-scroll mt-5 overflow-x-auto rounded-[15px] border border-slate-200/80 bg-[#f8fafc] p-1 dark:border-white/5 dark:bg-white/[0.03]">
          <div className="flex min-w-max gap-1">
            {grades.map(
              (grade) => (
                <button
                  key={grade}
                  type="button"
                  onClick={() =>
                    onGradeChange(
                      grade
                    )
                  }
                  className={cn(
                    "min-w-[66px] rounded-[11px] px-3 py-2.5 text-[9px] font-black uppercase transition",
                    selectedGrade ===
                      grade
                      ? "bg-white text-[#00BA88] ring-1 ring-slate-200/90 dark:bg-slate-800 dark:ring-white/10"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  {grade}
                </button>
              )
            )}
          </div>
        </div>
      </header>

      {/* Only the live market graph is a card, matching the reference. */}
      <section className="overflow-hidden rounded-[18px] border border-slate-200/80 bg-white dark:border-white/5 dark:bg-slate-900">
        <div className="flex flex-col gap-5 px-5 pb-5 pt-5 md:flex-row md:items-center md:justify-between md:px-6 md:pb-6 md:pt-6">
          <div>
            <p className="mb-2 text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">
              Current Value ({selectedGrade})
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[42px] font-black leading-none tracking-[-0.055em] tabular-nums text-slate-950 dark:text-white md:text-[48px]">
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

          <div className="cmc-tab-scroll flex max-w-full gap-1 overflow-x-auto rounded-xl bg-slate-100/90 p-1 dark:bg-white/5">
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
                      ? "bg-[#00BA88] text-white"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  {timeframe}
                </button>
              )
            )}
          </div>
        </div>

        <div className="relative h-[275px] border-t border-slate-100 bg-white px-4 pb-2 pt-3 dark:border-white/5 dark:bg-slate-900 md:h-[330px] md:px-5">
          {svgPath ? (
            <div className="grid h-full grid-cols-[38px_minmax(0,1fr)] gap-2">
              <div className="flex h-full flex-col justify-between pb-7 pt-3 text-right">
                {axis.labels.map(
                  (label, index) => (
                    <span
                      key={index}
                      className="text-[8px] font-bold tabular-nums text-slate-400"
                    >
                      {formatAxisMoney(
                        label
                      )}
                    </span>
                  )
                )}
              </div>

              <div className="relative min-w-0">
                <svg
                  viewBox="0 0 720 280"
                  preserveAspectRatio="none"
                  className="h-[calc(100%-26px)] w-full"
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
                        stopOpacity="0.20"
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
                        className="text-slate-200/80 dark:text-white/5"
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
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <circle
                    cx="698"
                    cy={axis.endY}
                    r="5"
                    fill="#00BA88"
                    stroke="white"
                    strokeWidth="3"
                  />
                </svg>

                <div className="absolute inset-x-0 bottom-0 flex justify-between px-1 text-[8px] font-semibold text-slate-400">
                  <span>
                    May 7
                  </span>
                  <span>
                    May 14
                  </span>
                  <span>
                    May 21
                  </span>
                  <span>
                    May 28
                  </span>
                  <span>
                    Jun 4
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
              <BarChart3 size={28} />

              <span className="text-[10px] font-black uppercase tracking-[0.18em]">
                No Price Stream
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100 dark:divide-white/5 dark:border-white/5">
          <ChartSummary
            label="Timeframe Low"
            value={chartStats.low}
          />

          <ChartSummary
            label="30D Change"
            value={`${chartStats.positive ? "+" : "-"} ${chartStats.change} (${chartStats.changePercent})`}
            positive={chartStats.positive}
            align="center"
          />

          <ChartSummary
            label="Timeframe High"
            value={chartStats.high}
            align="right"
          />
        </div>
      </section>
    </div>
  );
}
