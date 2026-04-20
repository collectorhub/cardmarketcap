// components/sets/AssetCard.tsx
"use client"

import React from 'react'
import Link from 'next/link'
import { TrendingUp } from 'lucide-react'

interface AssetCardProps {
  asset: {
    id: string;
    name: string;
    number?: string;
    price: string;
    imageUrl: string;
    canonicalUrl?: string; // Optional field from API
    type?: string;
  };
}

export function AssetCard({ asset }: AssetCardProps) {
  // Routing logic: matches your MarketTable logic
  const detailHref = asset.canonicalUrl 
    ? `/card${asset.canonicalUrl}` 
    : `/card/${asset.id}`;

  return (
    <Link href={detailHref} className="group block">
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-white/5 p-4 md:p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-[#00BA88]/10 hover:-translate-y-2">
        
        {/* Image Container */}
        <div className="relative aspect-[3/4] mb-6 flex items-center justify-center p-2">
          <img 
            src={asset.imageUrl} 
            alt={asset.name}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-xl"
            loading="lazy"
          />
        </div>

        {/* Card Info */}
        <div className="space-y-3">
          <div className="flex justify-between items-start gap-2">
            <div className="min-w-0">
              <h4 className="text-[13px] md:text-[15px] font-black text-slate-900 dark:text-white truncate uppercase tracking-tight font-sora">
                {asset.name}
              </h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                #{asset.number || "000"} • {asset.type || "Asset"}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Market Price</span>
              <span className="text-sm md:text-base font-black text-slate-900 dark:text-white tabular-nums">
                {asset.price}
              </span>
            </div>
            <div className="flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">
              <TrendingUp size={12} />
              <span className="text-[10px] font-black">0.0%</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}