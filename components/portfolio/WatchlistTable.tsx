"use client";

import React from 'react';
import { MoreVertical, TrendingUp, Info } from 'lucide-react';
import { cn } from "@/lib/utils";

// Assuming RowActions is imported or defined locally as per your reference
const RowActions = () => (
  <button className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
    <MoreVertical size={18} />
  </button>
);

export default function WatchlistTable({ cards }: { cards: any[] }) {
  return (
    <div className="w-full overflow-x-auto scrollbar-thin">
      <table className="w-full text-left border-collapse table-fixed min-w-[900px]">
        <thead>
          <tr className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-50 dark:border-slate-800">
            <th className="px-6 py-5 w-[30%]">Card Name</th>
            <th className="px-4 py-5 w-[15%] text-center">Grade</th>
            <th className="px-4 py-5 w-[20%]">Current Market</th>
            <th className="px-4 py-5 w-[20%]">7D Change</th>
            <th className="px-4 py-5 w-[10%] text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
          {cards.map((card, i) => (
            <tr key={i} className="group hover:bg-slate-50/50 dark:hover:bg-slate-950/50 transition-all">
              <td className="px-6 py-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-14 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{card.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{card.set}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-5 text-center">
                <span className="inline-flex px-2 py-1 rounded text-[10px] font-black bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20">
                  {card.grade}
                </span>
              </td>
              <td className="px-4 py-5">
                <p className="text-sm font-black text-slate-900 dark:text-white">${card.value.toLocaleString()}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Estimated Value</p>
              </td>
              <td className="px-4 py-5">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-emerald-500 font-bold text-sm">
                    <TrendingUp size={14} /> +{card.change7D}%
                  </div>
                </div>
              </td>
              <td className="px-6 py-5 text-right">
                <RowActions />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}