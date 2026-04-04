"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import { cn } from "@/lib/utils"

const FILTER_OPTIONS = ["Top", "Trending", "Gainers", "Lossers"];
const SUBCAT_OPTIONS = ["All", "Modern", "Japanese", "Promos", "Common", "Sealed"];
const GRADE_OPTIONS = ["PSA 10", "PSA 9", "PSA 8", "PSA 7", "PSA 6", "PSA 5"];

const TableSkeleton = () => (
  <>
    {[...Array(8)].map((_, i) => (
      <tr key={i} className="animate-pulse border-b border-slate-100 dark:border-slate-800">
        <td className="p-3 md:p-5"><div className="h-3 w-3 bg-slate-100 dark:bg-slate-800 rounded mx-auto" /></td>
        <td className="p-3 md:p-5">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="h-8 w-6 md:h-10 md:w-7 bg-slate-100 dark:bg-slate-800 rounded shadow-sm" />
            <div className="space-y-1">
              <div className="h-2 w-20 md:h-3 md:w-32 bg-slate-100 dark:bg-slate-800 rounded" />
              <div className="h-1.5 w-10 md:h-2 md:w-16 bg-slate-100 dark:bg-slate-800 rounded" />
            </div>
          </div>
        </td>
        <td className="p-3 md:p-5"><div className="h-3 w-16 bg-slate-100 dark:bg-slate-800 rounded" /></td>
        <td className="p-3 md:p-5"><div className="h-3 w-12 bg-slate-100 dark:bg-slate-800 rounded ml-auto" /></td>
        <td className="p-3 md:p-5"><div className="h-3 w-8 bg-slate-100 dark:bg-slate-800 rounded ml-auto" /></td>
        <td className="p-3 md:p-5"><div className="h-3 w-8 bg-slate-100 dark:bg-slate-800 rounded ml-auto" /></td>
        <td className="p-3 md:p-5"><div className="h-3 w-16 bg-slate-100 dark:bg-slate-800 rounded ml-auto" /></td>
        <td className="p-3 md:p-5"><div className="h-3 w-14 bg-slate-100 dark:bg-slate-800 rounded ml-auto" /></td>
        <td className="p-3 md:p-5"><div className="h-3 w-12 bg-slate-100 dark:bg-slate-800 rounded ml-auto" /></td>
        <td className="p-3 md:p-5"><div className="h-6 w-12 md:h-8 md:w-20 bg-slate-100 dark:bg-slate-800 rounded mx-auto" /></td>
      </tr>
    ))}
  </>
);

export function MarketTable({ initialCards = [], totalRecords = 0, totalPages = 0, currentPage = 1 }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const currentFilter = searchParams.get('sort') || 'Top';
  const currentSubcat = searchParams.get('category') || 'All';
  const currentGrade = searchParams.get('grade') || 'PSA 10';

  useEffect(() => { setIsLoading(false); }, [initialCards, currentPage, searchParams]);

  const updateParams = (key: string, val: string | number) => {
    setIsLoading(true);
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, val.toString().toLowerCase());
    if (key !== 'page') params.set('page', '1'); 
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="max-w-[1600px] mx-auto py-4 md:py-8 space-y-4 md:space-y-6">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-1">
        <div>
          <h2 className="text-[10px] md:text-sm font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white mb-1">Card Overview</h2>
          <p className="text-[7px] md:text-[10px] text-slate-500 font-bold uppercase tracking-wider opacity-70 leading-tight">
            Check card's rank, price, % moves, population, market cap, and sales.
          </p>
        </div>
        
        <div className="flex items-center gap-1.5 md:gap-2">
          {[
            { key: 'sort', val: currentFilter, opts: FILTER_OPTIONS },
            { key: 'category', val: currentSubcat, opts: SUBCAT_OPTIONS },
            { key: 'grade', val: currentGrade, opts: GRADE_OPTIONS }
          ].map((dropdown) => (
            <div key={dropdown.key} className="relative group flex-1 md:flex-none">
              <select 
                value={dropdown.val.charAt(0).toUpperCase() + dropdown.val.slice(1).replace('psa', 'PSA')}
                onChange={(e) => updateParams(dropdown.key, e.target.value)}
                className="w-full appearance-none bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-2 md:px-4 py-1.5 md:py-2.5 rounded-lg md:rounded-xl text-[8px] md:text-[11px] font-black text-slate-700 dark:text-slate-200 pr-6 md:pr-10 outline-none transition-all cursor-pointer hover:border-[#00BA88]"
              >
                {dropdown.opts.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              <ChevronDown size={10} className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#00BA88]" />
            </div>
          ))}
        </div>
      </div>

      {/* 2. TABLE CONTAINER */}
      <div className="rounded-xl md:rounded-[1.5rem] bg-white dark:bg-slate-900 overflow-hidden border border-slate-100 dark:border-slate-800">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-950/20 text-[7px] md:text-[10px] uppercase font-black text-slate-400 tracking-widest border-b border-slate-100 dark:border-slate-800">
                <th className="p-3 md:p-5 w-8 md:w-12 text-center">#</th>
                <th className="p-3 md:p-5">Card</th>
                {/* Fixed width header for Set on mobile */}
                <th className="p-3 md:p-5 w-[100px] md:w-auto">Set</th>
                <th className="p-3 md:p-5 text-right">Price ({currentGrade.toUpperCase()})</th>
                <th className="p-3 md:p-5 text-right">7D %</th>
                <th className="p-3 md:p-5 text-right">30D %</th>
                <th className="p-3 md:p-5 text-right">Market Cap</th>
                <th className="p-3 md:p-5 text-right">Pop Report</th>
                <th className="p-3 md:p-5 text-right whitespace-nowrap">90D Sales</th>
                <th className="p-3 md:p-5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                <TableSkeleton />
              ) : (
                <AnimatePresence mode="wait">
                  {initialCards.map((card, idx) => (
                    <motion.tr 
                      key={card.id}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="p-3 md:p-5 text-[8px] md:text-[11px] font-bold text-slate-400 text-center">
                        {(currentPage - 1) * 50 + idx + 1}
                      </td>

                      <td className="p-3 md:p-5">
                        <div className="flex items-center gap-2 md:gap-4">
                          <div className="h-8 w-6 md:h-10 md:w-7 shrink-0 bg-slate-100 dark:bg-slate-800 rounded overflow-hidden shadow-sm">
                            <img 
                              src={card.imageUrl} 
                              className="h-full w-full object-cover" 
                              onError={(e) => { e.currentTarget.src = "https://pokecollectorhub.com/assets/placeholder.png"; }} 
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="font-black text-slate-900 dark:text-white text-[9px] md:text-[13px] truncate leading-tight">{card.name}</div>
                            <div className="text-[7px] md:text-[9px] font-black text-[#00BA88] uppercase tracking-wider">
                              {card.type}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Narrow set column tweak applied here */}
                      <td className="p-3 md:p-5 text-slate-500 font-bold text-[8px] md:text-[10px] uppercase truncate max-w-[60px] md:max-w-[150px]">
                        {card.set}
                      </td>

                      <td className="p-3 md:p-5 text-right font-black text-slate-900 dark:text-white text-[9px] md:text-[13px]">
                        {card.price}
                        <div className="text-[6px] md:text-[8px] text-slate-400 font-bold mt-0.5 uppercase tracking-tighter">Avg: $0.00</div>
                      </td>

                      <td className="p-3 md:p-5 text-right font-bold text-emerald-500 text-[8px] md:text-[11px]">+0.00%</td>
                      <td className="p-3 md:p-5 text-right font-bold text-emerald-500 text-[8px] md:text-[11px]">+0.00%</td>
                      
                      <td className="p-3 md:p-5 text-right font-black text-slate-900 dark:text-white text-[9px] md:text-[13px] uppercase">
                        {card.marketCap}
                      </td>

                      <td className="p-3 md:p-5 text-right">
                        <div className="text-[8px] md:text-[11px] font-black text-slate-700 dark:text-slate-200">{card.gradeCount}</div>
                        <div className="text-[6px] md:text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Total: {card.popTotal}</div>
                      </td>

                      <td className="p-3 md:p-5 text-right text-[8px] md:text-[11px] font-bold text-slate-400 whitespace-nowrap">
                        {card.sales90d} sales
                      </td>

                      <td className="p-3 md:p-5 text-center">
                        <button className="mx-auto px-3 md:px-6 py-1.5 md:py-2 border-2 border-[#00BA88] text-[#00BA88] hover:bg-[#00BA88] hover:text-white rounded-lg md:rounded-xl text-[7px] md:text-[10px] font-black uppercase transition-all">
                          Buy
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>

        {/* 3. PAGINATION */}
        <div className="p-3 md:p-5 bg-slate-50/50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <p className="text-[7px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Page {currentPage} / {totalPages}</p>
          <div className="flex items-center gap-1.5 md:gap-2">
            <button 
              disabled={currentPage === 1 || isLoading}
              onClick={() => updateParams('page', currentPage - 1)}
              className="cursor-pointer p-1 md:p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-30 transition-all"
            >
              <ChevronLeft className="h-3 w-3 md:h-4 md:w-4" />
            </button>
            <div className="hidden md:flex gap-1">
               {[...Array(Math.min(5, totalPages))].map((_, i) => {
                 let pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                 if (pageNum > totalPages) return null;
                 return (
                  <button
                    key={pageNum}
                    onClick={() => updateParams('page', pageNum)}
                    className={cn(
                      "h-8 w-8 rounded-lg text-[10px] font-black transition-all cursor-pointer",
                      currentPage === pageNum ? "bg-[#00BA88] text-white" : "text-slate-400 hover:text-slate-900"
                    )}
                  >
                    {pageNum}
                  </button>
                 )
               })}
            </div>
            <button 
              disabled={currentPage === totalPages || isLoading}
              onClick={() => updateParams('page', currentPage + 1)}
              className="cursor-pointer p-1 md:p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-30 transition-all"
            >
              <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* 4. FOOTER STATS */}
      <div className="flex items-center gap-4 px-1 text-[7px] md:text-[10px] font-black uppercase text-slate-400 tracking-widest">
        <div className="flex items-center gap-1">
          <span>Total Records:</span>
          <span className="text-slate-900 dark:text-white font-black">{totalRecords.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-800 pl-4">
          <span>Current Grade:</span>
          <span className="text-[#00BA88] font-black">{currentGrade.toUpperCase()}</span>
        </div>
      </div>
    </div>
  )
}