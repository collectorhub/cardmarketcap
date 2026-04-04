"use client"

import React from 'react'
import { cn } from "@/lib/utils"

interface MarketTickerProps {
  totalCards: number;
  psa10Pop: string;
  volume30d: string;
}

export function MarketTicker({ totalCards, psa10Pop, volume30d }: MarketTickerProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[40] border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto px-4 h-10 flex items-center justify-between overflow-x-auto no-scrollbar">
        {/* Real Data Section */}
        <div className="flex items-center gap-6 md:gap-10 whitespace-nowrap">
          <div className="flex items-center gap-2">
            <span className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-medium">Total graded cards:</span>
            <span className="text-[10px] md:text-xs text-slate-900 dark:text-white font-black">
              {(totalCards / 1000).toFixed(2)}K
            </span>
          </div>
          
          <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-6 md:pl-10">
            <span className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-medium">PSA 10 population:</span>
            <span className="text-[10px] md:text-xs text-slate-900 dark:text-white font-black">
              {psa10Pop}
            </span>
          </div>

          <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-6 md:pl-10">
            <span className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-medium">Tracked 30d volume:</span>
            <span className="text-[10px] md:text-xs text-slate-[#00BA88] font-black">
              {volume30d}
            </span>
          </div>
        </div>

        {/* Status / Source Section */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex items-center gap-2">
             <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">Data source:</span>
             <span className="text-[10px] text-slate-600 dark:text-slate-300 font-bold uppercase">PSA Pop + Sales</span>
          </div>
          
          {/* Language/Currency Selectors matching UI */}
          <div className="flex items-center gap-1 ml-4">
             <div className="px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-[9px] font-black uppercase text-slate-500 cursor-default">English</div>
             <div className="px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-[9px] font-black uppercase text-slate-500 cursor-default">USD</div>
          </div>
        </div>
      </div>
    </div>
  )
}