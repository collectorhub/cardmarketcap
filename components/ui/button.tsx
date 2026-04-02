import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  asChild?: boolean // Add this
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', asChild = false, ...props }, ref) => {
    const variants = {
      primary: "bg-[#00BA88] text-white shadow-lg hover:bg-[#00a377] transition-all active:scale-95",
      secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
      ghost: "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900",
      outline: "border border-slate-200 bg-transparent hover:bg-slate-50"
    }
    
    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
      icon: "p-2 h-9 w-9"
    }

    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-medium transition-all disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"