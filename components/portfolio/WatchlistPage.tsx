"use client";

import React, { useState, useEffect } from 'react';
import WatchlistTable from './WatchlistTable';
import { WatchlistHero } from './WatchlistHero';
import AllocationCard from '../AllocationCard';
import GrowthSummaryCard from './GrowthSummaryCard';
import { WatchlistStats } from './WatchlistStats';
import { Plus, Layers } from 'lucide-react';
import AddCardModal from './AddCardModal';

export default function WatchlistPage({ data }: { data: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeUserId, setActiveUserId] = useState<number | null>(null);

  // --- SAFE USER ID RETRIEVAL ---
  useEffect(() => {
    // If the data prop has the user, use it. 
    // Otherwise, pull directly from the source of truth (localStorage)
    if (data?.user?.id) {
      setActiveUserId(data.user.id);
    } else {
      const stored = localStorage.getItem('user_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        setActiveUserId(parsed.id);
      }
    }
  }, [data]);

  // --- ADD THIS NULL GUARD HERE ---
  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
         {/* This matches your existing loader style */}
         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00BA88]"></div>
      </div>
    );
  }

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
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4 animate-in fade-in zoom-in duration-700">
        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[28px] flex items-center justify-center mb-8 shadow-sm">
          <Layers className="w-10 h-10 text-slate-300 dark:text-slate-600" />
        </div>
        
        <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
          Your watchlist is empty
        </h2>
        
        <p className="text-slate-500 dark:text-slate-400 text-[13px] md:text-[14px] font-medium max-w-sm mb-10 leading-relaxed">
          Start tracking price changes and market moves for your favorite cards. Add your first card to begin.
        </p>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-[#00BA88] text-white rounded-2xl text-[13px] font-black hover:bg-[#00a377] transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] cursor-pointer"
        >
          <Plus size={18} strokeWidth={3} />
          <span>Add Your First Card</span>
        </button>

        {isModalOpen && (
          <AddCardModal 
            mode="watchlist" // MUST include this
            userId={activeUserId} // Using our safe state ID
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
            centerLabel="Watching"
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

      {/* Adding modal here too for triggers from the Header */}
      {isModalOpen && (
          <AddCardModal 
            mode="watchlist"
            userId={activeUserId} 
            onClose={() => setIsModalOpen(false)} 
            onRefresh={() => window.location.reload()}
          />
        )}
    </div>
  );
}