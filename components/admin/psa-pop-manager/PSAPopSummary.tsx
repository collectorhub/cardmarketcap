"use client";

import React from 'react';
import { Layers, HelpCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import MetricCard from '@/components/admin/MetricCard';

interface PSAPopSummaryProps {
  totalPop: number;
  unlinkedCount: number;
  variantConflicts: number;
  verifiedCount: number;
}

export default function PSAPopSummary({
  totalPop,
  unlinkedCount,
  variantConflicts,
  verifiedCount
}: PSAPopSummaryProps) {
  
  const metrics = [
    {
      label: "Total PSA Volume",
      value: totalPop.toLocaleString(),
      sub: "Scraped Data Pool",
      icon: Layers,
      color: "bg-blue-500/5 text-blue-500 border border-blue-500/10 dark:bg-blue-500/10"
    },
    {
      label: "Awaiting Mapping",
      value: unlinkedCount.toLocaleString(),
      sub: "Unlinked Populations",
      icon: HelpCircle,
      color: "bg-amber-500/5 text-amber-500 border border-amber-500/10 dark:bg-amber-500/10"
    },
    {
      label: "Variant Conflicts",
      value: variantConflicts.toLocaleString(),
      sub: "Rev-Holo & Splits",
      icon: ShieldAlert,
      color: "bg-rose-500/5 text-rose-500 border border-rose-500/10 dark:bg-rose-500/10"
    },
    {
      label: "Verified Assertions",
      value: verifiedCount.toLocaleString(),
      sub: "Safe Proxy Mappings",
      icon: CheckCircle2,
      color: "bg-[#00BA88]/5 text-[#00BA88] border border-[#00BA88]/10 dark:bg-[#00BA88]/10"
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

      {/* Suppress visual scrollbars on the metrics viewport section */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}