"use client";

import React, { useState } from 'react';
// Added 'X' to the imports here
import { Search, Plus, ArrowLeft, Loader2, X } from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion';
import { fetchUniversalSearch } from "@/lib/queries/search";
import { addCardToPortfolio } from '@/lib/queries/portfolio';

const GRADES = ["PSA 10", "PSA 9", "PSA 8", "PSA 7", "Raw"];

export default function AddCardModal({ userId, onClose, onRefresh }: any) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const getAssetImage = (card: any) => {
    return card.image_small || card.image_url || card.imageUrl || card.image || card.image_large;
  };

  const handleSearch = async (val: string) => {
    setQuery(val);
    if (val.length > 2) {
      setIsSearching(true);
      try {
        const data = await fetchUniversalSearch(val, "pokemon");
        const normalized = (data || []).map((card: any) => ({
          ...card,
          displayImage: getAssetImage(card)
        }));
        setResults(normalized);
      } finally {
        setIsSearching(false);
      }
    } else {
      setResults([]);
    }
  };

  const handleAdd = async (grade: string) => {
    setIsAdding(true);
    const result = await addCardToPortfolio({
      user_id: userId,
      card_id: selectedCard.id,
      grade: grade
    });

    if (result.success) {
      onRefresh();
      onClose();
    } else {
      alert("Error: " + result.message);
      setIsAdding(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white dark:bg-slate-950 w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-900">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Add Asset</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full transition-colors">
              <X size={20} className="text-slate-400" />
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              autoFocus
              className="w-full pl-12 pr-12 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl outline-none border-2 border-transparent focus:border-[#00BA88] transition-all font-bold"
              placeholder="Search card name..."
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {isSearching && (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-[#00BA88]" size={18} />
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="max-h-[400px] min-h-[300px] overflow-y-auto">
          <AnimatePresence mode="wait">
            {!selectedCard ? (
              <motion.div 
                key="results-list"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="p-3 space-y-1"
              >
                {results.map((card) => (
                  <button 
                    key={card.id}
                    onClick={() => setSelectedCard(card)}
                    className="w-full flex items-center gap-4 p-3 hover:bg-[#00BA88]/5 dark:hover:bg-[#00BA88]/10 rounded-2xl transition-all group border border-transparent hover:border-[#00BA88]/20"
                  >
                    <div className="w-14 h-20 flex-shrink-0 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm">
                      <img 
                        src={card.displayImage} 
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" 
                        alt="" 
                        onError={(e: any) => { e.target.src = 'https://images.pokemontcg.io/swsh1/symbol.png'; }} 
                      />
                    </div>
                    <div className="text-left flex-grow">
                      <p className="font-bold text-slate-900 dark:text-white leading-tight">{card.name}</p>
                      <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">{card.set_name}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-[#00BA88] group-hover:text-white transition-all">
                      <Plus size={16} strokeWidth={3} />
                    </div>
                  </button>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="grade-selection"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="p-6 space-y-6"
              >
                <button 
                  onClick={() => setSelectedCard(null)} 
                  className="flex items-center gap-2 text-xs font-black text-[#00BA88] uppercase tracking-widest hover:translate-x-[-4px] transition-transform"
                >
                  <ArrowLeft size={14} strokeWidth={3} /> Back to Search
                </button>

                <div className="flex gap-5 items-center bg-slate-50 dark:bg-slate-900 p-5 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-inner">
                  <img src={selectedCard.displayImage} className="w-20 h-28 object-contain drop-shadow-2xl" alt={selectedCard.name} />
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">{selectedCard.name}</h3>
                    <p className="text-sm font-bold text-slate-500 mt-1">{selectedCard.set_name}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {GRADES.map(grade => (
                    <button 
                      key={grade}
                      disabled={isAdding}
                      onClick={() => handleAdd(grade)}
                      className="py-4 bg-white dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 hover:border-[#00BA88] hover:shadow-lg hover:shadow-[#00BA88]/10 rounded-2xl font-black text-xs uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center"
                    >
                      {isAdding ? <Loader2 className="animate-spin" size={16} /> : grade}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}