"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Share2,
  Star,
  Info,
  ArrowLeft,
  Activity,
  Globe,
  TrendingUp,
  BarChart3,
  ExternalLink,
  CheckCircle2,
  Plus,
  Loader2,
  X,
  Megaphone,
  ImageIcon,
  CalendarDays,
  Hash,
  BadgeDollarSign,
  Layers,
  Users,
} from "lucide-react";
import { addCardToPortfolio } from "@/lib/queries/portfolio";
import { addCardToWatchlist } from "@/lib/queries/watchlist";
import { getCardUserStatus } from "@/lib/queries/status";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Navbar from "./Navbar";
import { getActiveAdvert } from "@/lib/queries/admin/adverts";
import Sidebar from "./Sidebar";

interface CardDetailsProps {
  card: any;
  relatedCards?: any[];
}

const ALL_GRADES = [
  "PSA 10",
  "PSA 9",
  "PSA 8",
  "PSA 7",
  "PSA 6",
  "PSA 5",
  "PSA 4",
  "PSA 3",
  "PSA 2",
  "PSA 1",
  "Raw",
];

const SALES_GRADES = ["PSA 10", "PSA 9", "PSA 8", "PSA 7"];

function parseMoney(value: any) {
  return parseFloat(String(value || "0").replace(/[$,]/g, "")) || 0;
}

function formatMoney(value: number) {
  return `$${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function cleanDisplay(value: any, fallback = "—") {
  if (value === null || value === undefined || value === "") return fallback;
  return String(value);
}

function getGradeNumber(grade: string) {
  return grade.replace(/[^0-9]/g, "");
}

export default function CardDetails({ card, relatedCards = [] }: CardDetailsProps) {
  const router = useRouter();

  const initialGrade =
    card.resolvedGrade && card.resolvedGrade.toUpperCase().includes("PSA")
      ? card.resolvedGrade.toUpperCase()
      : "PSA 10";

  const [selectedGrade, setSelectedGrade] = useState(initialGrade);
  const [selectedTimeframe, setSelectedTimeframe] = useState("1M");
  const [salesGrade, setSalesGrade] = useState(
    SALES_GRADES.includes(initialGrade) ? initialGrade : "PSA 10"
  );
  const [copied, setCopied] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [portfolioGrade, setPortfolioGrade] = useState(initialGrade);
  const [addingToPortfolio, setAddingToPortfolio] = useState(false);
  const [addingToWatchlist, setAddingToWatchlist] = useState(false);
  const [addMessage, setAddMessage] = useState("");
  const [portfolioGrades, setPortfolioGrades] = useState<any[]>([]);
  const [watchlistGrades, setWatchlistGrades] = useState<any[]>([]);
  const [sidebarAd, setSidebarAd] = useState<any>(null);
  const [sidebarAdLoading, setSidebarAdLoading] = useState(false);

  const cardName = card.name || "Unknown Card";
  const cardSet = card.expansion_name || card.set || "Unknown Set";
  const cardSeries = card.series || card.expansion_series || card.game || "Pokémon";
  const cardImage =
    card.imageUrl || card.image || "https://pokecollectorhub.com/assets/placeholder.png";
  const cardType = card.rarity || card.type || "Standard";
  const popData = card.fullPsaPop || {};

  const selectedGradeNumber = getGradeNumber(selectedGrade);
  const selectedPopCount =
    selectedGrade === "Raw" ? 0 : Number(popData?.[`grade_${selectedGradeNumber}`] || 0);

  const getCurrentUserId = () => {
    const stored = localStorage.getItem("user_data");
    if (!stored) return null;

    try {
      const parsed = JSON.parse(stored);
      return parsed.id || parsed.user_id || null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    async function loadUserCardStatus() {
      const stored = localStorage.getItem("user_data");
      const cardId = card.id || card.source_id;

      if (!stored || !cardId) return;

      try {
        const parsed = JSON.parse(stored);
        const userId = parsed.id || parsed.user_id;

        if (!userId) return;

        const status = await getCardUserStatus(Number(userId), String(cardId));

        setPortfolioGrades(status.portfolioGrades || []);
        setWatchlistGrades(status.watchlistGrades || []);
      } catch (error) {
        console.error("Failed to load card user status:", error);
      }
    }

    loadUserCardStatus();
  }, [card.id, card.source_id]);

  useEffect(() => {
    let cancelled = false;

    async function loadSidebarAd() {
      try {
        setSidebarAdLoading(true);

        const res = await getActiveAdvert("card_details_sidebar");

        if (!cancelled && res?.success) {
          setSidebarAd(res.advert || null);
        }
      } catch (error) {
        console.error("Failed to load sidebar advert:", error);
        if (!cancelled) setSidebarAd(null);
      } finally {
        if (!cancelled) setSidebarAdLoading(false);
      }
    }

    loadSidebarAd();

    return () => {
      cancelled = true;
    };
  }, []);

  const salesByGrade = useMemo(() => {
    return card.historicalSales || card.historical_sales || {};
  }, [card]);

  const activeHistoricalSales = useMemo(() => {
    if (!salesByGrade) return [];

    let rawSales: any[] = [];

    if (Array.isArray(salesByGrade)) {
      rawSales = salesByGrade;
    } else if (selectedGrade === "Raw") {
      rawSales = salesByGrade.raw || [];
    } else {
      rawSales = salesByGrade[selectedGradeNumber] || [];
    }

    return rawSales
      .map((sale: any) => {
        const parsedPrice = parseMoney(sale.price);
        const parsedDate = sale.soldDate || sale.sold_date;
        const parsedDateObj = parsedDate ? new Date(parsedDate) : new Date();

        return {
          ...sale,
          numericPrice: parsedPrice,
          dateObj: parsedDateObj,
          soldDate: sale.soldDate || sale.sold_date || "Recent",
        };
      })
      .sort((a: any, b: any) => b.dateObj.getTime() - a.dateObj.getTime());
  }, [salesByGrade, selectedGrade, selectedGradeNumber]);

  const salesTabData = useMemo(() => {
    const gradeNumber = getGradeNumber(salesGrade);
    const rawSales = salesByGrade?.[gradeNumber] || [];

    return rawSales
      .map((sale: any) => {
        const parsedPrice = parseMoney(sale.price);
        const parsedDate = sale.soldDate || sale.sold_date;
        const parsedDateObj = parsedDate ? new Date(parsedDate) : new Date();

        return {
          ...sale,
          numericPrice: parsedPrice,
          dateObj: parsedDateObj,
          soldDate: sale.soldDate || sale.sold_date || "Recent",
        };
      })
      .sort((a: any, b: any) => b.dateObj.getTime() - a.dateObj.getTime())
      .slice(0, 50);
  }, [salesByGrade, salesGrade]);

  const currentDisplayPrice = useMemo(() => {
    if (activeHistoricalSales.length > 0) {
      return activeHistoricalSales[0]?.price || formatMoney(activeHistoricalSales[0].numericPrice);
    }

    const resolvedGradeNumber = String(card.resolvedGrade || "").replace(/[^0-9]/g, "");

    if (selectedGradeNumber === resolvedGradeNumber && card.price) {
      return card.price;
    }

    return "$0.00";
  }, [activeHistoricalSales, selectedGradeNumber, card]);

  const numericCurrentPrice = useMemo(() => {
    return parseMoney(currentDisplayPrice);
  }, [currentDisplayPrice]);

  const chartData = useMemo(() => {
    if (activeHistoricalSales.length === 0) {
      if (!numericCurrentPrice) return [];
      const base = numericCurrentPrice;
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

    return chartData
      .map((val, index) => {
        const x = minX + (index / (chartData.length - 1)) * (maxX - minX);
        const y = minY - ((val - minVal) / valRange) * (minY - maxY);
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  }, [chartData]);

  const chartStats = useMemo(() => {
    if (chartData.length === 0) return { low: "$0.00", high: "$0.00" };

    const low = Math.min(...chartData);
    const high = Math.max(...chartData);

    return {
      low: formatMoney(low),
      high: formatMoney(high),
    };
  }, [chartData]);

  const metricCards = [
    {
      label: "Artist",
      value: cleanDisplay(card.artist, "Unknown"),
      icon: Activity,
    },
    {
      label: "Series",
      value: cleanDisplay(cardSeries),
      icon: ImageIcon,
    },
    {
      label: "Card Set",
      value: cleanDisplay(cardSet),
      icon: Layers,
    },
    {
      label: "Type",
      value: cleanDisplay(card.type || card.supertype || "Pokémon"),
      icon: BadgeDollarSign,
    },
    {
      label: "Subtypes",
      value: cleanDisplay(card.subtypes || card.subtype || "Basic"),
      icon: TrendingUp,
    },
    {
      label: "Rarity",
      value: cleanDisplay(cardType),
      icon: Star,
    },
    {
      label: "HP",
      value: cleanDisplay(card.hp),
      icon: Info,
    },
    {
      label: "Retreat Cost",
      value: cleanDisplay(card.retreatCost || card.retreat_cost || "—"),
      icon: BadgeDollarSign,
    },
    {
      label: "Card Number",
      value: cleanDisplay(card.number),
      icon: Hash,
    },
  ];

  const activeAd = sidebarAd || card.ad || card.advert || {
    title: "Advert Placement",
    subtitle: "Admin-controlled sponsored card slot",
    description:
      "Use this placement for grading partners, marketplace promotions, set launches, or collector campaigns.",
    cta_label: "Manage in Admin",
    image_url: "",
    target_url: "/admin/adverts",
  };

  const handleAddToPortfolio = async () => {
    setAddMessage("");

    const userId = getCurrentUserId();
    const cardId = card.id || card.source_id;

    if (!userId) {
      setAddMessage("Please log in to add this card.");
      return;
    }

    if (!cardId) {
      setAddMessage("Missing card information.");
      return;
    }

    setAddingToPortfolio(true);

    const result = await addCardToPortfolio({
      user_id: Number(userId),
      card_id: String(cardId),
      grade: portfolioGrade,
    });

    setAddingToPortfolio(false);

    if (result.success) {
      setPortfolioGrades((prev) => {
        const existing = prev.find(
          (item) => String(item.grade).toLowerCase() === String(portfolioGrade).toLowerCase()
        );

        if (existing) {
          return prev.map((item) =>
            String(item.grade).toLowerCase() === String(portfolioGrade).toLowerCase()
              ? { ...item, quantity: Number(item.quantity || 1) + 1 }
              : item
          );
        }

        return [{ grade: portfolioGrade, quantity: 1, purchase_price: 0 }, ...prev];
      });

      setAddMessage(`${portfolioGrade} added to your portfolio.`);

      setTimeout(() => {
        setShowAddModal(false);
        setAddMessage("");
        router.refresh();
      }, 700);
    } else {
      setAddMessage(result.message || "Could not add card.");
    }
  };

  const handleAddToWatchlist = async () => {
    const userId = getCurrentUserId();
    const cardId = card.id || card.source_id;

    if (!userId || !cardId || addingToWatchlist) return;

    setAddingToWatchlist(true);

    const result = await addCardToWatchlist({
      user_id: Number(userId),
      card_id: String(cardId),
      grade: selectedGrade || "Raw",
    });

    setAddingToWatchlist(false);

    if (result.success) {
      setWatchlistGrades((prev) => {
        const exists = prev.some(
          (item) => String(item.grade).toLowerCase() === String(selectedGrade).toLowerCase()
        );

        if (exists) return prev;

        return [{ grade: selectedGrade }, ...prev];
      });
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `${cardName} - ${cardSet}`,
      text: `Track real-time valuations and population statistics for ${cardName} on CardMarketCap.`,
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

    if (window.history.length > 1) router.back();
    else router.push("/");
  };

  const handleCorrelationClick = (targetCard: any) => {
    const path = targetCard.canonicalUrl || targetCard.canonical_path;
    if (path) router.push(path);
  };

  const handleAdClick = () => {
    const url = activeAd?.target_url || activeAd?.targetUrl || activeAd?.url;

    if (url) {
      if (String(url).startsWith("http")) {
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        router.push(url);
      }
    }
  };

  const columnClass = "lg:h-full lg:overflow-y-auto no-scrollbar lg:pb-10";

  const AssetHeader = () => (
    <div className="space-y-6">
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
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white uppercase font-sora leading-[0.95] max-w-3xl">
            {cardName}
          </h1>

          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mt-3">
            {cardSet}
          </p>
        </div>
      </div>

      <div className="w-full">
        <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-2xl overflow-x-auto no-scrollbar max-w-full">
          {ALL_GRADES.map((g) => {
            const gradeNum = g.replace(/[^0-9]/g, "");
            const count = g === "Raw" ? null : Number(popData?.[`grade_${gradeNum}`] || 0);

            return (
              <button
                key={g}
                onClick={() => {
                  setSelectedGrade(g);
                  if (SALES_GRADES.includes(g)) setSalesGrade(g);
                }}
                className={cn(
                  "shrink-0 px-5 py-3 text-[10px] md:text-[11px] font-black uppercase rounded-xl transition-all cursor-pointer",
                  selectedGrade === g
                    ? "bg-white dark:bg-slate-800 text-[#00BA88] shadow-sm"
                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                )}
                title={count !== null ? `${count.toLocaleString()} population` : "Raw card"}
              >
                {g}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const MobileAssetHero = () => (
    <div className="lg:hidden pt-5 space-y-5">
      <div className="grid grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] gap-4 items-start">
        <div className="rounded-2xl border border-[#00BA88]/25 bg-slate-50/50 dark:bg-white/5 p-2.5 shadow-sm">
          <img
            src={cardImage}
            alt={cardName}
            className="w-full h-auto object-contain"
          />
        </div>

        <div className="min-w-0 pt-1">
          <h1 className="text-[21px] leading-[1.12] font-black tracking-tight text-slate-900 dark:text-white font-sora mb-3">
            {cardName}
          </h1>

          <div className="grid grid-cols-1 gap-2 mb-4">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="shrink-0 rounded-xl border border-slate-100 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-[10px] font-black text-slate-900 dark:text-white">
                #{cleanDisplay(card.number)}
              </span>

              <span className="shrink-0 rounded-xl border border-slate-100 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-[10px] font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <Star size={12} className="text-[#00BA88]" />
                {cleanDisplay(cardType)}
              </span>
            </div>

            <span className="w-fit rounded-xl border border-slate-100 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-[10px] font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              <CalendarDays size={12} className="text-[#00BA88]" />
              {cleanDisplay(card.releaseDate)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 border-t border-slate-100 dark:border-white/10 pt-4">
            <div>
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <BadgeDollarSign size={13} className="text-[#00BA88]" />
                <span className="text-[9px] font-black">Market Cap</span>
              </div>
              <p className="text-[17px] font-black text-slate-900 dark:text-white">
                {cleanDisplay(card.marketCap, "$0.00")}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <Users size={13} className="text-[#00BA88]" />
                <span className="text-[9px] font-black">Grade Pop</span>
              </div>
              <p className="text-[17px] font-black text-slate-900 dark:text-white">
                {selectedGrade === "Raw" ? "0" : selectedPopCount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
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
            <button
              onClick={handleBack}
              className="hover:text-[#00BA88] transition-colors flex items-center gap-1 uppercase cursor-pointer"
            >
              <ArrowLeft size={14} /> <span>Back</span>
            </button>

            <span className="opacity-20 hidden md:block">/</span>

            <span className="text-slate-600 dark:text-slate-400 hidden md:block truncate max-w-[80px] md:max-w-none">
              {cardSet}
            </span>

            <span className="opacity-20">/</span>

            <span className="text-[#00BA88] truncate max-w-[100px] md:max-w-none">
              {cardName}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight hidden sm:inline">
              Vol 30d:{" "}
              <span className="text-slate-900 dark:text-white">
                {card.sales30d || card.sales30dNum || "0"}
              </span>
            </span>

            <div className="h-3 w-px bg-slate-200 dark:bg-white/10 hidden sm:block" />

            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">
              Cap:{" "}
              <span className="text-slate-900 dark:text-white">
                {card.marketCap || "$0.00"}
              </span>
            </span>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 md:px-6 overflow-x-hidden lg:overflow-hidden">
        <MobileAssetHero />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 h-full py-6 md:py-8">
          <div className={cn("lg:col-span-3 space-y-8", columnClass)}>
            <div className="hidden lg:flex rounded-3xl border border-[#00BA88]/30 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 p-4 shadow-sm items-center justify-center">
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
                    <img
                      src={card.setLogo}
                      alt="Set Logo"
                      className="max-w-full max-h-full object-contain filter dark:brightness-110"
                    />
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

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-3">
                  {metricCards.map((item, idx) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={`${item.label}-${idx}`}
                        className="rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/60 dark:bg-white/[0.03] p-4" 
                      >
                        <div className="flex items-center gap-2 mb-2 text-[#00BA88]">
                          <Icon size={13} />
                          <span className="text-[9px] font-black uppercase tracking-[0.18em]">
                            {item.label}
                          </span>
                        </div>

                        <p className="text-[12px] md:text-[13px] font-black text-slate-900 dark:text-white leading-snug break-words">
                          {item.value}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* {(portfolioGrades.length > 0 || watchlistGrades.length > 0) && (
                <div className="rounded-3xl border border-[#00BA88]/20 bg-[#00BA88]/5 dark:bg-[#00BA88]/10 p-4 space-y-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#00BA88] mb-2">
                      Your Collection
                    </p>

                    {portfolioGrades.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {portfolioGrades.map((item, index) => (
                          <span
                            key={`${item.grade}-${index}`}
                            className="rounded-full bg-[#00BA88] text-white px-3 py-1.5 text-[10px] font-black uppercase"
                          >
                            {item.grade} × {item.quantity || 1}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] font-bold text-slate-400">
                        Not in portfolio yet.
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#00BA88] mb-2">
                      Watchlist
                    </p>

                    {watchlistGrades.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {watchlistGrades.map((item, index) => (
                          <span
                            key={`${item.grade}-${index}`}
                            className="rounded-full border border-[#00BA88]/30 text-[#00BA88] bg-white/5 px-3 py-1.5 text-[10px] font-black uppercase"
                          >
                            {item.grade}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] font-bold text-slate-400">Not watching yet.</p>
                    )}
                  </div>
                </div>
              )} */}

              <div className="space-y-3">
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className={cn(
                    "w-full h-12 text-[11px] font-black uppercase tracking-widest rounded-2xl border-slate-200 dark:border-white/10 transition-all cursor-pointer",
                    copied
                      ? "text-[#00BA88] border-[#00BA88] bg-[#00BA88]/5"
                      : "hover:text-[#00BA88] hover:border-[#00BA88]/40 hover:bg-[#00BA88]/5"
                  )}
                >
                  {copied ? (
                    <>
                      <CheckCircle2 size={15} className="mr-2" /> Link Copied
                    </>
                  ) : (
                    <>
                      <Share2 size={15} className="mr-2" /> Share Card
                    </>
                  )}
                </Button>

                {/* <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => {
                      setPortfolioGrade(selectedGrade);
                      setShowAddModal(true);
                    }}
                    className="h-12 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all cursor-pointer bg-[#00BA88] hover:bg-[#00a377] text-white shadow-lg shadow-[#00BA88]/15 hover:-translate-y-0.5"
                  >
                    <Plus size={15} className="mr-2" /> Add Grade
                  </Button>

                  <Button
                    onClick={handleAddToWatchlist}
                    disabled={addingToWatchlist}
                    variant="outline"
                    className="h-12 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all cursor-pointer border-slate-200 dark:border-white/10 hover:text-[#00BA88] hover:border-[#00BA88]/40 hover:bg-[#00BA88]/5 hover:-translate-y-0.5"
                  >
                    {addingToWatchlist ? (
                      <>
                        <Loader2 size={15} className="mr-2 animate-spin" /> Saving
                      </>
                    ) : (
                      <>
                        <Star size={15} className="mr-2" /> Watch Grade
                      </>
                    )}
                  </Button>
                </div> */}
              </div>
            </div>
          </div>

          <div className={cn("lg:col-span-6 space-y-10", columnClass)}>
            <div className="hidden lg:block">
              <AssetHeader />
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2rem] p-6 md:p-8 shadow-sm space-y-8">
              <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto] gap-5">
                <div>
                  <p className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 font-sora">
                    Current Value ({selectedGrade})
                  </p>

                  <div className="flex flex-wrap items-baseline gap-4">
                    <span className="text-4xl md:text-5xl font-black tabular-nums tracking-tighter">
                      {currentDisplayPrice}
                    </span>

                    <span className="text-[12px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg flex items-center">
                      <TrendingUp size={14} className="mr-1" /> {card.change7dNum || "0.0"}%
                    </span>
                  </div>
                </div>

                <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl self-start sm:self-center">
                  {["1D", "1M", "3M", "1Y", "MAX"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTimeframe(t)}
                      className={cn(
                        "px-3.5 py-2 text-[9px] md:text-[10px] font-black rounded-lg transition-all cursor-pointer",
                        selectedTimeframe === t
                          ? "bg-[#00BA88] text-white shadow-md"
                          : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-[220px] md:h-[260px] w-full bg-slate-50/50 dark:bg-white/[0.02] rounded-2xl border border-dashed border-slate-200 dark:border-white/10 flex items-center justify-center relative overflow-hidden group p-2">
                {svgPath ? (
                  <svg
                    className="w-full h-full overflow-visible"
                    viewBox="0 0 600 240"
                    preserveAspectRatio="none"
                  >
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
                    <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                      No Price Stream
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-100 dark:border-white/5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] md:text-[11px] font-bold text-slate-400 tracking-wider">
                    Timeframe Low
                  </span>

                  <span className="text-[14px] md:text-[16px] font-black tabular-nums">
                    {chartStats.low}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[10px] md:text-[11px] font-bold text-slate-400 tracking-wider">
                    Timeframe High
                  </span>

                  <span className="text-[14px] md:text-[16px] font-black tabular-nums">
                    {chartStats.high}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-6 px-1">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] md:text-[12px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white font-sora">
                  PSA Population Data
                </h3>

                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Total Pop:{" "}
                  {popData.total ? Number(popData.total).toLocaleString() : card.popTotal || "0"}
                </span>
              </div>

              <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-3 md:gap-4">
                {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((grade) => {
                  const popCount = Number(popData[`grade_${grade}`] || 0);
                  const isActive = selectedGrade === `PSA ${grade}`;

                  return (
                    <button
                      key={grade}
                      onClick={() => {
                        const gradeLabel = `PSA ${grade}`;
                        setSelectedGrade(gradeLabel);
                        if (SALES_GRADES.includes(gradeLabel)) setSalesGrade(gradeLabel);
                      }}
                      className={cn(
                        "bg-slate-50/50 dark:bg-white/[0.03] border rounded-2xl p-4 text-center transition-all cursor-pointer",
                        isActive
                          ? "border-[#00BA88] bg-[#00BA88]/10 shadow-sm"
                          : "border-slate-100 dark:border-white/5 hover:border-[#00BA88]/30"
                      )}
                    >
                      <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase mb-1">
                        PSA {grade}
                      </p>

                      <p className="text-lg md:text-xl font-black tabular-nums">
                        {popCount.toLocaleString()}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="w-full">
              <div className="w-full flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-white/5 pb-3">
                {SALES_GRADES.map((grade) => {
                  const gradeNum = getGradeNumber(grade);
                  const count = Array.isArray(salesByGrade?.[gradeNum])
                    ? salesByGrade[gradeNum].length
                    : 0;

                  return (
                    <button
                      key={grade}
                      onClick={() => {
                        setSalesGrade(grade);
                        setSelectedGrade(grade);
                      }}
                      className={cn(
                        "px-4 py-2 rounded-xl text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all cursor-pointer",
                        salesGrade === grade
                          ? "bg-[#00BA88] text-white shadow-md"
                          : "bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-[#00BA88]"
                      )}
                    >
                      {grade} Sales ({count})
                    </button>
                  );
                })}
              </div>

              <div className="pt-6">
                <div className="border border-slate-100 dark:border-white/5 rounded-[1.5rem] overflow-hidden">
                  <div className="grid grid-cols-4 bg-slate-50/50 dark:bg-white/5 px-6 py-4 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span className="col-span-2">Transaction Details</span>
                    <span>Execution Date</span>
                    <span className="text-right">Price</span>
                  </div>

                  {salesTabData.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 text-xs font-medium uppercase tracking-wider">
                      No structured transactions logged for {salesGrade}
                    </div>
                  ) : (
                    salesTabData.map((sale: any, idx: number) => (
                      <a
                        key={`${sale.url || sale.title || "sale"}-${idx}`}
                        href={sale.url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="grid grid-cols-4 px-6 py-4 text-[12px] md:text-[13px] font-bold border-t border-slate-50 dark:border-white/5 items-center hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group cursor-pointer"
                      >
                        <span className="col-span-2 pr-4">
                          <span className="text-slate-900 dark:text-white block line-clamp-1 group-hover:text-[#00BA88] transition-colors">
                            {sale.title || `${cardName} ${salesGrade}`}
                          </span>

                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight flex items-center gap-1 mt-0.5">
                            <Globe size={10} className="text-[#00BA88]" />{" "}
                            {sale.gradeCompany || "PSA"} Verified Market
                          </span>
                        </span>

                        <span className="text-slate-500 uppercase text-[10px] md:text-[11px] font-black">
                          {sale.soldDate}
                        </span>

                        <span className="text-right font-black tabular-nums text-slate-900 dark:text-white flex items-center justify-end gap-1.5">
                          {formatMoney(sale.numericPrice)}
                          <ExternalLink
                            size={12}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400"
                          />
                        </span>
                      </a>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className={cn("lg:col-span-3 space-y-10 flex flex-col pb-15", columnClass)}>
            <div className="space-y-8 flex-1">
              {sidebarAdLoading ? (
                <div className="rounded-[2rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 animate-pulse">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="h-4 w-4 rounded-full bg-slate-200 dark:bg-slate-800" />
                    <div className="h-3 w-24 rounded-full bg-slate-200 dark:bg-slate-800" />
                  </div>

                  <div className="aspect-[16/10] rounded-2xl bg-slate-200 dark:bg-slate-800 mb-5" />

                  <div className="h-6 w-3/4 rounded-full bg-slate-200 dark:bg-slate-800 mb-3" />
                  <div className="h-3 w-1/2 rounded-full bg-slate-200 dark:bg-slate-800 mb-5" />

                  <div className="space-y-2 mb-5">
                    <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-800" />
                    <div className="h-3 w-5/6 rounded-full bg-slate-200 dark:bg-slate-800" />
                    <div className="h-3 w-2/3 rounded-full bg-slate-200 dark:bg-slate-800" />
                  </div>

                  <div className="h-9 w-32 rounded-xl bg-slate-200 dark:bg-slate-800" />
                </div>
              ) : (
                <div
                  onClick={handleAdClick}
                  className="rounded-[2rem] border border-[#00BA88]/30 bg-[#00BA88]/5 dark:bg-[#00BA88]/10 p-6 cursor-pointer hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#00BA88]/10 transition-all"
                >
                  <div className="flex items-center gap-2 text-[#00BA88] mb-5">
                    <Megaphone size={16} />
                    <span className="text-[11px] md:text-[12px] font-black uppercase tracking-[0.2em]">
                      Sponsored
                    </span>
                  </div>

                  {activeAd.image_url || activeAd.imageUrl || activeAd.image ? (
                    <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-white/50 dark:bg-white/5 mb-5">
                      <img
                        src={activeAd.image_url || activeAd.imageUrl || activeAd.image}
                        alt={activeAd.title || "Advert"}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/10] rounded-2xl bg-white/70 dark:bg-white/5 border border-dashed border-[#00BA88]/30 flex items-center justify-center mb-5">
                      <ImageIcon className="text-[#00BA88]" size={30} />
                    </div>
                  )}

                  <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight mb-2">
                    {activeAd.title}
                  </h3>

                  <p className="text-[11px] font-black uppercase tracking-widest text-[#00BA88] mb-3">
                    {activeAd.subtitle || "Sponsored Placement"}
                  </p>

                  <p className="text-sm text-slate-500 dark:text-slate-300 font-semibold leading-relaxed mb-5">
                    {activeAd.description}
                  </p>

                  <span className="inline-flex items-center gap-2 rounded-xl bg-[#00BA88] text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest">
                    {activeAd.cta_label || activeAd.ctaLabel || activeAd.cta || "Learn More"}{" "}
                    <ExternalLink size={12} />
                  </span>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 dark:border-white/5">
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
                      const relImage =
                        relatedCard.imageUrl ||
                        relatedCard.image ||
                        "https://pokecollectorhub.com/assets/placeholder.png";

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

      {showAddModal && (
        <div className="fixed inset-0 z-[80] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[2rem] shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-white/10 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Add to Portfolio
                </h3>

                <p className="text-xs text-slate-500 font-medium mt-1">
                  Choose the grade you own for this card.
                </p>
              </div>

              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition"
              >
                <X size={18} className="text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-20 h-28 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center overflow-hidden shrink-0">
                  <img src={cardImage} alt={cardName} className="w-full h-full object-contain p-2" />
                </div>

                <div className="min-w-0">
                  <h4 className="font-black text-slate-900 dark:text-white text-sm uppercase line-clamp-2">
                    {cardName}
                  </h4>

                  <p className="text-[11px] font-bold text-slate-400 uppercase mt-1 line-clamp-1">
                    {cardSet}
                  </p>

                  <p className="text-sm font-black text-[#00BA88] mt-2">
                    {currentDisplayPrice}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                  Select Grade
                </p>

                <div className="grid grid-cols-3 gap-2">
                  {ALL_GRADES.map((grade) => (
                    <button
                      key={grade}
                      onClick={() => setPortfolioGrade(grade)}
                      className={cn(
                        "py-3 rounded-xl border text-[11px] font-black uppercase transition-all",
                        portfolioGrade === grade
                          ? "bg-[#00BA88] border-[#00BA88] text-white shadow-lg shadow-[#00BA88]/20"
                          : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-[#00BA88]/50"
                      )}
                    >
                      {grade}
                    </button>
                  ))}
                </div>
              </div>

              {addMessage && (
                <p className="text-xs font-bold text-center text-slate-500">{addMessage}</p>
              )}

              <Button
                onClick={handleAddToPortfolio}
                disabled={addingToPortfolio}
                className="w-full h-12 rounded-2xl bg-[#00BA88] hover:bg-[#00a377] text-white font-black uppercase tracking-widest text-xs"
              >
                {addingToPortfolio ? (
                  <>
                    <Loader2 size={15} className="mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus size={15} className="mr-2" />
                    Add {portfolioGrade}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}