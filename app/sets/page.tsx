import Navbar from "@/components/Navbar";
import { SetCard } from "@/components/sets/SetCard";
import { GameSelector } from "@/components/sets/GameSelector"; // Import the new component
import { ChevronRight, LayoutGrid } from "lucide-react";
import { fetchExpansions } from "@/lib/queries/market";
import Sidebar from "@/components/Sidebar";

async function getSetsData() {
  const result = await fetchExpansions();
  if (!result.success || !result.data) return [];
  const groups = result.data.reduce((acc: any[], set: any) => {
    const seriesName = set.series || "Other";
    const existingGroup = acc.find((g) => g.series === seriesName);
    if (existingGroup) existingGroup.sets.push(set);
    else acc.push({ series: seriesName, sets: [set] });
    return acc;
  }, []);
  return groups.sort(
    (a, b) =>
      new Date(b.sets[0].releaseDate).getTime() -
      new Date(a.sets[0].releaseDate).getTime()
  );
}

export default async function SetsPage() {
  const seriesData = await getSetsData();

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950">
      <Navbar />
      <div className="lg:hidden">
              <Sidebar />
            </div>
      <main className="max-w-[1600px] mx-auto px-4 md:px-10 pt-20 md:pt-12 pb-20">
        <header className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-3xl space-y-2 md:space-y-4">
              <div className="flex items-center gap-2 text-[#00BA88] font-bold text-[11px] uppercase tracking-widest">
                <span className="flex h-2 w-2 rounded-full bg-[#00BA88] animate-pulse" />
                Live Market Database
              </div>
              <h2 className="text-2xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                Trading Card <span className="text-[#00BA88]">Expansions</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm md:text-lg">
                Access real-time floor prices, population reports, and market
                volatility metrics.
              </p>
            </div>
          </div>
        </header>

        {/* TCG SELECTOR - RENDER THE CLIENT COMPONENT */}
        <GameSelector />

        <div className="space-y-15">
          {seriesData.map((group) => (
            <section key={group.series}>
              <div className="flex items-end justify-between mb-8 border-b border-slate-100 dark:border-slate-900">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                    <LayoutGrid className="h-5 w-5 text-[#00BA88]" />
                    {group.series} Era
                  </h3>
                </div>
                {/* <button className="text-[10px] font-black uppercase text-slate-400 hover:text-[#00BA88] flex items-center gap-1 transition-colors">
                  Analytics <ChevronRight size={14} />
                </button> */}
              </div>

              {/* Responsive Grid: 2 on mobile, 3 on md, 5 on lg/xl */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                {group.sets.map((set: any) => (
                  <SetCard key={set.id} set={set} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}