"use client";

import React, { useState, useRef, useMemo } from 'react';
import { 
  Search, X, Flame, SlidersHorizontal, 
  ArrowUpRight, TrendingUp, Activity, Sparkles,
  Zap, Wand2, Star, Anchor, Trophy
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AssetCard } from "@/components/sets/AssetCard";

const CATEGORIES = [
  { name: "Pokémon", icon: Zap, color: "hover:text-[#00BA88] border-[#00BA88]", active: "text-[#00BA88] border-[#00BA88]" },
  { name: "Magic", icon: Wand2, color: "hover:bg-purple-500/10 hover:text-purple-600", active: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  { name: "Lorcana", icon: Star, color: "hover:bg-amber-500/10 hover:text-amber-600", active: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  { name: "One Piece", icon: Anchor, color: "hover:bg-blue-500/10 hover:text-blue-600", active: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  { name: "Sports", icon: Trophy, color: "hover:bg-orange-500/10 hover:text-orange-600", active: "bg-orange-500/10 text-orange-600 border-orange-500/20" }
];

const MOCK_ASSETS = [
  { id: '1', category: 'Pokémon', number: '183/182', name: 'Roaring Moon ex', rarity: 'Special Illustration Rare', price: '74.20', change: '+5.2%', imageUrl: 'https://images.pokemontcg.io/sv4/183.png' },
  { id: '2', category: 'Pokémon', number: '187/182', name: 'Iron Valiant ex', rarity: 'Special Illustration Rare', price: '42.15', change: '-2.1%', imageUrl: 'https://images.pokemontcg.io/sv4/187.png' },
  { id: '3', category: 'Pokémon', number: '251/182', name: 'Gholdengo ex', rarity: 'Special Illustration Rare', price: '32.50', change: '+1.4%', imageUrl: 'https://images.pokemontcg.io/sv4/252.png' },
  { id: '4', category: 'Pokémon', number: '170/182', name: 'Mela', rarity: 'Special Illustration Rare', price: '22.10', change: '+0.8%', imageUrl: 'https://images.pokemontcg.io/sv4/254.png' },
  { id: '5', category: 'Pokémon', number: '226/182', name: "Professor Sada's Vitality", rarity: 'Ultra Rare', price: '18.45', change: '+12.5%', imageUrl: 'https://images.pokemontcg.io/sv4/256.png' },
  { id: '6', category: 'Magic', number: '001', name: 'Black Lotus', rarity: 'Mythic Rare', price: '15000.00', change: '+0.5%', imageUrl: 'https://images.pokemontcg.io/sv4/257.png' },
];

export default function CardSearch() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredAssets = useMemo(() => {
    return MOCK_ASSETS.filter(asset => {
      const matchesQuery = asset.name.toLowerCase().includes(query.toLowerCase()) || 
                           asset.rarity.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = selectedCategory ? asset.category === selectedCategory : true;
      return matchesQuery && matchesCategory;
    });
  }, [query, selectedCategory]);

  const toggleCategory = (catName: string) => {
    setSelectedCategory(selectedCategory === catName ? null : catName);
  };

  return (
    // Reduced space-y from 20 to 12 on mobile to pull sections closer
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
            Search across 1.2M+ indexed cards, collectibles, and real-time market valuations.
          </p>
        </div>

        {/* Neural Elastic Search Bar */}
        <div className="relative w-full max-w-3xl px-4 group">
          <div className={cn(
            "absolute -inset-0.5 bg-gradient-to-r from-[#00BA88] to-emerald-500 rounded-2xl opacity-0 blur-md transition-all duration-500",
            isFocused && "opacity-15"
          )} />
          
          <div className={cn(
            "relative flex items-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border transition-all duration-300 rounded-2xl overflow-hidden",
            isFocused 
              ? "border-[#00BA88]/40 shadow-[0_0_20px_-12px_rgba(0,186,136,0.3)]" 
              : "border-slate-200 dark:border-white/5"
          )}>
            <div className={cn(
              "flex items-center w-full transition-all duration-500 ease-out px-5",
              !isFocused && !query ? "justify-center" : "justify-start"
            )}>
              <Search 
                size={20} 
                className={cn(
                  "transition-colors duration-300 shrink-0",
                  isFocused ? "text-[#00BA88]" : "text-slate-400"
                )} 
              />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name or rarity..."
                className={cn(
                  "bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-400/50 text-sm md:text-base font-bold py-3 outline-none transition-all duration-500",
                  !isFocused && !query ? "w-auto px-3 text-center" : "w-full px-4 text-left"
                )}
              />
            </div>
            {(isFocused || query) && (
              <div className="absolute right-4">
                <button 
                  onMouseDown={(e) => { e.preventDefault(); setQuery(""); }}
                  className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-[#00BA88] transition-all"
                >
                  <X size={18} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Category Discovery Chips (Functional) */}
        {/* On mobile, this container is hidden, so we remove the space it would have occupied */}
        <div className="hidden md:flex flex-wrap justify-center gap-3">
          {CATEGORIES.map((cat) => (
            <button 
              key={cat.name} 
              onClick={() => toggleCategory(cat.name)}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full transition-all duration-300 group cursor-pointer",
                selectedCategory === cat.name ? cat.active : cat.color
              )}
            >
              <cat.icon size={16} color='#00BA88'/>
              <span className="text-sm font-semibold">
                {cat.name}
              </span>
            </button>
          ))}
          <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-full hover:opacity-90 transition-all shadow-premium">
            <SlidersHorizontal size={14} />
            <span className="text-[11px] font-black uppercase tracking-widest">Advanced</span>
          </button>
        </div>
      </section>

      {/* --- TRENDING ASSETS --- */}
      <section className="space-y-6 md:space-y-8 px-4 md:px-0">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg md:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <Flame className="h-5 w-5 md:h-6 md:w-6 text-orange-500" strokeWidth={2.5} />
              Trending Cards
            </h3>
            <p className="text-[10px] md:text-sm font-medium text-slate-500 dark:text-slate-400 pl-8 md:pl-9">
              {query || selectedCategory ? `Showing ${filteredAssets.length} results` : "Most active assets in the last 24 hours"}
            </p>
          </div>
          <button className="text-[10px] hidden md:flex font-black text-[#00BA88] uppercase tracking-[0.2em] items-center gap-2 group">
            Explore All <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {filteredAssets.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
            {filteredAssets.map((asset) => (
              <AssetCard key={asset.id} asset={asset} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center space-y-4 bg-white dark:bg-white/5 rounded-3xl border border-dashed border-slate-200 dark:border-white/10">
            <Search className="mx-auto text-slate-300" size={48} />
            <p className="text-slate-500 font-bold">No assets found matching your criteria.</p>
            <button onClick={() => {setQuery(""); setSelectedCategory(null);}} className="text-[#00BA88] text-sm font-black uppercase tracking-widest">Clear all filters</button>
          </div>
        )}
      </section>

      {/* --- POPULAR ASSETS --- */}
      {!query && !selectedCategory && (
        <section className="space-y-6 md:space-y-8 px-4 md:px-0">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg md:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-[#00BA88]" strokeWidth={2.5} />
                Popular Cards
              </h3>
              <p className="text-[10px] md:text-sm font-medium text-slate-500 dark:text-slate-400 pl-8 md:pl-9">
                Highly coveted assets with consistent demand
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
            {[...MOCK_ASSETS].reverse().map((asset) => (
              <AssetCard key={`pop-${asset.id}`} asset={asset} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}