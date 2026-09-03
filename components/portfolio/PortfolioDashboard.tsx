"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  TrendingUp,
  Info,
  Layers,
  MoreVertical,
  Eye,
  Trash2,
  Plus,
  ArrowRight,
  Upload,
  DollarSign,
  BarChart3,
  Activity,
  X,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AllocationCard from "../AllocationCard";
import { useRouter, useSearchParams } from "next/navigation";
import AddCardModal from "./AddCardModal";
import CustomDropdown from "../CustomDropdown";
import { addCardToPortfolio } from "@/lib/queries/portfolio";

type PerformanceRange = "30D" | "90D" | "All";

const PERFORMANCE_TABS: PerformanceRange[] = ["30D", "90D", "All"];

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

const ALLOCATION = [
  { name: "PSA 10", value: 45.2, color: "#7c3aed" },
  { name: "PSA 9", value: 22.6, color: "#3b82f6" },
  { name: "Raw / Ungraded", value: 18.3, color: "#10b981" },
  { name: "PSA 8", value: 8.7, color: "#f59e0b" },
  { name: "PSA 7 & Below", value: 5.2, color: "#ef4444" },
];

function money(value: any) {
  return `$${Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(dateString?: string) {
  if (!dateString) return "Recently";
  const date = new Date(dateString.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return "Recently";

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function activityIcon(type: string) {
  const normalized = String(type || "").toLowerCase();
  if (normalized.includes("watch")) return Bell;
  if (normalized.includes("portfolio")) return Plus;
  if (normalized.includes("import")) return Upload;
  return Activity;
}

function activityColor(type: string) {
  const normalized = String(type || "").toLowerCase();

  if (normalized.includes("watch")) {
    return "bg-blue-50 text-blue-500 dark:bg-blue-500/10 dark:text-blue-400";
  }

  if (normalized.includes("portfolio")) {
    return "bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10 dark:text-emerald-400";
  }

  if (normalized.includes("import")) {
    return "bg-purple-50 text-purple-500 dark:bg-purple-500/10 dark:text-purple-400";
  }

  return "bg-orange-50 text-orange-500 dark:bg-orange-500/10 dark:text-orange-400";
}

function normalizeGrade(grade: any) {
  return String(grade || "Raw").trim();
}

function sameGrade(a: any, b: any) {
  return normalizeGrade(a).toLowerCase() === normalizeGrade(b).toLowerCase();
}

function getPortfolioCardId(card: any) {
  return (
    card?.card_id ||
    card?.cardId ||
    card?.source_id ||
    card?.sourceId ||
    card?.frontend_card_id ||
    card?.cardFrontendId ||
    card?.id ||
    null
  );
}

function getEntryId(card: any) {
  return card?.entryId || card?.entry_id || card?.portfolio_id || card?.portfolioId || card?.id;
}

function getCardImage(card: any) {
  return (
    card?.imageUrl ||
    card?.image_url ||
    card?.image ||
    "https://pokecollectorhub.com/assets/placeholder.png"
  );
}

const RowActions = ({
  card,
  gameType,
  onViewDetails,
  onRemove,
  onAddGrade,
}: {
  card?: any;
  gameType?: string;
  onViewDetails?: (card?: any) => void;
  onRemove?: (card?: any) => void;
  onAddGrade?: (card?: any) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleActionClick = (e: React.MouseEvent, actionLabel: string) => {
    e.stopPropagation();
    setIsOpen(false);

    if (actionLabel === "View Details") {
      if (onViewDetails) return onViewDetails(card);
      router.push(`/card/${card?.card_id || card?.id}?game=${gameType || "pokemon"}`);
    }

    if (actionLabel === "Add Grade") {
      if (onAddGrade) return onAddGrade(card);
    }

    if (actionLabel === "Remove") {
      if (onRemove) return onRemove(card);
      console.log(`Remove card: ${card?.entryId || card?.id}`);
    }
  };

  return (
    <div className="relative flex justify-end items-center" ref={containerRef}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: 10 }}
            className="absolute right-full mr-2 z-50 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden"
          >
            <div className="p-1.5">
              {[
                { label: "View Details", icon: Eye },
                { label: "Add Grade", icon: Plus },
                { label: "Remove", icon: Trash2, variant: "danger" },
              ].map((action, idx) => (
                <button
                  key={idx}
                  onClick={(e) => handleActionClick(e, action.label)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-colors",
                    action.variant === "danger"
                      ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                >
                  <action.icon size={14} strokeWidth={2.5} />
                  {action.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={cn(
          "p-1.5 rounded-full transition-all duration-200 relative z-10",
          isOpen
            ? "bg-slate-100 dark:bg-slate-800 text-emerald-500"
            : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600"
        )}
      >
        <MoreVertical size={18} />
      </button>
    </div>
  );
};

const AddGradeModal = ({
  userId,
  card,
  onClose,
  onAdded,
}: {
  userId: number;
  card: any;
  onClose: () => void;
  onAdded: (card: any, grade: string) => void;
}) => {
  const [selectedGrade, setSelectedGrade] = useState(normalizeGrade(card?.grade || "PSA 10"));
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const cardId = getPortfolioCardId(card);
  const cardImage = getCardImage(card);

  const handleSubmit = async () => {
    setMessage("");
    setSuccess(false);

    if (!userId) {
      setMessage("Please log in to add this grade.");
      return;
    }

    if (!cardId) {
      setMessage("Missing card information.");
      return;
    }

    try {
      setIsAdding(true);

      const result = await addCardToPortfolio({
        user_id: Number(userId),
        card_id: String(cardId),
        grade: selectedGrade,
      });

      if (result?.success) {
        setSuccess(true);
        setMessage(`${selectedGrade} added to your portfolio.`);
        onAdded(card, selectedGrade);

        setTimeout(() => {
          onClose();
        }, 700);
      } else {
        setMessage(result?.message || "Could not add this grade.");
      }
    } catch (error) {
      console.error("Failed to add portfolio grade:", error);
      setMessage("Something went wrong while adding this grade.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.18 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[2rem] shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100 dark:border-white/10 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
              Add Graded Card
            </h3>

            <p className="text-xs text-slate-500 font-medium mt-1">
              Choose another grade of this card to add to your portfolio.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition"
          >
            <X size={18} className="text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-20 h-28 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center overflow-hidden shrink-0 border border-slate-200 dark:border-white/10">
              <img src={cardImage} alt={card?.name || "Card"} className="w-full h-full object-contain p-2" />
            </div>

            <div className="min-w-0">
              <h4 className="font-black text-slate-900 dark:text-white text-sm uppercase line-clamp-2">
                {card?.name || "Unknown Card"}
              </h4>

              <p className="text-[11px] font-bold text-slate-400 uppercase mt-1 line-clamp-1">
                {card?.setName || card?.set || "Unknown Set"}
              </p>

              <p className="text-sm font-black text-[#00BA88] mt-2">
                Current: {normalizeGrade(card?.grade || "Raw")}
              </p>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
              Select Grade
            </p>

            <div className="grid grid-cols-3 gap-2">
              {ALL_GRADES.map((grade) => {
                const isCurrentGrade = sameGrade(grade, card?.grade);

                return (
                  <button
                    key={grade}
                    onClick={() => setSelectedGrade(grade)}
                    className={cn(
                      "relative py-3 rounded-xl border text-[11px] font-black uppercase transition-all",
                      selectedGrade === grade
                        ? "bg-[#00BA88] border-[#00BA88] text-white shadow-lg shadow-[#00BA88]/20"
                        : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-[#00BA88]/50",
                      isCurrentGrade && selectedGrade !== grade
                        ? "bg-slate-50 dark:bg-white/5"
                        : ""
                    )}
                  >
                    {grade}

                    {isCurrentGrade && (
                      <span className="block text-[7px] mt-1 opacity-70">Current</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {message && (
            <p
              className={cn(
                "text-xs font-bold text-center",
                success ? "text-emerald-500" : "text-slate-500"
              )}
            >
              {message}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={isAdding}
            className="w-full h-12 rounded-2xl bg-[#00BA88] hover:bg-[#00a377] text-white font-black uppercase tracking-widest text-xs transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isAdding ? (
              <>
                <Loader2 size={15} className="mr-2 animate-spin" />
                Adding...
              </>
            ) : success ? (
              <>
                <CheckCircle2 size={15} className="mr-2" />
                Added
              </>
            ) : (
              <>
                <Plus size={15} className="mr-2" />
                Add {selectedGrade}
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default function PortfolioDashboard({ data }: { data: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<PerformanceRange>("30D");
  const [currentPage, setCurrentPage] = useState(1);
  const [portfolioCards, setPortfolioCards] = useState<any[]>([]);
  const [gradeModalCard, setGradeModalCard] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedSection = searchParams.get("section");
  const mobileSection =
    requestedSection === "holdings" ||
    requestedSection === "allocation" ||
    requestedSection === "activity"
      ? requestedSection
      : "overview";

  const rawCards = Array.isArray(data?.cards) ? data.cards : [];

  useEffect(() => {
    setPortfolioCards(rawCards);
  }, [data]);

  const cards = portfolioCards;

  const userId =
    data?.userId || data?.user?.id || data?.id || data?.user_id || 0;

  const stats = data?.stats || { totalValue: 0, totalCards: 0, totalSets: 0 };

  const performance = data?.performance || {
    change30D: 0,
    change30DPct: 0,
    change90D: 0,
    change90DPct: 0,
    changeAll: 0,
    changeAllPct: 0,
    allTimeHigh: 0,
    allTimeLow: 0,
  };

  const allocation = Array.isArray(data?.allocation) ? data.allocation : [];
  const activities = Array.isArray(data?.activities) ? data.activities : [];

  const cardsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(cards.length / cardsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const paginatedCards = useMemo(() => {
    return cards.slice((currentPage - 1) * cardsPerPage, currentPage * cardsPerPage);
  }, [cards, currentPage]);

  const bestPerformingCard = useMemo(() => {
    if (!cards.length) return null;
    return [...cards].sort((a: any, b: any) => Number(b.change || 0) - Number(a.change || 0))[0];
  }, [cards]);

  const portfolioOverview = useMemo(() => {
    const totalQuantity = cards.reduce((sum: number, card: any) => sum + Number(card.quantity || 1), 0);
    const totalMarketValue = cards.reduce(
      (sum: number, card: any) =>
        sum + Number(card.lineValue || Number(card.value || 0) * Number(card.quantity || 1)),
      0
    );

    const avgCardValue = totalQuantity > 0 ? totalMarketValue / totalQuantity : 0;

    return [
      { label: "Cards", val: stats.totalCards || totalQuantity },
      { label: "Sets", val: stats.totalSets || 0 },
      { label: "Avg Value", val: money(avgCardValue) },
    ];
  }, [cards, stats.totalCards, stats.totalSets]);

  const chartConfig = useMemo(() => {
    const currentVal = Number(stats.totalValue || 0);

    const rangeDaysMap: Record<PerformanceRange, number> = {
      "30D": 30,
      "90D": 90,
      All: 180,
    };

    const pointsCountMap: Record<PerformanceRange, number> = {
      "30D": 7,
      "90D": 9,
      All: 10,
    };

    const days = rangeDaysMap[activeTab];
    const pointsCount = pointsCountMap[activeTab];

    const selectedChangePct =
      activeTab === "30D"
        ? Number(performance?.change30DPct || 0)
        : activeTab === "90D"
        ? Number(performance?.change90DPct || 0)
        : Number(performance?.changeAllPct || 0);

    const selectedChangeValue =
      activeTab === "30D"
        ? Number(performance?.change30D || 0)
        : activeTab === "90D"
        ? Number(performance?.change90D || 0)
        : Number(performance?.changeAll || 0);

    const safeCurrentVal = currentVal > 0 ? currentVal : 1000;
    const startValue =
      selectedChangePct !== -100 ? safeCurrentVal / (1 + selectedChangePct / 100) : safeCurrentVal;

    const generatedValues = Array.from({ length: pointsCount }).map((_, i) => {
      const progress = i / (pointsCount - 1);
      const baseValue = startValue + (safeCurrentVal - startValue) * progress;

      const waveOne = Math.sin(progress * Math.PI * 2) * 0.035;
      const waveTwo = Math.sin(progress * Math.PI * 5) * 0.018;
      const shapedValue = baseValue * (1 + waveOne + waveTwo);

      if (i === pointsCount - 1) return safeCurrentVal;
      return Math.max(shapedValue, 0);
    });

    const minValue = Math.min(...generatedValues);
    const maxValue = Math.max(...generatedValues);
    const valueRange = Math.max(maxValue - minValue, 1);

    const chartTop = 12;
    const chartBottom = 138;
    const chartHeight = chartBottom - chartTop;

    const points = generatedValues.map((value, i) => {
      const x = i * (400 / (pointsCount - 1));
      const normalized = (value - minValue) / valueRange;
      const y = chartBottom - normalized * chartHeight;

      const date = new Date();
      const daysBack = Math.round(days - (days * i) / (pointsCount - 1));
      date.setDate(date.getDate() - daysBack);

      const label =
        activeTab === "All"
          ? date.toLocaleDateString(undefined, { month: "short" })
          : date.toLocaleDateString(undefined, { month: "short", day: "numeric" });

      return { x, y, value, label };
    });

    const path = `M${points.map((p) => `${p.x},${p.y}`).join(" L")}`;
    const fill = `${path} V150 H0 Z`;

    const yLabels = [
      money(maxValue).replace(".00", ""),
      money(minValue + valueRange * 0.75).replace(".00", ""),
      money(minValue + valueRange * 0.5).replace(".00", ""),
      money(minValue + valueRange * 0.25).replace(".00", ""),
      money(minValue).replace(".00", ""),
    ];

    return {
      points,
      path,
      fill,
      yLabels,
      selectedChangePct,
      selectedChangeValue,
      lastPoint: points[points.length - 1],
    };
  }, [activeTab, stats.totalValue, performance]);

  const handleAddGradeToLocalState = (baseCard: any, grade: string) => {
    const baseCardId = String(getPortfolioCardId(baseCard) || "");

    setPortfolioCards((prev) => {
      const existingIndex = prev.findIndex((item) => {
        const itemCardId = String(getPortfolioCardId(item) || "");
        return itemCardId === baseCardId && sameGrade(item.grade, grade);
      });

      if (existingIndex >= 0) {
        return prev.map((item, index) => {
          if (index !== existingIndex) return item;

          const nextQuantity = Number(item.quantity || 1) + 1;
          const itemValue = Number(item.value || baseCard.value || 0);

          return {
            ...item,
            quantity: nextQuantity,
            lineValue: itemValue * nextQuantity,
          };
        });
      }

      const nextCard = {
        ...baseCard,
        id: `${getEntryId(baseCard) || baseCardId}-${grade}-${Date.now()}`,
        entryId: `${getEntryId(baseCard) || baseCardId}-${grade}-${Date.now()}`,
        grade,
        quantity: 1,
        lineValue: Number(baseCard.value || 0),
      };

      return [nextCard, ...prev];
    });

    setTimeout(() => {
      window.location.reload();
    }, 700);
  };

  const isEmpty = cards.length === 0;

  if (isEmpty) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 animate-in fade-in zoom-in duration-700">
        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[28px] flex items-center justify-center mb-8 shadow-sm">
          <Layers className="w-10 h-10 text-slate-300 dark:text-slate-600" />
        </div>

        <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
          Your portfolio is empty
        </h2>

        <p className="text-slate-500 dark:text-slate-400 text-[13px] md:text-[14px] font-medium max-w-sm mb-10 leading-relaxed">
          Start building your collection to see performance analytics, market value growth, and grade distribution.
        </p>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-brand text-white rounded-2xl text-[13px] font-black hover:bg-[#00a377] transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
        >
          <Plus size={18} strokeWidth={3} />
          <span>Add Your First Card</span>
        </button>

        <AnimatePresence>
          {isModalOpen && (
            <AddCardModal
              userId={userId || 0}
              onClose={() => setIsModalOpen(false)}
              onRefresh={() => window.location.reload()}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "animate-in fade-in slide-in-from-bottom-4 duration-700 md:pb-10",
        mobileSection === "allocation" ? "pb-4" : "pb-10"
      )}
    >
      <AnimatePresence>
        {gradeModalCard && (
          <AddGradeModal
            userId={Number(userId || 0)}
            card={gradeModalCard}
            onClose={() => setGradeModalCard(null)}
            onAdded={handleAddGradeToLocalState}
          />
        )}
      </AnimatePresence>

      <section className={cn("mb-5 px-0 md:hidden", mobileSection !== "overview" && "hidden")}>
        <h2 className="text-[17px] font-semibold tracking-tight text-slate-900 dark:text-white">
          Welcome back, <span className="text-[#00BA88]">{data?.user?.name || data?.user?.username || "Collector"}!</span>
        </h2>
        <p className="mt-1 text-[10px] font-medium text-slate-500 dark:text-slate-400">
          Your collection value changed by{" "}
          <span className={cn("font-bold", Number(performance.change30D || 0) >= 0 ? "text-emerald-500" : "text-red-500")}>
            {Number(performance.change30D || 0) >= 0 ? "+" : "-"}{money(Math.abs(Number(performance.change30D || 0)))} ({Number(performance.change30DPct || 0).toFixed(2)}%)
          </span>{" "}
          today.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-3 md:gap-6 lg:grid-cols-12">
        <div className={cn("space-y-3 md:block md:space-y-6 lg:col-span-8", mobileSection === "allocation" || mobileSection === "activity" ? "hidden" : "block")}>
          <div className={cn("group/card border-0 bg-transparent py-1 shadow-none md:block md:rounded-3xl md:border md:border-slate-100 md:bg-white md:p-8 md:shadow-[0_8px_30px_rgb(0,0,0,0.02)] md:dark:border-slate-800 md:dark:bg-slate-900", mobileSection !== "overview" && "hidden")}>
            <div className="mb-3 flex items-start justify-between gap-3 md:mb-8 md:gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-2 md:mb-1">
                  <h3 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500 md:text-sm md:font-black md:normal-case md:tracking-normal md:text-slate-800 md:dark:text-slate-200">
                    Total Portfolio Value
                  </h3>
                  <Info size={14} className="text-slate-300 dark:text-slate-600 md:opacity-0 md:group-hover/card:opacity-100 transition-opacity cursor-help" />
                </div>

                <div className="flex flex-col items-start gap-1 md:flex-row md:items-baseline md:gap-3">
                  <p className="text-[28px] font-extrabold leading-none tracking-tight text-slate-900 dark:text-white md:text-3xl md:font-black md:leading-normal">
                    {money(stats.totalValue)}
                  </p>

                  <p
                    className={cn(
                      "flex items-center gap-1 text-[11px] font-bold md:text-xs",
                      chartConfig.selectedChangePct >= 0 ? "text-emerald-500" : "text-red-500"
                    )}
                  >
                    <TrendingUp
                      size={12}
                      className={chartConfig.selectedChangePct < 0 ? "rotate-180" : ""}
                    />
                    {chartConfig.selectedChangePct >= 0 ? "+" : ""}
                    {chartConfig.selectedChangePct.toFixed(2)}% ({activeTab})
                  </p>
                </div>
              </div>

              <CustomDropdown
                value={activeTab}
                options={[...PERFORMANCE_TABS]}
                onChange={(value) => setActiveTab(value as PerformanceRange)}
                className="w-[72px] min-w-[72px] shrink-0 md:hidden"
                triggerClassName="h-9 min-w-[72px] rounded-lg border-[#00BA88]/50 bg-transparent px-2.5 text-[#00BA88] dark:bg-transparent"
                valueClassName="min-w-max overflow-visible text-clip whitespace-nowrap font-semibold text-[#00BA88]"
              />

              <div className="hidden w-auto shrink-0 gap-0.5 rounded-xl border border-slate-100 bg-slate-50 p-1.5 shadow-inner dark:border-slate-800/50 dark:bg-[#050b18] md:flex md:gap-1">
                {PERFORMANCE_TABS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={cn(
                      "rounded-lg px-4 py-2 text-[11px] font-black uppercase tracking-wider transition-all duration-200",
                      activeTab === t
                        ? "bg-[#10b981] text-white shadow-[0_4px_12px_rgba(16,185,129,0.2)]"
                        : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-10">
              <div className="flex h-[190px] gap-2 md:col-span-7 md:h-64 md:gap-4">
                <div className="flex flex-col justify-between py-1 text-[9px] md:text-[10px] font-bold text-slate-400 text-right w-12 md:w-14 shrink-0">
                  {chartConfig.yLabels.map((label, idx) => (
                    <span key={idx}>{label}</span>
                  ))}
                </div>

                <div className="flex-1 flex flex-col justify-between relative min-w-0">
                  <div className="flex-1 relative">
                    <svg
                      viewBox="0 0 400 150"
                      className="w-full h-full overflow-visible"
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      <motion.path
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                        d={chartConfig.fill}
                        fill="url(#chartGrad)"
                      />

                      <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                        d={chartConfig.path}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="4"
                        strokeLinecap="round"
                        className="drop-shadow-[0_4px_10px_rgba(16,185,129,0.3)]"
                      />

                      {chartConfig.lastPoint && (
                        <g>
                          <motion.circle
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            cx={chartConfig.lastPoint.x}
                            cy={chartConfig.lastPoint.y}
                            r="8"
                            fill="#10b981"
                          />
                          <circle
                            cx={chartConfig.lastPoint.x}
                            cy={chartConfig.lastPoint.y}
                            r="4"
                            fill="#10b981"
                          />
                        </g>
                      )}
                    </svg>
                  </div>

                  <div className="flex justify-between mt-4 text-[9px] md:text-[10px] font-bold text-slate-400 tracking-tighter">
                    {chartConfig.points.map((p, i) => (
                      <span key={i} className={cn(i % 2 !== 0 ? "hidden sm:inline md:inline" : "")}>
                        {p.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="hidden flex-col justify-between space-y-3 border-slate-50 pt-6 dark:border-slate-800 md:col-span-5 md:flex md:border-l md:pl-8 md:pt-0">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                  Performance Overview
                </p>

                {[
                  {
                    label: `Change (${activeTab})`,
                    val: `${chartConfig.selectedChangeValue >= 0 ? "+" : "-"}${money(
                      Math.abs(chartConfig.selectedChangeValue)
                    )}`,
                    status: chartConfig.selectedChangeValue >= 0 ? "pos" : "neg",
                  },
                  {
                    label: "All Time High",
                    val: money(performance?.allTimeHigh),
                    status: "neutral",
                  },
                  {
                    label: "All Time Low",
                    val: money(performance?.allTimeLow),
                    status: "neutral",
                  },
                  {
                    label: "Best Performing Card",
                    val: bestPerformingCard?.name || "N/A",
                    sub:
                      Number(bestPerformingCard?.change || 0) >= 0
                        ? `+${Number(bestPerformingCard?.change || 0).toFixed(2)}%`
                        : `${Number(bestPerformingCard?.change || 0).toFixed(2)}%`,
                    status: Number(bestPerformingCard?.change || 0) >= 0 ? "pos" : "neg",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center group/item border-b border-slate-50 dark:border-slate-800 pb-3 md:pb-2 last:border-0"
                  >
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      {item.label}
                    </p>

                    <div className="text-right max-w-[170px]">
                      <p
                        className={cn(
                          "text-[12px] font-black flex items-center justify-end gap-1 truncate",
                          item.status === "pos"
                            ? "text-emerald-500"
                            : item.status === "neg"
                            ? "text-red-500"
                            : "text-slate-900 dark:text-white"
                        )}
                      >
                        {item.status === "pos" && <TrendingUp size={10} />}
                        {item.val}
                      </p>

                      {item.sub && (
                        <p
                          className={cn(
                            "text-[9px] font-bold",
                            item.status === "pos" ? "text-emerald-500/80" : "text-red-500/80"
                          )}
                        >
                          {item.sub}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 grid grid-cols-4 border-y border-slate-100 py-3 dark:border-slate-800 md:hidden">
              {[
                { label: "Cards", value: stats.totalCards || portfolioOverview[0]?.val || 0 },
                { label: "Sets", value: stats.totalSets || portfolioOverview[1]?.val || 0 },
                { label: "Avg Value", value: portfolioOverview[2]?.val || money(0) },
                {
                  label: "30D Change",
                  value: `${Number(performance?.change30D || 0) >= 0 ? "+" : "-"}${money(
                    Math.abs(Number(performance?.change30D || 0))
                  )}`,
                },
              ].map((item, index) => (
                <div
                  key={item.label}
                  className={cn(
                    "min-w-0 px-2 text-center first:pl-0 last:pr-0",
                    index > 0 && "border-l border-slate-100 dark:border-slate-800"
                  )}
                >
                  <p
                    className={cn(
                      "truncate text-[13px] font-bold tabular-nums text-slate-900 dark:text-white",
                      item.label === "30D Change" &&
                        (Number(performance?.change30D || 0) >= 0
                          ? "text-emerald-500"
                          : "text-red-500")
                    )}
                  >
                    {item.value}
                  </p>
                  <p className="mt-1 text-[9px] font-bold uppercase leading-tight tracking-wide text-slate-400">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className={cn("overflow-hidden border-0 bg-transparent shadow-none md:block md:rounded-3xl md:border md:border-slate-100 md:bg-white md:shadow-[0_8px_30px_rgb(0,0,0,0.02)] md:dark:border-slate-800 md:dark:bg-slate-900", mobileSection !== "overview" && mobileSection !== "holdings" && "hidden")}>
            <div className="flex items-center justify-between border-b border-slate-100 py-3 dark:border-slate-800 md:p-6">
              <h3 className="flex items-center gap-2 text-[14px] font-semibold text-slate-800 dark:text-slate-200 md:text-[15px] md:font-bold">
                Your Top Holdings <Info size={14} className="hidden text-slate-300 dark:text-slate-600 md:block" />
              </h3>

              <button onClick={() => router.push('/portfolio?section=holdings')} className={cn("text-[10px] font-bold text-[#00BA88] md:hidden", mobileSection !== "overview" && "hidden")}>
                View All
              </button>
              <span className={cn("text-[10px] font-bold text-slate-400", mobileSection === "overview" && "hidden md:inline")}>
                Page {currentPage} of {totalPages}
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 md:hidden">
              {paginatedCards.map((card: any, i: number) => {
                const lineValue = Number(
                  card.lineValue || Number(card.value || 0) * Number(card.quantity || 1)
                );
                const change = Number(card.change || 0);
                const isPositive = change >= 0;
                const rawPath = card.canonical_path || card.url || "";

                const handleNavigation = () => {
                  if (rawPath) {
                    const dynamicRoute = rawPath.startsWith("/card") ? rawPath : `/card${rawPath}`;
                    router.push(dynamicRoute);
                  } else if (card.card_id) {
                    router.push(`/card/${card.card_id}?game=${card.game || "pokemon"}`);
                  }
                };

                return (
                  <button
                    key={card.entryId || card.id || `${card.card_id}-${card.grade}-${i}`}
                    type="button"
                    onClick={handleNavigation}
                    className="grid w-full grid-cols-[38px_minmax(0,1fr)_auto] items-center gap-2.5 py-2.5 text-left"
                  >
                    <span className="h-[52px] w-[38px] overflow-hidden rounded border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
                      <img
                        src={getCardImage(card)}
                        alt={card.name}
                        className="h-full w-full object-cover"
                      />
                    </span>

                    <span className="min-w-0">
                      <span className="block truncate text-[13px] font-semibold text-slate-900 dark:text-white">
                        {card.name}
                      </span>
                      <span className="mt-0.5 block truncate text-[10px] font-semibold text-slate-400">
                        {card.setName || card.set || "Unknown Set"}
                      </span>
                      <span className="mt-1.5 inline-flex rounded-md border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[9px] font-black text-indigo-600 dark:border-indigo-500/25 dark:bg-indigo-500/10 dark:text-indigo-400">
                        {card.grade || "Raw"}
                      </span>
                    </span>

                    <span className="text-right">
                      <span className="block whitespace-nowrap text-[13px] font-black tabular-nums text-slate-900 dark:text-white">
                        {money(lineValue)}
                      </span>
                      <span
                        className={cn(
                          "mt-1 block text-[11px] font-black tabular-nums",
                          isPositive ? "text-emerald-500" : "text-red-500"
                        )}
                      >
                        {isPositive ? "+" : "-"}{Math.abs(change).toFixed(2)}%
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="hidden w-full overflow-x-auto scrollbar-hide md:block">
              <table className="w-full text-left border-collapse table-fixed min-w-225 lg:min-w-full">
                <thead>
                  <tr className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-50 dark:border-slate-800">
                    <th className="px-4 py-4 w-[22%]">Card</th>
                    <th className="px-4 py-4 w-[16%]">Set</th>
                    <th className="px-2 py-4 w-[8%] text-center">Grade</th>
                    <th className="px-4 py-4 w-[13%]">Last Sale</th>
                    <th className="px-4 py-4 w-[13%]">Market Value</th>
                    <th className="px-4 py-4 w-[10%]">Change</th>
                    <th className="px-4 py-4 w-[12%]">Allocation</th>
                    <th className="px-4 py-4 w-[6%]"></th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {paginatedCards.map((card: any, i: number) => {
                    const lineValue = Number(card.lineValue || Number(card.value || 0) * Number(card.quantity || 1));
                    const isPositive = Number(card.change || 0) >= 0;
                    const rawPath = card.canonical_path || card.url || "";

                    const handleNavigation = () => {
                      if (rawPath) {
                        const dynamicRoute = rawPath.startsWith("/card") ? rawPath : `/card${rawPath}`;
                        router.push(dynamicRoute);
                      } else if (card.card_id) {
                        router.push(`/card/${card.card_id}?game=${card.game || "pokemon"}`);
                      }
                    };

                    return (
                      <tr
                        key={card.entryId || card.id || `${card.card_id}-${card.grade}-${i}`}
                        onClick={handleNavigation}
                        className="group cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-950/50 transition-all"
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-8 h-11 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 shrink-0 overflow-hidden">
                              {getCardImage(card) ? (
                                <img src={getCardImage(card)} alt={card.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[8px] text-slate-400 font-bold">
                                  NO IMG
                                </div>
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors truncate">
                                {card.name}
                              </p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase">
                                Qty {card.quantity || 1}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <p className="text-[11px] text-slate-400 font-bold uppercase truncate">
                            {card.setName || card.set || "Unknown Set"}
                          </p>
                        </td>

                        <td className="px-2 py-4 text-center">
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-black bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20">
                            {card.grade || "Raw"}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <p className="text-[13px] font-black text-slate-900 dark:text-white leading-tight">
                            {money(card.value)}
                          </p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                            Market Price
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          <p className="text-[13px] font-black text-slate-900 dark:text-white leading-tight">
                            {money(lineValue)}
                          </p>
                          <p
                            className={cn(
                              "text-[9px] font-bold flex items-center gap-0.5",
                              isPositive ? "text-emerald-500" : "text-red-500"
                            )}
                          >
                            {isPositive ? "↗" : "↘"} {Math.abs(Number(card.change || 0)).toFixed(2)}%
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          <p
                            className={cn(
                              "text-[13px] font-black",
                              isPositive ? "text-emerald-500" : "text-red-500"
                            )}
                          >
                            {isPositive ? "+" : "-"}
                            {money(Math.abs(Number(card.change30D || 0)))}
                          </p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">30D</p>
                        </td>

                        <td className="px-4 py-4">
                          <p className="text-[13px] font-black text-slate-800 dark:text-slate-200">
                            {stats.totalValue > 0 ? ((lineValue / stats.totalValue) * 100).toFixed(2) : "0.00"}%
                          </p>
                        </td>

                        <td className="px-4 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <RowActions
                            card={card}
                            gameType={card.game || ""}
                            onViewDetails={handleNavigation}
                            onAddGrade={() => setGradeModalCard(card)}
                            onRemove={() => console.log("Remove triggered for asset id:", card.entryId || card.id)}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className={cn("items-center justify-between border-t border-slate-100 bg-transparent p-3 dark:border-slate-800 md:flex md:bg-slate-50/30 md:dark:bg-slate-950/30 md:p-4", mobileSection === "holdings" ? "flex" : "hidden")}>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-[11px] font-bold text-slate-500 hover:text-emerald-500 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors flex items-center gap-2"
              >
                <ArrowRight size={14} className="rotate-180" /> Previous
              </button>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      "w-8 h-8 rounded-lg text-[11px] font-black transition-all",
                      currentPage === page
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                        : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    )}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-[11px] font-bold text-slate-500 hover:text-emerald-500 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors flex items-center gap-2"
              >
                Next <ArrowRight size={14} />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className={cn(
              "mx-0 flex w-full items-center justify-center gap-2 rounded-xl border border-[#00BA88] px-4 py-3.5 text-[14px] font-black text-[#00BA88] transition-colors hover:bg-emerald-500/5 md:hidden",
              mobileSection !== "overview" && "hidden"
            )}
          >
            <Plus size={18} strokeWidth={2.5} />
            Add Card to Portfolio
          </button>
        </div>

        <div className={cn("space-y-3 md:block md:space-y-6 lg:col-span-4", mobileSection === "allocation" || mobileSection === "activity" ? "block" : "hidden")}>
          <div className={cn("md:block", mobileSection !== "allocation" && "hidden")}>
            <AllocationCard
              title="Portfolio Allocation"
              data={allocation.length > 0 ? allocation : ALLOCATION}
              centerValue={stats.totalCards}
              centerLabel="Total Cards"
              onFooterClick={() => {}}
            />
          </div>

          <div className={cn("border-0 bg-transparent py-1 shadow-none md:block md:rounded-3xl md:border md:border-slate-100 md:bg-white md:p-8 md:shadow-[0_4px_20px_rgba(0,0,0,0.03)] md:dark:border-slate-800 md:dark:bg-slate-900", mobileSection !== "activity" && "hidden")}>
            <div className="mb-5 flex items-center justify-between md:mb-6">
              <div className="flex items-center gap-2">
                <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-100">Recent Activity</h3>
                <Info size={14} className="text-slate-300" />
              </div>
            </div>

            <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {Array.isArray(activities) && activities.length > 0 ? (
                activities.map((act: any) => {
                  const actionType = act.actionType || act.action_type || "";
                  const Icon = activityIcon(actionType);
                  const meta = act.metadata || {};
                  const badge = meta.display_badge || meta.grade || actionType || "Activity";

                  return (
                    <div key={act.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0 md:gap-4 md:py-4">
                      <div className="flex min-w-0 items-center gap-3 md:gap-4">
                        <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full md:h-10 md:w-10", activityColor(actionType))}>
                          <Icon size={16} />
                        </div>

                        <div className="min-w-0">
                          <p className="line-clamp-2 text-[12px] font-bold text-slate-800 dark:text-slate-200 md:text-[13px]">
                            {act.description || "Portfolio activity"}
                          </p>
                          <p className="truncate text-[10px] font-medium text-slate-400 md:text-[12px]">{badge}</p>
                        </div>
                      </div>

                      <p className="text-[11px] font-semibold text-slate-400 whitespace-nowrap">
                        {formatDate(act.createdAt || act.created_at)}
                      </p>
                    </div>
                  );
                })
              ) : (
                <div className="py-6 text-[12px] font-bold text-slate-400">
                  No recent portfolio activity yet.
                </div>
              )}
            </div>
          </div>

          <div className="hidden -mx-4 border-y border-slate-100 bg-white px-4 py-5 shadow-none dark:border-slate-800 dark:bg-slate-900 sm:mx-0 sm:rounded-2xl sm:border-x md:block md:rounded-3xl md:p-8 md:shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2">
                <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-100">
                  Portfolio Overview
                </h3>
                <Info size={14} className="text-slate-300 cursor-help" />
              </div>
            </div>

            <div className="grid grid-cols-3">
              {portfolioOverview.map((stat, i) => (
                <div
                  key={i}
                  className={`flex flex-col px-4 ${
                    i !== 0 ? "border-l border-slate-50 dark:border-slate-800" : "pl-0"
                  }`}
                >
                  <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight truncate">
                    {stat.val}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 tracking-tight">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-5 border-t border-slate-50 dark:border-slate-800 grid grid-cols-2 gap-3">
              <div className="border-r border-slate-100 pr-3 dark:border-slate-800 md:rounded-2xl md:border md:bg-slate-50 md:p-4 md:dark:bg-slate-950/50">
                <div className="flex items-center gap-2 mb-2 text-emerald-500">
                  <DollarSign size={15} />
                  <span className="text-[10px] font-black uppercase tracking-wider">Value</span>
                </div>
                <p className="text-sm font-black text-slate-900 dark:text-white">{money(stats.totalValue)}</p>
              </div>

              <div className="pl-1 md:rounded-2xl md:border md:border-slate-100 md:bg-slate-50 md:p-4 md:dark:border-slate-800 md:dark:bg-slate-950/50">
                <div className="flex items-center gap-2 mb-2 text-emerald-500">
                  <BarChart3 size={15} />
                  <span className="text-[10px] font-black uppercase tracking-wider">30D</span>
                </div>
                <p
                  className={cn(
                    "text-sm font-black",
                    Number(performance?.change30D || 0) >= 0 ? "text-emerald-500" : "text-red-500"
                  )}
                >
                  {Number(performance?.change30D || 0) >= 0 ? "+" : "-"}
                  {money(Math.abs(Number(performance?.change30D || 0)))}
                </p>
              </div>
            </div>

            {/* Removed for now */}
            {/* <button>View full breakdown</button> */}
            {/* <button>Go to Watchlist</button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
