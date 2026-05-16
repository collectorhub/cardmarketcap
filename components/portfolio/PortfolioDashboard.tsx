"use client";

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  ShoppingBag, Bell, MoreHorizontal, 
  TrendingUp, Info, ArrowUpRight,
  Layers, ChevronRight, Activity,
  MoreVertical, Eye, Edit2, Trash2,
  ShoppingCart, Plus, Layout, ArrowRight
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { CgArrowLongRight } from 'react-icons/cg';
import AllocationCard from '../AllocationCard';
import { useRouter } from 'next/navigation';
import AddCardModal from './AddCardModal';

const ALLOCATION = [
  { name: 'PSA 10', value: 45.2, color: '#7c3aed' },
  { name: 'PSA 9', value: 22.6, color: '#3b82f6' },
  { name: 'Raw / Ungraded', value: 18.3, color: '#10b981' },
  { name: 'PSA 8', value: 8.7, color: '#f59e0b' },
  { name: 'PSA 7 & Below', value: 5.2, color: '#ef4444' },
];

const RowActions = ({ card, gameType }: { card: any; gameType: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleActionClick = (e: React.MouseEvent, actionLabel: string) => {
    e.stopPropagation(); // Prevents the table row onClick from firing
    setIsOpen(false);

    if (actionLabel === 'View Details') {
      router.push(`/card/${card.card_id}?game=${gameType}`);
    } else if (actionLabel === 'Remove') {
      // Handle remove logic here (e.g., callback, state update, or API call)
      console.log(`Remove card: ${card.id}`);
    }
  };

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
              {[
                { label: 'View Details', icon: Eye },
                { label: 'Remove', icon: Trash2, variant: 'danger' },
              ].map((action, idx) => (
                <button
                  key={idx}
                  onClick={(e) => handleActionClick(e, action.label)}
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
          e.stopPropagation(); // Prevents clicking the dots from opening the card page directly
          setIsOpen(!isOpen);
        }}
        className={cn(
          "p-1.5 rounded-full transition-all duration-200 relative z-10",
          isOpen 
            ? "bg-slate-100 dark:bg-slate-800 text-emerald-500" 
            : "text-slate-400 hover:bg-slate-100 dark:hover:hover:bg-slate-800 hover:text-slate-600"
        )}
      >
        <MoreVertical size={18} />
      </button>
    </div>
  );
};

export default function PortfolioDashboard({ data }: { data: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter()

  const { 
    stats = { totalValue: 0, totalCards: 0, totalSets: 0 }, 
    performance = { change7D: 0, change7DPct: 0, allTimeHigh: 0, allTimeLow: 0 }, 
    cards = [], 
    allocation = [] ,
    watchlistStats = { totalWatching: 0, alertsActive: 0, newListings: 0 }
  } = data;

  const [activeTab, setActiveTab] = useState('7D');
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;
  const totalPages = Math.ceil(cards.length / cardsPerPage);

  const paginatedCards = cards.slice(
    (currentPage - 1) * cardsPerPage,
    currentPage * cardsPerPage
  );

  // --- CHART LOGIC ---
  const chartConfig = useMemo(() => {
    const pointsCount = 7;
    const currentVal = stats.totalValue || 0;
    const growthPercent = performance.change7DPct || 0;
    
    // Calculate start value based on growth
    const startValue = currentVal / (1 + (growthPercent / 100));
    
    // Determine Y-axis ceiling (add 20% headroom)
    const ceiling = Math.max(currentVal * 1.2, 1000);

    const points = Array.from({ length: pointsCount }).map((_, i) => {
      const step = i / (pointsCount - 1);
      const simulatedValue = startValue + (currentVal - startValue) * step;
      
      // Random wobble for visual flair
      const wobble = i === 0 || i === pointsCount - 1 ? 1 : 0.96 + Math.random() * 0.08;
      const finalVal = simulatedValue * wobble;

      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      
      return {
        x: i * (400 / (pointsCount - 1)), // Based on SVG viewBox width 400
        y: 130 - (finalVal / ceiling) * 110, // Scaled to SVG height
        label: `${date.getMonth() + 1}/${date.getDate()}`
      };
    });

    const path = `M${points.map(p => `${p.x},${p.y}`).join(' L')}`;
    const fill = `${path} V150 H0 Z`;
    
    const yLabels = [
      `$${(ceiling / 1000).toFixed(0)}K`,
      `$${((ceiling * 0.75) / 1000).toFixed(0)}K`,
      `$${((ceiling * 0.5) / 1000).toFixed(0)}K`,
      `$${((ceiling * 0.25) / 1000).toFixed(0)}K`,
      "$0"
    ];

    return { points, path, fill, yLabels };
  }, [stats.totalValue, performance.change7DPct]);

  // Define the empty condition
  const isEmpty = cards.length === 0;

  // --- EMPTY STATE UI ---
  if (isEmpty) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 animate-in fade-in zoom-in duration-700">
        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[28px] flex items-center justify-center mb-8 shadow-sm">
          <Layers className="w-10 h-10 text-slate-300 dark:text-slate-600" />
        </div>
        
        <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
          Your portfolio is empty
        </h2>
        
        <p className="text-slate-500 dark:text-slate-400 text-[13px] md:text-[14px] font-medium max-w-sm mb-10 leading-relaxed">
          Start building your collection to see performance analytics, market value growth, and grade distribution.
        </p>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-[#00BA88] text-white rounded-2xl text-[13px] font-black hover:bg-[#00a377] transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
        >
          <Plus size={18} strokeWidth={3} />
          <span>Add Your First Card</span>
        </button>

        {/* Modal handled locally for the CTA */}
        <AnimatePresence>
          {isModalOpen && (
            <AddCardModal 
              userId={data?.user?.id} 
              onClose={() => setIsModalOpen(false)} 
              onRefresh={() => window.location.reload()}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[24px] border border-slate-100 dark:border-slate-800 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] group/card">
            <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Portfolio Performance</h3>
                  <Info size={14} className="text-slate-300 dark:text-slate-600 opacity-0 group-hover/card:opacity-100 transition-opacity cursor-help" />
                </div>
                <div className="flex items-baseline gap-3">
                  <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    ${stats.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className={cn(
                    "text-xs font-bold flex items-center gap-1",
                    performance.change7DPct >= 0 ? "text-emerald-500" : "text-red-500"
                  )}>
                    <TrendingUp size={12} className={performance.change7DPct < 0 ? "rotate-180" : ""} /> 
                    {performance.change7DPct >= 0 ? '+' : ''}{performance.change7DPct}% (7D)
                  </p>
                </div>
              </div>
              
              <div className="flex gap-1 bg-slate-50 dark:bg-[#050b18] p-1.5 rounded-xl border border-slate-100 dark:border-slate-800/50 shadow-inner">
                {['7D', '30D', '90D', '1Y', 'All'].map((t) => (
                  <button 
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={cn(
                      "px-4 py-2 text-[11px] font-black rounded-lg transition-all duration-200 uppercase tracking-wider",
                      activeTab === t 
                        ? "bg-[#10b981] text-white shadow-[0_4px_12px_rgba(16,185,129,0.2)]" 
                        : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
              <div className="md:col-span-7 h-64 flex gap-4">
                <div className="flex flex-col justify-between py-1 text-[10px] font-bold text-slate-400 text-right w-10 shrink-0">
                  {chartConfig.yLabels.map((label, idx) => <span key={idx}>{label}</span>)}
                </div>

                <div className="flex-1 flex flex-col justify-between relative">
                  <div className="flex-1 relative">
                    <svg viewBox="0 0 400 150" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      <motion.path 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                        d={chartConfig.fill} 
                        fill="url(#chartGrad)" 
                      />

                      <motion.path 
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        d={chartConfig.path} 
                        fill="none" 
                        stroke="#10b981" 
                        strokeWidth="4"
                        strokeDasharray="1 8"
                        strokeLinecap="round"
                        className="drop-shadow-[0_4px_10px_rgba(16,185,129,0.3)]"
                      />

                      <g>
                        <motion.circle 
                          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          cx={chartConfig.points[6].x} 
                          cy={chartConfig.points[6].y} 
                          r="8" 
                          fill="#10b981"
                        />
                        <circle 
                          cx={chartConfig.points[6].x} 
                          cy={chartConfig.points[6].y} 
                          r="4" 
                          fill="#10b981" 
                        />
                      </g>
                    </svg>
                  </div>
                  
                  <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 tracking-tighter">
                    {chartConfig.points.map((p, i) => <span key={i}>{p.label}</span>)}
                  </div>
                </div>
              </div>

              <div className="md:col-span-5 flex flex-col justify-between border-l border-slate-50 dark:border-slate-800 pl-0 md:pl-8 space-y-3">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Performance Overview</p>
                {[
                  { label: 'Change (7D)', val: `$${(performance?.change7D ?? 0).toLocaleString()}`, status: (performance?.change7D ?? 0) >= 0 ? 'pos' : 'neg' },
                  { label: 'All Time High', val: `$${(performance?.allTimeHigh ?? 0).toLocaleString()}`, status: 'neutral' },
                  { label: 'All Time Low', val: `$${(performance?.allTimeLow ?? 0).toLocaleString()}`, status: 'neutral' },
                  { label: 'Best Performing Card', val: cards[0]?.name || 'N/A', sub: cards[0]?.change > 0 ? `+${cards[0].change}%` : '0%', status: 'pos' },
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
                      {item.sub && <p className="text-[9px] font-bold text-emerald-500/80">↗ {item.sub}</p>}
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
            <span className="text-[10px] font-bold text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md">
              Page {currentPage} of {totalPages || 1}
            </span>
          </div>
          
          <div className="w-full overflow-x-auto scrollbar-hide">
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
                {paginatedCards.map((card: any, i: number) => {
                  const isPositive = card.change >= 0;
                  const chartColor = isPositive ? '#10b981' : '#ef4444';
                  const sparkPath = isPositive 
                    ? "M0,25 Q20,22 40,25 T70,15 T100,5" 
                    : "M0,5 Q20,8 40,5 T70,20 T100,25";

                  // Extracting raw path variations safely
                  const rawPath = card.canonical_path || card.url || "";

                  // Aligns the paths cleanly exactly how your client watchlist does it
                  const handleNavigation = () => {
                    if (rawPath) {
                      const dynamicRoute = rawPath.startsWith('/card') ? rawPath : `/card${rawPath}`;
                      router.push(dynamicRoute);
                    } else if (card.card_id) {
                      // Fallback protection if raw path values happen to be missing
                      let gameType = 'lorcana';
                      if (card.url?.includes('/pokemon/')) gameType = 'pokemon';
                      if (card.url?.includes('/mtg/') || card.url?.includes('/magicthegathering/')) gameType = 'magic';
                      router.push(`/card/${card.card_id}?game=${gameType}`);
                    }
                  };

                  return (
                    <tr 
                      key={card.id || i} 
                      onClick={handleNavigation}
                      className="group cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-950/50 transition-all"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-8 h-11 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 shrink-0 overflow-hidden">
                            {card.imageUrl ? (
                              <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[8px] text-slate-400 font-bold">NO IMG</div>
                            )}
                          </div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors truncate">
                            {card.name}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-[11px] text-slate-400 font-bold uppercase truncate">{card.set}</p>
                      </td>
                      <td className="px-2 py-4 text-center">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-black bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20">
                          {card.grade || 'RAW'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-[13px] font-black text-slate-900 dark:text-white leading-tight">
                          ${(card.value || 0).toLocaleString()}
                        </p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Market Price</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-[13px] font-black text-slate-900 dark:text-white leading-tight">
                          ${(card.value || 0).toLocaleString()}
                        </p>
                        <p className={cn(
                          "text-[9px] font-bold flex items-center gap-0.5", 
                          isPositive ? "text-emerald-500" : "text-red-500"
                        )}>
                          {isPositive ? '↗' : '↘'} {Math.abs(card.change || 0)}%
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-[13px] font-black text-slate-800 dark:text-slate-200">
                          {((card.value / (stats.totalValue || 1)) * 100).toFixed(2)}%
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="h-10 w-full max-w-[120px] flex items-center">
                          <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                            <defs>
                              <linearGradient id={`gradient-${i}`} x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor={chartColor} stopOpacity="0.3" />
                                <stop offset="100%" stopColor={chartColor} stopOpacity="0" />
                              </linearGradient>
                            </defs>
                            <motion.path d={`${sparkPath} L 100,40 L 0,40 Z`} fill={`url(#gradient-${i})`} />
                            <motion.path d={sparkPath} fill="none" stroke={chartColor} strokeWidth="3" strokeDasharray="1 5" strokeLinecap="round" />
                          </svg>
                        </div>
                      </td>
                      <td 
                        className="px-4 py-4 text-right" 
                        onClick={(e) => e.stopPropagation()}
                      >
                        <RowActions 
                          onViewDetails={handleNavigation}
                          onRemove={() => console.log("Remove triggered for asset id:", card.id)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* PAGINATION FOOTER */}
          <div className="p-4 bg-slate-50/30 dark:bg-slate-950/30 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-[11px] font-bold text-slate-500 hover:text-emerald-500 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors flex items-center gap-2"
            >
              <ArrowRight size={14} className="rotate-180" /> Previous
            </button>
            
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    "w-8 h-8 rounded-lg text-[11px] font-black transition-all",
                    currentPage === page 
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                      : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                >
                  {page}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-[11px] font-bold text-slate-500 hover:text-emerald-500 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors flex items-center gap-2"
            >
              Next <ArrowRight size={14} />
            </button>
          </div>
        </div>
        </div>

        {/* RIGHT COLUMN: Allocation & Insights */}
        <div className="lg:col-span-4 space-y-6">
          
          <AllocationCard 
            title="Portfolio Allocation"
            data={allocation.length > 0 ? allocation : ALLOCATION} // Fallback to dummy if empty
            centerValue={stats.totalCards}
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

          {/* WATCHLIST OVERVIEW CARD */}
          <div className="bg-white dark:bg-slate-900 rounded-[24px] border border-slate-100 dark:border-slate-800 p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2">
                <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-100">Watchlist Overview</h3>
                <Info size={14} className="text-slate-300 cursor-help" />
              </div>
            </div>

            <div className="grid grid-cols-3">
              {[
                { label: 'Watching', val: watchlistStats.totalWatching },
                { label: 'Alerts Active', val: watchlistStats.alertsActive },
                { label: 'New Listings', val: watchlistStats.newListings },
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