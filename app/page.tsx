// page.tsx
import { MarketStats } from "@/components/MarketStats"
import { MarketTable } from "@/components/MarketTable"
import { fetchCMCCards, fetchMarketStats } from "@/lib/queries/market" 

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }> | { page?: string }
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  // 1. Fetch both Card Data and Market Stats in parallel for speed
  const [cardResponse, statsResponse] = await Promise.all([
    fetchCMCCards(currentPage),
    fetchMarketStats()
  ]);

  const { data, metadata } = cardResponse;

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#020617] transition-colors duration-300">
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 md:px-10 py-8 md:py-12">
        
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <nav className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00BA88]">Analytics</span>
              <span className="text-slate-300 dark:text-slate-700 text-[10px]">/</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Market Intelligence</span>
            </nav>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-black tracking-tight text-slate-950 dark:text-white leading-tight">
              Pokémon Graded Card Tracker
              <span className="ml-3 inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                PSA Verified
              </span>
            </h1>
          </div>
        </header>

        <section className="mb-12">
          {/* 2. Pass the stats data into the component */}
          <MarketStats initialStats={statsResponse?.stats || []} />
        </section>

        <section className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <MarketTable 
            initialCards={data} 
            totalRecords={metadata?.total_records || 0}
            totalPages={metadata?.total_pages || 0}
            currentPage={currentPage}
          />
        </section>
      </main>
    </div>
  )
}