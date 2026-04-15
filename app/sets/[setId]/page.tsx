// app/sets/[setId]/page.tsx
import Navbar from "@/components/Navbar";
import { fetchExpansionDetails } from "@/lib/queries/market";
import { Calendar, Layers, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default async function SetDetailsPage({ params }: { params: { setId: string } }) {
  const result = await fetchExpansionDetails(params.setId);
  
  if (!result.success || !result.data) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-slate-500 font-black uppercase tracking-widest">Expansion Not Found</p>
        <Link href="/sets" className="text-[10px] font-bold uppercase underline">Back to Sets</Link>
      </div>
    );
  }

  const set = result.data;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950">
      <Navbar />
      
      {/* HIGH-END HEADER */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-24 pb-8 md:pt-32 md:pb-16">
        <div className="max-w-[1600px] mx-auto px-6">
          <Link href="/sets" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#00BA88] transition-colors mb-8 group">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Back to Library</span>
          </Link>

          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10">
            <div className="w-40 h-40 md:w-56 md:h-56 bg-slate-50 dark:bg-slate-950 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 flex items-center justify-center border border-slate-100 dark:border-slate-800 shadow-inner">
              <img src={set.logoUrl} alt={set.name} className="max-w-full max-h-full object-contain filter drop-shadow-xl" />
            </div>
            
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <span className="px-3 py-1 bg-[#00BA88]/10 text-[#00BA88] text-[9px] font-black rounded-full uppercase tracking-widest border border-[#00BA88]/20">
                  {set.series || "Standard"} Era
                </span>
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase">
                  <Calendar size={12} /> {set.releaseDate}
                </div>
              </div>
              <h1 className="text-3xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-[0.9]">
                {set.name}
              </h1>
              
              <div className="flex justify-center md:justify-start gap-8 pt-4">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Tracked</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white leading-none">{set.totalCards}</p>
                </div>
                <div className="w-px h-8 bg-slate-200 dark:border-slate-800" />
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Floor</p>
                  <p className="text-2xl font-black text-[#00BA88] leading-none">{set.floorPrice || "$0.00"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* POKEMON CARDS GRID */}
      <main className="max-w-[1600px] mx-auto px-4 md:px-6 py-12">
        {/* Adjusted grid-cols for better mobile density */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-8">
          {set.cards?.map((card: any) => (
            <div key={card.id} className="group cursor-pointer">
              <div className="relative aspect-[2.5/3.5] mb-3 bg-slate-100 dark:bg-slate-900 rounded-xl md:rounded-2xl overflow-hidden p-1 md:p-2 border border-transparent group-hover:border-[#00BA88]/30 transition-all group-hover:shadow-xl group-hover:shadow-[#00BA88]/5">
                 <img 
                  src={card.imageUrl} 
                  alt={card.name} 
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out"
                 />
              </div>
              <div className="space-y-1 px-1">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="text-[11px] md:text-[13px] font-black text-slate-900 dark:text-white uppercase leading-tight line-clamp-1">{card.name}</h4>
                  <span className="text-[9px] md:text-[10px] font-bold text-slate-400 shrink-0">#{card.number}</span>
                </div>
                <p className="text-[10px] md:text-[11px] font-black text-[#00BA88]">{card.price || "$0.00"}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}