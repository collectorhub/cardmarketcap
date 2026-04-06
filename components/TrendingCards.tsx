"use client"

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, ArrowUp, ArrowDown, Inbox, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from "@/lib/utils"

export interface Card {
  id: number;
  name: string;
  set: string;
  price: string;
  h24: string;
  score: number;
  type?: string;
  grade?: string;
  image: string;
}

interface TrendingCardsProps {
  cards: Card[];
  itemsPerPage?: number;
}

export function TrendingCards({ cards = [], itemsPerPage = 8 }: TrendingCardsProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredCards = useMemo(() => {
    return cards.filter(card => {
      if (activeTab === 'All') return true
      if (activeTab === 'PSA 10') return card.grade?.toUpperCase() === 'PSA 10'
      if (activeTab === 'Raw') return card.grade?.toUpperCase() === 'RAW'
      if (activeTab === 'Vintage') return card.type?.toLowerCase() === 'vintage'
      if (activeTab === 'Modern') return card.type?.toLowerCase() === 'modern'
      return true
    })
  }, [cards, activeTab])

  const totalPages = Math.ceil(filteredCards.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCards = filteredCards.slice(startIndex, startIndex + itemsPerPage)

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  // NAVIGATION HANDLER - Updated to ensure string consistency
  const handleCardClick = (id: number) => {
    // If your folder is app/cards/[id], change this to /cards/
    router.push(`/card/${id}`)
  }

  return (
    <div className="rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
      <div className="p-5 md:p-8 border-b border-slate-100 dark:border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Flame className="h-4 w-4 text-orange-500 fill-orange-500" />
              <h3 className="font-bold text-slate-900 dark:text-white">Trending Cards</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Highest attention • price movement across marketplaces.</p>
          </div>
          
          <div className="overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
            <div className="flex gap-2 p-1 bg-slate-50 dark:bg-slate-800/50 rounded-2xl w-fit relative">
              {['All', 'PSA 10', 'Raw', 'Vintage', 'Modern'].map((tab) => (
                <button 
                  key={tab} 
                  onClick={() => handleTabChange(tab)}
                  className={cn(
                    "relative px-4 py-1.5 text-[10px] font-black rounded-xl transition-colors z-10 whitespace-nowrap",
                    activeTab === tab ? "text-white" : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                  )}
                >
                  {activeTab === tab && (
                    <motion.div 
                      layoutId="activePill" 
                      className="absolute inset-0 bg-[#00BA88] rounded-xl shadow-md"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10">{tab}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative min-h-[400px]">
        <AnimatePresence mode="wait">
          {paginatedCards.length > 0 ? (
            <motion.div
              key={`${activeTab}-${currentPage}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="md:hidden flex flex-col divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedCards.map((card) => (
                  <div 
                    key={card.id} 
                    onClick={() => handleCardClick(card.id)}
                    className="p-4 flex items-center gap-4 active:bg-slate-50 dark:active:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <div className="h-16 w-12 shrink-0 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                      <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate pr-2 group-hover:text-[#00BA88]">{card.name}</p>
                        <span className="text-sm font-black text-slate-900 dark:text-white">{card.price}</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded text-[9px] font-black uppercase">
                            {card.grade || 'RAW'}
                          </span>
                          <div className={cn("flex items-center gap-0.5 text-[10px] font-black", card.h24.startsWith('-') ? "text-red-500" : "text-emerald-500")}>
                            {card.h24.startsWith('-') ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />} {card.h24}%
                          </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse table-fixed">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-950/20 text-[10px] uppercase tracking-widest text-slate-400 font-black border-b border-slate-100 dark:border-slate-800">
                      <th className="px-8 py-4 w-[40%]">Card</th>
                      <th className="px-6 py-4">Grade</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">24h %</th>
                      <th className="px-6 py-4 text-center">Trend Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {paginatedCards.map((card) => (
                      <tr 
                        key={card.id} 
                        onClick={() => handleCardClick(card.id)}
                        className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4 truncate">
                            <div className="h-12 w-9 shrink-0 rounded-md bg-slate-100 overflow-hidden border border-slate-200">
                               <img src={card.image} alt={card.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                            </div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#00BA88] transition-colors truncate">{card.name}</p>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-[10px] font-black uppercase">
                            {card.grade || 'RAW'}
                          </span>
                        </td>
                        <td className="px-6 py-5 font-black text-slate-900 dark:text-white">{card.price}</td>
                        <td className="px-6 py-5">
                          <div className={cn("flex items-center gap-1 text-[11px] font-black", card.h24.startsWith('-') ? "text-red-500" : "text-emerald-500")}>
                            {card.h24}%
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center justify-center gap-2">
                             <span className="text-xs font-black text-slate-900 dark:text-white">{card.score}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ) : (
            <motion.div key="empty" className="flex flex-col items-center justify-center py-32 text-slate-400">
              <Inbox className="h-12 w-12 mb-4 opacity-20" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em]">No cards found in {activeTab}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="p-4 md:p-6 bg-slate-50/50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredCards.length)} of {filteredCards.length}
        </p>
        
        <div className="flex items-center gap-2">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-30 transition-all"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <div className="flex gap-1">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={cn(
                  "h-8 w-8 rounded-lg text-[10px] font-black transition-all",
                  currentPage === i + 1 
                    ? "bg-[#00BA88] text-white shadow-lg shadow-emerald-500/20" 
                    : "text-slate-400 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button 
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(prev => prev + 1)} // FIXED: was prev - 1
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-30 transition-all"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}