"use client";

import React, { useEffect, useState } from "react";
import { ShieldCheck, Loader2 } from "lucide-react";
import QAMetricsGrid, {
  QAMetricSummary,
} from "@/components/admin/qa/QAMetricsGrid";
import QAFilterTabs, { QATabType } from "@/components/admin/qa/QAFilterTabs";
import QAIssueTable, {
  QAAnomalyItem,
} from "@/components/admin/qa/QAIssueTable";
import { getAdminQAReport } from "@/lib/queries/admin/qa";

export default function QAReportingPage() {
  const [metricsData, setMetricsData] = useState<QAMetricSummary[]>([]);
  const [anomalyLogs, setAnomalyLogs] = useState<QAAnomalyItem[]>([]);
  const [activeTab, setActiveTab] = useState<QATabType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadQAReport() {
    try {
      setLoading(true);

      const res = await getAdminQAReport();

      if (res?.success) {
        setMetricsData(res.metrics || []);
        setAnomalyLogs(res.issues || []);
      } else {
        console.warn("QA report warning:", res?.message);
      }
    } catch (error) {
      console.error("Failed to load QA report:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQAReport();
  }, []);

  const handleResolveAction = (
    id: string,
    resolution: "approve" | "exclude"
  ) => {
    setAnomalyLogs((prev) => prev.filter((item) => item.id !== id));

    console.log(
      `Staged QA action: ${resolution} on issue ${id}. Canonical tables remain protected.`
    );
  };

  const filteredIssues = anomalyLogs.filter((item) => {
    const q = searchQuery.toLowerCase();

    const matchesSearch =
      item.canonical_name?.toLowerCase().includes(q) ||
      item.set_name?.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q) ||
      item.card_id?.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (activeTab === "all") return true;
    if (activeTab === "assets") return item.issue_type === "missing_image";
    if (activeTab === "integrity") {
      return ["duplicate_card", "bad_slug", "null_critical_field"].includes(
        item.issue_type
      );
    }
    if (activeTab === "variants") {
      return item.issue_type === "variant_inconsistency";
    }

    return true;
  });

  return (
    <div className="space-y-6 font-inter pt-15 md:pt-0 max-w-[1600px] mx-auto text-slate-900 dark:text-slate-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-slate-100 dark:border-slate-900">
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white font-sora">
            Data Quality & QA Control Terminal
          </h1>

          <p className="text-sm text-slate-400 dark:text-slate-500 font-medium font-inter mt-0.5">
            Inspect database anomalies, resolve variant conflicts, and govern
            frontend presentation states safely.
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#00BA88]/5 dark:bg-[#00BA88]/10 text-[#00BA88] border border-[#00BA88]/10 text-xs font-bold font-inter select-none">
          <ShieldCheck size={14} />
          <span>Canonical Tables Protected</span>
        </div>
      </div>

      {loading ? (
        <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center gap-3 text-slate-400 text-sm font-bold">
          <Loader2 className="animate-spin text-[#00BA88]" size={18} />
          Loading live QA diagnostics...
        </div>
      ) : (
        <>
          <QAMetricsGrid metrics={metricsData} />

          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 w-full pt-1">
            <div className="relative w-full lg:w-96">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>

              <input
                type="text"
                placeholder="Search anomaly index logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 h-10 bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/80 rounded-xl text-sm placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#00BA88]/20 focus:border-[#00BA88] transition-all font-medium"
              />
            </div>

            <div className="w-full lg:w-auto flex justify-start lg:justify-end">
              <QAFilterTabs activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
          </div>

          <QAIssueTable
            issues={filteredIssues}
            onAction={handleResolveAction}
          />
        </>
      )}
    </div>
  );
}