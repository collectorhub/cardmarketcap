"use client";

import React, { useEffect, useState } from 'react';
import PortfolioDashboard from '@/components/portfolio/PortfolioDashboard';
import { getWatchlist } from "@/lib/queries/portfolio";
import { Loader2 } from 'lucide-react';

export default function PortfolioPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPortfolio() {
      // 1. Get real user ID from local storage
      const stored = localStorage.getItem('user_data');
      if (!stored) {
        setLoading(false);
        return;
      }

      try {
        const parsed = JSON.parse(stored);
        const userId = parsed.id || parsed.user_id;

        // 2. Fetch data only for this specific user
        const response = await getWatchlist(userId);

        if (response.success) {
          const apiData = response.data;
          
         // 3. Map the backend response to your UI structure
          setData({
            stats: {
              totalValue: apiData.totalValue || 0,
              totalCards: apiData.totalCards || 0,
              totalSets: apiData.setCount || 0,
            },
            performance: {
              change7D: apiData.growth7D_Value || 0,
              change7DPct: apiData.growth7D || 0,
            },
            cards: (apiData.cards || []).map((card: any) => ({
              // FIX 1: Change card.card_id to card.id to match your API JSON layout payload
              id: card.id,             
              card_id: card.id,       
              name: card.name,
              // FIX 2: Grab the exact property namespace from the backend payload
              setName: card.set || 'N/A', 
              grade: card.grade || 'Raw',
              value: card.value || 0,
              change: card.change7D || 0,
              image: card.imageUrl,
              imageUrl: card.imageUrl,     
              url: card.url,               
            })),
            allocation: apiData.allocation || [],
            recentActivity: apiData.recentActivity || [] 
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
        <Loader2 className="animate-spin text-[#00BA88]" size={40} />
        <p className="text-slate-500 font-medium animate-pulse">Loading your collection...</p>
      </div>
    );
  }

  // if (!data) {
  //   return (
  //     <div className="p-20 text-center">
  //       <h1 className="text-xl font-bold text-slate-900 dark:text-white">No collection found</h1>
  //       <p className="text-slate-500">Please log in to track your cards.</p>
  //     </div>
  //   );
  // }

  return (
    <div className="w-full">
      <PortfolioDashboard data={data} />
    </div>
  );
}