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
} from "lucide-react";

import { cn } from "@/lib/utils";
import CustomDropdown from "@/components/CustomDropdown";

import {
  EbayShopSection,
  EbayShopSort,
  fetchEbayShopListings,
} from "@/lib/queries/ebay";

import { fetchSearchSuggestions } from "@/lib/queries/search";

const SHOP_RECENT_SEARCH_KEY = "cmc_shop_recent_searches";

const SHOP_SECTIONS: {
  id: EbayShopSection;
  label: string;
  description: string;
  icon: any;
}[] = [
  {
    id: "graded",
    label: "Graded",
    description: "PSA, CGC and graded cards.",
    icon: ShieldCheck,
  },
  {
    id: "raw",
    label: "Singles",
    description: "Ungraded singles.",
    icon: ShoppingBag,
  },
  {
    id: "sealed",
    label: "Sealed",
    description: "Boxes, packs and ETBs.",
    icon: Package,
  },
  {
    id: "auction",
    label: "Auctions",
    description: "Ending soon.",
    icon: Clock,
  },
];

const SORT_LABELS: Record<EbayShopSort, string> = {
  best_match: "Best Match",
  ending_soon: "Ending Soon",
  newly_listed: "Newly Listed",
  price_asc: "Price Low",
  price_desc: "Price High",
};

const SORT_OPTIONS = Object.values(SORT_LABELS);

type ListingsBySection = Record<EbayShopSection, any>;

type LoadingBySection = Record<EbayShopSection, boolean>;

const createEmptyListings = () => ({
  results: [],
  total: 0,
  resolvedQuery: "",
});

const createInitialListingsMap = (
  initialSection: EbayShopSection,
  initialListings: any
): ListingsBySection => ({
  graded:
    initialSection === "graded"
      ? initialListings
      : createEmptyListings(),

  raw:
    initialSection === "raw"
      ? initialListings
      : createEmptyListings(),

  sealed:
    initialSection === "sealed"
      ? initialListings
      : createEmptyListings(),

  auction:
    initialSection === "auction"
      ? initialListings
      : createEmptyListings(),
});

const createInitialLoadingMap = (): LoadingBySection => ({
  graded: false,
  raw: false,
  sealed: false,
  auction: false,
});

const createAllLoadingMap = (): LoadingBySection => ({
  graded: true,
  raw: true,
  sealed: true,
  auction: true,
});

const getSortIdFromLabel = (
  label: string
): EbayShopSort => {
  const found = Object.entries(SORT_LABELS).find(
    ([, value]) => value === label
  );

  return (found?.[0] as EbayShopSort) || "best_match";
};

const formatPrice = (formattedPrice?: string) => {
  if (!formattedPrice) {
    return "N/A";
  }

  return formattedPrice.replace(/^USD\s*/i, "$");
};

/**
 * Inline eBay wordmark.
 *
 * This avoids needing an image file, external asset or
 * additional package while remaining sharp on every screen.
 */
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
    <span className="text-[#E53238]">e</span>
    <span className="text-[#0064D2]">b</span>
    <span className="text-[#F5AF02]">a</span>
    <span className="text-[#86B817]">y</span>
  </span>
);

const ListingSkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-4 items-stretch">
    {[...Array(12)].map((_, index) => (
      <div
        key={index}
        className="h-full rounded-[1.25rem] md:rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 md:p-5 shadow-sm animate-pulse"
      >
        <div className="aspect-[4/3] rounded-[1rem] md:rounded-[1.5rem] bg-slate-100 dark:bg-slate-950/40" />

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

function ListingCard({ item }: { item: any }) {
  const listingUrl =
    typeof item?.url === "string"
      ? item.url.trim()
      : "";

  const title =
    typeof item?.title === "string" && item.title.trim()
      ? item.title.trim()
      : "eBay trading card listing";

  const image =
    typeof item?.image === "string"
      ? item.image.trim()
      : "";

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

          <div className="mt-auto pt-3 md:pt-4">
            <div className="flex min-h-9 items-center justify-between gap-3 border-t border-slate-100 pt-3 dark:border-slate-800">
              <p className="min-w-0 truncate text-[13px] font-extrabold text-slate-900 dark:text-white md:text-[15px]">
                {formatPrice(item?.formattedPrice)}
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
  initialListings: any;
}) {
  const [section, setSection] =
    useState<EbayShopSection>(initialSection);

  const [sort, setSort] = useState<EbayShopSort>(
    initialSection === "auction"
      ? "ending_soon"
      : "best_match"
  );

  const [search, setSearch] = useState("");

  const [listingsBySection, setListingsBySection] =
    useState<ListingsBySection>(() =>
      createInitialListingsMap(
        initialSection,
        initialListings
      )
    );

  const [loadingBySection, setLoadingBySection] =
    useState<LoadingBySection>(
      createInitialLoadingMap
    );

  const [isFocused, setIsFocused] = useState(false);

  const [, startTransition] = useTransition();

  const [suggestions, setSuggestions] = useState<any[]>(
    []
  );

  const [
    isLoadingSuggestions,
    setIsLoadingSuggestions,
  ] = useState(false);

  const [showSuggestions, setShowSuggestions] =
    useState(false);

  const [recentSearches, setRecentSearches] =
    useState<string[]>([]);

  const [
    showRecentDropdown,
    setShowRecentDropdown,
  ] = useState(false);

  const requestIdRef = useRef(0);
  const hasLoadedAllSectionsRef = useRef(false);

  /**
   * The selected category is moved to the top.
   * Every other category remains rendered underneath.
   */
  const orderedSections = useMemo(() => {
    const selectedSection = SHOP_SECTIONS.find(
      (item) => item.id === section
    );

    const remainingSections = SHOP_SECTIONS.filter(
      (item) => item.id !== section
    );

    return selectedSection
      ? [selectedSection, ...remainingSections]
      : SHOP_SECTIONS;
  }, [section]);

  const saveRecentSearch = (value: string) => {
    const cleanValue = value.trim();

    if (cleanValue.length < 2) {
      return;
    }

    setRecentSearches((previousSearches) => {
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
        // Local storage can be unavailable in some browsers.
      }

      return nextSearches;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);

    try {
      localStorage.removeItem(
        SHOP_RECENT_SEARCH_KEY
      );
    } catch {
      // Local storage can be unavailable in some browsers.
    }
  };

  const loadAllListings = ({
    nextSearch = search,
    nextSort = sort,
  }: {
    nextSearch?: string;
    nextSort?: EbayShopSort;
  } = {}) => {
    const cleanSearch = nextSearch.trim();
    const currentRequestId = ++requestIdRef.current;

    setLoadingBySection(createAllLoadingMap());

    startTransition(async () => {
      const requests = SHOP_SECTIONS.map(
        async (shopSection) => {
          const sectionSort: EbayShopSort =
            shopSection.id === "auction"
              ? "ending_soon"
              : nextSort;

          try {
            const data =
              await fetchEbayShopListings({
                section: shopSection.id,
                search: cleanSearch,
                sort: sectionSort,
                limit: 24,
                offset: 0,
              });

            return {
              sectionId: shopSection.id,
              data:
                data || createEmptyListings(),
            };
          } catch (error) {
            console.error(
              `Failed to load ${shopSection.id} listings:`,
              error
            );

            return {
              sectionId: shopSection.id,
              data: createEmptyListings(),
            };
          }
        }
      );

      const results = await Promise.all(requests);

      if (
        currentRequestId !== requestIdRef.current
      ) {
        return;
      }

      setListingsBySection((previous) => {
        const next = { ...previous };

        results.forEach((result) => {
          next[result.sectionId] = result.data;
        });

        return next;
      });

      setLoadingBySection(
        createInitialLoadingMap()
      );

      hasLoadedAllSectionsRef.current = true;
    });
  };

  const runShopSearch = (value: string) => {
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
    setSection(nextSection);

    /**
     * Allow React to reorder the sections before scrolling
     * the product container back into view.
     */
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const productsContainer =
          document.getElementById(
            "shop-products-container"
          );

        productsContainer?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    });
  };

  const handleSearch = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    runShopSearch(search);
  };

  const handleSortChange = (label: string) => {
    const nextSort =
      getSortIdFromLabel(label);

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
      const saved = localStorage.getItem(
        SHOP_RECENT_SEARCH_KEY
      );

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setRecentSearches(
            parsed
              .filter(
                (item): item is string =>
                  typeof item === "string"
              )
              .slice(0, 8)
          );
        }
      }
    } catch {
      setRecentSearches([]);
    }
  }, []);

  /**
   * Load all shop sections after the server-provided
   * initial section has rendered.
   */
  useEffect(() => {
    if (hasLoadedAllSectionsRef.current) {
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

    const timer = window.setTimeout(async () => {
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
            Array.isArray(data) ? data : []
          );

          setShowSuggestions(true);
          setShowRecentDropdown(false);
        }
      } catch {
        if (!cancelled) {
          setSuggestions([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingSuggestions(false);
        }
      }
    }, 220);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [search]);

  return (
    <div className="space-y-5 md:space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col items-center text-center space-y-5 md:space-y-3">
        <ShoppingCart
          className="h-9 w-9 md:h-11 md:w-11 text-[#00BA88] drop-shadow-[0_0_24px_rgba(0,186,136,0.35)]"
          strokeWidth={1.9}
        />

        <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          CardMarketCap{" "}
          <span className="text-[#00BA88]">
            Shop
          </span>
        </h1>

        <p className="text-slate-500 dark:text-slate-400 text-xs md:text-base max-w-2xl">
          Browse live listings across graded cards,
          singles, sealed products and auctions ending
          soon.
        </p>
      </header>

      <form
        onSubmit={handleSearch}
        className="relative w-full max-w-3xl mx-auto group"
      >
        <div
          className={cn(
            "absolute -inset-2 bg-[#00BA88]/10 rounded-[2rem] blur-xl transition-all duration-500",
            "dark:opacity-100",
            isFocused
              ? "opacity-100"
              : "opacity-0"
          )}
        />

        <div
          className={cn(
            "relative flex items-center bg-white dark:bg-slate-950 border-2 transition-all duration-300 rounded-2xl overflow-hidden p-1.5",
            isFocused
              ? "border-[#00BA88] shadow-2xl shadow-[#00BA88]/20"
              : "border-[#00BA88]/60"
          )}
        >
          <div className="flex items-center w-full px-3 md:px-4">
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
                window.setTimeout(() => {
                  setIsFocused(false);
                }, 150);
              }}
              onFocus={() => {
                setIsFocused(true);

                if (
                  search.trim().length >= 2
                ) {
                  setShowSuggestions(true);
                  setShowRecentDropdown(false);
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
                  setShowRecentDropdown(false);
                } else {
                  setShowSuggestions(false);
                  setShowRecentDropdown(true);
                }
              }}
              placeholder='Try: "Charizard PSA 10"'
              className="w-full bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white text-sm md:text-base font-bold py-1.5 px-3 outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            {search && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                aria-label="Clear search"
              >
                <X size={20} />
              </button>
            )}

            <button
              type="submit"
              className="bg-[#00BA88] hover:bg-[#00a377] text-white p-3 md:px-6 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg shadow-[#00BA88]/20"
            >
              <Search
                size={18}
                strokeWidth={3}
              />

              <span className="hidden md:block font-black text-xs uppercase tracking-wider">
                Search
              </span>
            </button>
          </div>
        </div>

        {showSuggestions &&
          isFocused &&
          search.trim().length >= 2 && (
            <div className="absolute left-0 right-0 top-full z-[90] mt-3 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl shadow-slate-900/10 dark:shadow-black/30 text-left animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
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

              <div className="p-2 max-h-72 overflow-y-auto">
                {suggestions.length > 0 ? (
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
                            item?.id || index
                          }-${value}`}
                          type="button"
                          onMouseDown={(
                            event
                          ) => {
                            event.preventDefault();

                            setSearch(value);
                            runShopSearch(value);
                          }}
                          className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group"
                        >
                          <span className="truncate text-sm md:text-base font-bold text-slate-700 dark:text-slate-200 group-hover:text-[#00BA88] transition-colors">
                            {value}
                          </span>

                          <span className="shrink-0 text-[10px] font-black uppercase tracking-widest text-slate-300 dark:text-slate-600 group-hover:text-[#00BA88] transition-colors">
                            Search
                          </span>
                        </button>
                      );
                    }
                  )
                ) : !isLoadingSuggestions ? (
                  <div className="px-4 py-8 text-center">
                    <p className="text-sm font-bold text-slate-500">
                      No suggestions found.
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
            <div className="absolute left-0 right-0 top-full z-[80] mt-3 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl shadow-slate-900/10 dark:shadow-black/30 text-left animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
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
                  onMouseDown={(event) => {
                    event.preventDefault();
                    clearRecentSearches();
                  }}
                  className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={12} />
                  Clear
                </button>
              </div>

              <div className="p-2 max-h-72 overflow-y-auto">
                {recentSearches.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onMouseDown={(event) => {
                      event.preventDefault();

                      setSearch(item);
                      runShopSearch(item);
                    }}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group"
                  >
                    <span className="truncate text-sm md:text-base font-bold text-slate-700 dark:text-slate-200 group-hover:text-[#00BA88] transition-colors">
                      {item}
                    </span>

                    <span className="shrink-0 text-[10px] font-black uppercase tracking-widest text-slate-300 dark:text-slate-600 group-hover:text-[#00BA88] transition-colors">
                      Search
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
      </form>

      <section className="flex lg:justify-center gap-2 overflow-x-auto pb-8 lg:pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {SHOP_SECTIONS.map((item) => {
          const Icon = item.icon;
          const isActive =
            section === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                handleSectionChange(item.id)
              }
              className={cn(
                "shrink-0 flex items-center gap-2 rounded-full border px-4 py-2.5 transition-all",
                isActive
                  ? "border-[#00BA88] bg-[#00BA88]/10 text-[#00BA88]"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-500 hover:border-[#00BA88]/70"
              )}
            >
              <Icon size={15} />

              <span className="text-xs font-black">
                {item.label}
              </span>
            </button>
          );
        })}
      </section>

      <div
        id="shop-products-container"
        className="space-y-14 md:space-y-20 scroll-mt-24"
      >
        {orderedSections.map(
          (shopSection, sectionIndex) => {
            const Icon = shopSection.icon;

            const listings =
              listingsBySection[
                shopSection.id
              ] || createEmptyListings();

            const items = Array.isArray(
              listings?.results
            )
              ? listings.results
              : [];

            const isLoading =
              loadingBySection[
                shopSection.id
              ];

            return (
              <section
                key={shopSection.id}
                id={`shop-section-${shopSection.id}`}
                className="space-y-5 md:space-y-8"
              >
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
                  <div className="space-y-1">
                    <h2 className="text-xl md:text-3xl font-black text-slate-950 dark:text-white flex items-center gap-2">
                      {sectionIndex === 0 ? (
                        <SparklesIcon className="h-5 w-5 text-[#00BA88]" />
                      ) : (
                        <Icon className="h-5 w-5 text-[#00BA88]" />
                      )}

                      {shopSection.label}
                    </h2>

                    <p className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 md:pl-7">
                      {listings?.resolvedQuery
                        ? `Showing results for "${listings.resolvedQuery}"`
                        : shopSection.description}
                    </p>
                  </div>

                  {sectionIndex === 0 && (
                    <CustomDropdown
                      value={
                        SORT_LABELS[sort]
                      }
                      options={SORT_OPTIONS}
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
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-4 items-stretch">
                    {items.map(
                      (
                        item: any,
                        itemIndex: number
                      ) => (
                        <ListingCard
                          key={
                            item?.id ||
                            item?.itemId ||
                            `${shopSection.id}-${itemIndex}`
                          }
                          item={item}
                        />
                      )
                    )}
                  </div>
                ) : (
                  <div className="py-24 text-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                    <p className="text-sm font-black text-slate-500">
                      No{" "}
                      {shopSection.label.toLowerCase()}{" "}
                      listings found.
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