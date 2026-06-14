"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowLeft,
  BarChart3,
  Info,
  Layers,
  LineChart,
  Search,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Range = "30D" | "90D" | "All";

const TABS: Range[] = ["30D", "90D", "All"];
const PLACEHOLDER_IMAGE = "https://pokecollectorhub.com/assets/placeholder.png";

function money(value: any) {
  return `$${Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function safeNumber(value: any) {
  const n = Number(value || 0);
  return Number.isFinite(n) ? n : 0;
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

function buildSparkPath(change: number) {
  if (change > 0) return "M0,32 Q20,26 40,28 T70,12 T100,6";
  if (change < 0) return "M0,6 Q20,12 40,18 T70,30 T100,36";
  return "M0,22 Q25,18 50,22 T75,20 T100,22";
}

function Sparkline({ change, index }: { change: number; index: number }) {
  const isUp = change >= 0;
  const color = isUp ? "#00BA88" : "#ef4444";
  const path = buildSparkPath(change);
  const lastY = path.split("T").pop()?.split(",")[1] || "22";

  return (
    <div className="h-10 w-full max-w-[120px] flex items-center">
      <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id={`index-spark-${index}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        <motion.path
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          d={`${path} L 100,40 L 0,40 Z`}
          fill={`url(#index-spark-${index})`}
        />

        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
          d={path}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
        />

        <circle cx="100" cy={lastY} r="2.5" fill={color} />
      </svg>
    </div>
  );
}

export default function IndexDetailsPage({ data }: { data: any }) {
  const [activeTab, setActiveTab] = useState<Range>("30D");
  const [search, setSearch] = useState("");

  const index = data?.index || {};
  const stats = data?.stats || {};
  const performance = data?.performance || {};
  const cards = Array.isArray(data?.cards) ? data.cards : [];
  const allocation = data?.allocation || {};
  const summary = data?.summary || {};

  const filteredCards = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return cards;

    return cards.filter((card: any) => {
      return (
        String(card.name || "").toLowerCase().includes(q) ||
        String(card.setName || card.set || "").toLowerCase().includes(q) ||
        String(card.card_id || "").toLowerCase().includes(q) ||
        String(card.game || "").toLowerCase().includes(q) ||
        String(card.grade || "").toLowerCase().includes(q)
      );
    });
  }, [cards, search]);

  const chartConfig = useMemo(() => {
    const currentTotal = safeNumber(stats.totalValue);

    const growthMap: Record<Range, number> = {
      "30D": safeNumber(performance.change30DPct),
      "90D": safeNumber(performance.change90DPct),
      All: safeNumber(performance.changeAllPct),
    };

    const valueMap: Record<Range, number> = {
      "30D": safeNumber(performance.change30D),
      "90D": safeNumber(performance.change90D),
      All: safeNumber(performance.changeAll),
    };

    const daysMap: Record<Range, number> = {
      "30D": 30,
      "90D": 90,
      All: 180,
    };

    const pointsCountMap: Record<Range, number> = {
      "30D": 7,
      "90D": 9,
      All: 10,
    };

    const selectedChangePct = growthMap[activeTab];
    const selectedChangeValue = valueMap[activeTab];
    const days = daysMap[activeTab];
    const pointsCount = pointsCountMap[activeTab];

    const safeCurrent = currentTotal > 0 ? currentTotal : 1000;
    const startValue =
      selectedChangePct !== -100 ? safeCurrent / (1 + selectedChangePct / 100) : safeCurrent;

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
      const x = i * (400 / (pointsCount - 1));
      const normalized = (value - minValue) / range;
      const y = 140 - normalized * 120;

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
    const fill = `${path} V150 H0 Z`;

    const yLabels = [
      money(maxValue).replace(".00", ""),
      money(minValue + range * 0.75).replace(".00", ""),
      money(minValue + range * 0.5).replace(".00", ""),
      money(minValue + range * 0.25).replace(".00", ""),
      money(minValue).replace(".00", ""),
    ];

    return {
      selectedChangePct,
      selectedChangeValue,
      isPositive: selectedChangeValue >= 0,
      points,
      lastPoint: points[points.length - 1],
      path,
      fill,
      yLabels,
    };
  }, [stats, performance, activeTab]);

  const metrics = [
    {
      label: "Index Value",
      value: money(stats.totalValue),
      sub: `${chartConfig.selectedChangePct >= 0 ? "+" : ""}${safeNumber(
        chartConfig.selectedChangePct
      ).toFixed(2)}% ${activeTab}`,
      icon: Wallet,
      color:
        chartConfig.selectedChangeValue >= 0
          ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10"
          : "text-red-600 bg-red-50 dark:bg-red-500/10",
    },
    {
      label: "Cards",
      value: String(stats.totalCards || 0),
      sub: "Index constituents",
      icon: Layers,
      color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10",
    },
    {
      label: "Avg Card Value",
      value: money(stats.averageCardValue),
      sub: "Weighted average",
      icon: BarChart3,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-500/10",
    },
    {
      label: "Best 30D Card",
      value: summary?.bestCard?.name || "N/A",
      sub:
        summary?.bestCard?.change30D !== undefined
          ? `${safeNumber(summary.bestCard.change30D) >= 0 ? "+" : ""}${safeNumber(
              summary.bestCard.change30D
            ).toFixed(2)}%`
          : "No movement",
      icon: TrendingUp,
      color: "text-purple-600 bg-purple-50 dark:bg-purple-500/10",
    },
  ];

  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-white">
      <div className="space-y-8 md:space-y-12 pb-20 pt-15 md:pt-6">
        <header className="flex flex-col gap-2">
          {/* <Link
            href="/overview"
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 hover:text-[#00BA88] transition mb-2 w-fit"
          >
            <ArrowLeft size={14} />
            Back to overview
          </Link> */}

          <div className="flex items-center gap-2 text-[#00BA88]">
            <Activity className="h-4 w-4 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
              Market Index
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {index.name}
          </h1>

          <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-sm md:text-lg leading-relaxed">
            {index.description || "A curated market index built from selected trading cards."}
          </p>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {metrics.map((metric, i) => {
            const Icon = metric.icon;

            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="group relative overflow-hidden rounded-2xl md:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 md:p-5 shadow-sm hover:shadow-md transition-all active:scale-95 lg:active:scale-100"
              >
                <div className="flex justify-between items-start mb-2 md:mb-3">
                  <div className={cn("h-7 w-7 md:h-8 md:w-8 rounded-lg md:rounded-xl flex items-center justify-center", metric.color)}>
                    <Icon className="h-3 w-3 md:h-4 md:w-4" />
                  </div>

                  <span className="text-[9px] md:text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 truncate max-w-[90px]">
                    {metric.sub}
                  </span>
                </div>

                <p className="text-[9px] md:text-[10px] font-inter font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate">
                  {metric.label}
                </p>

                <span className="text-lg md:text-xl font-inter font-black text-slate-900 dark:text-white mt-0.5 truncate">
                  {metric.value}
                </span>
              </motion.div>
            );
          })}
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 md:p-8 shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 mb-6 md:mb-8">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                Index Performance
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                Value {money(stats.totalValue)} · {stats.totalCards || 0} cards
              </p>
            </div>

            <div className="w-full md:w-auto overflow-x-auto scrollbar-hide md:mx-0 md:px-0">
              <div className="grid grid-cols-3 md:flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-full md:w-fit">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "px-3 md:px-4 py-2 md:py-1.5 text-[9px] md:text-[10px] font-black rounded-lg transition-all whitespace-nowrap",
                      activeTab === tab
                        ? "bg-[#00BA88] text-white shadow-md"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="h-[230px] md:h-48 w-full relative flex gap-2 md:gap-3 overflow-hidden pb-9 md:pb-0">
            <div className="hidden sm:flex flex-col justify-between py-1 text-[9px] md:text-[10px] font-bold text-slate-400 text-right w-14 shrink-0">
              {chartConfig.yLabels.map((label, idx) => (
                <span key={idx}>{label}</span>
              ))}
            </div>

            <div className="flex-1 min-w-0 flex flex-col">
              <div className="relative flex-1 min-h-[170px] md:min-h-0">
                <svg
                  viewBox="0 0 400 150"
                  preserveAspectRatio="none"
                  className="w-full h-full overflow-visible"
                >
                  <defs>
                    <linearGradient id="indexChartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop
                        offset="0%"
                        stopColor={chartConfig.isPositive ? "#00BA88" : "#ef4444"}
                        stopOpacity="0.3"
                      />
                      <stop
                        offset="100%"
                        stopColor={chartConfig.isPositive ? "#00BA88" : "#ef4444"}
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>

                  {[40, 80, 120].map((y) => (
                    <line
                      key={y}
                      x1="0"
                      y1={y}
                      x2="400"
                      y2={y}
                      stroke="currentColor"
                      strokeWidth="1"
                      className="text-slate-100 dark:text-slate-800/50"
                      strokeDasharray="4 4"
                    />
                  ))}

                  <motion.path
                    key={`${activeTab}-fill`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    d={chartConfig.fill}
                    fill="url(#indexChartGrad)"
                  />

                  <motion.path
                    key={`${activeTab}-path`}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    d={chartConfig.path}
                    fill="none"
                    stroke={chartConfig.isPositive ? "#00BA88" : "#ef4444"}
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  {chartConfig.lastPoint && (
                    <circle
                      cx={chartConfig.lastPoint.x}
                      cy={chartConfig.lastPoint.y}
                      r="4"
                      fill={chartConfig.isPositive ? "#00BA88" : "#ef4444"}
                    />
                  )}
                </svg>
              </div>

              <div className="flex justify-between mt-4 md:mt-3 text-[9px] md:text-[10px] font-bold text-slate-400 tracking-tighter shrink-0">
                {chartConfig.points.map((p, i) => (
                  <span key={i} className={cn(i % 2 !== 0 ? "hidden sm:inline" : "")}>
                    {p.label}
                  </span>
                ))}
              </div>
            </div>

            <span className="hidden md:block absolute -bottom-2 right-0 text-[8px] font-bold text-slate-300 uppercase tracking-widest">
              CardMarketCap
            </span>
          </div>
        </div>

          <div className="rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white">
                Index Summary
              </h3>
              <Info className="h-4 w-4 text-slate-300" />
            </div>

            <div className="space-y-4">
              {[
                {
                  label: "Change 30D",
                  value: `${safeNumber(performance.change30D) >= 0 ? "+" : "-"}${money(
                    Math.abs(safeNumber(performance.change30D))
                  )}`,
                  status: safeNumber(performance.change30D) >= 0 ? "pos" : "neg",
                },
                {
                  label: "Change 90D",
                  value: `${safeNumber(performance.change90D) >= 0 ? "+" : "-"}${money(
                    Math.abs(safeNumber(performance.change90D))
                  )}`,
                  status: safeNumber(performance.change90D) >= 0 ? "pos" : "neg",
                },
                {
                  label: "All Time High",
                  value: money(performance.allTimeHigh),
                  status: "neutral",
                },
                {
                  label: "All Time Low",
                  value: money(performance.allTimeLow),
                  status: "neutral",
                },
                {
                  label: "Last Updated",
                  value: formatDate(index.updatedAt),
                  status: "neutral",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex justify-between items-center border-b last:border-0 border-slate-100 dark:border-slate-800 pb-3"
                >
                  <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {item.label}
                  </p>

                  <p
                    className={cn(
                      "text-sm font-black text-right",
                      item.status === "pos"
                        ? "text-emerald-500"
                        : item.status === "neg"
                          ? "text-red-500"
                          : "text-slate-900 dark:text-white"
                    )}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">
                Allocation By Grade
              </h3>

              <div className="space-y-3">
                {(allocation.byGrade || []).length > 0 ? (
                  allocation.byGrade.map((item: any) => (
                    <div key={item.name}>
                      <div className="flex justify-between text-[10px] font-bold mb-1">
                        <span className="text-slate-500 dark:text-slate-400">{item.name}</span>
                        <span>{item.value}%</span>
                      </div>

                      <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#00BA88]"
                          style={{ width: `${Math.min(100, Number(item.value || 0))}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] text-slate-400 font-bold">No allocation data.</p>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                Index Constituents
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                Cards currently powering this index.
              </p>
            </div>

            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search cards in index..."
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-bold outline-none focus:border-[#00BA88]"
              />
            </div>
          </div>

          <div className="w-full overflow-x-auto scrollbar-hide">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <th className="px-6 py-4">Card</th>
                  <th className="px-4 py-4">Set</th>
                  <th className="px-4 py-4 text-center">Grade</th>
                  <th className="px-4 py-4">Weight</th>
                  <th className="px-4 py-4">Value</th>
                  <th className="px-4 py-4">Allocation</th>
                  <th className="px-4 py-4">30D</th>
                  <th className="px-4 py-4">90D</th>
                  <th className="px-6 py-4">Last Sale</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredCards.length > 0 ? (
                  filteredCards.map((card: any, i: number) => {
                    const change30 = safeNumber(card.change30D);
                    const change90 = safeNumber(card.change90D);

                    return (
                      <tr key={card.indexCardId || `${card.card_id}-${i}`} className="hover:bg-slate-50 dark:hover:bg-slate-950/60 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={card.imageUrl || PLACEHOLDER_IMAGE}
                              alt={card.name || card.card_id}
                              className="w-9 h-12 rounded-md object-cover bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                            />

                            <div className="min-w-0">
                              <p className="text-sm font-black truncate max-w-[220px]">
                                {card.name || card.card_id}
                              </p>
                              <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase">
                                #{card.cardNumber || card.card_id}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-[10px] md:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                          {card.setName || card.set || "Unknown Set"}
                        </td>

                        <td className="px-4 py-4 text-center">
                          <span className="inline-flex px-2 py-1 rounded-lg text-[10px] font-black bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20">
                            {card.grade || "PSA 10"}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-xs font-black">
                          {Number(card.weight || 1).toFixed(2)}
                        </td>

                        <td className="px-4 py-4">
                          <p className="text-sm font-black">{money(card.weightedValue)}</p>
                          <p className="text-[9px] md:text-[10px] text-slate-400 font-bold">
                            Base {money(card.value)}
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          <p className="text-sm font-black">{safeNumber(card.allocation).toFixed(2)}%</p>
                        </td>

                        <td className="px-4 py-4">
                          <Sparkline index={i * 2} change={change30} />
                          <p className={cn("text-[10px] font-black mt-1", change30 >= 0 ? "text-emerald-500" : "text-red-500")}>
                            {change30 >= 0 ? "+" : ""}
                            {change30.toFixed(2)}%
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          <Sparkline index={i * 2 + 1} change={change90} />
                          <p className={cn("text-[10px] font-black mt-1", change90 >= 0 ? "text-emerald-500" : "text-red-500")}>
                            {change90 >= 0 ? "+" : ""}
                            {change90.toFixed(2)}%
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          <p className="text-sm font-black">{money(card.lastSalePrice || card.value)}</p>
                          <p className="text-[9px] md:text-[10px] text-slate-400 font-bold">
                            {formatDate(card.lastSaleDate)}
                          </p>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center">
                      <LineChart className="mx-auto text-slate-400 mb-3" />
                      <p className="text-sm font-bold text-slate-400">
                        No matching cards found in this index.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
}