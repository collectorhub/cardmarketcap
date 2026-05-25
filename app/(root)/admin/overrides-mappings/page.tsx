"use client";

import React, { useState } from 'react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import OverridesSummary from '@/components/admin/overrides-mappings/OverridesSummary';
import OverridesFilters from '@/components/admin/overrides-mappings/OverridesFilters';
import OverrideRuleRow from '@/components/admin/overrides-mappings/OverrideRuleRow';
import { OverrideRule } from '@/types/overrides';
import { Plus, Layers, ShieldCheck } from 'lucide-react';

const INITIAL_RULES_MOCK: OverrideRule[] = [
  {
    id: "rule_001",
    type: "alias_cleanup",
    raw_incoming_string: "Charizard 1st Ed Holo Shadowless 1999 Base Set #4",
    mapped_canonical_target: "Charizard [1st Edition Holo] #4",
    scope_target: "All Ingest",
    created_by: "Admin.Alex",
    created_at: "2026-05-20",
    status: "active"
  },
  {
    id: "rule_002",
    type: "global_exclusion",
    raw_incoming_string: "DIGIMON POKEMON METAZOO MYSTERY BOX LOT JUNK",
    mapped_canonical_target: "",
    scope_target: "eBay Scraper",
    created_by: "Admin.Sarah",
    created_at: "2026-05-24",
    status: "active"
  },
  {
    id: "rule_003",
    type: "frontend_helper",
    raw_incoming_string: "Blastoise Base Set Holo #2 Reverse-Holo Guess Match",
    mapped_canonical_target: "Blastoise #2 (Reverse-Holo Display Variant)",
    scope_target: "PSA Pop Ingest",
    created_by: "Admin.Alex",
    created_at: "2026-05-22",
    status: "suspended"
  }
];

export default function OverridesMappingsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'alias' | 'exclusion' | 'frontend'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [rules, setRules] = useState<OverrideRule[]>(INITIAL_RULES_MOCK);

  // Toggle active suspension configurations safely
  const handleToggleStatus = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, status: r.status === 'active' ? 'suspended' : 'active' } : r));
  };

  // Delete translation rules permanently
  const handleDeleteRule = (id: string) => {
    setRules(prev => prev.filter(r => r.id !== id));
  };

  // Metric summaries calculations
  const totalRules = rules.length;
  const aliasCleanups = rules.filter(r => r.type === 'alias_cleanup').length;
  const globalExclusions = rules.filter(r => r.type === 'global_exclusion').length;
  const frontendHelpers = rules.filter(r => r.type === 'frontend_helper').length;

  // Filtration logic layer
  const filteredRules = rules.filter(rule => {
    const matchesSearch = rule.raw_incoming_string.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          rule.mapped_canonical_target.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (activeTab === 'alias') return rule.type === 'alias_cleanup';
    if (activeTab === 'exclusion') return rule.type === 'global_exclusion';
    if (activeTab === 'frontend') return rule.type === 'frontend_helper';
    return true;
  });

  return (
    <div className="space-y-6 pt-15 md:pt-0">
      <AdminPageHeader 
        title="Override & Mapping Rules Engine" 
        description="Govern normalization strings, configure title sanitization dictionaries, and alter cmc_card_frontend records safely."
      />

      {/* CORE CRITICAL DATABASE PROTECTION BANNER */}
      <div className="p-4 bg-[#00BA88]/5 dark:bg-[#00BA88]/10 border border-[#00BA88]/10 rounded-2xl flex items-start gap-3 select-none font-inter">
        <ShieldCheck size={16} className="text-[#00BA88] shrink-0 mt-0.5 stroke-[2.5]" />
        <div className="space-y-1 text-xs font-medium text-slate-600 dark:text-slate-400">
          <p className="font-black uppercase tracking-wider text-[#00BA88]">
            Canonical Integrity Enforcement Protocol Active
          </p>
          <p className="leading-relaxed text-[11px] sm:text-xs">
            Altering values inside this console updates localized frontend assets and dictionary matching tables. Core historical relational data pipelines remain strictly <strong className="text-slate-900 dark:text-slate-200 font-bold font-mono">read-only</strong> and protected against unauthorized mutation vectors.
          </p>
        </div>
      </div>

      {/* METRICS ROW SECTION VIEWPORT */}
      <OverridesSummary 
        totalRules={totalRules}
        aliasCleanups={aliasCleanups}
        globalExclusions={globalExclusions}
        frontendHelpers={frontendHelpers}
      />

      {/* FILTER CONTROLS SEGMENT */}
      <OverridesFilters 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* RESULTS LIST INGESTION MODULE CONTROL HEADER */}
      <div className="flex flex-row items-center justify-between gap-2 px-1 font-inter select-none w-full">
        {/* LEFT SIDE: ULTRA-COMPACT QUERY TITLE COUNTER */}
        <div className="flex items-center gap-1.5 min-w-0">
          <Layers size={11} className="text-slate-400 dark:text-slate-500 shrink-0" />
          <span className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 font-sans truncate">
            <span className="inline sm:hidden">Rules ({filteredRules.length})</span>
            <span className="hidden sm:inline">Active Dictionary Rules ({filteredRules.length})</span>
          </span>
        </div>

        {/* RIGHT SIDE: FLEX-LOCKED ACTIONS TRIGGER BUTTON */}
        <button className="flex items-center justify-center gap-1 h-7 sm:h-9 px-2.5 sm:px-3.5 bg-[#00BA88] hover:bg-[#00a377] text-white font-black text-[9px] sm:text-xs uppercase tracking-wider rounded-lg sm:rounded-xl transition-all cursor-pointer shadow-xs shrink-0 whitespace-nowrap">
          <Plus size={11} strokeWidth={3} className="shrink-0" />
          <span className="inline sm:hidden">New Rule</span>
          <span className="hidden sm:inline">Create Rule Override</span>
        </button>
      </div>

      {/* DATA ROW GRID INGESTION MODULE */}
      <div className="space-y-3">
        {filteredRules.map(rule => (
          <OverrideRuleRow 
            key={rule.id}
            rule={rule}
            onToggleStatus={handleToggleStatus}
            onDeleteRule={handleDeleteRule}
          />
        ))}
      </div>

    </div>
  );
}