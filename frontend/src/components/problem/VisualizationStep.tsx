import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, SkipForward, RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";

interface VisualizationStepProps {
  isActive: boolean;
  isCompleted: boolean;
  onComplete: () => void;
}

const VisualizationStep = ({ isActive, isCompleted, onComplete }: VisualizationStepProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  const array = [2, 7, 11, 15];
  const target = 9;
  
  const steps = [
    { index: 0, action: "Check 2", complement: 7, hashMap: {}, found: false },
    { index: 0, action: "Add 2 → index 0", complement: 7, hashMap: { 2: 0 }, found: false },
    { index: 1, action: "Check 7", complement: 2, hashMap: { 2: 0 }, found: true },
    { index: 1, action: "Found! 2 exists in map", complement: 2, hashMap: { 2: 0 }, found: true },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
      }, 1500);
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, steps.length]);

  const reset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const step = steps[currentStep];

  return (
    <Card variant={isActive ? "step-active" : "step-locked"}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-bold">
              7
            </span>
            Visual Simulation
          </CardTitle>
          <Badge variant={isCompleted ? "success" : "accent"}>{isCompleted ? "Completed" : "Interactive"}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {isActive && (
          <>
            {/* Array Visualization */}
            <div>
              <p className="text-sm text-muted-foreground mb-3">
                Array: <span className="font-mono">[{array.join(", ")}]</span>, Target: <span className="font-mono">{target}</span>
              </p>
              <div className="flex gap-2 justify-center">
                {array.map((num, idx) => (
                  <div
                    key={idx}
                    className={`
                      w-16 h-16 flex flex-col items-center justify-center rounded-lg border-2 transition-all duration-300
                      ${idx === step.index ? "border-primary bg-primary/10 scale-110" : "border-border bg-secondary/50"}
                      ${step.found && (num === array[step.index] || num === step.complement) ? "border-success bg-success/10" : ""}
                    `}
                  >
                    <span className="font-mono font-bold">{num}</span>
                    <span className="text-xs text-muted-foreground">i={idx}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hash Map Visualization */}
            <div className="bg-secondary/50 rounded-lg p-4">
              <p className="text-sm font-medium mb-3">Hash Map:</p>
              <div className="flex gap-2 flex-wrap min-h-[40px]">
                {Object.entries(step.hashMap).length === 0 ? (
                  <span className="text-muted-foreground text-sm italic">Empty</span>
                ) : (
                  Object.entries(step.hashMap).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center gap-1 bg-primary/10 border border-primary/20 rounded-md px-3 py-1 font-mono text-sm animate-scale-in"
                    >
                      <span className="text-primary">{key}</span>
                      <span className="text-muted-foreground">→</span>
                      <span>{String(value)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Current Step Description */}
            <div className={`
              rounded-lg p-4 text-center transition-all
              ${step.found ? "bg-success/10 border border-success/20" : "bg-card border border-border"}
            `}>
              <p className={`font-medium ${step.found ? "text-success" : "text-foreground"}`}>
                {step.action}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Looking for complement: <span className="font-mono">{step.complement}</span>
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3 pt-4 border-t border-border">
              <Button variant="outline" size="icon" onClick={reset}>
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant={isPlaying ? "secondary" : "default"}
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
                {isPlaying ? "Pause" : "Play"}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))}
                disabled={currentStep >= steps.length - 1}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            {/* Step Progress */}
            <div className="flex items-center justify-center gap-1">
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentStep ? "bg-primary w-4" : idx < currentStep ? "bg-success" : "bg-muted"
                  }`}
                />
              ))}
            </div>

            {!isCompleted && (
              <Button variant="success" className="w-full" onClick={onComplete}>
                Mark Visualization Complete
              </Button>
            )}
          </>
        )}

        {!isActive && (
          <div className="text-center py-8 text-muted-foreground">
            <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Complete the coding step to unlock visualization</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VisualizationStep;
