"use client";

import React from "react";

import { cn } from "@/lib/utils";

export default function PopulationPanel({
  popData,
  totalPop,
  selectedGrade,
  onGradeChange,
}: {
  popData: Record<string, any>;
  totalPop: number;
  selectedGrade: string;
  onGradeChange: (
    grade: string
  ) => void;
}) {
  return (
    <section className="rounded-[20px] border border-slate-200/80 bg-white p-5  dark:border-white/5 dark:bg-slate-900 md:p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
          PSA Population Data
        </h2>

        <span className="text-[9px] font-black uppercase tracking-wide text-slate-400">
          Total Pop:{" "}
          {Number(
            totalPop || 0
          ).toLocaleString(
            "en-US"
          )}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(
          (grade) => {
            const count =
              Number(
                popData[
                  `grade_${grade}`
                ] || 0
              );

            const percentage =
              totalPop > 0
                ? (
                    (count /
                      totalPop) *
                    100
                  ).toFixed(1)
                : "0.0";

            const gradeLabel =
              `PSA ${grade}`;

            return (
              <button
                key={grade}
                type="button"
                onClick={() =>
                  onGradeChange(
                    gradeLabel
                  )
                }
                className={cn(
                  "rounded-[16px] border p-3 text-center transition",
                  selectedGrade ===
                    gradeLabel
                    ? "border-[#00BA88]/50 bg-[#00BA88]/5"
                    : "border-slate-200 bg-white hover:border-[#00BA88]/30 dark:border-white/5 dark:bg-white/[0.02]"
                )}
              >
                <p className="text-[8px] font-black uppercase tracking-wider text-[#00BA88]">
                  PSA {grade}
                </p>

                <p className="mt-1 text-lg font-black tabular-nums text-slate-950 dark:text-white">
                  {count.toLocaleString(
                    "en-US"
                  )}
                </p>

                <p className="mt-0.5 text-[8px] font-semibold text-slate-400">
                  ({percentage}%)
                </p>
              </button>
            );
          }
        )}
      </div>
    </section>
  );
}
