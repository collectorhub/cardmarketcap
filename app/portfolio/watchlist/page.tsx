"use client";

import React, { useEffect, useState } from 'react';
import WatchlistPage from "@/components/portfolio/WatchlistPage";
import { getWatchlist } from "@/lib/queries/portfolio";
import { Loader2 } from 'lucide-react';

export default function Page() {
  const [watchlistData, setWatchlistData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      // 1. Get the actual user ID from localStorage
      const stored = localStorage.getItem('user_data');
      if (!stored) {
        setLoading(false);
        return;
      }

      try {
        const parsed = JSON.parse(stored);
        const userId = parsed.id || parsed.user_id; // Use real ID

        // 2. Fetch data ONLY for this user
        const response = await getWatchlist(userId);

        if (response.success) {
          setWatchlistData({
            watchlist: {
              ...response.data,
              growth7D: response.data.growth7D || 0,
              activeAlerts: 0,
              avgDailyChange: 0,
              meta: {
                createdAt: "May 2026",
                initialValue: response.data.totalValue,
                totalIncrease: 0,
                totalIncreasePercent: 0
              }
            }
          });
        }
      } catch (e) {
        console.error("Failed to load user watchlist", e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // if (loading) return (
  //   <div className="flex items-center justify-center min-h-screen">
  //     <Loader2 className="animate-spin text-[#00BA88]" size={40} />
  //   </div>
  // );

  if (!watchlistData) {
    return (
      <div className="p-20 text-center">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">No collection found</h1>
        <p className="text-slate-500">Please log in to track your cards.</p>
      </div>
    );
  }

  // if (!watchlistData) return <div className="p-20 text-center">Please log in to view your watchlist.</div>;

  return <WatchlistPage data={watchlistData} />;
}