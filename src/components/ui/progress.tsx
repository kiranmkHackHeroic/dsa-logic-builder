import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const progressVariants = cva("relative w-full overflow-hidden rounded-full", {
  variants: {
    variant: {
      default: "bg-secondary",
      primary: "bg-primary/20",
      success: "bg-success/20",
      warning: "bg-warning/20",
      accent: "bg-accent/20",
    },
    size: {
      sm: "h-1.5",
      default: "h-2",
      lg: "h-3",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const indicatorVariants = cva("h-full w-full flex-1 transition-all duration-500 ease-out", {
  variants: {
    variant: {
      default: "bg-primary",
      primary: "bg-primary",
      success: "bg-success",
      warning: "bg-warning",
      accent: "bg-gradient-to-r from-primary to-accent",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants> {}

const Progress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, ProgressProps>(
  ({ className, value, variant, size, ...props }, ref) => (
    <ProgressPrimitive.Root ref={ref} className={cn(progressVariants({ variant, size, className }))} {...props}>
      <ProgressPrimitive.Indicator
        className={cn(indicatorVariants({ variant }))}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
);
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
