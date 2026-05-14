"use client";

import React, { useState } from 'react';
import WatchlistTable from './WatchlistTable';
import { WatchlistHero } from './WatchlistHero';
import AllocationCard from '../AllocationCard';
import GrowthSummaryCard from './GrowthSummaryCard';
import { WatchlistStats } from './WatchlistStats';
import { Plus, LayoutGrid } from 'lucide-react'; // Added icons
import AddCardModal from './AddCardModal'; // Import your modal

export default function WatchlistPage({ data }: { data: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { watchlist = {} } = data;
  const { 
    cards = [], 
    allocation = [], 
    totalCards = 0, 
    meta = {} 
  } = watchlist;

  const isEmpty = cards.length === 0;

  // --- EMPTY STATE VIEW ---
  if (isEmpty) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-6">
          <LayoutGrid className="w-10 h-10 text-slate-400 dark:text-slate-500" />
        </div>
        
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
          Your watchlist is empty
        </h2>
        
        <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8 font-medium">
          Start tracking price changes and market moves for your favorite cards. Add your first card to begin.
        </p>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-8 py-4 bg-[#00BA88] text-white rounded-2xl font-black hover:bg-[#00a377] transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
        >
          <Plus size={20} strokeWidth={3} />
          <span>Add Your First Card</span>
        </button>

        {isModalOpen && (
          <AddCardModal 
            userId={data?.user?.id} 
            onClose={() => setIsModalOpen(false)} 
            onRefresh={() => window.location.reload()}
          />
        )}
      </div>
    );
  }

  // --- REGULAR DASHBOARD VIEW ---
  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      <section className="grid grid-cols-1 lg:grid-cols-14 gap-6 items-stretch">
        <div className="lg:col-span-6">
          <WatchlistHero data={watchlist} />
        </div>
        <div className="lg:col-span-5">
          <AllocationCard 
            title="Cards by Grade"
            data={allocation} 
            centerValue={totalCards}
            centerLabel="Total Cards"
            footerLabel="VIEW ALL GRADES"
          />
        </div>
        <div className="lg:col-span-3">
          <GrowthSummaryCard meta={meta} />
        </div>
      </section>

      <WatchlistStats data={watchlist} />

      <section className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
        <WatchlistTable cards={cards} />
      </section>
    </div>
  );
}