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
    <div className="flex min-w-0 items-center gap-2 whitespace-nowrap">
      <span className="text-[10px] font-black uppercase tracking-[0.08em] text-slate-400 md:text-[11px]">
        {label}:
      </span>

      <span className="text-[12px] font-black tabular-nums tracking-tight text-slate-950 dark:text-white md:text-[13px]">
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
    <div className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/95 backdrop-blur-md dark:border-white/5 dark:bg-[#020617]/92">
      <div className="mx-auto flex min-h-[62px] max-w-[1540px] items-center justify-between gap-5 px-4 py-2.5 md:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3 text-[10px] font-black uppercase tracking-[0.09em] md:text-[11px]">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex shrink-0 items-center gap-1.5 text-slate-500 transition hover:text-[#00BA88]"
          >
            <ArrowLeft size={14} />
            Back to results
          </button>

          <span className="hidden text-slate-300 sm:block dark:text-slate-700">
            /
          </span>

          <span className="hidden max-w-[220px] truncate text-slate-700 sm:block dark:text-slate-300 xl:max-w-[300px]">
            {cardSet}
          </span>

          <span className="hidden text-slate-300 md:block dark:text-slate-700">
            /
          </span>

          <span className="hidden max-w-[220px] truncate font-black text-slate-950 md:block dark:text-white xl:max-w-[320px]">
            {cardName}
          </span>

          <span className="hidden items-center gap-1.5 text-[#00BA88] lg:flex">
            <ShieldCheck size={15} />
            Verified
          </span>
        </div>

        <div className="flex shrink-0 items-center">
          <div className="hidden items-center gap-7 xl:flex">
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
