"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, X, Loader2, Check, TrendingUp, Plus,
  Zap, Wand2, Star, Anchor, LayoutGrid
} from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";
import { fetchUniversalSearch } from "@/lib/queries/search";
import { addCardToPortfolio } from '@/lib/queries/portfolio';

const QUICK_FILTERS = [
  { id: "pokemon", name: "Pokémon", icon: Zap },
  { id: "mtg", name: "Magic", icon: Wand2 },
  { id: "lorcana", name: "Lorcana", icon: Star },
  { id: "onepiece", name: "One Piece", icon: Anchor },
];

export default function AddCardModal({ userId, onClose, onRefresh }: any) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [activeUserId, setActiveUserId] = useState(userId);
  const [successId, setSuccessId] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      const stored = localStorage.getItem('user_data');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setActiveUserId(parsed.id || parsed.user_id); 
        } catch (e) { console.error(e); }
      }
    }
  }, [userId]);

  const performSearch = useCallback(async (searchQuery: string, catId: string | null) => {
    // If no query and no category, don't ping the server
    if (!searchQuery.trim() && !catId) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Logic fix: trimming query to handle the "empty" search when a filter is clicked
      const data = await fetchUniversalSearch(searchQuery.trim(), catId, 20);
      setResults(data || []);
    } catch (err) {
      console.error("Search failed:", err);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Trigger search if we have a query OR a category is active
      if (query.trim().length >= 2 || selectedCategory) {
        performSearch(query, selectedCategory);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query, selectedCategory, performSearch]);

  const handleQuickAdd = async (e: React.MouseEvent, card: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (!activeUserId || addingId) return;
    
    setAddingId(card.id);
    const result = await addCardToPortfolio({
      user_id: activeUserId,
      card_id: card.id,
      grade: "Raw"
    });

    if (result.success) {
      setSuccessId(card.id);
      setTimeout(() => {
        onRefresh();
        onClose();
      }, 800);
    } else {
      setAddingId(null);
    }
  };

  const selectFilter = (id: string) => {
  // If clicking the same filter, toggle it off.
  const newCat = selectedCategory === id ? null : id;
  setSelectedCategory(newCat);
  
  // If we just selected a category, we clear the text query.
  // This allows the PHP "INITIAL LOAD MODE" (ORDER BY asset_id DESC)
  // to show the newest cards for that specific game.
  if (newCat) {
    setQuery(""); 
  }
};

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white dark:bg-[#0B0F1A] w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-white/5 flex flex-col max-h-[85vh]"
      >
        {/* Header Section */}
        <div className="px-6 pt-8 pb-4 border-b border-slate-100 dark:border-white/5 bg-white dark:bg-[#0B0F1A] z-10">
          <div className="flex justify-between items-start mb-6 px-2">
            <div>
              {/* Balanced Caps: Sentence case for heading and guide text */}
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Add a card</h2>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] font-medium mt-0.5">Search for an asset to add it to your collection</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all">
              <X size={18} className="text-slate-400" />
            </button>
          </div>
          
          <div className="relative group mb-6 px-2">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00BA88] transition-colors" size={18} />
            <input 
              autoFocus
              className="w-full pl-12 pr-12 py-4 bg-slate-50 dark:bg-white/[0.03] rounded-2xl outline-none border border-slate-100 dark:border-white/5 focus:border-[#00BA88] transition-all font-bold placeholder:text-slate-400 dark:text-white text-sm"
              placeholder="Search by name, set, or collector number..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {isSearching && (
              <Loader2 className="absolute right-6 top-1/2 -translate-y-1/2 animate-spin text-[#00BA88]" size={16} />
            )}
          </div>

          <div className="flex items-center gap-2 pb-2 px-2 overflow-x-auto no-scrollbar">
            {QUICK_FILTERS.map((cat) => (
              <button 
                key={cat.id}
                onClick={() => selectFilter(cat.id)}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-full border text-[10px] font-black uppercase tracking-wider transition-all",
                  selectedCategory === cat.id 
                    ? "bg-[#00BA88] border-[#00BA88] text-white shadow-lg shadow-[#00BA88]/20" 
                    : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 hover:border-[#00BA88]/50"
                )}
              >
                <cat.icon size={12} className={selectedCategory === cat.id ? "animate-pulse" : ""} />
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Container */}
        <div className="flex-grow overflow-y-auto p-6 custom-scrollbar bg-slate-50/20 dark:bg-transparent">
          <div className="grid grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {results.map((card, idx) => {
                const isAdding = addingId === card.id;
                const isSuccess = successId === card.id;
                
                return (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: idx * 0.02 } }}
                    key={card.id}
                    className="group bg-white dark:bg-slate-900/40 rounded-[2.2rem] border border-slate-100 dark:border-white/5 p-4 relative transition-all hover:shadow-2xl hover:shadow-[#00BA88]/10 hover:-translate-y-1 hover:border-[#00BA88]/40"
                  >
                    <div className="relative aspect-[3/4] mb-6 flex items-center justify-center rounded-2xl overflow-hidden bg-slate-50 dark:bg-white/5">
                      <img 
                        src={card.image_small || card.image_url || card.imageUrl} 
                        className="w-[85%] h-[85%] object-contain transition-transform duration-700 group-hover:scale-110 drop-shadow-2xl" 
                        alt={card.name} 
                      />
                    </div>

                    <div className="space-y-1 px-1">
                      {/* Kept Black Caps and sizing for card metadata as requested */}
                      <h4 className="text-[13px] font-black uppercase text-slate-900 dark:text-white truncate tracking-tight">
                        {card.name}
                      </h4>
                      <p className="text-[10px] font-bold text-slate-400 truncate">
                        {card.set_name || "Collection Asset"}
                      </p>
                      
                      <div className="pt-3 mt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black text-slate-400 uppercase leading-none mb-0.5 tracking-widest">Market</span>
                          <span className="text-[13px] font-black text-slate-900 dark:text-white">
                            {card.price || "$--"}
                          </span>
                        </div>

                       <button
                          onClick={(e) => handleQuickAdd(e, card)}
                          disabled={isAdding || isSuccess}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-xl transition-all font-bold text-[10px] border tracking-tighter",
                            isSuccess 
                              ? "bg-slate-100 dark:bg-white/10 text-[#00BA88] border-[#00BA88]/20 cursor-default" 
                              : "bg-[#00BA88] text-white border-[#00BA88] hover:bg-[#00a377] active:scale-95 disabled:opacity-80"
                          )}
                        >
                          {isSuccess ? (
                            <>
                              <Check size={12} strokeWidth={4} className="animate-in zoom-in duration-300" />
                              <span>Added</span>
                            </>
                          ) : isAdding ? (
                            <>
                              <Loader2 size={12} className="animate-spin" />
                              <span>Adding...</span>
                            </>
                          ) : (
                            <>
                              <Plus size={12} strokeWidth={4} />
                              <span>Add</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {!isSearching && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-4">
                <LayoutGrid size={24} className="opacity-20" />
              </div>
              <p className="text-[11px] font-medium text-center max-w-[200px] leading-relaxed">
                Enter a search term or select a category to browse cards.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}