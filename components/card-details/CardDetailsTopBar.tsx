"use client";

import React from "react";
import {
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

function TopMetric({
  label,
  value,
}: {
  label: string;
  value: any;
}) {
  const display =
    value === null ||
    value === undefined ||
    value === ""
      ? "—"
      : String(value);

  return (
    <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-wide text-slate-400">
      <span>{label}:</span>
      <span className="text-slate-950 dark:text-white">
        {display}
      </span>
    </div>
  );
}

export default function CardDetailsTopBar({
  card,
  cardName,
  cardSet,
  onBack,
}: {
  card: any;
  cardName: string;
  cardSet: string;
  onBack: (
    event: React.MouseEvent
  ) => void;
}) {
  return (
    <div className="sticky top-0 z-30 border-b border-slate-200/70 bg-white dark:border-white/5 dark:bg-[#020617]/90">
      <div className="mx-auto flex min-h-14 max-w-[1540px] items-center justify-between gap-4 px-4 py-2 md:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3 text-[10px] font-black uppercase tracking-[0.09em]">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex shrink-0 items-center gap-1.5 text-slate-500 transition hover:text-[#00BA88]"
          >
            <ArrowLeft size={13} />
            Back to results
          </button>

          <span className="hidden text-slate-300 sm:block">
            /
          </span>

          <span className="hidden truncate text-slate-700 sm:block dark:text-slate-300">
            {cardSet}
          </span>

          <span className="hidden text-slate-300 md:block">
            /
          </span>

          <span className="hidden truncate font-black text-slate-950 md:block dark:text-white">
            {cardName}
          </span>

          <span className="hidden items-center gap-1.5 text-[#00BA88] lg:flex">
            <ShieldCheck size={14} />
            Verified
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <div className="hidden items-center gap-5 xl:flex">
            <TopMetric
              label="VOL 24H"
              value={
                card.volume24h ||
                card.volume_24h ||
                card.sales30d ||
                "$0.00"
              }
            />

            <TopMetric
              label="SALES 24H"
              value={
                card.sales24h ||
                card.sales_24h ||
                card.sales30dNum ||
                "0"
              }
            />

            <TopMetric
              label="CAP"
              value={
                card.marketCap ||
                "$0.00"
              }
            />
          </div>

        </div>
      </div>
    </div>
  );
}
