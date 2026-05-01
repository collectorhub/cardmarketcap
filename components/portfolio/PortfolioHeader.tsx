"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Layers, Bell, ShoppingBag, History, 
  BarChart3, AlertCircle, Settings, Info, TrendingUp 
} from 'lucide-react';
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: 'Portfolio', href: '/portfolio', icon: Layers },
  { label: 'Watchlist', href: '/portfolio/watchlist', icon: Bell },
];

export default function PortfolioHeader({ data }: { data: any }) {
  const pathname = usePathname();
  const isWatchlist = pathname === '/portfolio/watchlist';

  // Dynamic Content based on route
  const headerTitle = isWatchlist ? "Watchlist" : `Welcome back, ${data.user.name}! 👋`;
  const subTitle = isWatchlist 
    ? "Track cards you're watching. Get alerts on price changes and market moves."
    : `Your collection value increased by +$4,230 in the last 24h.`;
  
  // Dynamic Stats based on route
  const mainStatLabel = isWatchlist ? "Total Watchlist Value" : "Total Portfolio Value";
  const mainStatValue = isWatchlist ? data.watchlist?.totalValue ?? 32415.20 : data.stats.totalValue;
  const mainStatGrowth = isWatchlist ? data.watchlist?.growth7D ?? 9.72 : data.stats.growth7D;
  
  const secondaryStat1Label = isWatchlist ? "Watching" : "Cards";
  const secondaryStat1Value = isWatchlist ? data.watchlist?.totalCards ?? 42 : data.stats.totalCards;
  
  const secondaryStat2Label = isWatchlist ? "Alerts Active" : "Sets";
  const secondaryStat2Value = isWatchlist ? data.watchlist?.alertsActive ?? 8 : data.stats.totalSets;

  return (
    <header className="w-full pt-20 md:pt-8 pb-0">
      {/* 1. HEADER STATS SECTION */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-8">
        
        {/* Left Content: Text */}
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
              <>Welcome back, <span className="text-[#00BA88]">{data.user.name}! 👋</span></>
            )}
          </motion.h1>
          <p className="text-slate-500 dark:text-slate-400 text-[12px] md:text-[14px] font-medium">
            {isWatchlist ? (
              subTitle
            ) : (
              <>Your collection value increased by <span className="text-emerald-500 font-bold">+$4,230</span> in the last 24h.</>
            )}
          </p>
        </div>

        {/* Right Content: Stat Card */}
        <div className="w-full lg:w-auto bg-white dark:bg-slate-900 px-4 md:px-6 py-4 rounded-[16px] border border-slate-100 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
          
          {/* Main Stat Group (Value) */}
          <div className="flex flex-col items-center sm:items-start gap-1 w-full sm:w-auto">
            <div className="flex items-center gap-1">
              <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-[0.05em]">{mainStatLabel}</p>
              <Info size={11} className="text-slate-300 dark:text-slate-600 cursor-help" />
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-[20px] md:text-[22px] font-black text-slate-900 dark:text-white leading-none tracking-tight">
                ${mainStatValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50/50 dark:bg-emerald-500/10 text-emerald-500 border border-emerald-100 dark:border-emerald-500/20">
                <TrendingUp size={10} strokeWidth={3} />
                <span className="text-[10px] font-bold">{mainStatGrowth}%</span>
              </div>
            </div>
          </div>

          <div className="h-[1px] w-full sm:h-8 sm:w-[1px] bg-slate-100 dark:bg-slate-800" />

          {/* Secondary Stats Grid */}
          <div className="flex justify-around w-full sm:w-auto gap-8">
            <div className="flex flex-col gap-1 text-center sm:text-left">
              <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-[0.05em]">{secondaryStat1Label}</p>
              <p className="text-[20px] md:text-[22px] font-black text-slate-900 dark:text-white leading-none">
                {secondaryStat1Value}
              </p>
            </div>

            <div className="flex flex-col gap-1 text-center sm:text-left">
              <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-[0.05em]">{secondaryStat2Label}</p>
              <p className="text-[20px] md:text-[22px] font-black text-slate-900 dark:text-white leading-none">
                {secondaryStat2Value}
              </p>
            </div>
          </div>
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
    </header>
  );
}