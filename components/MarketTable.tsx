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
        <td className="p-5"><div className="h-4 w-4 bg-slate-100 dark:bg-slate-800 rounded mx-auto" /></td>
        <td className="p-5">
          <div className="flex items-center gap-4">
            <div className="h-10 w-7 bg-slate-100 dark:bg-slate-800 rounded shadow-sm" />
            <div className="space-y-2">
              <div className="h-3 w-32 bg-slate-100 dark:bg-slate-800 rounded" />
              <div className="h-2 w-16 bg-slate-100 dark:bg-slate-800 rounded" />
            </div>
          </div>
        </td>
        <td className="p-5"><div className="h-3 w-24 bg-slate-100 dark:bg-slate-800 rounded" /></td>
        <td className="p-5"><div className="h-4 w-16 bg-slate-100 dark:bg-slate-800 rounded ml-auto" /></td>
        <td className="p-5"><div className="h-3 w-12 bg-slate-100 dark:bg-slate-800 rounded ml-auto" /></td>
        <td className="p-5"><div className="h-3 w-12 bg-slate-100 dark:bg-slate-800 rounded ml-auto" /></td>
        <td className="p-5"><div className="h-4 w-20 bg-slate-100 dark:bg-slate-800 rounded ml-auto" /></td>
        <td className="p-5"><div className="h-3 w-16 bg-slate-100 dark:bg-slate-800 rounded ml-auto" /></td>
        <td className="p-5"><div className="h-3 w-12 bg-slate-100 dark:bg-slate-800 rounded ml-auto" /></td>
        <td className="p-5"><div className="h-8 w-20 bg-slate-100 dark:bg-slate-800 rounded mx-auto" /></td>
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
    <div className="max-w-[1600px] mx-auto py-8 space-y-6">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white mb-1">Card Overview</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider opacity-70">
            Check card's rank, price, % moves, population, market cap, and sales.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {[
            { key: 'sort', val: currentFilter, opts: FILTER_OPTIONS },
            { key: 'category', val: currentSubcat, opts: SUBCAT_OPTIONS },
            { key: 'grade', val: currentGrade, opts: GRADE_OPTIONS }
          ].map((dropdown) => (
            <div key={dropdown.key} className="relative group">
              <select 
                value={dropdown.val.charAt(0).toUpperCase() + dropdown.val.slice(1).replace('psa', 'PSA')}
                onChange={(e) => updateParams(dropdown.key, e.target.value)}
                className="appearance-none bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-xl text-[11px] font-black text-slate-700 dark:text-slate-200 pr-10 outline-none transition-all cursor-pointer hover:border-[#00BA88] focus:ring-2 focus:ring-[#00BA88]/20"
              >
                {dropdown.opts.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#00BA88] transition-colors" />
            </div>
          ))}
        </div>
      </div>

      {/* 2. TABLE CONTAINER */}
      <div className="rounded-[1.5rem] bg-white dark:bg-slate-900 overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-950/20 text-[10px] uppercase font-black text-slate-400 tracking-widest border-b border-slate-100 dark:border-slate-800">
                <th className="p-5 w-12 text-center">#</th>
                <th className="p-5">Card</th>
                <th className="p-5">Set</th>
                <th className="p-5 text-right">Price ({currentGrade.toUpperCase()})</th>
                <th className="p-5 text-right">7D %</th>
                <th className="p-5 text-right">30D %</th>
                <th className="p-5 text-right">Market Cap</th>
                <th className="p-5 text-right">Pop Report</th>
                <th className="p-5 text-right">90D Sales</th>
                <th className="p-5 text-center">Action</th>
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
                      initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                      className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="p-5 text-[11px] font-bold text-slate-400 text-center">
                        {(currentPage - 1) * 50 + idx + 1}
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-7 shrink-0 bg-slate-100 dark:bg-slate-800 rounded overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                            <img 
                              src={card.imageUrl} 
                              className="h-full w-full object-cover" 
                              onError={(e) => { e.currentTarget.src = "https://pokecollectorhub.com/assets/placeholder.png"; }} 
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="font-black text-slate-900 dark:text-white text-[13px] truncate">{card.name}</div>
                            <div className="text-[9px] font-black text-[#00BA88] uppercase tracking-wider">
                              {card.type}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-5 text-slate-500 font-bold text-[10px] uppercase truncate max-w-[150px]">
                        {card.set}
                      </td>
                      <td className="p-5 text-right font-black text-slate-900 dark:text-white text-[13px]">
                        {card.price}
                        <div className="text-[8px] text-slate-400 font-bold mt-0.5 uppercase tracking-tighter">Avg: $0.00</div>
                      </td>
                      <td className="p-5 text-right font-bold text-emerald-500 text-[11px]">+0.00%</td>
                      <td className="p-5 text-right font-bold text-emerald-500 text-[11px]">+0.00%</td>
                      <td className="p-5 text-right font-black text-slate-900 dark:text-white text-[13px] uppercase">{card.marketCap}</td>
                      <td className="p-5 text-right">
                        <div className="text-[11px] font-black text-slate-700 dark:text-slate-200">{card.gradeCount}</div>
                        <div className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Total: {card.popTotal}</div>
                      </td>
                      <td className="p-5 text-right text-[11px] font-bold text-slate-400 whitespace-nowrap">{card.sales90d} sales</td>
                      <td className="p-5 text-center">
                        <button className="mx-auto px-6 py-2 border-2 border-[#00BA88] text-[#00BA88] hover:bg-[#00BA88] hover:text-white rounded-xl text-[10px] font-black uppercase transition-all active:scale-95">
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
        <div className="p-5 bg-slate-50/50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Page {currentPage} of {totalPages}</p>
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1 || isLoading}
              onClick={() => updateParams('page', currentPage - 1)}
              className="cursor-pointer p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-30 transition-all"
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
                    onClick={() => updateParams('page', pageNum)}
                    className={cn(
                      "h-9 w-9 rounded-xl text-[11px] font-black transition-all cursor-pointer",
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
              onClick={() => updateParams('page', currentPage + 1)}
              className="cursor-pointer p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-30 transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* 4. FOOTER STATS */}
      <div className="flex flex-wrap items-center gap-6 px-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">
        <div className="flex items-center gap-2">
          <span>Total Records:</span>
          <span className="text-slate-900 dark:text-white font-black">{totalRecords.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-6">
          <span>Current Grade:</span>
          <span className="text-[#00BA88] font-black">{currentGrade.toUpperCase()}</span>
        </div>
      </div>
    </div>
  )
}