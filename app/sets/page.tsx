// app/sets/page.tsx
import Navbar from "@/components/Navbar";
import { SetCard } from "@/components/sets/SetCard";
import { Activity, ChevronRight, LayoutGrid } from "lucide-react";
import { fetchExpansions } from "@/lib/queries/market";

async function getSetsData() {
  const result = await fetchExpansions();
  
  if (!result.success || !result.data) return [];

  // Group the flat API data by series (e.g., "Scarlet & Violet", "Sword & Shield")
  const groups = result.data.reduce((acc: any[], set: any) => {
    const seriesName = set.series || "Other";
    const existingGroup = acc.find(g => g.series === seriesName);
    
    if (existingGroup) {
      existingGroup.sets.push(set);
    } else {
      acc.push({ series: seriesName, sets: [set] });
    }
    return acc;
  }, []);

  // Optional: Sort groups so newest series appear first
  return groups.sort((a, b) => {
    const dateA = new Date(a.sets[0].releaseDate).getTime();
    const dateB = new Date(b.sets[0].releaseDate).getTime();
    return dateB - dateA;
  });
}

export default async function SetsPage() {
  const seriesData = await getSetsData();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Navbar />
      
      <main className="max-w-[1600px] mx-auto px-6 md:px-10 pt-20 pb-20">
        {/* HEADER SECTION */}
        <header className="flex flex-col gap-4 mb-16">
          <div className="flex items-center gap-2 text-[#00BA88] bg-emerald-500/10 w-fit px-3 py-1 rounded-full border border-emerald-500/20">
            <Activity className="h-3.5 w-3.5 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.15em]">Market Index / Expansions</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
                Expansion <span className="text-[#00BA88]">Sets</span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-sm md:text-lg leading-relaxed font-medium">
                Professional-grade market tracking for every era. Monitor floor prices, 
                set volatility, and population data.
              </p>
            </div>
            
            {/* Quick Stats Summary */}
            <div className="flex items-center gap-8 border-l border-slate-200 dark:border-slate-800 pl-8 hidden lg:flex">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Total Sets</p>
                <p className="text-xl font-black text-slate-900 dark:text-white">184</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Tracked Assets</p>
                <p className="text-xl font-black text-slate-900 dark:text-white">42,810</p>
              </div>
            </div>
          </div>
        </header>

        {/* RENDER BY SERIES */}
        <div className="space-y-24">
          {seriesData.map((group) => (
            <section key={group.series} className="space-y-10">
              {/* Series Sticky Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-6">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-2xl bg-slate-900 dark:bg-white flex items-center justify-center">
                    <LayoutGrid className="text-white dark:text-slate-900 h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                      {group.series} <span className="text-[#00BA88]">Era</span>
                    </h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                      {group.sets.length} Tracked Expansions
                    </p>
                  </div>
                </div>
                
                <button className="group text-[10px] font-black uppercase text-slate-500 hover:text-[#00BA88] flex items-center gap-2 transition-all">
                  Series Analytics <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Grid Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
                {group.sets.map((set) => (
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