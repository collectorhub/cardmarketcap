"use client";

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ArrowRight,
  Loader2,
} from "lucide-react";

import {
  EbayShopListing,
  EbayShopSection,
  fetchEbayShopListings,
} from "@/lib/queries/ebay";

import {
  buildEbayAffiliateUrl,
  getCardPurchaseLinks,
} from "@/lib/affiliate-links";

export type MarketplaceRow = {
  name: string;
  price: string;
  action: string;
  url?: string;
  logo?: string;
  detail?: string;
};

type LiveComparison = {
  gradedEbay:
    | EbayShopListing
    | null;
  rawEbay:
    | EbayShopListing
    | null;
};

function buildSearchQuery(
  card: any,
  grade?: string
) {
  return [
    card.name,
    card.expansion_name ||
      card.set_name ||
      card.set,
    card.number ||
      card.card_number ||
      card.cardNumber,
    grade &&
    grade !== "Raw"
      ? grade
      : undefined,
  ]
    .filter(Boolean)
    .map((value) =>
      String(value).trim()
    )
    .filter(Boolean)
    .join(" ");
}

function getSelectedSection(
  selectedGrade: string
): EbayShopSection {
  return selectedGrade === "Raw"
    ? "raw"
    : "graded";
}

function chooseBestListing(
  results:
    | EbayShopListing[]
    | undefined
) {
  if (!Array.isArray(results)) {
    return null;
  }

  return (
    results.find(
      (item) =>
        item.url &&
        item.price !==
          null &&
        item.price !==
          undefined &&
        Number(item.price) > 0
    ) ||
    results.find(
      (item) => item.url
    ) ||
    null
  );
}

function formatEbayPrice(
  item:
    | EbayShopListing
    | null
) {
  if (!item) {
    return "View offers";
  }

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
    : "View offers";
}

function formatCardPrice(
  value: any
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "View offers";
  }

  if (
    typeof value === "string" &&
    value.includes("$")
  ) {
    return value;
  }

  const number = Number(
    String(value).replace(
      /[^0-9.-]/g,
      ""
    )
  );

  return Number.isFinite(number) &&
    number > 0
    ? number.toLocaleString(
        "en-US",
        {
          style: "currency",
          currency: "USD",
        }
      )
    : "View offers";
}

function getTcgPlayerRawPrice(
  card: any
) {
  return (
    card.tcgplayer_market_price ||
    card.tcgPlayerMarketPrice ||
    card.tcgplayer_price ||
    card.tcgPlayerPrice ||
    card.raw_market_price ||
    card.rawMarketPrice ||
    card.raw_price ||
    card.rawPrice ||
    card.prices?.tcgplayer?.market ||
    card.prices?.tcgplayer?.normal ||
    null
  );
}

function EbayLogo() {
  return (
    <span
      aria-label="eBay"
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white ring-1 ring-slate-200/80 dark:bg-slate-950 dark:ring-white/10"
    >
      <span className="flex items-baseline text-[9px] font-black leading-none tracking-[-0.12em]">
        <span className="text-[#E53238]">e</span>
        <span className="text-[#0064D2]">B</span>
        <span className="text-[#F5AF02]">a</span>
        <span className="text-[#86B817]">y</span>
      </span>
    </span>
  );
}

function TcgPlayerLogo() {
  return (
    <span
      aria-label="TCGplayer"
      className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#071525] ring-1 ring-slate-200/80 dark:ring-white/10"
    >
      <span className="absolute left-[5px] top-[5px] h-[7px] w-[5px] -rotate-12 rounded-[1px] bg-[#F6C445]" />
      <span className="absolute left-[10px] top-[4px] h-[8px] w-[5px] -rotate-3 rounded-[1px] bg-[#EC3E45]" />
      <span className="absolute right-[8px] top-[5px] h-[7px] w-[5px] rotate-12 rounded-[1px] bg-[#28A7E8]" />

      <span className="relative z-10 rounded-[3px] bg-[#1777B7] px-1 py-[2px] text-[7px] font-black leading-none text-white">
        TCG
      </span>
    </span>
  );
}

function MarketplaceMark({
  marketplace,
}: {
  marketplace:
    | "ebay"
    | "tcgplayer";
}) {
  return marketplace === "ebay"
    ? <EbayLogo />
    : <TcgPlayerLogo />;
}

export default function PriceComparison({
  card,
  selectedGrade,
  fallbackRows = [],
  onOpen,
}: {
  card: any;
  selectedGrade: string;
  fallbackRows?: MarketplaceRow[];
  onOpen: (
    row: MarketplaceRow
  ) => void;
}) {
  const [
    comparison,
    setComparison,
  ] = useState<LiveComparison>({
    gradedEbay: null,
    rawEbay: null,
  });

  const [loading, setLoading] =
    useState(true);

  const selectedSearch =
    useMemo(
      () =>
        buildSearchQuery(
          card,
          selectedGrade
        ),
      [card, selectedGrade]
    );

  const rawSearch = useMemo(
    () =>
      buildSearchQuery(
        card
      ),
    [card]
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);

      try {
        const [
          selectedResponse,
          rawResponse,
        ] = await Promise.all([
          fetchEbayShopListings(
            {
              section:
                getSelectedSection(
                  selectedGrade
                ),
              search:
                selectedSearch,
              sort:
                "price_asc",
              limit: 10,
              offset: 0,
            }
          ),
          fetchEbayShopListings(
            {
              section: "raw",
              search:
                rawSearch,
              sort:
                "price_asc",
              limit: 10,
              offset: 0,
            }
          ),
        ]);

        if (cancelled) {
          return;
        }

        setComparison({
          gradedEbay:
            chooseBestListing(
              selectedResponse.results
            ),
          rawEbay:
            chooseBestListing(
              rawResponse.results
            ),
        });
      } catch (error) {
        console.error(
          "Failed to load live comparison prices:",
          error
        );

        if (!cancelled) {
          setComparison({
            gradedEbay: null,
            rawEbay: null,
          });
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
    selectedGrade,
    selectedSearch,
    rawSearch,
  ]);

  const purchaseLinks =
    useMemo(
      () =>
        getCardPurchaseLinks(
          card,
          {
            placement:
              "card_details_price_comparison",
            component:
              "price_comparison",
          }
        ),
      [card]
    );

  const ebayFallback =
    purchaseLinks.find(
      (link) =>
        link.marketplace ===
        "ebay"
    );

  const tcgLink =
    purchaseLinks.find(
      (link) =>
        link.marketplace ===
        "tcgplayer"
    );

  const fallbackEbay =
    fallbackRows.find(
      (row) =>
        row.name
          .toLowerCase()
          .includes("ebay")
    );

  const fallbackTcg =
    fallbackRows.find(
      (row) =>
        row.name
          .toLowerCase()
          .includes("tcg")
    );

  const gradedUrl =
    buildEbayAffiliateUrl(
      comparison.gradedEbay
        ?.url ||
        comparison.gradedEbay
          ?.rawUrl ||
        ebayFallback?.url ||
        fallbackEbay?.url,
      card.id ||
        card.source_id ||
        card.number ||
        card.name
    ) || undefined;

  const rawUrl =
    buildEbayAffiliateUrl(
      comparison.rawEbay
        ?.url ||
        comparison.rawEbay
          ?.rawUrl ||
        ebayFallback?.url ||
        fallbackEbay?.url,
      card.id ||
        card.source_id ||
        card.number ||
        card.name
    ) || undefined;

  const rows: Array<
    MarketplaceRow & {
      marketplace:
        | "ebay"
        | "tcgplayer";
    }
  > = [];

  if (
    selectedGrade !== "Raw"
  ) {
    rows.push({
      name: `eBay ${selectedGrade}`,
      detail:
        "Graded market",
      price:
        formatEbayPrice(
          comparison.gradedEbay
        ),
      action:
        comparison.gradedEbay
          ?.buyingOptions?.includes(
            "AUCTION"
          )
          ? "Auction"
          : "Buy Now",
      url: gradedUrl,
      marketplace: "ebay",
    });
  }

  rows.push(
    {
      name: "eBay Raw",
      detail: "Raw market",
      price:
        formatEbayPrice(
          comparison.rawEbay
        ),
      action:
        comparison.rawEbay
          ?.buyingOptions?.includes(
            "AUCTION"
          )
          ? "Auction"
          : "Buy Now",
      url: rawUrl,
      marketplace: "ebay",
    },
    {
      name:
        "TCGplayer Raw",
      detail: "Raw market",
      price:
        formatCardPrice(
          getTcgPlayerRawPrice(
            card
          )
        ),
      action: "Market",
      url:
        tcgLink?.url ||
        fallbackTcg?.url,
      marketplace:
        "tcgplayer",
    }
  );

  return (
    <section className="overflow-hidden rounded-[20px] border border-slate-200/80 bg-white dark:border-white/5 dark:bg-slate-900">
      <div className="flex items-center justify-between px-4 pb-3 pt-4">
        <h2 className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">
          Price Comparison
        </h2>

        <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-slate-400">
          View marketplace
          <ArrowRight size={10} />
        </span>
      </div>

      <div className="divide-y divide-slate-100 border-t border-slate-100 dark:divide-white/5 dark:border-white/5">
        {rows.map(
          (row) => (
            <button
              key={row.name}
              type="button"
              disabled={!row.url}
              onClick={() =>
                row.url &&
                onOpen(row)
              }
              className="grid w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-4 px-4 py-4 text-left transition hover:bg-slate-50/80 disabled:cursor-default disabled:opacity-65 dark:hover:bg-white/[0.02]"
            >
              <span className="flex min-w-0 items-center gap-3">
                <MarketplaceMark
                  marketplace={
                    row.marketplace
                  }
                />

                <span className="min-w-0">
                  <span className="block truncate text-[12px] font-semibold text-slate-600 dark:text-slate-300">
                    {row.name}
                  </span>

                  <span className="mt-0.5 block truncate text-[9px] font-medium text-slate-400">
                    {row.detail}
                  </span>
                </span>
              </span>

              <span className="text-[13px] font-black tabular-nums text-slate-950 dark:text-white">
                {row.price}
              </span>

              <span className="min-w-[58px] text-right text-[10px] font-semibold text-slate-400">
                {row.action}
              </span>
            </button>
          )
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-1.5 border-t border-slate-100 py-2.5 text-[9px] font-semibold text-slate-400 dark:border-white/5">
          <Loader2
            size={9}
            className="animate-spin"
          />
          Updating prices
        </div>
      ) : null}
    </section>
  );
}
