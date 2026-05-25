"use client";

import React from 'react';
import { DollarSign, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import MetricCard from '@/components/admin/MetricCard';

interface PricingSummaryProps {
  totalSalesProcessed: number;
  avgCardValue: number;
  activeAnomaliesCount: number;
  healthyStreamRate: string;
}

export default function PricingSummary({
  totalSalesProcessed,
  avgCardValue,
  activeAnomaliesCount,
  healthyStreamRate
}: PricingSummaryProps) {
  
  const metrics = [
    {
      label: "Total Sales Monitored",
      value: totalSalesProcessed.toLocaleString(),
      sub: "Historical Transaction Pool",
      icon: DollarSign,
      color: "bg-blue-500/5 text-blue-500 border border-blue-500/10"
    },
    {
      label: "Avg Aggregated Price",
      value: `$${avgCardValue.toFixed(2)}`,
      sub: "Global Platform Index",
      icon: TrendingUp,
      color: "bg-purple-500/5 text-purple-500 border border-purple-500/10"
    },
    {
      label: "Flagged Outliers (24h)",
      value: activeAnomaliesCount.toString(),
      sub: "Quarantined Volatility",
      icon: AlertTriangle,
      color: activeAnomaliesCount > 0 ? "bg-rose-500/5 text-rose-500 border border-rose-500/10 animate-pulse" : "bg-slate-500/5 text-slate-400 border border-slate-500/10"
    },
    {
      label: "Data Stream Health",
      value: healthyStreamRate,
      sub: "Ingestion Integrity SLA",
      icon: CheckCircle,
      color: "bg-[#00BA88]/5 text-[#00BA88] border border-[#00BA88]/10"
    }
  ];

  return (
    <div className="w-full overflow-x-auto scrollbar-hide snap-x snap-mandatory">
      <div className="flex md:grid md:grid-cols-2 xl:grid-cols-4 gap-4 min-w-max md:min-w-0 pb-2">
        {metrics.map((metric, idx) => (
          <div key={idx} className="w-[285px] sm:w-[320px] md:w-auto snap-start shrink-0">
            <MetricCard
              label={metric.label}
              value={metric.value}
              sub={metric.sub}
              icon={metric.icon}
              color={metric.color}
              index={idx}
            />
          </div>
        ))}
      </div>
    </div>
  );
}