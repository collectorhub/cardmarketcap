"use client";

import React, { useEffect, useState } from 'react';
import PortfolioDashboard from '@/components/portfolio/PortfolioDashboard';
import { getPortfolio } from "@/lib/queries/portfolio"; // ✅ Updated function name
import { Loader2 } from 'lucide-react';

export default function PortfolioPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPortfolio() {
      const stored = localStorage.getItem('user_data');
      if (!stored) {
        setLoading(false);
        return;
      }

      try {
        const parsed = JSON.parse(stored);
        const userId = parsed.id || parsed.user_id;

        // Fetch using the renamed, fixed function
        const response = await getPortfolio(userId);

        if (response.success && response.data) {
          const apiData = response.data;
          const backendStats = apiData.stats || {};
          const backendPerformance = apiData.performance || {};
          
          // ✅ Mapping precisely to your PHP JSON payload structure
          setData({
            stats: {
              totalValue: backendStats.totalValue || 0,
              totalCards: backendStats.totalCards || 0,
              totalSets: backendStats.totalSets || 0,
            },
            performance: {
              change7D: backendPerformance.change7D || 0,
              change7DPct: backendPerformance.change7DPct || 0,
            },
            cards: (apiData.cards || []).map((card: any) => ({
              id: card.entryId,        // ✅ Maps cleanly to PHP selector "up.id as entryId"
              card_id: card.card_id,   // ✅ Maps cleanly to PHP selector "up.card_id"
              name: card.name,
              setName: card.set || 'Unknown Set', 
              grade: card.grade || 'Raw',
              value: card.value || 0,
              change: card.change7D || 0,
              image: card.imageUrl,
              imageUrl: card.imageUrl,     
              url: card.canonical_path || '', // ✅ Maps cleanly to your PHP selector
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
        <Loader2 className="animate-spin text-brand" size={40} />
        <p className="text-slate-500 font-medium animate-pulse">Loading your collection...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <PortfolioDashboard data={data || { cards: [], stats: {}, allocation: [] }} />
    </div>
  );
}