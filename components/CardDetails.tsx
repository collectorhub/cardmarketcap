"use client";

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import { addCardToPortfolio } from "@/lib/queries/portfolio";
import { addCardToWatchlist } from "@/lib/queries/watchlist";
import { getCardUserStatus } from "@/lib/queries/status";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useAdvertRotation } from "@/hooks/useAdvertRotation";
import MarketSuggestions from "@/components/card-details/MarketSuggestions";
import SponsoredAdvert from "@/components/card-details/SponsoredAdvert";
import BottomSponsoredAdvert from "@/components/card-details/BottomSponsoredAdvert";
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
  "1D",
  "7D",
  "30D",
  "1M",
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
  ] = useState("1M");

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
    [
      "Subtypes",
      cleanDisplay(
        card.subtypes ||
          card.subtype ||
          "Basic"
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

      if (
        !userId ||
        !cardId ||
        addingToWatchlist
      ) {
        return;
      }

      setAddingToWatchlist(
        true
      );

      const result =
        await addCardToWatchlist({
          user_id:
            Number(userId),
          card_id:
            String(cardId),
          grade:
            selectedGrade ||
            "Raw",
        });

      setAddingToWatchlist(
        false
      );

      if (result.success) {
        setWatchlistGrades(
          (previous) => {
            const exists =
              previous.some(
                (item) =>
                  String(
                    item.grade
                  ).toLowerCase() ===
                  String(
                    selectedGrade
                  ).toLowerCase()
              );

            if (exists) {
              return previous;
            }

            return [
              {
                grade:
                  selectedGrade,
              },
              ...previous,
            ];
          }
        );
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
        navigator.share &&
        navigator.canShare?.(
          shareData
        )
      ) {
        try {
          await navigator.share(
            shareData
          );
        } catch (error) {
          console.log(
            "Native share failed:",
            error
          );
        }
      } else {
        await navigator.clipboard.writeText(
          window.location.href
        );

        setCopied(true);

        window.setTimeout(
          () =>
            setCopied(false),
          2000
        );
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

  const watchlisted =
    watchlistGrades.some(
      (item) =>
        String(
          item.grade
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

      <CardDetailsTopBar
        card={card}
        cardName={cardName}
        cardSet={cardSet}
        onBack={handleBack}
      />

      <main className="mx-auto w-full max-w-[1540px] px-4 py-5 md:px-6 md:py-6 lg:px-8 lg:pb-8">
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(240px,0.88fr)_minmax(0,1.8fr)_minmax(285px,0.94fr)] xl:gap-6">
          <aside className="cmc-column-scroll contents lg:sticky lg:top-[132px] lg:block lg:max-h-[calc(100dvh-148px)] lg:space-y-5 lg:overflow-y-auto lg:overscroll-auto lg:pr-1">
            <div className="order-1">
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

            <div className="order-3">
              <AssetSpecifications
                rows={assetRows as Array<[string, string]>}
              />
            </div>
          </aside>

          <section className="cmc-column-scroll contents lg:sticky lg:top-[132px] lg:block lg:min-w-0 lg:max-h-[calc(100dvh-148px)] lg:space-y-5 lg:overflow-y-auto lg:overscroll-auto lg:px-1">
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

          <aside className="cmc-column-scroll contents lg:sticky lg:top-[132px] lg:block lg:max-h-[calc(100dvh-148px)] lg:space-y-5 lg:overflow-y-auto lg:overscroll-auto lg:pl-1">
            <div className="order-5">
              <SponsoredAdvert
                advert={activeAd}
                loading={sidebarAdLoading}
                onClick={handleAdClick}
              />
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
        </div>

        <BottomSponsoredAdvert
          advert={activeAd}
          loading={sidebarAdLoading}
          onClick={handleAdClick}
        />
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

