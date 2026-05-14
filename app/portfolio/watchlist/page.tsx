"use client";

import React, { useEffect, useState } from 'react';
import WatchlistPage from "@/components/portfolio/WatchlistPage";
import { getWatchlist } from "@/lib/queries/portfolio";
import { Loader2, LayoutGrid, Plus } from 'lucide-react';
import Link from 'next/link';

export default function Page() {
  const [watchlistData, setWatchlistData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin text-[#00BA88]" size={40} />
    </div>
  );

  // --- MINIMALISTIC EMPTY / NOT LOGGED IN STATE ---
  // if (!watchlistData) {
  //   return (
  //     <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 animate-in fade-in zoom-in duration-700">
  //       <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[28px] flex items-center justify-center mb-8 shadow-sm">
  //         <LayoutGrid className="w-10 h-10 text-slate-300 dark:text-slate-600" />
  //       </div>
        
  //       <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
  //         No collection found
  //       </h1>
        
  //       <p className="text-slate-500 dark:text-slate-400 text-[13px] md:text-[14px] font-medium max-w-sm mb-10 leading-relaxed">
  //         Please log in to track your cards and monitor market moves in real-time.
  //       </p>

  //       <Link 
  //         href="/login"
  //         className="flex items-center justify-center gap-2 px-8 py-4 bg-[#00BA88] text-white rounded-2xl text-[13px] font-black hover:bg-[#00a377] transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
  //       >
  //         <span>Sign In to Portfolio</span>
  //       </Link>
  //     </div>
  //   );
  // }

  return <WatchlistPage data={watchlistData} />;
}