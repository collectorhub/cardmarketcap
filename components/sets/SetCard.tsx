// components/sets/SetCard.tsx
import { ArrowUpRight, TrendingUp, Layers } from 'lucide-react';

interface Set {
  id?: string;
  name: string;
  releaseDate: string;
  totalCards: number;
  change: string;
  logoUrl: string;
  floorPrice?: string;
}

export function SetCard({ set }: { set: Set }) {
  return (
    <div className="group relative overflow-hidden rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition-all hover:shadow-2xl hover:shadow-[#00BA88]/10 hover:-translate-y-2 active:scale-[0.98]">
      
      {/* Set Logo Container */}
      <div className="relative aspect-[3/2] w-full mb-5 flex items-center justify-center bg-slate-50 dark:bg-slate-950/40 rounded-[1.5rem] overflow-hidden border border-slate-100 dark:border-slate-800/50">
        <img 
          src={set.logoUrl || "https://pokecollectorhub.com/assets/placeholder.png"} 
          alt={set.name}
          className="w-36 h-20 object-contain p-2 filter drop-shadow-sm group-hover:scale-110 transition-transform duration-500 ease-out"
        />
        
        {/* Indicators */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-2.5 py-1 border border-white/20 shadow-sm">
          <div className="h-1.5 w-1.5 rounded-full bg-[#00BA88] animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-tighter text-slate-900 dark:text-white">Live Data</span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight group-hover:text-[#00BA88] transition-colors line-clamp-1">
          {set.name}
        </h3>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                <Layers size={12} className="text-slate-500" />
             </div>
             <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tight">
               {set.totalCards} Cards
             </p>
          </div>
          <div className="flex items-center gap-1 text-[#00BA88] bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-lg">
            <TrendingUp size={10} strokeWidth={3} />
            <span className="text-[10px] font-black">{set.change}</span>
          </div>
        </div>
        
        {/* Release Metadata */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">
            Released {set.releaseDate}
          </span>
          <span className="text-[10px] font-black text-slate-900 dark:text-white">
             {set.floorPrice || "$0.00"} <span className="text-slate-400 font-medium">Floor</span>
          </span>
        </div>
      </div>

      {/* Action Overlay */}
      <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="w-full py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#00BA88] dark:hover:bg-[#00BA88] dark:hover:text-white transition-colors">
          View Expansion <ArrowUpRight size={14} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}