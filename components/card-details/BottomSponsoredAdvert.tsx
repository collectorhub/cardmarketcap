"use client";

import React from "react";
import {
  ArrowUpRight,
  Megaphone,
} from "lucide-react";

export default function BottomSponsoredAdvert({
  advert,
  loading,
  onClick,
}: {
  advert: any;
  loading: boolean;
  onClick: () => void;
}) {
  if (loading) {
    return (
      <div className="mt-7 animate-pulse rounded-[18px] border border-slate-200/80 bg-white p-3 dark:border-white/5 dark:bg-slate-900">
        <div className="h-[92px] rounded-[13px] bg-slate-100 dark:bg-white/5 md:h-[112px]" />
      </div>
    );
  }

  if (!advert) return null;

  const image =
    advert.image_url ||
    advert.imageUrl ||
    advert.image ||
    "";

  const title =
    advert.title ||
    "Sponsored promotion";

  const subtitle =
    advert.subtitle ||
    advert.description ||
    "";

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative mt-7 block w-full overflow-hidden rounded-[18px] border border-[#00BA88]/25 bg-white text-left transition hover:border-[#00BA88]/45 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00BA88]/30 dark:bg-slate-900"
    >
      <div className="absolute left-4 top-3 z-20 flex items-center gap-2 rounded-full bg-white/90 px-2.5 py-1 text-[#00BA88] backdrop-blur dark:bg-slate-950/85">
        <Megaphone size={11} />
        <span className="text-[8px] font-black uppercase tracking-[0.16em]">
          Sponsored
        </span>
      </div>

      <div className="relative h-[105px] overflow-hidden md:h-[128px]">
        {image ? (
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.015]"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-r from-[#061827] via-[#0b2f3a] to-[#00BA88]/30" />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-[#03101d]/92 via-[#03101d]/58 to-transparent" />

        <div className="absolute inset-y-0 left-0 z-10 flex max-w-[720px] items-center px-5 py-5 md:px-7">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="line-clamp-1 text-base font-black text-white md:text-xl">
                {title}
              </h3>
              <ArrowUpRight
                size={15}
                className="shrink-0 text-[#00E0A4]"
              />
            </div>

            {subtitle ? (
              <p className="mt-1.5 line-clamp-2 max-w-2xl text-[10px] font-medium leading-relaxed text-white/75 md:text-xs">
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </button>
  );
}
