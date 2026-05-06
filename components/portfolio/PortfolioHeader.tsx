"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Layers, Bell, Info, TrendingUp,
  Plus, Download 
} from 'lucide-react';
import { cn } from "@/lib/utils";
import AddCardModal from './AddCardModal';

const NAV_ITEMS = [
  { label: 'Portfolio', href: '/portfolio', icon: Layers },
  { label: 'Watchlist', href: '/portfolio/watchlist', icon: Bell },
];

export default function PortfolioHeader({ data }: { data: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = usePathname();
  const isWatchlist = pathname === '/portfolio/watchlist';

  // --- DYNAMIC DATA CALCULATIONS ---
  const userName = data?.user?.name || "Collector";
  const userId = data?.user?.id || 0;
  
  const mainStatValue = data?.stats?.totalValue || 0;
  const mainStatGrowth = data?.stats?.growth7D || 0;
  const secondaryStat1Value = data?.stats?.totalCards || 0;
  const secondaryStat2Value = data?.stats?.totalSets || 0;

  const growthAmount = (mainStatValue * (mainStatGrowth / 100)).toLocaleString(undefined, { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });

  const headerTitle = isWatchlist ? "Watchlist" : `Welcome back, ${userName}! 👋`;
  const subTitle = isWatchlist 
    ? "Track cards you're watching. Get alerts on price changes and market moves."
    : `Your collection value increased by +$${growthAmount} in the last 24h.`;

  return (
    <header className="w-full pt-20 md:pt-8 pb-0">
      {/* 1. TOP SECTION (Title + Stats & Actions) */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-8">
        
        {/* Left Content: Title & Subtitle */}
        <div className="space-y-1 py-2 text-center lg:text-left"> 
          <motion.h1 
            key={isWatchlist ? 'watchlist' : 'portfolio'}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight"
          >
            {isWatchlist ? (
              headerTitle
            ) : (
              <>Welcome back, <span className="text-[#00BA88]">{userName}! 👋</span></>
            )}
          </motion.h1>
          <p className="text-slate-500 dark:text-slate-400 text-[12px] md:text-[14px] font-medium">
            {isWatchlist ? (
              subTitle
            ) : (
              <>Your collection value increased by <span className="text-emerald-500 font-bold">+$${growthAmount}</span> in the last 24h.</>
            )}
          </p>
        </div>

        {/* Right Content: Stats and Actions */}
        <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center gap-4">
          
          {/* Action Buttons - Now shown on both Portfolio and Watchlist */}
          <div className="flex items-center gap-2 md:gap-3 order-2 xl:order-1">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 bg-[#00BA88] text-white rounded-xl text-[12px] font-black hover:bg-[#00a377] transition-all shadow-md shadow-emerald-500/20"
            >
              <Plus size={16} strokeWidth={3} />
              <span>Add Card</span>
            </button>
            
            <button className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-[12px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <Download size={16} />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>

          {/* Stat Card - Shown on Portfolio, hidden on Watchlist if you prefer */}
          {!isWatchlist && (
            <div className="w-full lg:w-auto bg-white dark:bg-slate-900 px-4 md:px-6 py-4 rounded-[16px] border border-slate-100 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-row items-center gap-4 sm:gap-8 order-1 xl:order-2">
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-1">
                  <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-[0.05em]">Total Value</p>
                  <Info size={11} className="text-slate-300 dark:text-slate-600 cursor-help" />
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-[18px] md:text-[20px] font-black text-slate-900 dark:text-white leading-none tracking-tight">
                    ${mainStatValue.toLocaleString()}
                  </span>
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50/50 dark:bg-emerald-500/10 text-emerald-500 border border-emerald-100 dark:border-emerald-500/20">
                    <TrendingUp size={10} strokeWidth={3} />
                    <span className="text-[10px] font-bold">{mainStatGrowth}%</span>
                  </div>
                </div>
              </div>

              <div className="h-8 w-[1px] bg-slate-100 dark:bg-slate-800" />

              <div className="flex gap-6">
                <div className="flex flex-col gap-1">
                  <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-[0.05em]">Cards</p>
                  <p className="text-[18px] md:text-[20px] font-black text-slate-900 dark:text-white leading-none">{secondaryStat1Value}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-[0.05em]">Sets</p>
                  <p className="text-[18px] md:text-[20px] font-black text-slate-900 dark:text-white leading-none">{secondaryStat2Value}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. SUB-NAVIGATION */}
      <div className="mb-0 overflow-x-auto no-scrollbar -mx-4 px-4">
        <nav className="flex justify-center md:justify-start gap-2 border-b border-slate-100 dark:border-slate-800 min-w-max">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link 
                key={item.label}
                href={item.href}
                className={cn(
                  "relative pb-3.5 px-3 md:px-4 text-[13px] font-semibold transition-all flex items-center gap-2 group",
                  isActive 
                    ? "text-emerald-500" 
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                )}
              >
                <Icon 
                  size={16} 
                  strokeWidth={isActive ? 2.5 : 2} 
                  className={cn(
                    "transition-colors",
                    isActive ? "text-emerald-500" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                  )} 
                />
                <span className="whitespace-nowrap">{item.label}</span>
                
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-emerald-500"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* 3. MODAL OVERLAY */}
      {isModalOpen && (
        <AddCardModal 
          userId={userId} 
          onClose={() => setIsModalOpen(false)} 
          onRefresh={() => window.location.reload()}
        />
      )}
    </header>
  );
}