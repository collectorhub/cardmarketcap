import { TrendingUp } from "lucide-react";
import Link from "next/link";

interface AssetCardProps {
  asset: {
    id: string;
    name: string;
    number?: string;
    printed_number?: string;
    price?: string;
    floorPrice?: string;
    imageUrl?: string;
    small_image?: string;
    canonicalUrl?: string;
    card_slug?: string;
    type?: string;
    rarity?: string;
    game?: string;
  };
}

export function AssetCard({ asset }: AssetCardProps) {
  // Normalize parameters using explicit fallbacks for schema properties
  const gameValue = asset.game || "pokemon";
  const gameQuery = `?game=${gameValue}`;
  const cardId = asset.id || asset.card_slug || "";

  const rawPath = asset.canonicalUrl && asset.canonicalUrl.trim() !== "" 
    ? asset.canonicalUrl 
    : `/${cardId}`;
  
  let baseUrl = rawPath;
  if (!baseUrl.startsWith('/card')) {
    baseUrl = `/card${baseUrl.startsWith('/') ? '' : '/'}${baseUrl}`;
  }

  const detailHref = `${baseUrl}${gameQuery}`;
  
  // Fallbacks for structural JSON image matching chains
  const activeImage = asset.imageUrl || asset.small_image || "https://pokecollectorhub.com/assets/placeholder.png";
  const displayNum = asset.number || asset.printed_number || "000";
  const displayPrice = asset.price || asset.floorPrice || "";
    
  const getRarityColor = (rarity: string = "") => {
    const r = rarity.toLowerCase();
    if (r.includes('enchanted') || r.includes('secret') || r.includes('illustration')) return 'text-purple-500 dark:text-purple-400';
    if (r.includes('super') || r.includes('legendary') || r.includes('holo')) return 'text-orange-500 dark:text-orange-400';
    if (r.includes('rare')) return 'text-emerald-500 dark:text-emerald-400';
    return 'text-slate-400 dark:text-slate-500';
  };

  return (
    <Link href={detailHref} className="group block">
      <div className="h-full flex flex-col bg-white dark:bg-slate-900 rounded-[1.5rem] md:rounded-[2rem] border border-slate-200 dark:border-white/5 p-3 md:p-5 transition-all duration-500 hover:shadow-2xl hover:shadow-[#00BA88]/10 hover:-translate-y-2 active:scale-[0.98]">
        
        {/* Aspect Ratio Protection for TCG Cards */}
        <div className="relative aspect-[3/4] w-full mb-4 md:mb-6 flex items-center justify-center bg-slate-50 dark:bg-slate-950/20 rounded-xl overflow-hidden p-2">
          <img 
            src={activeImage} 
            alt={asset.name || "TCG Card"}
            className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105 filter drop-shadow-xl"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = "https://pokecollectorhub.com/assets/placeholder.png";
            }}
          />
        </div>

        <div className="flex-1 flex flex-col justify-between space-y-3">
          <div className="min-w-0">
            <h4 className="text-[12px] md:text-[14px] font-black text-slate-900 dark:text-white tracking-tight group-hover:text-[#00BA88] transition-colors line-clamp-1">
              {asset.name || "Unnamed Card"}
            </h4>
            <p className="text-[10px] md:text-[11px] font-bold mt-0.5 flex items-center gap-1 md:gap-1.5 uppercase tracking-tight">
              <span className="text-slate-400">#{displayNum}</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className={`truncate max-w-[85px] ${getRarityColor(asset.rarity || asset.type)}`}>
                {asset.rarity || asset.type || "Standard"}
              </span>
            </p>
          </div>

          <div className="pt-2.5 md:pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-tighter">Market Price</span>
              <span className="text-[12px] md:text-base font-black text-slate-900 dark:text-white tabular-nums leading-tight">
                {displayPrice && displayPrice !== "$0.00" ? displayPrice : "—"}
              </span>
            </div>
            <div className="flex items-center gap-0.5 md:gap-1 text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 md:px-2 md:py-1 rounded-md md:rounded-lg shrink-0">
              <TrendingUp size={11} className="stroke-[3]" />
              <span className="text-[8px] md:text-[10px] font-black uppercase">Live</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}