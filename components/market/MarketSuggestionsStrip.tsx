import React from "react";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

export type MarketSuggestionListing = {
  id?: string;
  itemId?: string;
  title?: string;
  image?: string;
  price?: string | number | null;
  formattedPrice?: string;
  url?: string;
  rawUrl?: string;
  condition?: string;
};

const EbayLogo = ({ className }: { className?: string }) => (
  <span
    className={cn(
      "inline-flex shrink-0 items-baseline font-black leading-none tracking-[-0.08em]",
      className
    )}
    aria-label="eBay"
  >
    <span className="text-[#E53238]">e</span>
    <span className="text-[#0064D2]">b</span>
    <span className="text-[#F5AF02]">a</span>
    <span className="text-[#86B817]">y</span>
  </span>
);

function formatPrice(listing: MarketSuggestionListing) {
  if (listing.formattedPrice?.trim()) {
    return listing.formattedPrice.replace(/^USD\s*/i, "$");
  }

  const numericPrice = Number(listing.price);

  if (Number.isFinite(numericPrice) && numericPrice > 0) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(numericPrice);
  }

  return "View price";
}

function SuggestionCard({ listing }: { listing: MarketSuggestionListing }) {
  const listingUrl = listing.url || listing.rawUrl || "";
  const title = listing.title?.trim() || "eBay trading card listing";
  const image = listing.image?.trim() || "";

  if (!listingUrl) return null;

  return (
    <a
      href={listingUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      aria-label={`View ${title} on eBay`}
      className="group block h-full w-[calc((100%-1.5rem)/4)] min-w-0 shrink-0 [scroll-snap-align:start] lg:w-[calc((100%-6.75rem)/10)]"
    >
      <article className="flex h-full min-w-0 flex-col">
        <div className="relative aspect-[0.72/1] w-full shrink-0 overflow-hidden bg-slate-100 dark:bg-white/5">
          {image ? (
            <img
              src={image}
              alt={title}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.025]"
            />
          ) : (
            <span className="flex h-full items-center justify-center px-1 text-center text-[9px] font-bold text-slate-400 lg:px-2 lg:text-xs">
              No image
            </span>
          )}
        </div>

        <h3
          title={title}
          className="mt-1.5 whitespace-normal break-words text-[7px] font-medium leading-[1.35] text-slate-600 transition-colors group-hover:text-[#00BA88] dark:text-slate-300 lg:mt-2.5 lg:text-[10px] lg:leading-[1.45]"
        >
          {title}
        </h3>

        <div className="mt-auto flex min-w-0 flex-col items-start gap-1 pt-1.5 lg:flex-row lg:items-center lg:justify-between lg:gap-2 lg:pt-2">
          <p className="min-w-0 break-words text-[10px] font-black leading-none tabular-nums text-slate-950 dark:text-white lg:text-[15px]">
            {formatPrice(listing)}
          </p>

          <EbayLogo className="text-[12px] lg:text-[19px]" />
        </div>
      </article>
    </a>
  );
}

export default function MarketSuggestionsStrip({
  listings,
}: {
  listings: MarketSuggestionListing[];
}) {
  const visibleListings = (Array.isArray(listings) ? listings : [])
    .filter((listing) =>
      Boolean((listing?.url || listing?.rawUrl) && listing?.image)
    )
    .slice(0, 12);

  if (visibleListings.length === 0) return null;

  return (
    <section className="mt-10 md:mt-12">
      <div className="mb-3 flex items-center justify-between gap-3 px-1 lg:mb-4 lg:gap-4">
        <h2 className="text-xs font-black uppercase tracking-[0.13em] text-slate-600 dark:text-slate-300 lg:text-base lg:tracking-[0.15em]">
          Market Suggestions
        </h2>

        <a
          href="/shop"
          className="inline-flex shrink-0 items-center gap-1 text-[10px] font-semibold text-slate-500 transition-colors hover:text-[#00BA88] dark:text-slate-400 lg:gap-1.5 lg:text-sm"
        >
          View marketplace
          <ArrowUpRight className="size-3 lg:size-3.5" />
        </a>
      </div>

      <div className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [overscroll-behavior-inline:contain] [scroll-snap-type:x_proximity]">
        <div className="flex min-w-0 items-stretch gap-3 lg:gap-5">
          {visibleListings.map((listing, index) => (
            <SuggestionCard
              key={
                listing.id ||
                listing.itemId ||
                `${listing.title}-${index}`
              }
              listing={listing}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
