import * as React from "react"
import { cn } from "@/lib/utils"

const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  const variants = {
    default: "bg-gradient-to-br from-primary to-primary-container text-white hover:opacity-90",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
    ghost: "text-tertiary hover:bg-surface-high",
    secondary: "bg-secondary text-white hover:bg-secondary/90",
  }

  const sizes = {
    default: "h-12 px-6 py-3",
    sm: "h-9 px-4 text-sm",
    lg: "h-14 px-8 text-lg",
  }

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-clinical font-medium transition-all duration-300 ease-in-out disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
