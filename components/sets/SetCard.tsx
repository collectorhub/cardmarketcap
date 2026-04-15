// components/sets/SetCard.tsx
import Link from 'next/link';
import { ArrowUpRight, TrendingUp, Layers } from 'lucide-react';

interface Set {
  id: string; 
  name: string;
  releaseDate: string;
  totalCards: number;
  change: string;
  logoUrl: string;
  floorPrice?: string;
}

export function SetCard({ set }: { set: Set }) {
  return (
    <Link href={`/sets/${set.id}`} className="block group">
      <div className="relative overflow-hidden rounded-[1.25rem] md:rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 md:p-5 shadow-sm transition-all hover:shadow-2xl hover:shadow-[#00BA88]/10 hover:-translate-y-2 active:scale-[0.98]">
        
        {/* Set Logo Container */}
        <div className="relative aspect-[3/2] w-full mb-3 md:mb-5 flex items-center justify-center bg-slate-50 dark:bg-slate-950/40 rounded-[1rem] md:rounded-[1.5rem] overflow-hidden border border-slate-100 dark:border-slate-800/50">
          <img 
            src={set.logoUrl || "https://pokecollectorhub.com/assets/placeholder.png"} 
            alt={set.name}
            className="w-24 h-14 md:w-36 md:h-20 object-contain p-2 filter drop-shadow-sm group-hover:scale-110 transition-transform duration-500 ease-out"
          />
          
          <div className="absolute top-1.5 right-1.5 md:top-3 md:right-3 flex items-center gap-1 md:gap-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-1.5 py-0.5 md:px-2.5 md:py-1 border border-white/20 shadow-sm">
            <div className="h-1 w-1 md:h-1.5 md:w-1.5 rounded-full bg-[#00BA88] animate-pulse" />
            <span className="text-[7px] md:text-[9px] font-black uppercase tracking-tighter text-slate-900 dark:text-white">
              Live
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2.5 md:space-y-3">
          <h3 className="text-[12px] md:text-base font-black text-slate-900 dark:text-white leading-[1.2] group-hover:text-[#00BA88] transition-colors md:line-clamp-1">
            {set.name}
          </h3>
          
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1 md:gap-2">
              <div className="p-1 md:p-1.5 rounded-md md:rounded-lg bg-slate-100 dark:bg-slate-800">
                <Layers className="w-2.5 h-2.5 md:w-3 md:h-3 text-slate-500" />
              </div>
              <p className="text-[9px] md:text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tight whitespace-nowrap">
                {set.totalCards} <span className="hidden sm:inline">Cards</span>
              </p>
            </div>

            <div className="flex items-center gap-0.5 md:gap-1 text-[#00BA88] bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 md:px-2 md:py-1 rounded-md md:rounded-lg">
              <TrendingUp className="w-2.5 h-2.5 md:w-3 md:h-3" strokeWidth={3} />
              <span className="text-[9px] md:text-[10px] font-black">
                {set.change}
              </span>
            </div>
          </div>
          
          <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <span className="text-[7.5px] md:text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
              {set.releaseDate}
            </span>

            <span className="text-[9px] md:text-[10px] font-black text-slate-900 dark:text-white whitespace-nowrap">
              {set.floorPrice || "$0.00"}{" "}
              <span className="hidden sm:inline-block text-slate-400 font-medium ml-0.5">
                Floor
              </span>
            </span>
          </div>
        </div>

        {/* Action Overlay */}
        <div className="mt-3 md:mt-4 opacity-100 lg:opacity-0 group-hover:lg:opacity-100 transition-opacity">
          <div className="w-full py-2 md:py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg md:rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#00BA88] dark:hover:bg-[#00BA88] dark:hover:text-white transition-colors">
            View <span className="hidden sm:inline">Expansion</span>
            <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4" strokeWidth={3} />
          </div>
        </div>
      </div>
    </Link>
  );
}