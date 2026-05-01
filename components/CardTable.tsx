import React from 'react';
import { Info, ArrowUpRight, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardData {
  name: string;
  set: string;
  grade: string;
  lastSale: string;
  lastSaleDate: string;
  marketValue: string;
  valueChange: string;
  allocation: string;
  trendColor: string;
  trendPath: string;
  image?: string;
}

const TrendLine = ({ path, color, index }: { path: string; color: string; index: number }) => {
  // Extract terminal Y for the glow marker
  const terminalY = path.split('T').pop()?.split(',')[1] || "20";

  return (
    <div className="h-10 w-full max-w-[120px] flex items-center">
      <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id={`gradient-${index}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          d={`${path} L 100,40 L 0,40 Z`}
          fill={`url(#gradient-${index})`}
        />
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          d={path}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeDasharray="1 4"
          strokeLinecap="round"
          className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
        />
        <circle cx="100" cy={terminalY} r="2" fill={color} />
        <circle cx="100" cy={terminalY} r="5" fill={color} className="animate-pulse opacity-20 blur-[2px]" />
      </svg>
    </div>
  );
};

export const CardTable = ({ data, title = "Your Top Cards" }: { data: CardData[], title?: string }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
      <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          {title} <Info size={14} className="text-slate-300 dark:text-slate-600 cursor-help" />
        </h3>
      </div>
      
      <div className="w-full overflow-x-auto scrollbar-hide lg:scrollbar-default">
        <table className="w-full text-left border-collapse table-fixed min-w-[900px] lg:min-w-full">
          <thead>
            <tr className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-50 dark:border-slate-800">
              <th className="px-6 py-4 w-[25%]">Card</th>
              <th className="px-4 py-4 w-[15%]">Set</th>
              <th className="px-2 py-4 w-[10%] text-center">Grade</th>
              <th className="px-4 py-4 w-[12%]">Last Sale</th>
              <th className="px-4 py-4 w-[12%]">Market Value</th>
              <th className="px-4 py-4 w-[15%]">Trend</th>
              <th className="px-4 py-4 w-[8%] text-right pr-6">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {data.map((card, i) => (
              <tr key={i} className="group cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-950/50 transition-all">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-11 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 shrink-0 overflow-hidden">
                      {card.image && <img src={card.image} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors truncate">
                      {card.name}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[11px] text-slate-400 font-bold uppercase truncate">{card.set}</p>
                </td>
                <td className="px-2 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {card.grade}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[13px] font-black text-slate-900 dark:text-white leading-tight">{card.lastSale}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{card.lastSaleDate}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[13px] font-black text-slate-900 dark:text-white leading-tight">{card.marketValue}</p>
                  <p className={cn("text-[10px] font-bold flex items-center gap-0.5", card.valueChange.startsWith('+') ? "text-emerald-500" : "text-red-500")}>
                    {card.valueChange}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <TrendLine path={card.trendPath} color={card.trendColor} index={i} />
                </td>
                <td className="px-4 py-4 text-right pr-6">
                  <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400">
                    <MoreHorizontal size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-slate-50/30 dark:bg-slate-950/30 border-t border-slate-50 dark:border-slate-800">
        <button className="group/btn text-[13px] font-bold text-emerald-500 hover:text-emerald-600 flex items-center justify-center gap-2 w-full transition-all tracking-wide">
          View Detailed Analytics 
          <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};