"use client";

import React from 'react';
import WatchlistTable from './WatchlistTable';
import { WatchlistHero } from './WatchlistHero';
import AllocationCard from '../AllocationCard';
import GrowthSummaryCard from './GrowthSummaryCard';
import { WatchlistStats } from './WatchlistStats';

export default function WatchlistPage({ data }: { data: any }) {
  // Destructure with fallbacks to prevent "undefined" errors if DB is empty
  const { watchlist = {} } = data;
  const { 
    cards = [], 
    allocation = [], 
    totalCards = 0, 
    totalValue = 0,
    meta = {} 
  } = watchlist;

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      
      {/* 1. Performance & Distribution Section */}
      <section className="grid grid-cols-1 lg:grid-cols-14 gap-6 items-stretch">
        
        {/* Main Chart (Visualizing Total Value) */}
        <div className="lg:col-span-6">
          <WatchlistHero data={watchlist} />
        </div>

        {/* Donut Chart (Grade Distribution from PHP) */}
        <div className="lg:col-span-5">
          <AllocationCard 
            title="Cards by Grade"
            // The PHP generates this based on real portfolio counts
            data={allocation} 
            centerValue={totalCards}
            centerLabel="Total Cards"
            footerLabel="VIEW ALL GRADES"
          />
        </div>

        {/* Growth Summary (Meta Data) */}
        <div className="lg:col-span-3">
          <GrowthSummaryCard meta={meta} />
        </div>
      </section>

      {/* 2. Stats Quick Grid (Live counts for Value, Sets, and Cards) */}
      <WatchlistStats data={watchlist} />

      {/* 3. Main Data Table (The actual card list from cmc_assets join) */}
      <section className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
        <WatchlistTable cards={cards} />
      </section>
    </div>
  );
}