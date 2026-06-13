"use client";

import React, { useEffect, useMemo, useState } from "react";
import WatchlistTable from "./WatchlistTable";
import { WatchlistHero } from "./WatchlistHero";
import AllocationCard from "../AllocationCard";
import GrowthSummaryCard from "./GrowthSummaryCard";
import { WatchlistStats } from "./WatchlistStats";
import { Plus, Layers } from "lucide-react";
import AddCardModal from "./AddCardModal";

export default function WatchlistPage({ data }: { data: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeUserId, setActiveUserId] = useState<number | null>(null);

  useEffect(() => {
    if (data?.userId) {
      setActiveUserId(Number(data.userId));
      return;
    }

    if (data?.user?.id) {
      setActiveUserId(Number(data.user.id));
      return;
    }

    const stored = localStorage.getItem("user_data");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setActiveUserId(Number(parsed.id || parsed.user_id || 0));
      } catch {
        setActiveUserId(null);
      }
    }
  }, [data]);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00BA88]" />
      </div>
    );
  }

  const { watchlist = {} } = data;

  const cards = Array.isArray(watchlist.cards) ? watchlist.cards : [];
  const allocation = Array.isArray(watchlist.allocation) ? watchlist.allocation : [];
  const totalCards = Number(watchlist.totalCards || cards.length || 0);
  const meta = watchlist.meta || {};

  const safeAllocation = useMemo(() => {
    if (allocation.length > 0) return allocation;

    const groups: Record<string, number> = {};
    cards.forEach((card: any) => {
      const grade = card.grade || "Raw";
      groups[grade] = (groups[grade] || 0) + 1;
    });

    const colors = ["#7c3aed", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

    return Object.entries(groups).map(([name, count], index) => ({
      name,
      value: cards.length > 0 ? Number(((count / cards.length) * 100).toFixed(1)) : 0,
      color: colors[index % colors.length],
    }));
  }, [allocation, cards]);

  const isEmpty = cards.length === 0;

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
            mode="watchlist"
            userId={activeUserId || 0}
            onClose={() => setIsModalOpen(false)}
            onRefresh={() => window.location.reload()}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      <section className="grid grid-cols-1 lg:grid-cols-14 gap-6 items-stretch">
        <div className="lg:col-span-6">
          <WatchlistHero data={watchlist} />
        </div>

        <div className="lg:col-span-5">
          <AllocationCard
            title="Cards by Grade"
            data={safeAllocation}
            centerValue={totalCards}
            centerLabel="Watching"
            onFooterClick={() => {}}
          />
        </div>

        <div className="lg:col-span-3">
          <GrowthSummaryCard meta={meta} />
        </div>
      </section>

      <WatchlistStats data={watchlist} />

      <section className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
        <WatchlistTable
          cards={cards}
          totalRecords={totalCards}
          totalPages={1}
          currentPage={1}
        />
      </section>

      {isModalOpen && (
        <AddCardModal
          mode="watchlist"
          userId={activeUserId || 0}
          onClose={() => setIsModalOpen(false)}
          onRefresh={() => window.location.reload()}
        />
      )}
    </div>
  );
}