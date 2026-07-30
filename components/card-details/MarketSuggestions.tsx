"use client";

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

import {
  EbayShopListing,
  EbayShopSection,
  fetchEbayShopListings,
} from "@/lib/queries/ebay";

type MarketSuggestionsProps = {
  card: any;
  selectedGrade: string;
};

const ITEMS_PER_PAGE = 4;
const MAX_TITLE_LENGTH = 20;

function shortenTitle(
  value?: string
) {
  const title =
    String(value || "eBay listing")
      .replace(/\s+/g, " ")
      .trim();

  if (
    title.length <=
    MAX_TITLE_LENGTH
  ) {
    return title;
  }

  return `${title.slice(
    0,
    MAX_TITLE_LENGTH - 1
  )}…`;
}

function formatPrice(
  item: EbayShopListing
) {
  if (item.formattedPrice) {
    return item.formattedPrice.replace(
      /^USD\s*/i,
      "$"
    );
  }

  const value = Number(
    item.price || 0
  );

  return value > 0
    ? value.toLocaleString(
        "en-US",
        {
          style: "currency",
          currency:
            item.currency ||
            "USD",
        }
      )
    : "View listing";
}

function buildSearchQuery(
  card: any,
  selectedGrade: string
) {
  return [
    card.name,
    card.expansion_name ||
      card.set_name ||
      card.set,
    card.number ||
      card.card_number ||
      card.cardNumber,
    selectedGrade !== "Raw"
      ? selectedGrade
      : undefined,
  ]
    .filter(Boolean)
    .map((value) =>
      String(value).trim()
    )
    .filter(Boolean)
    .join(" ");
}

function getSection(
  selectedGrade: string
): EbayShopSection {
  return selectedGrade === "Raw"
    ? "raw"
    : "graded";
}

function uniqueListings(
  items: EbayShopListing[]
) {
  const seen = new Set<string>();

  return items.filter(
    (item) => {
      const key = String(
        item.itemId ||
          item.id ||
          item.url ||
          item.title ||
          ""
      );

      if (
        !key ||
        seen.has(key)
      ) {
        return false;
      }

      seen.add(key);

      return Boolean(
        item.url &&
          item.image
      );
    }
  );
}

function ListingSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-3">
      {[0, 1, 2, 3].map(
        (item) => (
          <div
            key={item}
            className="animate-pulse"
          >
            <div className="aspect-[0.72/1] bg-slate-100 dark:bg-white/5" />
            <div className="mt-2 h-2.5 w-4/5 rounded bg-slate-100 dark:bg-white/5" />
            <div className="mt-1.5 h-3 w-1/2 rounded bg-slate-100 dark:bg-white/5" />
          </div>
        )
      )}
    </div>
  );
}

export default function MarketSuggestions({
  card,
  selectedGrade,
}: MarketSuggestionsProps) {
  const [
    listings,
    setListings,
  ] = useState<
    EbayShopListing[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [page, setPage] =
    useState(0);

  const searchQuery = useMemo(
    () =>
      buildSearchQuery(
        card,
        selectedGrade
      ),
    [card, selectedGrade]
  );

  const section = useMemo(
    () =>
      getSection(
        selectedGrade
      ),
    [selectedGrade]
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setPage(0);

      try {
        const primary =
          await fetchEbayShopListings(
            {
              section,
              search:
                searchQuery,
              sort:
                "best_match",
              limit: 16,
              offset: 0,
            }
          );

        let combined =
          Array.isArray(
            primary.results
          )
            ? primary.results
            : [];

        /*
         * If eBay returns fewer than four usable images for the selected
         * grade, run the same card query against the alternate section.
         * This keeps the row visually complete without introducing
         * unrelated cards.
         */
        if (
          uniqueListings(
            combined
          ).length < 4
        ) {
          const secondary =
            await fetchEbayShopListings(
              {
                section:
                  section ===
                  "raw"
                    ? "graded"
                    : "raw",
                search:
                  searchQuery.replace(
                    /\bPSA\s+\d+\b/i,
                    ""
                  ).trim(),
                sort:
                  "best_match",
                limit: 12,
                offset: 0,
              }
            );

          combined = [
            ...combined,
            ...(Array.isArray(
              secondary.results
            )
              ? secondary.results
              : []),
          ];
        }

        if (!cancelled) {
          setListings(
            uniqueListings(
              combined
            ).slice(0, 12)
          );
        }
      } catch (error) {
        console.error(
          "Failed to load eBay market suggestions:",
          error
        );

        if (!cancelled) {
          setListings([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [
    searchQuery,
    section,
  ]);

  const pageCount =
    Math.max(
      1,
      Math.ceil(
        listings.length /
          ITEMS_PER_PAGE
      )
    );

  const safePage =
    Math.min(
      page,
      pageCount - 1
    );

  const visibleListings =
    listings.slice(
      safePage *
        ITEMS_PER_PAGE,
      safePage *
        ITEMS_PER_PAGE +
        ITEMS_PER_PAGE
    );

  const firstListingUrl =
    listings[0]?.url || "#";

  return (
    <section className="rounded-[18px] border border-slate-200/80 bg-white px-4 pb-3.5 pt-4 dark:border-white/5 dark:bg-slate-900">
      <div className="mb-3.5 flex items-center justify-between gap-3">
        <h2 className="text-[9px] font-black uppercase tracking-[0.17em] text-slate-500">
          Market Suggestions
        </h2>

        <a
          href={firstListingUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="inline-flex items-center gap-1 text-[8px] font-semibold text-slate-400 transition hover:text-[#00BA88]"
        >
          View all
          <ArrowRight size={10} />
        </a>
      </div>

      {loading ? (
        <ListingSkeleton />
      ) : visibleListings.length ? (
        <>
          <div className="grid grid-cols-4 gap-3">
            {visibleListings.map(
              (
                item,
                index
              ) => {
                const fullTitle =
                  String(
                    item.title ||
                      "eBay listing"
                  );

                return (
                  <a
                    key={
                      item.id ||
                      item.itemId ||
                      `${safePage}-${index}`
                    }
                    href={
                      item.url ||
                      "#"
                    }
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="group min-w-0"
                  >
                    <div className="aspect-[0.72/1] w-full overflow-hidden">
                      <img
                        src={
                          item.image
                        }
                        alt={fullTitle}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.025]"
                      />
                    </div>

                    <p
                      title={fullTitle}
                      className="mt-2 block truncate text-[9px] font-medium leading-none text-slate-500 transition group-hover:text-[#00BA88]"
                    >
                      {shortenTitle(
                        fullTitle
                      )}
                    </p>

                    <p className="mt-1 truncate text-[10px] font-black leading-none tabular-nums text-slate-950 dark:text-white">
                      {formatPrice(
                        item
                      )}
                    </p>
                  </a>
                );
              }
            )}
          </div>

          {listings.length >
          ITEMS_PER_PAGE ? (
            <div className="mt-3.5 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setPage(
                    (current) =>
                      Math.max(
                        0,
                        current - 1
                      )
                  )
                }
                disabled={
                  safePage === 0
                }
                className="flex h-5 w-5 items-center justify-center rounded-full text-slate-300 transition hover:text-[#00BA88] disabled:opacity-25"
                aria-label="Previous suggestions"
              >
                <ChevronLeft size={11} />
              </button>

              <div className="flex items-center gap-1.5">
                {Array.from({
                  length:
                    Math.min(
                      pageCount,
                      5
                    ),
                }).map(
                  (_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() =>
                        setPage(
                          index
                        )
                      }
                      className={
                        index ===
                        safePage
                          ? "h-1.5 w-1.5 rounded-full bg-[#00BA88]"
                          : "h-1.5 w-1.5 rounded-full bg-slate-200 transition hover:bg-slate-300 dark:bg-white/10"
                      }
                      aria-label={`Show suggestions page ${index + 1}`}
                    />
                  )
                )}
              </div>

              <button
                type="button"
                onClick={() =>
                  setPage(
                    (current) =>
                      Math.min(
                        pageCount - 1,
                        current + 1
                      )
                  )
                }
                disabled={
                  safePage >=
                  pageCount - 1
                }
                className="flex h-5 w-5 items-center justify-center rounded-full text-slate-300 transition hover:text-[#00BA88] disabled:opacity-25"
                aria-label="Next suggestions"
              >
                <ChevronRight size={11} />
              </button>
            </div>
          ) : null}
        </>
      ) : (
        <div className="flex min-h-[130px] items-center justify-center border border-dashed border-slate-200 text-center dark:border-white/10">
          <div>
            <p className="text-[9px] font-black uppercase tracking-wide text-slate-400">
              No matching listings
            </p>

            <p className="mt-1 text-[8px] text-slate-400">
              Try another grade
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[8px] font-black uppercase tracking-wide text-slate-400">
          <Loader2
            size={9}
            className="animate-spin"
          />
          Loading
        </div>
      ) : null}
    </section>
  );
}
