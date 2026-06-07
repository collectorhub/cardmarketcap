"use client"

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Share2, Star, Info, ArrowLeft, Activity, 
  Globe, TrendingUp, BarChart3, ExternalLink,
  ShoppingBag, CheckCircle2
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Navbar from './Navbar'
import Sidebar from './Sidebar'

interface CardDetailsProps {
  card: any;
  relatedCards?: any[];
}

export default function CardDetails({ card, relatedCards = [] }: CardDetailsProps) {
  const router = useRouter()
  
  // 1. Initial State Resolution
  const initialGrade = card.resolvedGrade && card.resolvedGrade.toUpperCase().includes("PSA") 
    ? card.resolvedGrade.toUpperCase() 
    : "PSA 10";

  const [selectedGrade, setSelectedGrade] = useState(initialGrade);
  const [selectedTimeframe, setSelectedTimeframe] = useState("1M");
  const [copied, setCopied] = useState(false);

  // 2. Destructure Data Mappings Safely
  const cardName = card.name || "Unknown Card";
  const cardSet = card.expansion_name || card.set || "Unknown Set";
  const cardImage = card.imageUrl || card.image || "https://pokecollectorhub.com/assets/placeholder.png";
  const cardType = card.rarity || card.type || "Standard";
  const popData = card.fullPsaPop || {}; 

  // 3. Dynamic Realtime Price Aggregator
  const currentDisplayPrice = useMemo(() => {
    const gradeKey = selectedGrade.toLowerCase().replace(" ", ""); 
    
    if (card.prices && card.prices[gradeKey] !== undefined && card.prices[gradeKey] !== null) {
      const val = card.prices[gradeKey];
      return typeof val === 'number' ? `$${val.toLocaleString()}` : val;
    }
    
    const currentResolved = card.resolvedGrade?.toLowerCase().replace(" ", "") || "psa10";
    if (gradeKey === currentResolved && card.price) {
      return typeof card.price === 'number' ? `$${card.price.toLocaleString()}` : card.price;
    }

    if (gradeKey === "psa10" && card.psa10 && card.psa10 !== "0") return `$${card.price || "0.00"}`;
    return card.price || "$0.00";
  }, [selectedGrade, card]);

  const numericCurrentPrice = useMemo(() => {
    return parseFloat(String(currentDisplayPrice).replace(/[$,]/g, '')) || 0;
  }, [currentDisplayPrice]);

  // 4. Filter and Normalize Sales Pipelines (UPDATED FALLBACKS)
  const activeHistoricalSales = useMemo(() => {
    const targetSales = card.historicalSales || card.historical_sales || [];
    if (!targetSales) return [];
    
    let rawSales = [];
    if (Array.isArray(targetSales)) {
      rawSales = targetSales;
    } else {
      const numericGradeOnly = selectedGrade.replace(/[^0-9]/g, '');
      rawSales = targetSales[numericGradeOnly] || [];
    }

    return rawSales.map((sale: any) => {
      const parsedPrice = parseFloat(String(sale.price || "0").replace(/[$,]/g, '')) || 0;
      const parsedDate = sale.soldDate || sale.sold_date;
      const parsedDateObj = parsedDate ? new Date(parsedDate) : new Date();
      return {
        ...sale,
        numericPrice: parsedPrice,
        dateObj: parsedDateObj,
        soldDate: sale.soldDate || sale.sold_date || "Recent"
      };
    }).sort((a: any, b: any) => b.dateObj.getTime() - a.dateObj.getTime());
  }, [selectedGrade, card]);

  // 5. Timeframe-Aware Sparkline Engine (SVG Generation)
  const chartData = useMemo(() => {
    if (activeHistoricalSales.length === 0) {
      const base = numericCurrentPrice || 100;
      return [base * 0.92, base * 0.95, base * 0.93, base * 0.97, base * 0.96, base];
    }

    const now = new Date();
    const filtered = activeHistoricalSales.filter((sale: any) => {
      const diffTime = Math.abs(now.getTime() - sale.dateObj.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (selectedTimeframe === "1D") return diffDays <= 1;
      if (selectedTimeframe === "1M") return diffDays <= 30;
      if (selectedTimeframe === "3M") return diffDays <= 90;
      if (selectedTimeframe === "1Y") return diffDays <= 365;
      return true; 
    });

    const targetDataset = filtered.length > 0 ? filtered : activeHistoricalSales;
    return targetDataset.map((s: any) => s.numericPrice).reverse();
  }, [activeHistoricalSales, selectedTimeframe, numericCurrentPrice]);

  const svgPath = useMemo(() => {
    if (chartData.length < 2) return "";
    const width = 600;
    const height = 240;
    const padding = 20;
    
    const minX = padding;
    const maxX = width - padding;
    const minY = height - padding;
    const maxY = padding;

    const minVal = Math.min(...chartData) * 0.99;
    const maxVal = Math.max(...chartData) * 1.01;
    const valRange = maxVal - minVal || 1;

    return chartData.map((val, index) => {
      const x = minX + (index / (chartData.length - 1)) * (maxX - minX);
      const y = minY - ((val - minVal) / valRange) * (minY - maxY);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  }, [chartData]);

  const chartStats = useMemo(() => {
    if (chartData.length === 0) return { low: "$0.00", high: "$0.00" };
    const low = Math.min(...chartData);
    const high = Math.max(...chartData);
    return {
      low: `$${low.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      high: `$${high.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    };
  }, [chartData]);

  // 6. Action Handlers
  const handleShare = async () => {
    const shareData = {
      title: `${cardName} - ${cardSet}`,
      text: `Track real-time valuations and population statistics for ${cardName} on TCG Market Index.`,
      url: typeof window !== "undefined" ? window.location.href : "",
    };

    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Native share failed:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const handleCorrelationClick = (targetCard: any) => {
    const path = targetCard.canonicalUrl || targetCard.canonical_path;
    if (path) {
      router.push(path);
    }
  };

  const columnClass = "lg:h-full lg:overflow-y-auto no-scrollbar lg:pb-10";

  const AssetHeader = () => (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-500/10 text-[#00BA88] px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">
            Rank #{card.rank || "124"}
          </span>
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.15em]">
            Market Index 
          </span>
        </div>
        
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase font-sora leading-none">
            {cardName}
          </h1>
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mt-2">
            {cardSet}
          </p>
        </div>
      </div>
      
      <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-2xl w-fit">
        {["PSA 10", "PSA 9", "PSA 8"].map(g => (
          <button 
            key={g} 
            onClick={() => setSelectedGrade(g)} 
            className={cn(
              "px-5 py-2.5 text-[10px] md:text-[11px] font-black uppercase rounded-xl transition-all cursor-pointer", 
              selectedGrade === g ? "bg-white dark:bg-slate-800 text-[#00BA88] shadow-sm" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            )}
          >
            {g}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen lg:h-screen flex flex-col bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 font-inter selection:bg-[#00BA88]/30">
      <Navbar />
      <div className="lg:hidden">
        <Sidebar />
      </div>

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
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight hidden sm:inline">Vol 30d: <span className="text-slate-900 dark:text-white">{card.sales30d || card.sales30dNum || "N/A"}</span></span>
             <div className="h-3 w-px bg-slate-200 dark:bg-white/10 hidden sm:block" />
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Cap: <span className="text-slate-900 dark:text-white">{card.marketCap || "$0.00"}</span></span>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 md:px-6 overflow-x-hidden lg:overflow-hidden">
        <div className="block lg:hidden pt-6">
          <AssetHeader />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 h-full py-6 md:py-8">
          
          {/* LEFT SPECS PANEL COLUMN */}
          <div className={cn("lg:col-span-3 space-y-8", columnClass)}>
            <div className="rounded-3xl border border-[#00BA88]/30 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 p-4 shadow-sm flex items-center justify-center">
              <img 
                src={cardImage} 
                alt={cardName} 
                className="h-auto w-full max-w-[280px] lg:max-w-none object-contain hover:scale-105 transition-transform duration-500" 
              />
            </div>

            {(card.setLogo || card.setSymbol) && (
              <div className="grid grid-cols-2 gap-3">
                {card.setLogo && (
                  <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-4 flex items-center justify-center border border-slate-100 dark:border-white/5 h-16">
                    <img src={card.setLogo} alt="Set Logo" className="max-w-full max-h-full object-contain filter dark:brightness-110" />
                  </div>
                )}
                {card.setSymbol && (
                  <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-4 flex flex-col items-center justify-center border border-slate-100 dark:border-white/5 h-16">
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
                    { l: "Rarity", v: cardType },
                    { l: "Card Number", v: card.number || "N/A" },
                    { l: "Release", v: card.releaseDate || "N/A" }
                  ].map((row, idx) => (
                    <div key={idx} className="flex justify-between items-center border-b border-slate-50 dark:border-white/5 pb-3 last:border-0">
                      <span className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-wider">{row.l}</span>
                      <span className="text-[12px] md:text-[13px] font-black tabular-nums text-right">{row.v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={handleShare}
                  variant="outline" 
                  className={cn(
                    "flex-1 h-11 text-[10px] md:text-[11px] font-black uppercase tracking-widest border-slate-200 dark:border-white/10 rounded-2xl transition-all cursor-pointer",
                    copied ? "text-[#00BA88] border-[#00BA88]" : "hover:bg-slate-50 dark:hover:bg-white/5"
                  )}
                >
                  {copied ? (
                    <>
                      <CheckCircle2 size={14} className="mr-2" /> Copied
                    </>
                  ) : (
                    <>
                      <Share2 size={14} className="mr-2" /> Share
                    </>
                  )}
                </Button>
                <Button variant="outline" disabled className="opacity-40 flex-1 h-11 text-[10px] md:text-[11px] font-black uppercase tracking-widest border-slate-200 dark:border-white/10 rounded-2xl">
                  <Star size={14} className="mr-2" /> Watch
                </Button>
              </div>
            </div>
          </div>

          {/* MAIN CHARTS AND LOGS CONTENT COLUMN */}
          <div className={cn("lg:col-span-6 space-y-10", columnClass)}>
            <div className="hidden lg:block">
              <AssetHeader />
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2rem] p-6 md:p-8 shadow-sm space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <p className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 font-sora">Current Value ({selectedGrade})</p>
                  <div className="flex items-baseline gap-4">
                    <span className="text-4xl md:text-5xl font-black tabular-nums tracking-tighter">{currentDisplayPrice}</span>
                    <span className="text-[12px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg flex items-center">
                      <TrendingUp size={14} className="mr-1" /> {card.change7dNum || "0.0"}%
                    </span>
                  </div>
                </div>
                <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl self-start sm:self-center">
                  {['1D', '1M', '3M', '1Y', 'MAX'].map((t) => (
                    <button 
                      key={t} 
                      onClick={() => setSelectedTimeframe(t)}
                      className={cn(
                        "px-3.5 py-2 text-[9px] md:text-[10px] font-black rounded-lg transition-all cursor-pointer", 
                        selectedTimeframe === t ? "bg-[#00BA88] text-white shadow-md" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Live SVG Vector Canvas */}
              <div className="h-[220px] md:h-[260px] w-full bg-slate-50/50 dark:bg-white/[0.02] rounded-2xl border border-dashed border-slate-200 dark:border-white/10 flex items-center justify-center relative overflow-hidden group p-2">
                {svgPath ? (
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 600 240" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00BA88" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#00BA88" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path 
                      d={svgPath} 
                      fill="none" 
                      stroke="#00BA88" 
                      strokeWidth="3.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                    />
                    <path 
                      d={`${svgPath} L ${600 - 20} ${240 - 20} L 20 ${240 - 20} Z`} 
                      fill="url(#chartGrad)" 
                    />
                  </svg>
                ) : (
                  <div className="z-10 flex flex-col items-center gap-2 opacity-50">
                    <BarChart3 size={28} className="text-slate-400" />
                    <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Compiling Metric Stream</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-100 dark:border-white/5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] md:text-[11px] font-bold text-slate-400 tracking-wider">Timeframe Low</span>
                  <span className="text-[14px] md:text-[16px] font-black tabular-nums">{chartStats.low}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] md:text-[11px] font-bold text-slate-400 tracking-wider">Timeframe High</span>
                  <span className="text-[14px] md:text-[16px] font-black tabular-nums">{chartStats.high}</span>
                </div>
              </div>
            </div>

            {/* Population Data Layout */}
            <div className="space-y-6 px-1">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] md:text-[12px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white font-sora">PSA Population Data</h3>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Total Pop: {popData.total ? Number(popData.total).toLocaleString() : (card.popTotal || "0")}
                </span>
              </div>
              <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-3 md:gap-4">
                {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((grade) => {
                  const popCount = popData[`grade_${grade}`] ?? 0;

                  return (
                    <div key={grade} className="bg-slate-50/50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 rounded-2xl p-4 text-center hover:border-[#00BA88]/30 transition-colors">
                      <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase mb-1">
                        PSA {grade}
                      </p>
                      <p className="text-lg md:text-xl font-black tabular-nums">
                        {Number(popCount).toLocaleString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Tabs Section Mapping */}
            <Tabs defaultValue="sales" className="w-full">
              <TabsList className="w-full justify-start h-12 bg-transparent border-b border-slate-200 dark:border-white/5 p-0 gap-8">
                {["sales", "markets"].map(tab => (
                  <TabsTrigger key={tab} value={tab} className="text-[10px] md:text-[11px] font-black uppercase tracking-widest data-[state=active]:text-[#00BA88] border-b-2 border-transparent data-[state=active]:border-[#00BA88] rounded-none px-0 h-full bg-transparent shadow-none cursor-pointer">
                    {tab === "sales" ? `Recent Sales (${activeHistoricalSales.length})` : "Markets"}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {/* Dynamic Live Logs Tab Content */}
              <TabsContent value="sales" className="pt-6">
                <div className="border border-slate-100 dark:border-white/5 rounded-[1.5rem] overflow-hidden">
                   <div className="grid grid-cols-4 bg-slate-50/50 dark:bg-white/5 px-6 py-4 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                     <span className="col-span-2">Transaction Details</span>
                     <span>Execution Date</span>
                     <span className="text-right">Price</span>
                   </div>
                   
                   {activeHistoricalSales.length === 0 ? (
                     <div className="text-center py-10 text-slate-400 text-xs font-medium uppercase tracking-wider">
                       No structured transactions logged for {selectedGrade}
                     </div>
                   ) : (
                     activeHistoricalSales.slice(0, 15).map((sale: any, idx: number) => (
                       <a 
                         key={idx} 
                         href={sale.url || "#"} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="grid grid-cols-4 px-6 py-4 text-[12px] md:text-[13px] font-bold border-t border-slate-50 dark:border-white/5 items-center hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group cursor-pointer"
                       >
                          <span className="col-span-2 pr-4">
                            <span className="text-slate-900 dark:text-white block line-clamp-1 group-hover:text-[#00BA88] transition-colors">
                              {sale.title || `${cardName} ${selectedGrade}`}
                            </span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight flex items-center gap-1 mt-0.5">
                              <Globe size={10} className="text-[#00BA88]" /> {sale.gradeCompany || 'PSA'} Verified Market
                            </span>
                          </span>
                          <span className="text-slate-500 uppercase text-[10px] md:text-[11px] font-black">
                            {sale.soldDate}
                          </span>
                          <span className="text-right font-black tabular-nums text-slate-900 dark:text-white flex items-center justify-end gap-1.5">
                            ${sale.numericPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })} <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
                          </span>
                       </a>
                     ))
                   )}
                </div>
              </TabsContent>
              
              {/* Dynamic Markets Tab Content */}
              <TabsContent value="markets" className="pt-6">
                <div className="border border-slate-100 dark:border-white/5 rounded-[1.5rem] overflow-hidden">
                  <div className="grid grid-cols-3 bg-slate-50/50 dark:bg-white/5 px-6 py-4 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span>Marketplace Platform</span>
                    <span>Status Indicator</span>
                    <span className="text-right">Action</span>
                  </div>
                  
                  {[
                    { name: "eBay Live Integration", desc: "Transactions Aggregating Live", active: true, link: `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(cardName + ' ' + cardSet)}` },
                    { name: "TCGplayer Marketplace", desc: card.setSymbol ? "API Sync Active" : "Alternative Feed Active", active: true, link: `https://www.tcgplayer.com/search/all/product?q=${encodeURIComponent(cardName)}` },
                    { name: "Cardmarket Global", desc: "Liquidity Buffers Syncing", active: false, link: "#" }
                  ].map((mkt, idx) => (
                    <div key={idx} className="grid grid-cols-3 px-6 py-4 text-[12px] md:text-[13px] font-bold border-t border-slate-50 dark:border-white/5 items-center">
                      <span className="flex items-center gap-2 text-slate-900 dark:text-white">
                        <ShoppingBag size={14} className="text-[#00BA88]" /> {mkt.name}
                      </span>
                      <span className={cn(
                        "text-[10px] uppercase font-black tracking-tight",
                        mkt.active ? "text-emerald-500" : "text-slate-400"
                      )}>
                        {mkt.desc}
                      </span>
                      <span className="text-right">
                        <Button 
                          asChild={mkt.active}
                          variant="ghost" 
                          disabled={!mkt.active}
                          className="h-8 text-[10px] font-black uppercase px-3 rounded-xl cursor-pointer"
                        >
                          {mkt.active ? (
                            <a href={mkt.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                              View Feed <ExternalLink size={10} />
                            </a>
                          ) : (
                            <span>Locked</span>
                          )}
                        </Button>
                      </span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* RIGHT INTEL & LIVE COLLECTION SHELF COLUMN */}
          <div className={cn("lg:col-span-3 space-y-10 flex flex-col pb-15", columnClass)}>
            <div className="space-y-8 flex-1">
              <h3 className="text-[11px] md:text-[12px] font-black uppercase tracking-[0.2em] text-[#00BA88] flex items-center gap-2 font-sora">
                <Info size={14}/> Live Intel
              </h3>
              <div className="space-y-8">
                {[
                  { t: `Liquidity profiling confirms structural health score of ${card.liquidityScoreNum || '75.2'}/100.`, d: "Active tracking" },
                  { t: `Total market cap valuation stabilized globally at ${card.marketCap || 'N/A'}.`, d: "Index tracking" },
                  { t: `30 day volume velocity tracking index flags ${card.sales30dNum || '0'} verified acquisitions.`, d: "Volume update" }
                ].map((news, i) => (
                  <div key={i} className="group">
                    <p className="text-[13px] md:text-[14px] font-bold leading-relaxed mb-1.5 text-slate-700 dark:text-slate-300">{news.t}</p>
                    <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-tighter">{news.d}</p>
                  </div>
                ))}
              </div>

              {/* Modernized Collection Shelf */}
              <div className="pt-10 border-t border-slate-100 dark:border-white/5">
                <h3 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 font-sora">
                  More From This Set
                </h3>
                
                {relatedCards.length === 0 ? (
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center py-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-dashed border-slate-200 dark:border-white/10">
                    No matching set assets found
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {relatedCards.map((relatedCard: any, idx: number) => {
                      const relImage = relatedCard.imageUrl || relatedCard.image || "https://pokecollectorhub.com/assets/placeholder.png";
                      return (
                        <div 
                          key={relatedCard.id || idx} 
                          onClick={() => handleCorrelationClick(relatedCard)}
                          className="aspect-[4/5] bg-slate-50 dark:bg-white/[0.02] rounded-2xl flex flex-col items-center justify-center p-3.5 text-center border border-slate-100 dark:border-white/5 hover:border-[#00BA88]/30 hover:bg-slate-100/50 dark:hover:bg-white/[0.04] transition-all cursor-pointer group select-none"
                        >
                          <div className="flex-1 flex items-center justify-center max-w-[85px] w-full mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                            <img 
                              src={relImage} 
                              alt={relatedCard.name || "Set Card"} 
                              className="w-full h-full object-contain filter drop-shadow-sm" 
                            />
                          </div>
                          <span className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight line-clamp-1 mt-3 w-full">
                            {relatedCard.name || "Unknown Asset"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}