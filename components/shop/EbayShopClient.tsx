"use client";

import React, { useMemo, useState, useTransition, useEffect } from "react";
import {
  Search,
  ShoppingBag,
  ShoppingCart,
  ShieldCheck,
  Package,
  Clock,
  SparklesIcon,
  X,
  ArrowUpRight,
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
  { id: "graded", label: "Graded", description: "PSA, CGC and graded cards.", icon: ShieldCheck },
  { id: "raw", label: "Raw", description: "Ungraded singles.", icon: ShoppingBag },
  { id: "sealed", label: "Sealed", description: "Boxes, packs and ETBs.", icon: Package },
  { id: "auction", label: "Auctions", description: "Ending soon.", icon: Clock },
];

const SORT_LABELS: Record<EbayShopSort, string> = {
  best_match: "Best Match",
  ending_soon: "Ending Soon",
  newly_listed: "Newly Listed",
  price_asc: "Price Low",
  price_desc: "Price High",
};

const SORT_OPTIONS = Object.values(SORT_LABELS);

const getSortIdFromLabel = (label: string): EbayShopSort => {
  const found = Object.entries(SORT_LABELS).find(([, value]) => value === label);
  return (found?.[0] as EbayShopSort) || "best_match";
};

const ListingSkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-4">
    {[...Array(12)].map((_, index) => (
      <div
        key={index}
        className="rounded-[1.25rem] md:rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 md:p-5 shadow-sm animate-pulse"
      >
        <div className="aspect-[4/3] rounded-[1rem] md:rounded-[1.5rem] bg-slate-100 dark:bg-slate-950/40" />
        <div className="mt-4 space-y-2">
          <div className="h-3 w-4/5 rounded bg-slate-100 dark:bg-slate-800" />
          <div className="h-3 w-2/5 rounded bg-slate-100 dark:bg-slate-800" />
          <div className="h-8 w-full rounded-xl bg-slate-100 dark:bg-slate-800" />
        </div>
      </div>
    ))}
  </div>
);

export default function EbayShopClient({
  initialSection,
  initialListings,
}: {
  initialSection: EbayShopSection;
  initialListings: any;
}) {
  const [section, setSection] = useState<EbayShopSection>(initialSection);
  const [sort, setSort] = useState<EbayShopSort>(
    initialSection === "auction" ? "ending_soon" : "best_match"
  );
  const [search, setSearch] = useState("");
  const [listings, setListings] = useState(initialListings);
  const [isFocused, setIsFocused] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showRecentDropdown, setShowRecentDropdown] = useState(false);

  const items = listings?.results || [];

  const activeSection = useMemo(
    () => SHOP_SECTIONS.find((item) => item.id === section) || SHOP_SECTIONS[0],
    [section]
  );

  const saveRecentSearch = (value: string) => {
    const cleanValue = value.trim();
    if (cleanValue.length < 2) return;

    setRecentSearches((prev) => {
      const next = [
        cleanValue,
        ...prev.filter((item) => item.toLowerCase() !== cleanValue.toLowerCase()),
      ].slice(0, 8);

      localStorage.setItem(SHOP_RECENT_SEARCH_KEY, JSON.stringify(next));
      return next;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem(SHOP_RECENT_SEARCH_KEY);
  };

  const loadListings = ({
    nextSection = section,
    nextSearch = search,
    nextSort = sort,
  }: {
    nextSection?: EbayShopSection;
    nextSearch?: string;
    nextSort?: EbayShopSort;
  }) => {
    startTransition(async () => {
      const data = await fetchEbayShopListings({
        section: nextSection,
        search: nextSearch,
        sort: nextSection === "auction" ? "ending_soon" : nextSort,
        limit: 24,
        offset: 0,
      });

      setListings(data);
    });
  };

  const runShopSearch = (value: string) => {
    const cleanValue = value.trim();
    if (cleanValue.length >= 2) saveRecentSearch(cleanValue);

    setShowSuggestions(false);
    setShowRecentDropdown(false);
    loadListings({ nextSearch: cleanValue });
  };

  const handleSectionChange = (nextSection: EbayShopSection) => {
    const nextSort = nextSection === "auction" ? "ending_soon" : sort;
    setSection(nextSection);
    setSort(nextSort);
    loadListings({ nextSection, nextSort });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    runShopSearch(search);
  };

  const handleSortChange = (label: string) => {
    const nextSort = getSortIdFromLabel(label);
    setSort(nextSort);
    loadListings({ nextSort });
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SHOP_RECENT_SEARCH_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed.filter((item) => typeof item === "string"));
        }
      }
    } catch {
      setRecentSearches([]);
    }
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

    const timer = setTimeout(async () => {
      setIsLoadingSuggestions(true);

      try {
        const data = await fetchSearchSuggestions(trimmed, "pokemon", 8);

        if (!cancelled) {
          setSuggestions(data);
          setShowSuggestions(true);
          setShowRecentDropdown(false);
        }
      } catch {
        if (!cancelled) setSuggestions([]);
      } finally {
        if (!cancelled) setIsLoadingSuggestions(false);
      }
    }, 220);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [search]);

  return (
    <div className="space-y-5 md:space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col items-center text-center space-y-2 md:space-y-3">
        <ShoppingCart
          className="h-9 w-9 md:h-11 md:w-11 text-[#00BA88] drop-shadow-[0_0_24px_rgba(0,186,136,0.35)]"
          strokeWidth={1.9}
        />

        <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          CardMarketCap <span className="text-[#00BA88]">Shop</span>
        </h1>

        <p className="text-slate-500 dark:text-slate-400 text-xs md:text-base max-w-2xl">
          Browse live listings across graded cards, raw cards, sealed products and auctions ending soon.
        </p>
      </header>

      <form onSubmit={handleSearch} className="relative w-full max-w-3xl mx-auto group">
        <div
          className={cn(
            "absolute -inset-2 bg-[#00BA88]/10 rounded-[2rem] blur-xl transition-all duration-500",
            "dark:opacity-100",
            isFocused ? "opacity-100" : "opacity-0"
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
                isFocused ? "text-[#00BA88]" : "text-slate-400"
              )}
            />

            <input
              type="text"
              value={search}
              onBlur={() => setIsFocused(false)}
              onFocus={() => {
                setIsFocused(true);

                if (search.trim().length >= 2) {
                  setShowSuggestions(true);
                  setShowRecentDropdown(false);
                } else {
                  setShowRecentDropdown(true);
                  setShowSuggestions(false);
                }
              }}
              onChange={(e) => {
                const value = e.target.value;
                setSearch(value);

                if (value.trim().length >= 2) {
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
                onClick={() => {
                  setSearch("");
                  setSuggestions([]);
                  setShowSuggestions(false);
                  setShowRecentDropdown(true);
                  loadListings({ nextSearch: "" });
                }}
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
              <Search size={18} strokeWidth={3} />
              <span className="hidden md:block font-black text-xs uppercase tracking-wider">
                Search
              </span>
            </button>
          </div>
        </div>

        {showSuggestions && isFocused && search.trim().length >= 2 && (
          <div className="absolute left-0 right-0 top-full z-[90] mt-3 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl shadow-slate-900/10 dark:shadow-black/30 text-left animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Search size={15} className="text-[#00BA88]" />
                <span className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  Search Suggestions
                </span>
              </div>

              {isLoadingSuggestions && (
                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <Loader2 size={12} className="animate-spin" />
                  Loading
                </div>
              )}
            </div>

            <div className="p-2 max-h-72 overflow-y-auto">
              {suggestions.length > 0 ? (
                suggestions.map((item) => (
                  <button
                    key={`${item.id}-${item.label}`}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      const value = item.label || item.name || "";
                      setSearch(value);
                      runShopSearch(value);
                    }}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group"
                  >
                    <span className="truncate text-sm md:text-base font-bold text-slate-700 dark:text-slate-200 group-hover:text-[#00BA88] transition-colors">
                      {item.label}
                    </span>

                    <span className="shrink-0 text-[10px] font-black uppercase tracking-widest text-slate-300 dark:text-slate-600 group-hover:text-[#00BA88] transition-colors">
                      Search
                    </span>
                  </button>
                ))
              ) : (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm font-bold text-slate-500">
                    No suggestions found.
                  </p>
                </div>
              )}
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
                  <Clock size={15} className="text-[#00BA88]" />
                  <span className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Previous Searches
                  </span>
                </div>

                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
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
                    onMouseDown={(e) => {
                      e.preventDefault();
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

      <section className="flex lg:justify-center gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {SHOP_SECTIONS.map((item) => {
          const Icon = item.icon;
          const isActive = section === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleSectionChange(item.id)}
              className={cn(
                "shrink-0 flex items-center gap-2 rounded-full border px-4 py-2.5 transition-all",
                isActive
                  ? "border-[#00BA88] bg-[#00BA88]/10 text-[#00BA88]"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-500 hover:border-[#00BA88]/70"
              )}
            >
              <Icon size={15} />
              <span className="text-xs font-black">{item.label}</span>
            </button>
          );
        })}
      </section>

      <section className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-xl md:text-3xl font-black text-slate-950 dark:text-white flex items-center gap-2">
            <SparklesIcon className="h-5 w-5 text-[#00BA88]" />
            {activeSection.label}
          </h2>

          <p className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 md:pl-7">
            {listings?.resolvedQuery
              ? `Showing results for "${listings.resolvedQuery}"`
              : activeSection.description}
          </p>
        </div>

        <CustomDropdown
          value={SORT_LABELS[sort]}
          options={SORT_OPTIONS}
          onChange={handleSortChange}
          className="md:w-[180px]"
        />
      </section>

      {isPending ? (
        <ListingSkeleton />
      ) : items.length > 0 ? (
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-4">
          {items.map((item: any) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="relative overflow-hidden rounded-[1.25rem] md:rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 md:p-5 shadow-sm transition-all duration-300 hover:shadow-2xl hover:shadow-[#00BA88]/10 hover:-translate-y-2 active:scale-[0.98]">
                <div className="relative aspect-[4/3] w-full mb-3 md:mb-5 flex items-center justify-center bg-slate-50 dark:bg-slate-950/40 rounded-[1rem] md:rounded-[1.5rem] overflow-hidden border border-slate-100 dark:border-slate-800/50 p-2 md:p-3">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-contain filter drop-shadow-sm group-hover:scale-110 transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-xs font-black text-slate-400">
                      No Image
                    </div>
                  )}
                </div>

                <div className="space-y-2.5 md:space-y-3">
                  <h3 className="text-[12px] md:text-sm font-bold text-slate-900 dark:text-white leading-snug group-hover:text-[#00BA88] transition-colors">
                  {item.title}
                </h3>

                  <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-[13px] md:text-[15px] font-extrabold text-slate-900 dark:text-white">
                      {item.formattedPrice
                        ? item.formattedPrice.replace(/^USD\s*/i, "$")
                        : "N/A"}
                    </p>
                  </div>

                  <div className="pt-1">
                    <div className="w-full py-2 md:py-2.5 text-white rounded-lg md:rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 bg-[#00BA88] dark:hover:text-white transition-colors">
                      Buy on eBay
                      <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4" strokeWidth={3} />
                    </div>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </section>
      ) : (
        <div className="py-24 text-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
          <p className="text-sm font-black text-slate-500">No listings found.</p>
        </div>
      )}
    </div>
  );
}