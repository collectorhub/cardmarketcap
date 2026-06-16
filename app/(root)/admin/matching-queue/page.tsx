"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import MatchingQueueSummary from "@/components/Matching-Queue/MatchingQueueSummary";
import MatchingQueueFilters from "@/components/Matching-Queue/MatchingQueueFilters";
import MatchingRowItem from "@/components/Matching-Queue/MatchingRowItem";
import {
  getAdminMatchingQueue,
  resolveAdminMatch,
} from "@/lib/queries/admin/matching";

export interface ProposedMatchItem {
  id: string;
  source_platform: "ebay" | "price_charting" | "psa";
  scraped_title: string;
  scraped_raw_meta: {
    set_guess?: string;
    grade_guess?: string;
    raw_price?: number;
    scraped_at: string;
  };
  confidence_score: "high" | "medium" | "low";
  proposed_canonical: {
    id: string;
    name: string;
    set_name: string;
    image_url?: string;
  };
}

export default function MatchingQueuePage() {
  const [issues, setIssues] = useState<ProposedMatchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "all" | "ebay" | "price_charting" | "psa"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [summary, setSummary] = useState({
    totalPending: 0,
    unmatchedEbay: 0,
    unmatchedPriceCharting: 0,
    unmatchedPsa: 0,
  });

  async function loadQueue() {
    try {
      setLoading(true);

      const res = await getAdminMatchingQueue();

      if (res?.success) {
        setIssues(Array.isArray(res.matches) ? res.matches : []);
        setSummary({
          totalPending: Number(res.summary?.totalPending || 0),
          unmatchedEbay: Number(res.summary?.unmatchedEbay || 0),
          unmatchedPriceCharting: Number(res.summary?.unmatchedPriceCharting || 0),
          unmatchedPsa: Number(res.summary?.unmatchedPsa || 0),
        });
      }
    } catch (error) {
      console.error("Failed to load matching queue:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQueue();
  }, []);

  const handleMatchResolution = async (
    id: string,
    action: "approve" | "reject"
  ) => {
    try {
      const stored =
        typeof window !== "undefined" ? localStorage.getItem("user_data") : null;
      const parsed = stored ? JSON.parse(stored) : null;
      const userId = Number(parsed?.id || parsed?.user_id || 0);

      const res = await resolveAdminMatch({
        id,
        action,
        user_id: userId,
      });

      if (res?.success) {
        setIssues((prev) => prev.filter((item) => item.id !== id));

        setSummary((prev) => {
          const removed = issues.find((item) => item.id === id);

          return {
            totalPending: Math.max(0, prev.totalPending - 1),
            unmatchedEbay:
              removed?.source_platform === "ebay"
                ? Math.max(0, prev.unmatchedEbay - 1)
                : prev.unmatchedEbay,
            unmatchedPriceCharting:
              removed?.source_platform === "price_charting"
                ? Math.max(0, prev.unmatchedPriceCharting - 1)
                : prev.unmatchedPriceCharting,
            unmatchedPsa:
              removed?.source_platform === "psa"
                ? Math.max(0, prev.unmatchedPsa - 1)
                : prev.unmatchedPsa,
          };
        });
      } else {
        alert(res?.message || "Failed to save match decision.");
      }
    } catch (error) {
      console.error("Failed to resolve match:", error);
      alert("Failed to save match decision.");
    }
  };

  const filteredItems = issues.filter((item) => {
    const q = searchQuery.toLowerCase();

    const matchesTab =
      activeTab === "all" || item.source_platform === activeTab;

    const matchesSearch =
      item.scraped_title.toLowerCase().includes(q) ||
      item.proposed_canonical.name.toLowerCase().includes(q) ||
      item.proposed_canonical.set_name.toLowerCase().includes(q) ||
      item.proposed_canonical.id.toLowerCase().includes(q);

    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6 font-inter pt-15 md:pt-0 max-w-[1600px] mx-auto text-slate-900 dark:text-slate-100 py-6">
      <AdminPageHeader
        title="Matching Review Queue Terminal"
        description="Audit raw marketplace records, resolve source mapping conflicts, and map pipeline assets to master cards safely."
      />

      <MatchingQueueSummary
        totalPending={summary.totalPending}
        unmatchedEbay={summary.unmatchedEbay}
        unmatchedPriceCharting={summary.unmatchedPriceCharting}
        unmatchedPsa={summary.unmatchedPsa}
      />

      <MatchingQueueFilters
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div className="space-y-4">
        {!loading && filteredItems.length > 0 && (
          <div className="flex items-center gap-4 px-1 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 select-none font-inter">
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 px-2.5 py-1 rounded-md border border-slate-200/40 dark:border-slate-800/60">
              <span>Awaiting Verification:</span>
              <span className="text-slate-900 dark:text-white font-black">
                {filteredItems.length.toLocaleString()} Entries
              </span>
            </div>
          </div>
        )}

        <div className="space-y-3 min-h-[200px]">
          {loading ? (
            <div className="py-16 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 text-sm font-bold">
              Loading live matching queue...
            </div>
          ) : (
            <AnimatePresence mode="popLayout" initial={false}>
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout="position"
                    initial={{ opacity: 0, y: 12, scale: 0.99 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: {
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                        delay: Math.min(index * 0.03, 0.15),
                      },
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.97,
                      y: -8,
                      transition: { duration: 0.15 },
                    }}
                    className="w-full origin-center"
                  >
                    <MatchingRowItem
                      item={item}
                      onAction={handleMatchResolution}
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  className="py-24 text-center border border-dashed border-slate-200 dark:border-slate-800/80 rounded-2xl bg-white dark:bg-slate-900/40 shadow-xs flex flex-col items-center justify-center space-y-4 max-w-full"
                >
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/50 text-slate-300 dark:text-slate-700 rounded-full border border-slate-100 dark:border-slate-800/60 relative">
                    <svg
                      className="h-8 w-8 animate-spin-slow"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#00BA88]/20 animate-spin-reverse" />
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs md:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white font-inter">
                      Pipeline Link Matrix Safe
                    </p>
                    <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 font-inter max-w-xs mx-auto leading-normal">
                      No outstanding third-party platform string anomalies
                      require manual canonical resolution hooks.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}