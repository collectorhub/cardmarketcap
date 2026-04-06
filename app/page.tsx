// app/page.tsx
import { Footer } from "@/components/Footer";
import { MarketStats } from "@/components/MarketStats"
import { MarketTable } from "@/components/MarketTable"
import { Newsletter } from "@/components/Newsletter";
import { MarketTicker } from "@/components/MarketTicker";
import { fetchCMCCards, fetchMarketStats } from "@/lib/queries/market" 
import Navbar from "@/components/Navbar";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ 
    page?: string; 
    search?: string; 
    sort?: string; 
    category?: string; 
    grade?: string 
  }>
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const search = params.q || "";
  const sort = params.sort || "top";
  const category = params.category || "all";
  const grade = params.grade || "psa 10";

  const [cardResponse, statsResponse] = await Promise.all([
    // PASS ALL PARAMS HERE
    fetchCMCCards(currentPage, search, sort, category, grade),
    fetchMarketStats()
  ]);

  const { data, metadata } = cardResponse;
  const apiStats = statsResponse?.stats || [];

  // Sync calculations for the ticker and stats cards
  const totalCardsCount = metadata?.total_records || 0;
  const psa10Value = apiStats.find((s: any) => s.label === "PSA 10 Index")?.value || "2,396";
  const marketVol = apiStats.find((s: any) => s.label === "Total Market Cap")?.value || "$1.1B";

  const synchronizedStats = [
    {
      label: "TOTAL MARKET CAP",
      value: marketVol,
      change: apiStats.find((s: any) => s.label === "Total Market Cap")?.change || "+2.1%",
      trend: "up",
    },
    {
      label: "TRACKED CARDS",
      value: totalCardsCount.toLocaleString(),
      change: "Live",
      trend: "up",
    },
    {
       label: "PSA 10 INDEX",
       value: psa10Value,
       change: apiStats.find((s: any) => s.label === "PSA 10 Index")?.change || "+0.6%",
       trend: "up",
    },
    {
      label: "MODERN 100",
      value: apiStats.find((s: any) => s.label === "Modern 100")?.value || "1,720",
      change: apiStats.find((s: any) => s.label === "Modern 100")?.change || "-1.1%",
      trend: "down",
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB] dark:bg-[#020617] transition-colors duration-300">
      {/* NAVBAR: Manual render here because this page is outside /(root).
          This ensures the frontpage looks exactly like your design 
      */}
      <Navbar />

      {/* Main Content: pt-24 provides enough space for the fixed Navbar.
          We use max-w-[1600px] to match your dashboard's inner width.
      */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 md:px-10 pt-24 pb-8 md:py-16">
        
        {/* Header Section */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <nav className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00BA88]">Analytics</span>
              <span className="text-slate-300 dark:text-slate-700 text-[10px]">/</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Market Intelligence</span>
            </nav>
            <div className="space-y-3">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-slate-950 dark:text-white leading-tight">
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

        {/* Stats Grid Section */}
        <section className="mb-8 md:mb-12">
          <MarketStats initialStats={synchronizedStats} />
        </section>

        {/* Table Section */}
        <section  id="market-table" className="animate-in fade-in slide-in-from-bottom-4 duration-1000 mb-16">
  
          <MarketTable 
            initialCards={data} 
            totalRecords={totalCardsCount}
            totalPages={metadata?.total_pages || 0}
            currentPage={currentPage}
          />
        </section>
      </main>

      <div className="w-full pb-20">
        <Newsletter />
      </div>

      <Footer />

      {/* FIXED TICKER */}
      <MarketTicker 
        totalCards={totalCardsCount}
        psa10Pop={psa10Value}
        volume30d={marketVol}
      />
    </div>
  )
}