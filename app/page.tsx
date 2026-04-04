// page.tsx
import { Footer } from "@/components/Footer";
import { MarketStats } from "@/components/MarketStats"
import { MarketTable } from "@/components/MarketTable"
import { Newsletter } from "@/components/Newsletter";
import { MarketTicker } from "@/components/MarketTicker"; // New Import
import { fetchCMCCards, fetchMarketStats } from "@/lib/queries/market" 

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }> | { page?: string }
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  const [cardResponse, statsResponse] = await Promise.all([
    fetchCMCCards(currentPage),
    fetchMarketStats()
  ]);

  const { data, metadata } = cardResponse;
  const apiStats = statsResponse?.stats || [];

  // Sync calculations for the ticker
  const totalCardsCount = metadata?.total_records || 0;
  // Use PSA 10 value from apiStats if available, else fallback
  const psa10Value = apiStats.find((s: any) => s.label === "PSA 10 Index")?.value || "5.43K";
  const marketVol = apiStats.find((s: any) => s.label === "Total Market Cap")?.value || "$1.2B";

  const synchronizedStats = [
    {
      label: "Total Market Cap",
      value: marketVol,
      change: apiStats.find((s: any) => s.label === "Total Market Cap")?.change || "+2.1%",
      trend: apiStats.find((s: any) => s.label === "Total Market Cap")?.trend || "up",
    },
    {
      label: "Tracked Cards",
      value: totalCardsCount.toLocaleString(),
      change: "Live",
      trend: "up",
    },
    {
       label: "PSA 10 Index",
       value: psa10Value,
       change: apiStats.find((s: any) => s.label === "PSA 10 Index")?.change || "+0.6%",
       trend: "up",
    },
    {
      label: "Modern 100",
      value: apiStats.find((s: any) => s.label === "Modern 100")?.value || "1,042",
      change: apiStats.find((s: any) => s.label === "Modern 100")?.change || "-0.4%",
      trend: "down",
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#020617] transition-colors duration-300">
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 md:px-10 pt-20 pb-8 md:py-12">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <nav className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00BA88]">Analytics</span>
              <span className="text-slate-300 dark:text-slate-700 text-[10px]">/</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Market Intelligence</span>
            </nav>
            <div className="space-y-3">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-black tracking-tight text-slate-950 dark:text-white leading-tight">
                Pokémon Graded Card Tracker
                <span className="ml-3 inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                  PSA Verified
                </span>
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Showing {totalCardsCount.toLocaleString()} total cards across the global market.
              </p>
            </div>
          </div>
        </header>

        <section className="md:mb-8">
          <MarketStats initialStats={synchronizedStats} />
        </section>

        <section className="animate-in fade-in slide-in-from-bottom-4 duration-1000 mb-12">
          <MarketTable 
            initialCards={data} 
            totalRecords={totalCardsCount}
            totalPages={metadata?.total_pages || 0}
            currentPage={currentPage}
          />
        </section>
      </main>

      <div className="w-full pb-10"> {/* Added padding so ticker doesn't hide newsletter */}
        <Newsletter />
      </div>

      <Footer />

      {/* FIXED TICKER AT THE BOTTOM */}
      <MarketTicker 
        totalCards={totalCardsCount}
        psa10Pop={psa10Value}
        volume30d={marketVol}
      />
    </div>
  )
}