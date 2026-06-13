"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import PortfolioHeader from "@/components/portfolio/PortfolioHeader";
import Sidebar from "@/components/Sidebar";
import { getPortfolio } from "@/lib/queries/portfolio";
import { getWatchlist } from "@/lib/queries/watchlist";

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isWatchlist = pathname === "/portfolio/watchlist";

  const [dashboardData, setDashboardData] = useState<any>({
    user: {
      name: "Collector",
      id: 0,
    },
    stats: {
      totalValue: 0,
      totalCards: 0,
      totalSets: 0,
    },
    performance: {
      change30D: 0,
      change30DPct: 0,
    },
    cards: [],
    watchlist: {
      totalValue: 0,
      totalCards: 0,
      setCount: 0,
      growth30D: 0,
      change30DValue: 0,
      cards: [],
    },
  });

  useEffect(() => {
    async function loadHeaderData() {
      const stored = localStorage.getItem("user_data");

      if (!stored) return;

      try {
        const parsed = JSON.parse(stored);
        const userId = Number(parsed.id || parsed.user_id || 0);

        if (!userId) return;

        const user = {
          ...parsed,
          id: userId,
          name: parsed.username || parsed.name || parsed.email || "Collector",
        };

        if (isWatchlist) {
          const response = await getWatchlist(userId);

          if (response.success && response.data) {
            const data = response.data;

            setDashboardData({
              user,
              userId,
              watchlist: {
                totalValue: Number(data.totalValue || 0),
                totalCards: Number(data.totalCards || 0),
                setCount: Number(data.setCount || 0),

                growth30D: Number(data.growth30D || 0),
                growth90D: Number(data.growth90D || 0),
                growthAll: Number(data.growthAll || 0),

                change30DValue: Number(data.change30DValue || 0),
                change90DValue: Number(data.change90DValue || 0),
                changeAllValue: Number(data.changeAllValue || 0),

                cards: Array.isArray(data.cards) ? data.cards : [],
              },
            });
          }

          return;
        }

        const response = await getPortfolio(userId);

        if (response.success && response.data) {
          const apiData = response.data;
          const backendStats = apiData.stats || {};
          const backendPerformance = apiData.performance || {};

          setDashboardData({
            user,
            userId,

            stats: {
              totalValue: Number(backendStats.totalValue || 0),
              totalCards: Number(backendStats.totalCards || 0),
              totalSets: Number(backendStats.totalSets || 0),
            },

            performance: {
              change30D: Number(backendPerformance.change30D || 0),
              change30DPct: Number(backendPerformance.change30DPct || 0),
              change90D: Number(backendPerformance.change90D || 0),
              change90DPct: Number(backendPerformance.change90DPct || 0),
              changeAll: Number(backendPerformance.changeAll || 0),
              changeAllPct: Number(backendPerformance.changeAllPct || 0),
            },

            cards: Array.isArray(apiData.cards)
              ? apiData.cards.map((card: any) => ({
                  id: card.entryId,
                  entryId: card.entryId,
                  card_id: card.card_id,
                  name: card.name,
                  set: card.set || card.setName || "Unknown Set",
                  setName: card.setName || card.set || "Unknown Set",
                  grade: card.grade || "Raw",
                  quantity: Number(card.quantity || 1),
                  value: Number(card.value || 0),
                  lineValue: Number(
                    card.lineValue ||
                      Number(card.value || 0) * Number(card.quantity || 1)
                  ),
                  change30D: Number(card.change30D || 0),
                  change90D: Number(card.change90D || 0),
                  changeAll: Number(card.changeAll || 0),
                  imageUrl: card.imageUrl,
                  canonical_path: card.canonical_path || "",
                  game: card.game || "pokemon",
                }))
              : [],
          });
        }
      } catch (error) {
        console.error("Failed to load portfolio header data:", error);
      }
    }

    loadHeaderData();
  }, [isWatchlist, pathname]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300">
      <Navbar />

      <div className="lg:hidden">
        <Sidebar />
      </div>

      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-10">
        <PortfolioHeader data={dashboardData} />

        <main className="py-4">{children}</main>
      </div>
    </div>
  );
}