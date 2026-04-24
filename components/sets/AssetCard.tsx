import { TrendingUp } from "lucide-react";
import Link from "next/link";

interface AssetCardProps {
  asset: {
    id: string;
    name: string;
    number?: string;
    price: string;
    imageUrl: string;
    canonicalUrl?: string;
    type?: string;
    rarity?: string;
    game?: string; // Add this line
  };
}

export function AssetCard({ asset }: AssetCardProps) {
  // Ensure we always have a game string
  const gameValue = asset.game || "pokemon";
  const gameQuery = `?game=${gameValue}`;

  // Use the canonicalUrl if it exists, otherwise use the ID
  // We ensure there are no double slashes //
  let baseUrl = asset.canonicalUrl ? asset.canonicalUrl : `/${asset.id}`;
  
  // Prepend /card if it's not already there
  if (!baseUrl.startsWith('/card')) {
    baseUrl = `/card${baseUrl.startsWith('/') ? '' : '/'}${baseUrl}`;
  }

  const detailHref = `${baseUrl}${gameQuery}`;
    
  // Helper to get color based on rarity
  const getRarityColor = (rarity: string = "") => {
    const r = rarity.toLowerCase();
    if (r.includes('enchanted') || r.includes('secret')) return 'text-purple-500';
    if (r.includes('super') || r.includes('legendary')) return 'text-orange-500';
    if (r.includes('rare')) return 'text-blue-500';
    return 'text-slate-400';
  };

  return (
    <Link href={detailHref} className="group block">
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-white/5 p-4 md:p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-[#00BA88]/10 hover:-translate-y-2">
        
        {/* Image Container with Hover Effect */}
        <div className="relative aspect-[3/4] mb-6 flex items-center justify-center">
          <img 
            src={asset.imageUrl} 
            alt={asset.name}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-2xl"
            loading="lazy"
          />
        </div>

        <div className="space-y-3">
          <div className="min-w-0">
            <h4 className="text-[13px] md:text-[15px] font-black text-slate-900 dark:text-white truncate tracking-tight">
              {asset.name}
            </h4>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5 flex items-center gap-1.5">
              <span className="text-slate-400">#{asset.number || "000"}</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              {/* Dynamic Rarity Color */}
              <span className={getRarityColor(asset.rarity || asset.type)}>
                {asset.rarity || asset.type || "Standard"}
              </span>
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Market Price</span>
              <span className="text-sm md:text-base font-black text-slate-900 dark:text-white tabular-nums">
                {asset.price}
              </span>
            </div>
            <div className="flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">
              <TrendingUp size={12} />
              <span className="text-[10px] font-black">Live</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}