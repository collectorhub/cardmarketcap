"use client";

import React from "react";
import {
  Bell,
  MoreHorizontal,
} from "lucide-react";

import { cn } from "@/lib/utils";

export default function CardOverviewHeader({
  card,
  cardName,
  cardSet,
  cardType,
  grades,
  selectedGrade,
  onGradeChange,
  onWatchlist,
}: {
  card: any;
  cardName: string;
  cardSet: string;
  cardType: string;
  grades: string[];
  selectedGrade: string;
  onGradeChange: (
    grade: string
  ) => void;
  onWatchlist: () => void;
}) {
  const clean = (
    value: any,
    fallback = "—"
  ) =>
    value === null ||
    value === undefined ||
    value === ""
      ? fallback
      : String(value);

  return (
    <section className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.035)] dark:border-white/5 dark:bg-slate-900 md:p-6">
      <div className="flex flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-[#00BA88]/20 bg-[#00BA88]/10 px-2 py-1 text-[8px] font-black uppercase tracking-[0.13em] text-[#00BA88]">
                Rank #{card.rank || "124"}
              </span>

              <span className="text-[9px] font-black uppercase tracking-[0.17em] text-slate-400">
                Market Index
              </span>
            </div>

            <h1 className="max-w-3xl text-3xl font-black uppercase leading-[0.95] tracking-[-0.035em] text-slate-950 dark:text-white sm:text-4xl lg:text-[42px]">
              {cardName}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.09em] text-slate-500">
              <span>
                {clean(
                  card.set_code ||
                    card.setCode ||
                    cardSet
                )}
              </span>

              <span className="text-slate-300">
                |
              </span>

              <span>
                {clean(card.number)}
              </span>

              <span className="text-slate-300">
                |
              </span>

              <span>
                {clean(cardType)}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={onWatchlist}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-[#00BA88]/40 hover:text-[#00BA88] dark:border-white/10 dark:bg-white/5"
              aria-label="Add to watchlist"
            >
              <Bell size={15} />
            </button>

            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-[#00BA88]/40 hover:text-[#00BA88] dark:border-white/10 dark:bg-white/5"
              aria-label="More actions"
            >
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-[16px] border border-slate-200 bg-slate-50 p-1 dark:border-white/5 dark:bg-white/[0.03]">
          <div className="flex min-w-max gap-1">
            {grades.map(
              (grade) => (
                <button
                  key={grade}
                  type="button"
                  onClick={() =>
                    onGradeChange(
                      grade
                    )
                  }
                  className={cn(
                    "min-w-[68px] rounded-xl px-3 py-2.5 text-[9px] font-black uppercase transition",
                    selectedGrade ===
                      grade
                      ? "bg-white text-[#00BA88] shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-white/10"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  {grade}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
