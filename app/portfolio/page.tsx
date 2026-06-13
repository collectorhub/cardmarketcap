"use client";

import React, { useEffect, useState } from "react";
import PortfolioDashboard from "@/components/portfolio/PortfolioDashboard";
import { getPortfolio } from "@/lib/queries/portfolio";
import { getUserActivities } from "@/lib/queries/activities";
import { Loader2 } from "lucide-react";

export default function PortfolioPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPortfolio() {
      const stored = localStorage.getItem("user_data");

      if (!stored) {
        setLoading(false);
        return;
      }

      try {
        const parsed = JSON.parse(stored);
        const userId = Number(parsed.id || parsed.user_id || 0);

        if (!userId) {
          setLoading(false);
          return;
        }

        const [portfolioResponse, activitiesResponse] = await Promise.all([
          getPortfolio(userId),
          getUserActivities(userId, 5),
        ]);

        if (portfolioResponse.success && portfolioResponse.data) {
          const apiData = portfolioResponse.data;
          const backendStats = apiData.stats || {};
          const backendPerformance = apiData.performance || {};

          setData({
            userId,
            user: {
              ...parsed,
              id: userId,
            },

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
              allTimeHigh: Number(backendPerformance.allTimeHigh || 0),
              allTimeLow: Number(backendPerformance.allTimeLow || 0),
            },

            cards: (apiData.cards || []).map((card: any) => ({
              id: card.entryId,
              entryId: card.entryId,
              card_id: card.card_id,
              name: card.name,
              set: card.set || card.setName || "Unknown Set",
              setName: card.setName || card.set || "Unknown Set",
              grade: card.grade || "Raw",
              quantity: Number(card.quantity || 1),
              purchase_price: card.purchase_price,

              value: Number(card.value || 0),
              lineValue: Number(card.lineValue || Number(card.value || 0) * Number(card.quantity || 1)),

              avg30: Number(card.avg30 || 0),
              avg90: Number(card.avg90 || 0),
              oldestPrice: Number(card.oldestPrice || 0),

              change: Number(card.change || 0),
              change30D: Number(card.change30D || 0),
              change90D: Number(card.change90D || 0),
              changeAll: Number(card.changeAll || 0),

              image: card.imageUrl,
              imageUrl: card.imageUrl,
              canonical_path: card.canonical_path || "",
              url: card.canonical_path || "",
              game: card.game || "pokemon",
            })),

            allocation: apiData.allocation || [],

            activities:
              activitiesResponse.success && Array.isArray(activitiesResponse.activities)
                ? activitiesResponse.activities
                : [],
          });
        } else {
          setData({
            userId,
            user: {
              ...parsed,
              id: userId,
            },
            cards: [],
            stats: {},
            allocation: [],
            activities:
              activitiesResponse.success && Array.isArray(activitiesResponse.activities)
                ? activitiesResponse.activities
                : [],
          });
        }
      } catch (e) {
        console.error("Error loading portfolio data:", e);
      } finally {
        setLoading(false);
      }
    }

    loadPortfolio();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-brand" size={40} />
        <p className="text-slate-500 font-medium animate-pulse">
          Loading your collection...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <PortfolioDashboard
        data={data || { cards: [], stats: {}, allocation: [], activities: [] }}
      />
    </div>
  );
}