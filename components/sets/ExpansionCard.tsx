// components/sets/ExpansionCard.tsx
import { ArrowUpRight, TrendingUp } from 'lucide-react';
import { cn } from "@/lib/utils";

interface ExpansionCardProps {
  card: {
    id: string;
    name: string;
    imageUrl: string;
    number: string;
    price?: string;
    change?: number; // Added for UI consistency
  };
}

export function ExpansionCard({ card }: ExpansionCardProps) {
  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-[2.5/3.5] mb-4 bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden p-3 border border-slate-100 dark:border-slate-800 group-hover:border-[#00BA88]/30 transition-all duration-500 shadow-sm group-hover:shadow-xl group-hover:shadow-[#00BA88]/5">
        
        {/* Live Data Badge */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-2 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full border border-slate-100 dark:border-slate-800 shadow-sm">
          <span className="flex h-1.5 w-1.5 rounded-full bg-[#00BA88] animate-pulse" />
          <span className="text-[8px] font-black uppercase tracking-tighter text-slate-900 dark:text-white">Live</span>
        </div>

        <img 
          src={card.imageUrl} 
          alt={card.name} 
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out relative z-10"
        />

        {/* View Action Overlay */}
        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors z-0" />
      </div>

      <div className="space-y-1.5 px-2">
        <div className="flex justify-between items-start gap-2">
          <h4 className="text-[13px] font-black text-slate-900 dark:text-white uppercase leading-tight line-clamp-1 group-hover:text-[#00BA88] transition-colors">
            {card.name}
          </h4>
          <span className="text-[10px] font-bold text-slate-400 tabular-nums shrink-0">
            #{card.number}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
            {card.price || "$0.00"}
          </p>
          <div className="flex items-center gap-1 px-1.5 py-0.5 bg-[#00BA88]/10 rounded text-[#00BA88]">
            <TrendingUp size={10} />
            <span className="text-[9px] font-black">0.00%</span>
          </div>
        </div>
      </div>
    </div>
  );
}