"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchExpansions } from "@/lib/queries/market";
import { ChevronRight, ChevronLeft, Shuffle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Internal Skeleton component to match the card design
const RandomScrollerSkeleton = () => (
  <div className="flex gap-3 md:gap-6 overflow-hidden pb-6">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex-shrink-0 w-35 md:w-64 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 rounded-3xl p-3 md:p-6">
        <Skeleton className="aspect-[4/3] w-full mb-5 rounded-2xl" />
        <div className="space-y-3 flex flex-col items-center">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

export function RandomSetScroller() {
  const [sets, setSets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadRandomSets = async () => {
      setIsLoading(true);
      try {
        const response = await fetchExpansions("pokemon", "", 1);
        if (response.success) {
          const shuffled = [...response.data].sort(() => 0.5 - Math.random());
          setSets(shuffled.slice(0, 20));
        }
      } catch (error) {
        console.error("Failed to load random sets:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadRandomSets();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (!isLoading && sets.length === 0) return null;

  return (
    <div className="relative w-full group">
      {/* Header Section */}
      <div className="space-y-1 mb-8 px-4">
        <h3 className="text-lg md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
          <Shuffle className="h-5 w-5 text-[#00BA88]" />
          Random TCG Game Sets
        </h3>
        <p className="text-left text-[10px] md:text-sm font-medium text-slate-500 dark:text-slate-400 pl-8 md:pl-9">
          Explore a randomized selection of expansion sets across various trading card games.
        </p>
      </div>
      
      {/* Scroll Container Wrapper */}
      <div className="relative px-4">
        
        {/* Navigation Carets - Only show when not loading */}
        {!isLoading && (
          <>
            <button 
              onClick={() => scroll('left')} 
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-xl text-slate-900 dark:text-white hover:text-[#00BA88] hover:border-[#00BA88] transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
            >
              <ChevronLeft size={24} />
            </button>

            <button 
              onClick={() => scroll('right')} 
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-xl text-slate-900 dark:text-white hover:text-[#00BA88] hover:border-[#00BA88] transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Content Area */}
        {isLoading ? (
          <RandomScrollerSkeleton />
        ) : (
          <div 
            ref={scrollRef}
            className="flex gap-3 md:gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-6"
          >
            {sets.map((set) => (
              <Link 
                key={set.id} 
                href={`/sets/${encodeURIComponent(set.id)}`}
                className="flex-shrink-0 w-35 md:w-64 bg-white dark:bg-slate-900/40 backdrop-blur-sm border border-slate-200 dark:border-white/10 rounded-3xl  p-3 md:p-6 snap-start hover:border-[#00BA88] hover:shadow-[0_20px_40px_rgba(0,186,136,0.1)] transition-all duration-500 group/card"
              >
                <div className="aspect-[4/3] mb-5 flex items-center justify-center p-2 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                  <img 
                    src={set.logoUrl || "https://pokecollectorhub.com/assets/placeholder.png"} 
                    alt={set.name} 
                    className="max-h-full w-auto object-contain transition-transform duration-500 group-hover/card:scale-110" 
                  />
                </div>
                <div className="space-y-1">
                   <p className="text-sm font-black text-center truncate text-slate-900 dark:text-white group-hover/card:text-[#00BA88] transition-colors">
                     {set.name}
                   </p>
                   <p className="text-[11px] text-center text-[#00BA88] font-bold tracking-widest uppercase">
                     {set.totalCards || set.total || 0} Cards
                   </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}