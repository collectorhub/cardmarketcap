"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronDown,
  Loader2,
  Share2,
  Star,
} from "lucide-react";

import { addCardToPortfolio } from "@/lib/queries/portfolio";
import { addCardToWatchlist } from "@/lib/queries/watchlist";
import { getCardUserStatus } from "@/lib/queries/status";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useAdvertRotation } from "@/hooks/useAdvertRotation";
import MarketSuggestions from "@/components/card-details/MarketSuggestions";
import CardDetailsTopBar from "@/components/card-details/CardDetailsTopBar";
import CardMediaPanel from "@/components/card-details/CardMediaPanel";
import AssetSpecifications from "@/components/card-details/AssetSpecifications";
import CardMarketOverviewPanel from "@/components/card-details/CardMarketOverviewPanel";
import PopulationPanel from "@/components/card-details/PopulationPanel";
import SalesHistoryPanel from "@/components/card-details/SalesHistoryPanel";
import PriceComparison, {
  MarketplaceRow,
} from "@/components/card-details/PriceComparison";
import AddToPortfolioModal from "@/components/card-details/AddToPortfolioModal";

interface CardDetailsProps {
  card: any;
  relatedCards?: any[];
}

const ALL_GRADES = [
  "PSA 10",
  "PSA 9",
  "PSA 8",
  "PSA 7",
  "PSA 6",
  "PSA 5",
  "PSA 4",
  "PSA 3",
  "PSA 2",
  "PSA 1",
  "Raw",
];

const SALES_GRADES = [
  "PSA 10",
  "PSA 9",
  "PSA 8",
  "PSA 7",
  "Raw",
];

const TIMEFRAMES = [
  "30D",
  "3M",
  "1Y",
  "ALL",
];

function parseMoney(value: any) {
  return (
    Number.parseFloat(
      String(value || "0").replace(
        /[^0-9.-]/g,
        ""
      )
    ) || 0
  );
}

function formatMoney(value: number) {
  return `$${value.toLocaleString(
    "en-US",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;
}

function formatInteger(value: any) {
  const number = Number(value || 0);

  return number.toLocaleString(
    "en-US"
  );
}

function cleanDisplay(
  value: any,
  fallback = "—"
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return fallback;
  }

  if (Array.isArray(value)) {
    return value.length
      ? value.join(", ")
      : fallback;
  }

  return String(value);
}

function getGradeNumber(
  grade: string
) {
  return grade.replace(
    /[^0-9]/g,
    ""
  );
}

function normalizeDate(value: any) {
  if (!value) return "—";

  const date = new Date(value);

  if (
    Number.isNaN(date.getTime())
  ) {
    return cleanDisplay(value);
  }

  return date.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
}

function getMarketplaceRows(
  card: any,
  currentPrice: string
): MarketplaceRow[] {
  const candidates =
    card.marketplaces ||
    card.marketplacePrices ||
    card.marketplace_prices ||
    card.priceComparisons ||
    card.price_comparisons ||
    [];

  if (Array.isArray(candidates)) {
    const normalized = candidates
      .map((item: any) => ({
        name:
          item.name ||
          item.marketplace ||
          item.source ||
          "Marketplace",
        price:
          item.formattedPrice ||
          item.formatted_price ||
          item.price ||
          currentPrice,
        action:
          item.action ||
          item.type ||
          item.label ||
          "Market",
        url:
          item.url ||
          item.link ||
          item.target_url ||
          item.targetUrl,
        logo:
          item.logo ||
          item.logo_url ||
          item.logoUrl,
      }))
      .filter(
        (item: MarketplaceRow) =>
          item.name
      );

    if (normalized.length) {
      return normalized.slice(0, 5);
    }
  }

  const rows: MarketplaceRow[] = [];

  const ebayUrl =
    card.buy_url ||
    card.buyUrl ||
    card.ebay_url ||
    card.ebayUrl;

  const tcgUrl =
    card.tcgplayer_url ||
    card.tcgPlayerUrl ||
    card.tcg_url ||
    card.tcgUrl;

  if (ebayUrl) {
    rows.push({
      name: "eBay",
      price: currentPrice,
      action: "Buy Now",
      url: ebayUrl,
    });
  }

  if (card.goldin_url || card.goldinUrl) {
    rows.push({
      name: "Goldin Auctions",
      price:
        card.goldin_price ||
        card.goldinPrice ||
        currentPrice,
      action: "Auction",
      url:
        card.goldin_url ||
        card.goldinUrl,
    });
  }

  if (
    card.cardladder_url ||
    card.cardLadderUrl
  ) {
    rows.push({
      name: "Card Ladder",
      price:
        card.cardladder_price ||
        card.cardLadderPrice ||
        currentPrice,
      action: "Market",
      url:
        card.cardladder_url ||
        card.cardLadderUrl,
    });
  }

  if (tcgUrl) {
    rows.push({
      name: "TCGplayer",
      price:
        card.tcgplayer_price ||
        card.tcgPlayerPrice ||
        currentPrice,
      action: "Market",
      url: tcgUrl,
    });
  }

  return rows;
}

export default function CardDetails({
  card,
  relatedCards = [],
}: CardDetailsProps) {
  const router = useRouter();

  const leftColumnRef = useRef<HTMLElement | null>(null);
  const middleColumnRef = useRef<HTMLElement | null>(null);
  const rightColumnRef = useRef<HTMLElement | null>(null);

  const [columnHasMore, setColumnHasMore] = useState({
    left: false,
    middle: false,
    right: false,
  });


  const initialGrade =
    card.resolvedGrade &&
    String(card.resolvedGrade)
      .toUpperCase()
      .includes("PSA")
      ? String(
          card.resolvedGrade
        ).toUpperCase()
      : "PSA 10";

  const [selectedGrade, setSelectedGrade] =
    useState(initialGrade);

  const [
    selectedTimeframe,
    setSelectedTimeframe,
  ] = useState("30D");

  const [salesGrade, setSalesGrade] =
    useState(
      SALES_GRADES.includes(
        initialGrade
      )
        ? initialGrade
        : "PSA 10"
    );

  const [copied, setCopied] =
    useState(false);

  const [
    showAddModal,
    setShowAddModal,
  ] = useState(false);

  const [
    portfolioGrade,
    setPortfolioGrade,
  ] = useState(initialGrade);

  const [
    addingToPortfolio,
    setAddingToPortfolio,
  ] = useState(false);

  const [
    addingToWatchlist,
    setAddingToWatchlist,
  ] = useState(false);

  const [addMessage, setAddMessage] =
    useState("");

  const [
    portfolioGrades,
    setPortfolioGrades,
  ] = useState<any[]>([]);

  const [
    watchlistGrades,
    setWatchlistGrades,
  ] = useState<any[]>([]);

  const cardName =
    card.name || "Unknown Card";

  const cardSet =
    card.expansion_name ||
    card.set ||
    "Unknown Set";

  const cardSeries =
    card.series ||
    card.expansion_series ||
    card.game ||
    "Pokémon";

  const cardImage =
    card.imageUrl ||
    card.image ||
    "https://pokecollectorhub.com/assets/placeholder.png";

  const cardType =
    card.rarity ||
    card.type ||
    "Standard";

  const mobileCardNumber = cleanDisplay(
    card.number ||
      card.card_number ||
      card.cardNumber,
    ""
  );

  // Keep the mobile summary intentionally brief. These use the raw card
  // values so a missing field is omitted instead of showing a placeholder.
  const mobileCardRarity = cleanDisplay(
    card.rarity || card.category,
    ""
  );

  const mobileCardSet = cleanDisplay(
    card.expansion_name || card.set,
    ""
  );

  const mobileCardSummary = [
    mobileCardNumber
      ? mobileCardNumber.startsWith("#")
        ? mobileCardNumber
        : `#${mobileCardNumber}`
      : "",
    mobileCardRarity,
    mobileCardSet,
  ].filter(Boolean);

  const popData =
    card.fullPsaPop || {};

  const selectedGradeNumber =
    getGradeNumber(selectedGrade);

  const selectedPopCount =
    selectedGrade === "Raw"
      ? 0
      : Number(
          popData?.[
            `grade_${selectedGradeNumber}`
          ] || 0
        );

  const getCurrentUserId = () => {
    const stored =
      localStorage.getItem(
        "user_data"
      );

    if (!stored) return null;

    try {
      const parsed =
        JSON.parse(stored);

      return (
        parsed.id ||
        parsed.user_id ||
        null
      );
    } catch {
      return null;
    }
  };

  useEffect(() => {
    async function loadUserCardStatus() {
      const stored =
        localStorage.getItem(
          "user_data"
        );

      const cardId =
        card.id ||
        card.source_id;

      if (!stored || !cardId) return;

      try {
        const parsed =
          JSON.parse(stored);

        const userId =
          parsed.id ||
          parsed.user_id;

        if (!userId) return;

        const status =
          await getCardUserStatus(
            Number(userId),
            String(cardId)
          );

        setPortfolioGrades(
          status.portfolioGrades ||
            []
        );

        setWatchlistGrades(
          status.watchlistGrades ||
            []
        );
      } catch (error) {
        console.error(
          "Failed to load card user status:",
          error
        );
      }
    }

    loadUserCardStatus();
  }, [
    card.id,
    card.source_id,
  ]);

  const salesByGrade =
    useMemo(() => {
      return (
        card.historicalSales ||
        card.historical_sales ||
        {}
      );
    }, [card]);

  const activeHistoricalSales =
    useMemo(() => {
      if (!salesByGrade) {
        return [];
      }

      let rawSales: any[] = [];

      if (
        Array.isArray(
          salesByGrade
        )
      ) {
        rawSales =
          salesByGrade;
      } else if (
        selectedGrade === "Raw"
      ) {
        rawSales =
          salesByGrade.raw ||
          [];
      } else {
        rawSales =
          salesByGrade[
            selectedGradeNumber
          ] || [];
      }

      return rawSales
        .map((sale: any) => {
          const parsedPrice =
            parseMoney(
              sale.price
            );

          const parsedDate =
            sale.soldDate ||
            sale.sold_date;

          const parsedDateObj =
            parsedDate
              ? new Date(
                  parsedDate
                )
              : new Date();

          return {
            ...sale,
            numericPrice:
              parsedPrice,
            dateObj:
              parsedDateObj,
            soldDate:
              sale.soldDate ||
              sale.sold_date ||
              "Recent",
          };
        })
        .sort(
          (
            a: any,
            b: any
          ) =>
            b.dateObj.getTime() -
            a.dateObj.getTime()
        );
    }, [
      salesByGrade,
      selectedGrade,
      selectedGradeNumber,
    ]);

  const salesTabData =
    useMemo(() => {
      let rawSales: any[] = [];

      if (
        Array.isArray(
          salesByGrade
        )
      ) {
        rawSales =
          salesByGrade;
      } else if (
        salesGrade === "Raw"
      ) {
        rawSales =
          salesByGrade?.raw ||
          [];
      } else {
        const gradeNumber =
          getGradeNumber(
            salesGrade
          );

        rawSales =
          salesByGrade?.[
            gradeNumber
          ] || [];
      }

      return rawSales
        .map((sale: any) => {
          const parsedPrice =
            parseMoney(
              sale.price
            );

          const parsedDate =
            sale.soldDate ||
            sale.sold_date;

          const parsedDateObj =
            parsedDate
              ? new Date(
                  parsedDate
                )
              : new Date();

          return {
            ...sale,
            numericPrice:
              parsedPrice,
            dateObj:
              parsedDateObj,
            soldDate:
              sale.soldDate ||
              sale.sold_date ||
              "Recent",
          };
        })
        .sort(
          (
            a: any,
            b: any
          ) =>
            b.dateObj.getTime() -
            a.dateObj.getTime()
        )
        .slice(0, 50);
    }, [
      salesByGrade,
      salesGrade,
    ]);

  const currentDisplayPrice =
    useMemo(() => {
      if (
        activeHistoricalSales.length >
        0
      ) {
        return (
          activeHistoricalSales[0]
            ?.price ||
          formatMoney(
            activeHistoricalSales[0]
              .numericPrice
          )
        );
      }

      const resolvedGradeNumber =
        String(
          card.resolvedGrade ||
            ""
        ).replace(
          /[^0-9]/g,
          ""
        );

      if (
        selectedGradeNumber ===
          resolvedGradeNumber &&
        card.price
      ) {
        return card.price;
      }

      return "$0.00";
    }, [
      activeHistoricalSales,
      selectedGradeNumber,
      card,
    ]);

  const numericCurrentPrice =
    useMemo(
      () =>
        parseMoney(
          currentDisplayPrice
        ),
      [currentDisplayPrice]
    );

  const chartData =
    useMemo(() => {
      if (
        activeHistoricalSales.length ===
        0
      ) {
        if (
          !numericCurrentPrice
        ) {
          return [];
        }

        const base =
          numericCurrentPrice;

        return [
          base * 0.92,
          base * 0.94,
          base * 0.93,
          base * 0.96,
          base * 0.95,
          base * 0.98,
          base * 0.97,
          base,
        ];
      }

      const now =
        new Date();

      const timeframeDays: Record<
        string,
        number
      > = {
        "1D": 1,
        "7D": 7,
        "30D": 30,
        "1M": 30,
        "3M": 90,
        "1Y": 365,
      };

      const maxDays =
        timeframeDays[
          selectedTimeframe
        ];

      const filtered =
        maxDays
          ? activeHistoricalSales.filter(
              (sale: any) => {
                const diff =
                  Math.abs(
                    now.getTime() -
                      sale.dateObj.getTime()
                  );

                const days =
                  Math.ceil(
                    diff /
                      (1000 *
                        60 *
                        60 *
                        24)
                  );

                return (
                  days <= maxDays
                );
              }
            )
          : activeHistoricalSales;

      const dataset =
        filtered.length
          ? filtered
          : activeHistoricalSales;

      return dataset
        .map(
          (sale: any) =>
            sale.numericPrice
        )
        .reverse();
    }, [
      activeHistoricalSales,
      selectedTimeframe,
      numericCurrentPrice,
    ]);

  const svgPath =
    useMemo(() => {
      if (
        chartData.length < 2
      ) {
        return "";
      }

      const width = 720;
      const height = 280;
      const paddingX = 22;
      const paddingY = 24;

      const minValue =
        Math.min(
          ...chartData
        );

      const maxValue =
        Math.max(
          ...chartData
        );

      const range =
        maxValue -
          minValue ||
        1;

      return chartData
        .map(
          (
            value,
            index
          ) => {
            const x =
              paddingX +
              (index /
                (chartData.length -
                  1)) *
                (width -
                  paddingX * 2);

            const y =
              height -
              paddingY -
              ((value -
                minValue) /
                range) *
                (height -
                  paddingY * 2);

            return `${
              index === 0
                ? "M"
                : "L"
            } ${x} ${y}`;
          }
        )
        .join(" ");
    }, [chartData]);

  const chartStats =
    useMemo(() => {
      if (
        !chartData.length
      ) {
        return {
          low: "$0.00",
          high: "$0.00",
          change: "$0.00",
          changePercent: "0.0%",
          positive: true,
        };
      }

      const low =
        Math.min(
          ...chartData
        );

      const high =
        Math.max(
          ...chartData
        );

      const first =
        chartData[0];

      const last =
        chartData[
          chartData.length - 1
        ];

      const change =
        last - first;

      const percent =
        first > 0
          ? (change / first) *
            100
          : 0;

      return {
        low:
          formatMoney(low),
        high:
          formatMoney(high),
        change:
          formatMoney(
            Math.abs(change)
          ),
        changePercent:
          `${Math.abs(
            percent
          ).toFixed(1)}%`,
        positive:
          change >= 0,
      };
    }, [chartData]);

  const fallbackSidebarAd =
    card.ad ||
    card.advert || {
      id: -1,
      provider: "internal",
      placement:
        "card_details_sidebar",
      title:
        "Advert Placement",
      subtitle:
        "Admin-controlled sponsored card slot",
      description:
        "Use this placement for grading partners, marketplace promotions, set launches, or collector campaigns.",
      cta_label:
        "Manage in Admin",
      image_url: "",
      target_url:
        "/admin/adverts",
      status: "active",
      priority: 0,
      weight: 1,
    };

  const {
    activeAdvert: activeAd,
    loading: sidebarAdLoading,
  } = useAdvertRotation({
    placement:
      "card_details_sidebar",
    fallback:
      fallbackSidebarAd,
    limit: 20,
  });

  const advertImage =
    activeAd?.image_url ||
    activeAd?.imageUrl ||
    activeAd?.image ||
    "";

  const renderImageOnlyAdvert = (
    className: string
  ) => {
    if (sidebarAdLoading) {
      return (
        <div
          className={`${className} animate-pulse rounded-[18px] border border-slate-200/80 bg-slate-100 dark:border-white/10 dark:bg-white/5`}
          aria-hidden="true"
        />
      );
    }

    if (!advertImage) {
      return null;
    }

    return (
      <button
        type="button"
        onClick={handleAdClick}
        className={`block w-full overflow-hidden rounded-[18px] border border-slate-200/80 bg-transparent text-left transition-opacity hover:opacity-95 dark:border-white/10 ${className}`}
        aria-label="Open sponsored advert"
      >
        <img
          src={advertImage}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </button>
    );
  };

  const marketplaceRows =
    useMemo(
      () =>
        getMarketplaceRows(
          card,
          currentDisplayPrice
        ),
      [
        card,
        currentDisplayPrice,
      ]
    );

  const assetRows = [
    [
      "Series",
      cleanDisplay(
        cardSeries
      ),
    ],
    [
      "Set",
      cleanDisplay(cardSet),
    ],
    [
      "Card Number",
      cleanDisplay(
        card.number
      ),
    ],
    [
      "Rarity",
      cleanDisplay(
        cardType
      ),
    ],
    [
      "Type",
      cleanDisplay(
        card.type ||
          card.supertype ||
          "Pokémon"
      ),
    ],
    // [
    //   "HP",
    //   cleanDisplay(
    //     card.hp
    //   ),
    // ],
    [
      "Artist",
      cleanDisplay(
        card.artist
      ),
    ],
     [
      "Subtypes",
      cleanDisplay(
        card.subtypes ||
          card.subtype ||
          "Basic"
      ),
    ],
    [
      "Released",
      normalizeDate(
        card.releaseDate ||
          card.release_date
      ),
    ],
  ];

  const handleAddToPortfolio =
    async () => {
      setAddMessage("");

      const userId =
        getCurrentUserId();

      const cardId =
        card.id ||
        card.source_id;

      if (!userId) {
        setAddMessage(
          "Please log in to add this card."
        );
        return;
      }

      if (!cardId) {
        setAddMessage(
          "Missing card information."
        );
        return;
      }

      setAddingToPortfolio(true);

      const result =
        await addCardToPortfolio({
          user_id:
            Number(userId),
          card_id:
            String(cardId),
          grade:
            portfolioGrade,
        });

      setAddingToPortfolio(false);

      if (result.success) {
        setPortfolioGrades(
          (previous) => {
            const existing =
              previous.find(
                (item) =>
                  String(
                    item.grade
                  ).toLowerCase() ===
                  String(
                    portfolioGrade
                  ).toLowerCase()
              );

            if (existing) {
              return previous.map(
                (item) =>
                  String(
                    item.grade
                  ).toLowerCase() ===
                  String(
                    portfolioGrade
                  ).toLowerCase()
                    ? {
                        ...item,
                        quantity:
                          Number(
                            item.quantity ||
                              1
                          ) + 1,
                      }
                    : item
              );
            }

            return [
              {
                grade:
                  portfolioGrade,
                quantity: 1,
                purchase_price: 0,
              },
              ...previous,
            ];
          }
        );

        setAddMessage(
          `${portfolioGrade} added to your portfolio.`
        );

        window.setTimeout(
          () => {
            setShowAddModal(
              false
            );
            setAddMessage("");
            router.refresh();
          },
          700
        );
      } else {
        setAddMessage(
          result.message ||
            "Could not add card."
        );
      }
    };

  const handleAddToWatchlist =
    async () => {
      const userId =
        getCurrentUserId();

      const cardId =
        card.id ||
        card.source_id;

      if (!userId) {
        router.push("/login");
        return;
      }

      if (!cardId || addingToWatchlist) {
        return;
      }

      setAddingToWatchlist(true);

      try {
        const result =
          await addCardToWatchlist({
            user_id: Number(userId),
            card_id: String(cardId),
            grade: selectedGrade || "Raw",
          });

        if (result?.success) {
          setWatchlistGrades((previous) => {
            const activeGrade =
              selectedGrade || "Raw";
            const exists = previous.some(
              (item) =>
                String(
                  typeof item === "string"
                    ? item
                    : item?.grade ||
                        item?.card_grade ||
                        item?.cardGrade ||
                        ""
                ).toLowerCase() ===
                activeGrade.toLowerCase()
            );

            return exists
              ? previous
              : [{ grade: activeGrade }, ...previous];
          });
        } else {
          console.error(
            "Could not add card to watchlist:",
            result?.message || "Unknown error"
          );
        }
      } catch (error) {
        console.error(
          "Failed to add card to watchlist:",
          error
        );
      } finally {
        setAddingToWatchlist(false);
      }
    };

  const handleShare =
    async () => {
      const shareData = {
        title: `${cardName} - ${cardSet}`,
        text: `Track real-time valuations and population statistics for ${cardName} on CardMarketCap.`,
        url:
          typeof window !==
          "undefined"
            ? window.location.href
            : "",
      };

      if (
        typeof navigator !== "undefined" &&
        navigator.share &&
        (!navigator.canShare || navigator.canShare(shareData))
      ) {
        try {
          await navigator.share(shareData);
        } catch (error) {
          if ((error as DOMException)?.name !== "AbortError") {
            console.error("Native share failed:", error);
          }
        }
      } else {
        try {
          await navigator.clipboard.writeText(window.location.href);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        } catch (error) {
          console.error("Could not copy share link:", error);
        }
      }
    };

  const handleBack = (
    event: React.MouseEvent
  ) => {
    event.preventDefault();

    if (
      window.history.length >
      1
    ) {
      router.back();
    } else {
      router.push("/");
    }
  };

  const handleAdClick =
    () => {
      const url =
        activeAd?.target_url ||
        activeAd?.targetUrl ||
        activeAd?.url;

      if (!url) return;

      if (
        String(url).startsWith(
          "http"
        )
      ) {
        window.open(
          url,
          "_blank",
          "noopener,noreferrer"
        );
      } else {
        router.push(url);
      }
    };

  const openMarketplace = (
    row: MarketplaceRow
  ) => {
    if (!row.url) return;

    if (
      row.url.startsWith(
        "http"
      )
    ) {
      window.open(
        row.url,
        "_blank",
        "noopener,noreferrer"
      );
    } else {
      router.push(row.url);
    }
  };

  const updateColumnScrollHints = () => {
    const getHasMore = (
      element: HTMLElement | null
    ) => {
      if (!element) return false;

      return (
        element.scrollHeight -
          element.clientHeight -
          element.scrollTop >
        8
      );
    };

    setColumnHasMore({
      left: getHasMore(
        leftColumnRef.current
      ),
      middle: getHasMore(
        middleColumnRef.current
      ),
      right: getHasMore(
        rightColumnRef.current
      ),
    });
  };

  useEffect(() => {
    const columns = [
      leftColumnRef.current,
      middleColumnRef.current,
      rightColumnRef.current,
    ].filter(Boolean) as HTMLElement[];

    const handleUpdate = () => {
      updateColumnScrollHints();
    };

    handleUpdate();

    columns.forEach((column) => {
      column.addEventListener(
        "scroll",
        handleUpdate,
        { passive: true }
      );
    });

    window.addEventListener(
      "resize",
      handleUpdate
    );

    const frame = window.requestAnimationFrame(
      handleUpdate
    );

    return () => {
      columns.forEach((column) => {
        column.removeEventListener(
          "scroll",
          handleUpdate
        );
      });

      window.removeEventListener(
        "resize",
        handleUpdate
      );

      window.cancelAnimationFrame(frame);
    };
  }, [card, activeAd, salesTabData.length]);

  const scrollColumnDown = (
    column:
      | "left"
      | "middle"
      | "right"
  ) => {
    const element =
      column === "left"
        ? leftColumnRef.current
        : column === "middle"
          ? middleColumnRef.current
          : rightColumnRef.current;

    if (!element) return;

    element.scrollBy({
      top: Math.max(
        220,
        element.clientHeight * 0.72
      ),
      behavior: "smooth",
    });
  };

  const watchlisted =
    watchlistGrades.some(
      (item) =>
        String(
          typeof item === "string"
            ? item
            : item?.grade ||
                item?.card_grade ||
                item?.cardGrade ||
                ""
        ).toLowerCase() ===
        String(
          selectedGrade
        ).toLowerCase()
    );

  return (
    <div className="min-h-screen bg-white text-slate-950 dark:bg-[#020617] dark:text-slate-100">
      <Navbar />

      <div className="lg:hidden">
        <Sidebar />
      </div>

      <div className="hidden lg:block">
        <CardDetailsTopBar
          card={card}
          cardName={cardName}
          cardSet={cardSet}
          onBack={handleBack}
        />
      </div>

      <main className="mx-auto w-full max-w-[1540px] px-4 pb-5 pt-[88px] md:px-6 md:pb-6 md:pt-[96px] lg:px-8 lg:pb-8 lg:pt-6">
        {/* Mobile opening layout: rendered directly on the page background. */}
        <section className="mb-7 grid grid-cols-[minmax(126px,42%)_minmax(0,1fr)] items-start gap-4 lg:hidden">
          <div className="min-w-0">
            <div className="flex min-w-0 items-start justify-center">
              <img
                src={cardImage}
                alt={cardName}
                className="aspect-[0.715/1] h-auto w-full object-contain drop-shadow-[0_10px_18px_rgba(15,23,42,0.14)]"
                loading="eager"
                decoding="async"
              />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2" aria-label="Card actions">
              <button
                type="button"
                onClick={handleAddToWatchlist}
                disabled={addingToWatchlist || watchlisted}
                aria-pressed={watchlisted}
                className={`inline-flex min-h-9 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg border px-2 text-[11px] font-semibold transition-colors disabled:cursor-default ${
                  watchlisted
                    ? "border-[#00BA88]/35 bg-[#00BA88]/10 text-[#00BA88]"
                    : "border-slate-200 bg-white text-slate-700 hover:border-[#00BA88]/45 hover:text-[#00BA88] dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                }`}
              >
                {/* {addingToWatchlist ? (
                  <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" aria-hidden="true" />
                ) : (
                  <Star
                    className={`h-3.5 w-3.5 shrink-0 ${watchlisted ? "fill-current" : ""}`}
                    aria-hidden="true"
                  />
                )} */}
                <span className="truncate">
                  {watchlisted ? "Saved" : "Watch"}
                </span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="inline-flex min-h-9 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 text-[11px] font-semibold text-slate-700 transition-colors hover:border-[#00BA88]/45 hover:text-[#00BA88] dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
              >
                {/* {copied ? (
                  <Check className="h-3.5 w-3.5 shrink-0 text-[#00BA88]" aria-hidden="true" />
                ) : (
                  <Share2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                )} */}
                <span className="truncate">{copied ? "Copied" : "Share"}</span>
              </button>
            </div>
          </div>

          <div className="min-w-0 py-0.5">
            {/* <button
              type="button"
              onClick={handleBack}
              className="mb-2 inline-flex cursor-pointer items-center text-[11px] font-semibold text-slate-500 transition-colors hover:text-[#00BA88] dark:text-slate-400"
              aria-label="Go back"
            >
              ← Back
            </button> */}

            <h1 className="break-words text-[clamp(1.25rem,5.4vw,1.75rem)] font-black leading-[1.08] tracking-[-0.035em] text-slate-950 dark:text-white">
              {cardName}
            </h1>

            {mobileCardSummary.length > 0 && (
              <p
                className="mt-2 min-w-0 break-words text-[11px] font-semibold leading-[1.55] text-slate-500 dark:text-slate-400"
                aria-label="Card summary"
              >
                {mobileCardSummary.map((item, index) => (
                  <React.Fragment key={`${item}-${index}`}>
                    {index > 0 && (
                      <span className="mx-1.5 text-slate-300 dark:text-slate-600" aria-hidden="true">
                        |
                      </span>
                    )}
                    <span>{item}</span>
                  </React.Fragment>
                ))}
              </p>
            )}

            <div className="mt-3 border-t border-slate-200/80 pt-3 dark:border-white/10">
              <dl className="grid min-w-0 grid-cols-2 gap-x-3 gap-y-2.5">
                {assetRows.map(([label, value]) => (
                  <div key={label} className="min-w-0">
                    <dt className="text-[10px] font-medium leading-tight text-slate-400 dark:text-slate-500">
                      {label}
                    </dt>
                    <dd
                      title={value}
                      className="mt-1 break-words text-[11px] font-semibold leading-[1.3] text-slate-800 dark:text-slate-200"
                    >
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <div className="relative grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(240px,0.88fr)_minmax(0,1.8fr)_minmax(285px,0.94fr)] xl:gap-6">
          <aside
            ref={leftColumnRef}
            className="cmc-column-scroll contents lg:sticky lg:top-[132px] lg:block lg:max-h-[calc(100dvh-148px)] lg:space-y-5 lg:overflow-y-auto lg:overscroll-auto lg:pr-1"
          >
            <div className="hidden lg:block">
              <CardMediaPanel
                cardImage={cardImage}
                cardName={cardName}
                watchlisted={watchlisted}
                addingToWatchlist={addingToWatchlist}
                onWatchlist={handleAddToWatchlist}
                copied={copied}
                onShare={handleShare}
              />
            </div>

            <div className="order-3 hidden lg:block">
              <AssetSpecifications
                rows={assetRows as Array<[string, string]>}
              />
            </div>
          </aside>

          <section
            ref={middleColumnRef}
            className="cmc-column-scroll contents lg:sticky lg:top-[132px] lg:block lg:min-w-0 lg:max-h-[calc(100dvh-148px)] lg:space-y-5 lg:overflow-y-auto lg:overscroll-auto lg:px-1"
          >
            <div className="order-2">
              <CardMarketOverviewPanel
              card={card}
              cardName={cardName}
              cardSet={cardSet}
              cardType={cardType}
              grades={ALL_GRADES}
              selectedGrade={selectedGrade}
              onGradeChange={(grade) => {
                setSelectedGrade(
                  grade
                );

                if (
                  SALES_GRADES.includes(
                    grade
                  )
                ) {
                  setSalesGrade(
                    grade
                  );
                }
              }}
              currentDisplayPrice={currentDisplayPrice}
              chartStats={chartStats}
              chartData={chartData}
              timeframes={TIMEFRAMES}
              selectedTimeframe={selectedTimeframe}
              onTimeframeChange={setSelectedTimeframe}
              svgPath={svgPath}
              />
            </div>

            <div className="order-4">
              <PopulationPanel
                popData={popData}
                totalPop={Number(
                  popData.total ||
                    card.popTotal ||
                    0
                )}
                selectedGrade={selectedGrade}
                onGradeChange={(grade) => {
                  setSelectedGrade(
                    grade
                  );

                  if (
                    SALES_GRADES.includes(
                      grade
                    )
                  ) {
                    setSalesGrade(
                      grade
                    );
                  }
                }}
              />
            </div>

            <div className="order-8">
              <div className="mb-2 flex items-center justify-end lg:hidden">
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                  Swipe for more
                  <span aria-hidden="true">→</span>
                </span>
              </div>

              <SalesHistoryPanel
                salesGrades={SALES_GRADES}
                salesGrade={salesGrade}
                salesByGrade={salesByGrade}
                sales={salesTabData}
                onGradeChange={(grade) => {
                  setSalesGrade(
                    grade
                  );
                  setSelectedGrade(
                    grade
                  );
                }}
              />
            </div>
          </section>

          <aside
            ref={rightColumnRef}
            className="cmc-column-scroll contents lg:sticky lg:top-[132px] lg:block lg:max-h-[calc(100dvh-148px)] lg:space-y-5 lg:overflow-y-auto lg:overscroll-auto lg:pl-1"
          >
            <div className="order-5">
              {renderImageOnlyAdvert(
                "aspect-[16/9]"
              )}
            </div>

            <div className="order-6">
              <MarketSuggestions
                card={card}
                selectedGrade={selectedGrade}
              />
            </div>

            <div className="order-7">
              <PriceComparison
                card={card}
                selectedGrade={selectedGrade}
                fallbackRows={marketplaceRows}
                onOpen={openMarketplace}
              />
            </div>
          </aside>

          <div className="pointer-events-none absolute inset-0 hidden lg:grid lg:grid-cols-[minmax(240px,0.88fr)_minmax(0,1.8fr)_minmax(285px,0.94fr)] lg:gap-5 xl:gap-6">
            <div className="relative">
              {columnHasMore.left && (
                <div className="absolute inset-x-0 bottom-2 flex justify-center">
                  <button
                    type="button"
                    onClick={() =>
                      scrollColumnDown("left")
                    }
                    className="pointer-events-auto relative inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#00BA88]/35 bg-white text-[#00BA88] shadow-[0_5px_18px_rgba(0,186,136,0.16)] ring-4 ring-white/85 backdrop-blur transition hover:-translate-y-0.5 hover:border-[#00BA88]/60 hover:shadow-[0_7px_22px_rgba(0,186,136,0.22)] dark:border-[#00BA88]/35 dark:bg-slate-950 dark:text-[#00BA88] dark:ring-[#020617]/85"
                    aria-label="Scroll left column for more"
                    title="More below"
                  >
                    <span
                      className="absolute -top-1 h-1.5 w-1.5 animate-pulse rounded-full bg-[#00BA88]"
                      aria-hidden="true"
                    />
                    <ChevronDown
                      className="h-4 w-4"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              )}
            </div>

            <div className="relative">
              {columnHasMore.middle && (
                <div className="absolute inset-x-0 bottom-2 flex justify-center">
                  <button
                    type="button"
                    onClick={() =>
                      scrollColumnDown("middle")
                    }
                    className="pointer-events-auto relative inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#00BA88]/35 bg-white text-[#00BA88] shadow-[0_5px_18px_rgba(0,186,136,0.16)] ring-4 ring-white/85 backdrop-blur transition hover:-translate-y-0.5 hover:border-[#00BA88]/60 hover:shadow-[0_7px_22px_rgba(0,186,136,0.22)] dark:border-[#00BA88]/35 dark:bg-slate-950 dark:text-[#00BA88] dark:ring-[#020617]/85"
                    aria-label="Scroll middle column for more"
                    title="More below"
                  >
                    <span
                      className="absolute -top-1 h-1.5 w-1.5 animate-pulse rounded-full bg-[#00BA88]"
                      aria-hidden="true"
                    />
                    <ChevronDown
                      className="h-4 w-4"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              )}
            </div>

            <div className="relative">
              {columnHasMore.right && (
                <div className="absolute inset-x-0 bottom-2 flex justify-center">
                  <button
                    type="button"
                    onClick={() =>
                      scrollColumnDown("right")
                    }
                    className="pointer-events-auto relative inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#00BA88]/35 bg-white text-[#00BA88] shadow-[0_5px_18px_rgba(0,186,136,0.16)] ring-4 ring-white/85 backdrop-blur transition hover:-translate-y-0.5 hover:border-[#00BA88]/60 hover:shadow-[0_7px_22px_rgba(0,186,136,0.22)] dark:border-[#00BA88]/35 dark:bg-slate-950 dark:text-[#00BA88] dark:ring-[#020617]/85"
                    aria-label="Scroll right column for more"
                    title="More below"
                  >
                    <span
                      className="absolute -top-1 h-1.5 w-1.5 animate-pulse rounded-full bg-[#00BA88]"
                      aria-hidden="true"
                    />
                    <ChevronDown
                      className="h-4 w-4"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="hidden lg:flex lg:justify-center lg:pt-5">
          <div
            className="h-px w-[72%] max-w-[1120px] bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-white/10"
            aria-hidden="true"
          />
        </div>

        <div className="mt-5 lg:mt-7">
          {renderImageOnlyAdvert(
            "aspect-[5/1] lg:aspect-[7/1]"
          )}
        </div>
      </main>

      <style jsx global>{`
        .cmc-column-scroll,
        .cmc-tab-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .cmc-column-scroll::-webkit-scrollbar,
        .cmc-tab-scroll::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }

        @media (min-width: 1024px) {
          .cmc-column-scroll {
            padding-bottom: 12px;
            overscroll-behavior-y: auto;
          }
        }
      `}</style>

      <AddToPortfolioModal
        open={showAddModal}
        cardImage={cardImage}
        cardName={cardName}
        cardSet={cardSet}
        currentDisplayPrice={currentDisplayPrice}
        grades={ALL_GRADES}
        selectedGrade={portfolioGrade}
        adding={addingToPortfolio}
        message={addMessage}
        onClose={() =>
          setShowAddModal(false)
        }
        onGradeChange={setPortfolioGrade}
        onSubmit={handleAddToPortfolio}
      />
    </div>
  );
}

