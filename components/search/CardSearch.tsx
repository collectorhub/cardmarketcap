"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Search, X, Flame, SlidersHorizontal, 
  ArrowUpRight, Sparkles, Zap, Wand2, 
  Star, Anchor, Trophy
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AssetCard } from "@/components/sets/AssetCard";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchCMCCards, fetchTrendingCards } from "@/lib/queries/market";

const CATEGORIES = [
  { name: "Pokémon", icon: Zap, color: "hover:text-[#00BA88] border-[#00BA88]", active: "text-[#00BA88] border-[#00BA88]" },
  { name: "Magic", icon: Wand2, color: "hover:bg-purple-500/10 hover:text-purple-600", active: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  { name: "Lorcana", icon: Star, color: "hover:bg-amber-500/10 hover:text-amber-600", active: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  { name: "One Piece", icon: Anchor, color: "hover:bg-blue-500/10 hover:text-blue-600", active: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  { name: "Sports", icon: Trophy, color: "hover:bg-orange-500/10 hover:text-orange-600", active: "bg-orange-500/10 text-orange-600 border-orange-500/20" }
];

const LoadingGrid = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
    {[...Array(10)].map((_, i) => (
      <div key={i} className="space-y-4">
        <Skeleton className="aspect-[3/4] w-full rounded-2xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

export default function CardSearch() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [trendingAssets, setTrendingAssets] = useState<any[]>([]);
  const [popularAssets, setPopularAssets] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Helper to normalize API data to ensure 'imageUrl' property exists for AssetCard
  const normalizeData = (data: any[]) => {
    return (data || []).map(item => ({
      ...item,
      // We map the incoming image data to 'imageUrl' to match your AssetCard props
      imageUrl: item.imageUrl || item.image || item.largeImage || item.image_url 
    }));
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const [trending, popular] = await Promise.all([
          fetchTrendingCards(),
          fetchCMCCards(1, "", "top", "all")
        ]);
        setTrendingAssets(normalizeData(trending));
        setPopularAssets(normalizeData(popular.data));
      } catch (error) {
        console.error("Failed to fetch initial data", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const handleSearch = useCallback(async (q: string, cat: string | null) => {
    if (!q && !cat) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    try {
      const categoryParam = cat ? cat.toLowerCase() : "all";
      const results = await fetchCMCCards(1, q, "top", categoryParam);
      setSearchResults(normalizeData(results.data));
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(query, selectedCategory);
    }, 600); 
    return () => clearTimeout(timer);
  }, [query, selectedCategory, handleSearch]);

  const toggleCategory = (catName: string) => {
    setSelectedCategory(selectedCategory === catName ? null : catName);
  };

  const isFiltering = query || selectedCategory;
  const displayAssets = isFiltering ? searchResults : trendingAssets;
  const showSkeletons = isLoading || (isFiltering && isSearching);

  return (
    <div className="space-y-1 md:space-y-20 animate-in fade-in duration-1000 pt-23 md:pt-15 pb-20">
      
      {/* --- HERO SEARCH SECTION --- */}
      <section className="flex flex-col items-center text-center space-y-8 md:space-y-10">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-[#00BA88] font-bold text-[11px] uppercase tracking-[0.2em]">
            <span className="flex h-2 w-2 rounded-full bg-[#00BA88] animate-pulse" />
            Global Asset Discovery
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Find your next <span className="text-[#00BA88]">Asset.</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs md:text-lg max-w-2xl mx-auto leading-relaxed font-medium px-4">
            Search across 1.2M+ indexed cards and real-time market valuations.
          </p>
        </div>

        {/* Neural Search Bar */}
        <div className="relative w-full max-w-3xl px-4 group">
          <div className={cn(
            "absolute -inset-0.5 bg-gradient-to-r from-[#00BA88] to-emerald-500 rounded-2xl opacity-0 blur-md transition-all duration-500",
            isFocused && "opacity-15"
          )} />
          
          <div className={cn(
            "relative flex items-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border transition-all duration-300 rounded-2xl overflow-hidden",
            isFocused ? "border-[#00BA88]/40 shadow-lg" : "border-slate-200 dark:border-white/5"
          )}>
            <div className={cn(
              "flex items-center w-full px-5 transition-all duration-500",
              !isFocused && !query ? "justify-center" : "justify-start"
            )}>
              <Search size={20} className={cn("shrink-0", isFocused ? "text-[#00BA88]" : "text-slate-400")} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name or rarity..."
                className={cn(
                  "bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white text-sm md:text-base font-bold py-3 outline-none",
                  !isFocused && !query ? "w-auto px-3 text-center" : "w-full px-4 text-left"
                )}
              />
            </div>
            {(isFocused || query) && (
              <button onMouseDown={(e) => { e.preventDefault(); setQuery(""); }} className="absolute right-4 p-1.5 text-slate-400 hover:text-[#00BA88]">
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="hidden md:flex flex-wrap justify-center gap-3">
          {CATEGORIES.map((cat) => (
            <button 
              key={cat.name} 
              onClick={() => toggleCategory(cat.name)}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full transition-all duration-300",
                selectedCategory === cat.name ? cat.active : cat.color
              )}
            >
              <cat.icon size={16} />
              <span className="text-sm font-semibold">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* --- RESULTS SECTION --- */}
      <section className="space-y-6 md:space-y-8 px-4 md:px-0">
        <div className="space-y-1">
          <h3 className="text-lg md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <Flame className="h-5 w-5 text-orange-500" />
            {isFiltering ? "Search Results" : "Trending Cards"}
          </h3>
          <p className="text-[10px] md:text-sm font-medium text-slate-500 dark:text-slate-400 pl-8 md:pl-9">
            {showSkeletons ? "Syncing with live marketplace..." : isFiltering ? `Displaying ${displayAssets.length} matches` : "Most active assets in the last 24 hours"}
          </p>
        </div>

        {showSkeletons ? (
          <LoadingGrid />
        ) : displayAssets.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
            {displayAssets.map((asset) => (
              <AssetCard key={asset.id} asset={asset} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center space-y-4 bg-white dark:bg-white/5 rounded-3xl border border-dashed border-slate-200 dark:border-white/10">
            <Search className="mx-auto text-slate-300" size={48} />
            <p className="text-slate-500 font-bold">No assets found matching your criteria.</p>
            <button onClick={() => {setQuery(""); setSelectedCategory(null);}} className="text-[#00BA88] text-sm font-black uppercase tracking-widest">Reset Search</button>
          </div>
        )}
      </section>
{/* --- POPULAR SECTION --- */}
{!isFiltering && (
  <section className="space-y-6 md:space-y-8 px-4 md:px-0">
    <div className="space-y-1">
      <h3 className="text-lg md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
        <Sparkles className="h-5 w-5 text-[#00BA88]" />
        Popular Cards
      </h3>
      {/* Added paragraph text here */}
      <p className="text-[10px] md:text-sm font-medium text-slate-500 dark:text-slate-400 pl-8 md:pl-9">
        All-time fan favorites and community staples.
      </p>
    </div>

    {isLoading ? (
      <LoadingGrid />
    ) : (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
        {popularAssets.map((asset) => (
          <AssetCard key={`pop-${asset.id}`} asset={asset} />
        ))}
      </div>
    )}
  </section>
)}
    </div>
  );
}