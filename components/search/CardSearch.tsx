"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Search,
  X,
  Zap,
  Wand2,
  Star,
  Anchor,
  Trophy,
  LayoutGrid,
  SparklesIcon,
  FlameIcon,
  Clock,
  Trash2,
  Loader2,
  ArrowUpRight,
  Megaphone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AssetCard } from "@/components/sets/AssetCard";
import { Skeleton } from "@/components/ui/skeleton";
import {
  fetchCMCCards,
  fetchTrendingCards,
  fetchExpansions,
} from "@/lib/queries/market";
import {
  fetchUniversalSearch,
  fetchSearchSuggestions,
} from "@/lib/queries/search";
import { SearchResult } from "@/types/search";
import { RandomSetScroller } from "@/components/search/RandomSetScroller";

const CATEGORIES = [
  { id: "pokemon", name: "Pokémon", icon: Zap },
  { id: "mtg", name: "Magic", icon: Wand2 },
  { id: "lorcana", name: "Lorcana", icon: Star },
  { id: "onepiece", name: "One Piece", icon: Anchor },
  { id: "sports", name: "Sports", icon: Trophy, isComingSoon: true },
];

const RECENT_SEARCH_KEY = "cmc_recent_searches";

const LoadingGrid = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
    {[...Array(10)].map((_, i) => (
      <div key={i} className="space-y-4">
        <Skeleton className="aspect-[3/4] w-full rounded-2xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);


type SearchPageAdvert = {
  id?: number | string;
  provider?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  disclosure?: string;
  image_url?: string;
  imageUrl?: string;
  target_url?: string;
  targetUrl?: string;
  cta_label?: string;
  ctaLabel?: string;
};

type AdvertApiResponse = {
  success?: boolean;
  advert?: SearchPageAdvert | null;
  adverts?: SearchPageAdvert[];
  rotationInterval?: number;
  rotation_interval?: number;
};

const ADVERT_PRIMARY_PLACEMENT =
  "card_search_bottom";

const ADVERT_FALLBACK_PLACEMENT =
  "homepage_stats_card";

const DEFAULT_AD_ROTATION_MS = 10000;

function normalizeAdvertList(
  payload: AdvertApiResponse
): SearchPageAdvert[] {
  const candidates = Array.isArray(
    payload?.adverts
  )
    ? payload.adverts
    : payload?.advert
      ? [payload.advert]
      : [];

  const seen = new Set<string>();

  return candidates.filter((advert) => {
    if (!advert) return false;

    const image =
      advert.image_url ||
      advert.imageUrl ||
      "";

    const target =
      advert.target_url ||
      advert.targetUrl ||
      "";

    if (!image && !target) {
      return false;
    }

    const identity = String(
      advert.id ||
        `${advert.title || ""}-${image}-${target}`
    );

    if (seen.has(identity)) {
      return false;
    }

    seen.add(identity);
    return true;
  });
}

function SearchBottomAdvert({
  advert,
  isLoading,
}: {
  advert: SearchPageAdvert | null;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <section
        aria-label="Loading sponsored promotion"
        className="mx-4 mt-8 overflow-hidden rounded-[22px] border border-slate-200/80 bg-white p-3 dark:border-white/10 dark:bg-slate-950 md:mx-0"
      >
        <Skeleton className="h-[150px] w-full rounded-[16px] md:h-[180px]" />
      </section>
    );
  }

  if (!advert) {
    return null;
  }

  const image =
    advert.image_url ||
    advert.imageUrl ||
    "";

  const targetUrl =
    advert.target_url ||
    advert.targetUrl ||
    "";

  const title =
    advert.title ||
    "Featured marketplace promotion";

  const subtitle =
    advert.subtitle ||
    advert.description ||
    "";

  const provider =
    advert.provider &&
    advert.provider !== "internal"
      ? advert.provider
      : "Partner";

  const cta =
    advert.cta_label ||
    advert.ctaLabel ||
    "Explore offer";

  const content = (
    <>
      {image ? (
        <img
          src={image}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.015]"
        />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(0,186,136,0.32),transparent_40%),linear-gradient(110deg,#06111f_0%,#0c2732_55%,#064e3b_100%)]" />
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-[#020b16]/95 via-[#020b16]/72 to-[#020b16]/15" />

      <div className="relative z-10 flex h-full max-w-3xl flex-col justify-center px-5 py-7 text-left md:px-9 md:py-9">
        <div className="mb-4 flex items-center gap-2 text-[#29e0ad]">
          <Megaphone
            size={15}
            strokeWidth={2.5}
          />

          <span className="text-[9px] font-black uppercase tracking-[0.2em] md:text-[10px]">
            Sponsored
          </span>

          <span className="h-1 w-1 rounded-full bg-white/35" />

          <span className="text-[9px] font-black uppercase tracking-[0.16em] text-white/60 md:text-[10px]">
            {provider}
          </span>
        </div>

        <h2 className="max-w-2xl text-xl font-black leading-tight tracking-tight text-white md:text-3xl">
          {title}
        </h2>

        {subtitle ? (
          <p className="mt-2.5 line-clamp-2 max-w-2xl text-xs font-medium leading-relaxed text-white/72 md:text-sm">
            {subtitle}
          </p>
        ) : null}

        <div className="mt-5 inline-flex w-fit items-center gap-2 rounded-xl bg-[#00BA88] px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.1em] text-white shadow-lg shadow-[#00BA88]/15 transition-colors group-hover:bg-[#00a978] md:text-[11px]">
          {cta}
          <ArrowUpRight size={14} />
        </div>
      </div>
    </>
  );

  return (
    <section
      aria-label="Sponsored marketplace promotion"
      className="mx-4 mt-8 md:mx-0"
    >
      {targetUrl ? (
        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="group relative block h-[180px] overflow-hidden rounded-[22px] border border-[#00BA88]/25 bg-[#06111f] outline-none transition hover:border-[#00BA88]/55 focus-visible:ring-2 focus-visible:ring-[#00BA88]/35 md:h-[220px]"
        >
          {content}
        </a>
      ) : (
        <div className="group relative block h-[180px] overflow-hidden rounded-[22px] border border-[#00BA88]/25 bg-[#06111f] md:h-[220px]">
          {content}
        </div>
      )}
    </section>
  );
}

export default function CardSearch() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>("pokemon");
  const [isFocused, setIsFocused] = useState(false);
  const [trendingAssets, setTrendingAssets] = useState<any[]>([]);
  const [popularAssets, setPopularAssets] = useState<any[]>([]);
  const [quickSetLinks, setQuickSetLinks] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showRecentDropdown, setShowRecentDropdown] = useState(false);

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [bottomAdverts, setBottomAdverts] = useState<SearchPageAdvert[]>([]);
  const [activeBottomAdvertIndex, setActiveBottomAdvertIndex] = useState(0);
  const [isBottomAdvertLoading, setIsBottomAdvertLoading] = useState(true);
  const [bottomAdvertRotationMs, setBottomAdvertRotationMs] = useState(
    DEFAULT_AD_ROTATION_MS
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  const getAssetImage = (asset: any) => {
    return (
      asset.image_large ||
      asset.image_medium ||
      asset.image_small ||
      asset.imageUrl ||
      asset.image ||
      asset.image_url
    );
  };

  const normalizeData = useCallback(
    (data: any[], forcedCategory: string | null = null) => {
      return (data || []).map((item) => {
        const detectedGame = (
          item.game ||
          forcedCategory ||
          selectedCategory ||
          "pokemon"
        ).toLowerCase();

        let basePath =
          item.canonical_path || item.canonicalUrl || item.url || item.href || "";

        if (basePath) {
          basePath = basePath.split("?")[0];
          if (!basePath.startsWith("/")) basePath = "/" + basePath;
        }

        let finalUrl = basePath;

        if (basePath && !basePath.startsWith("/card")) {
          if (detectedGame === "pokemon") {
            if (basePath.startsWith("/en/") || basePath.startsWith("/ja/")) {
              finalUrl = `/card${basePath}`;
            } else {
              finalUrl = `/card/en${basePath}`;
            }
          } else {
            finalUrl = `/card${basePath}`;
          }
        }

        if (!finalUrl) {
          finalUrl =
            detectedGame === "pokemon"
              ? `/card/en/pokemon/${item.id}`
              : `/card/${detectedGame}/${item.id}`;
        }

        return {
          ...item,
          imageUrl: getAssetImage(item),
          canonicalUrl: finalUrl,
          href: finalUrl,
          canonical_path: finalUrl,
        };
      });
    },
    [selectedCategory]
  );

  const saveRecentSearch = useCallback((value: string) => {
    const cleanValue = value.trim();
    if (cleanValue.length < 2) return;

    setRecentSearches((prev) => {
      const next = [
        cleanValue,
        ...prev.filter((item) => item.toLowerCase() !== cleanValue.toLowerCase()),
      ].slice(0, 8);

      if (typeof window !== "undefined") {
        localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(next));
      }

      return next;
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem(RECENT_SEARCH_KEY);
    }
  }, []);

  const selectRecentSearch = useCallback((value: string) => {
    setQuery(value);
    setShowRecentDropdown(false);
    setShowSuggestions(false);
    inputRef.current?.focus();
  }, []);

  const loadInitialData = useCallback(
    async (category: string | null) => {
      setIsLoading(true);

      try {
        const gameParam = category || "pokemon";

        const [trending, popular, setsResponse] = await Promise.all([
          fetchTrendingCards(),
          fetchCMCCards(1, "", "top", "all", "psa 10", gameParam),
          fetchExpansions(gameParam, "", 1),
        ]);

        const filteredTrending = category
          ? trending.filter(
              (t: any) =>
                t.game?.toLowerCase() === category.toLowerCase() ||
                category === "pokemon"
            )
          : trending;

        setTrendingAssets(normalizeData(filteredTrending, category));
        setPopularAssets(normalizeData(popular.data, gameParam));

        if (setsResponse.success) {
          setQuickSetLinks(setsResponse.data.slice(0, 12));
        }
      } catch (error) {
        console.error("Failed to fetch initial data", error);
      } finally {
        setIsLoading(false);
      }
    },
    [normalizeData]
  );

  const performSearch = useCallback(
    async (searchQuery: string, categoryId: string | null) => {
      const trimmedQuery = searchQuery.trim();

      if (trimmedQuery.length < 2) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);

      try {
        const results = await fetchUniversalSearch(
          trimmedQuery,
          categoryId,
          100,
          "psa 10"
        );

        setSearchResults(normalizeData(results, categoryId));
        saveRecentSearch(trimmedQuery);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setIsSearching(false);
      }
    },
    [normalizeData, saveRecentSearch]
  );

  const selectSuggestion = useCallback(
    (suggestion: any) => {
      const value = suggestion.label || suggestion.name || "";
      setQuery(value);
      setShowSuggestions(false);
      setShowRecentDropdown(false);
      saveRecentSearch(value);
      performSearch(value, selectedCategory);
      inputRef.current?.blur();
    },
    [performSearch, saveRecentSearch, selectedCategory]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const saved = localStorage.getItem(RECENT_SEARCH_KEY);
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
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target as Node)
      ) {
        setShowRecentDropdown(false);
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      loadInitialData(selectedCategory);
    }
  }, [selectedCategory, query.length, loadInitialData]);

  useEffect(() => {
    const trimmed = query.trim();

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
        const data = await fetchSearchSuggestions(
          trimmed,
          selectedCategory,
          8
        );

        if (!cancelled) {
          setSuggestions(data);
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
      clearTimeout(timer);
    };
  }, [query, selectedCategory]);

  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query, selectedCategory);
    }, 400);

    return () => clearTimeout(timer);
  }, [query, selectedCategory, performSearch]);


  useEffect(() => {
    let cancelled = false;

    async function requestPlacement(
      placement: string
    ): Promise<AdvertApiResponse | null> {
      const apiBase =
        process.env
          .NEXT_PUBLIC_API_BASE_URL;

      if (!apiBase) {
        return null;
      }

      try {
        const response = await fetch(
          `${apiBase}/adverts.php?placement=${encodeURIComponent(
            placement
          )}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          return null;
        }

        return (await response.json()) as AdvertApiResponse;
      } catch (error) {
        console.error(
          `Failed to load ${placement} adverts:`,
          error
        );

        return null;
      }
    }

    async function loadBottomAdverts() {
      setIsBottomAdvertLoading(true);

      const primaryPayload =
        await requestPlacement(
          ADVERT_PRIMARY_PLACEMENT
        );

      let payload =
        primaryPayload;

      let adverts =
        primaryPayload
          ? normalizeAdvertList(
              primaryPayload
            )
          : [];

      /*
       * The fallback makes this deployable immediately with the
       * existing advert inventory. Once `card_search_bottom` is
       * configured in the admin/backend, it takes precedence.
       */
      if (adverts.length === 0) {
        payload =
          await requestPlacement(
            ADVERT_FALLBACK_PLACEMENT
          );

        adverts = payload
          ? normalizeAdvertList(
              payload
            )
          : [];
      }

      if (cancelled) {
        return;
      }

      const requestedRotation =
        Number(
          payload?.rotationInterval ??
            payload?.rotation_interval
        );

      setBottomAdvertRotationMs(
        Number.isFinite(
          requestedRotation
        ) &&
          requestedRotation >= 4000
          ? requestedRotation
          : DEFAULT_AD_ROTATION_MS
      );

      setBottomAdverts(adverts);
      setActiveBottomAdvertIndex(0);
      setIsBottomAdvertLoading(false);
    }

    loadBottomAdverts();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (
      bottomAdverts.length <= 1
    ) {
      return;
    }

    const timer =
      window.setInterval(() => {
        setActiveBottomAdvertIndex(
          (current) =>
            (current + 1) %
            bottomAdverts.length
        );
      }, bottomAdvertRotationMs);

    return () =>
      window.clearInterval(
        timer
      );
  }, [
    bottomAdverts.length,
    bottomAdvertRotationMs,
  ]);

  const activeBottomAdvert =
    bottomAdverts[
      activeBottomAdvertIndex
    ] || null;

  const toggleCategory = (cat: any) => {
    if (cat.isComingSoon) return;
    const newCategoryId = selectedCategory === cat.id ? null : cat.id;
    setSelectedCategory(newCategoryId);
  };

  const isFiltering = query.trim().length >= 2;
  const displayAssets = isFiltering ? searchResults : [];

  const currentCategoryName = CATEGORIES.find(
    (c) => c.id === selectedCategory
  )?.name;

  const sectionTitle = isFiltering
    ? `${currentCategoryName || "Universal"} Results`
    : selectedCategory
    ? `Trending ${currentCategoryName}`
    : "Trending Pokémon";

  const shouldShowRecentDropdown =
    showRecentDropdown &&
    isFocused &&
    recentSearches.length > 0 &&
    query.trim().length < 2;

  const shouldShowSuggestions =
    showSuggestions && isFocused && query.trim().length >= 2;

  return (
    <div className="space-y-1 md:space-y-20 animate-in fade-in duration-1000 pt-23 md:pt-15 pb-20">
      <section className="flex flex-col items-center text-center space-y-8 md:space-y-12">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-[#00BA88] font-bold text-[11px] uppercase tracking-[0.2em]">
            <span className="flex h-2 w-2 rounded-full bg-[#00BA88] animate-pulse" />
            Global Asset Discovery
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Find your next <span className="text-[#00BA88]">Asset.</span>
          </h1>

          <p className="text-slate-500 dark:text-slate-400 text-xs md:text-lg max-w-2xl mx-auto leading-relaxed font-medium px-4">
            Search across 1.2M+ indexed cards and real-time market valuations.
          </p>
        </div>

        <div ref={searchBoxRef} className="relative w-full max-w-4xl px-4 group">
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
                : "border-[#00BA88]/50"
            )}
          >
            <div className="flex items-center w-full px-4">
              <SparklesIcon
                size={22}
                className={cn(
                  "shrink-0",
                  isFocused ? "text-[#00BA88]" : "text-slate-400"
                )}
              />

              <input
                ref={inputRef}
                type="text"
                value={query}
                onFocus={() => {
                  setIsFocused(true);
                  if (query.trim().length < 2) {
                    setShowRecentDropdown(true);
                  } else {
                    setShowSuggestions(true);
                  }
                }}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowRecentDropdown(e.target.value.trim().length < 2);
                  setShowSuggestions(e.target.value.trim().length >= 2);
                }}
                placeholder='Try: "Charizard #4" or "Base Set"'
                className="w-full bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white text-base md:text-lg font-bold py-2 px-3 outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              {query && (
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setQuery("");
                    setSuggestions([]);
                    setShowSuggestions(false);
                    setShowRecentDropdown(true);
                    inputRef.current?.focus();
                  }}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  aria-label="Clear search"
                >
                  <X size={20} />
                </button>
              )}

              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  if (query.trim().length >= 2) {
                    saveRecentSearch(query);
                    performSearch(query, selectedCategory);
                    setShowRecentDropdown(false);
                    setShowSuggestions(false);
                  }
                }}
                className="bg-[#00BA88] hover:bg-[#00a377] text-white p-3 md:px-6 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg shadow-[#00BA88]/20"
              >
                <Search size={18} strokeWidth={3} />
                <span className="hidden md:block font-black text-xs uppercase tracking-wider">
                  Search
                </span>
              </button>
            </div>
          </div>

          {shouldShowSuggestions && (
            <div className="absolute left-4 right-4 top-full z-[90] mt-3 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl shadow-slate-900/10 dark:shadow-black/30 text-left animate-in fade-in slide-in-from-top-2 duration-200">
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

              <div className="p-2 max-h-80 overflow-y-auto">
                {suggestions.length > 0 ? (
                  suggestions.map((item) => (
                    <button
                      key={`${item.id}-${item.label}`}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        selectSuggestion(item);
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

          {shouldShowRecentDropdown && (
            <div className="absolute left-4 right-4 top-full z-[80] mt-3 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl shadow-slate-900/10 dark:shadow-black/30 text-left animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Clock size={15} className="text-[#00BA88]" />
                  <span className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Previous Searches
                  </span>
                </div>

                <button
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
                    onMouseDown={(e) => {
                      e.preventDefault();
                      selectRecentSearch(item);
                    }}
                    className="w-full flex items-center justify-between gap-3 px-3 py-3 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-8 w-8 rounded-lg bg-[#00BA88]/10 text-[#00BA88] flex items-center justify-center shrink-0">
                        <Search size={14} />
                      </div>

                      <span className="truncate text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-[#00BA88] transition-colors">
                        {item}
                      </span>
                    </div>

                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 dark:text-slate-600 group-hover:text-[#00BA88] transition-colors">
                      Search
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {!isFiltering && (
          <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-1000 overflow-hidden">
            <RandomSetScroller />
          </div>
        )}

        <div className="hidden md:flex flex-wrap justify-center gap-3">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat)}
                className={cn(
                  "group relative flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-white/5 border rounded-full transition-all duration-300",
                  cat.isComingSoon
                    ? "opacity-40 cursor-not-allowed grayscale border-slate-200 dark:border-white/10"
                    : isActive
                    ? "border-[#00BA88] text-[#00BA88] shadow-[0_0_15px_rgba(0,186,136,0.1)]"
                    : "border-slate-200 dark:border-white/10 hover:border-[#00BA88] hover:text-[#00BA88] text-slate-600 dark:text-slate-400"
                )}
              >
                <cat.icon size={16} className={cn(isActive && "animate-pulse")} />
                <span className="text-sm font-bold tracking-tight">{cat.name}</span>

                {cat.isComingSoon && (
                  <span className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-orange-500 text-[8px] font-black text-white rounded-full uppercase tracking-tighter">
                    Soon
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {isFiltering && (
        <section className="space-y-6 md:space-y-8 px-4 md:px-0 animate-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-1">
            <h3 className="text-lg md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <LayoutGrid className="h-5 w-5 text-[#00BA88]" />
              {sectionTitle}
            </h3>

            <p className="text-[10px] md:text-sm font-medium text-slate-500 dark:text-slate-400 pl-8 md:pl-9">
              {isSearching ? "Searching index..." : "Displaying top matches"}
            </p>
          </div>

          {isSearching ? (
            <LoadingGrid />
          ) : displayAssets.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
              {displayAssets.map((asset, idx) => (
                <AssetCard key={`${asset.asset_id || asset.id}-${idx}`} asset={asset} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl">
              <p className="text-slate-500 font-bold">No results found.</p>
            </div>
          )}
        </section>
      )}

      {!isFiltering && (
        <section className="space-y-6 md:space-y-8 px-4 md:px-0">
          <div className="space-y-1">
            <h3 className="text-lg md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <FlameIcon className="h-5 w-5 text-red-700" />
              Popular {currentCategoryName || "Cards"}
            </h3>

            <p className="text-[10px] md:text-sm font-medium text-slate-500 dark:text-slate-400 pl-8 md:pl-9">
              All-time fan favorites and community staples.
            </p>
          </div>

          {isLoading ? (
            <LoadingGrid />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
              {popularAssets.map((asset, idx) => (
                <AssetCard key={`pop-${asset.id}-${idx}`} asset={asset} />
              ))}
            </div>
          )}
        </section>
      )}

      <SearchBottomAdvert
        advert={activeBottomAdvert}
        isLoading={isBottomAdvertLoading}
      />
    </div>
  );
}
