"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";

interface CustomDropdownProps {
  label?: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
  className?: string;
}

export default function CustomDropdown({ 
  label, 
  value, 
  options, 
  onChange,
  className 
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const safeValue = value || "";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    /* Changed default layout class context from `w-[160px]` to `w-full` if no custom class is provided */
    <div className={cn("relative w-full font-inter md:shrink-0", className || "md:w-[160px]")} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full h-11 flex items-center justify-between gap-2 bg-white dark:bg-transparent border px-3.5 rounded-xl transition-all duration-200 text-left select-none cursor-pointer",
          isOpen 
            ? "border-[#00BA88] ring-2 ring-[#00BA88]/10" 
            : "border-slate-200/60 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
        )}
      >
        <div className="flex flex-col min-w-0 justify-center h-full">
          {label && (
            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider leading-none mb-0.5">
              {label}
            </span>
          )}
          <span 
            className={cn(
              "text-[12px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 truncate",
              label ? "leading-none" : "leading-normal mt-0.5"
            )}
          >
            {safeValue.replace(/psa/i, 'PSA')}
          </span>
        </div>
        <ChevronDown 
          size={13} 
          className={cn(
            "text-slate-400 dark:text-slate-500 transition-transform duration-200 shrink-0", 
            isOpen && "rotate-180 text-[#00BA88]"
          )} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
            /* Removed absolute layout `w-[160px]` limitation so option layout fits parent element width properly */
            className="absolute left-0 right-0 z-[200] mt-1.5 min-w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-[0_12px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_12px_30px_rgba(0,0,0,0.25)] overflow-hidden"
          >
            <div className="p-1 max-h-[220px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {options.map((opt) => {
                const isSelected = safeValue.toLowerCase() === opt.toLowerCase();
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      onChange(opt);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-2.5 py-2 text-[12px] font-bold rounded-lg transition-colors text-left cursor-pointer",
                      isSelected 
                        ? "bg-[#00BA88]/10 text-[#00BA88] dark:bg-[#00BA88]/15" 
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                    )}
                  >
                    <span className="truncate">{opt}</span>
                    {isSelected && <Check size={12} strokeWidth={3} className="shrink-0 ml-1.5" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}