"use client";

import React, { useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import PipelineSummary from "@/components/admin/pipeline-monitor/PipelineSummary";
import PipelineFilters from "@/components/admin/pipeline-monitor/PipelineFilters";
import PipelineJobRow from "@/components/admin/pipeline-monitor/PipelineJobRow";
import { PipelineJob } from "@/types/pipeline";
import { Play, RefreshCw, Layers, Loader2 } from "lucide-react";
import {
  getAdminPipelineMonitor,
  triggerAdminPipelineJob,
} from "@/lib/queries/admin/pipeline";

export default function PipelineMonitorPage() {
  const [activeTab, setActiveTab] = useState<
    "all" | "ebay" | "price_charting" | "psa" | "cdn"
  >("all");

  const [searchQuery, setSearchQuery] = useState("");
  const [jobs, setJobs] = useState<PipelineJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState<string | null>(null);

  const [summary, setSummary] = useState({
    activeJobs: 0,
    totalProcessedToday: 0,
    failedJobsCount: 0,
    successRate: "0%",
  });

  async function loadPipeline() {
    try {
      setLoading(true);

      const res = await getAdminPipelineMonitor();

      if (res?.success) {
        setJobs(Array.isArray(res.jobs) ? res.jobs : []);
        setSummary({
          activeJobs: Number(res.summary?.activeJobs || 0),
          totalProcessedToday: Number(res.summary?.totalProcessedToday || 0),
          failedJobsCount: Number(res.summary?.failedJobsCount || 0),
          successRate: String(res.summary?.successRate || "0%"),
        });
      }
    } catch (error) {
      console.error("Failed to load pipeline monitor:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPipeline();
  }, []);

  const handleTriggerJob = async (source: PipelineJob["target_source"]) => {
    try {
      setTriggering(source);

      const res = await triggerAdminPipelineJob(source);

      if (res?.success) {
        await loadPipeline();
      } else {
        alert(res?.message || "Failed to trigger job.");
      }
    } finally {
      setTriggering(null);
    }
  };

  const handleKillJob = (id: string) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === id
          ? {
              ...j,
              status: "failed",
              speed_rate: "0 rec/s",
              error_message: "Terminated by Admin Overrule",
            }
          : j
      )
    );
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.target_source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.error_message &&
        job.error_message.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (activeTab === "ebay") return job.target_source === "ebay_scraper";
    if (activeTab === "price_charting")
      return job.target_source === "price_charting_sync";
    if (activeTab === "psa") return job.target_source === "psa_ingestion";
    if (activeTab === "cdn") return job.target_source === "image_cdn_optimize";

    return true;
  });

  const dispatchButtons: {
    label: string;
    source: PipelineJob["target_source"];
  }[] = [
    { label: "Run eBay Scraper Engine", source: "ebay_scraper" },
    { label: "Sync PriceCharting APIs", source: "price_charting_sync" },
    { label: "Re-Ingest PSA Registry Files", source: "psa_ingestion" },
    { label: "Optimize Image CDN Pool", source: "image_cdn_optimize" },
  ];

  return (
    <div className="space-y-6 pt-15 md:pt-0">
      <AdminPageHeader
        title="Pipeline & Job Monitoring"
        description="Audit execution logs, trigger direct target synchronizations, and safeguard ingestion rates safely."
      />

      <PipelineSummary
        activeJobs={summary.activeJobs}
        totalProcessedToday={summary.totalProcessedToday}
        failedJobsCount={summary.failedJobsCount}
        successRate={summary.successRate}
      />

      <div className="hidden md:block p-5 bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/80 rounded-2xl space-y-4">
        <div>
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <RefreshCw size={14} className="text-[#00BA88]" />
            <span>Manual Ingestion Dispatches</span>
          </h2>

          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-medium">
            Manually trigger pipeline streams. For now, this logs dispatches
            safely without mutating protected canonical tables.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 pt-1">
          {dispatchButtons.map((button) => {
            const isThisTriggering = triggering === button.source;

            return (
              <button
                key={button.source}
                disabled={Boolean(triggering)}
                onClick={() => handleTriggerJob(button.source)}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30 hover:bg-slate-100 dark:hover:bg-slate-950 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span>{button.label}</span>
                {isThisTriggering ? (
                  <Loader2 size={12} className="animate-spin text-[#00BA88]" />
                ) : (
                  <Play size={12} className="fill-current text-[#00BA88]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <PipelineFilters
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <Layers size={12} className="text-slate-400" />
          <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 font-sans">
            Filtered Execution Log Results ({filteredJobs.length})
          </span>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center gap-3 text-slate-400 text-sm font-bold">
              <Loader2 className="animate-spin text-[#00BA88]" size={18} />
              Loading live pipeline health...
            </div>
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <PipelineJobRow
                key={job.id}
                job={job}
                onForceKill={handleKillJob}
              />
            ))
          ) : (
            <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center text-slate-400 text-sm font-bold">
              No pipeline jobs match this filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}