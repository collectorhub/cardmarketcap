"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowUpRight, Share2, Star, ExternalLink, 
  TrendingUp, BarChart3, Bell, Lightbulb, 
  MousePointer2, Info, Link as LinkIcon,
  ArrowLeft
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Navbar from './Navbar'

export default function CardDetails({ card }: { card: any }) {
  const [selectedGrade, setSelectedGrade] = useState("PSA 10");

  const cardName = card.name || "Unknown Card";
  const cardSet = card.expansion_name || card.set || "Expansion Pack";
  const cardImage = card.imageUrl || card.large_image || "https://pokecollectorhub.com/assets/placeholder.png";
  const price = card.price || "$0.00";

  return (
    <div className="h-screen overflow-hidden bg-[#F9FAFB] dark:bg-[#020617] text-slate-900 dark:text-white font-sans selection:bg-[#00BA88]/30 transition-colors duration-300">
      <Navbar />

      {/* SCROLL LOGIC: 
          Desktop (lg): h-[calc(100vh-64px)] + overflow-hidden (locked layout)
          Mobile: h-auto + overflow-y-auto (natural scrolling)
      */}
      <main className="max-w-[1400px] mx-auto px-4 md:px-8 pt-15 md:pt-0 h-[calc(100vh-64px)] overflow-y-auto lg:overflow-hidden no-scrollbar">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 h-full py-4 lg:py-6">
          
          {/* --- LEFT COLUMN: IMAGE & METADATA --- */}
          <div className="lg:col-span-4 xl:col-span-3 flex flex-col lg:h-full lg:overflow-y-auto no-scrollbar space-y-6">
            <div>
              <Link href="/#market-table" className="group flex items-center gap-2 text-slate-400 hover:text-[#00BA88] mb-6 w-fit transition-colors">
                <ArrowLeft size={18} strokeWidth={2.5} className="transform group-hover:-translate-x-1 transition-transform duration-300" />
                <span className="text-[13px] font-bold tracking-tight">Back</span>
              </Link>

              <div className="relative aspect-[3/4.2] rounded-[2rem] overflow-hidden bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 shadow-2xl group">
                <img src={cardImage} alt={cardName} className="h-full w-full object-contain p-4 transform group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-full border border-slate-200 dark:border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-white">
                  {card.rarity || 'Holo Rare'}
                </div>
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-white/5 rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-sm space-y-5">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Info size={14} className="text-[#00BA88]" /> Card Metadata
              </h3>
              <div className="space-y-4">
                {[
                  { l: "Type", v: card.type || "Pokémon" },
                  { l: "HP", v: card.hp || "110" },
                  { l: "Types", v: card.types || "Colorless" },
                  { l: "Artist", v: card.artist || "hncl" },
                  { l: "Category", v: "Pokémon" },
                  { l: "Variant", v: card.rarity || "Rare" }
                ].map((row, idx) => (
                  <div key={idx} className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-white/5 last:border-0 last:pb-0">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">{row.l}</span>
                    <span className="text-[13px] font-bold text-slate-800 dark:text-slate-100">{row.v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pb-4 lg:pb-0">
               <div className="p-4 bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5 text-center">
                 <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Release</p>
                 <p className="text-sm font-bold">{card.release_date || '2023'}</p>
               </div>
               <div className="p-4 bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5 text-center">
                 <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Artist</p>
                 <p className="text-sm font-bold truncate">{card.artist || 'N/A'}</p>
               </div>
            </div>
          </div>

          {/* --- CENTER COLUMN: MAIN DATA --- */}
          <div className="lg:col-span-8 xl:col-span-6 lg:h-full lg:overflow-y-auto no-scrollbar pb-10 lg:pb-20 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-[#00BA88] text-white dark:text-black rounded-full text-[10px] font-black uppercase shadow-sm">Verified Market Data</span>
                <span className="text-slate-400 text-sm font-medium tracking-tight">#{card.number || '017'}/{card.total || '055'}</span>
              </div>

              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.9] text-slate-900 dark:text-white max-w-2xl">{cardName}</h1>
                <div className="flex items-center gap-2">
                  {[Share2, Star, Bell].map((Icon, i) => (
                    <button key={i} className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 hover:text-[#00BA88] hover:border-[#00BA88]/50 transition-all duration-300">
                      <Icon size={18} />
                    </button>
                  ))}
                </div>
              </div>
              <button className="flex items-center gap-2 text-[#00BA88] transition-colors font-bold text-sm uppercase tracking-widest">
                {cardSet} 
              </button>
            </div>

            {/* Price Visualization */}
<div className="p-5 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-[#020617] border border-slate-200 dark:border-white/10 relative overflow-hidden group">
  <TrendingUp className="absolute -right-8 -top-8 w-48 h-48 text-[#00BA88] opacity-5" />
  
  <p className="text-[10px] md:text-[12px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2 md:mb-4">
    Current Market Value
  </p>
  
  <div className="flex flex-wrap items-baseline gap-2 md:gap-4">
    <span className="text-5xl md:text-8xl font-black tracking-tighter text-slate-900 dark:text-white">
      {price}
    </span>
    <div className="flex items-center gap-1 text-[#00BA88] bg-[#00BA88]/10 px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[11px] md:text-sm font-black">
      <ArrowUpRight size={14} className="md:w-[18px] md:h-[18px]"/> 12.4%
    </div>
  </div>
  
  {/* Grade Selector - Optimized for Mobile */}
  <div className="mt-8 md:mt-12 bg-slate-50 dark:bg-black/40 p-1 md:p-1.5 rounded-xl md:rounded-2xl w-full sm:w-fit border border-slate-200 dark:border-white/5">
    <div className="flex flex-row items-center justify-between sm:justify-start gap-1 md:gap-2">
      {["PSA 10", "PSA 9", "RAW"].map(g => (
        <button 
          key={g} 
          onClick={() => setSelectedGrade(g)} 
          className={cn(
            "flex-1 sm:flex-none px-3 md:px-8 py-2.5 md:py-3 text-[9px] md:text-[11px] font-black uppercase rounded-lg md:rounded-xl transition-all duration-300", 
            selectedGrade === g 
              ? "bg-[#00BA88] text-white dark:text-black shadow-lg shadow-[#00BA88]/30" 
              : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
          )}
        >
          {g}
        </button>
      ))}
    </div>
  </div>
</div>

            {/* PSA Population */}
            <div className="p-8 bg-white dark:bg-white/5 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8 text-slate-900 dark:text-white">PSA Population Report</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((grade) => (
                  <div key={grade} className="p-4 bg-slate-50 dark:bg-black/40 rounded-2xl border border-slate-200 dark:border-white/5 text-center transition-transform hover:scale-105">
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1 uppercase tracking-tighter">PSA {grade}</p>
                    <p className="text-lg font-black text-[#00BA88]">0</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            {/* Tabs */}
<Tabs defaultValue="sales" className="w-full">
  <TabsList className="w-full justify-start h-12 md:h-14 bg-transparent border-b border-slate-200 dark:border-white/5 px-1 md:px-2 gap-6 md:gap-10 overflow-x-auto no-scrollbar">
    <TabsTrigger value="sales" className="text-[10px] md:text-[11px] font-black uppercase data-[state=active]:text-[#00BA88] border-b-2 border-transparent data-[state=active]:border-[#00BA88] rounded-none px-0 transition-all text-slate-400">Last Sales</TabsTrigger>
    <TabsTrigger value="history" className="text-[10px] md:text-[11px] font-black uppercase data-[state=active]:text-[#00BA88] border-b-2 border-transparent data-[state=active]:border-[#00BA88] rounded-none px-0 transition-all text-slate-400">Price History</TabsTrigger>
    <TabsTrigger value="links" className="text-[10px] md:text-[11px] font-black uppercase data-[state=active]:text-[#00BA88] border-b-2 border-transparent data-[state=active]:border-[#00BA88] rounded-none px-0 transition-all text-slate-400">Market Links</TabsTrigger>
  </TabsList>

  <TabsContent value="sales" className="mt-6 md:mt-8">
    <div className="bg-white dark:bg-white/5 rounded-[1.5rem] md:rounded-[2rem] border border-slate-200 dark:border-white/5 divide-y divide-slate-100 dark:divide-white/5 overflow-hidden">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-4 md:p-6 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-white/[0.01] transition-colors group/row">
            <div className="flex items-center gap-3 md:gap-5">
              {/* Date Badge - Scaled for mobile */}
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#00BA88] font-black text-[9px] md:text-[10px] tracking-widest uppercase">OCT</div>
              <div>
                <p className="text-[13px] md:text-[15px] font-bold text-slate-900 dark:text-white leading-tight">October {14-i}, 2025</p>
                <p className="text-[9px] md:text-[11px] text-slate-400 font-bold uppercase tracking-tight mt-0.5 md:mt-1">Verified {selectedGrade} • eBay</p>
              </div>
            </div>
            <div className="text-right">
              {/* Price - Reduced slightly on mobile */}
              <p className="text-lg md:text-xl font-black text-[#00BA88]">$450.00</p>
              <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase">Final Bid</p>
            </div>
          </div>
        ))}
    </div>
  </TabsContent>

  <TabsContent value="history" className="mt-6 md:mt-8">
    <div className="p-10 md:p-16 bg-white dark:bg-white/5 rounded-[1.5rem] md:rounded-[2rem] border border-slate-200 dark:border-white/5 text-center">
      <BarChart3 size={40} className="mx-auto text-slate-200 dark:text-slate-800 mb-4 md:mb-6" />
      <p className="text-xs md:text-sm font-bold text-slate-500">Live Chart Engine Initializing...</p>
    </div>
  </TabsContent>

  <TabsContent value="links" className="mt-6 md:mt-8">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
      <Button variant="outline" className="h-14 md:h-16 rounded-xl md:rounded-2xl border-slate-200 dark:border-white/10 hover:bg-[#00BA88]/5 justify-between px-5 md:px-6 text-slate-700 dark:text-white">
        <span className="font-bold text-sm md:text-base">Buy on eBay</span> <LinkIcon size={16} />
      </Button>
      <Button variant="outline" className="h-14 md:h-16 rounded-xl md:rounded-2xl border-slate-200 dark:border-white/10 hover:bg-[#00BA88]/5 justify-between px-5 md:px-6 text-slate-700 dark:text-white">
        <span className="font-bold text-sm md:text-base">Check TCGPlayer</span> <LinkIcon size={16} />
      </Button>
    </div>
  </TabsContent>
</Tabs>
          </div>

          {/* --- RIGHT COLUMN: INTELLIGENCE --- 
              VISIBLE on Mobile (flow) and Desktop (sidebar)
          */}
          <div className="lg:col-span-12 xl:col-span-3 flex flex-col h-full lg:overflow-y-auto no-scrollbar pb-10 space-y-6">
            <div className="relative group w-full bg-white dark:bg-slate-900/50 rounded-[2rem] border border-slate-200 dark:border-white/5 flex flex-col items-center justify-center p-10 text-center min-h-[280px] lg:min-h-[320px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00BA88]/5 to-transparent" />
                <span className="absolute top-6 right-8 text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">Advert</span>
                <div className="relative w-20 h-20 rounded-3xl bg-[#00BA88]/10 flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-500">
                  <MousePointer2 className="text-[#00BA88] w-8 h-8" />
                </div>
                <h4 className="relative text-sm font-black mb-2 tracking-tight">PARTNER SLOT</h4>
                <p className="relative text-[12px] text-slate-500 leading-relaxed font-medium">Direct placement for card shops and vendors.</p>
            </div>

            <div className="p-8 rounded-[2rem] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 space-y-8 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#00BA88] animate-pulse" />
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Live Intel</h3>
                </div>
                <div className="space-y-8">
                    {[
                        { t: `${cardName} volume increased by 40% in last 24h.`, d: "2H AGO" },
                        { t: `Comparison guide: PSA 10 ${cardName} vs Alternatives.`, d: "1D AGO" },
                        { t: `New record sale detected for ${cardName} Raw.`, d: "3D AGO" }
                    ].map((news, i) => (
                        <div key={i} className="group cursor-pointer">
                            <p className="text-[13px] font-bold leading-snug group-hover:text-[#00BA88] transition-colors text-slate-800 dark:text-slate-200">{news.t}</p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-600 font-black mt-3 tracking-tighter italic">{news.d}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-8 rounded-[2rem] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-sm">
                <div className="flex items-center gap-2 mb-8">
                  <Lightbulb size={18} className="text-yellow-500" />
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Recommendations</h3>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
                    {[1,2,3,4,5,6].map(i => (
                        <div key={i} className="aspect-[3/4] bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-white/5 p-2 hover:border-[#00BA88]/40 transition-all cursor-pointer group">
                            <div className="h-full w-full bg-slate-100 dark:bg-white/[0.03] rounded-xl flex items-center justify-center">
                                <TrendingUp size={24} className="text-slate-200 dark:text-white/5 group-hover:text-[#00BA88]/20 transition-colors" />
                            </div>
                        </div>
                    ))}
                </div>
                <p className="text-[10px] text-slate-400 font-bold mt-6 text-center italic">Based on {card.type || 'Holo'} collectors</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}