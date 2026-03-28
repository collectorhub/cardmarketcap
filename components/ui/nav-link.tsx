"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export function NavLink({ href, children, icon: Icon }: { href: string, children: React.ReactNode, icon?: any }) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex items-center gap-3 px-3 py-2 text-sm transition-all duration-200",
        isActive ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
      )}
    >
      {/* The "Elite" Indicator: A tiny vertical bar that only appears when active */}
      {isActive && (
        <motion.div 
          layoutId="nav-indicator"
          className="absolute left-0 w-0.5 h-4 bg-brand rounded-full"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}

      {Icon && (
        <Icon className={cn(
          "h-4 w-4 transition-colors",
          isActive ? "text-brand" : "text-slate-300 group-hover:text-slate-400"
        )} />
      )}
      
      <span className={cn(
        "tracking-tight transition-colors",
        isActive ? "font-semibold" : "font-medium"
      )}>
        {children}
      </span>
    </Link>
  )
}