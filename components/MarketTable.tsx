"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Inbox,
  Loader2,
  Search,
  Star,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import BuyOptionsModal from "@/components/BuyOptionsModal";
import { fetchUniversalSearch } from "@/lib/queries/search";
import { addCardToWatchlist } from "@/lib/queries/watchlist";

const SEARCH_DEBOUNCE_MS = 400;
const DEFAULT_PAGE_SIZE = 100;
const PLACEHOLDER_IMAGE = "https://pokecollectorhub.com/assets/placeholder.png";
const WATCHLIST_STORAGE_PREFIX = "cmc_watchlisted_card_ids";

interface MarketTableProps {
  initialCards?: any[];
  totalRecords?: number;
  totalPages?: number;
  currentPage?: number;
  pageSize?: number;
  recordOffset?: number;
}

const safeParseNumber = (value: unknown): number => {
  if (value === null || value === undefined || value === "") {
    return 0;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  const cleaned = String(value).replace(/[$,]/g, "").trim();

  const parsed = Number(cleaned);

  return Number.isFinite(parsed) ? parsed : 0;
};

const formatCompactCurrency = (value: unknown): string => {
  const amount = safeParseNumber(value);

  if (amount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(2)}B`;
  }

  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(2)}M`;
  }

  if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(2)}K`;
  }

  return `$${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const normalizeSearchText = (value: string) =>
  value.trim().replace(/\s+/g, " ");

const getStoredUserId = (): number | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedUser = window.localStorage.getItem("user_data");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const userId = Number(parsedUser?.id || parsedUser?.user_id);

    return Number.isFinite(userId) && userId > 0 ? userId : null;
  } catch {
    return null;
  }
};

const getWatchlistStorageKey = (userId: number) =>
  `${WATCHLIST_STORAGE_PREFIX}:${userId}`;

const readPersistedWatchlistIds = (userId: number): Set<string> => {
  try {
    const storedIds = JSON.parse(
      window.localStorage.getItem(getWatchlistStorageKey(userId)) || "[]",
    );

    return new Set(
      Array.isArray(storedIds)
        ? storedIds.map((id) => String(id).trim()).filter(Boolean)
        : [],
    );
  } catch {
    return new Set();
  }
};

const persistWatchlistIds = (userId: number, ids: Set<string>) => {
  try {
    window.localStorage.setItem(
      getWatchlistStorageKey(userId),
      JSON.stringify(Array.from(ids)),
    );
  } catch {
    // A blocked/full localStorage must never prevent the server-side add.
  }
};

/**
 * Resolve the card classification shown beneath the card name.
 *
 * The API has used several field names over time, so we check the
 * explicit rarity/type fields first and ignore values that are only
 * numbers. This keeps labels such as "Promo", "Holo Rare" and
 * "Illustration Rare" visible while still showing the card number.
 */
const getCardClassification = (card: any): string => {
  const candidates: unknown[] = [
    card?.rarity,
    card?.cardRarity,
    card?.card_rarity,
    card?.variant,
    card?.finish,
    card?.cardType,
    card?.card_type,
    card?.type,
    ...(Array.isArray(card?.subtypes) ? card.subtypes : []),
  ];

  for (const candidate of candidates) {
    if (candidate === null || candidate === undefined) {
      continue;
    }

    const value = String(candidate).trim().replace(/\s+/g, " ");

    if (
      !value ||
      /^\d+(?:[./-]\d+)*$/.test(value) ||
      value.toLowerCase() === "standard"
    ) {
      continue;
    }

    return value;
  }

  return "Standard";
};

const getPriceChange30d = (card: any): number | null => {
  const candidates = [
    card?.priceChange30d,
    card?.price_change_30d,
    card?.change30d,
    card?.change_30d,
    card?.change30dPercent,
    card?.change_30d_percent,
    card?.percentageChange30d,
    card?.percentage_change_30d,
  ];

  for (const candidate of candidates) {
    if (candidate === null || candidate === undefined || candidate === "") {
      continue;
    }

    const parsed = Number(String(candidate).replace(/[%,+]/g, "").trim());

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
};

const getSparklineValues = (card: any): number[] => {
  const candidates = [
    card?.sparkline,
    card?.priceHistory,
    card?.price_history,
    card?.history30d,
    card?.history_30d,
    card?.prices30d,
    card?.prices_30d,
  ];

  for (const candidate of candidates) {
    if (!Array.isArray(candidate)) {
      continue;
    }

    const values = candidate
      .map((item: any) => {
        if (typeof item === "number") return item;

        if (item && typeof item === "object") {
          return safeParseNumber(
            item.price ?? item.value ?? item.close ?? item.market_price,
          );
        }

        return safeParseNumber(item);
      })
      .filter((value: number) => Number.isFinite(value) && value > 0);

    if (values.length >= 2) {
      return values.slice(-18);
    }
  }

  return [];
};

const buildSparklinePoints = (
  values: number[],
  width = 76,
  height = 22,
): string => {
  if (values.length < 2) {
    return "";
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
};

const TableSkeleton = () => (
  <>
    {Array.from({
      length: 12,
    }).map((_, index) => (
      <tr
        key={index}
        className="animate-pulse border-b border-slate-100 dark:border-slate-800"
      >
        <td className="w-12 px-2 py-2.5 text-center md:py-3.5">
          <div className="mx-auto h-4 w-4 rounded bg-slate-100 dark:bg-slate-800" />
        </td>

        <td className="px-4 py-2.5 md:py-3.5">
          <div className="mx-auto h-3 w-3 rounded bg-slate-100 dark:bg-slate-800" />
        </td>

        <td className="px-4 py-2.5 md:py-3.5">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="h-10 w-7 rounded bg-slate-100 shadow-sm dark:bg-slate-800 md:h-12 md:w-9" />

            <div className="space-y-1">
              <div className="h-3 w-24 rounded bg-slate-100 dark:bg-slate-800 md:h-4 md:w-40" />

              <div className="h-2 w-12 rounded bg-slate-100 dark:bg-slate-800 md:h-2.5 md:w-20" />
            </div>
          </div>
        </td>

        <td className="px-4 py-2.5 md:py-3.5">
          <div className="h-3 w-16 rounded bg-slate-100 dark:bg-slate-800" />
        </td>

        <td className="px-4 py-2.5 md:py-3.5">
          <div className="ml-auto h-3 w-12 rounded bg-slate-100 dark:bg-slate-800" />
        </td>

        <td className="px-4 py-2.5 md:py-3.5">
          <div className="ml-auto h-3 w-8 rounded bg-slate-100 dark:bg-slate-800" />
        </td>

        <td className="px-4 py-2.5 md:py-3.5">
          <div className="ml-auto h-3 w-8 rounded bg-slate-100 dark:bg-slate-800" />
        </td>

        <td className="px-4 py-2.5 md:py-3.5">
          <div className="ml-auto h-3 w-16 rounded bg-slate-100 dark:bg-slate-800" />
        </td>

        <td className="px-4 py-2.5 md:py-3.5">
          <div className="ml-auto h-3 w-14 rounded bg-slate-100 dark:bg-slate-800" />
        </td>

        <td className="px-4 py-2.5 md:py-3.5">
          <div className="mx-auto h-8 w-14 rounded bg-slate-100 dark:bg-slate-800 md:h-10 md:w-24" />
        </td>
      </tr>
    ))}
  </>
);

export function MarketTable({
  initialCards = [],
  totalRecords = 0,
  totalPages = 0,
  currentPage = 1,
  pageSize = DEFAULT_PAGE_SIZE,
  recordOffset,
}: MarketTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchInputRef = useRef<HTMLInputElement>(null);

  const universalSearchRequestRef = useRef(0);

  const isFirstSearchEffect = useRef(true);

  const [isPageLoading, setIsPageLoading] = useState(false);

  const [isUniversalSearching, setIsUniversalSearching] = useState(false);

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  const [activeSearchQuery, setActiveSearchQuery] = useState("");

  const [searchResults, setSearchResults] = useState<any[]>([]);

  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const [purchaseCard, setPurchaseCard] = useState<any | null>(null);

  const [watchlistedCardIds, setWatchlistedCardIds] = useState<Set<string>>(
    () => new Set(),
  );

  const [watchlistLoadingIds, setWatchlistLoadingIds] = useState<Set<string>>(
    () => new Set(),
  );

  const currentGrade = searchParams.get("grade") || "psa 10";

  const normalizedPageSize =
    Number.isFinite(pageSize) && pageSize > 0
      ? Math.floor(pageSize)
      : DEFAULT_PAGE_SIZE;

  const effectiveTotalPages =
    totalPages > 0
      ? totalPages
      : Math.max(1, Math.ceil(totalRecords / normalizedPageSize));

  const effectiveRecordOffset =
    Number.isFinite(recordOffset) && Number(recordOffset) >= 0
      ? Math.floor(Number(recordOffset))
      : (currentPage - 1) * normalizedPageSize;

  const normalizedSearchQuery = normalizeSearchText(searchQuery);

  const isUniversalSearchActive = activeSearchQuery.length >= 2;

  const displayedCards = isUniversalSearchActive ? searchResults : initialCards;

  const displayedTotalRecords = isUniversalSearchActive
    ? searchResults.length
    : totalRecords;

  useEffect(() => {
    const userId = getStoredUserId();
    const persistedIds = userId
      ? readPersistedWatchlistIds(userId)
      : new Set<string>();

    setWatchlistedCardIds((previous) => {
      const next = new Set(previous);

      persistedIds.forEach((id) => next.add(id));

      displayedCards.forEach((card: any) => {
        const cardId = String(card?.id || card?.source_id || "").trim();
        const isAlreadyWatchlisted = Boolean(
          card?.is_watchlisted ||
            card?.isWatchlisted ||
            card?.watchlisted ||
            card?.in_watchlist ||
            card?.inWatchlist,
        );

        if (cardId && isAlreadyWatchlisted) {
          next.add(cardId);
        }
      });

      return next;
    });
  }, [displayedCards]);

  const normalizeUniversalResults = useCallback((cards: any[]) => {
    return (cards || []).map((card) => {
      const game = String(card.game || "pokemon").toLowerCase();

      let rawPath = card.canonical_path || card.canonicalUrl || card.url || "";

      if (rawPath && !rawPath.startsWith("/")) {
        rawPath = `/${rawPath}`;
      }

      let finalPath = rawPath;

      if (finalPath && !finalPath.startsWith("/card")) {
        if (game === "pokemon") {
          if (finalPath.startsWith("/en/") || finalPath.startsWith("/ja/")) {
            finalPath = `/card${finalPath}`;
          } else {
            finalPath = `/card/en${finalPath}`;
          }
        } else {
          finalPath = `/card${finalPath}`;
        }
      }

      return {
        ...card,

        id: String(card.id || card.source_id || ""),

        image: card.imageUrl || card.image || PLACEHOLDER_IMAGE,

        imageUrl: card.imageUrl || card.image || PLACEHOLDER_IMAGE,

        canonical_path: finalPath,

        canonicalUrl: finalPath,

        url: finalPath,

        set: card.set || card.expansion_name || "Unknown Set",

        rarity: card.rarity || card.type || "Standard",

        price: card.price || "$0.00",

        marketCap: card.marketCap || "$0.00",

        sales30dNum: safeParseNumber(card.sales30dNum ?? card.sales30d),

        sales90dNum: safeParseNumber(card.sales90dNum ?? card.sales90d),

        gradeCount: safeParseNumber(card.gradeCount ?? card.psa10),

        popTotal: safeParseNumber(card.popTotal ?? card.total),
      };
    });
  }, []);

  const replaceSearchQueryInUrl = useCallback((value: string) => {
    if (typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams(window.location.search);

    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }

    params.delete("page");

    const queryString = params.toString();

    window.history.replaceState(
      null,
      "",
      queryString
        ? `${window.location.pathname}?${queryString}`
        : window.location.pathname,
    );
  }, []);

  const performUniversalSearch = useCallback(
    async (value: string) => {
      const cleaned = normalizeSearchText(value);

      if (cleaned.length < 2) {
        universalSearchRequestRef.current += 1;

        setActiveSearchQuery("");
        setSearchResults([]);
        setIsUniversalSearching(false);

        replaceSearchQueryInUrl("");

        return;
      }

      const requestId = ++universalSearchRequestRef.current;

      setActiveSearchQuery(cleaned);
      setIsUniversalSearching(true);

      replaceSearchQueryInUrl(cleaned);

      try {
        const results = await fetchUniversalSearch(
          cleaned,
          "pokemon",
          100,
          currentGrade,
        );

        if (requestId !== universalSearchRequestRef.current) {
          return;
        }

        setSearchResults(
          normalizeUniversalResults(Array.isArray(results) ? results : []),
        );
      } catch (error) {
        if (requestId === universalSearchRequestRef.current) {
          setSearchResults([]);
        }

        console.error("Unable to search universal card index:", error);
      } finally {
        if (requestId === universalSearchRequestRef.current) {
          setIsUniversalSearching(false);
        }
      }
    },
    [currentGrade, normalizeUniversalResults, replaceSearchQueryInUrl],
  );

  const clearSearch = useCallback(() => {
    universalSearchRequestRef.current += 1;

    setSearchQuery("");
    setSearchResults([]);
    setActiveSearchQuery("");
    setIsUniversalSearching(false);

    replaceSearchQueryInUrl("");

    window.requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });
  }, [replaceSearchQueryInUrl]);

  const updatePage = useCallback(
    (page: number) => {
      if (page < 1 || page > effectiveTotalPages || isPageLoading) {
        return;
      }

      setIsPageLoading(true);

      const params = new URLSearchParams(searchParams.toString());

      params.set("page", String(page));

      router.push(`?${params.toString()}`, {
        scroll: false,
      });
    },
    [isPageLoading, router, searchParams, effectiveTotalPages],
  );

  const handleNavigation = useCallback(
    (card: any) => {
      const rawPath =
        card.canonical_path || card.canonicalUrl || card.url || "";

      if (rawPath) {
        const cleanPath = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;

        const dynamicRoute = cleanPath.startsWith("/card")
          ? cleanPath
          : `/card${cleanPath}`;

        router.push(dynamicRoute);

        return;
      }

      if (card.id) {
        router.push(`/card/${card.id}`);
      }
    },
    [router],
  );

  const handleAddToWatchlist = useCallback(
    async (card: any) => {
      const cardId = String(card.id || card.source_id || "").trim();

      if (!cardId || watchlistLoadingIds.has(cardId)) {
        return;
      }

      const userId = getStoredUserId();

      if (!userId) {
        router.push("/sign-in");
        return;
      }

      setWatchlistLoadingIds((previous) => {
        const next = new Set(previous);
        next.add(cardId);
        return next;
      });

      try {
        const grade =
          currentGrade.toLowerCase() === "raw"
            ? "Raw"
            : currentGrade.toUpperCase();

        const result = await addCardToWatchlist({
          user_id: userId,
          card_id: cardId,
          grade,
        });

        if (result?.success) {
          setWatchlistedCardIds((previous) => {
            const next = new Set(previous);
            next.add(cardId);
            persistWatchlistIds(userId, next);
            return next;
          });
        } else {
          console.error(
            "Unable to add card to watchlist:",
            result?.message || "Unknown error",
          );
        }
      } catch (error) {
        console.error("Unable to add card to watchlist:", error);
      } finally {
        setWatchlistLoadingIds((previous) => {
          const next = new Set(previous);
          next.delete(cardId);
          return next;
        });
      }
    },
    [currentGrade, router, watchlistLoadingIds],
  );

  useEffect(() => {
    setIsPageLoading(false);
  }, [initialCards, currentPage]);

  useEffect(() => {
    const cleaned = normalizedSearchQuery;

    if (isFirstSearchEffect.current) {
      isFirstSearchEffect.current = false;

      if (cleaned.length >= 2) {
        performUniversalSearch(cleaned);
      }

      return;
    }

    if (cleaned.length < 2) {
      universalSearchRequestRef.current += 1;

      setActiveSearchQuery("");
      setSearchResults([]);
      setIsUniversalSearching(false);

      replaceSearchQueryInUrl("");

      return;
    }

    const timer = window.setTimeout(() => {
      performUniversalSearch(cleaned);
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [normalizedSearchQuery, performUniversalSearch, replaceSearchQueryInUrl]);

  return (
    <div className="mx-auto w-full min-w-0 max-w-[1600px] space-y-4 py-4 md:space-y-6 md:py-8">
      <div className="px-1">
        <h2 className="mb-1 text-[14px] font-black uppercase tracking-[0.1em] text-slate-900 dark:text-white md:text-base">
          Card Overview
        </h2>

        <p className="text-[11px] font-bold leading-tight tracking-wider text-slate-500 opacity-70 md:text-xs">
          Search card names, sets and card numbers across the Pokémon market.
        </p>
      </div>

      <div className="relative z-20 px-1">
        <div
          className={cn(
            "absolute -inset-1 rounded-[1.4rem] bg-[#00BA88]/10 blur-xl transition-opacity duration-300",
            isSearchFocused ? "opacity-100" : "opacity-0",
          )}
        />

        <div
          className={cn(
            "relative flex w-full items-center overflow-hidden",
            "rounded-xl border bg-white dark:bg-slate-950 md:rounded-2xl",
            "px-3 py-1.5 transition-all duration-200 md:px-4",
            isSearchFocused
              ? "border-[#00BA88] shadow-lg shadow-[#00BA88]/10"
              : "border-slate-200 dark:border-slate-800",
          )}
        >
          <Search
            size={18}
            className={cn(
              "shrink-0 transition-colors",
              isSearchFocused ? "text-[#00BA88]" : "text-slate-400",
            )}
          />

          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            autoComplete="off"
            spellCheck={false}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            onChange={(event) => setSearchQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                clearSearch();
              }
            }}
            placeholder='Filter by card, set or number: (e.g. "Charizard #4")'
            className="w-full min-w-0 border-none bg-transparent px-3 py-2.5 text-xs font-bold text-slate-900 outline-none placeholder:font-medium placeholder:text-slate-400 dark:text-white md:py-3 md:text-sm"
          />

          {isUniversalSearching ? (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center">
              <Loader2 size={17} className="animate-spin text-[#00BA88]" />
            </div>
          ) : searchQuery ? (
            <button
              type="button"
              onMouseDown={(event) => {
                event.preventDefault();
                clearSearch();
              }}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              aria-label="Clear search"
            >
              <X size={17} />
            </button>
          ) : null}
        </div>
      </div>

      {/* {isUniversalSearchActive && (
        <div className="flex items-center justify-between gap-4 px-1">
          <div className="min-w-0">
            <p className="truncate text-xs font-black text-slate-900 dark:text-white md:text-sm">
              Results for{" "}
              <span className="text-[#00BA88]">
                &quot;
                {activeSearchQuery}
                &quot;
              </span>
            </p>

            <p className="mt-0.5 text-[10px] font-bold text-slate-400 md:text-xs">
              {isUniversalSearching
                ? "Searching the card index..."
                : `${displayedTotalRecords.toLocaleString()} matching cards`}
            </p>
          </div>

          <button
            type="button"
            onClick={clearSearch}
            className="shrink-0 text-[9px] font-black uppercase tracking-widest text-slate-400 transition-colors hover:text-red-500 md:text-[10px]"
          >
            Clear results
          </button>
        </div>
      )} */}

      <div className="-mx-4 w-screen max-w-[100vw] overflow-hidden border-y border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 md:hidden">
        <div className="grid w-full grid-cols-[34px_minmax(0,1fr)_86px_76px_14px] items-center gap-x-1 border-b border-slate-200 bg-slate-50/70 px-3 py-2.5 text-[8px] font-black uppercase tracking-[0.12em] text-slate-400 dark:border-slate-800 dark:bg-slate-900/60">
          <span className="text-center">#</span>
          <span>Card</span>
          <span className="text-right">Price</span>
          <span className="text-right">Market</span>
          <span aria-hidden="true" />
        </div>

        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {isPageLoading || isUniversalSearching ? (
            Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="grid w-full animate-pulse grid-cols-[34px_minmax(0,1fr)_86px_76px_14px] items-center gap-x-1 px-3 py-2.5"
              >
                <div className="flex flex-col items-center justify-center gap-1.5">
                  <div className="h-4 w-4 rounded bg-slate-100 dark:bg-slate-800" />
                  <div className="h-3 w-3 rounded bg-slate-100 dark:bg-slate-800" />
                </div>
                <div className="flex min-w-0 items-center gap-2">
                  <div className="h-[46px] w-[33px] shrink-0 rounded bg-slate-100 dark:bg-slate-800" />
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="h-3 w-20 rounded bg-slate-100 dark:bg-slate-800" />
                    <div className="h-2 w-14 rounded bg-slate-100 dark:bg-slate-800" />
                    <div className="h-2 w-10 rounded bg-slate-100 dark:bg-slate-800" />
                  </div>
                </div>
                <div className="ml-auto h-3 w-14 rounded bg-slate-100 dark:bg-slate-800" />
                <div className="ml-auto h-3 w-10 rounded bg-slate-100 dark:bg-slate-800" />
                <div className="h-3 w-3 rounded bg-slate-100 dark:bg-slate-800" />
              </div>
            ))
          ) : displayedCards.length > 0 ? (
            displayedCards.map((card: any, index) => {
              const totalSales30d = safeParseNumber(
                card.sales30dNum ?? card.sales30d,
              );

              const currentGradeCount = safeParseNumber(
                card.gradeCount ?? card.psa10,
              );

              const currentPopTotal = safeParseNumber(
                card.popTotal ?? card.total,
              );

              const cardClassification = getCardClassification(card);
              const priceChange30d = getPriceChange30d(card);
              const sparklineValues = getSparklineValues(card);
              const sparklinePoints = buildSparklinePoints(sparklineValues);
              const trendIsPositive = (priceChange30d ?? 0) >= 0;

              const watchlistCardId = String(
                card.id || card.source_id || "",
              ).trim();

              const isWatchlisted = watchlistedCardIds.has(watchlistCardId);
              const isAddingToWatchlist =
                watchlistLoadingIds.has(watchlistCardId);

              const rank = isUniversalSearchActive
                ? index + 1
                : effectiveRecordOffset + index + 1;

              return (
                <motion.div
                  key={card.id || `${card.name}-${card.number}-${index}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => handleNavigation(card)}
                  className="grid w-full cursor-pointer grid-cols-[34px_minmax(0,1fr)_86px_76px_14px] items-center gap-x-1 px-3 py-2.5 transition-colors active:bg-slate-50 dark:active:bg-slate-900"
                >
                  <div className="flex h-full min-h-[50px] flex-col items-center justify-center gap-1">
                    <button
                      type="button"
                      disabled={!watchlistCardId || isAddingToWatchlist}
                      onClick={(event) => {
                        event.stopPropagation();

                        if (!isWatchlisted) {
                          void handleAddToWatchlist(card);
                        }
                      }}
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-md transition-colors disabled:cursor-not-allowed",
                        isWatchlisted
                          ? "text-[#00BA88]"
                          : "text-slate-400 dark:text-slate-500",
                        isAddingToWatchlist && "opacity-70",
                      )}
                      aria-label={
                        isWatchlisted
                          ? `${card.name || "Card"} is in your watchlist`
                          : `Add ${card.name || "card"} to watchlist`
                      }
                      aria-pressed={isWatchlisted}
                    >
                      {isAddingToWatchlist ? (
                        <Loader2 className="h-[15px] w-[15px] animate-spin" />
                      ) : (
                        <Star
                          className={cn(
                            "h-[15px] w-[15px]",
                            isWatchlisted && "fill-current",
                          )}
                          strokeWidth={2}
                        />
                      )}
                    </button>

                    <div className="text-center text-[12px] font-black leading-none tabular-nums text-slate-700 dark:text-slate-200">
                      {rank}
                    </div>
                  </div>

                  <div className="flex min-w-0 items-center gap-2">
                    <div className="h-[48px] w-[34px] shrink-0 overflow-hidden rounded-[4px] bg-slate-100 shadow-sm ring-1 ring-black/5 dark:bg-slate-800 dark:ring-white/10">
                      <img
                        src={card.imageUrl || card.image || PLACEHOLDER_IMAGE}
                        alt={card.name || "Trading card"}
                        loading="lazy"
                        className="h-full w-full object-cover"
                        onError={(event) => {
                          event.currentTarget.src = PLACEHOLDER_IMAGE;
                        }}
                      />
                    </div>

                    <div className="min-w-0 leading-tight">
                      <div className="whitespace-normal break-words text-[11px] font-black leading-[1.12] text-slate-900 dark:text-white">
                        {card.name}
                      </div>

                      <div className="mt-0.5 whitespace-normal break-words text-[7px] font-bold leading-[1.15] text-slate-400 dark:text-slate-500">
                        {card.set || "Unknown Set"}
                      </div>

                      <div className="mt-1 inline-flex max-w-full items-center rounded bg-[#00BA88]/10 px-1.5 py-[2px] text-[6px] font-black uppercase leading-[1.15] tracking-wide text-[#00BA88]">
                        <span className="whitespace-normal break-words">
                          {currentGrade.toUpperCase()} · {cardClassification}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="min-w-0 text-right">
                    <div className="whitespace-nowrap text-[12px] font-black tabular-nums text-slate-900 dark:text-white">
                      {card.price || "$0.00"}
                    </div>

                    {priceChange30d !== null ? (
                      <div
                        className={cn(
                          "mt-0.5 text-[7px] font-black tabular-nums",
                          trendIsPositive ? "text-[#00BA88]" : "text-red-500",
                        )}
                      >
                        {trendIsPositive ? "▲" : "▼"} {Math.abs(priceChange30d).toFixed(2)}% (30D)
                      </div>
                    ) : (
                      <div className="mt-0.5 text-[7px] font-bold text-slate-400">
                        {totalSales30d.toLocaleString()} sales · 30D
                      </div>
                    )}

                    <div className="mt-1 flex h-[13px] items-center justify-end">
                      {sparklinePoints ? (
                        <svg
                          viewBox="0 0 76 22"
                          className={cn(
                            "h-[13px] w-[48px] overflow-visible",
                            trendIsPositive ? "text-[#00BA88]" : "text-red-500",
                          )}
                          aria-hidden="true"
                        >
                          <polyline
                            points={sparklinePoints}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : null}
                    </div>
                  </div>

                  <div className="min-w-0 text-right">
                    <div className="text-[6px] font-black uppercase tracking-wide text-slate-400">
                      Mkt Cap
                    </div>
                    <div className="mt-0.5 whitespace-nowrap text-[8px] font-black tabular-nums tracking-[-0.02em] text-slate-800 dark:text-slate-100">
                      {formatCompactCurrency(
                        card.marketCapNum ?? card.marketCap,
                      )}
                    </div>
                    <div className="mt-1 text-[6px] font-black uppercase tracking-wide text-slate-400">
                      Pop
                    </div>
                    <div className="whitespace-nowrap text-[8px] font-bold tabular-nums text-slate-600 dark:text-slate-300">
                      {(currentGradeCount || currentPopTotal).toLocaleString()}
                    </div>
                  </div>

                  <ChevronRight className="h-4 w-4 text-slate-400" strokeWidth={2} />
                </motion.div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="rounded-full bg-slate-50 p-4 text-slate-300 dark:bg-slate-900 dark:text-slate-600">
                <Inbox size={36} strokeWidth={1.5} />
              </div>
              <p className="mt-4 text-xs font-black uppercase tracking-tight text-slate-900 dark:text-white">
                No cards found
              </p>
              <p className="mt-1 max-w-[260px] text-[10px] font-bold text-slate-500">
                We couldn&apos;t find any results for &quot;
                {activeSearchQuery || searchQuery || "your search"}&quot;.
              </p>
              <button
                type="button"
                onClick={clearSearch}
                className="mt-4 rounded-lg bg-[#00BA88] px-5 py-2 text-[9px] font-black uppercase tracking-widest text-white"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>

        {!isUniversalSearchActive &&
          initialCards.length > 0 &&
          effectiveTotalPages > 0 && (
            <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/70 px-3 py-3 dark:border-slate-800 dark:bg-slate-900/60">
              <div>
                <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">
                  Page {currentPage} / {effectiveTotalPages}
                </p>
                <p className="mt-0.5 text-[7px] font-bold uppercase tracking-wider text-slate-300 dark:text-slate-600">
                  {normalizedPageSize} cards per page
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage <= 1 || isPageLoading}
                  onClick={() => updatePage(currentPage - 1)}
                  className="rounded-lg border border-slate-200 p-2 text-slate-500 disabled:opacity-30 dark:border-slate-700 dark:text-slate-300"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  disabled={currentPage >= effectiveTotalPages || isPageLoading}
                  onClick={() => updatePage(currentPage + 1)}
                  className="rounded-lg border border-slate-200 p-2 text-slate-500 disabled:opacity-30 dark:border-slate-700 dark:text-slate-300"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
      </div>

      <div className="hidden overflow-hidden rounded-[1.5rem] border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900 md:block">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full min-w-[1180px] border-collapse text-left font-sans">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[9px] font-black uppercase tracking-widest text-slate-400 dark:border-slate-800 dark:bg-slate-950/20 md:text-xs">
                <th className="w-12 px-2 py-5 text-center">
                  <span className="sr-only">Watchlist</span>
                </th>

                <th className="w-10 px-4 py-5 text-center md:w-16">#</th>

                <th className="px-4 py-5">Card</th>

                <th className="w-[190px] px-4 py-5">Set</th>

                <th className="w-[150px] px-4 py-5 text-right">
                  Price ({currentGrade.toUpperCase()})
                </th>

                <th className="w-[110px] px-3 py-5 text-right">30D Sales</th>

                <th className="w-[110px] px-3 py-5 text-right">90D Sales</th>

                <th className="px-4 py-5 text-right">Market Cap</th>

                <th className="px-4 py-5 text-right">Pop Report</th>

                <th className="px-4 py-5 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isPageLoading || isUniversalSearching ? (
                <TableSkeleton />
              ) : displayedCards.length > 0 ? (
                displayedCards.map((card: any, index) => {
                  const totalSales30d = safeParseNumber(
                    card.sales30dNum ?? card.sales30d,
                  );

                  const totalSales90d = safeParseNumber(
                    card.sales90dNum ?? card.sales90d,
                  );

                  const currentGradeCount = safeParseNumber(
                    card.gradeCount ?? card.psa10,
                  );

                  const currentPopTotal = safeParseNumber(
                    card.popTotal ?? card.total,
                  );

                  const cardClassification = getCardClassification(card);

                  const cardNumber =
                    card.number !== null &&
                    card.number !== undefined &&
                    String(card.number).trim() !== ""
                      ? String(card.number).trim()
                      : "";

                  const watchlistCardId = String(
                    card.id || card.source_id || "",
                  ).trim();

                  const isWatchlisted = watchlistedCardIds.has(watchlistCardId);

                  const isAddingToWatchlist =
                    watchlistLoadingIds.has(watchlistCardId);

                  return (
                    <motion.tr
                      key={card.id || `${card.name}-${card.number}-${index}`}
                      initial={{
                        opacity: 0,
                      }}
                      animate={{
                        opacity: 1,
                      }}
                      onClick={() => handleNavigation(card)}
                      style={{
                        contentVisibility: "auto",
                        containIntrinsicSize: "74px",
                      }}
                      className="group cursor-pointer transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/30"
                    >
                      <td className="w-12 px-2 py-2 text-center md:py-3">
                        <button
                          type="button"
                          disabled={!watchlistCardId || isAddingToWatchlist}
                          onClick={(event) => {
                            event.stopPropagation();

                            if (!isWatchlisted) {
                              void handleAddToWatchlist(card);
                            }
                          }}
                          className={cn(
                            "relative z-10 mx-auto inline-flex h-8 w-8 cursor-pointer items-center justify-center bg-transparent transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00BA88]/35 focus-visible:ring-offset-2 disabled:cursor-not-allowed dark:focus-visible:ring-offset-slate-900 md:h-9 md:w-9",
                            isWatchlisted
                              ? "text-[#00BA88]"
                              : "text-slate-400 hover:text-[#00BA88] dark:text-slate-500 dark:hover:text-[#00BA88]",
                            isAddingToWatchlist && "opacity-70",
                          )}
                          aria-label={
                            isWatchlisted
                              ? `${card.name || "Card"} is in your watchlist`
                              : `Add ${card.name || "card"} to watchlist`
                          }
                          aria-pressed={isWatchlisted}
                          title={
                            isWatchlisted
                              ? "Added to watchlist"
                              : "Add to watchlist"
                          }
                        >
                          {isAddingToWatchlist ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Star
                              className={cn(
                                "h-4 w-4",
                                isWatchlisted && "fill-current",
                              )}
                              strokeWidth={2}
                            />
                          )}
                        </button>
                      </td>

                      <td className="px-4 py-2 text-center text-[12px] font-bold text-slate-400 md:py-3 md:text-sm">
                        {isUniversalSearchActive
                          ? index + 1
                          : effectiveRecordOffset + index + 1}
                      </td>

                      <td className="px-4 py-2 md:py-3">
                        <div className="group/item flex items-center gap-3 md:gap-5">
                          <div className="h-10 w-7 shrink-0 overflow-hidden rounded bg-slate-100 shadow-sm dark:bg-slate-800 md:h-12 md:w-9">
                            <img
                              src={
                                card.imageUrl || card.image || PLACEHOLDER_IMAGE
                              }
                              alt={card.name || "Trading card"}
                              loading="lazy"
                              className="h-full w-full object-cover transition-transform group-hover/item:scale-110"
                              onError={(event) => {
                                event.currentTarget.src = PLACEHOLDER_IMAGE;
                              }}
                            />
                          </div>

                          <div className="min-w-0">
                            <div className="mb-0.5 truncate text-[12px] font-black leading-tight text-slate-900 transition-colors group-hover/item:text-[#00BA88] dark:text-white md:text-sm">
                              {card.name}
                            </div>

                            <div className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[6px] font-black uppercase tracking-wider md:text-[9px]">
                              <span
                                className="truncate text-[#00BA88]"
                                title={cardClassification}
                              >
                                {cardClassification}
                              </span>

                              {/* {cardNumber && (
                                  <>
                                    <span
                                      className="text-slate-300 dark:text-slate-600"
                                      aria-hidden="true"
                                    >
                                      •
                                    </span>

                                    <span className="shrink-0 text-slate-400 dark:text-slate-500">
                                      #{cardNumber}
                                    </span>
                                  </>
                                )} */}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="max-w-[190px] whitespace-normal break-words px-4 py-2 text-sm font-medium leading-snug text-slate-500 dark:text-slate-400 md:py-5">
                        {card.set || "—"}
                      </td>

                      <td className="px-4 py-2 text-right text-[12px] font-black text-slate-900 dark:text-white md:py-7 md:text-[15px]">
                        {card.price || "$0.00"}
                      </td>

                      <td className="whitespace-nowrap px-4 py-2 text-right text-[12px] font-bold text-slate-900 dark:text-white md:py-7 md:text-sm">
                        {totalSales30d.toLocaleString()}
                      </td>

                      <td className="whitespace-nowrap px-4 py-2 text-right text-[12px] font-bold text-slate-900 dark:text-white md:py-7 md:text-sm">
                        {totalSales90d.toLocaleString()}
                      </td>

                      <td className="px-4 py-2 text-right text-[12px] font-black uppercase text-slate-900 dark:text-white md:py-7 md:text-[15px]">
                        {card.marketCap || "$0.00"}
                      </td>

                      <td className="px-4 py-2 text-right md:py-7">
                        <div className="text-[12px] font-black text-slate-700 dark:text-slate-200 md:text-sm">
                          {currentGradeCount.toLocaleString()}
                        </div>

                        <div className="text-[8px] font-bold uppercase tracking-tighter text-slate-400 md:text-[12px]">
                          Total: {currentPopTotal.toLocaleString()}
                        </div>
                      </td>

                      <td className="px-4 py-2 text-center md:py-7">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setPurchaseCard(card);
                          }}
                          className="relative z-10 mx-auto flex cursor-pointer items-center justify-center rounded-lg border-2 border-[#00BA88] px-4 py-1.5 text-[9px] font-black uppercase text-[#00BA88] transition-all hover:bg-[#00BA88] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#00BA88]/30 focus:ring-offset-2 dark:focus:ring-offset-slate-900 md:rounded-xl md:px-6 md:py-2 md:text-xs"
                          aria-label={`Choose where to buy ${card.name || "this card"}`}
                        >
                          Buy
                        </button>
                      </td>
                    </motion.tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10} className="py-32 text-center">
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      className="flex flex-col items-center justify-center space-y-4"
                    >
                      <div className="rounded-full bg-slate-50 p-5 text-slate-300 dark:bg-slate-800/50 dark:text-slate-600">
                        <Inbox size={48} strokeWidth={1.5} />
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white md:text-base">
                          No cards found
                        </p>

                        <p className="mx-auto max-w-[320px] px-4 text-[11px] font-bold text-slate-500 md:text-xs">
                          We couldn&apos;t find any results for{" "}
                          <span className="text-[#00BA88]">
                            &quot;
                            {activeSearchQuery || searchQuery || "your search"}
                            &quot;
                          </span>
                          .
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={clearSearch}
                        className="rounded-lg bg-[#00BA88] px-6 py-2 text-[10px] font-black uppercase tracking-widest text-white transition-colors hover:bg-[#009a70] md:text-xs"
                      >
                        Clear Search
                      </button>
                    </motion.div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!isUniversalSearchActive &&
          initialCards.length > 0 &&
          effectiveTotalPages > 0 && (
            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-950/20 md:p-6">
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 md:text-xs">
                  Page {currentPage} / {effectiveTotalPages}
                </p>

                <p className="mt-1 text-[8px] font-bold uppercase tracking-wider text-slate-300 dark:text-slate-600 md:text-[10px]">
                  {normalizedPageSize} cards per page
                </p>
              </div>

              <div className="flex items-center gap-2 md:gap-3">
                <button
                  type="button"
                  disabled={currentPage <= 1 || isPageLoading}
                  onClick={() => updatePage(1)}
                  className="cursor-pointer rounded-lg border border-slate-200 p-2 transition-all hover:bg-white disabled:cursor-not-allowed disabled:opacity-30 dark:border-slate-800 dark:hover:bg-slate-800"
                  title="First Page"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  disabled={currentPage <= 1 || isPageLoading}
                  onClick={() => updatePage(currentPage - 1)}
                  className="cursor-pointer rounded-lg border border-slate-200 p-2 transition-all hover:bg-white disabled:cursor-not-allowed disabled:opacity-30 dark:border-slate-800 dark:hover:bg-slate-800"
                  title="Previous Page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="hidden gap-1.5 md:flex">
                  {Array.from({
                    length: Math.min(5, effectiveTotalPages),
                  }).map((_, index) => {
                    let startPage = Math.max(1, currentPage - 2);

                    if (startPage + 4 > effectiveTotalPages) {
                      startPage = Math.max(1, effectiveTotalPages - 4);
                    }

                    const pageNumber = startPage + index;

                    if (pageNumber > effectiveTotalPages) {
                      return null;
                    }

                    return (
                      <button
                        key={pageNumber}
                        type="button"
                        disabled={isPageLoading}
                        onClick={() => updatePage(pageNumber)}
                        className={cn(
                          "h-9 w-9 cursor-pointer rounded-lg text-xs font-black transition-all disabled:cursor-not-allowed disabled:opacity-50",
                          currentPage === pageNumber
                            ? "bg-[#00BA88] text-white"
                            : "text-slate-400 hover:text-slate-900 dark:hover:text-white",
                        )}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  disabled={currentPage >= effectiveTotalPages || isPageLoading}
                  onClick={() => updatePage(currentPage + 1)}
                  className="cursor-pointer rounded-lg border border-slate-200 p-2 transition-all hover:bg-white disabled:cursor-not-allowed disabled:opacity-30 dark:border-slate-800 dark:hover:bg-slate-800"
                  title="Next Page"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  disabled={currentPage >= effectiveTotalPages || isPageLoading}
                  onClick={() => updatePage(effectiveTotalPages)}
                  className="cursor-pointer rounded-lg border border-slate-200 p-2 transition-all hover:bg-white disabled:cursor-not-allowed disabled:opacity-30 dark:border-slate-800 dark:hover:bg-slate-800"
                  title="Last Page"
                >
                  <ChevronsRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
      </div>

      <BuyOptionsModal
        card={purchaseCard}
        open={Boolean(purchaseCard)}
        onClose={() => setPurchaseCard(null)}
        placement="market_table"
      />

      <div className="flex flex-wrap items-center gap-4 px-1 text-[9px] font-black uppercase tracking-widest text-slate-400 md:text-xs">
        <div className="flex items-center gap-1.5">
          <span>
            {isUniversalSearchActive ? "Search Results:" : "Total Records:"}
          </span>

          <span className="font-black text-slate-900 dark:text-white">
            {displayedTotalRecords.toLocaleString()}
          </span>
        </div>

        {!isUniversalSearchActive && (
          <div className="flex items-center gap-1.5 border-l border-slate-200 pl-4 dark:border-slate-800">
            <span>Showing:</span>

            <span className="font-black text-slate-900 dark:text-white">
              {Math.min(
                effectiveRecordOffset + 1,
                totalRecords,
              ).toLocaleString()}
              {" – "}
              {Math.min(
                effectiveRecordOffset + initialCards.length,
                totalRecords,
              ).toLocaleString()}
            </span>
          </div>
        )}

        <div className="flex items-center gap-1.5 border-l border-slate-200 pl-4 dark:border-slate-800">
          <span>Current Grade:</span>

          <span className="font-black text-[#00BA88]">
            {currentGrade.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}
