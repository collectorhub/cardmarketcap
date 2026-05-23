"use client";

import React from 'react';
import { Layers, ImageOff, Database, ShieldAlert, LucideIcon } from 'lucide-react';
import { cn } from "@/lib/utils";

export type QATabType = 'all' | 'assets' | 'integrity' | 'variants';

interface QAFilterTabsProps {
  activeTab: QATabType;
  onTabChange: (tab: QATabType) => void;
}

export default function QAFilterTabs({ activeTab, onTabChange }: QAFilterTabsProps) {
  const tabs: { id: QATabType; name: string; icon: LucideIcon }[] = [
    { id: 'all', name: 'All Logs', icon: Layers },
    { id: 'assets', name: 'Assets', icon: ImageOff },
    { id: 'integrity', name: 'Integrity', icon: Database },
    { id: 'variants', name: 'Variants', icon: ShieldAlert }
  ];

  return (
    <div className="flex gap-1 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-xl overflow-x-auto scrollbar-hide w-full lg:w-auto select-none">
      {tabs.map((t) => {
        const isActive = activeTab === t.id;
        const Icon = t.icon;

        return (
          <button
            key={t.id}
            onClick={() => onTabChange(t.id)}
            className={cn(
              "px-3.5 py-2 text-[9px] md:text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap flex-1 lg:flex-none",
              isActive 
                ? "bg-[#00BA88] text-white shadow-xs" 
                : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
            )}
          >
            <Icon 
              size={11} 
              className={cn("stroke-[2.5]", isActive ? "text-white" : "text-slate-400")} 
            />
            <span>{t.name}</span>
          </button>
        );
      })}
    </div>
  );
}