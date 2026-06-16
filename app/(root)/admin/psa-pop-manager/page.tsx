"use client";

import React, { useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import PSAPopSummary from "@/components/admin/psa-pop-manager/PSAPopSummary";
import PSAPopFilters from "@/components/admin/psa-pop-manager/PSAPopFilters";
import PSAPopGridList from "@/components/admin/psa-pop-manager/PSAPopGridList";
import { PSAPopulationItem } from "@/types/psa";
import {
  getAdminPSAPopManager,
  resolveAdminPSAPop,
} from "@/lib/queries/admin/psa";

export default function PSAPopManagerPage() {
  const [data, setData] = useState<PSAPopulationItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState({
    totalPop: 0,
    unlinkedCount: 0,
    variantConflicts: 0,
    verifiedCount: 0,
  });

  async function loadPsaData() {
    try {
      setLoading(true);

      const res = await getAdminPSAPopManager({
        search: searchQuery,
        tab: activeTab,
      });

      if (res?.success) {
        setData(Array.isArray(res.items) ? res.items : []);
        setSummary({
          totalPop: Number(res.summary?.totalPop || 0),
          unlinkedCount: Number(res.summary?.unlinkedCount || 0),
          variantConflicts: Number(res.summary?.variantConflicts || 0),
          verifiedCount: Number(res.summary?.verifiedCount || 0),
        });
      } else {
        console.warn("PSA manager warning:", res?.message);
        setData([]);
      }
    } catch (error) {
      console.error("Failed to load PSA manager:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadPsaData();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, activeTab]);

  const handleMappingResolution = async (
    id: string,
    action: "approve" | "reject" | "adjust_variant"
  ) => {
    const target = data.find((item) => item.id === id);

    const stored =
      typeof window !== "undefined" ? localStorage.getItem("user_data") : null;
    const parsed = stored ? JSON.parse(stored) : null;
    const userId = Number(parsed?.id || parsed?.user_id || 0);

    const res = await resolveAdminPSAPop({
      id,
      action,
      user_id: userId,
      scraped_title: target?.scraped_psa_name || id,
      proposed_card_id: target?.proposed_canonical?.id || "",
      proposed_card_name: target?.proposed_canonical?.name || "",
      proposed_set_name: target?.proposed_canonical?.set_name || "",
      confidence_score:
        target?.issue_type === "none"
          ? "high"
          : target?.issue_type === "unlinked_pop"
          ? "low"
          : "medium",
    });

    if (res?.success) {
      setData((prevData) =>
        prevData.map((item) => {
          if (item.id !== id) return item;

          if (action === "approve") {
            return { ...item, is_matched: true, issue_type: "none" };
          }

          if (action === "reject") {
            return {
              ...item,
              is_matched: false,
              issue_type: "unlinked_pop",
              proposed_canonical: undefined,
            };
          }

          return { ...item, issue_type: "variant_mismatch" };
        })
      );
    } else {
      alert(res?.message || "Failed to save PSA action.");
    }
  };

  return (
    <div className="space-y-6 pt-15 md:pt-0">
      <AdminPageHeader
        title="PSA Pop Manager"
        description="Audit certification blocks, isolate grade distributions, and govern variant index mapping pipelines safely."
      />

      <PSAPopSummary
        totalPop={summary.totalPop}
        unlinkedCount={summary.unlinkedCount}
        variantConflicts={summary.variantConflicts}
        verifiedCount={summary.verifiedCount}
      />

      <PSAPopFilters
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {loading ? (
        <div className="py-20 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center text-sm font-bold text-slate-400">
          Loading live PSA population records...
        </div>
      ) : (
        <PSAPopGridList items={data} onAction={handleMappingResolution} />
      )}
    </div>
  );
}