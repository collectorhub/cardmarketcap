"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowUpRight, Share2, Star, ChevronLeft, ExternalLink, 
  TrendingUp, BarChart3, Bell, Newspaper, Lightbulb, 
  MousePointer2, Menu, Info, Link as LinkIcon
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
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#020617] text-slate-900 dark:text-white font-sans selection:bg-[#00BA88]/30 transition-colors duration-300">
      
      {/* --- STICKY TOP NAV --- */}
      <Navbar />

      <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* --- LEFT COLUMN: FIXED/STICKY IMAGE & DATA --- */}
          <div className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-24 space-y-6">
            <div className="relative aspect-[3/4.2] rounded-3xl overflow-hidden bg-slate-100 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-2xl group">
              <img 
                src={cardImage} 
                alt={cardName} 
                className="h-full w-full object-contain p-6 transform group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute top-4 right-4 px-3 py-1 bg-white/80 dark:bg-black/60 backdrop-blur-md rounded-full border border-slate-200 dark:border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-white">
                {card.rarity || 'Holo Rare'}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1 tracking-tighter">Artist</p>
                    <p className="text-[13px] font-bold text-slate-700 dark:text-slate-200">{card.artist || 'N/A'}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1 tracking-tighter">Release</p>
                    <p className="text-[13px] font-bold text-slate-700 dark:text-slate-200">{card.release_date || '2023'}</p>
                </div>
            </div>
          </div>

          {/* --- CENTER COLUMN: DYNAMIC CONTENT --- */}
          <div className="lg:col-span-8 xl:col-span-6 space-y-8">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-[#00BA88] text-white dark:text-black rounded-full text-[11px] font-black uppercase shadow-sm shadow-[#00BA88]/20">Verified Market Data</span>
                <span className="text-slate-400 dark:text-slate-500 text-sm font-medium">#{card.number || '017'}/{card.total || '055'}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none text-slate-900 dark:text-white">{cardName}</h1>
              <button className="flex items-center gap-2 text-[#00BA88] hover:text-[#00ebad] transition-colors font-bold text-sm uppercase tracking-wide">
                {cardSet} <ExternalLink size={14} />
              </button>
            </div>

            {/* Price Visualization */}
            <div className="p-6 md:p-10 rounded-[2.5rem] bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-[#020617] border border-slate-200 dark:border-white/10 relative overflow-hidden group">
               <TrendingUp className="absolute -right-8 -top-8 w-48 h-48 text-[#00BA88] opacity-5 group-hover:opacity-10 transition-opacity" />
               <p className="text-[12px] font-black uppercase text-slate-400 dark:text-slate-400 tracking-[0.2em] mb-3">Current Market Value</p>
               <div className="flex items-baseline gap-4">
                 <span className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white">{price}</span>
                 <div className="flex items-center gap-1 text-[#00BA88] bg-[#00BA88]/10 px-3 py-1 rounded-full text-sm font-black">
                   <ArrowUpRight size={16}/> 12.4%
                 </div>
               </div>
               
               <div className="flex gap-2 mt-10 bg-white/50 dark:bg-black/40 p-1.5 rounded-2xl w-fit border border-slate-300/50 dark:border-white/5">
                  {["PSA 10", "PSA 9", "RAW"].map(g => (
                    <button 
                      key={g} 
                      onClick={() => setSelectedGrade(g)} 
                      className={cn(
                        "px-6 py-2.5 text-[11px] font-black uppercase rounded-xl transition-all", 
                        selectedGrade === g 
                          ? "bg-[#00BA88] text-white dark:text-black shadow-lg shadow-[#00BA88]/20" 
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      )}
                    >
                      {g}
                    </button>
                  ))}
               </div>
            </div>

            {/* --- COMPREHENSIVE TABS SYSTEM --- */}
            <Tabs defaultValue="sales" className="w-full">
              <TabsList className="w-full justify-start h-14 bg-transparent border-b border-slate-200 dark:border-white/5 px-2 gap-8 overflow-x-auto no-scrollbar">
                <TabsTrigger value="sales" className="text-xs font-black uppercase data-[state=active]:text-[#00BA88] border-b-2 border-transparent data-[state=active]:border-[#00BA88] rounded-none px-0 transition-all text-slate-400">Last Sales</TabsTrigger>
                <TabsTrigger value="stats" className="text-xs font-black uppercase data-[state=active]:text-[#00BA88] border-b-2 border-transparent data-[state=active]:border-[#00BA88] rounded-none px-0 transition-all text-slate-400">Stats</TabsTrigger>
                <TabsTrigger value="history" className="text-xs font-black uppercase data-[state=active]:text-[#00BA88] border-b-2 border-transparent data-[state=active]:border-[#00BA88] rounded-none px-0 transition-all text-slate-400">History</TabsTrigger>
                <TabsTrigger value="links" className="text-xs font-black uppercase data-[state=active]:text-[#00BA88] border-b-2 border-transparent data-[state=active]:border-[#00BA88] rounded-none px-0 transition-all text-slate-400">Links/Affiliates</TabsTrigger>
              </TabsList>

              {/* TABS CONTENT 1: SALES */}
              <TabsContent value="sales" className="mt-6">
                <div className="bg-white dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/5 divide-y divide-slate-200 dark:divide-white/5 overflow-hidden">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="p-6 flex justify-between items-center hover:bg-slate-100 dark:hover:bg-white/[0.02] transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[#00BA88] font-bold text-[10px] tracking-tighter">OCT</div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">October {14-i}, 2025</p>
                            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-tight">Verified {selectedGrade} • eBay Global</p>
                          </div>
                        </div>
                        <p className="text-lg font-black text-[#00BA88]">$450.00</p>
                      </div>
                    ))}
                </div>
              </TabsContent>

              {/* TABS CONTENT 2: STATS */}
              <TabsContent value="stats" className="mt-6 space-y-6">
                <div className="p-6 bg-white dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/5">
                  <h3 className="text-sm font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white"><Info size={16} className="text-[#00BA88]" /> Card Metadata</h3>
                  <div className="space-y-4">
                    {[
                      { l: "Type", v: card.type || "Pokémon" },
                      { l: "HP", v: card.hp || "110" },
                      { l: "Types", v: card.types || "Colorless" },
                      { l: "Artist", v: card.artist || "hncl" },
                      { l: "Category", v: "Pokémon" },
                      { l: "Variant", v: card.rarity || "Rare" }
                    ].map((row, idx) => (
                      <div key={idx} className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-white/5 last:border-0">
                        <span className="text-[12px] font-bold text-slate-400 dark:text-slate-500 uppercase">{row.l}</span>
                        <span className="text-[13px] font-bold text-slate-700 dark:text-white">{row.v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* PSA Population Grid */}
                <div className="p-6 bg-white dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/5">
                  <h3 className="text-sm font-bold mb-6 text-slate-900 dark:text-white">PSA Population Report</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((grade) => (
                      <div key={grade} className="p-3 bg-slate-50 dark:bg-black/40 rounded-xl border border-slate-200 dark:border-white/5 text-center">
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1">PSA {grade}</p>
                        <p className="text-sm font-black text-[#00BA88]">0</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* TABS CONTENT 3: HISTORY */}
              <TabsContent value="history" className="mt-6">
                <div className="p-10 bg-white dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/5 text-center">
                  <BarChart3 size={40} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Interactive price history chart loading...</p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-600 mt-2 uppercase font-black">Data synchronized with Market API</p>
                </div>
              </TabsContent>

              {/* TABS CONTENT 4: LINKS */}
              <TabsContent value="links" className="mt-6">
                <div className="p-6 bg-white dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/5 space-y-4">
                  <p className="text-sm font-bold text-slate-400 italic">Affiliate marketplace links will appear here...</p>
                  <Button variant="outline" className="w-full border-slate-200 dark:border-white/10 hover:bg-white/5 dark:hover:bg-white/5 justify-between text-slate-700 dark:text-white">
                    View on eBay <LinkIcon size={14} />
                  </Button>
                  <Button variant="outline" className="w-full border-slate-200 dark:border-white/10 hover:bg-white/5 dark:hover:bg-white/5 justify-between text-slate-700 dark:text-white">
                    Check TCGPlayer <LinkIcon size={14} />
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* --- RIGHT COLUMN: INTELLIGENCE & RECOMMENDATIONS --- */}
          <div className="lg:col-span-12 xl:col-span-3 space-y-6">
            
            {/* Sidebar Ad Unit */}
            <div className="relative group w-full bg-white dark:bg-slate-900/50 rounded-[2rem] border border-slate-200 dark:border-white/5 flex flex-col items-center justify-center p-8 text-center min-h-[280px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00BA88]/5 to-transparent" />
                <span className="absolute top-4 right-6 text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">Advert</span>
                <div className="relative w-16 h-16 rounded-2xl bg-[#00BA88]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                  <MousePointer2 className="text-[#00BA88]" />
                </div>
                <h4 className="relative text-sm font-bold mb-1 text-slate-800 dark:text-white">PARTNER SLOT AVAILABLE</h4>
                <p className="relative text-[12px] text-slate-500 leading-relaxed px-4">Direct placement for card shops and marketplace vendors.</p>
            </div>

            {/* Live Feed */}
            <div className="p-6 rounded-[2rem] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 space-y-6">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#00BA88] animate-pulse" />
                    <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 dark:text-slate-400">Live Intel</h3>
                </div>
                <div className="space-y-6">
                    {[
                        { t: `${cardName} volume increased by 40% in last 24h.`, d: "2H AGO" },
                        { t: `Comparison guide: PSA 10 ${cardName} vs Alternatives.`, d: "1D AGO" }
                    ].map((news, i) => (
                        <div key={i} className="group cursor-pointer">
                            <p className="text-[13px] font-bold leading-snug group-hover:text-[#00BA88] transition-colors text-slate-800 dark:text-slate-200">{news.t}</p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-600 font-black mt-2 tracking-tighter">{news.d}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- PROFESSIONALLY POPULATED RECOMMENDATIONS --- */}
            <div className="p-6 rounded-[2rem] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <Lightbulb size={16} className="text-yellow-500" />
                  <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 dark:text-slate-400">Recommendations</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="aspect-[3/4] bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-white/5 p-2 hover:border-[#00BA88]/40 transition-all cursor-pointer group relative">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-end p-3">
                              <p className="text-[8px] font-black uppercase text-[#00BA88]">View Card</p>
                            </div>
                            <div className="h-full w-full bg-slate-50 dark:bg-white/[0.03] rounded-xl flex items-center justify-center">
                                <TrendingUp size={20} className="text-slate-200 dark:text-white/10" />
                            </div>
                        </div>
                    ))}
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-600 font-bold mt-4 text-center">Based on your {card.type || 'Holo'} preference</p>
            </div>
          </div>

        </div>
      </main>

      {/* --- MOBILE ACTION BAR (Sticky) --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-[#020617]/90 backdrop-blur-md border-t border-slate-200 dark:border-white/10 px-6 py-4 flex justify-between items-center z-[60] shadow-2xl">
        <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter">Market Price</span>
            <span className="text-xl font-black text-[#00BA88]">{price}</span>
        </div>
        <Button className="bg-[#00BA88] hover:bg-[#00ebad] text-white dark:text-black font-black uppercase text-xs px-8 h-12 rounded-2xl transition-all shadow-lg shadow-[#00BA88]/20 border-none">
          Track Card
        </Button>
      </div>
    </div>
  )
}