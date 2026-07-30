"use client";

import React from "react";
import {
  CheckCircle2,
  Loader2,
  Share2,
  Star,
} from "lucide-react";

import { cn } from "@/lib/utils";

export default function CardMediaPanel({
  cardImage,
  cardName,
  watchlisted,
  addingToWatchlist,
  copied,
  onWatchlist,
  onShare,
}: {
  cardImage: string;
  cardName: string;
  watchlisted: boolean;
  addingToWatchlist: boolean;
  copied: boolean;
  onWatchlist: () => void;
  onShare: () => void;
}) {
  return (
    <section className="rounded-[20px] border border-slate-200/80 bg-white p-4 dark:border-white/5 dark:bg-slate-900">
      <div className="flex min-h-[360px] items-center justify-center overflow-hidden rounded-[20px] bg-slate-50 p-3 dark:bg-white/[0.03] sm:min-h-[420px] lg:min-h-[470px]">
        <img
          src={cardImage}
          alt={cardName}
          className="max-h-[500px] w-full object-contain drop-shadow-[0_8px_14px_rgba(15,23,42,0.10)] transition duration-500 hover:scale-[1.02]"
        />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onWatchlist}
          disabled={addingToWatchlist}
          className={cn(
            "inline-flex h-10 items-center justify-center gap-2 rounded-xl border text-[10px] font-black uppercase tracking-wide transition",
            watchlisted
              ? "border-[#00BA88] bg-[#00BA88]/10 text-[#00BA88]"
              : "border-slate-200 bg-white text-slate-700 hover:border-[#00BA88]/40 hover:text-[#00BA88] dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
          )}
        >
          {addingToWatchlist ? (
            <Loader2
              size={13}
              className="animate-spin"
            />
          ) : (
            <Star
              size={13}
              className={cn(
                watchlisted &&
                  "fill-current"
              )}
            />
          )}

          {watchlisted
            ? "Watching"
            : "Watchlist"}
        </button>

        <button
          type="button"
          onClick={onShare}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-[10px] font-black uppercase tracking-wide text-slate-700 transition hover:border-[#00BA88]/40 hover:text-[#00BA88] dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
        >
          {copied ? (
            <CheckCircle2
              size={13}
              className="text-[#00BA88]"
            />
          ) : (
            <Share2 size={13} />
          )}

          {copied
            ? "Copied"
            : "Share"}
        </button>
      </div>
    </section>
  );
}
