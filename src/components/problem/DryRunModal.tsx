import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Play,
  Pause,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  HardDrive,
  Info,
  Loader2,
} from "lucide-react";

export interface DryRunStep {
  stepNumber: number;
  line: string;
  action: string;
  variables: Record<string, string | number | boolean | null | undefined>;
  explanation: string;
}

export interface DryRunData {
  summary: string;
  timeComplexity: string;
  spaceComplexity: string;
  testCase: { input: string; expected: string };
  verdict: string;
  finalResult: string;
  steps: DryRunStep[];
  suggestions?: string;
  isSimulated?: boolean;
}

interface DryRunModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: DryRunData | null;
  isLoading: boolean;
  problemTitle?: string;
}

export const DryRunModal = ({
  isOpen,
  onClose,
  data,
  isLoading,
  problemTitle = "Problem",
}: DryRunModalProps) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Reset to step 0 whenever new data is loaded
  useEffect(() => {
    setCurrentStepIdx(0);
    setIsPlaying(false);
  }, [data]);

  // Auto-play steps
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && data?.steps && currentStepIdx < data.steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= data.steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1600);
    } else if (data?.steps && currentStepIdx >= data.steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStepIdx, data?.steps]);

  const steps = data?.steps || [];
  const currentStep = steps[currentStepIdx];
  const totalSteps = steps.length;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between gap-2 pr-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Sparkles className="h-4 w-4" />
              </div>
              <DialogTitle className="text-xl font-bold">
                AI Dry Run: {problemTitle}
              </DialogTitle>
            </div>
            {data && (
              <Badge
                variant={data.verdict.toLowerCase().includes("bug") ? "destructive" : "success"}
                className="flex items-center gap-1 text-xs"
              >
                {data.verdict.toLowerCase().includes("bug") ? (
                  <AlertTriangle className="h-3 w-3" />
                ) : (
                  <CheckCircle2 className="h-3 w-3" />
                )}
                {data.verdict}
              </Badge>
            )}
          </div>
          <DialogDescription className="text-xs text-muted-foreground pt-1">
            Step-by-step trace of variables and logic flow powered by AI.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-4 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <div>
              <p className="font-semibold text-foreground">Analyzing code execution...</p>
              <p className="text-xs text-muted-foreground mt-1">
                Gemini AI is simulating your algorithm line-by-line across test inputs.
              </p>
            </div>
          </div>
        ) : !data ? (
          <div className="py-12 text-center text-muted-foreground text-sm">
            No dry run data available. Please click "AI Dry Run" to start.
          </div>
        ) : (
          <div className="space-y-5 pt-2">
            {/* Overview Card */}
            <div className="bg-card/70 border border-border rounded-xl p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Complexity:
                  </span>
                  <Badge variant="outline" className="text-xs flex items-center gap-1 font-mono">
                    <Clock className="h-3 w-3 text-primary" />
                    Time: {data.timeComplexity}
                  </Badge>
                  <Badge variant="outline" className="text-xs flex items-center gap-1 font-mono">
                    <HardDrive className="h-3 w-3 text-accent" />
                    Space: {data.spaceComplexity}
                  </Badge>
                </div>

                {data.isSimulated && (
                  <Badge variant="secondary" className="text-[11px]">
                    Simulated Engine
                  </Badge>
                )}
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {data.summary}
              </p>

              {data.testCase && (
                <div className="bg-secondary/40 rounded-lg p-2.5 text-xs font-mono flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-muted-foreground">Input: </span>
                    <span className="text-foreground font-semibold">{data.testCase.input}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Expected: </span>
                    <span className="text-success font-semibold">{data.testCase.expected}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Stepper Controls */}
            {totalSteps > 0 && (
              <div className="bg-secondary/30 border border-border rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">
                      Step {currentStepIdx + 1} of {totalSteps}
                    </span>
                    {currentStep?.line && (
                      <Badge variant="outline" className="font-mono text-xs max-w-[280px] truncate">
                        {currentStep.line}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setCurrentStepIdx(0)}
                      disabled={currentStepIdx === 0}
                      title="Reset to Step 1"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setCurrentStepIdx((prev) => Math.max(0, prev - 1))}
                      disabled={currentStepIdx === 0}
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant={isPlaying ? "secondary" : "default"}
                      size="sm"
                      className="h-8 text-xs gap-1"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="h-3 w-3" /> Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-3 w-3" /> Auto-Play
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setCurrentStepIdx((prev) => Math.min(totalSteps - 1, prev + 1))}
                      disabled={currentStepIdx >= totalSteps - 1}
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Progress Dots / Bar */}
                <div className="flex gap-1.5">
                  {steps.map((s, idx) => (
                    <button
                      key={s.stepNumber}
                      onClick={() => setCurrentStepIdx(idx)}
                      className={`h-1.5 flex-1 rounded-full transition-all ${
                        idx === currentStepIdx
                          ? "bg-primary"
                          : idx < currentStepIdx
                          ? "bg-primary/40"
                          : "bg-muted"
                      }`}
                      title={`Go to step ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Current Step Content */}
                {currentStep && (
                  <div className="space-y-3 pt-1">
                    {/* Action & Explanation */}
                    <div className="bg-card p-3.5 rounded-lg border border-border shadow-xs">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="font-semibold text-sm text-foreground">
                          {currentStep.action}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {currentStep.explanation}
                      </p>
                    </div>

                    {/* Variable Inspector Table */}
                    {currentStep.variables && Object.keys(currentStep.variables).length > 0 && (
                      <div className="border border-border rounded-lg overflow-hidden">
                        <div className="bg-secondary/60 px-3 py-1.5 border-b border-border text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                          <span>Live Variables State</span>
                          <span className="font-mono text-[10px] text-primary">Snapshot @ Step {currentStepIdx + 1}</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 p-3 bg-card/40">
                          {Object.entries(currentStep.variables).map(([varName, val]) => (
                            <div
                              key={varName}
                              className="bg-background/80 border border-border/80 rounded-md p-2 font-mono text-xs"
                            >
                              <div className="text-[10px] text-muted-foreground font-semibold truncate">
                                {varName}
                              </div>
                              <div className="text-primary font-bold truncate mt-0.5" title={String(val)}>
                                {typeof val === "object" ? JSON.stringify(val) : String(val)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Suggestions & Final Output */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
              {data.finalResult && (
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-muted-foreground">Final Returned Output:</span>
                  <Badge variant="success" className="font-bold text-xs py-0.5">
                    {data.finalResult}
                  </Badge>
                </div>
              )}

              {data.suggestions && (
                <div className="w-full bg-primary/5 border border-primary/20 rounded-lg p-3 text-xs flex items-start gap-2">
                  <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-muted-foreground leading-relaxed">{data.suggestions}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
