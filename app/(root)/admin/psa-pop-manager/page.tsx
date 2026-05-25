"use client";

import React, { useState } from 'react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import PSAPopSummary from '@/components/admin/psa-pop-manager/PSAPopSummary';
import PSAPopFilters from '@/components/admin/psa-pop-manager/PSAPopFilters';
import PSAPopGridList from '@/components/admin/psa-pop-manager/PSAPopGridList';
import { PSAPopulationItem } from '@/types/psa';

// Mock initial state data matching your database configuration schema
const MOCK_PSA_DATA: PSAPopulationItem[] = [
  {
    id: "psa_pop_001",
    cert_prefix: "68xxxxxx",
    scraped_psa_name: "1999 Pokemon Base Set Charizard-Holo 1st Edition Shadowless",
    total_pop: 1240,
    grade_breakdown: { psa_10: 122, psa_9: 450, psa_8: 320, psa_7_or_lower: 310, qualifiers: 38 },
    is_matched: true,
    issue_type: 'none',
    proposed_canonical: { id: "CARD_88321", name: "Charizard [1st Edition Holo]", set_name: "BASE SET" }
  },
  {
    id: "psa_pop_002",
    cert_prefix: "81xxxxxx",
    scraped_psa_name: "2002 Lugia Neo Genesis Holo Ref Variant Split Error",
    total_pop: 85,
    grade_breakdown: { psa_10: 2, psa_9: 14, psa_8: 40, psa_7_or_lower: 29, qualifiers: 0 },
    is_matched: false,
    issue_type: 'variant_mismatch',
    proposed_canonical: { id: "CARD_10022", name: "Lugia Neo #9", set_name: "NEO GENESIS" }
  },
  {
    id: "psa_pop_003",
    cert_prefix: "34xxxxxx",
    scraped_psa_name: "Blastoise Base Set Holo #2 Reverse-Holo Guess Match",
    total_pop: 620,
    grade_breakdown: { psa_10: 15, psa_9: 180, psa_8: 240, psa_7_or_lower: 185, qualifiers: 0 },
    is_matched: true,
    issue_type: 'reverse_holo_mixup',
    proposed_canonical: { id: "CARD_99411", name: "Blastoise #2", set_name: "BASE SET" }
  }
];

export default function PSAPopManagerPage() {
  const [data, setData] = useState<PSAPopulationItem[]>(MOCK_PSA_DATA);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Handle manual resolution updates targeting mapping/override helper tables safely
  const handleMappingResolution = (id: string, action: 'approve' | 'reject' | 'adjust_variant') => {
    setData(prevData => 
      prevData.map(item => {
        if (item.id === id) {
          if (action === 'approve') {
            return { ...item, is_matched: true, issue_type: 'none' };
          } else if (action === 'reject') {
            return { ...item, is_matched: false, issue_type: 'unlinked_pop', proposed_canonical: undefined };
          }
        }
        return item;
      })
    );
  };

  // Derive summary metrics dynamically for our new component header layout block
  const totalPopVolume = data.reduce((acc, i) => acc + i.total_pop, 0);
  const unlinkedCount = data.filter(i => !i.is_matched).length;
  const variantConflicts = data.filter(i => i.issue_type === 'variant_mismatch' || i.issue_type === 'reverse_holo_mixup').length;
  const verifiedCount = data.filter(i => i.is_matched && i.issue_type === 'none').length;

  // Filter application pipeline layer
  const filteredItems = data.filter(item => {
    const matchesSearch = item.scraped_psa_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.proposed_canonical?.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (activeTab === 'unmatched') return !item.is_matched;
    if (activeTab === 'variants') return item.issue_type === 'variant_mismatch' || item.issue_type === 'reverse_holo_mixup';
    if (activeTab === 'verified') return item.is_matched && item.issue_type === 'none';
    return true;
  });

  return (
    <div className="space-y-6 pt-15 md:pt-0">
      {/* SECURITY ASSERTED BANNER ACTION */}
      <AdminPageHeader 
        title="Psa Pop Manager" 
        description="Audit certification blocks, isolate grade distributions, and govern variant index mapping pipelines safely."
      />

      {/* SNAP ELEMENT RESPONSIVE SCROLL SUMMARY SYSTEM */}
      <PSAPopSummary 
        totalPop={totalPopVolume}
        unlinkedCount={unlinkedCount}
        variantConflicts={variantConflicts}
        verifiedCount={verifiedCount}
      />

      {/* FILTER ACTION INTERFACE METRICS */}
      <PSAPopFilters 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />

      {/* ANIMATED LIST LAYOUT PIPELINE LAYER */}
      <PSAPopGridList 
        items={filteredItems} 
        onAction={handleMappingResolution} 
      />
    </div>
  );
}