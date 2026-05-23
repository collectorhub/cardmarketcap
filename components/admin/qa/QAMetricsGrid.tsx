"use client";

import React from 'react';
import { ImageOff, Database, Layers, ShieldAlert, LucideIcon } from 'lucide-react';
import MetricCard from '../MetricCard';

export interface QAMetricSummary {
  label: string;
  count: number;
  severityType: 'error' | 'warning' | 'info' | 'critical';
}

interface QAMetricsGridProps {
  metrics: QAMetricSummary[];
}

export default function QAMetricsGrid({ metrics }: QAMetricsGridProps) {
  
  // Custom styled lookups for the validation state rules
  const getStyleConfigs = (type: QAMetricSummary['severityType']) => {
    const meta: Record<string, { icon: LucideIcon; color: string; subText: string }> = {
      error: { icon: ImageOff, color: "bg-rose-500/5 text-rose-500 border-rose-500/10", subText: "Frontend Assets" },
      warning: { icon: Database, color: "bg-amber-500/5 text-amber-500 border-amber-500/10", subText: "Integrity Flags" },
      info: { icon: Layers, color: "bg-indigo-500/5 text-indigo-500 border-indigo-500/10", subText: "Schema Variants" },
      critical: { icon: ShieldAlert, color: "bg-red-500/5 text-red-500 border-red-500/10", subText: "Exclusion Risk" }
    };
    return meta[type] || meta.info;
  };

  return (
    <div className="w-full font-inter">
      {/* Horizontal touch swipe layer active on mobile screen boundaries.
        Using .scrollbar-hide alongside the global JSX styles below.
      */}
      <div className="w-full overflow-x-auto scrollbar-hide snap-x snap-mandatory px-1 md:px-0 pb-2 md:pb-0">
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 min-w-max md:min-w-0">
          {metrics.map((m, idx) => {
            const config = getStyleConfigs(m.severityType);

            return (
              <MetricCard
                key={idx}
                label={m.label}
                value={m.count.toLocaleString()}
                sub={config.subText}
                icon={config.icon}
                color={config.color}
                index={idx}
              />
            );
          })}
        </div>
      </div>

      {/* Global CSS Inject to suppress visual native scrollbars entirely */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}