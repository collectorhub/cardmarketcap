// app/page.tsx
import { Footer } from "@/components/Footer";
import { MarketStats } from "@/components/MarketStats"
import { MarketTable } from "@/components/MarketTable"
import { Newsletter } from "@/components/Newsletter";
import { MarketTicker } from "@/components/MarketTicker";
import { fetchCMCCards, fetchMarketStats } from "@/lib/queries/market" 
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ 
    page?: string; 
    search?: string; 
    q?: string;
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

  // 1. Fetch search results AND a separate "Global" request with no search query
  const [cardResponse, globalResponse, statsResponse] = await Promise.all([
    fetchCMCCards(currentPage, search, sort, category, grade),
    fetchCMCCards(1, "", "top", category, grade), // This gets the true total
    fetchMarketStats()
  ]);

  const { data, metadata } = cardResponse;
  const apiStats = statsResponse?.stats || [];

  // 2. Use the metadata from the GLOBAL response for the big numbers
  const globalTotalCount = globalResponse.metadata?.total_records || 0;
  
  // 3. Keep the search-specific total for the table pagination only
  const filteredTotalCount = metadata?.total_records || 0;

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
      value: globalTotalCount.toLocaleString(), // Static Big Number
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
      <Navbar />
      <div className="lg:hidden">
        <Sidebar />
      </div>

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 md:px-8 pt-24 pb-8 md:py-16">
        
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <nav className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00BA88]">Analytics</span>
              <span className="text-slate-300 dark:text-slate-700 text-[10px]">/</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 hidden md:block">Market Intelligence</span>
            </nav>
            
            <div className="space-y-3">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-slate-950 dark:text-white leading-tight">
                Pokémon Graded Card Tracker
                <span className="hidden md:inline-flex ml-3 items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                  PSA Verified
                </span>
              </h1>

              <div className="flex flex-col gap-3">
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  Showing {globalTotalCount.toLocaleString()} total cards across the global market.
                </p>

                <div className="flex md:hidden">
                  <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                    PSA Verified
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="mb-8 md:mb-12">
          <MarketStats initialStats={synchronizedStats} />
        </section>

        <section id="market-table" className="animate-in fade-in slide-in-from-bottom-4 duration-1000 mb-16">
          <MarketTable 
            initialCards={data} 
            totalRecords={filteredTotalCount} // Table still needs filtered count for pagination
            totalPages={metadata?.total_pages || 0}
            currentPage={currentPage}
          />
        </section>
      </main>

      <div className="w-full pb-20">
        <Newsletter />
      </div>

      <Footer />

      <MarketTicker 
        totalCards={globalTotalCount} // Static Big Number
        psa10Pop={psa10Value}
        volume30d={marketVol}
      />
    </div>
  )
}