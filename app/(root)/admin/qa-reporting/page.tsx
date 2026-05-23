"use client";

import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck } from 'lucide-react';
import QAMetricsGrid, { QAMetricSummary } from '@/components/admin/qa/QAMetricsGrid';
import QAFilterTabs, { QATabType } from '@/components/admin/qa/QAFilterTabs';
import QAIssueTable, { QAAnomalyItem } from '@/components/admin/qa/QAIssueTable';

export default function QAReportingPage() {
  // 1. Centralized Production-Ready Metric Indicators Data
  const [metricsData] = useState<QAMetricSummary[]>([
    { label: "Missing Core Images", count: 142, severityType: "error" },
    { label: "Database Integrity Alerts", count: 28, severityType: "warning" },
    { label: "Variant Inconsistencies", count: 19, severityType: "info" },
    { label: "Polluted / Fake Rows", count: 3, severityType: "critical" }
  ]);

  // 2. Comprehensive Master Log Queue Array
  const [anomalyLogs, setAnomalyLogs] = useState<QAAnomalyItem[]>([
    {
      id: "qa_01",
      card_id: "card_88321",
      canonical_name: "Charizard [1st Edition Holo]",
      set_name: "Base Set",
      issue_type: "missing_image",
      severity: "high",
      detected_at: "May 22, 2026 - 14:20",
      description: "Frontend layout container initialized with a missing asset path link.",
      meta: { field: "imageUrl", current_value: "null" }
    },
    {
      id: "qa_02",
      card_id: "card_10022",
      canonical_name: "Lugia Neo #9",
      set_name: "Neo Genesis",
      issue_type: "variant_inconsistency",
      severity: "medium",
      detected_at: "May 23, 2026 - 09:11",
      description: "Reverse holo pricing telemetry assigned to standard printing slot.",
      meta: { field: "slug", current_value: "lugia-neo-9" }
    },
    {
      id: "qa_03",
      card_id: "card_99411",
      canonical_name: "Blastoise #2",
      set_name: "Base Set",
      issue_type: "duplicate_card",
      severity: "critical",
      detected_at: "May 23, 2026 - 11:45",
      description: "Identical expansion database ID matches two unique engine rows.",
      meta: { field: "expansion_id", current_value: "EXP-BASE-02" }
    },
    {
      id: "qa_04",
      card_id: "card_44102",
      canonical_name: "Pikachu Birthday Promo",
      set_name: "WOTC Promos",
      issue_type: "bad_slug",
      severity: "low",
      detected_at: "May 20, 2026 - 18:32",
      description: "Slug generation contains illegal trailing characters: pikachu-birthday--",
      meta: { field: "slug", current_value: "pikachu-birthday--" }
    },
    {
      id: "qa_05",
      card_id: "card_77219",
      canonical_name: "Mewtwo ex",
      set_name: "Ruby & Sapphire",
      issue_type: "null_critical_field",
      severity: "high",
      detected_at: "May 21, 2026 - 04:02",
      description: "Critical data field 'marketCap' returned null during pipeline compilation.",
      meta: { field: "marketCap", current_value: "null" }
    },
    {
      id: "qa_06",
      card_id: "card_88321",
      canonical_name: "Charizard [1st Edition Holo]",
      set_name: "Base Set",
      issue_type: "missing_image",
      severity: "high",
      detected_at: "May 22, 2026 - 14:20",
      description: "Frontend layout container initialized with a missing asset path link.",
      meta: { field: "imageUrl", current_value: "null" }
    },
    {
      id: "qa_07",
      card_id: "card_10022",
      canonical_name: "Lugia Neo #9",
      set_name: "Neo Genesis",
      issue_type: "variant_inconsistency",
      severity: "medium",
      detected_at: "May 23, 2026 - 09:11",
      description: "Reverse holo pricing telemetry assigned to standard printing slot.",
      meta: { field: "slug", current_value: "lugia-neo-9" }
    },
    {
      id: "qa_08",
      card_id: "card_99411",
      canonical_name: "Blastoise #2",
      set_name: "Base Set",
      issue_type: "duplicate_card",
      severity: "critical",
      detected_at: "May 23, 2026 - 11:45",
      description: "Identical expansion database ID matches two unique engine rows.",
      meta: { field: "expansion_id", current_value: "EXP-BASE-02" }
    },
    {
      id: "qa_09",
      card_id: "card_44102",
      canonical_name: "Pikachu Birthday Promo",
      set_name: "WOTC Promos",
      issue_type: "bad_slug",
      severity: "low",
      detected_at: "May 20, 2026 - 18:32",
      description: "Slug generation contains illegal trailing characters: pikachu-birthday--",
      meta: { field: "slug", current_value: "pikachu-birthday--" }
    },
    {
      id: "qa_10",
      card_id: "card_77219",
      canonical_name: "Mewtwo ex",
      set_name: "Ruby & Sapphire",
      issue_type: "null_critical_field",
      severity: "high",
      detected_at: "May 21, 2026 - 04:02",
      description: "Critical data field 'marketCap' returned null during pipeline compilation.",
      meta: { field: "marketCap", current_value: "null" }
    },
    {
      id: "qa_11",
      card_id: "card_88321",
      canonical_name: "Charizard [1st Edition Holo]",
      set_name: "Base Set",
      issue_type: "missing_image",
      severity: "high",
      detected_at: "May 22, 2026 - 14:20",
      description: "Frontend layout container initialized with a missing asset path link.",
      meta: { field: "imageUrl", current_value: "null" }
    },
    {
      id: "qa_12",
      card_id: "card_10022",
      canonical_name: "Lugia Neo #9",
      set_name: "Neo Genesis",
      issue_type: "variant_inconsistency",
      severity: "medium",
      detected_at: "May 23, 2026 - 09:11",
      description: "Reverse holo pricing telemetry assigned to standard printing slot.",
      meta: { field: "slug", current_value: "lugia-neo-9" }
    },
    {
      id: "qa_13",
      card_id: "card_99411",
      canonical_name: "Blastoise #2",
      set_name: "Base Set",
      issue_type: "duplicate_card",
      severity: "critical",
      detected_at: "May 23, 2026 - 11:45",
      description: "Identical expansion database ID matches two unique engine rows.",
      meta: { field: "expansion_id", current_value: "EXP-BASE-02" }
    },
    {
      id: "qa_14",
      card_id: "card_44102",
      canonical_name: "Pikachu Birthday Promo",
      set_name: "WOTC Promos",
      issue_type: "bad_slug",
      severity: "low",
      detected_at: "May 20, 2026 - 18:32",
      description: "Slug generation contains illegal trailing characters: pikachu-birthday--",
      meta: { field: "slug", current_value: "pikachu-birthday--" }
    },
    {
      id: "qa_15",
      card_id: "card_77219",
      canonical_name: "Mewtwo ex",
      set_name: "Ruby & Sapphire",
      issue_type: "null_critical_field",
      severity: "high",
      detected_at: "May 21, 2026 - 04:02",
      description: "Critical data field 'marketCap' returned null during pipeline compilation.",
      meta: { field: "marketCap", current_value: "null" }
    }
  ]);

  // 3. Filtering States
  const [activeTab, setActiveTab] = useState<QATabType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 4. Governance Core Handler Action Mutations
  const handleResolveAction = (id: string, resolution: 'approve' | 'exclude') => {
    setAnomalyLogs(prev => prev.filter(item => item.id !== id));
    console.log(`Action executing safely in staging buffers. Mutation: ${resolution} on targeted unit ${id}`);
  };

  // Derived filtered state data computations
  const filteredIssues = anomalyLogs.filter(item => {
    const matchesSearch = item.canonical_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.set_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (activeTab === 'all') return true;
    if (activeTab === 'assets') return item.issue_type === 'missing_image';
    if (activeTab === 'integrity') return ['duplicate_card', 'bad_slug', 'null_critical_field'].includes(item.issue_type);
    if (activeTab === 'variants') return item.issue_type === 'variant_inconsistency';
    return true;
  });

  return (
    <div className="space-y-6 font-inter pt-15 md:pt-0 max-w-[1600px] mx-auto text-slate-900 dark:text-slate-100">
      
      {/* REFINED HEADER SECTION FOR PERFECT CONSISTENCY */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-slate-100 dark:border-slate-900">
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white font-sora">
            Data Quality & QA Control Terminal
          </h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 font-medium font-inter mt-0.5">
            Inspect database anomalies, resolve variant conflicts, and govern frontend presentation states safely.
          </p>
        </div>
        
       <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#00BA88]/5 dark:bg-[#00BA88]/10 text-[#00BA88] border border-[#00BA88]/10 text-xs font-bold font-inter select-none">
            <ShieldCheck size={14} />
            <span>Canonical Tables Protected</span>
            </div>
        </div>

      {/* 1. Global Metrics Grid Driven via Passed State Array Props */}
      <QAMetricsGrid metrics={metricsData} />

      {/* REFINED ACTION BAR LAYOUT
        - Stripped away visual padding containers.
        - Mobile: Input full row 1, Tabs full row 2.
        - Desktop: Input locks left, Tabs lock perfectly right.
      */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 w-full pt-1">
        
        {/* Left Side Search Box */}
        <div className="relative w-full lg:w-96">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text"
            placeholder="Search anomaly index logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 h-10 bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/80 rounded-xl text-sm placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#00BA88]/20 focus:border-[#00BA88] transition-all font-medium"
          />
        </div>

        {/* Right Side Compact Filter Tabs */}
        <div className="w-full lg:w-auto flex justify-start lg:justify-end">
          <QAFilterTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

      </div>

      {/* 3. Actionable Table View Grid Pipeline Target */}
      <QAIssueTable 
        issues={filteredIssues} 
        onAction={handleResolveAction} 
      />

    </div>
  );
}