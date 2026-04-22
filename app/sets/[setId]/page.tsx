"use client";

import React, { useState, useRef, useEffect, use } from 'react';
import { 
  Search, Activity, X, ArrowLeft
} from "lucide-react";
import { useRouter } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { AssetCard } from "@/components/sets/AssetCard";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { fetchSetDetails } from "@/lib/queries/market"; 

function AssetCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-white/5 p-4 md:p-6 space-y-4">
      <div className="relative aspect-[3/4] w-full">
        <Skeleton className="w-full h-full rounded-2xl" />
      </div>
      <div className="space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4 rounded-md" />
          <Skeleton className="h-3 w-1/2 rounded-md" />
        </div>
        <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-2 w-8" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-6 w-12 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default function SetDetailsPage({ params }: { params: Promise<{ setId: string }> }) {
  const resolvedParams = use(params);
  const setId = resolvedParams.setId;

  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const [setInfo, setSetInfo] = useState<any>(null);
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [gameContext, setGameContext] = useState("pokemon");

  useEffect(() => {
  async function loadData() {
    if (!setId) return;
    setLoading(true);

    const decodedId = decodeURIComponent(setId).toUpperCase();
    let game = "pokemon"; // Default fallback

    // 1. ONE PIECE: Match your getGameFromSetId logic
    if (/^(OP|EB|ST|PRB)\d+/.test(decodedId) || decodedId === 'P') {
      game = "onepiece";
    } 
    // 2. LORCANA: Match your getGameFromSetId list exactly
    else if (
      ['TFC', 'ROTF', 'ITI', 'UR', 'Q1', 'D100', 'C1', 'D23C24', 
       'P2', 'SS', 'AZS', 'ARI', 'ROJ', 'FBL', 'P3', 'C2', 'WITW', 'WNTR'].includes(decodedId) || 
      decodedId.startsWith('LOR')
    ) {
      game = "lorcana";
    }
    // 3. MAGIC: Match your getGameFromSetId logic (checks length === 3)
    // IMPORTANT: This stays AFTER Lorcana so 'TFC' or 'FBL' aren't stolen by MTG
    else if (decodedId.includes('MTG') || decodedId.length === 3) {
      game = "mtg";
    }
    
    setGameContext(game);

    // 2. Fetch data
    const result = await fetchSetDetails(setId);
    
    if (result.success && result.set) {
      setSetInfo(result.set);
      setAssets(result.assets || []);
    } else {
      setSetInfo(null);
    }
    setLoading(false);
  }
  loadData();
}, [setId]);

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.history.length > 1) router.back();
    else router.push('/sets');
  };

  const filteredAssets = assets.filter(asset => 
    asset.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    asset.number?.includes(searchQuery)
  );

  if (loading) return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950">
      <Navbar />
      <div className="lg:hidden"><Sidebar /></div>
      <main className="max-w-[1600px] mx-auto px-4 md:px-10 pt-24 md:pt-12 pb-32">
        <header className="flex flex-col-reverse lg:flex-row items-start lg:items-center gap-8 mb-12">
          <Skeleton className="w-full h-70 md:w-60 md:h-60 rounded-[2.5rem]" />
          <div className="flex-1 space-y-4 w-full">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-12 w-3/4 md:w-1/2" />
            <Skeleton className="h-4 w-full max-w-2xl" />
          </div>
        </header>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
          {[...Array(10)].map((_, i) => <AssetCardSkeleton key={i} />)}
        </div>
      </main>
    </div>
  );

  if (!setInfo) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-6">
      <h1 className="text-white font-black text-2xl">Set Not Found</h1>
      <button onClick={() => router.push('/sets')} className="px-6 py-2 bg-[#00BA88] text-white rounded-xl font-bold">Return to Sets</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 selection:bg-brand/30">
      <Navbar />
      <div className="lg:hidden"><Sidebar /></div>

      <div className="border-b border-slate-200 dark:border-white/5 bg-white/50 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-20 pt-15 md:pt-0">
        <div className="max-w-[1600px] mx-auto px-4 md:px-10 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4 text-[10px] md:text-[11px] font-black uppercase tracking-[0.1em] text-slate-400">
            <button onClick={handleBack} className="hover:text-[#00BA88] transition-colors flex items-center gap-2 cursor-pointer group">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
              <span>Back</span>
            </button>
            <span className="opacity-20">/</span>
            <span className="text-[#00BA88] truncate max-w-[150px] md:max-w-none">{setInfo.name}</span>
          </div>
          <div className="flex items-center gap-4">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">
               Cap: <span className="text-slate-900 dark:text-white">{setInfo.marketCap || "$0.00"}</span>
             </span>
          </div>
        </div>
      </div>

      <main className="relative max-w-[1600px] mx-auto px-4 md:px-10 pt-8 md:pt-12 pb-32">
        <header className="flex flex-col-reverse lg:flex-row items-start lg:items-center gap-8 mb-12">
          <div className="relative group shrink-0 w-full lg:w-auto">
            <div className="relative w-full h-70 md:w-60 md:h-60 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/10 flex items-center justify-center p-10 shadow-premium overflow-hidden">
               <img src={setInfo.logoUrl} className="relative w-full h-full object-contain z-10 filter drop-shadow-2xl" alt={setInfo.name} />
            </div>
          </div>

          <div className="flex-1 space-y-4 w-full">
            <div className="flex items-center gap-2 text-[#00BA88] font-bold text-[11px] uppercase tracking-widest">
  <span className="flex h-2 w-2 rounded-full bg-[#00BA88] animate-pulse" />
  {gameContext === "pokemon" ? `${setInfo.series} Era` : 
   gameContext === "lorcana" ? "Disney Lorcana" : 
   gameContext === "mtg" ? "Magic: The Gathering" : 
   "One Piece TCG"}
</div>
            <h1 className="text-2xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {setInfo.name} <span className="text-[#00BA88]">Assets</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-lg max-w-2xl leading-relaxed font-medium">
              Released on {setInfo.releaseDate}. Explore {setInfo.totalCards} unique assets indexed in the live market.
            </p>
          </div>
        </header>

        <div className="mb-12">
          <div className="relative group max-w-[1600px] mx-auto">
            <div className={cn("absolute -inset-0.5 bg-gradient-to-r from-[#00BA88] to-emerald-500 rounded-2xl opacity-0 blur-md transition-opacity duration-500", isFocused && "opacity-15")} />
            <div className={cn("relative flex items-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border transition-all duration-300 rounded-2xl overflow-hidden", isFocused ? "border-[#00BA88]/40 shadow-[0_0_20px_-12px_rgba(0,186,136,0.3)]" : "border-slate-200 dark:border-white/5")}>
              <div className={cn("flex items-center w-full transition-all duration-500 ease-out px-5", !isFocused && !searchQuery ? "justify-center" : "justify-start")}>
                <Search size={18} className={cn("transition-colors duration-300 shrink-0", isFocused ? "text-[#00BA88]" : "text-slate-400")} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search cards in ${setInfo.name}...`}
                  className={cn("bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-400/50 text-sm md:text-base font-bold py-3 outline-none transition-all duration-500", !isFocused && !searchQuery ? "w-auto px-3 text-center" : "w-full px-4 text-left")}
                />
              </div>
              {(isFocused || searchQuery) && (
                <button onMouseDown={(e) => { e.preventDefault(); setSearchQuery(""); }} className="absolute right-4 p-1.5 text-slate-400 hover:text-[#00BA88] transition-all">
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-8 px-1">
          <div className="space-y-1">
            <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <Activity className="h-6 w-6 text-[#00BA88]" strokeWidth={2.5} />
              Market Index
            </h3>
            <p className="text-[10px] md:text-sm font-medium text-slate-500 dark:text-slate-400 pl-9">
              Real-time floor prices and population metrics for {setInfo.name}.
            </p>
          </div>
          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/10">
            {filteredAssets.length} Assets found
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
          {filteredAssets.map((asset) => (
            <AssetCard 
              key={asset.id} 
              asset={{ 
                ...asset, 
                game: gameContext // CRITICAL: This ensures detail links have ?game=...
              }} 
            />
          ))}
        </div>
      </main>
    </div>
  );
}