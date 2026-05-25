"use client";

import React, { useState } from 'react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import PricingSummary from '@/components/admin/pricing-sales/PricingSummary';
import PricingFilters from '@/components/admin/pricing-sales/PricingFilters';
import TransactionRowItem from '@/components/admin/pricing-sales/TransactionRowItem';
import { TransactionSale } from '@/types/pricing';
import { ShoppingBag, Layers } from 'lucide-react';

const MOCK_SALES_RECORDS: TransactionSale[] = [
  {
    id: "sale_001",
    card_title: "1999 Pokemon Base Set Charizard Holo 1st Edition Shadowless #4",
    source_platform: 'ebay',
    price: 8450.00,
    sale_date: "2026-05-25 12:04",
    grade_status: 'graded',
    grade_value: "PSA 10",
    is_outlier: true,
    anomaly_reason: 'price_spike'
  },
  {
    id: "sale_002",
    card_title: "2000 Neo Genesis Lugia Holo First Edition #9",
    source_platform: 'price_charting',
    price: 1250.00,
    sale_date: "2026-05-25 11:42",
    grade_status: 'graded',
    grade_value: "PSA 9",
    is_outlier: false,
    anomaly_reason: 'none'
  },
  {
    id: "sale_003",
    card_title: "Base Set Blastoise Holo Authentic Reprint Lot Bundle Junk",
    source_platform: 'ebay',
    price: 18.50,
    sale_date: "2026-05-25 09:15",
    grade_status: 'raw',
    is_outlier: true,
    anomaly_reason: 'polluted_title_match'
  }
];

export default function PricingSalesPage() {
  const [activeTab, setActiveTab] = useState<'all_sales' | 'anomalies' | 'verified_pricing'>('all_sales');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sales, setSales] = useState<TransactionSale[]>(MOCK_SALES_RECORDS);

  // Approve outlier rows to pipe through frontend tables cleanly
  const handleApproveSale = (id: string) => {
    setSales(prev => prev.map(s => s.id === id ? { ...s, is_outlier: false, anomaly_reason: 'none' } : s));
  };

  // Drop or quarantine dirty data to isolate metric aggregations
  const handleQuarantineSale = (id: string) => {
    setSales(prev => prev.filter(s => s.id !== id));
  };

  // Derive top-line state summaries
  const totalProcessed = sales.length;
  const anomaliesCount = sales.filter(s => s.is_outlier).length;
  const avgValue = sales.reduce((acc, s) => acc + s.price, 0) / (totalProcessed || 1);

  // Filtration computation pass
  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.card_title.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (activeTab === 'anomalies') return sale.is_outlier;
    if (activeTab === 'verified_pricing') return !sale.is_outlier;
    return true;
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="Pricing & Sales Ingestion Stream" 
        description="Govern real-time marketplace sales telemetry, capture volatile outliers, and protect canonical charts from index spikes."
      />

      {/* TELEMETRY RUNTIME METRICS CARD ROW */}
      <PricingSummary 
        totalSalesProcessed={totalProcessed * 142} // Multiplying to simulate scale volume
        avgCardValue={avgValue}
        activeAnomaliesCount={anomaliesCount}
        healthyStreamRate="99.4%"
      />

      {/* SEARCH AND TAB SEGMENTS FILTER CONTAINER */}
      <PricingFilters 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* GRID DATA LOOP BLOCK */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <Layers size={12} className="text-slate-400" />
          <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 font-sans">
            Filtered Sales Records In Feed ({filteredSales.length})
          </span>
        </div>

        <div className="space-y-3">
          {filteredSales.map(sale => (
            <TransactionRowItem 
              key={sale.id}
              sale={sale}
              onApproveSale={handleApproveSale}
              onQuarantineSale={handleQuarantineSale}
            />
          ))}
        </div>
      </div>

    </div>
  );
}