import { cn } from "@/lib/utils";
import { CheckCircle, Lock, Circle } from "lucide-react";

interface StepIndicatorProps {
  steps: {
    id: number;
    title: string;
    status: "completed" | "active" | "locked";
  }[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

const StepIndicator = ({ steps, currentStep, onStepClick }: StepIndicatorProps) => {
  return (
    <div className="flex flex-col gap-1">
      {steps.map((step, index) => {
        const isCompleted = step.status === "completed";
        const isActive = step.status === "active";
        const isLocked = step.status === "locked";

        return (
          <div key={step.id} className="flex items-center gap-3">
            {/* Connector Line */}
            {index > 0 && (
              <div
                className={cn(
                  "absolute left-4 w-0.5 -mt-6 h-6",
                  isCompleted || isActive ? "bg-primary" : "bg-border"
                )}
              />
            )}

            {/* Step Circle */}
            <button
              onClick={() => !isLocked && onStepClick?.(step.id)}
              disabled={isLocked}
              className={cn(
                "relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300",
                isCompleted && "border-success bg-success/10 text-success",
                isActive && "border-primary bg-primary/10 text-primary animate-pulse-ring",
                isLocked && "border-border bg-muted text-muted-foreground cursor-not-allowed",
                !isLocked && "cursor-pointer hover:scale-110"
              )}
            >
              {isCompleted && <CheckCircle className="h-4 w-4" />}
              {isActive && <Circle className="h-4 w-4 fill-current" />}
              {isLocked && <Lock className="h-3 w-3" />}
            </button>

            {/* Step Title */}
            <span
              className={cn(
                "text-sm font-medium transition-colors",
                isCompleted && "text-success",
                isActive && "text-primary",
                isLocked && "text-muted-foreground"
              )}
            >
              {step.title}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;
