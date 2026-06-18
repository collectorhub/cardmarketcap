"use client"

import React, { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import {
  TrendingUp,
  TrendingDown,
  Info,
  Activity,
  Wallet,
  Layers,
  BarChart3,
  Zap,
  Crown,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { TrendingCards } from "./TrendingCards"

interface Card {
  id: string | number
  name: string
  set: string
  price: string
  h24: string
  score: number
  type: string
  grade: string
  image: string
  url?: string
}

interface MarketStat {
  label: string
  value: string
  change: string
  trend: "up" | "down"
}

interface MarketOverviewProps {
  initialData?: MarketStat[]
  sentimentScore?: number
  cards?: Card[]
}

type ChartTab = "30D" | "All"

const CHART_DATA = {
  "30D": {
    line: "M0,140 C100,130 200,160 300,120 C400,80 500,110 600,70 C700,30 800,50 1000,20",
    area: "M0,140 C100,130 200,160 300,120 C400,80 500,110 600,70 C700,30 800,50 1000,20 L1000,200 L0,200 Z",
  },
  All: {
    line: "M0,180 C200,160 400,120 600,80 C800,40 900,30 1000,10",
    area: "M0,180 C200,160 400,120 600,80 C800,40 900,30 1000,10 L1000,200 L0,200 Z",
  },
}

function safeNumber(value: any) {
  const n = Number(String(value || "0").replace(/[^0-9.-]/g, ""))
  return Number.isFinite(n) ? n : 0
}

function normalizeLabel(value: string) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
}

function getStat(stats: MarketStat[], label: string) {
  const target = normalizeLabel(label)
  return stats.find((s) => normalizeLabel(s.label) === target)
}

function moneyCompact(value: any) {
  const n = safeNumber(value)

  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`

  return `$${n.toLocaleString()}`
}

function formatChange(value: any) {
  const raw = String(value || "").trim()
  if (!raw) return "Live"
  if (raw.toLowerCase() === "live") return "Live"
  if (raw.includes("%")) return raw

  const n = safeNumber(raw)
  return `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`
}

function getTrend(change: any): "up" | "down" {
  return String(change || "").trim().startsWith("-") ? "down" : "up"
}

export function MarketOverview({
  initialData = [],
  sentimentScore = 50,
  cards = [],
}: MarketOverviewProps) {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

  const [chartTab, setChartTab] = useState<ChartTab>("30D")
  const [liveCards, setLiveCards] = useState<Card[]>(cards || [])
  const [cardsLoading, setCardsLoading] = useState(false)

  useEffect(() => {
    if (cards?.length) {
      setLiveCards(cards)
      return
    }

    async function loadTrendingCards() {
      try {
        setCardsLoading(true)

        const res = await fetch(`${API_BASE}/trending_cards.php?limit=24`, {
          cache: "no-store",
        })

        const data = await res.json()

        if (data?.success && Array.isArray(data.cards)) {
          setLiveCards(data.cards)
        }
      } catch (error) {
        console.error("Trending cards fetch failed:", error)
        setLiveCards([])
      } finally {
        setCardsLoading(false)
      }
    }

    if (API_BASE) loadTrendingCards()
  }, [API_BASE, cards])

  const statsCards = useMemo<MarketStat[]>(() => {
    const totalMarketCap = getStat(initialData, "TOTAL MARKET CAP") || getStat(initialData, "Total Market Cap")
    const trackedCards = getStat(initialData, "TRACKED CARDS") || getStat(initialData, "Tracked Cards")
    const psa10 = getStat(initialData, "PSA 10 INDEX") || getStat(initialData, "PSA 10 Index")
    const modern100 = getStat(initialData, "MODERN 100") || getStat(initialData, "Modern 100")
    const top20 = getStat(initialData, "TOP 20 INDEX") || getStat(initialData, "Top 20 Index")
    const top50 = getStat(initialData, "TOP 50 INDEX") || getStat(initialData, "Top 50 Index")
    const vintage50 = getStat(initialData, "VINTAGE 50 INDEX") || getStat(initialData, "Vintage 50 Index")

    return [
      {
        label: "Total Market Cap",
        value: totalMarketCap?.value || "$1.1B",
        change: formatChange(totalMarketCap?.change || "+2.1%"),
        trend: totalMarketCap?.trend || getTrend(totalMarketCap?.change || "+2.1%"),
      },
      {
        label: "Tracked Cards",
        value: trackedCards?.value || "35,051",
        change: trackedCards?.change || "Live",
        trend: "up",
      },
      {
        label: "Top 20 Index",
        value: top20?.value || psa10?.value || "2,396",
        change: formatChange(top20?.change || psa10?.change || "+0.6%"),
        trend: top20?.trend || psa10?.trend || getTrend(psa10?.change || "+0.6%"),
      },
      {
        label: "Top 50 Index",
        value: top50?.value || modern100?.value || "1,720",
        change: formatChange(top50?.change || modern100?.change || "-1.1%"),
        trend: top50?.trend || modern100?.trend || getTrend(modern100?.change || "-1.1%"),
      },
      {
        label: "PSA 10 Index",
        value: psa10?.value || "2,396",
        change: formatChange(psa10?.change || "+0.6%"),
        trend: psa10?.trend || getTrend(psa10?.change || "+0.6%"),
      },
      {
        label: "Modern 100",
        value: modern100?.value || "1,720",
        change: formatChange(modern100?.change || "-1.1%"),
        trend: modern100?.trend || getTrend(modern100?.change || "-1.1%"),
      },
      // {
      //   label: "Vintage 50 Index",
      //   value: vintage50?.value || moneyCompact(0),
      //   change: formatChange(vintage50?.change || "+0.00%"),
      //   trend: vintage50?.trend || "up",
      // },
    ].filter((item) => item.label !== "Vintage 50 Index" || item.value !== "$0")
  }, [initialData])

  const strokeDashoffset = 126 - (sentimentScore / 100) * 126
  const marketCapValue = statsCards[0]?.value || "$1.1B"
  const trackedCardsValue = statsCards[1]?.value || "35,051"

  return (
    <div className="space-y-6 md:space-y-8 pb-20">
      <header className="flex flex-col gap-2 pt-20 md:pt-8 md:pt-2 pb-2">
        <div className="flex items-center gap-2 text-[#00BA88]">
          <Activity className="h-4 w-4 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
            Market Intelligence
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Market Overview
        </h1>

        <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-sm md:text-lg leading-relaxed">
          Real-time view of the Pokémon card market: market cap, flagship indices, and what's trending.
        </p>
      </header>

      {/* STATS CARDS */}
      <div className="-mx-4 px-4 md:mx-0 md:px-0 overflow-x-auto scrollbar-hide">
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4 min-w-max md:min-w-0">
          {statsCards.map((item, i) => {
            const icons = [Wallet, Layers, Crown, BarChart3, Zap, Sparkles]
            const Icon = icons[i] || Activity

            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative w-[210px] mb-1 md:w-auto shrink-0 overflow-hidden rounded-2xl md:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 md:p-5 shadow-sm hover:shadow-md transition-all active:scale-95 lg:active:scale-100"
              >
                <div className="flex justify-between items-start mb-3">
                  <div
                    className={cn(
                      "h-8 w-8 rounded-xl flex items-center justify-center",
                      item.trend === "up"
                        ? "bg-emerald-50 dark:bg-emerald-500/10"
                        : "bg-red-50 dark:bg-red-500/10"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4",
                        item.trend === "up" ? "text-[#00BA88]" : "text-red-500"
                      )}
                    />
                  </div>

                  <span
                    className={cn(
                      "text-[10px] font-black px-2 py-1 rounded-full",
                      item.trend === "up"
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                        : "bg-red-50 text-red-600 dark:bg-red-500/20 dark:text-red-400"
                    )}
                  >
                    {item.change}
                  </span>
                </div>

                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate">
                  {item.label}
                </p>

                <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {item.value}
                </h3>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h3 className="font-bold text-slate-900 dark:text-white">Market Sentiment</h3>
            <Info className="h-4 w-4 text-slate-300" />
          </div>

          <div className="flex flex-col items-center">
            <div className="relative h-28 w-48 md:h-32 md:w-56">
              <svg viewBox="0 0 100 50" className="w-full">
                <path
                  d="M 10,50 A 40,40 0 0,1 90,50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  className="text-slate-100 dark:text-slate-800"
                />

                <motion.path
                  d="M 10,50 A 40,40 0 0,1 90,50"
                  fill="none"
                  stroke="#00BA88"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="126"
                  initial={{ strokeDashoffset: 126 }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>

              <div className="absolute inset-x-0 bottom-0 text-center translate-y-1 md:translate-y-2">
                <span className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-none">
                  {sentimentScore}
                </span>

                <p className="text-[10px] font-bold text-[#00BA88] uppercase tracking-widest mt-1">
                  {sentimentScore >= 80 ? "Hot" : sentimentScore >= 60 ? "Warm" : "Cool"}
                </p>
              </div>
            </div>

            <p className="mt-6 md:mt-8 text-[9px] md:text-[10px] text-center text-slate-400 font-medium px-4">
              Derived from breadth, volume surge, and volatility.
            </p>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Total Market Cap</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                Cap {marketCapValue} · Tracked {trackedCardsValue} cards
              </p>
            </div>

            <div className="w-full md:w-auto overflow-x-auto scrollbar-hide -mx-2 px-2 md:mx-0 md:px-0">
              <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
                {(["30D", "All"] as ChartTab[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setChartTab(t)}
                    className={cn(
                      "px-3 md:px-4 py-1.5 text-[9px] md:text-[10px] font-black rounded-lg transition-all whitespace-nowrap",
                      chartTab === t
                        ? "bg-[#00BA88] text-white shadow-md"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="h-40 md:h-48 w-full relative">
            <svg
              viewBox="0 0 1000 200"
              preserveAspectRatio="none"
              className="w-full h-full overflow-visible"
            >
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00BA88" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#00BA88" stopOpacity="0" />
                </linearGradient>
              </defs>

              {[40, 80, 120, 160].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="1000"
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-slate-100 dark:text-slate-800/50"
                  strokeDasharray="4 4"
                />
              ))}

              <motion.path
                d={CHART_DATA[chartTab].area}
                fill="url(#areaGradient)"
                animate={{ d: CHART_DATA[chartTab].area }}
                transition={{ duration: 0.6, ease: "circOut" }}
              />

              <motion.path
                d={CHART_DATA[chartTab].line}
                fill="none"
                stroke="#00BA88"
                strokeWidth="4"
                strokeLinecap="round"
                animate={{ d: CHART_DATA[chartTab].line }}
                transition={{ duration: 0.6, ease: "circOut" }}
              />
            </svg>

            <span className="absolute -bottom-2 right-0 text-[8px] font-bold text-slate-300 uppercase tracking-widest">
              CardMarketCap
            </span>
          </div>
        </div>
      </div>

      <TrendingCards cards={liveCards} loading={cardsLoading} />

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}