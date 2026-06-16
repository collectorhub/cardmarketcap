"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  ArrowUp,
  ArrowDown,
  Inbox,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface Card {
  id: string | number;
  name: string;
  set: string;
  price: string;
  h24: string;
  score: number;
  type?: string;
  grade?: string;
  image: string;
  url?: string;
}

interface TrendingCardsProps {
  cards: Card[];
  itemsPerPage?: number;
  loading?: boolean;
}

const PLACEHOLDER_IMAGE = "https://pokecollectorhub.com/assets/placeholder.png";

function formatPercent(value?: string) {
  const clean = String(value || "0").replace("%", "").trim();
  return clean;
}

function isNegative(value?: string) {
  return formatPercent(value).startsWith("-");
}

function TrendingSkeleton() {
  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="md:hidden flex flex-col divide-y divide-slate-100 dark:divide-slate-800">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-4 flex items-center gap-4 animate-pulse">
            <div className="h-16 w-12 shrink-0 rounded-lg bg-slate-100 dark:bg-slate-800" />
            <div className="flex-1 min-w-0 space-y-3">
              <div className="h-3 w-40 rounded bg-slate-100 dark:bg-slate-800" />
              <div className="h-3 w-24 rounded bg-slate-100 dark:bg-slate-800" />
            </div>
            <div className="h-4 w-16 rounded bg-slate-100 dark:bg-slate-800" />
          </div>
        ))}
      </div>

      <div className="hidden md:block">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="px-8 py-5 flex items-center gap-6 border-b border-slate-100 dark:border-slate-800 last:border-b-0 animate-pulse"
          >
            <div className="h-12 w-9 shrink-0 rounded-md bg-slate-100 dark:bg-slate-800" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-56 rounded bg-slate-100 dark:bg-slate-800" />
              <div className="h-2 w-32 rounded bg-slate-100 dark:bg-slate-800" />
            </div>
            <div className="h-3 w-16 rounded bg-slate-100 dark:bg-slate-800" />
            <div className="h-3 w-20 rounded bg-slate-100 dark:bg-slate-800" />
            <div className="h-3 w-12 rounded bg-slate-100 dark:bg-slate-800" />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function TrendingCards({
  cards = [],
  itemsPerPage = 8,
  loading = false,
}: TrendingCardsProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      if (activeTab === "All") return true;
      if (activeTab === "PSA 10") return card.grade?.toUpperCase() === "PSA 10";
      if (activeTab === "Raw") return card.grade?.toUpperCase() === "RAW";
      if (activeTab === "Vintage") return card.type?.toLowerCase() === "vintage";
      if (activeTab === "Modern") return card.type?.toLowerCase() === "modern";
      return true;
    });
  }, [cards, activeTab]);

  const totalPages = Math.max(1, Math.ceil(filteredCards.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const paginatedCards = filteredCards.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, cards.length]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleCardClick = (card: Card) => {
    router.push(card.url || `/card/${card.id}`);
  };

  const fromCount = filteredCards.length === 0 ? 0 : startIndex + 1;
  const toCount = Math.min(startIndex + itemsPerPage, filteredCards.length);

  return (
    <div className="rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
      <div className="p-5 md:p-8 border-b border-slate-100 dark:border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Flame className="h-4 w-4 text-orange-500 fill-orange-500" />
              <h3 className="font-bold text-slate-900 dark:text-white">
                Trending Cards
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Highest attention • price movement across marketplaces.
            </p>
          </div>

          <div className="overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
            <div className="flex gap-2 p-1 bg-slate-50 dark:bg-slate-800/50 rounded-2xl w-fit relative">
              {["All", "PSA 10", "Raw", "Vintage", "Modern"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={cn(
                    "relative px-4 py-1.5 text-[10px] font-black rounded-xl transition-colors z-10 whitespace-nowrap",
                    activeTab === tab
                      ? "text-white"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                  )}
                >
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activePill"
                      className="absolute inset-0 bg-[#00BA88] rounded-xl shadow-md"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10">{tab}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative min-h-[400px]">
        <AnimatePresence mode="wait">
          {loading ? (
            <TrendingSkeleton />
          ) : paginatedCards.length > 0 ? (
            <motion.div
              key={`${activeTab}-${safeCurrentPage}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="md:hidden flex flex-col divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedCards.map((card) => {
                  const negative = isNegative(card.h24);
                  const percent = formatPercent(card.h24);

                  return (
                    <div
                      key={card.id}
                      onClick={() => handleCardClick(card)}
                      className="p-4 flex items-center gap-4 active:bg-slate-50 dark:active:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <div className="h-16 w-12 shrink-0 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 dark:border-slate-800">
                        <img
                          src={card.image || PLACEHOLDER_IMAGE}
                          alt={card.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = PLACEHOLDER_IMAGE;
                          }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1 gap-3">
                          <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {card.name}
                          </p>
                          <span className="text-sm font-black text-slate-900 dark:text-white shrink-0">
                            {card.price}
                          </span>
                        </div>

                        <p className="text-[11px] font-bold text-slate-400 truncate mb-2">
                          {card.set}
                        </p>

                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded text-[9px] font-black uppercase">
                            {card.grade || "RAW"}
                          </span>

                          <div
                            className={cn(
                              "flex items-center gap-0.5 text-[10px] font-black",
                              negative ? "text-red-500" : "text-emerald-500"
                            )}
                          >
                            {negative ? (
                              <ArrowDown className="h-3 w-3" />
                            ) : (
                              <ArrowUp className="h-3 w-3" />
                            )}
                            {percent}%
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse table-fixed">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-950/20 text-[10px] uppercase tracking-widest text-slate-400 font-black border-b border-slate-100 dark:border-slate-800">
                      <th className="px-8 py-4 w-[40%]">Card</th>
                      <th className="px-6 py-4">Grade</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Movement</th>
                      <th className="px-6 py-4 text-center">Trend Score</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {paginatedCards.map((card) => {
                      const negative = isNegative(card.h24);
                      const percent = formatPercent(card.h24);

                      return (
                        <tr
                          key={card.id}
                          onClick={() => handleCardClick(card)}
                          className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
                        >
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4 min-w-0">
                              <div className="h-12 w-9 shrink-0 rounded-md bg-slate-100 overflow-hidden border border-slate-200 dark:border-slate-800">
                                <img
                                  src={card.image || PLACEHOLDER_IMAGE}
                                  alt={card.name}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                  onError={(e) => {
                                    e.currentTarget.src = PLACEHOLDER_IMAGE;
                                  }}
                                />
                              </div>

                              <div className="min-w-0">
                                <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#00BA88] transition-colors truncate">
                                  {card.name}
                                </p>
                                <p className="text-[11px] font-bold text-slate-400 truncate mt-0.5">
                                  {card.set}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-[10px] font-black uppercase">
                              {card.grade || "RAW"}
                            </span>
                          </td>

                          <td className="px-6 py-5 font-black text-slate-900 dark:text-white">
                            {card.price}
                          </td>

                          <td className="px-6 py-5">
                            <div
                              className={cn(
                                "flex items-center gap-1 text-[11px] font-black",
                                negative ? "text-red-500" : "text-emerald-500"
                              )}
                            >
                              {negative ? (
                                <ArrowDown className="h-3 w-3" />
                              ) : (
                                <ArrowUp className="h-3 w-3" />
                              )}
                              {percent}%
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex items-center justify-center">
                              <span className="text-xs font-black text-slate-900 dark:text-white">
                                {Number(card.score || 0).toLocaleString()}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-32 text-slate-400"
            >
              <Inbox className="h-12 w-12 mb-4 opacity-20" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                No cards found in {activeTab}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 md:p-6 bg-slate-50/50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Showing {fromCount}-{toCount} of {filteredCards.length}
        </p>

        <div className="flex items-center gap-2">
          <button
            disabled={safeCurrentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-30 transition-all"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex gap-1">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={cn(
                  "h-8 w-8 rounded-lg text-[10px] font-black transition-all",
                  safeCurrentPage === i + 1
                    ? "bg-[#00BA88] text-white shadow-lg shadow-emerald-500/20"
                    : "text-slate-400 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            disabled={safeCurrentPage === totalPages || filteredCards.length === 0}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-30 transition-all"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}