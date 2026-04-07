"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Share2, Star, Info, ArrowLeft, Activity, 
  Globe, TrendingUp, BarChart3
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Navbar from './Navbar'

export default function CardDetails({ card }: { card: any }) {
  const router = useRouter()
  const [selectedGrade, setSelectedGrade] = useState("PSA 10");
  const [selectedTimeframe, setSelectedTimeframe] = useState("1M");

  // Data Mapping from Props
  const cardName = card.name || "Unknown Card";
  const cardSet = card.expansion_name || card.set || "Unknown Set";
  const cardImage = card.imageUrl || "https://pokecollectorhub.com/assets/placeholder.png";
  const cardType = card.type || "Holo";
  const popData = card.population || {}; 

  /**
   * DYNAMIC PRICE RESOLVER
   * This addresses the client's concern by pulling the specific price 
   * based on the user's grade selection.
   */
  const getDynamicPrice = () => {
    const gradeKey = selectedGrade.toLowerCase().replace(" ", ""); // e.g., "psa10" or "raw"
    if (card.prices && card.prices[gradeKey]) {
      return card.prices[gradeKey];
    }
    return card.price || "$0.00";
  };

  const currentDisplayPrice = getDynamicPrice();

  const columnClass = "lg:h-full lg:overflow-y-auto no-scrollbar lg:pb-10";

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault()
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/')
    }
  }

  const AssetHeader = () => (
  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="bg-emerald-500/10 text-[#00BA88] px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">
          Rank #{card.rank || "124"}
        </span>
        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.15em]">
          Market Index 
          {/* <span className="text-slate-900 dark:text-white ml-1">{card.number || card.id}</span> */}
        </span>
      </div>
      
      <div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase font-sora leading-none">
          {cardName}
        </h1>
        {/* Render the set type/name under the card name */}
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mt-2">
          {cardSet || card.expansion_name}
        </p>
      </div>
    </div>
    
    <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-2xl w-fit">
      {["PSA 10", "PSA 9", "RAW"].map(g => (
        <button 
          key={g} 
          onClick={() => setSelectedGrade(g)} 
          className={cn(
            "px-5 py-2.5 text-[10px] md:text-[11px] font-black uppercase rounded-xl transition-all", 
            selectedGrade === g ? "bg-white dark:bg-slate-800 text-[#00BA88] shadow-sm" : "text-slate-400 hover:text-slate-200"
          )}
        >
          {g}
        </button>
      ))}
    </div>
  </div>
)

  return (
    <div className="min-h-screen lg:h-screen flex flex-col bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 font-inter selection:bg-[#00BA88]/30">
      <Navbar />

      <div className="border-b border-slate-100 dark:border-white/5 flex-shrink-0 bg-white/50 dark:bg-[#020617]/50 backdrop-blur-md sticky top-0 z-20 pt-15 md:pt-0">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4 text-[10px] md:text-[11px] font-black uppercase tracking-[0.1em] text-slate-400">
            <button onClick={handleBack} className="hover:text-[#00BA88] transition-colors flex items-center gap-1 uppercase cursor-pointer">
              <ArrowLeft size={14} /> <span>Back</span>
            </button>
            <span className="opacity-20 hidden md:block">/</span>
            <span className="text-slate-600 dark:text-slate-400 hidden md:block truncate max-w-[80px] md:max-w-none">{cardSet}</span>
            <span className="opacity-20">/</span>
            <span className="text-[#00BA88] truncate max-w-[100px] md:max-w-none">{cardName}</span>
          </div>
          <div className="flex items-center gap-4">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight hidden sm:inline">Vol 24h: <span className="text-slate-900 dark:text-white">$42,831</span></span>
             <div className="h-3 w-px bg-slate-200 dark:bg-white/10 hidden sm:block" />
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Cap: <span className="text-slate-900 dark:text-white">{card.marketCap || "$1.2M"}</span></span>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 md:px-6 overflow-x-hidden lg:overflow-hidden">
        
        <div className="block lg:hidden pt-6">
          <AssetHeader />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 h-full py-6 md:py-8">
          
          <div className={cn("lg:col-span-3 space-y-8", columnClass)}>
  {/* Main Card Image */}
  <div className="rounded-3xl border border-[#00BA88] dark:border-white/5 bg-slate-50/50 dark:bg-white/5 p-4 shadow-sm flex items-center justify-center">
    <img 
      src={cardImage} 
      alt={cardName} 
      className="h-auto w-full max-w-[280px] lg:max-w-none object-contain hover:scale-105 transition-transform duration-500" 
    />
  </div>

  {/* Set Visuals - Positioned under main image */}
  {(card.setLogo || card.setSymbol) && (
    <div className="grid grid-cols-2 gap-3">
      {card.setLogo && (
        <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-4 flex items-center justify-center border border-[#00BA88] dark:border-white/5 h-16">
          <img src={card.setLogo} alt="Set Logo" className="max-w-full max-h-full object-contain filter dark:brightness-110" />
        </div>
      )}
      {card.setSymbol && (
        <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-4 flex flex-col items-center justify-center border border-[#00BA88] dark:border-white/5 h-16">
          <img src={card.setSymbol} alt="Set Symbol" className="w-8 h-8 object-contain" />
        </div>
      )}
    </div>
  )}

  <div className="space-y-8">
    <div>
      <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#00BA88] mb-5 flex items-center gap-2">
        <Activity size={14} /> Asset Specs
      </h3>
      <div className="space-y-4">
        {[
          { l: "Registry ID", v: card.id || "N/A" },
          { l: "Artist", v: card.artist || "Unknown" },
          { l: "Rarity", v: cardType }, // cardType already handles card.rarity || card.type
          { l: "Card Number", v: card.number || "N/A" },
          { l: "Release", v: card.release_date || card.releaseDate || "N/A" }
        ].map((row, idx) => (
          <div key={idx} className="flex justify-between items-center border-b border-slate-50 dark:border-white/5 pb-3 last:border-0">
            <span className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-wider">{row.l}</span>
            <span className="text-[12px] md:text-[13px] font-black tabular-nums">{row.v}</span>
          </div>
        ))}
      </div>
    </div>

    <div className="flex gap-3">
      <Button variant="outline" className="flex-1 h-11 text-[10px] md:text-[11px] font-black uppercase tracking-widest border-slate-200 dark:border-white/10 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
        <Share2 size={14} className="mr-2" /> Share
      </Button>
      <Button variant="outline" className="flex-1 h-11 text-[10px] md:text-[11px] font-black uppercase tracking-widest border-slate-200 dark:border-white/10 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
        <Star size={14} className="mr-2" /> Watch
      </Button>
    </div>
  </div>
</div>

          <div className={cn("lg:col-span-6 space-y-10", columnClass)}>
            
            <div className="hidden lg:block">
              <AssetHeader />
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2rem] p-6 md:p-8 shadow-sm space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <p className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 font-sora">Current Value ({selectedGrade})</p>
                  <div className="flex items-baseline gap-4">
                    <span className="text-5xl font-black tabular-nums tracking-tighter">{currentDisplayPrice}</span>
                    <span className="text-[12px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg flex items-center">
                      <TrendingUp size={14} className="mr-1" /> 12.4%
                    </span>
                  </div>
                </div>
                <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl self-start sm:self-center">
                  {['1D', '1M', '3M', '1Y', 'MAX'].map((t) => (
                    <button 
                      key={t} 
                      onClick={() => setSelectedTimeframe(t)}
                      className={cn(
                        "px-3.5 py-2 text-[9px] md:text-[10px] font-black rounded-lg transition-all", 
                        selectedTimeframe === t ? "bg-[#00BA88] text-white shadow-md" : "text-slate-500 hover:text-slate-200"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="h-[220px] md:h-[260px] w-full bg-slate-50/50 dark:bg-white/[0.02] rounded-2xl border border-dashed border-slate-200 dark:border-white/10 flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 flex items-end justify-between px-6 md:px-10 pb-4 opacity-20">
                  {[40, 70, 45, 90, 65, 80, 30, 50, 40, 60, 85, 45, 60, 30, 75, 40].map((h, i) => (
                    <div key={i} style={{ height: `${h}%` }} className="w-2 md:w-3 bg-[#00BA88] rounded-t-sm group-hover:opacity-100 transition-opacity" />
                  ))}
                </div>
                <div className="z-10 flex flex-col items-center gap-2 opacity-50">
                  <BarChart3 size={28} className="text-slate-400" />
                  <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Terminal Link Active</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-100 dark:border-white/5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] md:text-[11px] font-bold text-slate-400  tracking-wider">30 day Low</span>
                  <span className="text-[14px] md:text-[16px] font-black tabular-nums">$412.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] md:text-[11px] font-bold text-slate-400  tracking-wider">30 day High</span>
                  <span className="text-[14px] md:text-[16px] font-black tabular-nums">$485.00</span>
                </div>
              </div>
            </div>

            <div className="space-y-6 px-1">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] md:text-[12px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white font-sora">PSA Population Data</h3>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Audit</span>
              </div>
              <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-3 md:gap-4">
                {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((grade) => (
                  <div key={grade} className="bg-slate-50/50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 rounded-2xl p-4 text-center hover:border-[#00BA88]/30 transition-colors">
                    <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase mb-1">Grade {grade}</p>
                    <p className="text-lg md:text-xl font-black tabular-nums">
                      {popData[`psa${grade}`] || "0"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <Tabs defaultValue="sales" className="w-full">
              <TabsList className="w-full justify-start h-12 bg-transparent border-b border-slate-200 dark:border-white/5 p-0 gap-8">
                {["sales", "history", "markets"].map(tab => (
                  <TabsTrigger key={tab} value={tab} className="text-[10px] md:text-[11px] font-black uppercase tracking-widest data-[state=active]:text-[#00BA88] border-b-2 border-transparent data-[state=active]:border-[#00BA88] rounded-none px-0 h-full bg-transparent shadow-none">
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value="sales" className="pt-6">
                <div className="border border-slate-100 dark:border-white/5 rounded-[1.5rem] overflow-hidden">
                   <div className="grid grid-cols-3 bg-slate-50/50 dark:bg-white/5 px-6 py-4 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                     <span>Execution Date</span>
                     <span>Market</span>
                     <span className="text-right">Settled</span>
                   </div>
                   {[1, 2, 3].map(i => (
                     <div key={i} className="grid grid-cols-3 px-6 py-5 text-[12px] md:text-[13px] font-bold border-t border-slate-50 dark:border-white/5 items-center hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer group">
                        <span className="text-slate-400 uppercase text-[10px] md:text-[11px]">Oct {12+i}, 2025</span>
                        <span className="flex items-center gap-2"><Globe size={14} className="text-[#00BA88]" /> Verified Auction</span>
                        <span className="text-right font-black tabular-nums group-hover:text-[#00BA88] transition-colors">{currentDisplayPrice}</span>
                     </div>
                   ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className={cn("lg:col-span-3 space-y-10 flex flex-col pb-15", columnClass)}>
            <div className="space-y-8 flex-1">
              <h3 className="text-[11px] md:text-[12px] font-black uppercase tracking-[0.2em] text-[#00BA88] flex items-center gap-2 font-sora">
                <Info size={14}/> Live Intel
              </h3>
              <div className="space-y-8">
                {[
                  { t: `Institutional whale accumulation detected (+42%)`, d: "2h ago" },
                  { t: `Expansion support level confirmed at ${currentDisplayPrice}`, d: "1d ago" },
                  { t: `Sell-side liquidity increasing for ${cardSet}`, d: "2d ago" }
                ].map((news, i) => (
                  <div key={i} className="group cursor-pointer">
                    <p className="text-[13px] md:text-[14px] font-bold leading-relaxed mb-1.5 group-hover:text-[#00BA88] transition-colors">{news.t}</p>
                    <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-tighter">{news.d}</p>
                  </div>
                ))}
              </div>

              <div className="pt-10 border-t border-slate-100 dark:border-white/5">
                <h3 className="text-[11px] md:text-[12px] font-black uppercase tracking-[0.15em] text-slate-400 mb-6">Correlations</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="aspect-square bg-slate-50 dark:bg-white/5 rounded-2xl flex flex-col items-center justify-center border border-transparent hover:border-[#00BA88]/20 transition-all cursor-pointer group">
                      <div className="w-10 h-10 bg-slate-100 dark:bg-white/10 rounded-xl mb-3 group-hover:scale-110 transition-transform" />
                      <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">Asset #01{i}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}