import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#04AA6D] text-white hover:bg-[#038a58] shadow-sm hover:shadow active:scale-[0.98] font-medium",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
        outline: "border border-border bg-background hover:bg-secondary hover:text-secondary-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-secondary hover:text-secondary-foreground",
        link: "text-[#04AA6D] underline-offset-4 hover:underline",
        gradient: "bg-[#04AA6D] hover:bg-[#038a58] text-white shadow-md active:scale-[0.98] font-semibold",
        success: "bg-[#04AA6D] text-white hover:bg-[#038a58] shadow-sm",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90 shadow-sm",
        hero: "bg-[#04AA6D] hover:bg-[#038a58] text-white shadow-md hover:shadow-lg hover:translate-y-[-1px] active:scale-[0.98] font-semibold rounded-md",
        "hero-outline": "border border-[#282A35] dark:border-white/30 bg-background text-foreground hover:bg-secondary font-semibold rounded-md",
        "w3-green": "bg-[#04AA6D] hover:bg-[#038a58] text-white font-bold rounded-md shadow-sm",
        "w3-outline": "border border-[#282A35] dark:border-white/40 bg-background hover:bg-secondary text-foreground font-bold rounded-md",
        step: "bg-card border border-border hover:border-[#04AA6D]/50 hover:bg-secondary text-foreground",
        "step-active": "bg-[#04AA6D]/10 border-2 border-[#04AA6D] text-[#04AA6D] font-semibold",
        "step-completed": "bg-[#04AA6D]/10 border border-[#04AA6D]/50 text-[#04AA6D]",
        "step-locked": "bg-muted border border-border text-muted-foreground cursor-not-allowed opacity-50",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
