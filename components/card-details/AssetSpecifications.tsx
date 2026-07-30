import React from "react";
import { Activity } from "lucide-react";

export default function AssetSpecifications({
  rows,
}: {
  rows: Array<[string, string]>;
}) {
  return (
    <section className="overflow-hidden rounded-[20px] border border-slate-200/80 bg-white  dark:border-white/5 dark:bg-slate-900">
      <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-4 dark:border-white/5">
        <Activity
          size={14}
          className="text-[#00BA88]"
        />

        <h2 className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
          Asset Specifications
        </h2>
      </div>

      <div className="divide-y divide-slate-100 px-4 dark:divide-white/5">
        {rows.map(
          ([label, value]) => (
            <div
              key={label}
              className="grid grid-cols-[0.9fr_1.1fr] gap-4 py-3"
            >
              <span className="text-[10px] font-semibold text-slate-500">
                {label}
              </span>

              <span className="text-right text-[11px] font-black text-slate-950 dark:text-white">
                {value}
              </span>
            </div>
          )
        )}
      </div>
    </section>
  );
}
