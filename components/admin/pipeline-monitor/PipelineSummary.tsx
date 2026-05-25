"use client";

import React from 'react';
import { Activity, Play, AlertCircle, CheckCircle2 } from 'lucide-react';
import MetricCard from '@/components/admin/MetricCard';

interface PipelineSummaryProps {
  activeJobs: number;
  totalProcessedToday: number;
  failedJobsCount: number;
  successRate: string;
}

export default function PipelineSummary({
  activeJobs,
  totalProcessedToday,
  failedJobsCount,
  successRate
}: PipelineSummaryProps) {
  
  const metrics = [
    {
      label: "Active Routines",
      value: activeJobs.toString(),
      sub: "Running In Parallel",
      icon: Play,
      color: activeJobs > 0 ? "bg-emerald-500/5 text-[#00BA88] border border-[#00BA88]/20" : "bg-slate-500/5 text-slate-400 border border-slate-500/10"
    },
    {
      label: "Ingested Rows Today",
      value: totalProcessedToday.toLocaleString(),
      sub: "Upstream Delta Stream",
      icon: Activity,
      color: "bg-blue-500/5 text-blue-500 border border-blue-500/10"
    },
    {
      label: "Failed Runs (24h)",
      value: failedJobsCount.toString(),
      sub: "Requires Log Inspection",
      icon: AlertCircle,
      color: failedJobsCount > 0 ? "bg-rose-500/5 text-rose-500 border border-rose-500/10" : "bg-slate-500/5 text-slate-400 border border-slate-500/10"
    },
    {
      label: "System Efficiency",
      value: successRate,
      sub: "Target SLA Threshold",
      icon: CheckCircle2,
      color: "bg-purple-500/5 text-purple-500 border border-purple-500/10"
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