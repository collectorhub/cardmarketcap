"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MoreVertical,
  TrendingUp,
  TrendingDown,
  Bell,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { addCardToWatchlist } from "@/lib/queries/watchlist";

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

function money(value: any) {
  return `$${Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(dateString?: string | null) {
  if (!dateString) return "N/A";

  const date = new Date(String(dateString).replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function normalizeGrade(grade: any) {
  return String(grade || "Raw").trim();
}

function getWatchlistCardId(card: any) {
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

function getCardImage(card: any) {
  return (
    card?.imageUrl ||
    card?.image_url ||
    card?.image ||
    "https://pokecollectorhub.com/assets/placeholder.png"
  );
}

function buildSparkPath(change: number) {
  if (change > 0) {
    return "M0,32 Q20,26 40,28 T70,12 T100,6";
  }

  if (change < 0) {
    return "M0,6 Q20,12 40,18 T70,30 T100,36";
  }

  return "M0,22 Q25,18 50,22 T75,20 T100,22";
}

const Sparkline = ({ change, index }: { change: number; index: number }) => {
  const isUp = change >= 0;
  const color = isUp ? "#10b981" : "#ef4444";
  const path = buildSparkPath(change);

  const lastY = path.split("T").pop()?.split(",")[1] || "22";

  return (
    <div className="h-10 w-full max-w-[120px] flex items-center">
      <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id={`watch-gradient-${index}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        <motion.path
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          d={`${path} L 100,40 L 0,40 Z`}
          fill={`url(#watch-gradient-${index})`}
        />

        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
          d={path}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
        />

        <circle cx="100" cy={lastY} r="2.5" fill={color} />
        <circle cx="100" cy={lastY} r="6" fill={color} className="animate-pulse opacity-20 blur-sm" />
      </svg>
    </div>
  );
};

const AddGradeModal = ({
  userId,
  card,
  onClose,
}: {
  userId: number;
  card: any;
  onClose: () => void;
}) => {
  const [selectedGrade, setSelectedGrade] = useState(normalizeGrade(card?.grade || "PSA 10"));
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const cardId = getWatchlistCardId(card);
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

      const result = await addCardToWatchlist({
        user_id: Number(userId),
        card_id: String(cardId),
        grade: selectedGrade,
      });

      if (result?.success) {
        setSuccess(true);
        setMessage(`${selectedGrade} added to your watchlist.`);

        setTimeout(() => {
          window.location.reload();
        }, 700);
      } else {
        setMessage(result?.message || "Could not add this grade.");
      }
    } catch (error) {
      console.error("Failed to add watchlist grade:", error);
      setMessage("Something went wrong while adding this grade.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[120] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4"
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
              Add Watchlist Grade
            </h3>

            <p className="text-xs text-slate-500 font-medium mt-1">
              Choose another grade of this card to track.
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
                const isCurrentGrade =
                  normalizeGrade(grade).toLowerCase() === normalizeGrade(card?.grade).toLowerCase();

                return (
                  <button
                    key={grade}
                    onClick={() => setSelectedGrade(grade)}
                    className={cn(
                      "relative py-3 rounded-xl border text-[11px] font-black uppercase transition-all cursor-pointer",
                      selectedGrade === grade
                        ? "bg-[#00BA88] border-[#00BA88] text-white shadow-lg shadow-[#00BA88]/20"
                        : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-[#00BA88]/50",
                      isCurrentGrade && selectedGrade !== grade ? "bg-slate-50 dark:bg-white/5" : ""
                    )}
                  >
                    {grade}

                    {isCurrentGrade && (
                      <span className="block text-[7px] mt-1 opacity-70">
                        Current
                      </span>
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

const RowActions = ({
  onViewDetails,
  onAddGrade,
  onRemove,
}: {
  onViewDetails: () => void;
  onAddGrade: () => void;
  onRemove?: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const actions = [
    { label: "View Details", icon: Eye, action: onViewDetails },
    { label: "Add Grade", icon: Plus, action: onAddGrade },
    { label: "Remove", icon: Trash2, variant: "danger", action: onRemove },
  ];

  return (
    <div className="relative flex justify-end items-center" ref={containerRef}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: 10 }}
            className="absolute right-full mr-2 z-[100] w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden"
          >
            <div className="p-1.5">
              {actions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                    if (action.action) action.action();
                  }}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer",
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
          "p-1.5 rounded-full transition-all duration-200 cursor-pointer",
          isOpen
            ? "bg-slate-100 dark:bg-slate-800 text-emerald-500"
            : "text-slate-300 dark:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
        )}
      >
        <MoreVertical size={18} />
      </button>
    </div>
  );
};

export default function WatchlistTable({
  userId = 0,
  cards = [],
  totalPages = 1,
  currentPage = 1,
  totalRecords = 0,
}: {
  userId?: number;
  cards: any[];
  totalPages?: number;
  currentPage?: number;
  totalRecords?: number;
}) {
  const router = useRouter();
  const [page, setPage] = useState(currentPage);
  const [gradeModalCard, setGradeModalCard] = useState<any>(null);

  const pageSize = 8;
  const computedTotalPages = Math.max(1, Math.ceil(cards.length / pageSize));
  const effectiveTotalPages = totalPages > 1 ? totalPages : computedTotalPages;

  useEffect(() => {
    setPage(1);
  }, [cards.length]);

  const paginatedCards = useMemo(() => {
    if (totalPages > 1) return cards;

    return cards.slice((page - 1) * pageSize, page * pageSize);
  }, [cards, page, totalPages]);

  const gradeCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    cards.forEach((card) => {
      const grade = card.grade || "Raw";
      counts[grade] = (counts[grade] || 0) + 1;
    });

    return counts;
  }, [cards]);

  const filters = [
    { label: "All Cards", count: totalRecords || cards.length },
    { label: "PSA 10", count: gradeCounts["PSA 10"] || gradeCounts["10"] || 0 },
    { label: "PSA 9", count: gradeCounts["PSA 9"] || gradeCounts["9"] || 0 },
    { label: "Raw", count: gradeCounts["Raw"] || gradeCounts["RAW"] || 0 },
  ];

  return (
    <div className="flex flex-col overflow-hidden border-0 bg-transparent shadow-none md:rounded-[32px] md:border md:border-slate-100 md:bg-white md:shadow-sm md:dark:border-slate-800 md:dark:bg-slate-900">
      <AnimatePresence>
        {gradeModalCard && (
          <AddGradeModal
            userId={Number(userId || 0)}
            card={gradeModalCard}
            onClose={() => setGradeModalCard(null)}
          />
        )}
      </AnimatePresence>

      <div className="px-4 md:px-6 py-4 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
        <div className="lg:hidden">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">
            Watchlist Assets
          </h3>
        </div>

        <div className="hidden lg:flex flex-wrap items-center gap-2">
          {filters.map((f, index) => (
            <button
              key={f.label}
              className={cn(
                "px-5 py-2.5 rounded-xl text-[11px] font-black transition-all whitespace-nowrap border cursor-default",
                index === 0
                  ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/20"
                  : "bg-slate-50/50 dark:bg-slate-950 border-transparent text-slate-500 dark:text-slate-400"
              )}
            >
              {f.label} <span className="opacity-50 ml-1">({f.count})</span>
            </button>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-2">
          {["All Sets", "All Grades", "Sort: Market Value"].map((label) => (
            <button
              key={label}
              className="flex items-center gap-8 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-[11px] font-bold text-slate-600 dark:text-slate-400 opacity-60 cursor-not-allowed"
              disabled
            >
              {label}
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="text-slate-400 dark:text-slate-600 shrink-0">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <div className="w-full overflow-x-auto scrollbar-hide relative">
        <table className="w-full text-left border-collapse min-w-[1000px] lg:min-w-full table-fixed md:table-auto transition-opacity duration-200">
          <thead>
            <tr className="text-[9px] md:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-50 dark:border-slate-800">
              <th className="px-4 md:px-6 py-4 w-[200px] md:w-[250px]">Card</th>
              <th className="px-4 py-4 w-[140px] md:w-[180px]">Set</th>
              <th className="px-2 py-4 w-[80px] md:w-[100px] text-center">Grade</th>
              <th className="px-4 py-4 w-[130px] md:w-[160px]">Current Value</th>
              <th className="px-4 py-4 w-[110px] md:w-[140px]">30D</th>
              <th className="px-4 py-4 w-[110px] md:w-[140px]">90D</th>
              <th className="px-4 py-4 w-[140px] md:w-[160px]">Last Sale</th>
              <th className="px-4 py-4 w-[70px] md:w-[80px] text-center">Alerts</th>
              <th className="px-4 md:px-6 py-4 w-[60px]"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {paginatedCards.map((card, i) => {
              const change30 = Number(card.change30D || 0);
              const change90 = Number(card.change90D || 0);
              const isUp30 = change30 >= 0;

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
                  key={card.watchlist_id || card.id || `${card.card_id}-${card.grade}-${i}`}
                  onClick={handleNavigation}
                  className="group hover:bg-slate-50/50 dark:hover:bg-slate-950/50 transition-all cursor-pointer"
                >
                  <td className="px-4 md:px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-11 md:w-9 md:h-12 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 shrink-0 overflow-hidden">
                        {getCardImage(card) ? (
                          <img src={getCardImage(card)} alt={card.name || "Card"} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[8px] text-slate-400 font-bold">
                            NO IMG
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs md:text-sm font-black text-slate-900 dark:text-white truncate">
                          {card.name || "Unknown Card"}
                        </p>
                        <p className="text-[9px] md:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase leading-none mt-1">
                          # {card.cardNumber || card.number || "—"}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-[11px] md:text-[12px] font-bold text-slate-500 dark:text-slate-400 uppercase truncate">
                    {card.setName || card.set || "Unknown Set"}
                  </td>

                  <td className="px-2 py-4 text-center">
                    <span className="inline-flex px-1.5 py-0.5 rounded text-[9px] md:text-[10px] font-black bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20">
                      {card.grade || "Raw"}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <p className="text-sm md:text-[15px] font-black text-slate-900 dark:text-white">
                      {money(card.value)}
                    </p>
                    <p
                      className={cn(
                        "text-[9px] md:text-[10px] font-black flex items-center gap-0.5 mt-0.5",
                        isUp30 ? "text-emerald-500" : "text-red-500"
                      )}
                    >
                      {isUp30 ? <TrendingUp size={10} strokeWidth={3} /> : <TrendingDown size={10} strokeWidth={3} />}
                      {isUp30 ? "+" : ""}
                      {change30.toFixed(2)}%
                    </p>
                  </td>

                  <td className="px-4 py-4">
                    <Sparkline index={i * 2} change={change30} />
                  </td>

                  <td className="px-4 py-4">
                    <Sparkline index={i * 2 + 1} change={change90} />
                  </td>

                  <td className="px-4 py-4">
                    <p className="text-xs md:text-[13px] font-black text-slate-900 dark:text-white leading-tight">
                      {money(card.lastSalePrice || card.value)}
                    </p>
                    <p className="text-[9px] md:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">
                      {formatDate(card.lastSaleDate)}
                    </p>
                  </td>

                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 rounded-full border transition-all cursor-pointer text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20"
                    >
                      <Bell size={12} strokeWidth={3} />
                    </button>
                  </td>

                  <td className="px-4 md:px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <RowActions
                      onViewDetails={handleNavigation}
                      onAddGrade={() => setGradeModalCard(card)}
                      onRemove={() => console.log("Remove triggered for item id:", card.watchlist_id || card.id)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {cards.length > pageSize && (
        <div className="p-4 md:p-6 bg-slate-50/30 dark:bg-slate-950/30 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
          <p className="text-[9px] md:text-xs font-black uppercase tracking-widest text-slate-400">
            Page {page} / {effectiveTotalPages}
          </p>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="cursor-pointer p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-30 transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="hidden md:flex gap-1.5">
              {Array.from({ length: Math.min(5, effectiveTotalPages) }).map((_, i) => {
                let pageNum = page <= 3 ? i + 1 : page - 2 + i;
                if (pageNum > effectiveTotalPages) return null;

                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={cn(
                      "h-9 w-9 rounded-lg text-xs font-black transition-all cursor-pointer",
                      page === pageNum ? "bg-[#00BA88] text-white" : "text-slate-400 hover:text-slate-900"
                    )}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              disabled={page === effectiveTotalPages}
              onClick={() => setPage((prev) => Math.min(prev + 1, effectiveTotalPages))}
              className="cursor-pointer p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-30 transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
