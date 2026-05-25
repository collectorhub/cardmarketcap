"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import MatchingQueueSummary from '@/components/Matching-Queue/MatchingQueueSummary';
import MatchingQueueFilters from '@/components/Matching-Queue/MatchingQueueFilters';
import MatchingRowItem from '@/components/Matching-Queue/MatchingRowItem';

export interface ProposedMatchItem {
  id: string;
  source_platform: 'ebay' | 'price_charting' | 'psa';
  scraped_title: string;
  scraped_raw_meta: {
    set_guess?: string;
    grade_guess?: string;
    raw_price?: number;
    scraped_at: string;
  };
  confidence_score: 'high' | 'medium' | 'low';
  proposed_canonical: {
    id: string;
    name: string;
    set_name: string;
    image_url?: string;
  };
}

const MOCK_MATCHES: ProposedMatchItem[] = [
  {
    id: "LOG_99211",
    source_platform: "ebay",
    scraped_title: "1999 Charizard Base Set 1st Edition Shadowless Holo #4 PSA 9 Mint",
    scraped_raw_meta: { set_guess: "Base Set", grade_guess: "PSA 9", raw_price: 4200.00, scraped_at: "10m ago" },
    confidence_score: "high",
    proposed_canonical: { id: "CARD_88321", name: "Charizard [1st Edition Holo]", set_name: "BASE SET" }
  },
  {
    id: "LOG_99212",
    source_platform: "psa",
    scraped_title: "Lugia Neo Genesis Holo 9 Rev-Holo variant guess",
    scraped_raw_meta: { set_guess: "Neo Genesis", grade_guess: "PSA 10", scraped_at: "24m ago" },
    confidence_score: "low",
    proposed_canonical: { id: "CARD_10022", name: "Lugia Neo #9", set_name: "NEO GENESIS" }
  },
  {
    id: "LOG_99213",
    source_platform: "price_charting",
    scraped_title: "Blastoise Base Set Holo #2 (1999) Excellent-Mint condition",
    scraped_raw_meta: { set_guess: "Base Set", grade_guess: "RAW", raw_price: 180.00, scraped_at: "1h ago" },
    confidence_score: "medium",
    proposed_canonical: { id: "CARD_99411", name: "Blastoise #2", set_name: "BASE SET" }
  }
];

export default function MatchingQueuePage() {
  const [issues, setIssues] = useState<ProposedMatchItem[]>(MOCK_MATCHES);
  const [activeTab, setActiveTab] = useState<'all' | 'ebay' | 'price_charting' | 'psa'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // --- ACTIONS PERSIST SOLELY TO SAFE HELPER STORAGE TABLES ---
  const handleMatchResolution = (id: string, action: 'approve' | 'reject') => {
    console.log(`Writing governance decision to mapping_tables: Log ID ${id} resolved as ${action}`);
    setIssues(prev => prev.filter(item => item.id !== id));
  };

  const filteredItems = issues.filter(item => {
    const matchesTab = activeTab === 'all' || item.source_platform === activeTab;
    const matchesSearch = item.scraped_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.proposed_canonical.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6 font-inter pt-15 md:pt-0 max-w-[1600px] mx-auto text-slate-900 dark:text-slate-100 py-6">
      
      {/* GLOBAL REUSED REFINED TERMINAL HEADER */}
      <AdminPageHeader 
        title="Matching Review Queue Terminal"
        description="Audit raw marketplace records, resolve source mapping conflicts, and map pipeline assets to master cards safely."
      />

      {/* SUMMARY TELEMETRY CARDS */}
      <MatchingQueueSummary 
        totalPending={issues.length}
        unmatchedEbay={issues.filter(i => i.source_platform === 'ebay').length}
        unmatchedPriceCharting={issues.filter(i => i.source_platform === 'price_charting').length}
        unmatchedPsa={issues.filter(i => i.source_platform === 'psa').length}
      />

      {/* FILTER PANEL HUB (SEARCH BOX LEFT | PILL TABS RIGHT) */}
      <MatchingQueueFilters 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* LIST LAYOUT RENDERER & LOG MANAGEMENT */}
        <div className="space-y-4">
          {/* TOP LEVEL LOGS COUNTER CHIP */}
          {filteredItems.length > 0 && (
            <div className="flex items-center gap-4 px-1 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 select-none font-inter">
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 px-2.5 py-1 rounded-md border border-slate-200/40 dark:border-slate-800/60">
                <span>Awaiting Verification:</span>
                <span className="text-slate-900 dark:text-white font-black">{filteredItems.length.toLocaleString()} Entries</span>
              </div>
            </div>
          )}

          {/* ANIMATED LOG STREAM CONTAINER */}
          <div className="space-y-3 min-h-[200px]">
            <AnimatePresence mode="popLayout" initial={false}>
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout="position"
                    initial={{ opacity: 0, y: 12, scale: 0.99 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0, 
                      scale: 1,
                      transition: { 
                        type: "spring", 
                        stiffness: 500, 
                        damping: 30,
                        delay: Math.min(index * 0.03, 0.15) // Micro-stagger entry logic
                      }
                    }}
                    exit={{ 
                      opacity: 0, 
                      scale: 0.97, 
                      y: -8,
                      transition: { duration: 0.15 } 
                    }}
                    className="w-full origin-center"
                  >
                    <MatchingRowItem 
                      item={item} 
                      onAction={handleMatchResolution} 
                    />
                  </motion.div>
                ))
              ) : (
                /* IMMACULATE EMPTY PIPELINE STATE */
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  className="py-24 text-center border border-dashed border-slate-200 dark:border-slate-800/80 rounded-2xl bg-white dark:bg-slate-900/40 shadow-xs flex flex-col items-center justify-center space-y-4 max-w-full"
                >
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/50 text-slate-300 dark:text-slate-700 rounded-full border border-slate-100 dark:border-slate-800/60 relative">
                    <svg className="h-8 w-8 animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#00BA88]/20 animate-spin-reverse" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs md:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white font-inter">
                      Pipeline Link Matrix Safe
                    </p>
                    <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 font-inter max-w-xs mx-auto leading-normal">
                      No outstanding third-party platform string anomalies require manual canonical resolution hooks.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
    </div>
  );
}