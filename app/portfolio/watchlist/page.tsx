"use client";

import React, { useEffect, useState } from 'react';
import WatchlistPage from "@/components/portfolio/WatchlistPage";
// 1. POINT TO THE NEW QUERY FILE
import { getWatchlist } from "@/lib/queries/watchlist"; 
import { Loader2, LayoutGrid } from 'lucide-react';
import Link from 'next/link';

export default function Page() {
  const [watchlistData, setWatchlistData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Inside watchlist/page.tsx
useEffect(() => {
  async function loadData() {
    const stored = localStorage.getItem('user_data');
    if (!stored) {
      setLoading(false);
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      const userId = parsed.id || parsed.user_id;
      
      const response = await getWatchlist(userId);

      if (response && response.success) {
          setWatchlistData({
              watchlist: {
                  // Note: Use response.data because your getWatchlist query 
                  // wraps the PHP result in a 'data' key.
                  cards: response.data.cards || [],
                  allocation: response.data.allocation || [],
                  totalCards: response.data.totalCards || 0,
                  stats: {
                      totalValue: response.data.totalValue || 0,
                      growth7D: response.data.growth7D || 0,
                      totalCards: response.data.totalCards || 0,
                      totalSets: response.data.setCount || 0,
                  },
                  meta: {
                      createdAt: "May 2026",
                      initialValue: response.data.totalValue || 0,
                      totalIncrease: 0,
                      totalIncreasePercent: 0
                  }
              }
          });
      } else {
        // If fetch failed but we reached the server, set an empty watchlist 
        // to stop the infinite spin and show the "Empty" state instead
        setWatchlistData({ watchlist: { cards: [] } });
      }
    } catch (e) {
      console.error("Failed to load user watchlist:", e);
      setWatchlistData({ watchlist: { cards: [] } });
    } finally {
      setLoading(false);
    }
  }
  loadData();
}, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin text-[#00BA88]" size={40} />
    </div>
  );

  // --- OPTIONAL: UNCOMMENT FOR AUTH GUARD ---
  // if (!watchlistData) {
  //   return (
  //     <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
  //       <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[28px] flex items-center justify-center mb-8">
  //         <LayoutGrid className="w-10 h-10 text-slate-300 dark:text-slate-600" />
  //       </div>
  //       <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-3">
  //         No Watchlist Found
  //       </h1>
  //       <p className="text-slate-500 text-[13px] mb-10">
  //         Sign in to track cards you're interested in buying.
  //       </p>
  //       <Link href="/login" className="px-8 py-4 bg-[#00BA88] text-white rounded-2xl text-[13px] font-black">
  //         Sign In
  //       </Link>
  //     </div>
  //   );
  // }

  // Passes the data directly to your UI layout
  return <WatchlistPage data={watchlistData} />;
}