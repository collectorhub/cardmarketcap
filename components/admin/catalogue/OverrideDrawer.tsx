"use client";

import React, { useState, useEffect } from 'react';
import { UnifiedCardRow } from './CatalogueTable';
import { X, ShieldAlert } from 'lucide-react';

interface OverrideDrawerProps {
  card: UnifiedCardRow | null;
  onClose: () => void;
  onSaveOverride: (id: string, updatedName: string) => void;
}

export default function OverrideDrawer({ card, onClose, onSaveOverride }: OverrideDrawerProps) {
  const [overrideName, setOverrideName] = useState("");

  useEffect(() => {
    if (card) {
      setOverrideName(card.frontend_display_name);
    }
  }, [card]);

  if (!card) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-end font-inter">
      {/* Click outside shield fallback */}
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-md h-full bg-white dark:bg-slate-900 border-l border-slate-100 dark:border-slate-800 p-6 space-y-6 shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-200">
        
        <div className="space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-black tracking-widest text-[#00BA88] uppercase block mb-1">
                Target Entity: {card.id}
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-sora">
                Configure Presentation Layer
              </h3>
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-400">
            <span className="font-bold block text-slate-700 dark:text-slate-300 mb-1">Source Standard (Protected):</span>
            "{card.canonical_name}"
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
              Display Name Override
            </label>
            <input 
              type="text" 
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-[#00BA88] focus:ring-2 focus:ring-[#00BA88]/10 transition-all font-inter font-medium"
              value={overrideName}
              onChange={(e) => setOverrideName(e.target.value)}
            />
          </div>

          <div className="flex gap-2 items-start p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl text-[11px] text-amber-600 dark:text-amber-500 font-medium leading-relaxed">
            <ShieldAlert size={16} className="shrink-0 mt-0.5" />
            <span>This action generates a record in your override schema tracking configuration layer. Source records in <b>cmc_cards</b> remain unaltered.</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={onClose} 
            className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs transition-all cursor-pointer select-none"
          >
            Cancel
          </button>
          <button 
            onClick={() => onSaveOverride(card.id, overrideName)}
            className="flex-1 py-2.5 bg-[#00BA88] hover:bg-[#00BA88]/90 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-[#00BA88]/10 cursor-pointer select-none"
          >
            Commit Override
          </button>
        </div>

      </div>
    </div>
  );
}