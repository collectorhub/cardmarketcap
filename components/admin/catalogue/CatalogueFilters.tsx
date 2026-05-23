"use client";

import React from 'react';
import { Search } from 'lucide-react';
import CustomDropdown from '@/components/CustomDropdown';

interface CatalogueFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedSort: string;
  onSortChange: (value: string) => void;
  selectedSubcat: string;
  onSubcatChange: (value: string) => void;
  selectedGrade: string;
  onGradeChange: (value: string) => void;
}

export default function CatalogueFilters({ 
  searchQuery, 
  onSearchChange,
  selectedSort,
  onSortChange,
  selectedSubcat,
  onSubcatChange,
  selectedGrade,
  onGradeChange
}: CatalogueFiltersProps) {
  
  const FILTER_OPTIONS = ["Top", "Trending", "Gainers", "Lossers"];
  const SUBCAT_OPTIONS = ["All", "Modern", "Japanese", "Promos", "Common", "Sealed"];
  const GRADE_OPTIONS = ["PSA 10", "PSA 9", "PSA 8", "PSA 7", "PSA 6", "PSA 5"];

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full font-inter">
      
      {/* Search Input Container */}
      <div className="relative w-full md:flex-1 min-w-0">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
        <input 
          type="text"
          placeholder="Filter by name, slug, or database ID..."
          className="w-full pl-10 pr-4 h-11 bg-white dark:bg-transparent border border-slate-200/60 dark:border-slate-800 rounded-xl text-sm placeholder-slate-400 dark:placeholder-slate-600 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#00BA88]/20 focus:border-[#00BA88] transition-all font-medium"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* MOBILE-PERFECT FILTER ROW 
        - Uses grid-cols-3 on mobile to neatly lock all 3 items into a single row.
        - Removes any hanging awkward dropdown rows underneath.
        - Effortlessly scale-restores back to flex spacing alignment on desktop screens.
      */}
      <div className="grid grid-cols-3 md:flex items-center gap-2 w-full md:w-auto">
        <div className="w-full md:w-auto">
          <CustomDropdown 
            value={selectedSort} 
            options={FILTER_OPTIONS} 
            onChange={onSortChange} 
          />
        </div>
        
        <div className="w-full md:w-auto">
          <CustomDropdown 
            value={selectedSubcat} 
            options={SUBCAT_OPTIONS} 
            onChange={onSubcatChange} 
          />
        </div>

        <div className="w-full md:w-auto">
          <CustomDropdown 
            value={selectedGrade} 
            options={GRADE_OPTIONS} 
            onChange={onGradeChange} 
          />
        </div>
      </div>

    </div>
  );
}