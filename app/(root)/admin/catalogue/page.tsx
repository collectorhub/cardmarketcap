"use client";

import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck } from 'lucide-react';
import CatalogueFilters from '@/components/admin/catalogue/CatalogueFilters';
import CatalogueTable, { UnifiedCardRow } from '@/components/admin/catalogue/CatalogueTable';
import OverrideDrawer from '@/components/admin/catalogue/OverrideDrawer';

const initialCatalogData: UnifiedCardRow[] = [
  { id: "card-001", canonical_name: "Charizard #4", set_name: "Base Set", slug: "charizard-base-4", has_override: true, frontend_display_name: "Charizard [1st Edition Holo]", status: 'active' },
  { id: "card-002", canonical_name: "Blastoise #2", set_name: "Base Set", slug: "blastoise-base-2", has_override: false, frontend_display_name: "Blastoise #2", status: 'active' },
  { id: "card-003", canonical_name: "Lugia Neo #9", set_name: "Neo Genesis", slug: "lugia-neo-9", has_override: false, frontend_display_name: "Lugia Neo #9", status: 'flagged' },
  { id: "card-004", canonical_name: "Charizard #4", set_name: "Base Set", slug: "charizard-base-4", has_override: true, frontend_display_name: "Charizard [1st Edition Holo]", status: 'active' },
  { id: "card-005", canonical_name: "Blastoise #2", set_name: "Base Set", slug: "blastoise-base-2", has_override: false, frontend_display_name: "Blastoise #2", status: 'active' },
  { id: "card-006", canonical_name: "Lugia Neo #9", set_name: "Neo Genesis", slug: "lugia-neo-9", has_override: false, frontend_display_name: "Lugia Neo #9", status: 'flagged' },
  { id: "card-007", canonical_name: "Charizard #4", set_name: "Base Set", slug: "charizard-base-4", has_override: true, frontend_display_name: "Charizard [1st Edition Holo]", status: 'active' },
  { id: "card-008", canonical_name: "Blastoise #2", set_name: "Base Set", slug: "blastoise-base-2", has_override: false, frontend_display_name: "Blastoise #2", status: 'active' },
  { id: "card-009", canonical_name: "Lugia Neo #9", set_name: "Neo Genesis", slug: "lugia-neo-9", has_override: false, frontend_display_name: "Lugia Neo #9", status: 'flagged' },
  { id: "card-010", canonical_name: "Blastoise #2", set_name: "Base Set", slug: "blastoise-base-2", has_override: false, frontend_display_name: "Blastoise #2", status: 'active' },
  { id: "card-011", canonical_name: "Lugia Neo #9", set_name: "Neo Genesis", slug: "lugia-neo-9", has_override: false, frontend_display_name: "Lugia Neo #9", status: 'flagged' },
];

export default function CardCatalogueManager() {
  const [cards, setCards] = useState<UnifiedCardRow[]>(initialCatalogData);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCard, setSelectedCard] = useState<UnifiedCardRow | null>(null);

  // Your exact custom filter options—left untouched!
  const [sort, setSort] = useState("Top");
  const [subcat, setSubcat] = useState("All");
  const [grade, setGrade] = useState("PSA 10");

  const [currentPage, setCurrentPage] = useState(1);

  const filteredCards = cards.filter(card => {
    // 1. Primary Text Field Matching (Name & Slug)
    const matchesSearch = card.canonical_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          card.slug.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const handleSaveOverride = (id: string, updatedName: string) => {
    setCards(prev => prev.map(card => card.id === id ? { ...card, frontend_display_name: updatedName, has_override: true } : card));
    setSelectedCard(null);
  };

  return (
    <div className="bg-[#FAFAFB] dark:bg-slate-950 min-h-screen w-full space-y-6 pt-16 md:pt-0">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-slate-100 dark:border-slate-900 pb-0">
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white font-sora">
            Card Catalogue Manager
          </h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 font-medium font-inter mt-0.5">
            Inspect canonical assets and manage downstream presentation overrides safely.
          </p>
        </div>
        
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#00BA88]/5 dark:bg-[#00BA88]/10 text-[#00BA88] border border-[#00BA88]/10 text-xs font-bold font-inter select-none">
          <ShieldCheck size={14} />
          <span>Canonical Tables Protected</span>
        </div>
      </div>

      {/* TOP FILTERS LAYER (Untouched Option Props) */}
      <CatalogueFilters 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery}
        selectedSort={sort}
        onSortChange={setSort}
        selectedSubcat={subcat}
        onSubcatChange={setSubcat}
        selectedGrade={grade}
        onGradeChange={setGrade}
      />

      {/* DATA GRID DISPLAY LAYER */}
      <CatalogueTable 
        initialCards={filteredCards} 
        totalRecords={filteredCards.length}
        totalPages={1}
        currentPage={currentPage}
        onSelectCard={setSelectedCard}
        onPageChange={setCurrentPage}
      />

      {/* OVERRIDE INTERCEPTION MODAL */}
      <OverrideDrawer 
        card={selectedCard} 
        onClose={() => setSelectedCard(null)} 
        onSaveOverride={handleSaveOverride} 
      />
    </div>
  );
}