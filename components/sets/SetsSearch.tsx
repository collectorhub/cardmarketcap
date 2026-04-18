"use client";

import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils"; // Ensure you have this utility for class merging

export function SetsSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const currentParams = new URLSearchParams(window.location.search);
    const currentQ = currentParams.get("q") || "";

    if (debouncedQuery !== currentQ) {
      if (debouncedQuery) {
        currentParams.set("q", debouncedQuery);
      } else {
        currentParams.delete("q");
      }
      router.push(`?${currentParams.toString()}`, { scroll: false });
    }
  }, [debouncedQuery, router]);

  useEffect(() => {
    const q = searchParams.get("q") || "";
    if (q !== query) setQuery(q);
  }, [searchParams]);

  const clearSearch = () => {
    setQuery("");
    searchInputRef.current?.focus();
  };

  return (
    <div className="relative w-full mb-12">
      <div className="relative group max-w-full mx-auto">
        {/* Animated Glow Border */}
        <div className={cn(
          "absolute -inset-0.5 bg-gradient-to-r from-[#00BA88] to-emerald-500 rounded-2xl opacity-0 blur-md transition-opacity duration-500",
          isFocused && "opacity-15"
        )} />
        
        <div className={cn(
          "relative flex items-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border transition-all duration-300 rounded-2xl overflow-hidden",
          isFocused 
            ? "border-[#00BA88]/40 shadow-[0_0_20px_-12px_rgba(0,186,136,0.3)]" 
            : "border-slate-200 dark:border-white/5"
        )}>
          
          {/* Centering Wrapper: This div handles the sliding logic */}
          <div className={cn(
            "flex items-center w-full transition-all duration-500 ease-out px-5",
            !isFocused && !query ? "justify-center" : "justify-start"
          )}>
            
            <Search 
              size={18} 
              className={cn(
                "transition-colors duration-300 shrink-0",
                isFocused || query ? "text-[#00BA88]" : "text-slate-400"
              )} 
            />

            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search expansions..."
              className={cn(
                "bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-400/50 text-sm md:text-base font-semibold py-3 outline-none transition-all duration-500",
                !isFocused && !query ? "w-auto px-3 text-center" : "w-full px-4 text-left"
              )}
            />
          </div>

          {/* Right-aligned X Icon */}
          {(isFocused || query) && (
            <div className="absolute right-4 animate-in fade-in zoom-in duration-300">
              <button 
                onMouseDown={(e) => {
                  e.preventDefault(); 
                  clearSearch();
                }}
                className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-[#00BA88] transition-all"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}