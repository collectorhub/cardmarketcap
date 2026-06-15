"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Layers,
  Bell,
  Info,
  TrendingUp,
  TrendingDown,
  Plus,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AddCardModal from "./AddCardModal";

const NAV_ITEMS = [
  { label: "Portfolio", href: "/portfolio", icon: Layers },
  { label: "Watchlist", href: "/portfolio/watchlist", icon: Bell },
];

function safeNumber(value: any) {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function formatMoney(value: any) {
  return safeNumber(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function escapeCsvValue(value: any) {
  if (value === null || value === undefined) return "";
  const stringValue = String(value).replace(/"/g, '""');
  return `"${stringValue}"`;
}

function downloadCsv(filename: string, rows: any[]) {
  if (!rows.length) {
    alert("No cards available to export yet.");
    return;
  }

  const headers = Array.from(
    rows.reduce((set, row) => {
      Object.keys(row).forEach((key) => set.add(key));
      return set;
    }, new Set<string>())
  );

  const csv = [
    headers.map(escapeCsvValue).join(","),
    ...rows.map((row) =>
      headers.map((header) => escapeCsvValue(row[header])).join(",")
    ),
  ].join("\n");

  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

export default function PortfolioHeader({ data }: { data: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = usePathname();
  const isWatchlist = pathname === "/portfolio/watchlist";

  const userName = data?.user?.name || "Collector";
  const userId = safeNumber(data?.user?.id || data?.userId);

  const headerStats = useMemo(() => {
    if (isWatchlist) {
      const watchlist = data?.watchlist || {};

      return {
        totalValue: safeNumber(watchlist.totalValue),
        growth: safeNumber(watchlist.growth7D ?? watchlist.growth30D),
        totalCards: safeNumber(watchlist.totalCards),
        totalSets: safeNumber(watchlist.setCount),
        cards: Array.isArray(watchlist.cards) ? watchlist.cards : [],
      };
    }

    return {
      totalValue: safeNumber(data?.stats?.totalValue),
      growth: safeNumber(data?.stats?.growth7D ?? data?.performance?.change30DPct),
      totalCards: safeNumber(data?.stats?.totalCards),
      totalSets: safeNumber(data?.stats?.totalSets),
      cards: Array.isArray(data?.cards) ? data.cards : [],
    };
  }, [data, isWatchlist]);

  const growthAmount = headerStats.totalValue * (headerStats.growth / 100);
  const isGrowthPositive = headerStats.growth >= 0;

  const handleExportCsv = () => {
    const cards = headerStats.cards;

    const rows = cards.map((card: any, index: number) => {
      if (isWatchlist) {
        return {
          "#": index + 1,
          Name: card.name || "",
          Set: card.setName || card.set || "",
          Grade: card.grade || "Raw",
          Game: card.game || "",
          "Current Value": safeNumber(card.value),
          "7D Change %": safeNumber(card.change7D),
          "30D Change %": safeNumber(card.change30D),
          "90D Change %": safeNumber(card.change90D),
          "Last Sale Price": safeNumber(card.lastSalePrice),
          "Last Sale Date": card.lastSaleDate || "",
          "Added At": card.createdAt || "",
          URL: card.url || card.canonical_path || "",
        };
      }

      return {
        "#": index + 1,
        Name: card.name || "",
        Set: card.setName || card.set || "",
        Grade: card.grade || "Raw",
        Quantity: safeNumber(card.quantity || 1),
        "Purchase Price": safeNumber(card.purchase_price),
        "Current Unit Value": safeNumber(card.value),
        "Total Line Value": safeNumber(
          card.lineValue || safeNumber(card.value) * safeNumber(card.quantity || 1)
        ),
        "30D Change %": safeNumber(card.change30D),
        "90D Change %": safeNumber(card.change90D),
        "All Time Change %": safeNumber(card.changeAll),
        Game: card.game || "",
        URL: card.url || card.canonical_path || "",
      };
    });

    const date = new Date().toISOString().slice(0, 10);
    downloadCsv(
      isWatchlist
        ? `cardmarketcap-watchlist-${date}.csv`
        : `cardmarketcap-portfolio-${date}.csv`,
      rows
    );
  };

  return (
    <header className="w-full pt-20 md:pt-8 pb-0 px-4 md:px-0">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-8">
        <div className="space-y-2 py-2 text-center lg:text-left w-full lg:w-auto">
          <motion.h1
            key={isWatchlist ? "watchlist" : "portfolio"}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight"
          >
            {isWatchlist ? (
              "Watchlist"
            ) : (
              <>
                Welcome back,{" "}
                <span className="text-[#00BA88]">{userName}! 👋</span>
              </>
            )}
          </motion.h1>

          <p className="text-slate-500 dark:text-slate-400 text-[13px] md:text-[14px] font-medium max-w-md mx-auto lg:mx-0">
            {isWatchlist ? (
              "Track cards you're watching. Get alerts on price changes and market moves."
            ) : (
              <>
                Your collection value changed by{" "}
                <span
                  className={cn(
                    "font-bold",
                    isGrowthPositive ? "text-emerald-500" : "text-red-500"
                  )}
                >
                  {isGrowthPositive ? "+" : "-"}${formatMoney(Math.abs(growthAmount))}
                </span>{" "}
                recently.
              </>
            )}
          </p>
        </div>

        <div className="w-full sm:w-auto bg-white dark:bg-slate-900 px-5 py-4 rounded-[20px] border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-row items-center justify-between sm:justify-start gap-4 sm:gap-10">
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center gap-1">
              <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-[0.05em]">
                {isWatchlist ? "Watchlist Value" : "Total Value"}
              </p>
              <Info size={11} className="text-slate-300 dark:text-slate-600 cursor-help" />
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-[18px] md:text-[22px] font-black text-slate-900 dark:text-white leading-none tracking-tight">
                ${headerStats.totalValue.toLocaleString()}
              </span>

              <div
                className={cn(
                  "flex items-center gap-1 px-1.5 py-0.5 rounded-full border",
                  isGrowthPositive
                    ? "bg-emerald-50/50 dark:bg-emerald-500/10 text-emerald-500 border-emerald-100 dark:border-emerald-500/20"
                    : "bg-red-50/50 dark:bg-red-500/10 text-red-500 border-red-100 dark:border-red-500/20"
                )}
              >
                {isGrowthPositive ? (
                  <TrendingUp size={10} strokeWidth={3} />
                ) : (
                  <TrendingDown size={10} strokeWidth={3} />
                )}
                <span className="text-[10px] font-bold">
                  {isGrowthPositive ? "+" : ""}
                  {headerStats.growth.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          <div className="h-8 w-[1px] bg-slate-100 dark:bg-slate-800" />

          <div className="flex gap-6 sm:gap-8">
            <div className="flex flex-col gap-1">
              <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-[0.05em]">
                Cards
              </p>
              <p className="text-[18px] md:text-[22px] font-black text-slate-900 dark:text-white leading-none">
                {headerStats.totalCards}
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-[0.05em]">
                Sets
              </p>
              <p className="text-[18px] md:text-[22px] font-black text-slate-900 dark:text-white leading-none">
                {headerStats.totalSets}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 dark:border-slate-800">
        <nav className="flex justify-center md:justify-start gap-2 md:gap-6 w-full md:w-auto overflow-x-auto no-scrollbar -mb-[1px]">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "relative pb-4 px-3 md:px-1 text-[14px] font-bold transition-all flex items-center gap-2 group whitespace-nowrap",
                  isActive
                    ? "text-emerald-500"
                    : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                )}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                <span>{item.label}</span>

                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-emerald-500 rounded-t-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 pb-4 w-full md:w-auto">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-[#00BA88] text-white rounded-2xl text-[13px] font-black hover:bg-[#00a377] transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] cursor-pointer"
          >
            <Plus size={16} strokeWidth={3} />
            <span>{isWatchlist ? "Watch Card" : "Add Card"}</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="flex items-center justify-center gap-2 cursor-pointer px-3.5 md:px-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-[0.98]"
          >
            <Download size={18} />
            <span className="hidden md:inline text-[13px] font-bold">
              Export CSV
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <AddCardModal
            userId={userId}
            mode={isWatchlist ? "watchlist" : "portfolio"}
            onClose={() => setIsModalOpen(false)}
            onRefresh={() => window.location.reload()}
          />
        )}
      </AnimatePresence>
    </header>
  );
}