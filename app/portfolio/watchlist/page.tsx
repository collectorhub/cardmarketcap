"use client";

import React, { useEffect, useState } from "react";
import WatchlistPage from "@/components/portfolio/WatchlistPage";
import { getWatchlist } from "@/lib/queries/watchlist";
import { Loader2 } from "lucide-react";

export default function Page() {
  const [watchlistData, setWatchlistData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
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

        const response = await getWatchlist(userId);

        if (response?.success && response.data) {
          const data = response.data;

          setWatchlistData({
            userId,

            user: {
              ...parsed,
              id: userId,
            },

            watchlist: {
              totalValue: Number(data.totalValue || 0),
              totalCards: Number(data.totalCards || 0),
              setCount: Number(data.setCount || 0),

              growth7D: Number(data.growth7D || 0),
              growth30D: Number(data.growth30D || 0),
              growth90D: Number(data.growth90D || 0),
              growthAll: Number(data.growthAll || 0),

              change7DValue: Number(data.change7DValue || 0),
              change30DValue: Number(data.change30DValue || 0),
              change90DValue: Number(data.change90DValue || 0),
              changeAllValue: Number(data.changeAllValue || 0),

              activeAlerts: Number(data.activeAlerts || 0),
              avgDailyChange: Number(data.avgDailyChange || 0),

              cards: Array.isArray(data.cards)
                ? data.cards.map((card: any) => ({
                    watchlist_id: card.watchlist_id,
                    card_id: card.card_id,

                    name: card.name,
                    set: card.set,
                    setName: card.setName,

                    grade: card.grade,
                    game: card.game,

                    value: Number(card.value || 0),

                    avg7: Number(card.avg7 || 0),
                    avg30: Number(card.avg30 || 0),
                    avg90: Number(card.avg90 || 0),

                    change7D: Number(card.change7D || 0),
                    change30D: Number(card.change30D || 0),
                    change90D: Number(card.change90D || 0),
                    changeAll: Number(card.changeAll || 0),

                    change7DValue: Number(card.change7DValue || 0),
                    change30DValue: Number(card.change30DValue || 0),
                    change90DValue: Number(card.change90DValue || 0),
                    changeAllValue: Number(card.changeAllValue || 0),

                    lastSalePrice: Number(card.lastSalePrice || 0),
                    lastSaleDate: card.lastSaleDate,

                    imageUrl: card.imageUrl,
                    canonical_path: card.canonical_path,
                    url: card.url,

                    createdAt: card.createdAt,
                  }))
                : [],

              allocation: Array.isArray(data.allocation)
                ? data.allocation
                : [],

              meta: {
                createdAt: data.meta?.createdAt || null,
                initialValue: Number(data.meta?.initialValue || 0),
                totalIncrease: Number(data.meta?.totalIncrease || 0),
                totalIncreasePercent: Number(
                  data.meta?.totalIncreasePercent || 0
                ),
              },
            },
          });
        } else {
          setWatchlistData({
            watchlist: {
              cards: [],
            },
          });
        }
      } catch (error) {
        console.error("Failed to load user watchlist:", error);

        setWatchlistData({
          watchlist: {
            cards: [],
          },
        });
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2
          className="animate-spin text-[#00BA88]"
          size={40}
        />
      </div>
    );
  }

  return <WatchlistPage data={watchlistData} />;
}