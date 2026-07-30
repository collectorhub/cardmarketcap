// app/page.tsx
import { MarketStats } from "@/components/MarketStats";
import { MarketTable } from "@/components/MarketTable";
import { Newsletter } from "@/components/Newsletter";
import { MarketTicker } from "@/components/MarketTicker";
import MarketSuggestionsStrip from "@/components/market/MarketSuggestionsStrip";
import {
  fetchCMCCards,
  fetchMarketStats,
} from "@/lib/queries/market";
import {
  fetchEbayShopListings,
} from "@/lib/queries/ebay";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

const MARKET_PAGE_SIZE = 100;
const MARKET_SUGGESTIONS_LIMIT = 12;

function toPositiveInteger(
  value: unknown,
  fallback: number
) {
  const parsed = Number(value);

  return Number.isFinite(parsed) &&
    parsed > 0
    ? Math.floor(parsed)
    : fallback;
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    q?: string;
    sort?: string;
    category?: string;
    grade?: string;
  }>;
}) {
  const params =
    await searchParams;

  const currentPage =
    toPositiveInteger(
      params.page,
      1
    );

  const search =
    params.q ||
    params.search ||
    "";

  const sort =
    params.sort || "top";

  const category =
    params.category || "all";

  const grade =
    params.grade || "psa 10";

  const marketSuggestionQuery =
    search.trim() !== ""
      ? `${search.trim()} PSA graded Pokemon card`
      : "Pokemon PSA graded card";

  const [
    cardResponse,
    statsResponse,
    marketSuggestionResponse,
  ] = await Promise.all([
    fetchCMCCards(
      currentPage,
      search,
      sort,
      category,
      grade,
      "pokemon",
      MARKET_PAGE_SIZE
    ),
    fetchMarketStats(),
    fetchEbayShopListings({
      section: "graded",
      search:
        marketSuggestionQuery,
      sort: "best_match",
      limit:
        MARKET_SUGGESTIONS_LIMIT,
      offset: 0,
    }),
  ]);

  const rawCards =
    Array.isArray(
      cardResponse?.data
    )
      ? cardResponse.data
      : [];

  const metadata =
    cardResponse?.metadata ||
    {};

  const dataWithPsa =
    rawCards.map(
      (card: any) => {
        let searchGrade =
          grade
            .toLowerCase()
            .replace(
              /\s+/g,
              ""
            ) ||
          "psa10";

        if (
          searchGrade === "all"
        ) {
          searchGrade =
            "psa10";
        }

        return {
          ...card,

          gradeCount:
            card.gradeCount ||
            card[
              searchGrade
            ] ||
            "0",

          popTotal:
            card.popTotal ||
            card.total ||
            "0",

          sales30dNum:
            card.sales30dNum ||
            0,

          sales90dNum:
            card.sales90dNum ||
            0,

          avgPrice30dNum:
            card.avgPrice30dNum ||
            0,

          avgPrice90dNum:
            card.avgPrice90dNum ||
            0,

          liquidityScoreNum:
            card.liquidityScoreNum ||
            0,

          change7dNum:
            card.change7dNum ||
            0,

          change30dNum:
            card.change30dNum ||
            0,
        };
      }
    );

  const apiStats =
    statsResponse?.stats ||
    [];

  const globalTotalCount =
    toPositiveInteger(
      metadata.total_records,
      35051
    );

  const filteredTotalCount =
    toPositiveInteger(
      metadata.total_records,
      0
    );

  const metadataPageSize =
    toPositiveInteger(
      metadata.per_page ??
        metadata.page_size ??
        metadata.limit,
      metadata.total_pages > 0
        ? Math.max(
            1,
            Math.round(
              filteredTotalCount /
                Number(
                  metadata.total_pages
                )
            )
          )
        : MARKET_PAGE_SIZE
    );

  const resolvedPageSize =
    metadataPageSize ||
    MARKET_PAGE_SIZE;

  const resolvedTotalPages =
    toPositiveInteger(
      metadata.total_pages,
      Math.max(
        1,
        Math.ceil(
          filteredTotalCount /
            resolvedPageSize
        )
      )
    );

  const resolvedOffset =
    Number.isFinite(
      Number(metadata.offset)
    )
      ? Math.max(
          0,
          Math.floor(
            Number(
              metadata.offset
            )
          )
        )
      : (currentPage - 1) *
        resolvedPageSize;

  const currentMarketCap =
    metadata?.set_summary
      ?.total_market_value ||
    apiStats.find(
      (stat: any) =>
        stat.label ===
        "Total Market Cap"
    )?.value ||
    "$1.1B";

  const psa10Value =
    apiStats.find(
      (stat: any) =>
        stat.label ===
        "PSA 10 Index"
    )?.value ||
    "2,396";

  const synchronizedStats = [
    {
      label:
        "TOTAL MARKET CAP",
      value:
        currentMarketCap,
      change:
        apiStats.find(
          (stat: any) =>
            stat.label ===
            "Total Market Cap"
        )?.change ||
        "+2.1%",
      trend: "up",
    },
    {
      label:
        "TRACKED CARDS",
      value:
        globalTotalCount.toLocaleString(),
      change: "Live",
      trend: "up",
    },
    {
      label:
        "TOP 20 INDEX",
      value:
        apiStats.find(
          (stat: any) =>
            stat.label ===
            "Top 20 Index"
        )?.value ||
        "2,396",
      change:
        apiStats.find(
          (stat: any) =>
            stat.label ===
            "Top 20 Index"
        )?.change ||
        "+0.6%",
      trend: "up",
    },
    {
      label:
        "TOP 50 INDEX",
      value:
        apiStats.find(
          (stat: any) =>
            stat.label ===
            "Top 50 Index"
        )?.value ||
        "1,720",
      change:
        apiStats.find(
          (stat: any) =>
            stat.label ===
            "Top 50 Index"
        )?.change ||
        "-1.1%",
      trend: "down",
    },
  ];

  const marketSuggestions =
    Array.isArray(
      marketSuggestionResponse
        ?.results
    )
      ? marketSuggestionResponse.results
      : [];

  return (
    <div className="flex min-h-screen flex-col bg-[#F9FAFB] transition-colors duration-300 dark:bg-[#020617]">
      <Navbar />

      <div className="lg:hidden">
        <Sidebar />
      </div>

      <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 pb-8 pt-24 md:px-8 md:py-16">
        <header className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-1">
            <nav className="mb-2 flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00BA88]">
                Analytics
              </span>

              <span className="text-[10px] text-slate-300 dark:text-slate-700">
                /
              </span>

              <span className="hidden text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 md:block">
                Market Intelligence
              </span>
            </nav>

            <div className="space-y-3">
              <h1 className="text-2xl font-black leading-tight tracking-tight text-slate-950 dark:text-white md:text-3xl lg:text-4xl">
                Pokémon Graded Card Tracker

                <span className="ml-3 hidden items-center rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 md:inline-flex">
                  PSA Verified
                </span>
              </h1>

              <div className="flex flex-col gap-3">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Showing{" "}
                  {globalTotalCount.toLocaleString()}{" "}
                  total cards across the global market.
                </p>

                <div className="flex md:hidden">
                  <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                    PSA Verified
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="mb-8 md:mb-12">
          <MarketStats
            initialStats={
              synchronizedStats
            }
          />
        </section>

        <section
          id="market-table"
          className="animate-in fade-in slide-in-from-bottom-4 duration-1000"
        >
          <MarketTable
            initialCards={
              dataWithPsa
            }
            totalRecords={
              filteredTotalCount
            }
            totalPages={
              resolvedTotalPages
            }
            currentPage={
              currentPage
            }
            pageSize={
              resolvedPageSize
            }
            recordOffset={
              resolvedOffset
            }
          />

          <MarketSuggestionsStrip
            listings={
              marketSuggestions
            }
          />
        </section>
      </main>

      <div className="w-full pb-20">
        <Newsletter />
      </div>

      <MarketTicker
        totalCards={
          globalTotalCount
        }
        psa10Pop={
          psa10Value
        }
        volume30d={
          currentMarketCap
        }
      />
    </div>
  );
}
