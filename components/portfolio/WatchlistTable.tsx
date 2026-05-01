"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  MoreVertical, TrendingUp, TrendingDown, Bell, 
  Eye, Trash2, ArrowUpRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";

/**
 * 1. ENHANCED SPARKLINE COMPONENT
 */
const Sparkline = ({ trend, color, path, index }: { trend: 'up' | 'down', color: string, path: string, index: number }) => (
  <div className="h-10 w-full max-w-[120px] flex items-center">
    <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full overflow-visible">
      <defs>
        <linearGradient id={`gradient-${index}-${trend}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        d={`${path} L 100,40 L 0,40 Z`}
        fill={`url(#gradient-${index}-${trend})`}
      />
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="3" 
        strokeDasharray="1 5" 
        strokeLinecap="round" 
        className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
      />
      <circle
        cx="100"
        cy={path.split('T').pop()?.split(',')[1] || 15}
        r="2.5"
        fill={color}
      />
      <circle
        cx="100"
        cy={path.split('T').pop()?.split(',')[1] || 15}
        r="6"
        fill={color}
        className="animate-pulse opacity-20 blur-sm"
      />
    </svg>
  </div>
);

/**
 * 2. INTEGRATED ROW ACTIONS
 */
const RowActions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const actions = [
    { label: 'View Details', icon: Eye },
    { label: 'Remove', icon: Trash2, variant: 'danger' },
  ];

  return (
    <div className="relative flex justify-end items-center" ref={containerRef}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: 10 }}
            className="absolute right-full mr-2 z-[100] w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden"
          >
            <div className="p-1.5">
              {actions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-colors",
                    action.variant === 'danger' 
                      ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10" 
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                >
                  <action.icon size={14} strokeWidth={2.5} />
                  {action.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
        className={cn(
          "p-1.5 rounded-full transition-all duration-200", 
          isOpen 
            ? "bg-slate-100 dark:bg-slate-800 text-emerald-500" 
            : "text-slate-300 dark:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
        )}
      >
        <MoreVertical size={18} />
      </button>
    </div>
  );
};

export default function WatchlistTable({ cards }: { cards: any[] }) {
  const filters = [
    { label: 'All Cards', count: 42 },
    { label: 'PSA 10', count: 18 },
    { label: 'PSA 9', count: 10 },
    { label: 'Raw', count: 8 },
  ];

  return (
    <div className="flex flex-col bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
      
     {/* FILTER HEADER - Swaps to a simple title on mobile, show filters on Desktop */}
<div className="px-4 md:px-6 py-4 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
  
  {/* 1. MOBILE TITLE: Only visible on screens smaller than 'lg' */}
  <div className="lg:hidden">
    <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">
      Watchlist Assets
    </h3>
    {/* <p className="text-[10px] font-bold text-slate-500">Managing {filters[0].count} cards</p> */}
  </div>

  {/* 2. DESKTOP FILTERS: Hidden on mobile, flex on 'lg' and up */}
  <div className="hidden lg:flex flex-wrap items-center gap-2">
    {filters.map((f) => (
      <button 
        key={f.label} 
        className={cn(
          "px-5 py-2.5 rounded-xl text-[11px] font-black transition-all whitespace-nowrap border", 
          f.label === 'All Cards' 
            ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/20" 
            : "bg-slate-50/50 dark:bg-slate-950 border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        )}
      >
        {f.label} <span className="opacity-50 ml-1">({f.count})</span>
      </button>
    ))}
  </div>

  {/* 3. DROPDOWNS: Hidden on mobile, shown on 'lg' */}
  <div className="hidden lg:flex items-center gap-2">
    {['All Sets', 'All Grades', 'Sort: Market Value'].map((label) => (
      <button 
        key={label} 
        className="flex items-center gap-8 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 transition-colors whitespace-nowrap"
      >
        {label} 
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="text-slate-400 dark:text-slate-600 shrink-0">
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    ))}
  </div>

  {/* 4. OPTIONAL: Mobile 'Filter' icon button so users can still access them if needed */}
  {/* <button className="lg:hidden p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-600 dark:text-slate-300">
      <path d="M4 6h16M4 12h10M4 18h16" strokeLinecap="round"/>
    </svg>
  </button> */}
</div>

      {/* MAIN TABLE SECTION - Scrollable with fixed-column logic for mobile */}
      <div className="w-full overflow-x-auto scrollbar-hide">
        <table className="w-full text-left border-collapse min-w-[1000px] lg:min-w-full table-fixed md:table-auto">
          <thead>
            <tr className="text-[9px] md:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-50 dark:border-slate-800">
              <th className="px-4 md:px-6 py-4 w-[200px] md:w-[250px]">Card</th>
              <th className="px-4 py-4 w-[140px] md:w-[180px]">Set</th>
              <th className="px-2 py-4 w-[80px] md:w-[100px] text-center">Grade</th>
              <th className="px-4 py-4 w-[130px] md:w-[160px]">Current Value</th>
              <th className="px-4 py-4 w-[110px] md:w-[140px]">7D Change</th>
              <th className="px-4 py-4 w-[110px] md:w-[140px]">30D Change</th>
              <th className="px-4 py-4 w-[140px] md:w-[160px]">Last Sale</th>
              <th className="px-4 py-4 w-[70px] md:w-[80px] text-center">Alerts</th>
              <th className="px-4 md:px-6 py-4 w-[60px]"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {cards.map((card, i) => {
              const isUp = card.change7D > 0;
              const path = isUp ? "M0,30 Q20,25 40,30 T70,10 T100,5" : "M0,5 Q20,10 40,25 T70,35 T100,38";
              return (
                <tr key={i} className="group hover:bg-slate-50/50 dark:hover:bg-slate-950/50 transition-all cursor-pointer">
                  <td className="px-4 md:px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-11 md:w-9 md:h-12 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs md:text-sm font-black text-slate-900 dark:text-white truncate">{card.name}</p>
                        <p className="text-[9px] md:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase leading-none mt-1"># {card.cardNumber || '4'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[11px] md:text-[12px] font-bold text-slate-500 dark:text-slate-400 uppercase truncate">{card.set}</td>
                  <td className="px-2 py-4 text-center">
                    <span className="inline-flex px-1.5 py-0.5 rounded text-[9px] md:text-[10px] font-black bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20">
                      {card.grade}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm md:text-[15px] font-black text-slate-900 dark:text-white">${card.value.toLocaleString()}</p>
                    <p className={cn("text-[9px] md:text-[10px] font-black flex items-center gap-0.5 mt-0.5", isUp ? "text-emerald-500" : "text-red-500")}>
                      {isUp ? <TrendingUp size={10} strokeWidth={3} /> : <TrendingDown size={10} strokeWidth={3} />}
                      {card.change7D}%
                    </p>
                  </td>
                  <td className="px-4 py-4"><Sparkline index={i} trend={isUp ? 'up' : 'down'} color={isUp ? '#10b981' : '#ef4444'} path={path} /></td>
                  <td className="px-4 py-4"><Sparkline index={i} trend={isUp ? 'up' : 'down'} color={isUp ? '#10b981' : '#ef4444'} path={path} /></td>
                  <td className="px-4 py-4">
                    <p className="text-xs md:text-[13px] font-black text-slate-900 dark:text-white leading-tight">${(card.value * 1.05).toLocaleString()}</p>
                    <p className="text-[9px] md:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">May 10, 2025</p>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button className={cn(
                      "p-2 rounded-full border transition-all", 
                      isUp 
                        ? "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20" 
                        : "text-red-400 bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20"
                    )}>
                      <Bell size={12} strokeWidth={3} />
                    </button>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-right">
                    <RowActions />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* FOOTER ACTION */}
      <div className="p-4 bg-slate-50/30 dark:bg-slate-950/30 border-t border-slate-50 dark:border-slate-800 flex justify-center">
        <button className="text-[11px] md:text-[12px] font-bold text-emerald-500 flex items-center gap-2 hover:text-emerald-600 transition-colors">
          Load More Cards <ArrowUpRight size={14} className="rotate-45" />
        </button>
      </div>
    </div>
  );
}