import Navbar from "@/components/Navbar";
import { SetCard } from "@/components/sets/SetCard";
import { GameSelector } from "@/components/sets/GameSelector";
import { Sparkles, Inbox } from "lucide-react";
import { fetchExpansions } from "@/lib/queries/market";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

const formatSeriesName = (name: string) => {
  return name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

async function getSetsData(game: string = "pokemon", language: string = "English", search: string = "") {
  const result = await fetchExpansions(game, language, search);
  if (!result.success || !result.data) return [];

  const rawData = result.data;

  const groups = rawData.reduce((acc: any[], set: any) => {
    const seriesName = set.series || "Other";
    const existingGroup = acc.find((g) => g.series === seriesName);
    
    if (existingGroup) {
      existingGroup.sets.push(set);
    } else {
      acc.push({ 
        series: seriesName, 
        language: set.language || language,
        sets: [set],
        latestRelease: new Date(set.releaseDate).getTime() 
      });
    }
    return acc;
  }, []);

  groups.forEach((group: any) => {
    group.sets.sort((a: any, b: any) => 
      new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
    );
    group.latestRelease = new Date(group.sets[0].releaseDate).getTime();
  });

  return groups.sort((a, b) => b.latestRelease - a.latestRelease);
}

export default async function SetsPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string; q?: string; game?: string }>;
}) {
  const params = await searchParams;
  
  // Game Logic: Map UI names to DB table slugs
  const rawGame = params.game?.toLowerCase() || "pokemon";
  const currentGameSlug = rawGame.includes("magic") ? "mtg" : "pokemon";
  const displayGameName = currentGameSlug === "mtg" ? "Magic" : "Pokémon";

  const currentLang = params.lang || "English";
  const searchQuery = params.q || "";
  const languages = ["English", "Japanese"];
  
  const allSeriesData = await getSetsData(currentGameSlug, currentLang, searchQuery);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950">
      <Navbar />
      <div className="lg:hidden">
        <Sidebar />
      </div>

      <main className="max-w-[1600px] mx-auto px-4 md:px-10 pt-24 md:pt-16 pb-20">
        <header className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 text-center lg:text-left">
            <div className="max-w-3xl mx-auto lg:mx-0 space-y-2 md:space-y-5">
              <div className="flex items-center justify-center lg:justify-start gap-2 text-[#00BA88] font-bold text-[11px] uppercase tracking-widest">
                <span className="flex h-2 w-2 rounded-full bg-[#00BA88] animate-pulse" />
                Live {currentLang} {displayGameName} Database
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                Trading Card <span className="text-[#00BA88]">Expansions</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm md:text-lg">
                Showing active eras for the {currentLang} {displayGameName} market.
              </p>
            </div>
          </div>
        </header>

        <div className="mb-10">
           <GameSelector currentGame={currentGameSlug} currentLang={currentLang} />
        </div>

        {/* --- CENTERED LANGUAGE TABS --- */}
        <div className="flex flex-col items-center justify-center mb-16">
          <div className="flex gap-12 border-b border-slate-200 dark:border-slate-800 w-full justify-center relative">
            {languages.map((lang) => (
              <Link
                key={lang}
                href={`?game=${currentGameSlug}&lang=${lang}${searchQuery ? `&q=${searchQuery}` : ""}`}
                className={`pb-4 text-[11px] md:text-xs font-black uppercase tracking-[0.3em] transition-all relative ${
                  currentLang === lang 
                    ? "text-[#00BA88]" 
                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                }`}
              >
                {lang}
                {currentLang === lang && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#00BA88] rounded-t-full z-10" />
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* --- DYNAMIC CONTENT --- */}
        {allSeriesData.length > 0 ? (
          <div className="space-y-20 md:space-y-24">
            {allSeriesData.map((group) => (
              <section key={`${group.series}`} className="space-y-8">
                <div className="flex items-center justify-between px-1">
                  <div className="space-y-1 text-center md:text-left w-full">
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center justify-center md:justify-start gap-3">
                      <Sparkles className="h-6 w-6 text-[#00BA88]" strokeWidth={2.5} />
                      {formatSeriesName(group.series)} <span className="text-slate-400 font-medium text-lg md:text-xl">Era</span>
                    </h3>
                    <p className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 md:pl-9">
                      Browse sets from the {formatSeriesName(group.series)} collection in {currentLang}.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
                  {group.sets.map((set: any) => (
                    <SetCard key={set.id} set={set} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="py-32 flex flex-col items-center justify-center text-center space-y-6 bg-white dark:bg-slate-900/50 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
             <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-full">
                <Inbox className="text-slate-300 dark:text-slate-700" size={48} strokeWidth={1.5} />
             </div>
             <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">No Data Available</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto text-sm font-medium">
                    We haven't indexed the <span className="text-[#00BA88] font-bold">{currentLang}</span> {displayGameName} database for these cards yet.
                </p>
             </div>
             <Link 
                href={`?game=pokemon&lang=English`}
                className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#00BA88] transition-colors"
             >
                Return to Pokémon English
             </Link>
          </div>
        )}
      </main>
    </div>
  );
}