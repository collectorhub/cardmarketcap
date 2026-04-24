"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, TrendingDown, Info, Activity 
} from 'lucide-react'
import { cn } from "@/lib/utils"
import { TrendingCards } from "./TrendingCards"

// Define the Card interface to match your fetchTrendingCards output
interface Card {
  id: number;
  name: string;
  set: string;
  price: string;
  h24: string;
  score: number;
  type: string;
  grade: string;
  image: string;
}

interface MarketStat {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
}

interface MarketOverviewProps {
  initialData: MarketStat[];
  sentimentScore?: number;
  cards: Card[]; // Add the cards prop here
}

const CHART_DATA = {
  'Overview': {
    line: "M0,140 C100,130 200,160 300,120 C400,80 500,110 600,70 C700,30 800,50 1000,20",
    area: "M0,140 C100,130 200,160 300,120 C400,80 500,110 600,70 C700,30 800,50 1000,20 L1000,200 L0,200 Z"
  },
  'Breakdown': {
    line: "M0,100 C150,120 300,40 450,80 C600,120 750,20 1000,60",
    area: "M0,100 C150,120 300,40 450,80 C600,120 750,20 1000,60 L1000,200 L0,200 Z"
  },
  '24h': {
    line: "M0,160 C200,150 400,170 600,140 C800,110 900,120 1000,90",
    area: "M0,160 C200,150 400,170 600,140 C800,110 900,120 1000,90 L1000,200 L0,200 Z"
  },
  '7d': {
    line: "M0,40 C250,60 500,20 750,80 1000,40",
    area: "M0,40 C250,60 500,20 750,80 1000,40 L1000,200 L0,200 Z"
  },
  'All': {
    line: "M0,180 C200,160 400,120 600,80 C800,40 900,30 1000,10",
    area: "M0,180 C200,160 400,120 600,80 C800,40 900,30 1000,10 L1000,200 L0,200 Z"
  }
}

export function MarketOverview({ initialData, sentimentScore = 66, cards = [] }: MarketOverviewProps) {
  const [chartTab, setChartTab] = useState('Overview')

  // Calculate gauge offset based on score (0-100)
  // Circumference of semi-circle is ~126
  const strokeDashoffset = 126 - (sentimentScore / 100) * 126;

  return (
    <div className="space-y-8 md:space-y-12 pb-20">
      {/* HEADER */}
      <header className="flex flex-col gap-2 pt-15 md:pt-6">
        <div className="flex items-center gap-2 text-[#00BA88]">
          <Activity className="h-4 w-4 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Market Intelligence</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Market Overview
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-sm md:text-lg leading-relaxed">
          Real-time view of the Pokémon card market: market cap, flagship indices, and what's trending.
        </p>
      </header>

      {/* STATS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
        {initialData.map((index, i) => (
          <motion.div
            key={index.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="group relative overflow-hidden rounded-2xl md:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 md:p-5 shadow-sm hover:shadow-md transition-all active:scale-95 lg:active:scale-100"
          >
            <div className="flex justify-between items-start mb-2 md:mb-3">
              <div className={cn(
                "h-7 w-7 md:h-8 md:w-8 rounded-lg md:rounded-xl flex items-center justify-center", 
                index.trend === 'up' ? "bg-emerald-50 dark:bg-emerald-500/10" : "bg-red-50 dark:bg-red-500/10"
              )}>
                {index.trend === 'up' ? <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-[#00BA88]" /> : <TrendingDown className="h-3 w-3 md:h-4 md:w-4 text-red-500" />}
              </div>
              <span className={cn(
                "text-[9px] md:text-[10px] font-black px-2 py-0.5 rounded-full", 
                index.trend === 'up' ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400" : "bg-red-50 text-red-600 dark:bg-red-500/20 dark:text-red-400"
              )}>
                {index.change}
              </span>
            </div>
            <p className="text-[9px] md:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate">{index.label}</p>
            <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white mt-0.5">{index.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SENTIMENT */}
        <div className="rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h3 className="font-bold text-slate-900 dark:text-white">Market Sentiment</h3>
            <Info className="h-4 w-4 text-slate-300" />
          </div>
          <div className="flex flex-col items-center">
            <div className="relative h-28 w-48 md:h-32 md:w-56">
              <svg viewBox="0 0 100 50" className="w-full">
                <path d="M 10,50 A 40,40 0 0,1 90,50" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" className="text-slate-100 dark:text-slate-800" />
                <motion.path 
                  d="M 10,50 A 40,40 0 0,1 90,50" fill="none" stroke="#00BA88" strokeWidth="8" strokeLinecap="round" strokeDasharray="126"
                  initial={{ strokeDashoffset: 126 }} 
                  animate={{ strokeDashoffset }} 
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-x-0 bottom-0 text-center translate-y-1 md:translate-y-2">
                <span className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-none">{sentimentScore}</span>
                <p className="text-[10px] font-bold text-[#00BA88] uppercase tracking-widest mt-1">
                  {sentimentScore > 60 ? 'Warm' : sentimentScore > 80 ? 'Hot' : 'Cool'}
                </p>
              </div>
            </div>
            <p className="mt-6 md:mt-8 text-[9px] md:text-[10px] text-center text-slate-400 font-medium px-4">Derived from breadth, volume surge, and volatility.</p>
          </div>
        </div>

        {/* MARKET CAP HISTORY */}
        <div className="lg:col-span-2 rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Total Market Cap</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                Cap {initialData[0]?.value || '$0'} · Volume $42.83M
              </p>
            </div>
            
            <div className="w-full md:w-auto overflow-x-auto scrollbar-hide -mx-2 px-2 md:mx-0 md:px-0">
              <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
                 {['Overview', 'Breakdown', '24h', '7d', 'All'].map(t => (
                   <button 
                    key={t} 
                    onClick={() => setChartTab(t)}
                    className={cn(
                      "px-3 md:px-4 py-1.5 text-[9px] md:text-[10px] font-black rounded-lg transition-all whitespace-nowrap", 
                      chartTab === t ? "bg-[#00BA88] text-white shadow-md" : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                    )}
                   >
                     {t}
                   </button>
                 ))}
              </div>
            </div>
          </div>

          <div className="h-40 md:h-48 w-full relative">
            <svg viewBox="0 0 1000 200" preserveAspectRatio="none" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00BA88" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#00BA88" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {[40, 80, 120, 160].map((y) => (
                <line key={y} x1="0" y1={y} x2="1000" y2={y} stroke="currentColor" strokeWidth="1" className="text-slate-100 dark:text-slate-800/50" strokeDasharray="4 4" />
              ))}

              <motion.path
                d={CHART_DATA[chartTab as keyof typeof CHART_DATA].area}
                fill="url(#areaGradient)"
                animate={{ d: CHART_DATA[chartTab as keyof typeof CHART_DATA].area }}
                transition={{ duration: 0.6, ease: "circOut" }}
              />
              
              <motion.path
                d={CHART_DATA[chartTab as keyof typeof CHART_DATA].line}
                fill="none"
                stroke="#00BA88"
                strokeWidth="4"
                strokeLinecap="round"
                animate={{ d: CHART_DATA[chartTab as keyof typeof CHART_DATA].line }}
                transition={{ duration: 0.6, ease: "circOut" }}
              />
            </svg>
            <span className="absolute -bottom-2 right-0 text-[8px] font-bold text-slate-300 uppercase tracking-widest">CardMarketCap</span>
          </div>
        </div>
      </div>

      {/* TRENDING CARDS SECTION */}
      <TrendingCards cards={cards} />
    </div>
  )
}