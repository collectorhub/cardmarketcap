// components/sets/SetDetailsLoading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export function AssetCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] md:rounded-[2rem] border border-slate-200 dark:border-white/5 p-3 md:p-5 space-y-4 shadow-sm">
      {/* Image Placeholder - Matching the aspect-[3/4] in your code */}
      <div className="relative aspect-[3/4] w-full bg-slate-50 dark:bg-slate-950/40 rounded-[1rem] md:rounded-[1.5rem] overflow-hidden border border-slate-100 dark:border-slate-800/50 flex items-center justify-center">
        <Skeleton className="w-full h-full rounded-2xl opacity-40" />
        
        {/* Mock Live Badge */}
        <div className="absolute top-2 right-2 flex items-center gap-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 px-2 py-1">
          <Skeleton className="h-1.5 w-1.5 rounded-full" />
          <Skeleton className="h-2 w-6 rounded" />
        </div>
      </div>

      {/* Info Space */}
      <div className="space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-4 md:h-5 w-3/4 rounded-md" /> {/* Name */}
          <Skeleton className="h-2.5 md:h-3 w-1/2 rounded-md" /> {/* Number/Type */}
        </div>

        {/* Price Row */}
        <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
          <div className="space-y-1.5">
            <Skeleton className="h-2 w-8 rounded" /> {/* "PSA 10" Label */}
            <Skeleton className="h-3.5 md:h-4 w-16 rounded" /> {/* Price Value */}
          </div>
          <Skeleton className="h-6 w-12 rounded-lg" /> {/* Trend Badge */}
        </div>
      </div>
    </div>
  );
}

export function SetDetailsPageSkeleton() {
  return (
    <div className="animate-in fade-in duration-500">
      {/* --- HEADER SKELETON --- */}
      <header className="flex flex-col-reverse lg:flex-row items-start lg:items-center gap-8 mb-12">
        {/* Set Logo Placeholder */}
        <div className="shrink-0 w-full lg:w-60 h-70 md:h-60 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/10 flex items-center justify-center p-10">
          <Skeleton className="w-32 h-32 rounded-full opacity-20" />
        </div>

        {/* Text Content Placeholder */}
        <div className="flex-1 space-y-4 w-full">
          <div className="flex items-center gap-2">
            <Skeleton className="h-2 w-2 rounded-full" />
            <Skeleton className="h-3 w-24 rounded" />
          </div>
          <Skeleton className="h-10 md:h-14 w-3/4 md:w-1/2 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full max-w-2xl rounded" />
            <Skeleton className="h-4 w-2/3 rounded" />
          </div>
        </div>
      </header>

      {/* --- SEARCH BAR SKELETON --- */}
      <div className="mb-12">
        <Skeleton className="h-14 w-full rounded-2xl" />
      </div>

      {/* --- GRID HEADER --- */}
      <div className="flex items-center justify-between mb-8 px-1">
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-6 rounded-md" />
          <Skeleton className="h-7 w-40 rounded-md" />
        </div>
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>

      {/* --- ASSETS GRID --- */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
        {Array.from({ length: 15 }).map((_, i) => (
          <AssetCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}