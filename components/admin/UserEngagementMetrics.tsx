"use client";

import React from 'react';
import { Activity } from 'lucide-react';

interface UserEngagementMetricsProps {
  data: {
    totalActiveUsers: number;
    registeredPercentage: number;
    premiumSubscribers: number;
    watchlistConversionRate: number;
  };
}

export default function UserEngagementMetrics({ data }: UserEngagementMetricsProps) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;

  // Calculate approximate percentage for Premium Subscribers relative to active users
  const premiumPercentage = data.totalActiveUsers > 0 
    ? Math.min(Math.round((data.premiumSubscribers / data.totalActiveUsers) * 100), 100)
    : 0;

  const metrics = [
    {
      id: "active-users",
      label: "Active accounts online",
      value: data.totalActiveUsers.toLocaleString(),
      percentage: data.registeredPercentage,
      color: "stroke-[#00BA88]",
      glowColor: "bg-[#00BA88]/5 dark:bg-[#00BA88]/10",
      textColor: "text-[#00BA88]",
    },
    {
      id: "premium-subs",
      label: "Active billing collectors",
      value: data.premiumSubscribers.toLocaleString(),
      percentage: premiumPercentage,
      color: "stroke-amber-500",
      glowColor: "bg-amber-500/5 dark:bg-amber-500/10",
      textColor: "text-amber-500",
    },
    {
      id: "watchlist-activity",
      label: "Conversion from search to list",
      value: `${data.watchlistConversionRate}%`,
      percentage: Math.round(data.watchlistConversionRate),
      color: "stroke-blue-500",
      glowColor: "bg-blue-500/5 dark:bg-blue-500/10",
      textColor: "text-blue-500",
    }
  ];

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-6">
      
      {/* CARD TOP HEADER BLOCK */}
      <div className="border-b border-slate-50 dark:border-slate-800/80 pb-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 tracking-tight font-heading">
          <Activity className="h-4 w-4 text-[#00BA88]" />
          <span>Audience & Conversion Dynamics</span>
        </h2>
        <p className="text-slate-400 dark:text-slate-500 text-[13px] font-medium font-sans">
          Live monitoring of active app interaction states.
        </p>
      </div>

      {/* RESPONSIVE LAYOUT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {metrics.map((item) => {
          const strokeDashoffset = circumference - (item.percentage / 100) * circumference;

          return (
            <div 
              key={item.id}
              className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800/60 bg-slate-50/[0.12] dark:bg-slate-950/[0.15] flex items-center gap-5 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50/[0.4] dark:hover:bg-slate-950/[0.3] transition-all duration-300 group"
            >
              {/* Premium Inner-Glow Progress Ring Container */}
              <div className="relative flex items-center justify-center shrink-0 w-16 h-16">
                <div className={`absolute inset-0 rounded-full scale-95 transition-transform duration-500 group-hover:scale-100 ${item.glowColor}`} />
                <svg className="w-16 h-16 transform -rotate-90 relative z-10 drop-shadow-[0_2px_5px_rgba(0,0,0,0.02)]">
                  {/* Underlay Track */}
                  <circle
                    cx="32"
                    cy="32"
                    r={radius}
                    className="stroke-slate-100 dark:stroke-slate-800/50"
                    strokeWidth="5"
                    fill="transparent"
                  />
                  {/* Fluid Dynamic Progress Radial Ring */}
                  <circle
                    cx="32"
                    cy="32"
                    r={radius}
                    className={`${item.color} transition-all duration-1000 ease-out`}
                    strokeWidth="5"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                </svg>
                {/* Center Content: Pure Proportional Counter Text */}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <span className="text-[11px] font-bold tracking-tighter text-slate-800 dark:text-slate-200 font-mono">
                    {item.percentage}%
                  </span>
                </div>
              </div>
              
              {/* Text Layout Stack - Fully Fluid Vertical Adjustments */}
              <div className="space-y-1 flex-1 min-w-0">
                <span className="text-[12px] font-medium text-slate-400 dark:text-slate-500 block font-sans leading-tight break-words">
                  {item.label}
                </span>
                
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white font-mono leading-none">
                    {item.value}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}