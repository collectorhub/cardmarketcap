"use client";

import Link from 'next/link';
import { ArrowUpRight, TrendingUp } from 'lucide-react';
import { cn } from "@/lib/utils";

interface AssetCardProps {
  asset: {
    id: string;
    name: string;
    number: string;
    price: string;
    change: string;
    imageUrl: string;
  };
}

export function AssetCard({ asset }: AssetCardProps) {
  const isPositive = !asset.change.startsWith('-');

  return (
    <Link href={`/assets/${asset.id}`} className="block group">
      <div className="relative overflow-hidden rounded-[1.25rem] md:rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all hover:shadow-2xl hover:shadow-[#00BA88]/10 hover:-translate-y-2 active:scale-[0.98]">
        
        {/* --- FULL BLEED IMAGE SECTION --- */}
        <div className="relative aspect-[4/5] w-full overflow-hidden border-b border-slate-100 dark:border-slate-800/50">
          <img 
            src={asset.imageUrl} 
            alt={asset.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60" />

          {/* Live Indicator - Using SetCard mobile scale */}
          <div className="absolute top-1.5 right-1.5 md:top-3 md:right-3 flex items-center gap-1 md:gap-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-1.5 py-0.5 md:px-2.5 md:py-1 border border-white/20 shadow-sm z-10">
            <div className="h-1 w-1 md:h-1.5 md:w-1.5 rounded-full bg-[#00BA88] animate-pulse" />
            <span className="text-[7px] md:text-[9px] font-black uppercase tracking-tighter text-slate-900 dark:text-white">
              Live
            </span>
          </div>
        </div>

        {/* --- CONTENT SECTION --- */}
        <div className="p-3 md:p-5 space-y-2.5 md:space-y-4">
          <div className="space-y-1">
            {/* Title - Using SetCard mobile scale */}
            <h3 className="text-[12px] md:text-base font-black text-slate-900 dark:text-white leading-[1.2] group-hover:text-[#00BA88] transition-colors line-clamp-2 md:line-clamp-1">
              {asset.name}
            </h3>
            
            {/* Metadata Row - Fixed for collision */}
            <div className="flex items-center justify-between gap-1 pt-0.5">
              <span className="text-[9px] md:text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                #{asset.number}
              </span>

              {/* Trend Badge - Using SetCard scale/colors */}
              <div className={cn(
                "flex items-center gap-0.5 md:gap-1 px-1.5 py-0.5 md:px-2 md:py-1 rounded-md md:rounded-lg border tabular-nums",
                isPositive 
                  ? "text-[#00BA88] bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-[#00BA88]/20" 
                  : "text-rose-500 bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20"
              )}>
                <TrendingUp className={cn("w-2.5 h-2.5 md:w-3 md:h-3", !isPositive && "rotate-180")} strokeWidth={3} />
                <span className="text-[9px] md:text-[10px] font-black">
                  {asset.change}
                </span>
              </div>
            </div>
          </div>
          
          {/* Action Button - Optimized for mobile tap targets */}
          <div className="pt-0.5">
            <div className="w-full py-2 md:py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg md:rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:bg-[#00BA88] dark:hover:bg-[#00BA88] hover:text-white dark:hover:text-white">
              View <span className="hidden sm:inline">Market</span> Intel
              <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4" strokeWidth={3} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}