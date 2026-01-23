import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 btn-bounce",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md hover:shadow-lg",
        outline:
          "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground",
        secondary:
          "bg-secondary text-secondary-foreground border-2 border-white/20 rounded-2xl shadow-[0_0_20px_rgba(127,199,204,0.4),8px_8px_16px_rgba(0,0,0,0.4),-4px_-4px_12px_rgba(127,199,204,0.25),inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0_0_30px_rgba(127,199,204,0.5),4px_4px_12px_rgba(0,0,0,0.35),-2px_-2px_8px_rgba(127,199,204,0.2)] hover:translate-y-[2px] active:translate-y-[3px] active:shadow-[0_0_15px_rgba(127,199,204,0.3),2px_2px_8px_rgba(0,0,0,0.3)]",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-success text-success-foreground hover:bg-success/90 shadow-md hover:shadow-lg",
        highlight: "bg-highlight text-highlight-foreground border-2 border-white/20 rounded-2xl shadow-[0_0_25px_rgba(234,137,19,0.5),8px_8px_16px_rgba(0,0,0,0.4),-4px_-4px_12px_rgba(234,137,19,0.35),inset_0_2px_4px_rgba(255,255,255,0.35),inset_0_-2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0_0_40px_rgba(234,137,19,0.6),4px_4px_12px_rgba(0,0,0,0.35),-2px_-2px_8px_rgba(234,137,19,0.25)] hover:translate-y-[2px] active:translate-y-[3px] active:shadow-[0_0_20px_rgba(234,137,19,0.4),2px_2px_8px_rgba(0,0,0,0.3)]",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-lg px-4",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-11 w-11 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
