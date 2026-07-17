"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";

import {
  Search,
  ShoppingBag,
  ShoppingCart,
  ShieldCheck,
  Package,
  Clock,
  SparklesIcon,
  X,
  Loader2,
  Trash2,
  BadgeDollarSign,
  Gavel,
} from "lucide-react";

import { cn } from "@/lib/utils";
import CustomDropdown from "@/components/CustomDropdown";

import {
  EbayShopListing,
  EbayShopResponse,
  EbayShopSection,
  EbayShopSort,
  fetchEbayShopListings,
} from "@/lib/queries/ebay";

import { fetchSearchSuggestions } from "@/lib/queries/search";

const SHOP_RECENT_SEARCH_KEY =
  "cmc_shop_recent_searches";

type ShopSectionConfiguration = {
  id: EbayShopSection;
  label: string;
  shortLabel: string;
  description: string;
  icon: React.ComponentType<{
    className?: string;
    size?: number;
  }>;
  defaultSort: EbayShopSort;
  isAuction: boolean;
};

const SHOP_SECTIONS: ShopSectionConfiguration[] = [
  {
    id: "graded",
    label: "Graded",
    shortLabel: "Graded Buy Now",
    description:
      "Fixed-price PSA, CGC, BGS and professionally graded cards.",
    icon: ShieldCheck,
    defaultSort: "best_match",
    isAuction: false,
  },
  {
    id: "graded_auction",
    label: "Graded Auctions",
    shortLabel: "Graded Auctions",
    description:
      "Professionally graded card auctions sorted by ending soonest.",
    icon: Gavel,
    defaultSort: "ending_soon",
    isAuction: true,
  },
  {
    id: "raw",
    label: "Singles",
    shortLabel: "Singles Buy Now",
    description:
      "Individual ungraded cards available at a fixed price.",
    icon: ShoppingBag,
    defaultSort: "best_match",
    isAuction: false,
  },
  {
    id: "auction",
    label: "Singles Auctions",
    shortLabel: "Singles Auctions",
    description:
      "Individual ungraded card auctions sorted by ending soonest.",
    icon: Clock,
    defaultSort: "ending_soon",
    isAuction: true,
  },
  {
    id: "sealed",
    label: "Sealed Products",
    shortLabel: "Sealed",
    description:
      "Booster boxes, packs, ETBs and other sealed products.",
    icon: Package,
    defaultSort: "best_match",
    isAuction: false,
  },
];

const SORT_LABELS: Record<EbayShopSort, string> = {
  best_match: "Best Match",
  ending_soon: "Ending Soon",
  newly_listed: "Newly Listed",
  price_asc: "Price Low",
  price_desc: "Price High",
};

const STANDARD_SORT_OPTIONS = [
  SORT_LABELS.best_match,
  SORT_LABELS.newly_listed,
  SORT_LABELS.price_asc,
  SORT_LABELS.price_desc,
];

const AUCTION_SORT_OPTIONS = [
  SORT_LABELS.ending_soon,
  SORT_LABELS.newly_listed,
  SORT_LABELS.price_asc,
  SORT_LABELS.price_desc,
];

type ListingsBySection = Record<
  EbayShopSection,
  EbayShopResponse
>;

type LoadingBySection = Record<
  EbayShopSection,
  boolean
>;

const createEmptyListings =
  (): EbayShopResponse => ({
    success: false,
    results: [],
    total: 0,
    count: 0,
    hasMore: false,
    resolvedQuery: "",
  });

const createInitialListingsMap = (
  initialSection: EbayShopSection,
  initialListings: EbayShopResponse
): ListingsBySection => ({
  graded:
    initialSection === "graded"
      ? initialListings
      : createEmptyListings(),

  graded_auction:
    initialSection === "graded_auction"
      ? initialListings
      : createEmptyListings(),

  raw:
    initialSection === "raw"
      ? initialListings
      : createEmptyListings(),

  auction:
    initialSection === "auction"
      ? initialListings
      : createEmptyListings(),

  sealed:
    initialSection === "sealed"
      ? initialListings
      : createEmptyListings(),
});

const createInitialLoadingMap =
  (): LoadingBySection => ({
    graded: false,
    graded_auction: false,
    raw: false,
    auction: false,
    sealed: false,
  });

const createAllLoadingMap =
  (): LoadingBySection => ({
    graded: true,
    graded_auction: true,
    raw: true,
    auction: true,
    sealed: true,
  });

const getSortIdFromLabel = (
  label: string
): EbayShopSort => {
  const found = Object.entries(SORT_LABELS).find(
    ([, value]) => value === label
  );

  return (
    (found?.[0] as EbayShopSort) ||
    "best_match"
  );
};

const getSectionConfiguration = (
  section: EbayShopSection
) =>
  SHOP_SECTIONS.find(
    (shopSection) => shopSection.id === section
  );

const getSectionSort = (
  section: EbayShopSection,
  requestedSort: EbayShopSort
): EbayShopSort => {
  const configuration =
    getSectionConfiguration(section);

  if (configuration?.isAuction) {
    return requestedSort === "best_match"
      ? "ending_soon"
      : requestedSort;
  }

  return requestedSort === "ending_soon"
    ? "best_match"
    : requestedSort;
};

const formatPrice = (
  formattedPrice?: string
) => {
  if (!formattedPrice) {
    return "N/A";
  }

  return formattedPrice.replace(
    /^USD\s*/i,
    "$"
  );
};

const formatTimeRemaining = (
  itemEndDate?: string | null
) => {
  if (!itemEndDate) {
    return null;
  }

  const endingTime = new Date(
    itemEndDate
  ).getTime();

  if (Number.isNaN(endingTime)) {
    return null;
  }

  const difference =
    endingTime - Date.now();

  if (difference <= 0) {
    return "Ended";
  }

  const totalMinutes = Math.floor(
    difference / 60000
  );

  const days = Math.floor(
    totalMinutes / 1440
  );

  const hours = Math.floor(
    (totalMinutes % 1440) / 60
  );

  const minutes =
    totalMinutes % 60;

  if (days > 0) {
    return `${days}d ${hours}h left`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m left`;
  }

  return `${Math.max(minutes, 1)}m left`;
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
    title="View on eBay"
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

const ListingSkeleton = () => (
  <div className="grid grid-cols-2 items-stretch gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
    {[...Array(12)].map((_, index) => (
      <div
        key={index}
        className="h-full animate-pulse rounded-[1.25rem] border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:rounded-[2rem] md:p-5"
      >
        <div className="aspect-[4/3] rounded-[1rem] bg-slate-100 dark:bg-slate-950/40 md:rounded-[1.5rem]" />

        <div className="mt-4 space-y-2">
          <div className="h-3 w-4/5 rounded bg-slate-100 dark:bg-slate-800" />

          <div className="h-3 w-3/5 rounded bg-slate-100 dark:bg-slate-800" />

          <div className="h-3 w-2/5 rounded bg-slate-100 dark:bg-slate-800" />

          <div className="pt-3">
            <div className="h-7 w-full rounded bg-slate-100 dark:bg-slate-800" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

function ListingCard({
  item,
  section,
}: {
  item: EbayShopListing;
  section: EbayShopSection;
}) {
  const listingUrl =
    typeof item?.url === "string"
      ? item.url.trim()
      : "";

  const title =
    typeof item?.title === "string" &&
    item.title.trim()
      ? item.title.trim()
      : "eBay trading card listing";

  const image =
    typeof item?.image === "string"
      ? item.image.trim()
      : "";

  const configuration =
    getSectionConfiguration(section);

  const isAuction =
    configuration?.isAuction ?? false;

  const timeRemaining = isAuction
    ? formatTimeRemaining(
        item?.itemEndDate
      )
    : null;

  if (!listingUrl) {
    return null;
  }

  return (
    <a
      href={listingUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="group block h-full min-w-0"
      aria-label={`View ${title} on eBay`}
    >
      <article className="relative flex h-full min-w-0 flex-col overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#00BA88]/40 hover:shadow-2xl hover:shadow-[#00BA88]/10 active:scale-[0.98] dark:border-slate-800 dark:bg-slate-900 md:rounded-[2rem] md:p-5">
        <div className="relative mb-3 flex aspect-[4/3] w-full shrink-0 items-center justify-center overflow-hidden rounded-[1rem] border border-slate-100 bg-slate-50 p-2 dark:border-slate-800/50 dark:bg-slate-950/40 md:mb-5 md:rounded-[1.5rem] md:p-3">
          {isAuction && (
            <div className="absolute left-2 top-2 z-10 flex items-center gap-1 rounded-full border border-white/70 bg-white/95 px-2 py-1 text-[9px] font-black uppercase tracking-wide text-slate-700 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-950/90 dark:text-slate-200 md:left-3 md:top-3 md:text-[10px]">
              <Clock
                size={11}
                className="text-[#00BA88]"
              />

              Auction
            </div>
          )}

          {image ? (
            <img
              src={image}
              alt={title}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-contain drop-shadow-sm transition-transform duration-500 ease-out group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center px-3 text-center text-xs font-black text-slate-400">
              No Image
            </div>
          )}
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <h3
            className={cn(
              "line-clamp-3 text-[12px] font-bold leading-snug text-slate-900 transition-colors group-hover:text-[#00BA88] dark:text-white md:text-sm",
              "min-h-[3.75rem] md:min-h-[4.125rem]"
            )}
            title={title}
          >
            {title}
          </h3>

          {timeRemaining && (
            <div className="mt-2 flex items-center gap-1.5 text-[10px] font-extrabold text-slate-500 dark:text-slate-400 md:text-xs">
              <Clock
                size={12}
                className="text-[#00BA88]"
              />

              {timeRemaining}
            </div>
          )}

          <div className="mt-auto pt-3 md:pt-4">
            <div className="flex min-h-9 items-center justify-between gap-3 border-t border-slate-100 pt-3 dark:border-slate-800">
              <p className="min-w-0 truncate text-[13px] font-extrabold text-slate-900 dark:text-white md:text-[15px]">
                {formatPrice(
                  item?.formattedPrice
                )}
              </p>

              <EbayLogo className="text-[18px] transition-transform duration-300 group-hover:scale-105 md:text-[21px]" />
            </div>
          </div>
        </div>
      </article>
    </a>
  );
}

export default function EbayShopClient({
  initialSection,
  initialListings,
}: {
  initialSection: EbayShopSection;
  initialListings: EbayShopResponse;
}) {
  const [section, setSection] =
    useState<EbayShopSection>(
      initialSection
    );

  const [sort, setSort] =
    useState<EbayShopSort>(
      getSectionConfiguration(
        initialSection
      )?.defaultSort ?? "best_match"
    );

  const [search, setSearch] =
    useState("");

  const [
    listingsBySection,
    setListingsBySection,
  ] = useState<ListingsBySection>(() =>
    createInitialListingsMap(
      initialSection,
      initialListings
    )
  );

  const [
    loadingBySection,
    setLoadingBySection,
  ] = useState<LoadingBySection>(
    createInitialLoadingMap
  );

  const [isFocused, setIsFocused] =
    useState(false);

  const [, startTransition] =
    useTransition();

  const [
    suggestions,
    setSuggestions,
  ] = useState<any[]>([]);

  const [
    isLoadingSuggestions,
    setIsLoadingSuggestions,
  ] = useState(false);

  const [
    showSuggestions,
    setShowSuggestions,
  ] = useState(false);

  const [
    recentSearches,
    setRecentSearches,
  ] = useState<string[]>([]);

  const [
    showRecentDropdown,
    setShowRecentDropdown,
  ] = useState(false);

  const requestIdRef = useRef(0);

  const hasLoadedAllSectionsRef =
    useRef(false);

  const activeSectionConfiguration =
    useMemo(
      () =>
        getSectionConfiguration(
          section
        ),
      [section]
    );

  const sortOptions =
    activeSectionConfiguration?.isAuction
      ? AUCTION_SORT_OPTIONS
      : STANDARD_SORT_OPTIONS;

  const orderedSections = useMemo(() => {
    const selectedSection =
      SHOP_SECTIONS.find(
        (item) => item.id === section
      );

    const remainingSections =
      SHOP_SECTIONS.filter(
        (item) => item.id !== section
      );

    return selectedSection
      ? [
          selectedSection,
          ...remainingSections,
        ]
      : SHOP_SECTIONS;
  }, [section]);

  const saveRecentSearch = (
    value: string
  ) => {
    const cleanValue = value.trim();

    if (cleanValue.length < 2) {
      return;
    }

    setRecentSearches(
      (previousSearches) => {
        const nextSearches = [
          cleanValue,
          ...previousSearches.filter(
            (item) =>
              item.toLowerCase() !==
              cleanValue.toLowerCase()
          ),
        ].slice(0, 8);

        try {
          localStorage.setItem(
            SHOP_RECENT_SEARCH_KEY,
            JSON.stringify(nextSearches)
          );
        } catch {
          // Storage may be unavailable.
        }

        return nextSearches;
      }
    );
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);

    try {
      localStorage.removeItem(
        SHOP_RECENT_SEARCH_KEY
      );
    } catch {
      // Storage may be unavailable.
    }
  };

  const loadAllListings = ({
    nextSearch = search,
    nextSort = sort,
  }: {
    nextSearch?: string;
    nextSort?: EbayShopSort;
  } = {}) => {
    const cleanSearch =
      nextSearch.trim();

    const currentRequestId =
      ++requestIdRef.current;

    setLoadingBySection(
      createAllLoadingMap()
    );

    startTransition(async () => {
      const requests =
        SHOP_SECTIONS.map(
          async (shopSection) => {
            const sectionSort =
              getSectionSort(
                shopSection.id,
                nextSort
              );

            try {
              const data =
                await fetchEbayShopListings(
                  {
                    section:
                      shopSection.id,
                    search: cleanSearch,
                    sort: sectionSort,
                    limit: 24,
                    offset: 0,
                  }
                );

              return {
                sectionId:
                  shopSection.id,
                data:
                  data ||
                  createEmptyListings(),
              };
            } catch (error) {
              console.error(
                `Failed to load ${shopSection.id} listings:`,
                error
              );

              return {
                sectionId:
                  shopSection.id,
                data:
                  createEmptyListings(),
              };
            }
          }
        );

      const results =
        await Promise.all(requests);

      if (
        currentRequestId !==
        requestIdRef.current
      ) {
        return;
      }

      setListingsBySection(
        (previous) => {
          const next = {
            ...previous,
          };

          results.forEach(
            (result) => {
              next[result.sectionId] =
                result.data;
            }
          );

          return next;
        }
      );

      setLoadingBySection(
        createInitialLoadingMap()
      );

      hasLoadedAllSectionsRef.current =
        true;
    });
  };

  const runShopSearch = (
    value: string
  ) => {
    const cleanValue = value.trim();

    if (cleanValue.length >= 2) {
      saveRecentSearch(cleanValue);
    }

    setSearch(cleanValue);
    setShowSuggestions(false);
    setShowRecentDropdown(false);

    loadAllListings({
      nextSearch: cleanValue,
      nextSort: sort,
    });
  };

  const handleSectionChange = (
    nextSection: EbayShopSection
  ) => {
    const configuration =
      getSectionConfiguration(
        nextSection
      );

    const nextSort =
      configuration?.defaultSort ??
      "best_match";

    setSection(nextSection);
    setSort(nextSort);

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(
        () => {
          const productsContainer =
            document.getElementById(
              "shop-products-container"
            );

          productsContainer?.scrollIntoView(
            {
              behavior: "smooth",
              block: "start",
            }
          );
        }
      );
    });
  };

  const handleSearch = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    runShopSearch(search);
  };

  const handleSortChange = (
    label: string
  ) => {
    const selectedSort =
      getSortIdFromLabel(label);

    const nextSort =
      getSectionSort(
        section,
        selectedSort
      );

    setSort(nextSort);

    loadAllListings({
      nextSearch: search,
      nextSort,
    });
  };

  const handleClearSearch = () => {
    setSearch("");
    setSuggestions([]);
    setShowSuggestions(false);
    setShowRecentDropdown(true);

    loadAllListings({
      nextSearch: "",
      nextSort: sort,
    });
  };

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(
          SHOP_RECENT_SEARCH_KEY
        );

      if (saved) {
        const parsed =
          JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setRecentSearches(
            parsed
              .filter(
                (
                  item
                ): item is string =>
                  typeof item ===
                  "string"
              )
              .slice(0, 8)
          );
        }
      }
    } catch {
      setRecentSearches([]);
    }
  }, []);

  useEffect(() => {
    if (
      hasLoadedAllSectionsRef.current
    ) {
      return;
    }

    loadAllListings({
      nextSearch: "",
      nextSort: "best_match",
    });

    // Initial all-section load only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const trimmed = search.trim();

    if (trimmed.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsLoadingSuggestions(false);
      return;
    }

    let cancelled = false;

    const timer =
      window.setTimeout(
        async () => {
          setIsLoadingSuggestions(true);

          try {
            const data =
              await fetchSearchSuggestions(
                trimmed,
                "pokemon",
                8
              );

            if (!cancelled) {
              setSuggestions(
                Array.isArray(data)
                  ? data
                  : []
              );

              setShowSuggestions(true);
              setShowRecentDropdown(
                false
              );
            }
          } catch {
            if (!cancelled) {
              setSuggestions([]);
            }
          } finally {
            if (!cancelled) {
              setIsLoadingSuggestions(
                false
              );
            }
          }
        },
        220
      );

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [search]);

  return (
    <div className="animate-in space-y-5 fade-in duration-700 md:space-y-8">
      <header className="flex flex-col items-center space-y-5 text-center md:space-y-3">
        <ShoppingCart
          className="h-9 w-9 text-[#00BA88] drop-shadow-[0_0_24px_rgba(0,186,136,0.35)] md:h-11 md:w-11"
          strokeWidth={1.9}
        />

        <h1 className="text-3xl font-black leading-tight tracking-tight text-slate-900 dark:text-white md:text-5xl">
          CardMarketCap{" "}
          <span className="text-[#00BA88]">
            Shop
          </span>
        </h1>

        <p className="max-w-2xl text-xs text-slate-500 dark:text-slate-400 md:text-base">
          Browse real card listings across
          graded Buy Now, graded auctions,
          singles Buy Now, singles auctions and
          sealed products.
        </p>
      </header>

      <form
        onSubmit={handleSearch}
        className="group relative mx-auto w-full max-w-3xl"
      >
        <div
          className={cn(
            "absolute -inset-2 rounded-[2rem] bg-[#00BA88]/10 blur-xl transition-all duration-500 dark:opacity-100",
            isFocused
              ? "opacity-100"
              : "opacity-0"
          )}
        />

        <div
          className={cn(
            "relative flex items-center overflow-hidden rounded-2xl border-2 bg-white p-1.5 transition-all duration-300 dark:bg-slate-950",
            isFocused
              ? "border-[#00BA88] shadow-2xl shadow-[#00BA88]/20"
              : "border-[#00BA88]/60"
          )}
        >
          <div className="flex w-full items-center px-3 md:px-4">
            <SparklesIcon
              size={22}
              className={cn(
                "shrink-0",
                isFocused
                  ? "text-[#00BA88]"
                  : "text-slate-400"
              )}
            />

            <input
              type="text"
              value={search}
              autoComplete="off"
              onBlur={() => {
                window.setTimeout(
                  () => {
                    setIsFocused(false);
                  },
                  150
                );
              }}
              onFocus={() => {
                setIsFocused(true);

                if (
                  search.trim().length >= 2
                ) {
                  setShowSuggestions(true);
                  setShowRecentDropdown(
                    false
                  );
                } else {
                  setShowRecentDropdown(true);
                  setShowSuggestions(false);
                }
              }}
              onChange={(event) => {
                const value =
                  event.target.value;

                setSearch(value);

                if (
                  value.trim().length >= 2
                ) {
                  setShowSuggestions(true);
                  setShowRecentDropdown(
                    false
                  );
                } else {
                  setShowSuggestions(false);
                  setShowRecentDropdown(
                    true
                  );
                }
              }}
              placeholder='Try: "Charizard PSA 10"'
              className="w-full border-none bg-transparent px-3 py-1.5 text-sm font-bold text-slate-900 outline-none focus:ring-0 dark:text-white md:text-base"
            />
          </div>

          <div className="flex items-center gap-2">
            {search && (
              <button
                type="button"
                onClick={
                  handleClearSearch
                }
                className="p-2 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Clear search"
              >
                <X size={20} />
              </button>
            )}

            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-[#00BA88] p-3 text-white shadow-lg shadow-[#00BA88]/20 transition-all duration-200 hover:bg-[#00a377] md:px-6"
            >
              <Search
                size={18}
                strokeWidth={3}
              />

              <span className="hidden text-xs font-black uppercase tracking-wider md:block">
                Search
              </span>
            </button>
          </div>
        </div>

        {showSuggestions &&
          isFocused &&
          search.trim().length >= 2 && (
            <div className="animate-in absolute left-0 right-0 top-full z-[90] mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-2xl shadow-slate-900/10 duration-200 fade-in slide-in-from-top-2 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/30">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Search
                    size={15}
                    className="text-[#00BA88]"
                  />

                  <span className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Search Suggestions
                  </span>
                </div>

                {isLoadingSuggestions && (
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <Loader2
                      size={12}
                      className="animate-spin"
                    />

                    Loading
                  </div>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto p-2">
                {suggestions.length >
                0 ? (
                  suggestions.map(
                    (item, index) => {
                      const value =
                        item?.label ||
                        item?.name ||
                        "";

                      if (!value) {
                        return null;
                      }

                      return (
                        <button
                          key={`${
                            item?.id ||
                            index
                          }-${value}`}
                          type="button"
                          onMouseDown={(
                            event
                          ) => {
                            event.preventDefault();

                            setSearch(value);

                            runShopSearch(
                              value
                            );
                          }}
                          className="group flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-900"
                        >
                          <span className="truncate text-sm font-bold text-slate-700 transition-colors group-hover:text-[#00BA88] dark:text-slate-200 md:text-base">
                            {value}
                          </span>

                          <span className="shrink-0 text-[10px] font-black uppercase tracking-widest text-slate-300 transition-colors group-hover:text-[#00BA88] dark:text-slate-600">
                            Search
                          </span>
                        </button>
                      );
                    }
                  )
                ) : !isLoadingSuggestions ? (
                  <div className="px-4 py-8 text-center">
                    <p className="text-sm font-bold text-slate-500">
                      No suggestions
                      found.
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          )}

        {showRecentDropdown &&
          isFocused &&
          search.trim().length < 2 &&
          recentSearches.length > 0 && (
            <div className="animate-in absolute left-0 right-0 top-full z-[80] mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-2xl shadow-slate-900/10 duration-200 fade-in slide-in-from-top-2 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/30">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Clock
                    size={15}
                    className="text-[#00BA88]"
                  />

                  <span className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Previous Searches
                  </span>
                </div>

                <button
                  type="button"
                  onMouseDown={(
                    event
                  ) => {
                    event.preventDefault();
                    clearRecentSearches();
                  }}
                  className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 transition-colors hover:text-red-500"
                >
                  <Trash2 size={12} />

                  Clear
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto p-2">
                {recentSearches.map(
                  (item) => (
                    <button
                      key={item}
                      type="button"
                      onMouseDown={(
                        event
                      ) => {
                        event.preventDefault();

                        setSearch(item);

                        runShopSearch(
                          item
                        );
                      }}
                      className="group flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-900"
                    >
                      <span className="truncate text-sm font-bold text-slate-700 transition-colors group-hover:text-[#00BA88] dark:text-slate-200 md:text-base">
                        {item}
                      </span>

                      <span className="shrink-0 text-[10px] font-black uppercase tracking-widest text-slate-300 transition-colors group-hover:text-[#00BA88] dark:text-slate-600">
                        Search
                      </span>
                    </button>
                  )
                )}
              </div>
            </div>
          )}
      </form>

      <section className="flex gap-2 overflow-x-auto pb-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden lg:justify-center lg:pb-2">
        {SHOP_SECTIONS.map((item) => {
          const Icon = item.icon;

          const isActive =
            section === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                handleSectionChange(
                  item.id
                )
              }
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 transition-all",
                isActive
                  ? "border-[#00BA88] bg-[#00BA88]/10 text-[#00BA88]"
                  : "border-slate-200 bg-white text-slate-500 hover:border-[#00BA88]/70 dark:border-slate-800 dark:bg-slate-950"
              )}
            >
              <Icon size={15} />

              <span className="text-xs font-black">
                {item.shortLabel}
              </span>
            </button>
          );
        })}
      </section>

      <div
        id="shop-products-container"
        className="space-y-14 scroll-mt-24 md:space-y-20"
      >
        {orderedSections.map(
          (
            shopSection,
            sectionIndex
          ) => {
            const Icon =
              shopSection.icon;

            const listings =
              listingsBySection[
                shopSection.id
              ] ||
              createEmptyListings();

            const items =
              Array.isArray(
                listings?.results
              )
                ? listings.results
                : [];

            const isLoading =
              loadingBySection[
                shopSection.id
              ];

            const sectionSort =
              getSectionSort(
                shopSection.id,
                sort
              );

            const sectionSortOptions =
              shopSection.isAuction
                ? AUCTION_SORT_OPTIONS
                : STANDARD_SORT_OPTIONS;

            return (
              <section
                key={shopSection.id}
                id={`shop-section-${shopSection.id}`}
                className="space-y-5 md:space-y-8"
              >
                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="flex items-center gap-2 text-xl font-black text-slate-950 dark:text-white md:text-3xl">
                        {sectionIndex ===
                        0 ? (
                          <SparklesIcon className="h-5 w-5 text-[#00BA88]" />
                        ) : (
                          <Icon className="h-5 w-5 text-[#00BA88]" />
                        )}

                        {shopSection.label}
                      </h2>

                      {shopSection.isAuction ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-amber-700 dark:bg-amber-500/10 dark:text-amber-300 md:text-[10px]">
                          <Clock
                            size={11}
                          />

                          Ending soon
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 md:text-[10px]">
                          <BadgeDollarSign
                            size={11}
                          />

                          Buy now
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 md:pl-7 md:text-sm">
                      {search.trim() &&
                      listings?.resolvedQuery
                        ? `Showing matches for "${search.trim()}"`
                        : shopSection.description}
                    </p>
                  </div>

                  {sectionIndex === 0 && (
                    <CustomDropdown
                      value={
                        SORT_LABELS[
                          sectionSort
                        ]
                      }
                      options={
                        sectionSortOptions
                      }
                      onChange={
                        handleSortChange
                      }
                      className="md:w-[180px]"
                    />
                  )}
                </div>

                {isLoading ? (
                  <ListingSkeleton />
                ) : items.length > 0 ? (
                  <div className="grid grid-cols-2 items-stretch gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                    {items.map(
                      (
                        item,
                        itemIndex
                      ) => (
                        <ListingCard
                          key={
                            item?.id ||
                            item?.itemId ||
                            `${shopSection.id}-${itemIndex}`
                          }
                          item={item}
                          section={
                            shopSection.id
                          }
                        />
                      )
                    )}
                  </div>
                ) : (
                  <div className="rounded-3xl border border-dashed border-slate-200 py-24 text-center dark:border-slate-800">
                    <p className="text-sm font-black text-slate-500">
                      No{" "}
                      {shopSection.label.toLowerCase()}{" "}
                      listings found.
                    </p>

                    <p className="mx-auto mt-2 max-w-md px-4 text-xs text-slate-400">
                      Try searching with a
                      specific card name, card
                      number, set or grade.
                    </p>
                  </div>
                )}
              </section>
            );
          }
        )}
      </div>
    </div>
  );
}