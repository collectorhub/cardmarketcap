"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Users, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { CollectorActivity } from "@/app/(root)/admin/page";

interface UserActivityOversightProps {
  activities: CollectorActivity[];
  totalWatchlists?: number;
}

const PAGE_SIZE = 4;

export default function UserActivityOversight({
  activities = [],
  totalWatchlists = 0,
}: UserActivityOversightProps) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(activities.length / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paginatedActivities = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return activities.slice(start, start + PAGE_SIZE);
  }, [activities, page]);

  const hasPagination = activities.length > PAGE_SIZE;

  return (
    <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col h-auto">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4 border-b border-slate-50 dark:border-slate-800/80 pb-4 mb-4 shrink-0">
        <div className="space-y-1 min-w-0">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 tracking-tight font-heading whitespace-nowrap">
            <Users className="h-4 w-4 text-[#00BA88] shrink-0" />
            <span className="truncate">Collector Activity Stream</span>
          </h2>

          <p className="text-slate-400 dark:text-slate-500 text-[13px] font-medium font-sans leading-relaxed">
            Realtime user interaction and catalog reports.
          </p>
        </div>

        <span className="shrink-0 whitespace-nowrap text-[10px] font-black text-[#00BA88] bg-[#00BA88]/10 px-3 py-2 rounded-lg tracking-wide uppercase font-sans leading-none">
          Live Feed
        </span>
      </div>

      {/* ACTIVITIES */}
      <div className="space-y-3 flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
            className="space-y-3"
          >
            {paginatedActivities.length > 0 ? (
              paginatedActivities.map((log, index) => {
                const isFlagged = log.type === "flagged";
                const isWatchlist = log.type === "watchlist";

                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.03,
                      type: "spring",
                      stiffness: 260,
                      damping: 22,
                    }}
                    className={cn(
                      "p-3.5 rounded-2xl border flex flex-col gap-2 transition-all font-sans group hover:-translate-y-0.5",
                      isFlagged
                        ? "border-red-100 dark:border-red-950/40 bg-red-500/[0.01] dark:bg-red-500/[0.02]"
                        : "border-slate-100/80 dark:border-slate-800/60 bg-white dark:bg-slate-950/20 hover:bg-slate-50/40 dark:hover:bg-slate-950/60 hover:border-slate-200 dark:hover:border-slate-700"
                    )}
                  >
                    <div className="flex justify-between items-center gap-3 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={cn(
                            "font-extrabold tracking-tight truncate",
                            isFlagged
                              ? "text-red-900 dark:text-red-400"
                              : "text-slate-800 dark:text-slate-200"
                          )}
                        >
                          {log.user}
                        </span>

                        <span
                          className={cn(
                            "text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-sm shrink-0",
                            isFlagged && "bg-red-500/10 text-red-500",
                            isWatchlist && "bg-blue-500/10 text-blue-500",
                            log.type === "portfolio" &&
                              "bg-emerald-500/10 text-emerald-500"
                          )}
                        >
                          {log.type}
                        </span>
                      </div>

                      <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 shrink-0 font-mono">
                        {log.time}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-3">
                      <p
                        className={cn(
                          "text-[12px] font-bold leading-snug tracking-tight group-hover:text-[#00BA88] transition-colors line-clamp-2",
                          isFlagged
                            ? "text-slate-700 dark:text-slate-300"
                            : "text-slate-600 dark:text-slate-400"
                        )}
                      >
                        {log.detail}
                      </p>

                      {log.meta && (
                        <span
                          className={cn(
                            "text-[10px] font-bold font-mono px-2 py-0.5 rounded-md border shrink-0 max-w-[95px] truncate",
                            isFlagged
                              ? "bg-red-50 dark:bg-red-950/30 text-red-500 border-red-100/60 dark:border-red-900/40"
                              : "bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-100 dark:border-slate-800"
                          )}
                        >
                          {log.meta}
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="py-10 flex items-center justify-center text-center">
                <p className="text-[13px] font-bold text-slate-400">
                  No collector activity yet.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* PAGINATION */}
      {hasPagination && (
        <div className="pt-4 mt-4 border-t border-slate-50 dark:border-slate-800/60 flex items-center justify-between shrink-0">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">
            Page {page} of {totalPages}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="h-8 w-8 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-[#00BA88] hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:text-slate-400 transition-all cursor-pointer"
            >
              <ChevronLeft size={15} strokeWidth={3} />
            </button>

            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNumber = index + 1;

              return (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  className={cn(
                    "h-8 w-8 rounded-lg text-[11px] font-black transition-all cursor-pointer",
                    page === pageNumber
                      ? "bg-[#00BA88] text-white shadow-md shadow-emerald-500/20"
                      : "text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  {pageNumber}
                </button>
              );p
            })}

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="h-8 w-8 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-[#00BA88] hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:text-slate-400 transition-all cursor-pointer"
            >
              <ChevronRight size={15} strokeWidth={3} />
            </button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div className="pt-4 mt-4 border-t border-slate-50 dark:border-slate-800/60 shrink-0">
        <div className="p-3 rounded-2xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-100/60 dark:border-slate-800/60 flex items-center justify-between gap-4 text-xs font-sans">
          <div className="flex items-center gap-2 min-w-0">
            <TrendingUp size={14} className="text-[#00BA88] shrink-0" />
            <span className="font-bold text-slate-600 dark:text-slate-400 truncate">
              Total User Watchlists Live
            </span>
          </div>

          <span className="font-mono text-sm font-black text-slate-900 dark:text-white shrink-0">
            {totalWatchlists.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}