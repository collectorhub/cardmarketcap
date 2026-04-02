"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from "@/lib/utils"

// 1. DATA MAPPERS (Translates Japanese codes/Slugs to English)
const TYPE_MAP: Record<string, string> = {
  "\u901a\u5e38": "Common",
  "\u5e0c\u5c11": "Rare",
  "\u30ec\u30a2\u30db\u30ed": "Rare Holo",
  "\u975e": "Non-Holo",
};

// UPDATED: Now trusts the clean expansion name from the database
const formatSetLabel = (setName: string) => {
  if (!setName || setName === "Unknown Set") return "Unknown Set";
  return setName; 
};

export function MarketTable({ 
  initialCards = [], 
  totalRecords = 0, 
  totalPages = 0, 
  currentPage = 1 
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, [initialCards, currentPage]);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setIsLoading(true);
    router.push(`?page=${page}`, { scroll: false });
  };

  return (
    <div className="rounded-[1.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
      {/* HEADER */}
      <div className="p-5 md:p-8 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-4 w-1 bg-[#00BA88] rounded-full" />
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-sm">Card Overview</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isLoading ? "Fetching data..." : `Total Cards Indexed: ${totalRecords.toLocaleString()}`}
          </p>
      </div>

      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage + (isLoading ? "-loading" : "-ready")}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="overflow-x-auto scrollbar-hide"
          >
            <table className="w-full text-left border-collapse min-w-[1200px]">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-950/20 text-[10px] uppercase tracking-widest text-slate-400 font-black border-b border-slate-100 dark:border-slate-800">
                  <th className="p-4 w-12 text-center">#</th>
                  <th className="p-4 w-64">Card</th>
                  <th className="p-4">Set</th>
                  <th className="p-4">Type</th>
                  <th className="p-4 text-right">Price</th>
                  <th className="p-4 text-right">7D %</th>
                  <th className="p-4 text-right">30D %</th>
                  <th className="p-4 text-right">Market Cap</th>
                  <th className="p-4 text-right">Pop Report</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {!isLoading && initialCards.map((card, idx) => (
                  <tr key={card.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 text-[11px] font-bold text-slate-400 text-center">
                      {(currentPage - 1) * 50 + idx + 1}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-7 shrink-0 bg-slate-100 dark:bg-slate-800 rounded overflow-hidden">
                          <img src={card.imageUrl} className="h-full w-full object-cover" 
                               onError={(e) => { e.currentTarget.src = "https://images.pokemontcg.io/base1/4_hires.png"; }} />
                        </div>
                        <div className="min-w-0">
                          <div className="font-black text-slate-900 dark:text-white truncate">{card.name}</div>
                          <div className="text-[9px] font-bold text-slate-500 uppercase">PSA 10</div>
                        </div>
                      </div>
                    </td>
                    {/* UPDATED SET LABEL CELL */}
                    <td className="p-4 text-slate-500 font-medium text-[11px]">
                      {formatSetLabel(card.set)}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[8px] font-black text-slate-500 uppercase">
                        {TYPE_MAP[card.type] || card.type}
                      </span>
                    </td>
                    <td className="p-4 text-right font-black text-slate-900 dark:text-white">{card.price}</td>
                    <td className="p-4 text-right font-bold text-emerald-500 text-[11px]">+0.00%</td>
                    <td className="p-4 text-right font-bold text-emerald-500 text-[11px]">+0.00%</td>
                    <td className="p-4 text-right font-black text-slate-900 dark:text-white uppercase">{card.marketCap}</td>
                    <td className="p-4 text-right font-bold text-slate-500 text-[11px]">Total: {card.popTotal || 0}</td>
                    <td className="p-4 text-right">
                      <button className="cursor-pointer px-4 py-1.5 border border-[#00BA88]/50 hover:bg-[#00BA88] text-[#00BA88] hover:text-white rounded-lg text-[9px] font-black uppercase transition-all">Buy</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* FOOTER */}
      <div className="p-4 md:p-6 bg-slate-50/50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Page {currentPage} of {totalPages}</p>
        <div className="flex items-center gap-2">
          <button 
            disabled={currentPage === 1 || isLoading}
            onClick={() => goToPage(currentPage - 1)}
            className="cursor-pointer p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <div className="hidden md:flex gap-1">
             {[...Array(Math.min(5, totalPages))].map((_, i) => {
               let pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
               if (pageNum > totalPages) return null;
               return (
                <button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  className={cn(
                    "h-8 w-8 rounded-lg text-[10px] font-black transition-all cursor-pointer",
                    currentPage === pageNum ? "bg-[#00BA88] text-white shadow-lg shadow-emerald-500/20" : "text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  {pageNum}
                </button>
               )
             })}
          </div>

          <button 
            disabled={currentPage === totalPages || isLoading}
            onClick={() => goToPage(currentPage + 1)}
            className="cursor-pointer p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}