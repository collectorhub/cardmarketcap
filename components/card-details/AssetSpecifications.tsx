"use client";

import React from "react";
import { Activity } from "lucide-react";

export default function AssetSpecifications({
  rows,
}: {
  rows: Array<[string, string]>;
}) {
  return (
    <section className="rounded-[20px] border border-slate-200/80 bg-white p-4 dark:border-white/5 dark:bg-slate-900">
      <div className="mb-3.5 flex items-center gap-2">
        <Activity
          size={13}
          className="text-[#00BA88]"
        />
        <h2 className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-500">
          Asset Specifications
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="min-w-0 rounded-[13px] border border-slate-200/80 bg-[#fafbfc] px-3 py-3 dark:border-white/5 dark:bg-white/[0.025]"
          >
            <p className="text-[7px] font-black uppercase tracking-[0.12em] text-slate-400">
              {label}
            </p>
            <p
              title={value}
              className="mt-1.5 line-clamp-2 text-[10px] font-black leading-snug text-slate-950 dark:text-white"
            >
              {value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
