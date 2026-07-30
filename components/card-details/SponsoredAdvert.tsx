"use client";

import React from "react";
import {
  ArrowUpRight,
  ImageIcon,
  Megaphone,
} from "lucide-react";

type SponsoredAdvertProps = {
  advert: any;
  loading: boolean;
  onClick: () => void;
};

export default function SponsoredAdvert({
  advert,
  loading,
  onClick,
}: SponsoredAdvertProps) {
  if (loading) {
    return (
      <div className="animate-pulse rounded-[18px] border border-[#00BA88]/20 bg-white p-3 dark:bg-slate-900">
        <div className="mb-2.5 h-3 w-24 rounded bg-slate-100 dark:bg-white/10" />
        <div className="aspect-[1.45/1] rounded-[13px] bg-slate-100 dark:bg-white/10" />
      </div>
    );
  }

  const image =
    advert?.image_url ||
    advert?.imageUrl ||
    advert?.image;

  const title =
    advert?.title ||
    "Sponsored promotion";

  const subtitle =
    advert?.subtitle ||
    advert?.description ||
    "";

  const provider =
    advert?.provider &&
    advert.provider !== "internal"
      ? advert.provider
      : "";

  return (
    <section
      onClick={onClick}
      role="link"
      tabIndex={0}
      onKeyDown={(event) => {
        if (
          event.key === "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();
          onClick();
        }
      }}
      className="group cursor-pointer rounded-[18px] border border-[#00BA88]/22 bg-white p-3 transition-colors hover:border-[#00BA88]/42 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00BA88]/35 dark:bg-slate-900"
    >
      <div className="mb-2.5 flex items-center justify-between gap-3 px-0.5">
        <div className="flex items-center gap-2 text-[#00BA88]">
          <Megaphone size={12} />

          <span className="text-[8px] font-black uppercase tracking-[0.17em]">
            {advert?.disclosure ||
              (advert?.provider ===
              "internal"
                ? "Promotion"
                : "Sponsored")}
          </span>
        </div>

        {provider ? (
          <span className="text-[7px] font-black uppercase tracking-[0.09em] text-slate-400">
            {provider}
          </span>
        ) : null}
      </div>

      <div className="relative aspect-[1.45/1] overflow-hidden rounded-[13px] bg-[#071525]">
        {image ? (
          <img
            src={image}
            alt={title}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.025]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageIcon
              size={26}
              className="text-[#00BA88]"
            />
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-[#04111f]/95 via-[#04111f]/45 to-transparent p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
          <div className="min-w-0 translate-y-1 transition-transform duration-200 group-hover:translate-y-0">
            <div className="flex items-center gap-1.5">
              <h3 className="line-clamp-1 text-[11px] font-black text-white">
                {title}
              </h3>

              <ArrowUpRight
                size={11}
                className="shrink-0 text-[#00E0A4]"
              />
            </div>

            {subtitle ? (
              <p className="mt-1 line-clamp-2 text-[8px] font-medium leading-relaxed text-white/72">
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
