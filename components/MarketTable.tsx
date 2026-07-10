"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ExternalLink,
  Inbox,
  Loader2,
  Search,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { getCardPurchaseLinks } from "@/lib/affiliate-links";
import { fetchUniversalSearch } from "@/lib/queries/search";

const SEARCH_DEBOUNCE_MS = 400;
const PLACEHOLDER_IMAGE =
  "https://pokecollectorhub.com/assets/placeholder.png";

interface MarketTableProps {
  initialCards?: any[];
  totalRecords?: number;
  totalPages?: number;
  currentPage?: number;
}

const safeParseNumber = (
  value: unknown
): number => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return 0;
  }

  if (typeof value === "number") {
    return Number.isFinite(value)
      ? value
      : 0;
  }

  const cleaned = String(value)
    .replace(/[$,]/g, "")
    .trim();

  const parsed = Number(cleaned);

  return Number.isFinite(parsed)
    ? parsed
    : 0;
};

const normalizeSearchText = (
  value: string
) => value.trim().replace(/\s+/g, " ");

const BuyDropdown = ({
  card,
}: {
  card: any;
}) => {
  const [isOpen, setIsOpen] =
    useState(false);

  const containerRef =
    useRef<HTMLDivElement>(null);

  const links =
    getCardPurchaseLinks(card);

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node
        )
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  if (!links.length) {
    return (
      <button
        type="button"
        disabled
        onClick={(event) =>
          event.stopPropagation()
        }
        className="relative z-10 mx-auto cursor-not-allowed rounded-lg border-2 border-slate-300 px-4 py-1.5 text-[9px] font-black uppercase text-slate-400 md:rounded-xl md:px-6 md:py-2 md:text-xs"
      >
        Buy
      </button>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative inline-flex"
    >
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();

          if (links.length === 1) {
            window.open(
              links[0].url,
              "_blank",
              "noopener,noreferrer"
            );

            return;
          }

          setIsOpen(
            (previous) => !previous
          );
        }}
        className="relative z-10 mx-auto flex cursor-pointer items-center gap-1.5 rounded-lg border-2 border-[#00BA88] px-4 py-1.5 text-[9px] font-black uppercase text-[#00BA88] transition-all hover:bg-[#00BA88] hover:text-white md:rounded-xl md:px-6 md:py-2 md:text-xs"
      >
        Buy

        {links.length > 1 && (
          <ChevronDown size={13} />
        )}
      </button>

      <AnimatePresence>
        {isOpen && links.length > 1 && (
          <motion.div
            initial={{
              opacity: 0,
              y: 4,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 4,
              scale: 0.98,
            }}
            transition={{
              duration: 0.12,
            }}
            onClick={(event) =>
              event.stopPropagation()
            }
            className="absolute right-0 top-full z-[200] mt-2 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="p-1">
              {links.map(
                (link: any) => (
                  <button
                    key={
                      link.marketplace
                    }
                    type="button"
                    onClick={() => {
                      window.open(
                        link.url,
                        "_blank",
                        "noopener,noreferrer"
                      );

                      setIsOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-black text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    {link.label}

                    <ExternalLink
                      size={12}
                    />
                  </button>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TableSkeleton = () => (
  <>
    {Array.from({
      length: 8,
    }).map((_, index) => (
      <tr
        key={index}
        className="animate-pulse border-b border-slate-100 dark:border-slate-800"
      >
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
}: MarketTableProps) {
  const router = useRouter();
  const searchParams =
    useSearchParams();

  const searchInputRef =
    useRef<HTMLInputElement>(null);

  const universalSearchRequestRef =
    useRef(0);

  const isFirstSearchEffect =
    useRef(true);

  const [isPageLoading, setIsPageLoading] =
    useState(false);

  const [
    isUniversalSearching,
    setIsUniversalSearching,
  ] = useState(false);

  const [searchQuery, setSearchQuery] =
    useState(
      searchParams.get("q") || ""
    );

  const [
    activeSearchQuery,
    setActiveSearchQuery,
  ] = useState("");

  const [
    searchResults,
    setSearchResults,
  ] = useState<any[]>([]);

  const [
    isSearchFocused,
    setIsSearchFocused,
  ] = useState(false);

  const currentGrade =
    searchParams.get("grade") ||
    "psa 10";

  const normalizedSearchQuery =
    normalizeSearchText(searchQuery);

  const isUniversalSearchActive =
    activeSearchQuery.length >= 2;

  const displayedCards =
    isUniversalSearchActive
      ? searchResults
      : initialCards;

  const displayedTotalRecords =
    isUniversalSearchActive
      ? searchResults.length
      : totalRecords;

  const normalizeUniversalResults =
    useCallback((cards: any[]) => {
      return (cards || []).map(
        (card) => {
          const game = String(
            card.game || "pokemon"
          ).toLowerCase();

          let rawPath =
            card.canonical_path ||
            card.canonicalUrl ||
            card.url ||
            "";

          if (
            rawPath &&
            !rawPath.startsWith("/")
          ) {
            rawPath = `/${rawPath}`;
          }

          let finalPath = rawPath;

          if (
            finalPath &&
            !finalPath.startsWith(
              "/card"
            )
          ) {
            if (game === "pokemon") {
              if (
                finalPath.startsWith(
                  "/en/"
                ) ||
                finalPath.startsWith(
                  "/ja/"
                )
              ) {
                finalPath =
                  `/card${finalPath}`;
              } else {
                finalPath =
                  `/card/en${finalPath}`;
              }
            } else {
              finalPath =
                `/card${finalPath}`;
            }
          }

          return {
            ...card,

            id: String(
              card.id ||
                card.source_id ||
                ""
            ),

            image:
              card.imageUrl ||
              card.image ||
              PLACEHOLDER_IMAGE,

            imageUrl:
              card.imageUrl ||
              card.image ||
              PLACEHOLDER_IMAGE,

            canonical_path:
              finalPath,

            canonicalUrl:
              finalPath,

            url: finalPath,

            set:
              card.set ||
              card.expansion_name ||
              "Unknown Set",

            rarity:
              card.rarity ||
              card.type ||
              "Standard",

            price:
              card.price ||
              "$0.00",

            marketCap:
              card.marketCap ||
              "$0.00",

            sales30dNum:
              safeParseNumber(
                card.sales30dNum ??
                  card.sales30d
              ),

            sales90dNum:
              safeParseNumber(
                card.sales90dNum ??
                  card.sales90d
              ),

            gradeCount:
              safeParseNumber(
                card.gradeCount ??
                  card.psa10
              ),

            popTotal:
              safeParseNumber(
                card.popTotal ??
                  card.total
              ),
          };
        }
      );
    }, []);

  const replaceSearchQueryInUrl =
    useCallback((value: string) => {
      if (
        typeof window === "undefined"
      ) {
        return;
      }

      const params =
        new URLSearchParams(
          window.location.search
        );

      if (value) {
        params.set("q", value);
      } else {
        params.delete("q");
      }

      params.delete("page");

      const queryString =
        params.toString();

      window.history.replaceState(
        null,
        "",
        queryString
          ? `${window.location.pathname}?${queryString}`
          : window.location.pathname
      );
    }, []);

  const performUniversalSearch =
    useCallback(
      async (value: string) => {
        const cleaned =
          normalizeSearchText(value);

        if (cleaned.length < 2) {
          universalSearchRequestRef.current +=
            1;

          setActiveSearchQuery("");
          setSearchResults([]);
          setIsUniversalSearching(false);

          replaceSearchQueryInUrl("");

          return;
        }

        const requestId =
          ++universalSearchRequestRef.current;

        setActiveSearchQuery(cleaned);
        setIsUniversalSearching(true);

        replaceSearchQueryInUrl(
          cleaned
        );

        try {
          const results =
            await fetchUniversalSearch(
              cleaned,
              "pokemon",
              100,
              currentGrade
            );

          if (
            requestId !==
            universalSearchRequestRef.current
          ) {
            return;
          }

          setSearchResults(
            normalizeUniversalResults(
              Array.isArray(results)
                ? results
                : []
            )
          );
        } catch (error) {
          if (
            requestId ===
            universalSearchRequestRef.current
          ) {
            setSearchResults([]);
          }

          console.error(
            "Unable to search universal card index:",
            error
          );
        } finally {
          if (
            requestId ===
            universalSearchRequestRef.current
          ) {
            setIsUniversalSearching(
              false
            );
          }
        }
      },
      [
        currentGrade,
        normalizeUniversalResults,
        replaceSearchQueryInUrl,
      ]
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
      if (
        page < 1 ||
        page > totalPages ||
        isPageLoading
      ) {
        return;
      }

      setIsPageLoading(true);

      const params =
        new URLSearchParams(
          searchParams.toString()
        );

      params.set(
        "page",
        String(page)
      );

      router.push(
        `?${params.toString()}`,
        {
          scroll: false,
        }
      );
    },
    [
      isPageLoading,
      router,
      searchParams,
      totalPages,
    ]
  );

  const handleNavigation =
    useCallback(
      (card: any) => {
        const rawPath =
          card.canonical_path ||
          card.canonicalUrl ||
          card.url ||
          "";

        if (rawPath) {
          const cleanPath =
            rawPath.startsWith("/")
              ? rawPath
              : `/${rawPath}`;

          const dynamicRoute =
            cleanPath.startsWith(
              "/card"
            )
              ? cleanPath
              : `/card${cleanPath}`;

          router.push(dynamicRoute);

          return;
        }

        if (card.id) {
          router.push(
            `/card/${card.id}`
          );
        }
      },
      [router]
    );

  useEffect(() => {
    setIsPageLoading(false);
  }, [
    initialCards,
    currentPage,
  ]);

  useEffect(() => {
    const cleaned =
      normalizedSearchQuery;

    if (isFirstSearchEffect.current) {
      isFirstSearchEffect.current = false;

      if (cleaned.length >= 2) {
        performUniversalSearch(cleaned);
      }

      return;
    }

    if (cleaned.length < 2) {
      universalSearchRequestRef.current +=
        1;

      setActiveSearchQuery("");
      setSearchResults([]);
      setIsUniversalSearching(false);

      replaceSearchQueryInUrl("");

      return;
    }

    const timer = window.setTimeout(
      () => {
        performUniversalSearch(
          cleaned
        );
      },
      SEARCH_DEBOUNCE_MS
    );

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    normalizedSearchQuery,
    performUniversalSearch,
    replaceSearchQueryInUrl,
  ]);

  return (
    <div className="mx-auto max-w-[1600px] space-y-4 py-4 md:space-y-6 md:py-8">
      <div className="px-1">
        <h2 className="mb-1 text-[14px] font-black uppercase tracking-[0.1em] text-slate-900 dark:text-white md:text-base">
          Card Overview
        </h2>

        <p className="text-[11px] font-bold leading-tight tracking-wider text-slate-500 opacity-70 md:text-xs">
          Search card names, sets and
          card numbers across the
          Pokémon market.
        </p>
      </div>

      <div className="relative z-20 px-1">
        <div
          className={cn(
            "absolute -inset-1 rounded-[1.4rem] bg-[#00BA88]/10 blur-xl transition-opacity duration-300",
            isSearchFocused
              ? "opacity-100"
              : "opacity-0"
          )}
        />

        <div
          className={cn(
            "relative flex w-full items-center overflow-hidden",
            "rounded-xl border bg-white dark:bg-slate-950 md:rounded-2xl",
            "px-3 py-1.5 transition-all duration-200 md:px-4",
            isSearchFocused
              ? "border-[#00BA88] shadow-lg shadow-[#00BA88]/10"
              : "border-slate-200 dark:border-slate-800"
          )}
        >
          <Search
            size={18}
            className={cn(
              "shrink-0 transition-colors",
              isSearchFocused
                ? "text-[#00BA88]"
                : "text-slate-400"
            )}
          />

          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            autoComplete="off"
            spellCheck={false}
            onFocus={() =>
              setIsSearchFocused(true)
            }
            onBlur={() =>
              setIsSearchFocused(false)
            }
            onChange={(event) =>
              setSearchQuery(
                event.target.value
              )
            }
            onKeyDown={(event) => {
              if (
                event.key === "Escape"
              ) {
                clearSearch();
              }
            }}
            placeholder='Filter by card, set or number: (e.g. "Charizard #4")'
            className="w-full min-w-0 border-none bg-transparent px-3 py-2.5 text-xs font-bold text-slate-900 outline-none placeholder:font-medium placeholder:text-slate-400 dark:text-white md:py-3 md:text-sm"
          />

          {isUniversalSearching ? (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center">
              <Loader2
                size={17}
                className="animate-spin text-[#00BA88]"
              />
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

      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900 md:rounded-[1.5rem]">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full min-w-[1180px] border-collapse text-left font-sans">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[9px] font-black uppercase tracking-widest text-slate-400 dark:border-slate-800 dark:bg-slate-950/20 md:text-xs">
                <th className="w-10 px-4 py-5 text-center md:w-16">
                  #
                </th>

                <th className="px-4 py-5">
                  Card
                </th>

                <th className="w-[260px] px-4 py-5">
                  Set
                </th>

                <th className="w-[150px] px-4 py-5 text-right">
                  Price (
                  {currentGrade.toUpperCase()}
                  )
                </th>

                <th className="w-[110px] px-3 py-5 text-right">
                  30D Sales
                </th>

                <th className="w-[110px] px-3 py-5 text-right">
                  90D Sales
                </th>

                <th className="px-4 py-5 text-right">
                  Market Cap
                </th>

                <th className="px-4 py-5 text-right">
                  Pop Report
                </th>

                <th className="px-4 py-5 text-center">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isPageLoading ||
              isUniversalSearching ? (
                <TableSkeleton />
              ) : displayedCards.length >
                0 ? (
                displayedCards.map(
                  (
                    card: any,
                    index
                  ) => {
                    const totalSales30d =
                      safeParseNumber(
                        card.sales30dNum ??
                          card.sales30d
                      );

                    const totalSales90d =
                      safeParseNumber(
                        card.sales90dNum ??
                          card.sales90d
                      );

                    const currentGradeCount =
                      safeParseNumber(
                        card.gradeCount ??
                          card.psa10
                      );

                    const currentPopTotal =
                      safeParseNumber(
                        card.popTotal ??
                          card.total
                      );

                    return (
                      <motion.tr
                        key={
                          card.id ||
                          `${card.name}-${card.number}-${index}`
                        }
                        initial={{
                          opacity: 0,
                        }}
                        animate={{
                          opacity: 1,
                        }}
                        onClick={() =>
                          handleNavigation(
                            card
                          )
                        }
                        className="group cursor-pointer transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                      >
                        <td className="px-4 py-2 text-center text-[12px] font-bold text-slate-400 md:py-3 md:text-sm">
                          {isUniversalSearchActive
                            ? index + 1
                            : (currentPage -
                                1) *
                                50 +
                              index +
                              1}
                        </td>

                        <td className="px-4 py-2 md:py-3">
                          <div className="group/item flex items-center gap-3 md:gap-5">
                            <div className="h-10 w-7 shrink-0 overflow-hidden rounded bg-slate-100 shadow-sm dark:bg-slate-800 md:h-12 md:w-9">
                              <img
                                src={
                                  card.imageUrl ||
                                  card.image ||
                                  PLACEHOLDER_IMAGE
                                }
                                alt={
                                  card.name ||
                                  "Trading card"
                                }
                                loading="lazy"
                                className="h-full w-full object-cover transition-transform group-hover/item:scale-110"
                                onError={(
                                  event
                                ) => {
                                  event.currentTarget.src =
                                    PLACEHOLDER_IMAGE;
                                }}
                              />
                            </div>

                            <div className="min-w-0">
                              <div className="mb-0.5 truncate text-[12px] font-black leading-tight text-slate-900 transition-colors group-hover/item:text-[#00BA88] dark:text-white md:text-sm">
                                {card.name}
                              </div>

                              <div className="text-[9px] font-black uppercase tracking-wider text-[#00BA88] md:text-[12px]">
                                {card.number
                                  ? `#${card.number}`
                                  : card.rarity ||
                                    card.type ||
                                    "Standard"}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="max-w-[260px] whitespace-normal break-words px-4 py-2 text-[12px] font-bold uppercase leading-snug text-slate-500 dark:text-slate-400 md:py-7 md:text-xs">
                          {card.set ||
                            "—"}
                        </td>

                        <td className="px-4 py-2 text-right text-[12px] font-black text-slate-900 dark:text-white md:py-7 md:text-[15px]">
                          {card.price ||
                            "$0.00"}
                        </td>

                        <td className="whitespace-nowrap px-4 py-2 text-right text-[12px] font-bold text-slate-900 dark:text-white md:py-7 md:text-sm">
                          {totalSales30d.toLocaleString()}
                        </td>

                        <td className="whitespace-nowrap px-4 py-2 text-right text-[12px] font-bold text-slate-900 dark:text-white md:py-7 md:text-sm">
                          {totalSales90d.toLocaleString()}
                        </td>

                        <td className="px-4 py-2 text-right text-[12px] font-black uppercase text-slate-900 dark:text-white md:py-7 md:text-[15px]">
                          {card.marketCap ||
                            "$0.00"}
                        </td>

                        <td className="px-4 py-2 text-right md:py-7">
                          <div className="text-[12px] font-black text-slate-700 dark:text-slate-200 md:text-sm">
                            {currentGradeCount.toLocaleString()}
                          </div>

                          <div className="text-[8px] font-bold uppercase tracking-tighter text-slate-400 md:text-[12px]">
                            Total:{" "}
                            {currentPopTotal.toLocaleString()}
                          </div>
                        </td>

                        <td className="px-4 py-2 text-center md:py-7">
                          <BuyDropdown
                            card={card}
                          />
                        </td>
                      </motion.tr>
                    );
                  }
                )
              ) : (
                <tr>
                  <td
                    colSpan={9}
                    className="py-32 text-center"
                  >
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
                        <Inbox
                          size={48}
                          strokeWidth={
                            1.5
                          }
                        />
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white md:text-base">
                          No cards found
                        </p>

                        <p className="mx-auto max-w-[320px] px-4 text-[11px] font-bold text-slate-500 md:text-xs">
                          We couldn&apos;t
                          find any results
                          for{" "}
                          <span className="text-[#00BA88]">
                            &quot;
                            {activeSearchQuery ||
                              searchQuery ||
                              "your search"}
                            &quot;
                          </span>
                          .
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={
                          clearSearch
                        }
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
          totalPages > 0 && (
            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-950/20 md:p-6">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 md:text-xs">
                Page {currentPage} /{" "}
                {totalPages}
              </p>

              <div className="flex items-center gap-2 md:gap-3">
                <button
                  type="button"
                  disabled={
                    currentPage <= 1 ||
                    isPageLoading
                  }
                  onClick={() =>
                    updatePage(1)
                  }
                  className="cursor-pointer rounded-lg border border-slate-200 p-2 transition-all hover:bg-white disabled:cursor-not-allowed disabled:opacity-30 dark:border-slate-800 dark:hover:bg-slate-800"
                  title="First Page"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  disabled={
                    currentPage <= 1 ||
                    isPageLoading
                  }
                  onClick={() =>
                    updatePage(
                      currentPage - 1
                    )
                  }
                  className="cursor-pointer rounded-lg border border-slate-200 p-2 transition-all hover:bg-white disabled:cursor-not-allowed disabled:opacity-30 dark:border-slate-800 dark:hover:bg-slate-800"
                  title="Previous Page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="hidden gap-1.5 md:flex">
                  {Array.from({
                    length: Math.min(
                      5,
                      totalPages
                    ),
                  }).map(
                    (_, index) => {
                      let startPage =
                        Math.max(
                          1,
                          currentPage - 2
                        );

                      if (
                        startPage + 4 >
                        totalPages
                      ) {
                        startPage =
                          Math.max(
                            1,
                            totalPages -
                              4
                          );
                      }

                      const pageNumber =
                        startPage +
                        index;

                      if (
                        pageNumber >
                        totalPages
                      ) {
                        return null;
                      }

                      return (
                        <button
                          key={
                            pageNumber
                          }
                          type="button"
                          disabled={
                            isPageLoading
                          }
                          onClick={() =>
                            updatePage(
                              pageNumber
                            )
                          }
                          className={cn(
                            "h-9 w-9 cursor-pointer rounded-lg text-xs font-black transition-all disabled:cursor-not-allowed disabled:opacity-50",
                            currentPage ===
                              pageNumber
                              ? "bg-[#00BA88] text-white"
                              : "text-slate-400 hover:text-slate-900 dark:hover:text-white"
                          )}
                        >
                          {pageNumber}
                        </button>
                      );
                    }
                  )}
                </div>

                <button
                  type="button"
                  disabled={
                    currentPage >=
                      totalPages ||
                    isPageLoading
                  }
                  onClick={() =>
                    updatePage(
                      currentPage + 1
                    )
                  }
                  className="cursor-pointer rounded-lg border border-slate-200 p-2 transition-all hover:bg-white disabled:cursor-not-allowed disabled:opacity-30 dark:border-slate-800 dark:hover:bg-slate-800"
                  title="Next Page"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  disabled={
                    currentPage >=
                      totalPages ||
                    isPageLoading
                  }
                  onClick={() =>
                    updatePage(
                      totalPages
                    )
                  }
                  className="cursor-pointer rounded-lg border border-slate-200 p-2 transition-all hover:bg-white disabled:cursor-not-allowed disabled:opacity-30 dark:border-slate-800 dark:hover:bg-slate-800"
                  title="Last Page"
                >
                  <ChevronsRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
      </div>

      <div className="flex flex-wrap items-center gap-4 px-1 text-[9px] font-black uppercase tracking-widest text-slate-400 md:text-xs">
        <div className="flex items-center gap-1.5">
          <span>
            {isUniversalSearchActive
              ? "Search Results:"
              : "Total Records:"}
          </span>

          <span className="font-black text-slate-900 dark:text-white">
            {displayedTotalRecords.toLocaleString()}
          </span>
        </div>

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