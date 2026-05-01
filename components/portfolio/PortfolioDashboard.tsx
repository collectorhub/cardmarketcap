"use client";

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  ShoppingBag, Bell, MoreHorizontal, 
  TrendingUp, Info, ArrowUpRight,
  Layers, ChevronRight, Activity,
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  ShoppingCart,
  Plus,
  Layout,
  ArrowRight
} from 'lucide-react';
import { PieChart as RePie, Pie, Cell, ResponsiveContainer } from 'recharts';
import { cn } from "@/lib/utils";
import { CgArrowLongRight } from 'react-icons/cg';
import AllocationCard from '../AllocationCard';

const ALLOCATION = [
  { name: 'PSA 10', value: 45.2, color: '#7c3aed' },
  { name: 'PSA 9', value: 22.6, color: '#3b82f6' },
  { name: 'Raw / Ungraded', value: 18.3, color: '#10b981' },
  { name: 'PSA 8', value: 8.7, color: '#f59e0b' },
  { name: 'PSA 7 & Below', value: 5.2, color: '#ef4444' },
];

const RowActions = () => {
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

  const actions = [
    { label: 'View Details', icon: Eye },
    // { label: 'Edit Card', icon: Edit2 },
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
            /* This positions the menu to the left of the button */
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
        onClick={(e) => {
          e.stopPropagation(); // Prevent row click events
          setIsOpen(!isOpen);
        }}
        className={cn(
          "p-1.5 rounded-full transition-all duration-200 relative z-10",
          isOpen 
            ? "bg-slate-100 dark:bg-slate-800 text-emerald-500" 
            : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600"
        )}
      >
        <MoreVertical size={18} />
      </button>
    </div>
  );
};

export default function PortfolioDashboard({ data }: { data: any }) {
  const [chartTab, setChartTab] = useState('7D');
const [activeTab, setActiveTab] = useState('7D');
const timeframes = ['7D', '30D', '90D', '1Y', 'All'];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Main Performance & Assets */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. PORTFOLIO PERFORMANCE CARD */}
          <div className="bg-white dark:bg-slate-900 rounded-[24px] border border-slate-100 dark:border-slate-800 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] group/card">
            <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Portfolio Performance</h3>
                  <Info size={14} className="text-slate-300 dark:text-slate-600 opacity-0 group-hover/card:opacity-100 transition-opacity cursor-help" />
                </div>
                <div className="flex items-baseline gap-3">
                  <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    $48,725.60
                  </p>
                  <p className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                    <TrendingUp size={12} /> +12.48% (7D)
                  </p>
                </div>
              </div>
              
              {/* Timeframe Toggles */}
          <div className="flex gap-1 bg-slate-50 dark:bg-[#050b18] p-1.5 rounded-xl border border-slate-100 dark:border-slate-800/50 shadow-inner">
            {['7D', '30D', '90D', '1Y', 'All'].map((t) => (
              <button 
                key={t}
                onClick={() => setActiveTab(t)}
                className={cn(
                  "px-4 py-2 text-[11px] font-black rounded-lg transition-all duration-200 uppercase tracking-wider",
                  activeTab === t 
                    ? "bg-[#10b981] text-white shadow-[0_4px_12px_rgba(16,185,129,0.2)] dark:shadow-[0_0_20px_rgba(16,185,129,0.3)]" 
                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/40"
                )}
              >
                {t}
              </button>
            ))}
          </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
              {/* Chart Side with Y-Axis Labels */}
              <div className="md:col-span-7 h-64 flex gap-4">
                
                {/* Y-AXIS LABELS (The part you requested) */}
                <div className="flex flex-col justify-between py-1 text-[10px] font-bold text-slate-400 text-right w-10 shrink-0">
                  <span>$60K</span>
                  <span>$45K</span>
                  <span>$30K</span>
                  <span>$15K</span>
                  <span>$0</span>
                </div>

                <div className="flex-1 flex flex-col justify-between relative">
    <div className="flex-1 relative">
      <svg viewBox="0 0 400 150" className="w-full h-full overflow-visible">
        <defs>
          {/* Deeper gradient for the main hero chart */}
          <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 1. Main Area Fill */}
        <motion.path 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          d="M0,120 L80,115 L160,90 L240,100 L320,80 L400,40 V150 H0 Z" 
          fill="url(#chartGrad)" 
        />

        {/* 2. The Dotted Performance Line */}
        <motion.path 
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          d="M0,120 L80,115 L160,90 L240,100 L320,80 L400,40" 
          fill="none" 
          stroke="#10b981" 
          strokeWidth="4"          /* Thicker for the hero chart */
          strokeDasharray="1 8"   /* Larger spacing for a cleaner look at scale */
          strokeLinecap="round" 
          className="drop-shadow-[0_4px_10px_rgba(16,185,129,0.3)]"
        />

        {/* 3. Terminal "Live" Indicator Assembly */}
        <g>
          {/* Outer Ripple Effect */}
          <motion.circle 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
            cx="400" 
            cy="40" 
            r="8" 
            fill="#10b981"
          />
          
          {/* Main Glow */}
          <circle 
            cx="400" 
            cy="40" 
            r="4" 
            fill="#10b981" 
            className="drop-shadow-[0_0_8px_#10b981]"
          />
          
          {/* Inner White Core (Adds that "Financial App" polish) */}
          <circle 
            cx="400" 
            cy="40" 
            r="1.5" 
            fill="white" 
          />
        </g>
      </svg>
    </div>
    
    {/* X-Axis Labels */}
    <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 tracking-tighter">
      <span>May 12</span>
      <span>May 13</span>
      <span>May 14</span>
      <span>May 15</span>
      <span>May 16</span>
      <span>May 17</span>
      <span>May 18</span>
    </div>
  </div>
              </div>

              {/* Performance Stats Side */}
              <div className="md:col-span-5 flex flex-col justify-between border-l border-slate-50 dark:border-slate-800 pl-0 md:pl-8 space-y-3">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Performance Overview</p>
                
                {[
                  { label: 'Change (7D)', val: '+$5,420.60', status: 'pos' },
                  { label: 'Change (30D)', val: '+$9,812.40', status: 'pos' },
                  { label: 'All Time Change', val: '+$18,725.60', status: 'pos' },
                  { label: 'All Time High', val: '$48,725.60', status: 'neutral' },
                  { label: 'All Time Low', val: '$21,430.20', status: 'neutral' },
                  { label: 'Best Performing Card', val: 'Charizard #4', sub: '+35.6%', status: 'pos' },
                  { label: 'Worst Performing Card', val: 'Lugia #9', sub: '-8.2%', status: 'neg' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center group/item border-b border-slate-50 dark:border-slate-800 pb-2 last:border-0">
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{item.label}</p>
                    <div className="text-right">
                      <p className={cn(
                        "text-[12px] font-black flex items-center justify-end gap-1",
                        item.status === 'pos' ? "text-emerald-500" : item.status === 'neg' ? "text-red-500" : "text-slate-900 dark:text-white"
                      )}>
                        {item.status === 'pos' && <TrendingUp size={10} />}
                        {item.val}
                      </p>
                      {item.sub && (
                        <p className={cn(
                          "text-[9px] font-bold", 
                          item.status === 'pos' ? "text-emerald-500/80" : "text-red-500/80"
                        )}>
                          {item.status === 'pos' ? '↗' : '↘'} {item.sub}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2. YOUR TOP CARDS TABLE */}
<div className="bg-white dark:bg-slate-900 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
  <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
      Your Top Cards <Info size={14} className="text-slate-300 dark:text-slate-600" />
    </h3>
  </div>
  
  {/* WRAPPER FOR MOBILE SCROLLING */}
  {/* overflow-x-auto enables horizontal scroll */}
  {/* custom-scrollbar classes ensure visibility */}
  <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 scrollbar-track-transparent">
    {/* min-w-[800px] ensures the table doesn't squash on small screens, triggering the scroll */}
    <table className="w-full text-left border-collapse table-fixed min-w-[900px] lg:min-w-full">
      <thead>
        <tr className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-50 dark:border-slate-800">
          <th className="px-4 py-4 w-[22%]">Card</th>
          <th className="px-4 py-4 w-[16%]">Set</th>
          <th className="px-2 py-4 w-[8%] text-center">Grade</th>
          <th className="px-4 py-4 w-[13%]">Last Sale</th>
          <th className="px-4 py-4 w-[13%]">Market Value</th>
          <th className="px-4 py-4 w-[10%]">Change</th>
          <th className="px-4 py-4 w-[12%]">Allocation</th>
          <th className="px-4 py-4 w-[6%]"></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
        {[
          { n: 'Charizard #4', s: 'Base Set Unlimited', g: 'PSA 10', ls: '$1,050,000', lsd: 'May 10, 2025', v: '$1,000,000', vp: '+18.7%', c: '2.05%', color: '#10b981', path: "M0,20 Q10,18 20,15 T40,22 T60,8 T80,15 T100,2" },
          { n: 'Blastoise #2', s: 'Base Set Unlimited', g: 'PSA 10', ls: '$520,000', lsd: 'May 8, 2025', v: '$480,000', vp: '+9.4%', c: '0.98%', color: '#10b981', path: "M0,22 Q15,20 30,10 T60,18 T100,5" },
          { n: 'Venusaur #15', s: 'Base Set Unlimited', g: 'PSA 9', ls: '$85,000', lsd: 'May 7, 2025', v: '$78,500', vp: '+6.1%', c: '0.16%', color: '#10b981', path: "M0,25 Q20,22 40,25 T70,15 T100,12" },
          { n: 'Lugia #9', s: 'Neo Genesis', g: 'PSA 10', ls: '$310,000', lsd: 'May 4, 2025', v: '$295,000', vp: '-8.2%', c: '0.61%', color: '#ef4444', path: "M0,5 Q20,8 40,5 T70,20 T100,25" },
          { n: 'Rayquaza #107', s: 'EX Deoxys Gold Star', g: 'PSA 10', ls: '$115,000', lsd: 'May 1, 2025', v: '$108,000', vp: '+12.4%', c: '1.12%', color: '#10b981', path: "M0,25 Q10,10 25,18 T50,5 T75,12 T100,0" },
        ].map((card, i) => (
          <tr key={i} className="group cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-950/50 transition-all">
            <td className="px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-11 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 shrink-0" />
                <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors truncate">{card.n}</p>
              </div>
            </td>
            {/* ... rest of your td elements stay exactly the same ... */}
            <td className="px-4 py-4">
               <p className="text-[11px] text-slate-400 font-bold uppercase truncate">{card.s}</p>
            </td>
            <td className="px-2 py-4 text-center">
               <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-black bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20">
                 {card.g}
               </span>
            </td>
            <td className="px-4 py-4">
               <p className="text-[13px] font-black text-slate-900 dark:text-white leading-tight">{card.ls}</p>
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{card.lsd}</p>
            </td>
            <td className="px-4 py-4">
               <p className="text-[13px] font-black text-slate-900 dark:text-white leading-tight">{card.v}</p>
               <p className={cn("text-[9px] font-bold flex items-center gap-0.5", card.vp.includes('+') ? "text-emerald-500" : "text-red-500")}>
                 {card.vp.includes('+') ? '↗' : '↘'} {card.vp.replace('+', '')}
               </p>
            </td>
            <td className="px-4 py-4">
               <p className="text-[13px] font-black text-slate-800 dark:text-slate-200">{card.c}</p>
            </td>
             <td className="px-4 py-4">
          {/* INCREASED CONTAINER HEIGHT to h-10 for better trend visibility */}
          <div className="h-10 w-full max-w-[120px] flex items-center">
            <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full overflow-visible">
              <defs>
                {/* ENHANCED GRADIANT with slightly higher top opacity */}
                <linearGradient id={`gradient-${i}`} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={card.color} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={card.color} stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* 1. Enhanced Smooth Area Fill */}
              <motion.path
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                /* Adjusted closing point to L 100,40 and L 0,40 for new height */
                d={`${card.path} L 100,40 L 0,40 Z`}
                fill={`url(#gradient-${i})`}
              />

              {/* 2. Defined Dotted Path Style */}
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                d={card.path}
                fill="none"
                stroke={card.color}
                /* Tightened spacing and increased width for definition */
                strokeWidth="3" 
                strokeDasharray="1 5" /* 1px dot, 5px gap */
                strokeLinecap="round" 
                strokeLinejoin="round"
                /* Increased shadow depth for "floating" effect */
                className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
              />

              {/* 3. The Live Glow Marker (Concentric Pulse Circles) */}
              {/* 3a. Static Inner Core Dot */}
              <circle
                cx="100"
                /* Re-mapping the path terminal Y to 40px height */
                cy={card.path.split('T').pop()?.split(',')[1] || 15}
                r="2.5"
                fill={card.color}
              />
              {/* 3b. Large Outer Pulse Glow */}
              <circle
                cx="100"
                cy={card.path.split('T').pop()?.split(',')[1] || 15}
                r="6"
                fill={card.color}
                className="animate-pulse opacity-20 blur-sm"
              />
            </svg>
          </div>
        </td>
            <td className="px-4 py-4 text-right">
              <RowActions />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  <div className="p-4 bg-slate-50/30 dark:bg-slate-950/30 border-t border-slate-50 dark:border-slate-800">
    <button className="group/btn text-[13px] font-bold text-emerald-500 hover:text-emerald-600 flex items-center justify-center gap-2 w-full transition-all tracking-wide">
      View All Cards in Portfolio 
      <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
    </button>
  </div>
</div>
        </div>

        {/* RIGHT COLUMN: Allocation & Insights */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* PORTFOLIO ALLOCATION CARD */}
          <AllocationCard 
  title="Portfolio Allocation"
  data={ALLOCATION}
  centerValue={data.stats.totalCards}
  centerLabel="Total Cards"
  onFooterClick={() => console.log("Navigate to breakdown")}
/>

          {/* RECENT ACTIVITY LOG */}
          <div className="bg-white dark:bg-slate-900 rounded-[24px] border border-slate-100 dark:border-slate-800 p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-100">Recent Activity</h3>
                <Info size={14} className="text-slate-300" />
              </div>
              <button className="text-[11px] font-bold text-emerald-500 flex items-center gap-1 hover:underline uppercase tracking-wider">
                View All <ArrowUpRight size={14} />
              </button>
            </div>

            <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {[
                { t: 'Sold Charizard #4 (PSA 10)', v: '$1,050,000', d: 'May 10, 2025', icon: <ShoppingCart size={16}/>, color: 'bg-emerald-50 text-emerald-500' },
                { t: 'Added Blastoise #2 (PSA 10)', v: '$480,000', d: 'May 8, 2025', icon: <Plus size={16}/>, color: 'bg-emerald-50 text-emerald-500' },
                { t: 'Price Alert Triggered', v: 'Lugia #9 (PSA 10) fell below $300,000', d: 'May 4, 2025', icon: <Bell size={16}/>, color: 'bg-purple-50 text-purple-500' },
                { t: 'Market Update', v: '13 cards changed value', d: 'May 2, 2025', icon: <Layout size={16}/>, color: 'bg-orange-50 text-orange-500' },
              ].map((act, i) => (
                <div key={i} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", act.color)}>
                      {act.icon}
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-slate-800 dark:text-slate-200">{act.t}</p>
                      <p className="text-[12px] text-slate-400 font-medium">{act.v}</p>
                    </div>
                  </div>
                  <p className="text-[12px] font-semibold text-slate-400 whitespace-nowrap">{act.d}</p>
                </div>
              ))}
            </div>
          </div>

          {/* NEW: WATCHLIST OVERVIEW CARD */}
          <div className="bg-white dark:bg-slate-900 rounded-[24px] border border-slate-100 dark:border-slate-800 p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2">
                <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-100">Watchlist Overview</h3>
                <Info size={14} className="text-slate-300 cursor-help" />
              </div>
            </div>

            <div className="grid grid-cols-3">
              {[
                { label: 'Watching', val: '21' },
                { label: 'Alerts Active', val: '3' },
                { label: 'New Listings', val: '2' },
              ].map((stat, i) => (
                <div 
                  key={i} 
                  className={`flex flex-col px-4 ${
                    i !== 0 ? 'border-l border-slate-50 dark:border-slate-800' : 'pl-0'
                  }`}
                >
                  <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {stat.val}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 tracking-tight">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 pt-4 border-t border-slate-50 dark:border-slate-800/50 flex items-center justify-center gap-2 text-emerald-500 hover:text-emerald-600 transition-all font-bold text-[13px] group/watch">
              Go to Watchlist
              <CgArrowLongRight size={16} className="group-hover/watch:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}