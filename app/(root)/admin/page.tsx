"use client";

import React, { useState } from 'react';
import { Database, Layers, Image as ImageIcon, ShieldCheck } from 'lucide-react';
import DashboardHeader from '@/components/admin/DashboardHeader';
import MetricCard from '@/components/admin/MetricCard';
import UserEngagementMetrics from '@/components/admin/UserEngagementMetrics';
import QaIntegrityReport from '@/components/admin/QaIntegrityReport';
import UserActivityOversight from '@/components/admin/UserActivityOversight';
// import PipelineOversight from '@/components/admin/PipelineOversight'; // Commented out per request

// --- TYPE DEFINITIONS ---
export interface CollectorActivity {
  id: string;
  type: 'portfolio' | 'watchlist' | 'flagged';
  user: string;
  detail: string;
  meta?: string;
  time: string;
}

// --- MOCK SYSTEM DATA ---
const coreMetrics = [
  { label: "Total Cards Ingested", value: "1,248,902", sub: "cmc_cards", icon: Database, color: "text-blue-600 bg-blue-500/10" },
  { label: "Total Expansions", value: "842", sub: "cmc_expansions", icon: Layers, color: "text-purple-600 bg-purple-500/10" },
  { label: "Frontend Display Cards", value: "412,051", sub: "cmc_card_frontend", icon: ShieldCheck, color: "text-emerald-600 bg-emerald-500/10" },
  { label: "Total Digital Assets", value: "2.4M", sub: "Images & Symbols", icon: ImageIcon, color: "text-amber-600 bg-amber-500/10" },
];

const engagementData = {
  totalActiveUsers: 5842,
  registeredPercentage: 68,
  premiumSubscribers: 1204,
  watchlistConversionRate: 24.8,
};

const qaAlerts = [
  { label: "Missing Market Pricing Data", count: 12409, priority: "high", table: "override_tables" },
  { label: "Missing Card Images", count: 1420, priority: "high", table: "cmc_card_frontend" },
  { label: "Missing PSA Population Data", count: 3412, priority: "medium", table: "mapping_tables" },
  { label: "Duplicate Card Ingestion Slugs", count: 12, priority: "critical", table: "cmc_cards (Protected)" },
];

const collectorActivities: CollectorActivity[] = [
  { id: "evt-001", type: "portfolio", user: "Dave_Collector", detail: "Added Charizard #4 (PSA 10) to main collection", meta: "+$1,050,000", time: "10m ago" },
  { id: "evt-002", type: "watchlist", user: "Poke_Tracer", detail: "Created price alert for Blastoise #2 (PSA 10)", meta: "Target: $480", time: "42m ago" },
  // { id: "evt-003", type: "flagged", user: "Lugia_Fanatic", detail: "Flagged missing image on Lugia Neo Genesis 1st Ed.", meta: "High Priority", time: "1h ago" },
  { id: "evt-004", type: "portfolio", user: "Satoshi_Cards", detail: "Imported portfolio via custom CSV loader", meta: "142 cards", time: "3h ago" }
];

export default function AdminDashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleManualSync = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1200);
  };

  return (
    <div className="bg-[#FAFAFB] dark:bg-slate-950 min-h-screen font-sans w-full space-y-8 pb-20 md:pb-0">
      
      {/* 1. HEADER */}
      <DashboardHeader isRefreshing={isRefreshing} onRefresh={handleManualSync} />

      {/* 2. CORE SYSTEM COUNTS */}
      <div className="w-full">
        <div className="flex md:grid md:grid-cols-4 overflow-x-auto md:overflow-x-visible gap-5 md:gap-5 items-stretch scrollbar-hide">
          {coreMetrics.map((metric, i) => (
            <MetricCard 
              key={metric.label} 
              index={i} 
              {...metric} 
            />
          ))}
        </div>

        {/* Injected layout-level global style block to guarantee clean cross-device tracks */}
        {/* <style jsx global>{`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style> */}
      </div>

      {/* 3. MAIN WORKSPACE SPLIT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT & CENTER SIDE */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Users, Premium Subs, and Watchlist Metrics with Circle Progress */}
          <UserEngagementMetrics data={engagementData} />
          
          {/* <PipelineOversight matches={ingestionMatches} /> -> Commented out for now */}
          
          {/* QA Reporting moved lower to anchor infrastructure sections */}
          <QaIntegrityReport alerts={qaAlerts} />
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6">
          <UserActivityOversight activities={collectorActivities} totalWatchlists={14842} />
        </div>

      </div>
    </div>
  );
}