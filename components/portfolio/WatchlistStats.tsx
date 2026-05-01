"use client";

import React from 'react';
import { Bell, Activity, ArrowUpRight } from 'lucide-react';

export default function WatchlistStats({ data }: { data: any }) {
  const stats = [
    { label: 'Watchlist Value', val: `$${data.totalValue.toLocaleString()}`, change: `+${data.growth7D}%`, icon: <Activity className="text-emerald-500" /> },
    { label: 'Active Alerts', val: data.alertsActive, change: 'Price Targets', icon: <Bell className="text-purple-500" /> },
    { label: 'Avg. Daily Move', val: `+$${data.avgDailyChange}`, change: 'Estimated', icon: <ArrowUpRight className="text-blue-500" /> },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
            {stat.icon}
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-xl font-black text-slate-900 dark:text-white">{stat.val}</p>
              <span className="text-[10px] font-bold text-emerald-500">{stat.change}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}