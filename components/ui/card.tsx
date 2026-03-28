import { cn } from "@/lib/utils"

export function Card({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn(
      "bg-white border border-slate-100 rounded-2xl p-6 shadow-premium hover:shadow-glow transition-all duration-300",
      className
    )}>
      {children}
    </div>
  )
}