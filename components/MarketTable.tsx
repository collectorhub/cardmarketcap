"use client"

import React, { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, ChevronDown, Check, Search, X, Inbox } from 'lucide-react'
import { cn } from "@/lib/utils"

const FILTER_OPTIONS = ["Top", "Trending", "Gainers", "Lossers"];
const SUBCAT_OPTIONS = ["All", "Modern", "Japanese", "Promos", "Common", "Sealed"];
const GRADE_OPTIONS = ["PSA 10", "PSA 9", "PSA 8", "PSA 7", "PSA 6", "PSA 5"];

// --- CUSTOM DROPDOWN COMPONENT ---
const CustomDropdown = ({ label, value, options, onChange }: { label: string, value: string, options: string[], onChange: (val: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex-1 md:w-40" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between gap-2 bg-slate-50 dark:bg-slate-950 border px-3 md:px-4 py-2 md:py-2.5 rounded-lg md:rounded-xl transition-all duration-200",
          isOpen ? "border-[#00BA88] ring-1 ring-[#00BA88]/20" : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
        )}
      >
        <span className="text-[12px] md:text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight truncate">
          {value.replace('psa', 'PSA')}
        </span>
        <ChevronDown size={14} className={cn("text-slate-400 transition-transform duration-200", isOpen && "rotate-180 text-[#00BA88]")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            className="absolute z-[100] mt-1.5 w-full min-w-[140px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden"
          >
            <div className="p-1 max-h-[240px] overflow-y-auto scrollbar-hide">
              {options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 text-[12px] md:text-xs font-bold rounded-lg transition-colors",
                    value.toLowerCase() === opt.toLowerCase() 
                      ? "bg-[#00BA88]/10 text-[#00BA88]" 
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                >
                  {opt}
                  {value.toLowerCase() === opt.toLowerCase() && <Check size={12} strokeWidth={3} />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TableSkeleton = () => (
  <>
    {[...Array(8)].map((_, i) => (
      <tr key={i} className="animate-pulse border-b border-slate-100 dark:border-slate-800">
        <td className="p-3 md:p-5"><div className="h-3 w-3 bg-slate-100 dark:bg-slate-800 rounded mx-auto" /></td>
        <td className="p-3 md:p-5">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="h-10 w-7 md:h-12 md:w-9 bg-slate-100 dark:bg-slate-800 rounded shadow-sm" />
            <div className="space-y-1">
              <div className="h-3 w-24 md:h-4 md:w-40 bg-slate-100 dark:bg-slate-800 rounded" />
              <div className="h-2 w-12 md:h-2.5 md:w-20 bg-slate-100 dark:bg-slate-800 rounded" />
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
        <td className="p-3 md:p-5"><div className="h-8 w-14 md:h-10 md:w-24 bg-slate-100 dark:bg-slate-800 rounded mx-auto" /></td>
      </tr>
    ))}
  </>
);

export function MarketTable({ initialCards = [], totalRecords = 0, totalPages = 0, currentPage = 1 }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const currentFilter = searchParams.get('sort') || 'Top';
  const currentSubcat = searchParams.get('category') || 'All';
  const currentGrade = searchParams.get('grade') || 'PSA 10';

  // Listen for prop changes to stop loading
  useEffect(() => { setIsLoading(false); }, [initialCards, currentPage, searchParams]);

  const updateParams = (key: string, val: string | number) => {
    setIsLoading(true);
    const params = new URLSearchParams(searchParams.toString());
    if (val === '') {
      params.delete(key);
    } else {
      params.set(key, val.toString().toLowerCase());
    }
    if (key !== 'page') params.set('page', '1'); 
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams('q', searchQuery);
  };

  // Helper to clear search
  const clearSearch = () => {
    setSearchQuery('');
    updateParams('q', '');
  };

  return (
    <div className="max-w-[1600px] mx-auto py-4 md:py-8 space-y-4 md:space-y-6">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-1">
        <div>
          <h2 className="text-[14px] md:text-base font-black uppercase tracking-[0.1em] text-slate-900 dark:text-white mb-1">Card Overview</h2>
          <p className="text-[11px] md:text-xs text-slate-500 font-bold tracking-wider opacity-70 leading-tight">
            Check card's rank, price, % moves, population, market cap, and sales.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <CustomDropdown 
            label="Sort" 
            value={currentFilter} 
            options={FILTER_OPTIONS} 
            onChange={(val) => updateParams('sort', val)} 
          />
          <CustomDropdown 
            label="Category" 
            value={currentSubcat} 
            options={SUBCAT_OPTIONS} 
            onChange={(val) => updateParams('category', val)} 
          />
          <CustomDropdown 
            label="Grade" 
            value={currentGrade} 
            options={GRADE_OPTIONS} 
            onChange={(val) => updateParams('grade', val)} 
          />
        </div>
      </div>

      {/* --- SEARCH BAR SECTION --- */}
      <div className="relative group px-1">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
            <Search size={16} className="text-slate-400 group-focus-within:text-[#00BA88] transition-colors" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by card name, set, or ID..."
            className={cn(
                "w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white",
                "text-xs md:text-sm font-bold pl-10 md:pl-12 pr-10 py-3 md:py-4 rounded-xl md:rounded-2xl",
                "focus:outline-none focus:ring-2 focus:ring-[#00BA88]/10 focus:border-[#00BA88] transition-all",
                "placeholder:text-slate-400 placeholder:font-medium"
            )}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 md:pr-4">
            {searchQuery && (
              <button 
                type="button" 
                onClick={clearSearch}
                className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* 2. TABLE CONTAINER */}
      <div className="rounded-xl md:rounded-[1.5rem] bg-white dark:bg-slate-900 overflow-hidden border border-slate-100 dark:border-slate-800">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[1100px] font-sans">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-950/20 text-[9px] md:text-xs uppercase font-black text-slate-400 tracking-widest border-b border-slate-100 dark:border-slate-800">
                <th className="p-4 md:p-6 w-10 md:w-16 text-center">#</th>
                <th className="p-4 md:p-6">Card</th>
                <th className="p-4 md:p-6 w-[120px] md:w-auto">Set</th>
                <th className="p-4 md:p-6 text-right">Price ({currentGrade.toUpperCase()})</th>
                <th className="p-4 md:p-6 text-right">7D %</th>
                <th className="p-4 md:p-6 text-right">30D %</th>
                <th className="p-4 md:p-6 text-right">Market Cap</th>
                <th className="p-4 md:p-6 text-right">Pop Report</th>
                <th className="p-4 md:p-6 text-right whitespace-nowrap">90D Sales</th>
                <th className="p-4 md:p-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                <TableSkeleton />
              ) : initialCards && initialCards.length > 0 ? (
                initialCards.map((card: any, idx: number) => (
                  <motion.tr 
                    key={card.id || idx}
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="p-4 md:p-6 text-[12px] md:text-sm font-bold text-slate-400 text-center">
                      {(currentPage - 1) * 50 + idx + 1}
                    </td>

                    <td className="p-4 md:p-6">
                      <div className="flex items-center gap-3 md:gap-5">
                        <div className="h-10 w-7 md:h-12 md:w-9 shrink-0 bg-slate-100 dark:bg-slate-800 rounded overflow-hidden shadow-sm">
                          <img 
                            src={card.imageUrl} 
                            className="h-full w-full object-cover" 
                            onError={(e) => { e.currentTarget.src = "https://pokecollectorhub.com/assets/placeholder.png"; }} 
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="font-black text-slate-900 dark:text-white text-[12px] md:text-sm truncate leading-tight mb-0.5">{card.name}</div>
                          <div className="text-[9px] md:text-[12px] font-black text-[#00BA88] uppercase tracking-wider">
                            {card.type}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 md:p-6 text-slate-500 font-bold text-[12px] md:text-xs uppercase truncate max-w-[80px] md:max-w-[180px]">
                      {card.set}
                    </td>

                    <td className="p-4 md:p-6 text-right font-black text-slate-900 dark:text-white text-[12px] md:text-[15px]">
                      {card.price}
                      <div className="text-[8px] md:text-[12px] text-slate-400 font-bold mt-0.5 uppercase tracking-tighter">Avg: $0.00</div>
                    </td>

                    <td className="p-4 md:p-6 text-right font-bold text-emerald-500 text-[12px] md:text-sm">+0.00%</td>
                    <td className="p-4 md:p-6 text-right font-bold text-emerald-500 text-[12px] md:text-sm">+0.00%</td>
                    
                    <td className="p-4 md:p-6 text-right font-black text-slate-900 dark:text-white text-[12px] md:text-[15px] uppercase">
                      {card.marketCap}
                    </td>

                    <td className="p-4 md:p-6 text-right">
                      <div className="text-[12px] md:text-sm font-black text-slate-700 dark:text-slate-200">{card.gradeCount}</div>
                      <div className="text-[8px] md:text-[12px] text-slate-400 font-bold uppercase tracking-tighter">Total: {card.popTotal}</div>
                    </td>

                    <td className="p-4 md:p-6 text-right text-[12px] md:text-sm font-bold text-slate-400 whitespace-nowrap">
                      {card.sales90d} sales
                    </td>

                    <td className="p-4 md:p-6 text-center">
                      <button className="mx-auto px-4 md:px-8 py-2 md:py-2.5 border-2 border-[#00BA88] text-[#00BA88] hover:bg-[#00BA88] hover:text-white rounded-lg md:rounded-xl text-[9px] md:text-xs font-black uppercase transition-all">
                        Buy
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                /* --- NO RESULTS STATE (Shows inside table body) --- */
                <tr>
                  <td colSpan={10} className="py-32 text-center">
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center justify-center space-y-4"
                    >
                      <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-full text-slate-300 dark:text-slate-600">
                        <Inbox size={48} strokeWidth={1.5} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm md:text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
                          No cards found
                        </p>
                        <p className="text-[11px] md:text-xs text-slate-500 font-bold max-w-[320px] mx-auto px-4">
                          We couldn't find any results for <span className="text-[#00BA88]">"{searchQuery || 'your search'}"</span>. 
                          Try adjusting your keywords or filters.
                        </p>
                      </div>
                      <button 
                        onClick={clearSearch}
                        className="px-6 py-2 bg-[#00BA88] text-white text-[10px] md:text-xs font-black uppercase tracking-widest rounded-lg hover:bg-[#009a70] transition-colors"
                      >
                        Clear Search
                      </button>
                    </motion.div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 3. PAGINATION (Only show if cards exist) */}
        {initialCards.length > 0 && (
          <div className="p-4 md:p-6 bg-slate-50/50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <p className="text-[9px] md:text-xs font-black uppercase tracking-widest text-slate-400">Page {currentPage} / {totalPages}</p>
            <div className="flex items-center gap-2 md:gap-3">
              <button 
                disabled={currentPage === 1 || isLoading}
                onClick={() => updateParams('page', currentPage - 1)}
                className="cursor-pointer p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-30 transition-all"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="hidden md:flex gap-1.5">
                 {[...Array(Math.min(5, totalPages))].map((_, i) => {
                   let pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                   if (pageNum > totalPages) return null;
                   return (
                    <button
                      key={pageNum}
                      onClick={() => updateParams('page', pageNum)}
                      className={cn(
                        "h-9 w-9 rounded-lg text-xs font-black transition-all cursor-pointer",
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
                className="cursor-pointer p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-30 transition-all"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* 4. FOOTER STATS */}
      <div className="flex items-center gap-4 px-1 text-[9px] md:text-xs font-black uppercase text-slate-400 tracking-widest">
        <div className="flex items-center gap-1.5">
          <span>Total Records:</span>
          <span className="text-slate-900 dark:text-white font-black">{totalRecords.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1.5 border-l border-slate-200 dark:border-slate-800 pl-4">
          <span>Current Grade:</span>
          <span className="text-[#00BA88] font-black">{currentGrade.toUpperCase()}</span>
        </div>
      </div>
    </div>
  )
}