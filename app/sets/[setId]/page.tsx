"use client";

import React, { useState, useRef } from 'react';
import { 
  TrendingUp, Calendar, Layers, 
  Search, Info, Activity, X,
  ArrowLeft
} from "lucide-react";
import { useRouter } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { AssetCard } from "@/components/sets/AssetCard"; // Path to your AssetCard component
import { cn } from "@/lib/utils";

const MOCK_SET_DETAILS = {
  name: "Paradox Rift",
  series: "Scarlet & Violet",
  releaseDate: "Nov 03, 2023",
  totalCards: 266,
  logoUrl: "https://images.pokemontcg.io/sv4/logo.png",
  marketCap: "$4,280.50",
};

// Mock data for the AssetCard mapping
const MOCK_ASSETS = [
  { id: '1', number: '183/182', name: 'Roaring Moon ex', rarity: 'Special Illustration Rare', price: '74.20', change: '+5.2%', imageUrl: 'https://images.pokemontcg.io/sv4/183.png' },
  { id: '2', number: '187/182', name: 'Iron Valiant ex', rarity: 'Special Illustration Rare', price: '42.15', change: '-2.1%', imageUrl: 'https://images.pokemontcg.io/sv4/187.png' },
  { id: '3', number: '251/182', name: 'Gholdengo ex', rarity: 'Special Illustration Rare', price: '32.50', change: '+1.4%', imageUrl: 'https://images.pokemontcg.io/sv4/252.png' },
  { id: '4', number: '170/182', name: 'Mela', rarity: 'Special Illustration Rare', price: '22.10', change: '+0.8%', imageUrl: 'https://images.pokemontcg.io/sv4/254.png' },
  { id: '5', number: '226/182', name: 'Professor Sada\'s Vitality', rarity: 'Ultra Rare', price: '18.45', change: '+12.5%', imageUrl: 'https://images.pokemontcg.io/sv4/256.png' },
  { id: '6', number: '228/182', name: 'Professor Turo\'s Scenario', rarity: 'Ultra Rare', price: '12.30', change: '-3.2%', imageUrl: 'https://images.pokemontcg.io/sv4/257.png' },
  { id: '4', number: '170/182', name: 'Mela', rarity: 'Special Illustration Rare', price: '22.10', change: '+0.8%', imageUrl: 'https://images.pokemontcg.io/sv4/254.png' },
  { id: '5', number: '226/182', name: 'Professor Sada\'s Vitality', rarity: 'Ultra Rare', price: '18.45', change: '+12.5%', imageUrl: 'https://images.pokemontcg.io/sv4/256.png' },
  { id: '6', number: '228/182', name: 'Professor Turo\'s Scenario', rarity: 'Ultra Rare', price: '12.30', change: '-3.2%', imageUrl: 'https://images.pokemontcg.io/sv4/257.png' },
  { id: '6', number: '228/182', name: 'Professor Turo\'s Scenario', rarity: 'Ultra Rare', price: '12.30', change: '-3.2%', imageUrl: 'https://images.pokemontcg.io/sv4/257.png' },
];

export default function SetDetailsPage({ params }: { params: { setId: string } }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/sets');
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    searchInputRef.current?.focus();
  };

  const filteredAssets = MOCK_ASSETS.filter(asset => 
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    asset.number.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 selection:bg-brand/30">
      <Navbar />
      
      <div className="lg:hidden">
        <Sidebar />
      </div>

      {/* --- PREMIUM UTILITY NAV (STICKY BREADCRUMB) --- */}
      <div className="border-b border-slate-200 dark:border-white/5 bg-white/50 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-20 pt-15 md:pt-0">
        <div className="max-w-[1600px] mx-auto px-4 md:px-10 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4 text-[10px] md:text-[11px] font-black uppercase tracking-[0.1em] text-slate-400">
            <button 
              onClick={handleBack} 
              className="hover:text-[#00BA88] transition-colors flex items-center gap-2 uppercase cursor-pointer group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
              <span>Back</span>
            </button>
            <span className="opacity-20">/</span>
            <span className="text-slate-600 dark:text-slate-400 hidden md:block">The Vault</span>
            <span className="opacity-20 hidden md:block">/</span>
            <span className="text-[#00BA88] truncate max-w-[150px] md:max-w-none">
              {MOCK_SET_DETAILS.name}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight hidden sm:inline">
               Index Status: <span className="text-emerald-500">Live</span>
             </span>
             <div className="h-3 w-px bg-slate-200 dark:bg-white/10 hidden sm:block" />
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">
               Cap: <span className="text-slate-900 dark:text-white">{MOCK_SET_DETAILS.marketCap}</span>
             </span>
          </div>
        </div>
      </div>

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#00BA88]/5 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <main className="relative max-w-[1600px] mx-auto px-4 md:px-10 pt-8 md:pt-12 pb-32">
        {/* HERO HEADER */}
        <header className="flex flex-col-reverse lg:flex-row items-start lg:items-center gap-0 md:gap-8 lg:gap-10 mb-12 md:mb-15">
          
          <div className="relative group shrink-0 w-full lg:w-auto">
            <div className="absolute -inset-4 bg-[#00BA88]/20 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative w-full h-70 md:w-60 md:h-60 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/10 flex items-center justify-center p-10 shadow-premium overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-slate-50 dark:from-white/5 opacity-50" />
               <img 
                 src={MOCK_SET_DETAILS.logoUrl} 
                 className="relative w-full h-full object-contain z-10 filter drop-shadow-2xl" 
                 alt={MOCK_SET_DETAILS.name} 
               />
            </div>
          </div>

          <div className="flex-1 space-y-4 md:space-y-6 w-full">
            <div className="space-y-2 md:space-y-4">
              <div className="flex items-center gap-2 text-[#00BA88] font-bold text-[11px] uppercase tracking-widest">
                <span className="flex h-2 w-2 rounded-full bg-[#00BA88] animate-pulse" />
                {MOCK_SET_DETAILS.series} Era
              </div>
              <h1 className="text-2xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                {MOCK_SET_DETAILS.name} <span className="text-[#00BA88]">Assets</span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm md:text-lg max-w-2xl leading-relaxed font-medium">
                Released on {MOCK_SET_DETAILS.releaseDate}. Explore {MOCK_SET_DETAILS.totalCards} unique assets currently indexed in the live market database.
              </p>
            </div>

            <div className="hidden lg:flex flex-wrap items-center gap-x-10 gap-y-6 pt-2">
              {[
                { label: "Market Cap", value: MOCK_SET_DETAILS.marketCap, icon: TrendingUp, color: "text-emerald-500" },
                { label: "Population", value: MOCK_SET_DETAILS.totalCards, icon: Layers, color: "text-blue-500" },
                { label: "Volatility", value: "Low", icon: Info, color: "text-purple-500" },
                { label: "Status", value: "Verified", icon: Calendar, color: "text-orange-500" },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 flex items-center justify-center">
                    <stat.icon size={16} className={stat.color} />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                    <p className="text-lg font-black text-slate-900 dark:text-white tabular-nums leading-none">{stat.value}</p>
                  </div>
                  {i !== 3 && <div className="hidden xl:block h-8 w-px bg-slate-200 dark:bg-white/10 ml-6" />}
                </div>
              ))}
            </div>
          </div>
        </header>

        <div className="top-[70px] md:top-20 z-10 mb-12">
      <div className="relative group max-w-[1600px] mx-auto">
        {/* Animated Glow Border */}
        <div className={cn(
          "absolute -inset-0.5 bg-gradient-to-r from-[#00BA88] to-emerald-500 rounded-2xl opacity-0 blur-md transition-opacity duration-500",
          isFocused && "opacity-15"
        )} />
        
        <div className={cn(
          "relative flex items-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border transition-all duration-300 rounded-2xl overflow-hidden",
          isFocused 
            ? "border-[#00BA88]/40 shadow-[0_0_20px_-12px_rgba(0,186,136,0.3" 
            : "border-slate-200 dark:border-white/5"
        )}>
          
          {/* Centering Wrapper: This div handles the sliding logic */}
          <div className={cn(
            "flex items-center w-full transition-all duration-500 ease-out px-5",
            !isFocused && !searchQuery ? "justify-center" : "justify-start"
          )}>
            
            <Search 
              size={18} 
              className={cn(
                "transition-colors duration-300 shrink-0",
                isFocused ? "text-[#00BA88]" : "text-slate-400"
              )} 
            />

            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${MOCK_SET_DETAILS.name}...`}
              className={cn(
                "bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-400/50 text-sm md:text-base font-bold py-3 outline-none transition-all duration-500",
                !isFocused && !searchQuery ? "w-auto px-3 text-center" : "w-full px-4 text-left"
              )}
            />
          </div>

          {/* Right-aligned X Icon: Shows when focused OR when there is text */}
          {(isFocused || searchQuery) && (
            <div className="absolute right-4 animate-in fade-in zoom-in duration-300">
              <button 
                onMouseDown={(e) => {
                  e.preventDefault(); // Prevents blur before clear
                  clearSearch();
                }}
                className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-[#00BA88] transition-all"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>

        {/* GRID HEADER */}
<div className="flex items-center justify-between mb-8 px-1">
   <div className="space-y-1">
      <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
         <Activity className="h-6 w-6 text-[#00BA88]" strokeWidth={2.5} />
         Market Index
      </h3>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 pl-9">
         Real-time asset tracking and valuations
      </p>
   </div>
   <div className="flex items-center">
      <span className="text-[11px] font-bold text-slate-500 bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/10">
        {filteredAssets.length} Assets found
      </span>
   </div>
</div>

        {/* Inside your SetDetailsPage component */}
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
  {filteredAssets.map((asset) => (
    <AssetCard key={asset.id} asset={asset} />
  ))}
</div>
      </main>
    </div>
  );
}