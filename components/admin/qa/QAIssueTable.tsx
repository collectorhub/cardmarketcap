"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Ban, MoreVertical, Inbox, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from "@/lib/utils";

export interface QAAnomalyItem {
  id: string;
  card_id: string;
  canonical_name: string;
  set_name: string;
  issue_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  detected_at: string;
  description: string;
  meta: {
    field: string;
    current_value: string;
  };
}

interface QAIssueTableProps {
  issues: QAAnomalyItem[];
  onAction: (id: string, resolution: 'approve' | 'exclude') => void;
}

// --- FLOATING FIXED DROPDOWN (PREVENTS CELL CLIPPING ON MOBILE / TABLE SCROLL) ---
const ActionDropdown = ({ onApprove, onExclude }: { onApprove: () => void; onExclude: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const updateCoords = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY + 6,
        left: rect.right + window.scrollX - 176,
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updateCoords();
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
    <div className="relative inline-block text-left font-inter">
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
        <MoreVertical size={15} />
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
                  onApprove();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-left cursor-pointer"
              >
                <Check size={14} className="text-[#00BA88]" />
                Approve Fix
              </button>

              <div className="h-px bg-slate-100 dark:bg-slate-800/60 my-1" />

              <button
                onClick={() => {
                  onExclude();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/5 dark:hover:bg-rose-500/10 rounded-lg transition-colors text-left cursor-pointer"
              >
                <Ban size={14} />
                Exclude Log
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function QAIssueTable({ issues = [], onAction }: QAIssueTableProps) {
  // Pagination State Setup (Reference table standards)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50; 
  const totalPages = Math.max(1, Math.ceil(issues.length / itemsPerPage));

  // Reset to page 1 if list content changes from active tab switches
  useEffect(() => {
    setCurrentPage(1);
  }, [issues.length]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedIssues = issues.slice(startIndex, startIndex + itemsPerPage);

  const severityBadgeMap = {
    low: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    medium: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    high: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-500",
    critical: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl md:rounded-[1.5rem] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-xs">
        <div className="overflow-x-auto scrollbar-hide rounded-t-xl md:rounded-t-[1.5rem]">
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-slate-950/40 text-[9px] md:text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-widest border-b border-slate-100 dark:border-slate-800/80 font-sora">
                <th className="py-4 px-4 md:px-6 w-24">Severity</th>
                <th className="py-4 px-4 md:px-6 w-[280px]">Target Canonical Card</th>
                <th className="py-4 px-4 md:px-6 w-44">Anomaly Category</th>
                <th className="py-4 px-4 md:px-6">Diagnostic Logs Context</th>
                <th className="py-4 px-4 md:px-6 w-24 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-inter">
              {paginatedIssues.length > 0 ? (
                paginatedIssues.map((issue) => (
                  <tr
                    key={issue.id}
                    className="group hover:bg-slate-50/40 dark:hover:bg-slate-950/20 transition-colors"
                  >
                    {/* Severity Badge */}
                    <td className="py-3.5 px-4 md:px-6 vertical-top">
                      <span className={cn(
                        "inline-flex items-center justify-center px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md",
                        severityBadgeMap[issue.severity]
                      )}>
                        {issue.severity}
                      </span>
                    </td>

                    {/* Target Card Identity Column */}
                    <td className="py-3.5 px-4 md:px-6">
                      <div className="font-bold text-slate-900 dark:text-white text-[13px] md:text-sm leading-tight">
                        {issue.canonical_name}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-normal mt-1">
                        <span>{issue.set_name}</span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span>ID: {issue.card_id}</span>
                      </div>
                    </td>

                    {/* Anomaly Category Block */}
                    <td className="py-3.5 px-4 md:px-6 font-mono text-[10px] md:text-[11px] font-bold text-slate-600 dark:text-slate-400 capitalize">
                      {issue.issue_type.replace(/_/g, ' ')}
                    </td>

                    {/* Diagnostic Logs & Active Meta Viewport */}
                    <td className="py-3.5 px-4 md:px-6">
                      <p className="text-[12px] md:text-[13px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-[450px]">
                        {issue.description}
                      </p>
                      <div className="mt-1.5 flex items-center gap-1.5 font-mono text-[11px] leading-none">
                        <span className="text-rose-500 dark:text-rose-400/90 font-semibold bg-rose-500/5 dark:bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/10">
                          {issue.meta.field} =&gt; "{issue.meta.current_value}"
                        </span>
                      </div>
                    </td>

                    {/* Governance Fixed Anchor Interactions */}
                    <td className="py-3.5 px-4 md:px-6 text-center">
                      <div className="hidden lg:flex items-center justify-center gap-1">
                        <button
                          onClick={() => onAction(issue.id, 'approve')}
                          title="Approve Fix"
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-[#00BA88] hover:border-[#00BA88] dark:hover:border-[#00BA88] hover:bg-[#00BA88]/5 transition-all cursor-pointer"
                        >
                          <Check size={14} strokeWidth={2.5} />
                        </button>
                        <button
                          onClick={() => onAction(issue.id, 'exclude')}
                          title="Exclude Log"
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-600 hover:border-rose-600 dark:hover:border-rose-500 hover:bg-rose-500/5 transition-all cursor-pointer"
                        >
                          <Ban size={14} strokeWidth={2.5} />
                        </button>
                      </div>
                      <div className="lg:hidden">
                        <ActionDropdown 
                          onApprove={() => onAction(issue.id, 'approve')}
                          onExclude={() => onAction(issue.id, 'exclude')}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <motion.div 
                      initial={{ opacity: 0, y: 6 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center justify-center space-y-3"
                    >
                      <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-full text-slate-300 dark:text-slate-700 border border-slate-100 dark:border-slate-800/60">
                        <Inbox size={40} strokeWidth={1.5} />
                      </div>
                      <p className="text-xs md:text-sm font-bold text-slate-400 dark:text-slate-500 tracking-wide">
                        Clean Pipeline Status: Zero Anomalies Detected
                      </p>
                    </motion.div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* COMPACT PAGINATION FOOTER (Directly from reference design specs) */}
        {issues.length > 0 && (
          <div className="p-4 bg-slate-50/50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between rounded-b-xl md:rounded-b-[1.5rem] font-inter select-none">
            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Page {currentPage} / {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER COUNT INDICATOR METRICS */}
      {issues.length > 0 && (
        <div className="flex items-center gap-4 px-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wide select-none font-inter">
          <div className="flex items-center gap-1.5">
            <span>Total Filtered Records:</span>
            <span className="text-slate-900 dark:text-white font-black">{issues.length.toLocaleString()} records</span>
          </div>
        </div>
      )}
    </div>
  );
}