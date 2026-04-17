import Navbar from "@/components/Navbar";
import { SetCard } from "@/components/sets/SetCard";
import { GameSelector } from "@/components/sets/GameSelector";
import { LayoutGrid, Sparkles } from "lucide-react";
import { fetchExpansions } from "@/lib/queries/market";
import Sidebar from "@/components/Sidebar";

// 1. Updated Logic: Grouping by Series + Strict Date Sorting
async function getSetsData() {
  const result = await fetchExpansions();
  if (!result.success || !result.data) return [];

  const rawData = result.data;

  // Grouping logic
  const groups = rawData.reduce((acc: any[], set: any) => {
    const seriesName = set.series || "Other";
    const language = set.language || "English"; // Ensure your data has a language field
    
    const existingGroup = acc.find((g) => g.series === seriesName && g.language === language);
    
    if (existingGroup) {
      existingGroup.sets.push(set);
    } else {
      acc.push({ 
        series: seriesName, 
        language: language,
        sets: [set],
        // Capture the newest date in the series for group sorting
        latestRelease: new Date(set.releaseDate).getTime() 
      });
    }
    return acc;
  }, []);

  // Sort sets within each series by date (Newest First)
  groups.forEach((group: any) => {
    group.sets.sort((a: any, b: any) => 
      new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
    );
    // Update the group's latestRelease based on the top sorted set
    group.latestRelease = new Date(group.sets[0].releaseDate).getTime();
  });

  // Sort the Series groups themselves by the newest set in that series
  return groups.sort((a, b) => b.latestRelease - a.latestRelease);
}

export default async function SetsPage() {
  const allSeriesData = await getSetsData();

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950">
      <Navbar />
      <div className="lg:hidden">
        <Sidebar />
      </div>

      <main className="max-w-[1600px] mx-auto px-4 md:px-10 pt-24 md:pt-16 pb-20">
        
        {/* --- HEADER (Matching Card Search Style) --- */}
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

        {/* --- TCG & LANGUAGE SELECTOR --- */}
        {/* Note: GameSelector should now handle the 'English/Japanese' tab state */}
        <div className="mb-12">
           <GameSelector />
        </div>

        {/* --- SERIES GROUPS --- */}
        <div className="space-y-20 md:space-y-24">
          {allSeriesData.map((group) => (
            <section key={`${group.language}-${group.series}`} className="space-y-8">
              
              {/* --- SECTION HEADER (Neural Style) --- */}
              <div className="flex items-center justify-between px-1">
                <div className="space-y-1">
                  <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                    <Sparkles className="h-6 w-6 text-[#00BA88]" strokeWidth={2.5} />
                    {group.series} <span className="text-slate-400 font-medium text-lg md:text-xl">Era</span>
                  </h3>
                  <p className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 pl-9">
                    Explore sets from the {group.series} collection sorted by latest release.
                  </p>
                </div>
              </div>

              {/* --- RESPONSIVE GRID --- */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
                {group.sets.map((set: any) => (
                  <SetCard key={set.id} set={set} />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* --- EMPTY STATE --- */}
        {allSeriesData.length === 0 && (
          <div className="py-40 text-center space-y-4">
             <LayoutGrid className="mx-auto text-slate-300" size={48} />
             <p className="text-slate-500 font-bold text-lg">No expansions found for this selection.</p>
          </div>
        )}
      </main>
    </div>
  );
}