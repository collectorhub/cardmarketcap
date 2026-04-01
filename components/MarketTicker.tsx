"use client"

import React from 'react'
import { cn } from "@/lib/utils"

const TICKER_DATA = [
  { label: "GAS", value: "12 Gwei" },
  { label: "SENTIMENT", value: "GREED (72)", color: "text-emerald-500 dark:text-[#00BA88]" },
  { label: "VOLATILITY", value: "LOW" },
  { label: "TOP GAINER", value: "Mewtwo VSTAR (+12.4%)", color: "text-emerald-500 dark:text-[#00BA88]" },
  { label: "MARKET CAP", value: "$2.34T" },
  { label: "PSA 10 POP", value: "5.43K", color: "text-blue-500" },
]

export function MarketTicker() {
  return (
    <div className="group relative w-full overflow-hidden border-b border-slate-200 bg-white py-2.5 select-none dark:border-slate-800/50 dark:bg-[#020617]">
      
      {/* PROFESSIONAL GRADIENT MASK */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white via-white/50 to-transparent dark:from-[#020617] dark:via-[#020617]/50" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white via-white/50 to-transparent dark:from-[#020617] dark:via-[#020617]/50" />

      <div className="flex w-max animate-marquee py-1 group-hover:[animation-play-state:paused]">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex shrink-0 items-center gap-12 px-6">
            {TICKER_DATA.map((item, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-2 transition-opacity hover:opacity-70"
              >
                {/* Dot Separator for a "Bloomberg" vibe */}
                <div className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                  {item.label}
                </span>
                
                <span className={cn(
                  "font-mono text-[10px] font-black tracking-tight",
                  item.color || "text-slate-900 dark:text-slate-200"
                )}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}