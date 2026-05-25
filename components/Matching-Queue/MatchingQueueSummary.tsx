"use client";

import React from 'react';
import { Layers, ArrowUpRight, Percent, Link2Off } from 'lucide-react';
import MetricCard from '@/components/admin/MetricCard'; // Verify this import path fits your architecture

interface MatchingQueueSummaryProps {
  totalPending: number;
  unmatchedEbay: number;
  unmatchedPriceCharting: number;
  unmatchedPsa: number;
}

export default function MatchingQueueSummary({
  totalPending,
  unmatchedEbay,
  unmatchedPriceCharting,
  unmatchedPsa
}: MatchingQueueSummaryProps) {
  
  const metrics = [
    {
      label: "Active Queue",
      value: totalPending.toLocaleString(),
      sub: "Pending Resolution",
      icon: Layers,
      color: "bg-[#00BA88]/5 text-[#00BA88] border border-[#00BA88]/10"
    },
    {
      label: "eBay Unmatched",
      value: unmatchedEbay.toLocaleString(),
      sub: "Awaiting Manual Map",
      icon: ArrowUpRight,
      color: "bg-blue-500/5 text-blue-500 border border-blue-500/10"
    },
    {
      label: "PriceCharting",
      value: unmatchedPriceCharting.toLocaleString(),
      sub: "Awaiting Validation",
      icon: Percent,
      color: "bg-purple-500/5 text-purple-500 border border-purple-500/10"
    },
    {
      label: "PSA Outliers",
      value: unmatchedPsa.toLocaleString(),
      sub: "Variant Failures",
      icon: Link2Off,
      color: "bg-rose-500/5 text-rose-500 border border-rose-500/10"
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

      {/* Global CSS Inject to suppress visual native scrollbars entirely on the summary section */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}