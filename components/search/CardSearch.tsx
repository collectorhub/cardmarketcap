"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Search, X, Flame, Sparkles, Zap, Wand2, 
  Star, Anchor, Trophy, LayoutGrid, Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AssetCard } from "@/components/sets/AssetCard";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchCMCCards, fetchTrendingCards, fetchExpansions } from "@/lib/queries/market";
import { fetchUniversalSearch } from "@/lib/queries/search";
import { SearchResult } from '@/types/search';
import { RandomSetScroller } from '@/components/search/RandomSetScroller';

const CATEGORIES = [
  { id: "pokemon", name: "Pokémon", icon: Zap },
  { id: "mtg", name: "Magic", icon: Wand2 },
  { id: "lorcana", name: "Lorcana", icon: Star },
  { id: "onepiece", name: "One Piece", icon: Anchor },
  { id: "sports", name: "Sports", icon: Trophy, isComingSoon: true }
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
  const [quickSetLinks, setQuickSetLinks] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const getAssetImage = (asset: any) => {
    return asset.image_large || asset.image_medium || asset.image_small || asset.imageUrl || asset.image || asset.image_url;
  };

  const normalizeData = (data: any[]) => {
    return (data || []).map(item => ({
      ...item,
      imageUrl: getAssetImage(item),
      href: item.canonical_path || item.url || item.href || `/card/${item.id}`
    }));
  };

  const loadInitialData = useCallback(async (category: string | null) => {
    setIsLoading(true);
    try {
      const gameParam = category || "pokemon";
      const [trending, popular, setsResponse] = await Promise.all([
        fetchTrendingCards(),
        fetchCMCCards(1, "", "top", "all", "psa 10", gameParam),
        fetchExpansions(gameParam, "", 1)
      ]);
      
      const filteredTrending = category 
        ? trending.filter((t: any) => t.game?.toLowerCase() === category.toLowerCase() || category === "pokemon")
        : trending;

      setTrendingAssets(normalizeData(filteredTrending));
      setPopularAssets(normalizeData(popular.data));
      
      if (setsResponse.success) {
        setQuickSetLinks(setsResponse.data.slice(0, 12));
      }
    } catch (error) {
      console.error("Failed to fetch initial data", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      loadInitialData(selectedCategory);
    }
  }, [selectedCategory, query.length, loadInitialData]);

  const performSearch = useCallback(async (searchQuery: string, categoryId: string | null) => {
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      // The PHP backend now handles splitting "Charizard Skyridge" or looking up "4/144"
      const results = await fetchUniversalSearch(trimmedQuery, categoryId, 100);
      setSearchResults(results);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query, selectedCategory);
    }, 400); // Slightly increased debounce for more complex backend queries
    return () => clearTimeout(timer);
  }, [query, selectedCategory, performSearch]);

  const toggleCategory = (cat: any) => {
    if (cat.isComingSoon) return;
    const newCategoryId = selectedCategory === cat.id ? null : cat.id;
    setSelectedCategory(newCategoryId);
  };

  const isFiltering = query.trim().length >= 2;
  const displayAssets = isFiltering ? searchResults : trendingAssets;
  const showSkeletons = isLoading || (isFiltering && isSearching);
  
  const currentCategoryName = CATEGORIES.find(c => c.id === selectedCategory)?.name;
  const sectionTitle = isFiltering 
    ? `${currentCategoryName || 'Universal'} Results` 
    : selectedCategory 
      ? `Trending ${currentCategoryName}` 
      : "Trending Cards";

  return (
    <div className="space-y-1 md:space-y-20 animate-in fade-in duration-1000 pt-23 md:pt-15 pb-20">
      
      <section className="flex flex-col items-center text-center space-y-8 md:space-y-12">
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

        {/* Search Input */}
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
                placeholder="Search name, set, or card number..."
                className={cn(
                  "bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white text-sm md:text-base font-bold py-3 outline-none",
                  !isFocused && !query ? "w-auto px-3 text-center" : "w-full px-4 text-left"
                )}
              />
            </div>
            {(isFocused || query) && (
              <button 
                onMouseDown={(e) => { e.preventDefault(); setQuery(""); }} 
                className="absolute right-4 p-1.5 text-slate-400 hover:text-[#00BA88]"
              >
                <X size={18} />
              </button>
            )}
          </div>
          
          {/* Pro Tip Hint for the New Feature */}
          {/* <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-medium">
             <Info size={12} className="text-[#00BA88]" />
             <span>Try searching <span className="text-slate-600 dark:text-slate-200 font-bold italic">"Charizard Skyridge"</span> or a card number like <span className="text-slate-600 dark:text-slate-200 font-bold italic">"4/144"</span></span>
          </div> */}
        </div>

        {!isFiltering && (
          <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-1000 overflow-hidden">
            <RandomSetScroller />
          </div>
        )}

        <div className="hidden md:flex flex-wrap justify-center gap-3">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button 
                key={cat.id} 
                onClick={() => toggleCategory(cat)}
                className={cn(
                  "group relative flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-white/5 border rounded-full transition-all duration-300",
                  cat.isComingSoon 
                    ? "opacity-40 cursor-not-allowed grayscale border-slate-200 dark:border-white/10" 
                    : isActive 
                      ? "border-[#00BA88] text-[#00BA88] shadow-[0_0_15px_rgba(0,186,136,0.1)]" 
                      : "border-slate-200 dark:border-white/10 hover:border-[#00BA88] hover:text-[#00BA88] text-slate-600 dark:text-slate-400"
                )}
              >
                <cat.icon size={16} className={cn(isActive && "animate-pulse")} />
                <span className="text-sm font-bold tracking-tight">{cat.name}</span>
                {cat.isComingSoon && (
                  <span className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-orange-500 text-[8px] font-black text-white rounded-full uppercase tracking-tighter">
                    Soon
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* --- RESULTS SECTION --- */}
      <section className="space-y-6 md:space-y-8 px-4 md:px-0">
        <div className="space-y-1">
          <h3 className="text-lg md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <Flame className="h-5 w-5 text-orange-500" />
            {sectionTitle}
          </h3>
          <p className="text-[10px] md:text-sm font-medium text-slate-500 dark:text-slate-400 pl-8 md:pl-9">
            {showSkeletons ? "Searching index..." : isFiltering ? `Displaying top matches` : `Most active ${currentCategoryName || ''} assets in the last 24 hours`}
          </p>
        </div>

        {showSkeletons ? (
          <LoadingGrid />
        ) : displayAssets.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
            {displayAssets.map((asset, idx) => (
              <AssetCard 
                key={`${asset.asset_id || asset.id}-${idx}`} 
                asset={{ 
                  ...asset, 
                  imageUrl: getAssetImage(asset),
                  href: asset.canonical_path || asset.url || asset.href || `/card/${asset.id}`
                }} 
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center space-y-4 bg-white dark:bg-white/5 rounded-3xl border border-dashed border-slate-200 dark:border-white/10">
            <Search className="mx-auto text-slate-300" size={48} />
            <p className="text-slate-500 font-bold">No assets found matching your criteria.</p>
            <button 
              onClick={() => {setQuery(""); setSelectedCategory(null);}} 
              className="text-[#00BA88] text-sm font-black uppercase tracking-widest"
            >
              Reset Search
            </button>
          </div>
        )}
      </section>

      {/* --- POPULAR SECTION --- */}
      {!isFiltering && (
        <section className="space-y-6 md:space-y-8 px-4 md:px-0">
          <div className="space-y-1">
            <h3 className="text-lg md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-[#00BA88]" />
              Popular {currentCategoryName || 'Cards'}
            </h3>
            <p className="text-[10px] md:text-sm font-medium text-slate-500 dark:text-slate-400 pl-8 md:pl-9">
              All-time fan favorites and community staples.
            </p>
          </div>

          {isLoading ? (
            <LoadingGrid />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
              {popularAssets.map((asset, idx) => (
                <AssetCard 
                  key={`pop-${asset.id}-${idx}`} 
                  asset={{
                    ...asset,
                    imageUrl: getAssetImage(asset),
                    href: asset.canonical_path || asset.url || asset.href || `/card/${asset.id}`
                  }} 
                />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}