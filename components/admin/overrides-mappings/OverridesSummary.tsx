"use client";

import React from 'react';
import { ShieldAlert, FileText, Ban, Eye } from 'lucide-react';
import MetricCard from '@/components/admin/MetricCard';

interface OverridesSummaryProps {
  totalRules: number;
  aliasCleanups: number;
  globalExclusions: number;
  frontendHelpers: number;
}

export default function OverridesSummary({
  totalRules,
  aliasCleanups,
  globalExclusions,
  frontendHelpers
}: OverridesSummaryProps) {
  
  const metrics = [
    {
      label: "Total Safe Overrides",
      value: totalRules.toString(),
      sub: "Non-Canonical Mutations",
      icon: FileText,
      color: "bg-[#00BA88]/5 text-[#00BA88] border border-[#00BA88]/10 dark:bg-[#00BA88]/10"
    },
    {
      label: "Alias Cleanup Filters",
      value: aliasCleanups.toString(),
      sub: "Title Dictionary Normalizers",
      icon: Eye,
      color: "bg-blue-500/5 text-blue-500 border border-blue-500/10 dark:bg-blue-500/10"
    },
    {
      label: "Global Exclusion Blocks",
      value: globalExclusions.toString(),
      sub: "Polluted / Toxic Raw Rows",
      icon: Ban,
      color: "bg-rose-500/5 text-rose-500 border border-rose-500/10 dark:bg-rose-500/10"
    },
    {
      label: "Frontend Helpers",
      value: frontendHelpers.toString(),
      sub: "cmc_card_frontend Pointers",
      icon: ShieldAlert,
      color: "bg-purple-500/5 text-purple-500 border border-purple-500/10 dark:bg-purple-500/10"
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

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}