import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import { GameSelector } from "@/components/sets/GameSelector";
import { SetsSearch } from "@/components/sets/SetsSearch";
import { SetsClientContainer } from "@/components/sets/SetsClientContainer";
import { fetchExpansions } from "@/lib/queries/market";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { ExpansionsPageSkeleton } from "@/components/sets/ExpansionsLoading";

/**
 * Data wrapper component that handles the heavy lifting of fetching
 * expansion data for the specific game and language selected.
 */
async function SetsDataWrapper({ game, lang, query }: { game: string; lang: string; query: string }) {
  const result = await fetchExpansions(game, ""); 
  
  return (
    <SetsClientContainer 
      initialData={result.data || []} 
      currentGame={game} 
      currentLang={lang} 
      searchQuery={query} 
    />
  );
}

export default async function SetsPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string; q?: string; game?: string }>;
}) {
  const params = await searchParams;
  
  // Normalize Game Slug
  const rawGame = params.game?.toLowerCase() || "pokemon";
  const currentGameSlug = rawGame.includes("magic") || rawGame === "mtg" ? "mtg" : "pokemon";
  const displayGameName = currentGameSlug === "mtg" ? "Magic" : "Pokémon";
  
  const currentLang = params.lang || "English";
  const searchQuery = params.q || "";

  // 1. Fetch real counts for the GameSelector to show accurate "X Cards" labels
  const [pokemonRes, mtgRes] = await Promise.all([
    fetchExpansions("pokemon", ""),
    fetchExpansions("mtg", "")
  ]);

  const realCounts = {
    pokemon: pokemonRes.metadata?.total_records || 416, // Fallback to DB state
    mtg: mtgRes.metadata?.total_records || 798,     // Fallback to DB state
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950">
      <Navbar />
      <div className="lg:hidden">
        <Sidebar />
      </div>

      <main className="max-w-[1600px] mx-auto px-4 md:px-10 pt-22 md:pt-16 pb-20">
        {/* --- HEADER SECTION --- */}
        <header className="mb-8 md:mb-12">
          <div className="max-w-3xl space-y-2 md:space-y-4">
            <div className="flex items-center gap-2 text-[#00BA88] font-bold text-[10px] md:text-[11px] uppercase tracking-widest">
              <span className="flex h-2 w-2 rounded-full bg-[#00BA88] animate-pulse" />
              Live {currentGameSlug === "mtg" ? "" : currentLang} {displayGameName} Database
            </div>
            <h2 className="text-2xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Trading Card <span className="text-[#00BA88]">Expansions</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-lg">
              Showing active eras for the {currentGameSlug === "mtg" ? "" : currentLang} {displayGameName} market.
            </p>
          </div>
        </header>

        {/* --- GAME SELECTOR --- */}
        <div className="mb-10">
          <GameSelector 
            currentGame={currentGameSlug} 
            currentLang={currentLang} 
            realCounts={realCounts} 
          />
        </div>

        {/* --- SEARCH COMPONENT --- */}
        <SetsSearch />

        {/* --- LANGUAGE TABS (Pokémon Only) --- */}
        {currentGameSlug === "pokemon" && (
          <div className="flex justify-center mb-16 border-b border-slate-200 dark:border-slate-800">
            {["English", "Japanese"].map((lang) => (
              <Link
                key={lang}
                href={`?game=${currentGameSlug}&lang=${lang}${searchQuery ? `&q=${searchQuery}` : ""}`}
                className={`pb-4 px-8 text-xs font-black uppercase tracking-[0.3em] transition-all relative ${
                  currentLang === lang 
                    ? "text-[#00BA88]" 
                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                }`}
              >
                {lang}
                {currentLang === lang && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#00BA88] rounded-t-full" />
                )}
              </Link>
            ))}
          </div>
        )}

        {/* --- CLIENT GRID LOADING STATE --- */}
        <Suspense key={currentGameSlug} fallback={<ExpansionsPageSkeleton />}>
          <SetsDataWrapper 
            game={currentGameSlug} 
            lang={currentLang} 
            query={searchQuery} 
          />
        </Suspense>
      </main>
    </div>
  );
}