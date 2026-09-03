"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useSearchParams } from "next/navigation";
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

const MOBILE_NAV_ITEMS = [
  { label: "Overview", href: "/portfolio", section: "overview" },
  { label: "Holdings", href: "/portfolio?section=holdings", section: "holdings" },
  { label: "Allocation", href: "/portfolio?section=allocation", section: "allocation" },
  { label: "Activity", href: "/portfolio?section=activity", section: "activity" },
  { label: "Watchlist", href: "/portfolio/watchlist", section: "watchlist" },
] as const;

const MOBILE_PAGE_TITLES = {
  overview: "Portfolio",
  holdings: "Holdings",
  allocation: "Allocation",
  activity: "Activity",
  watchlist: "Watchlist",
} as const;

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
  const searchParams = useSearchParams();
  const isWatchlist = pathname === "/portfolio/watchlist";
  const requestedSection = searchParams.get("section");
  const mobileSection = isWatchlist
    ? "watchlist"
    : requestedSection === "holdings" ||
        requestedSection === "allocation" ||
        requestedSection === "activity"
      ? requestedSection
      : "overview";

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
    <header className="w-full px-0 pb-0 pt-[68px] md:pt-8">
      <h1 className="pb-3 text-[18px] font-bold leading-tight tracking-tight text-slate-900 dark:text-white md:hidden">
        {MOBILE_PAGE_TITLES[mobileSection]}
      </h1>

      <div className="hidden mb-5 flex-col items-center justify-between gap-4 md:mb-8 md:flex md:gap-8 lg:flex-row">
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

        <div className="hidden w-full flex-row items-center justify-between gap-4 border-y border-slate-100 bg-white px-4 py-4 shadow-none dark:border-slate-800 dark:bg-slate-900 md:flex md:w-auto md:justify-start md:gap-10 md:rounded-[20px] md:border-x md:px-5 md:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
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

      <div className="flex flex-col justify-between border-b border-slate-100 dark:border-slate-800 md:flex-row md:items-end md:gap-6">
        <nav className="hidden justify-center gap-2 md:flex md:w-auto md:justify-start md:gap-6 overflow-x-auto no-scrollbar -mb-[1px]">
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

        <nav className="-mb-px flex w-full justify-between overflow-x-auto no-scrollbar md:hidden">
          {MOBILE_NAV_ITEMS.map((item) => {
            const isActive = mobileSection === item.section;

            return (
              <Link
                key={item.section}
                href={item.href}
                className={cn(
                  "relative shrink-0 px-1.5 pb-3 pt-1 text-[10px] font-semibold transition-colors first:pl-0 last:pr-0",
                  isActive ? "text-[#00BA88]" : "text-slate-400 dark:text-slate-500"
                )}
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="mobilePortfolioTab"
                    className="absolute inset-x-0 bottom-0 h-0.5 rounded-t-full bg-[#00BA88]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden w-full items-center gap-2 pb-4 md:flex md:w-auto">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#00BA88] px-5 py-3 text-[12px] font-black text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-[#00a377] active:scale-[0.98] md:flex-none md:rounded-2xl md:px-6 md:py-3.5 md:text-[13px]"
          >
            <Plus size={16} strokeWidth={3} />
            <span>{isWatchlist ? "Watch Card" : "Add Card"}</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-slate-600 transition-all hover:bg-slate-50 active:scale-[0.98] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 md:rounded-2xl md:px-4 md:py-3.5"
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
