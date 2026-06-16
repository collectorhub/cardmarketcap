"use client";

import React, { useEffect, useState } from "react";
import { ShieldCheck, Loader2 } from "lucide-react";
import CatalogueFilters from "@/components/admin/catalogue/CatalogueFilters";
import CatalogueTable, {
  UnifiedCardRow,
} from "@/components/admin/catalogue/CatalogueTable";
import OverrideDrawer from "@/components/admin/catalogue/OverrideDrawer";
import {
  getAdminCatalogue,
  saveAdminCardOverride,
} from "@/lib/queries/admin/catalogue";

export default function CardCatalogueManager() {
  const [cards, setCards] = useState<UnifiedCardRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCard, setSelectedCard] = useState<UnifiedCardRow | null>(null);

  const [sort, setSort] = useState("Top");
  const [subcat, setSubcat] = useState("All");
  const [grade, setGrade] = useState("PSA 10");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  async function loadCatalogue(page = currentPage) {
    try {
      setLoading(true);

      const res = await getAdminCatalogue({
        page,
        search: searchQuery,
        sort,
        subcat,
        grade,
      });

      if (res?.success) {
        setCards(Array.isArray(res.cards) ? res.cards : []);
        setTotalRecords(Number(res.metadata?.totalRecords || 0));
        setTotalPages(Number(res.metadata?.totalPages || 1));
        setCurrentPage(Number(res.metadata?.currentPage || page));
      } else {
        console.warn("Catalogue warning:", res?.message);
        setCards([]);
      }
    } catch (error) {
      console.error("Failed to load catalogue:", error);
      setCards([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      loadCatalogue(1);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery, sort, subcat, grade]);

  useEffect(() => {
    loadCatalogue(currentPage);
  }, [currentPage]);

  const handleSaveOverride = async (id: string, updatedName: string) => {
    const stored =
      typeof window !== "undefined" ? localStorage.getItem("user_data") : null;
    const parsed = stored ? JSON.parse(stored) : null;
    const userId = Number(parsed?.id || parsed?.user_id || 0);

    const res = await saveAdminCardOverride({
      target_id: id,
      override_value: updatedName,
      created_by: userId,
    });

    if (res?.success) {
      setCards((prev) =>
        prev.map((card) =>
          card.id === id
            ? {
                ...card,
                frontend_display_name: updatedName,
                has_override: true,
              }
            : card
        )
      );

      setSelectedCard(null);
    } else {
      alert(res?.message || "Failed to save override.");
    }
  };

  return (
    <div className="bg-[#FAFAFB] dark:bg-slate-950 min-h-screen w-full space-y-6 pt-16 md:pt-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-slate-100 dark:border-slate-900 pb-0">
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white font-sora">
            Card Catalogue Manager
          </h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 font-medium font-inter mt-0.5">
            Inspect canonical assets and manage downstream presentation
            overrides safely.
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#00BA88]/5 dark:bg-[#00BA88]/10 text-[#00BA88] border border-[#00BA88]/10 text-xs font-bold font-inter select-none">
          <ShieldCheck size={14} />
          <span>Canonical Tables Protected</span>
        </div>
      </div>

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

      <CatalogueTable
        initialCards={cards}
        totalRecords={totalRecords}
        totalPages={totalPages}
        currentPage={currentPage}
        onSelectCard={setSelectedCard}
        onPageChange={setCurrentPage}
        isLoading={loading}
      />

      <OverrideDrawer
        card={selectedCard}
        onClose={() => setSelectedCard(null)}
        onSaveOverride={handleSaveOverride}
      />
    </div>
  );
}