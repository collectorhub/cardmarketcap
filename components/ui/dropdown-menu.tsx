"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
const DropdownMenuGroup = DropdownMenuPrimitive.Group
const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 8, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      forceMount
      asChild
      ref={ref}
      sideOffset={sideOffset}
      align="end"
      className={cn(
        "z-50 min-w-[12rem] overflow-hidden rounded-2xl border border-slate-200 bg-white p-1 text-slate-950 shadow-premium dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50",
        className
      )}
      {...props}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.3, y: -20, x: 20 }} // Starts small and "inside" the circle
        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
        exit={{ opacity: 0, scale: 0.5, y: -10 }}
        transition={{ 
          type: "spring", 
          damping: 25, 
          stiffness: 350,
          mass: 0.8 
        }}
        style={{ originX: 1, originY: 0 }} // Forces the grow-out from the top-right corner
      >
        {props.children}
      </motion.div>
    </DropdownMenuPrimitive.Content>
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-lg px-3 py-2 text-sm outline-none transition-colors focus:bg-slate-100 focus:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-slate-800 dark:focus:text-slate-50",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuPortal,
}