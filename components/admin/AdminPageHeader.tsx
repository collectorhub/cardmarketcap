"use client";

import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface AdminPageHeaderProps {
  title: string;
  description: string;
}

export default function AdminPageHeader({ title, description }: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-slate-100 dark:border-slate-900 pb-2">
      <div>
        <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white font-sora">
          {title}
        </h1>
        <p className="text-sm text-slate-400 dark:text-slate-500 font-medium font-inter mt-0.5">
          {description}
        </p>
      </div>
      
      <div className="self-start md:self-auto hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#00BA88]/5 dark:bg-[#00BA88]/10 text-[#00BA88] border border-[#00BA88]/10 text-xs font-bold font-inter select-none">
        <ShieldCheck size={14} />
        <span>Canonical Tables Protected</span>
      </div>
    </div>
  );
}