// components/sets/SetDetailsClientContainer.tsx
"use client";

import React, { useState, useMemo } from 'react';
import { Search, Activity, X, ArrowLeft } from "lucide-react";
import { useRouter } from 'next/navigation';
import { AssetCard } from "./AssetCard";
import { cn } from "@/lib/utils";

interface Props {
  initialSet: any;
  initialAssets: any[];
}

export function SetDetailsClientContainer({ initialSet, initialAssets }: Props) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const filteredAssets = useMemo(() => {
    return initialAssets.filter(asset => 
      asset.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      asset.number?.includes(searchQuery)
    );
  }, [initialAssets, searchQuery]);

  if (!initialSet) return <div className="text-center py-20">Set not found</div>;

  return (
    <>
      {/* Sticky Header */}
      <div className="border-b border-slate-200 dark:border-white/5 bg-white/50 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-20 pt-15 md:pt-0">
        <div className="max-w-[1600px] mx-auto px-4 md:px-10 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest text-slate-400">
            <button onClick={() => router.back()} className="hover:text-[#00BA88] flex items-center gap-2 cursor-pointer group">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
              <span>Back</span>
            </button>
            <span className="opacity-20">/</span>
            <span className="text-[#00BA88]">{initialSet.name}</span>
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase">
            Cap: <span className="text-slate-900 dark:text-white">{initialSet.marketCap}</span>
          </span>
        </div>
      </div>

      <main className="max-w-[1600px] mx-auto px-4 md:px-10 pt-8 md:pt-12 pb-32">
        {/* Set Header */}
        <header className="flex flex-col-reverse lg:flex-row items-start lg:items-center gap-8 mb-12">
          <div className="relative w-full h-70 md:w-60 md:h-60 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/10 flex items-center justify-center p-10 shadow-premium">
            <img src={initialSet.logoUrl} className="w-full h-full object-contain filter drop-shadow-2xl" alt={initialSet.name} />
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2 text-[#00BA88] font-bold text-[11px] uppercase tracking-widest">
              <span className="flex h-2 w-2 rounded-full bg-[#00BA88] animate-pulse" />
              {initialSet.series} Era
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              {initialSet.name} <span className="text-[#00BA88]">Assets</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              Released on {initialSet.releaseDate}. Explore {initialSet.totalCards} unique assets.
            </p>
          </div>
        </header>

        {/* Search Bar */}
        <div className="mb-12">
          <div className={cn(
            "relative flex items-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border rounded-2xl transition-all duration-300",
            isFocused ? "border-[#00BA88]/40 shadow-lg" : "border-slate-200 dark:border-white/5"
          )}>
            <div className="flex items-center w-full px-5">
              <Search size={18} className={isFocused ? "text-[#00BA88]" : "text-slate-400"} />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${initialSet.name}...`}
                className="bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white w-full px-4 py-4 outline-none font-bold"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="text-slate-400 hover:text-red-500">
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Assets Grid */}
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <Activity className="h-6 w-6 text-[#00BA88]" />
            Market Index
          </h3>
          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-full">
            {filteredAssets.length} Assets
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
          {filteredAssets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      </main>
    </>
  );
}