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

const EbayLogo = ({
  className,
}: {
  className?: string;
}) => (
  <span
    className={cn(
      "inline-flex shrink-0 items-baseline font-black leading-none tracking-[-0.08em]",
      className
    )}
    aria-label="eBay"
  >
    <span className="text-[#E53238]">
      e
    </span>

    <span className="text-[#0064D2]">
      b
    </span>

    <span className="text-[#F5AF02]">
      a
    </span>

    <span className="text-[#86B817]">
      y
    </span>
  </span>
);

function formatPrice(
  listing: MarketSuggestionListing
) {
  if (
    listing.formattedPrice &&
    listing.formattedPrice.trim() !== ""
  ) {
    return listing.formattedPrice.replace(
      /^USD\s*/i,
      "$"
    );
  }

  const numericPrice =
    Number(listing.price);

  if (
    Number.isFinite(numericPrice) &&
    numericPrice > 0
  ) {
    return new Intl.NumberFormat(
      "en-US",
      {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      }
    ).format(numericPrice);
  }

  return "View price";
}

function SuggestionCard({
  listing,
}: {
  listing: MarketSuggestionListing;
}) {
  const listingUrl =
    listing.url ||
    listing.rawUrl ||
    "";

  const title =
    listing.title?.trim() ||
    "eBay trading card listing";

  const image =
    listing.image?.trim() ||
    "";

  if (!listingUrl) {
    return null;
  }

  return (
    <a
      href={listingUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      aria-label={`View ${title} on eBay`}
      className="group block h-full w-[158px] shrink-0 [scroll-snap-align:start] sm:w-[172px] md:w-[184px] lg:w-[192px]"
    >
      <article className="relative flex h-full min-w-0 flex-col overflow-hidden rounded-[1.15rem] border border-slate-200 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#00BA88]/40 hover:shadow-lg hover:shadow-[#00BA88]/10 active:scale-[0.98] dark:border-slate-800 dark:bg-slate-900 md:rounded-[1.4rem] md:p-3.5">
        <div className="relative mb-3 flex aspect-[4/3] w-full shrink-0 items-center justify-center overflow-hidden rounded-[0.85rem] border border-slate-100 bg-slate-50 p-2 dark:border-slate-800/50 dark:bg-slate-950/40 md:mb-3.5 md:rounded-[1rem] md:p-2.5">
          {image ? (
            <img
              src={image}
              alt={title}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-contain drop-shadow-sm transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center px-3 text-center text-xs font-black text-slate-400">
              No image
            </div>
          )}
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <h3
            title={title}
            className="line-clamp-3 min-h-[3.35rem] text-[10px] font-bold leading-[1.4] text-slate-900 transition-colors group-hover:text-[#00BA88] dark:text-white sm:text-[11px] md:min-h-[3.65rem] md:text-[12px]"
          >
            {title}
          </h3>

          <div className="mt-auto pt-3">
            <div className="flex min-h-9 items-center justify-between gap-3 border-t border-slate-100 pt-3 dark:border-slate-800">
              <p className="min-w-0 truncate text-[11px] font-black tabular-nums text-slate-900 dark:text-white sm:text-[12px] md:text-[13px]">
                {formatPrice(listing)}
              </p>

              <EbayLogo className="text-[15px] transition-transform duration-300 group-hover:scale-105 md:text-[17px]" />
            </div>
          </div>
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
  const visibleListings = (
    Array.isArray(listings)
      ? listings
      : []
  )
    .filter(
      (listing) =>
        Boolean(
          (listing?.url ||
            listing?.rawUrl) &&
            listing?.image
        )
    )
    .slice(0, 12);

  if (visibleListings.length === 0) {
    return null;
  }

  return (
    <section className="mt-10 md:mt-12">
      <div className="mb-5 flex items-center justify-between gap-4 px-1">
        <h2 className="text-[13px] font-black uppercase tracking-[0.14em] text-slate-950 dark:text-white md:text-[15px]">
          Live Market Suggestions
        </h2>

        <a
          href="/shop"
          className="inline-flex shrink-0 items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-slate-400 transition-colors hover:text-[#00BA88] md:text-[10px]"
        >
          View marketplace
          <ArrowUpRight size={13} />
        </a>
      </div>

      <div className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [overscroll-behavior-inline:contain] [scroll-snap-type:x_proximity]">
        <div className="flex min-w-max items-stretch gap-3 md:gap-3.5">
          {visibleListings.map(
            (
              listing,
              index
            ) => (
              <SuggestionCard
                key={
                  listing.id ||
                  listing.itemId ||
                  `${listing.title}-${index}`
                }
                listing={listing}
              />
            )
          )}
        </div>
      </div>

    </section>
  );
}
