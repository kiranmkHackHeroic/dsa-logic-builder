import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Zap, Check, AlertTriangle } from "lucide-react";
import { useState, useMemo } from "react";

interface BruteForceStepProps {
  constraints: string[];
  problem?: {
    title?: string;
    timeComplexity?: { brute: string; optimal: string };
    spaceComplexity?: { brute: string; optimal: string };
  };
  onComplete: () => void;
  isActive: boolean;
  isCompleted: boolean;
}

const complexityOptions = [
  { value: "O(1)", label: "O(1) - Constant" },
  { value: "O(log n)", label: "O(log n) - Logarithmic" },
  { value: "O(n)", label: "O(n) - Linear" },
  { value: "O(n log n)", label: "O(n log n) - Linearithmic" },
  { value: "O(n²)", label: "O(n²) - Quadratic" },
  { value: "O(n³)", label: "O(n³) - Cubic" },
  { value: "O(2^n)", label: "O(2^n) - Exponential" },
];

const normalizeComplexity = (c: string) =>
  c.toLowerCase().replace(/\s+/g, "").replace(/\^/g, "").replace(/²/g, "2").replace(/³/g, "3");

const BruteForceStep = ({
  constraints,
  problem,
  onComplete,
  isActive,
  isCompleted,
}: BruteForceStepProps) => {
  const [approach, setApproach] = useState("");
  const [selectedComplexity, setSelectedComplexity] = useState("");

  const expectedBrute = problem?.timeComplexity?.brute || "O(n²)";

  // Validation logic checking both description and correct complexity for the active problem
  const validation = useMemo(() => {
    const approachValid = approach.trim().length >= 25;
    const isComplexitySelected = Boolean(selectedComplexity);

    // Validate if the selected complexity matches the problem's actual brute force bound
    const complexityCorrect =
      isComplexitySelected &&
      normalizeComplexity(selectedComplexity) === normalizeComplexity(expectedBrute);

    const isValid = approachValid && complexityCorrect;

    return {
      approachValid,
      isComplexitySelected,
      complexityCorrect,
      isValid,
    };
  }, [approach, selectedComplexity, expectedBrute]);

  const handleComplete = () => {
    if (validation.isValid) {
      onComplete();
    }
  };

  return (
    <Card variant={isActive ? "step-active" : isCompleted ? "step-completed" : "step-locked"}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-bold">
              3
            </span>
            Brute Force Thinking
          </CardTitle>
          {isCompleted && (
            <Badge variant="success" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" /> Completed
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Instruction */}
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-warning mt-0.5 shrink-0" />
            <div>
              <h5 className="font-medium text-warning">Start Simple (Baseline)</h5>
              <p className="text-sm text-muted-foreground mt-1">
                What is the most straightforward, naive solution for{" "}
                <strong>{problem?.title || "this problem"}</strong>? Identify why this naive
                baseline fails given constraints like <code>{constraints?.[0] || "N <= 10^5"}</code>.
              </p>
            </div>
          </div>
        </div>

        {isActive && (
          <>
            {/* Brute Force Approach Description */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Describe your naive / brute force approach:
              </label>
              <Textarea
                value={approach}
                onChange={(e) => setApproach(e.target.value)}
                placeholder="Explain the nested loops, exhaustive search, or recursion you would try first..."
                className="min-h-[100px]"
              />
            </div>

            {/* Complexity Selection with Real Problem Validation */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">
                  What is the accurate Time Complexity of this brute force approach?
                </label>
                {selectedComplexity && (
                  validation.complexityCorrect ? (
                    <span className="text-primary text-xs font-bold flex items-center gap-1">
                      <Check className="h-3.5 w-3.5" /> Correct: {expectedBrute}
                    </span>
                  ) : (
                    <span className="text-destructive text-xs font-medium flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5" /> Incorrect complexity for naive approach
                    </span>
                  )
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {complexityOptions.map((option) => {
                  const isSelected = selectedComplexity === option.value;
                  return (
                    <Button
                      key={option.value}
                      type="button"
                      variant={isSelected ? "step-active" : "step"}
                      size="sm"
                      onClick={() => setSelectedComplexity(option.value)}
                      className="text-xs font-medium"
                    >
                      {option.label}
                    </Button>
                  );
                })}
              </div>

              {selectedComplexity && !validation.complexityCorrect && (
                <p className="text-xs text-destructive mt-2">
                  💡 Hint: A naive exhaustive scan checking all combinations takes {expectedBrute}. Re-select the correct complexity.
                </p>
              )}
            </div>

            {/* Input Space Validation Box */}
            <div className="bg-secondary/40 border border-border/50 rounded-lg p-3 text-xs space-y-1.5">
              <div className="flex items-center justify-between font-semibold">
                <span className="text-foreground">Step 3 Input Validation:</span>
                {validation.isValid ? (
                  <span className="text-primary font-bold flex items-center gap-1">
                    <Check className="h-3.5 w-3.5" /> Correct Complexity & Approach
                  </span>
                ) : (
                  <span className="text-warning font-medium flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" /> Validation Pending
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className={validation.approachValid ? "text-primary" : "text-muted-foreground"}>
                  {validation.approachValid ? "✓" : "○"} Naive approach description ({approach.trim().length}/25)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={validation.complexityCorrect ? "text-primary" : "text-muted-foreground"}>
                  {validation.complexityCorrect ? "✓" : "○"} Correct brute force complexity ({expectedBrute})
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-muted-foreground">
                {validation.isValid
                  ? "✓ Brute force baseline validated. Ready to optimize!"
                  : "Select the correct brute force complexity to unlock the next step."}
              </span>
              <Button
                onClick={handleComplete}
                disabled={!validation.isValid}
                variant={validation.isValid ? "default" : "secondary"}
                className="font-semibold"
              >
                Confirm Brute Force
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BruteForceStep;
