"use client";

import React from 'react';
import WatchlistTable from './WatchlistTable';
import { WatchlistHero } from './WatchlistHero';
import AllocationCard from '../AllocationCard';
import { GrowthSummaryCard } from './GrowthSummaryCard'; // Import your new component
import { WatchlistStats } from './WatchlistStats';

export default function WatchlistPage({ data }: { data: any }) {
  const { watchlist } = data;
  const { meta } = watchlist;

  return (
    <div className="space-y-6 pb-20">
      {/* Performance & Distribution Section */}
      {/* Using a standard 12-column grid for perfect alignment */}
      <section className="grid grid-cols-1 lg:grid-cols-14 gap-6 items-stretch">
        
        {/* 1. Main Chart (Largest) - 6/12 columns (50% width) */}
        <div className="lg:col-span-6">
          <WatchlistHero data={watchlist} />
        </div>

        {/* 2. Donut Chart (Medium) - 3/12 columns (25% width) */}
        <div className="lg:col-span-5">
          <AllocationCard 
            title="Cards by Grade"
            data={watchlist.allocation}
            centerValue={watchlist.totalCards}
            centerLabel="Total Cards"
            footerLabel="MANAGE DISTRIBUTION"
          />
        </div>

        {/* 3. Growth Summary (Smallest) - 3/12 columns (25% width) */}
        <div className="lg:col-span-3">
          <GrowthSummaryCard meta={meta} />
        </div>
      </section>

      {/* Stats Quick Grid (Value, Total Cards, Alerts, Avg Change) */}
      <WatchlistStats data={watchlist} />

      {/* Main Data Table */}
      <section className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
        <WatchlistTable cards={watchlist.cards} />
      </section>
    </div>
  );
}