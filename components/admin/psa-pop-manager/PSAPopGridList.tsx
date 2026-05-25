"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Database } from 'lucide-react';
import PSAPopRowItem from './PSAPopRowItem';
import { PSAPopulationItem } from '@/types/psa';

interface PSAPopGridListProps {
  items: PSAPopulationItem[];
  onAction: (id: string, action: 'approve' | 'reject' | 'adjust_variant') => void;
}

export default function PSAPopGridList({ items, onAction }: PSAPopGridListProps) {
  return (
    <div className="space-y-4 pt-2">
      {/* Dynamic Counter Chip */}
      <div className="flex items-center gap-2 px-1">
        <div className="h-2 w-2 rounded-full bg-[#00BA88] animate-pulse" />
        <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 font-inter">
          Awaiting Verification: {items.length} {items.length === 1 ? 'Entry' : 'Entries'}
        </span>
      </div>

      <div className="space-y-3 min-h-[300px]">
        <AnimatePresence mode="popLayout" initial={false}>
          {items.length > 0 ? (
            items.map((item, index) => (
              <motion.div
                key={item.id}
                layout="position"
                initial={{ opacity: 0, y: 12, scale: 0.99 }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  transition: { 
                    type: "spring", stiffness: 520, damping: 35,
                    delay: Math.min(index * 0.02, 0.10)
                  }
                }}
                exit={{ opacity: 0, scale: 0.98, y: -8, transition: { duration: 0.12 } }}
              >
                <PSAPopRowItem item={item} onAction={onAction} />
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-20 text-center border border-dashed border-slate-200 dark:border-slate-800/80 rounded-2xl bg-white dark:bg-slate-900/30 font-inter"
            >
              <div className="inline-flex p-3.5 bg-slate-50 dark:bg-slate-950/40 text-slate-400 dark:text-slate-600 rounded-full border border-slate-100 dark:border-slate-800/50 mb-3">
                <Database size={20} />
              </div>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500">
                No active registry matches found under selected query parameters.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}