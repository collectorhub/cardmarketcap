"use client";

import React from "react";
import {
  Loader2,
  Plus,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AddToPortfolioModal({
  open,
  cardImage,
  cardName,
  cardSet,
  currentDisplayPrice,
  grades,
  selectedGrade,
  adding,
  message,
  onClose,
  onGradeChange,
  onSubmit,
}: {
  open: boolean;
  cardImage: string;
  cardName: string;
  cardSet: string;
  currentDisplayPrice: string;
  grades: string[];
  selectedGrade: string;
  adding: boolean;
  message: string;
  onClose: () => void;
  onGradeChange: (
    grade: string
  ) => void;
  onSubmit: () => void;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md">
      <div className="w-full max-w-md overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.18)] dark:border-white/10 dark:bg-slate-950">
        <div className="flex items-start justify-between border-b border-slate-100 p-5 dark:border-white/10">
          <div>
            <h3 className="text-base font-black uppercase tracking-tight">
              Add to Portfolio
            </h3>

            <p className="mt-1 text-[11px] font-medium text-slate-500">
              Choose the grade you own.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 dark:hover:bg-white/10"
          >
            <X size={17} />
          </button>
        </div>

        <div className="space-y-5 p-5">
          <div className="flex items-center gap-4">
            <div className="h-28 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100 p-2 dark:bg-white/5">
              <img
                src={cardImage}
                alt={cardName}
                className="h-full w-full object-contain"
              />
            </div>

            <div className="min-w-0">
              <h4 className="line-clamp-2 text-sm font-black uppercase">
                {cardName}
              </h4>

              <p className="mt-1 line-clamp-1 text-[10px] font-bold uppercase text-slate-400">
                {cardSet}
              </p>

              <p className="mt-2 text-sm font-black text-[#00BA88]">
                {currentDisplayPrice}
              </p>
            </div>
          </div>

          <div>
            <p className="mb-3 text-[9px] font-black uppercase tracking-widest text-slate-400">
              Select Grade
            </p>

            <div className="grid grid-cols-3 gap-2">
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
                      "rounded-xl border py-3 text-[10px] font-black uppercase transition",
                      selectedGrade ===
                        grade
                        ? "border-[#00BA88] bg-[#00BA88] text-white"
                        : "border-slate-200 text-slate-500 hover:border-[#00BA88]/50 dark:border-white/10"
                    )}
                  >
                    {grade}
                  </button>
                )
              )}
            </div>
          </div>

          {message ? (
            <p className="text-center text-[11px] font-bold text-slate-500">
              {message}
            </p>
          ) : null}

          <Button
            onClick={onSubmit}
            disabled={adding}
            className="h-12 w-full rounded-xl bg-[#00BA88] text-[10px] font-black uppercase tracking-widest text-white hover:bg-[#00a377]"
          >
            {adding ? (
              <>
                <Loader2
                  size={14}
                  className="mr-2 animate-spin"
                />
                Adding...
              </>
            ) : (
              <>
                <Plus
                  size={14}
                  className="mr-2"
                />
                Add {selectedGrade}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
