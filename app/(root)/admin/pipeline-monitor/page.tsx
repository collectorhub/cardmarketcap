"use client";

import React, { useState } from 'react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import PipelineSummary from '@/components/admin/pipeline-monitor/PipelineSummary';
import PipelineFilters from '@/components/admin/pipeline-monitor/PipelineFilters';
import PipelineJobRow from '@/components/admin/pipeline-monitor/PipelineJobRow';
import { PipelineJob } from '@/types/pipeline';
import { Play, RefreshCw, Layers } from 'lucide-react';

const INITIAL_PIPELINE_JOBS: PipelineJob[] = [
  {
    id: "job_001",
    target_source: 'ebay_scraper',
    status: 'running',
    records_processed: 14820,
    speed_rate: "58 rec/s",
    progress_percent: 68,
    started_at: "2026-05-25 13:10:02",
    duration: "14m 22s"
  },
  {
    id: "job_002",
    target_source: 'psa_ingestion',
    status: 'running',
    records_processed: 3105,
    speed_rate: "112 rec/s",
    progress_percent: 42,
    started_at: "2026-05-25 13:20:00",
    duration: "04m 24s"
  },
  {
    id: "job_003",
    target_source: 'price_charting_sync',
    status: 'completed',
    records_processed: 89400,
    speed_rate: "240 rec/s",
    progress_percent: 100,
    started_at: "2026-05-25 11:00:00",
    duration: "06m 12s"
  },
  {
    id: "job_004",
    target_source: 'image_cdn_optimize',
    status: 'failed',
    records_processed: 412,
    speed_rate: "0 rec/s",
    progress_percent: 15,
    started_at: "2026-05-25 09:30:15",
    duration: "01m 05s",
    error_message: "403 Cloudflare Rate Limiting Triggered"
  }
];

export default function PipelineMonitorPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'ebay' | 'price_charting' | 'psa' | 'cdn'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [jobs, setJobs] = useState<PipelineJob[]>(INITIAL_PIPELINE_JOBS);

  const handleTriggerJob = (source: PipelineJob['target_source']) => {
    const newId = `job_${Date.now()}`;
    const newJob: PipelineJob = {
      id: newId,
      target_source: source,
      status: 'running',
      records_processed: 0,
      speed_rate: "Initializing...",
      progress_percent: 0,
      started_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      duration: "00m 01s"
    };
    setJobs(prev => [newJob, ...prev]);
  };

  const handleKillJob = (id: string) => {
    setJobs(prev => 
      prev.map(j => j.id === id ? { ...j, status: 'failed', speed_rate: '0 rec/s', error_message: 'Terminated by Admin Overrule' } : j)
    );
  };

  // Derive top-line statistics metrics row calculations
  const activeJobs = jobs.filter(j => j.status === 'running').length;
  const totalProcessedToday = jobs.reduce((acc, j) => acc + j.records_processed, 0);
  const failedCount = jobs.filter(j => j.status === 'failed').length;
  const completedCount = jobs.filter(j => j.status === 'completed').length;
  const totalEnded = completedCount + failedCount;
  const successRate = totalEnded > 0 ? `${Math.round((completedCount / totalEnded) * 100)}%` : "100%";

  // Stream Filtering Pipeline Layer
  const filteredJobs = jobs.filter(job => {
    // Search query check against target source or logging string contents
    const matchesSearch = job.target_source.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (job.error_message && job.error_message.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!matchesSearch) return false;
    if (activeTab === 'ebay') return job.target_source === 'ebay_scraper';
    if (activeTab === 'price_charting') return job.target_source === 'price_charting_sync';
    if (activeTab === 'psa') return job.target_source === 'psa_ingestion';
    if (activeTab === 'cdn') return job.target_source === 'image_cdn_optimize';
    return true;
  });

  return (
    <div className="space-y-6 pt-15 md:pt-0">
      <AdminPageHeader 
        title="Pipeline & Job Monitoring" 
        description="Audit execution loops, trigger direct target synchronizations, and safeguard ingestion ingestion rates safely."
      />

      {/* METRIC ROW SYSTEM LAYOUT TELEMETRY */}
      <PipelineSummary 
        activeJobs={activeJobs}
        totalProcessedToday={totalProcessedToday}
        failedJobsCount={failedCount}
        successRate={successRate}
      />

      {/* DIRECT CONTROL LAUNCH ENGINE PANEL */}
      <div className="hidden md:block p-5 bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/80 rounded-2xl space-y-4">
        <div>
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <RefreshCw size={14} className="text-[#00BA88]" />
            <span>Manual Ingestion Dispatches</span>
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-medium">
            Manually trigger pipeline streams. Upstream outputs will pipe through matching queues cleanly without mutating canonical data layouts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 pt-1">
          <button 
            onClick={() => handleTriggerJob('ebay_scraper')}
            className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30 hover:bg-slate-100 dark:hover:bg-slate-950 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
          >
            <span>Run eBay Scraper Engine</span>
            <Play size={12} className="fill-current text-[#00BA88]" />
          </button>
          <button 
            onClick={() => handleTriggerJob('price_charting_sync')}
            className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30 hover:bg-slate-100 dark:hover:bg-slate-950 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
          >
            <span>Sync PriceCharting APIs</span>
            <Play size={12} className="fill-current text-[#00BA88]" />
          </button>
          <button 
            onClick={() => handleTriggerJob('psa_ingestion')}
            className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30 hover:bg-slate-100 dark:hover:bg-slate-950 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
          >
            <span>Re-Ingest PSA Registry Files</span>
            <Play size={12} className="fill-current text-[#00BA88]" />
          </button>
          <button 
            onClick={() => handleTriggerJob('image_cdn_optimize')}
            className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30 hover:bg-slate-100 dark:hover:bg-slate-950 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
          >
            <span>Optimize Image CDN Pool</span>
            <Play size={12} className="fill-current text-[#00BA88]" />
          </button>
        </div>
      </div>

      {/* DEDICATED PILLED FILTER ROW COMPONENT */}
      <PipelineFilters 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* RENDER LIST RUNNING PIPELINES SECTIONS */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <Layers size={12} className="text-slate-400" />
          <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 font-sans">
            Filtered Execution Log Results ({filteredJobs.length})
          </span>
        </div>

        <div className="space-y-3">
          {filteredJobs.map((job) => (
            <PipelineJobRow 
              key={job.id} 
              job={job} 
              onForceKill={handleKillJob} 
            />
          ))}
        </div>
      </div>

    </div>
  );
}