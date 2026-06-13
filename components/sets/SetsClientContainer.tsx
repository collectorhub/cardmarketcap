"use client";

import { useMemo } from "react";
import { Sparkles, Inbox } from "lucide-react";
import { SetCard } from "./SetCard";

const formatSeriesName = (name: string) => {
  if (!name) return "Other Expansions";
  return name.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
};

interface SetsClientContainerProps {
  initialData: any[];
  currentGame: string;
  currentLang: string;
  searchQuery: string;
}

export function SetsClientContainer({ 
  initialData, 
  currentGame, 
  currentLang, 
  searchQuery 
}: SetsClientContainerProps) {
  
  const filteredAndGroupedData = useMemo(() => {
    const dbLangCode = currentLang.toLowerCase().startsWith("ja") ? "ja" : "en";
    const isSearching = searchQuery.length > 0;

    // 1. FILTERING - Directly matched to uniform backend object structure
    const filtered = initialData.filter((set) => {
      const nameString = set.name || "";
      const matchesSearch = nameString.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (currentGame === "pokemon") {
        // Uniform fallback tracking for 'language' property keys
        const targetLanguage = (set.language || "en").toLowerCase();
        
        // If searching, display matching results from both language datasets
        return isSearching ? matchesSearch : (matchesSearch && targetLanguage === dbLangCode);
      }
      return matchesSearch;
    });

    // 2. GROUPING
    const groups = filtered.reduce((acc: any[], set: any) => {
      const groupKey = set.series || "Other Expansions";
      
      // Ensure fallbacks are aligned to API formatting strings
      const releaseDate = set.releaseDate || set.release_date || new Date().toISOString();
      const totalCards = parseInt(set.totalCards || set.total || "0") || 0;

      const existingGroup = acc.find((g) => g.series === groupKey);

      if (existingGroup) {
        existingGroup.sets.push({ ...set, releaseDate, totalCards });
      } else {
        acc.push({
          series: groupKey,
          sets: [{ ...set, releaseDate, totalCards }],
          latestRelease: new Date(releaseDate).getTime() || 0,
        });
      }
      return acc;
    }, []);

    // 3. CHRONOLOGICAL SORT BY RELEASE DATE
    groups.forEach((group: any) => {
      group.sets.sort((a: any, b: any) => {
        const timeB = new Date(b.releaseDate).getTime() || 0;
        const timeA = new Date(a.releaseDate).getTime() || 0;
        return timeB - timeA;
      });
      group.latestRelease = new Date(group.sets[0].releaseDate).getTime() || 0;
    });

    return groups.sort((a, b) => b.latestRelease - a.latestRelease);
  }, [initialData, currentGame, currentLang, searchQuery]);


  if (filteredAndGroupedData.length === 0) {
    return (
      <div className="py-32 flex flex-col items-center justify-center text-center space-y-6 bg-white dark:bg-slate-900/50 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
        <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-full">
          <Inbox className="text-slate-300 dark:text-slate-700" size={48} strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase">No Results Found</h3>
      </div>
    );
  }

  return (
    <div className="space-y-20 md:space-y-24">
      {filteredAndGroupedData.map((group) => (
        <section key={group.series} className="space-y-8">
          <div className="space-y-1">
            <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-[#00BA88]" strokeWidth={2.5} />
              {formatSeriesName(group.series)} 
              <span className="text-slate-400 font-medium">Era</span>
            </h3>
            <p className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 pl-9">
              Browse sets from the {formatSeriesName(group.series)} collection.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
            {group.sets.map((set: any) => (
              <SetCard key={set.id} set={set} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}