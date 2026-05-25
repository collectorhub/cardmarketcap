"use client";

import React from 'react';
import { Layers, HelpCircle, Ban, Sparkles, LucideIcon } from 'lucide-react';
import { cn } from "@/lib/utils";

interface OverridesFiltersProps {
  activeTab: 'all' | 'alias' | 'exclusion' | 'frontend';
  setActiveTab: (tab: 'all' | 'alias' | 'exclusion' | 'frontend') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function OverridesFilters({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery
}: OverridesFiltersProps) {
  
  const tabs: { id: 'all' | 'alias' | 'exclusion' | 'frontend'; label: string; icon: LucideIcon }[] = [
    { id: 'all', label: 'All Active Rules', icon: Layers },
    { id: 'alias', label: 'String Aliases', icon: Sparkles },
    { id: 'exclusion', label: 'Exclusion Blocks', icon: Ban },
    { id: 'frontend', label: 'Frontend Helpers', icon: HelpCircle },
  ];

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 w-full pt-1">
      
      {/* Left Side Search Box */}
      <div className="relative w-full lg:w-96 font-inter">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input 
          type="text"
          placeholder="Filter dictionary string keys..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 h-10 bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/80 rounded-xl text-sm placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#00BA88]/20 focus:border-[#00BA88] transition-all font-medium"
        />
      </div>

      {/* Right Side Filter Tabs */}
      <div className="w-full lg:w-auto flex justify-start lg:justify-end">
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-900/60 p-1.5 rounded-xl overflow-x-auto scrollbar-hide w-full lg:w-auto select-none font-inter border border-slate-200/40 dark:border-slate-800/40">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-3.5 py-2 text-[9px] md:text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap flex-1 lg:flex-none",
                  isActive 
                    ? "bg-[#00BA88] text-white shadow-xs" 
                    : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                )}
              >
                <Icon 
                  size={11} 
                  className={cn("stroke-[2.5]", isActive ? "text-white" : "text-slate-400")} 
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}