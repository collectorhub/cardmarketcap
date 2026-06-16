"use client";

import React, { useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import PricingSummary from "@/components/admin/pricing-sales/PricingSummary";
import PricingFilters from "@/components/admin/pricing-sales/PricingFilters";
import TransactionRowItem from "@/components/admin/pricing-sales/TransactionRowItem";
import { TransactionSale } from "@/types/pricing";
import { Layers } from "lucide-react";
import {
  getAdminPricingSales,
  resolveAdminPricingSale,
} from "@/lib/queries/admin/pricing-sales";

export default function PricingSalesPage() {
  const [activeTab, setActiveTab] = useState<
    "all_sales" | "anomalies" | "verified_pricing"
  >("all_sales");

  const [searchQuery, setSearchQuery] = useState("");
  const [sales, setSales] = useState<TransactionSale[]>([]);
  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState({
    totalSalesProcessed: 0,
    avgCardValue: 0,
    activeAnomaliesCount: 0,
    healthyStreamRate: "0%",
  });

  async function loadSales() {
    try {
      setLoading(true);

      const res = await getAdminPricingSales({
        search: searchQuery,
        tab: activeTab,
      });

      if (res?.success) {
        setSales(Array.isArray(res.sales) ? res.sales : []);
        setSummary({
          totalSalesProcessed: Number(res.summary?.totalSalesProcessed || 0),
          avgCardValue: Number(res.summary?.avgCardValue || 0),
          activeAnomaliesCount: Number(res.summary?.activeAnomaliesCount || 0),
          healthyStreamRate: String(res.summary?.healthyStreamRate || "0%"),
        });
      } else {
        console.warn("Pricing sales warning:", res?.message);
        setSales([]);
      }
    } catch (error) {
      console.error("Failed to load pricing sales:", error);
      setSales([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadSales();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, activeTab]);

  const handleApproveSale = async (id: string) => {
    const stored =
      typeof window !== "undefined" ? localStorage.getItem("user_data") : null;
    const parsed = stored ? JSON.parse(stored) : null;
    const userId = Number(parsed?.id || parsed?.user_id || 0);

    const res = await resolveAdminPricingSale({
      id,
      action: "approve",
      user_id: userId,
      reason: "Admin approved sale for pricing pool.",
    });

    if (res?.success) {
      setSales((prev) =>
        prev.map((sale) =>
          sale.id === id
            ? {
                ...sale,
                is_outlier: false,
                anomaly_reason: "none",
              }
            : sale
        )
      );
    } else {
      alert(res?.message || "Failed to approve sale.");
    }
  };

  const handleQuarantineSale = async (id: string) => {
    const stored =
      typeof window !== "undefined" ? localStorage.getItem("user_data") : null;
    const parsed = stored ? JSON.parse(stored) : null;
    const userId = Number(parsed?.id || parsed?.user_id || 0);

    const res = await resolveAdminPricingSale({
      id,
      action: "quarantine",
      user_id: userId,
      reason: "Admin quarantined sale as anomaly.",
    });

    if (res?.success) {
      setSales((prev) => prev.filter((sale) => sale.id !== id));
    } else {
      alert(res?.message || "Failed to quarantine sale.");
    }
  };

  return (
    <div className="space-y-6 pt-15 md:pt-0">
      <AdminPageHeader
        title="Pricing & Sales Ingestion Stream"
        description="Govern real-time marketplace sales telemetry, capture volatile outliers, and protect canonical charts from index spikes."
      />

      <PricingSummary
        totalSalesProcessed={summary.totalSalesProcessed}
        avgCardValue={summary.avgCardValue}
        activeAnomaliesCount={summary.activeAnomaliesCount}
        healthyStreamRate={summary.healthyStreamRate}
      />

      <PricingFilters
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <Layers size={12} className="text-slate-400" />
          <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 font-sans">
            Filtered Sales Records In Feed ({sales.length})
          </span>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="py-20 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center text-sm font-bold text-slate-400">
              Loading live sales telemetry...
            </div>
          ) : sales.length > 0 ? (
            sales.map((sale) => (
              <TransactionRowItem
                key={sale.id}
                sale={sale}
                onApproveSale={handleApproveSale}
                onQuarantineSale={handleQuarantineSale}
              />
            ))
          ) : (
            <div className="py-20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 text-center text-sm font-bold text-slate-400">
              No sales records match this filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}