"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, MoreVertical, Edit2, Trash2, Inbox } from 'lucide-react';
import { cn } from "@/lib/utils";

export interface UnifiedCardRow {
  id: string;
  canonical_name: string;
  set_name: string;
  slug: string;
  has_override: boolean;
  frontend_display_name: string;
  status: 'active' | 'flagged' | 'archived';
  imageUrl?: string;
  price?: string;
  marketCap?: string;
  gradeCount?: number;
  popTotal?: number;
  sales90d?: number;
}

interface CatalogueTableProps {
  initialCards: UnifiedCardRow[];
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  onSelectCard: (card: UnifiedCardRow) => void;
  onPageChange: (page: number) => void;
}

// --- FLOATING FIXED DROPDOWN (PREVENTS EVERY CLIPPING CONDITION) ---
const ActionDropdown = ({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  // Dynamically update coordinates relative to view viewport bounds
  const updateCoords = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      // Position the dropdown right-aligned to the button and slightly below it
      setCoords({
        top: rect.bottom + window.scrollY + 6,
        left: rect.right + window.scrollX - 176, // 176px matches w-44 layout width
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updateCoords();
      // Listen to layout changes to prevent alignment drift while open
      window.addEventListener('resize', updateCoords);
      window.addEventListener('scroll', updateCoords, true);
    }
    return () => {
      window.removeEventListener('resize', updateCoords);
      window.removeEventListener('scroll', updateCoords, true);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left">
      <button
        ref={triggerRef}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={cn(
          "p-2 rounded-xl transition-all duration-200 border bg-white dark:bg-slate-900",
          isOpen 
            ? "border-[#00BA88] text-[#00BA88] bg-[#00BA88]/5" 
            : "border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700"
        )}
      >
        <MoreVertical size={16} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, scale: 0.98, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -4 }}
            style={{
              position: 'fixed',
              top: coords.top - window.scrollY,
              left: coords.left - window.scrollX,
            }}
            className="w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl dark:shadow-2xl overflow-hidden z-[9999]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-1.5 space-y-0.5">
              <button
                onClick={() => {
                  onEdit();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-left"
              >
                <Edit2 size={14} className="text-slate-400" />
                Edit Override
              </button>

              <div className="h-px bg-slate-100 dark:bg-slate-800/60 my-1" />

              <button
                onClick={() => {
                  onDelete();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/5 dark:hover:bg-rose-500/10 rounded-lg transition-colors text-left"
              >
                <Trash2 size={14} />
                Delete Card
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function CatalogueTable({
  initialCards = [],
  totalRecords = 0,
  totalPages = 1,
  currentPage = 1,
  onSelectCard,
  onPageChange
}: CatalogueTableProps) {
  
  const handleDeleteMock = (cardId: string) => {
    alert(`Delete requested for card ID: ${cardId}`);
  };

  return (
    <div className="space-y-4">
      
      {/* CONTAINER FRAME */}
      <div className="rounded-xl md:rounded-[1.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="overflow-x-auto scrollbar-hide rounded-t-xl md:rounded-t-[1.5rem]">
          <table className="w-full text-left border-collapse min-w-[900px] font-sans">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-950/20 text-[9px] md:text-xs uppercase font-black text-slate-400 tracking-widest border-b border-slate-100 dark:border-slate-800">
                <th className="py-4 px-4 md:px-6 w-10 md:w-16 text-center">#</th>
                <th className="py-4 px-4 md:px-6">Card</th>
                <th className="py-4 px-4 md:px-6 w-[140px] md:w-auto">Set</th>
                <th className="py-4 px-4 md:px-6 text-right">Price (PSA 10)</th>
                <th className="py-4 px-4 md:px-6 text-right">Market Cap</th>
                <th className="py-4 px-4 md:px-6 text-right">Pop Report</th>
                <th className="py-4 px-4 md:px-6 text-right whitespace-nowrap">90D Sales</th>
                <th className="py-4 px-4 md:px-6 w-20 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {initialCards.length > 0 ? (
                initialCards.map((card, idx) => {
                  const displayImg = card.imageUrl || "https:\/\/images.scrydex.com\/pokemon\/adv1_ja-1\/small";
                  const displayPrice = card.price || "$0.00";
                  const displayMarketCap = card.marketCap || "$0.00M";
                  const displayPopCount = card.gradeCount || 0;
                  const displayPopTotal = card.popTotal || 0;
                  const displaySales = card.sales90d || 0;

                  return (
                    <tr
                      key={card.id}
                      className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      {/* Index */}
                      <td className="py-2.5 md:py-3 px-4 md:px-6 text-[12px] md:text-sm font-bold text-slate-400 text-center">
                        {(currentPage - 1) * 50 + idx + 1}
                      </td>

                      {/* Cleaned Title Line */}
                      <td className="py-2.5 md:py-3 px-4 md:px-6">
                        <div className="flex items-center gap-3 md:gap-5">
                          <div className={cn(
                            "h-10 w-7 md:h-12 md:w-9 shrink-0 rounded overflow-hidden shadow-sm relative ring-2 bg-slate-100 dark:bg-slate-900",
                            card.status === 'flagged' 
                              ? "ring-amber-500 dark:ring-amber-500/80" 
                              : "ring-transparent border border-slate-200 dark:border-slate-800"
                          )}>
                            <img
                              src={displayImg}
                              alt={card.canonical_name}
                              className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-200"
                              onError={(e) => {
                                e.currentTarget.src = "https://pokecollectorhub.com/assets/placeholder.png";
                              }}
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="font-black text-slate-900 dark:text-white text-[12px] md:text-sm truncate leading-tight group-hover:text-[#00BA88] transition-colors">
                              {card.has_override ? card.frontend_display_name : card.canonical_name}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Set Name */}
                      <td className="py-2.5 md:py-3 px-4 md:px-6 text-slate-500 dark:text-slate-400 font-bold text-[12px] md:text-xs uppercase truncate max-w-[90px] md:max-w-[180px]">
                        {card.set_name}
                      </td>

                      {/* Pricing */}
                      <td className="py-2.5 md:py-3 px-4 md:px-6 text-right font-black text-slate-900 dark:text-white text-[12px] md:text-[15px]">
                        {displayPrice}
                        <div className="text-[8px] md:text-[11px] text-slate-400 font-bold mt-0.5 uppercase tracking-tighter">
                          Avg: $0.00
                        </div>
                      </td>

                      {/* Cap */}
                      <td className="py-2.5 md:py-3 px-4 md:px-6 text-right font-black text-slate-900 dark:text-white text-[12px] md:text-[15px] uppercase">
                        {displayMarketCap}
                      </td>

                      {/* Pops */}
                      <td className="py-2.5 md:py-3 px-4 md:px-6 text-right">
                        <div className="text-[12px] md:text-sm font-black text-slate-700 dark:text-slate-200">
                          {displayPopCount.toLocaleString()}
                        </div>
                        <div className="text-[8px] md:text-[11px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">
                          Total: {displayPopTotal.toLocaleString()}
                        </div>
                      </td>

                      {/* Vol */}
                      <td className="py-2.5 md:py-3 px-4 md:px-6 text-right text-[12px] md:text-sm font-bold text-slate-400 whitespace-nowrap">
                        {displaySales} sales
                      </td>

                      {/* Custom Action Trigger Cell */}
                      <td className="py-2.5 md:py-3 px-4 md:px-6 text-center">
                        <ActionDropdown 
                          onEdit={() => onSelectCard(card)} 
                          onDelete={() => handleDeleteMock(card.id)} 
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-32 text-center">
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center justify-center space-y-4"
                    >
                      <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-full text-slate-300 dark:text-slate-700">
                        <Inbox size={48} strokeWidth={1.5} />
                      </div>
                      <p className="text-sm md:text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
                        No catalogued cards found
                      </p>
                    </motion.div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* COMPACT PAGINATION FOOTER */}
        {initialCards.length > 0 && (
          <div className="p-4 bg-slate-50/50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between rounded-b-xl md:rounded-b-[1.5rem]">
            <p className="text-[9px] md:text-xs font-black uppercase tracking-widest text-slate-400">
              Page {currentPage} / {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 transition-all"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 transition-all"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* BOTTOM CONTROL METRIC */}
      <div className="flex items-center gap-4 px-1 text-[9px] md:text-xs font-black uppercase text-slate-400 tracking-widest">
        <div className="flex items-center gap-1.5">
          <span>Total Filtered Records:</span>
          <span className="text-slate-900 dark:text-white font-black">{totalRecords.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}