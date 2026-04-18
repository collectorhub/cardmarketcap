import { Skeleton } from "@/components/ui/skeleton";

export function SetCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-[1.25rem] md:rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 md:p-5 shadow-sm">
      
      {/* Set Logo Container Placeholder */}
      <div className="relative aspect-[3/2] w-full mb-3 md:mb-5 flex items-center justify-center bg-slate-50 dark:bg-slate-950/40 rounded-[1rem] md:rounded-[1.5rem] overflow-hidden border border-slate-100 dark:border-slate-800/50">
        {/* The actual logo area */}
        <Skeleton className="w-24 h-14 md:w-36 md:h-20 rounded-md" />
        
        {/* Live Badge Placeholder */}
        <div className="absolute top-1.5 right-1.5 md:top-3 md:right-3 flex items-center gap-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 px-2 py-1">
          <Skeleton className="h-1.5 w-1.5 rounded-full" />
          <Skeleton className="h-2 w-6 rounded" />
        </div>
      </div>

      {/* Content Space */}
      <div className="space-y-2.5 md:space-y-3">
        {/* Title */}
        <Skeleton className="h-4 w-3/4 rounded-md" />
        
        {/* Stats Row */}
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-lg" /> {/* Layers icon box */}
            <Skeleton className="h-3 w-16 rounded" />    {/* Card count text */}
          </div>
          <Skeleton className="h-6 w-12 rounded-lg" />   {/* Trending badge */}
        </div>
        
        {/* Bottom Details Row */}
        <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <Skeleton className="h-2 w-14 rounded" />      {/* Release Date */}
          <Skeleton className="h-3 w-20 rounded" />      {/* Floor Price */}
        </div>
      </div>

      {/* Action Overlay Placeholder (The button at the bottom) */}
      <div className="mt-3 md:mt-4">
        <Skeleton className="w-full h-9 md:h-11 rounded-lg md:rounded-xl" />
      </div>
    </div>
  );
}

export function ExpansionsPageSkeleton() {
  return (
    <div className="space-y-20 md:space-y-24">
      {/* We simulate 2 or 3 series groups */}
      {[1, 2].map((group) => (
        <section key={group} className="space-y-8">
          {/* Header Skeleton */}
          <div className="flex items-center gap-3 px-1">
            <div className="space-y-1 w-full">
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <Skeleton className="h-6 w-6 rounded-md" /> {/* Sparkles icon */}
                <Skeleton className="h-7 w-48 rounded-md" /> {/* Series Title */}
              </div>
              <Skeleton className="h-3 w-64 md:ml-9 rounded-md hidden md:block" /> {/* Description */}
            </div>
          </div>

          {/* Grid of Card Skeletons */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
            {Array.from({ length: 10 }).map((_, i) => (
              <SetCardSkeleton key={i} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}