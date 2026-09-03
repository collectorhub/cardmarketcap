"use client";

import React from "react";
import {
  ExternalLink,
} from "lucide-react";

import { cn } from "@/lib/utils";

function formatMoney(
  value: number
) {
  return `$${value.toLocaleString(
    "en-US",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;
}

export default function SalesHistoryPanel({
  salesGrades,
  salesGrade,
  salesByGrade,
  sales,
  onGradeChange,
}: {
  salesGrades: string[];
  salesGrade: string;
  salesByGrade: any;
  sales: any[];
  onGradeChange: (
    grade: string
  ) => void;
}) {
  const gradeNumber = (
    grade: string
  ) =>
    grade.replace(
      /[^0-9]/g,
      ""
    );

  return (
    <section className="overflow-hidden rounded-[20px] border border-slate-200/80 bg-white dark:border-white/5 dark:bg-slate-900">
      <div className="px-4 pt-4 md:px-5 md:pt-5">
        <h2 className="text-sm font-black text-slate-900 dark:text-white">
          Sales
        </h2>
      </div>

      <div className="cmc-sales-scroll flex gap-2 overflow-x-auto border-b border-slate-100 px-4 py-3 dark:border-white/5 md:px-5">
        {salesGrades.map(
          (grade) => {
            const gradeKey =
              grade === "Raw"
                ? "raw"
                : gradeNumber(
                    grade
                  );

            const count =
              Array.isArray(
                salesByGrade?.[
                  gradeKey
                ]
              )
                ? salesByGrade[
                    gradeKey
                  ].length
                : 0;

            return (
              <button
                key={grade}
                type="button"
                onClick={() =>
                  onGradeChange(
                    grade
                  )
                }
                className={cn(
                  "shrink-0 rounded-xl px-4 py-2 text-[9px] font-black uppercase tracking-wide transition",
                  salesGrade ===
                    grade
                    ? "bg-[#00BA88] text-white"
                    : "bg-slate-100 text-slate-500 hover:text-[#00BA88] dark:bg-white/5"
                )}
              >
                {grade} ({count})
              </button>
            );
          }
        )}
      </div>

      <div className="cmc-sales-scroll overflow-x-auto">
        <div className="min-w-[680px]">
          <div className="grid grid-cols-[1.25fr_0.85fr_0.7fr_0.55fr] gap-4 border-b border-slate-100 bg-slate-50 px-5 py-3 text-[8px] font-black uppercase tracking-[0.13em] text-slate-400 dark:border-white/5 dark:bg-white/[0.02]">
            <span>Date</span>
            <span>Type</span>
            <span>Price</span>
            <span className="text-right">
              Source
            </span>
          </div>

          {sales.length ? (
            <div className="divide-y divide-slate-100 dark:divide-white/5">
              {sales
                .slice(0, 5)
                .map(
                  (
                    sale: any,
                    index: number
                  ) => (
                    <a
                      key={`${sale.url || sale.title || "sale"}-${index}`}
                      href={
                        sale.url ||
                        "#"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="grid grid-cols-[1.25fr_0.85fr_0.7fr_0.55fr] items-center gap-4 px-5 py-4 transition hover:bg-slate-50 dark:hover:bg-white/[0.02]"
                    >
                      <span className="whitespace-nowrap text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                        {sale.soldDate}
                      </span>

                      <span className="whitespace-nowrap text-[10px] font-black uppercase text-slate-500">
                        {sale.saleType ||
                          sale.type ||
                          "Market"}
                      </span>

                      <span className="whitespace-nowrap text-[11px] font-black tabular-nums text-slate-950 dark:text-white">
                        {formatMoney(
                          sale.numericPrice
                        )}
                      </span>

                      <span className="flex items-center justify-end gap-1.5 whitespace-nowrap text-[10px] font-black text-slate-500">
                        {sale.marketplace ||
                          sale.source ||
                          "eBay"}

                        <ExternalLink
                          size={10}
                        />
                      </span>
                    </a>
                  )
                )}
            </div>
          ) : (
            <div className="px-5 py-10 text-center text-[10px] font-black uppercase tracking-wider text-slate-400">
              No structured transactions logged for {salesGrade}
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .cmc-sales-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .cmc-sales-scroll::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }
      `}</style>
    </section>
  );
}
