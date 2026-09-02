import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { CheckCircle, FileText, Clock, HardDrive, Check, AlertTriangle, ShieldCheck } from "lucide-react";
import { useState, useMemo } from "react";

interface FinalApproachStepProps {
  problem?: {
    title?: string;
    timeComplexity?: { brute: string; optimal: string };
    spaceComplexity?: { brute: string; optimal: string };
  };
  onComplete: () => void;
  isActive: boolean;
  isCompleted: boolean;
}

const normalizeComp = (str: string) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .trim();

const FinalApproachStep = ({
  problem,
  onComplete,
  isActive,
  isCompleted,
}: FinalApproachStepProps) => {
  const [approach, setApproach] = useState("");
  const [timeComplexity, setTimeComplexity] = useState("");
  const [spaceComplexity, setSpaceComplexity] = useState("");
  const [edgeCases, setEdgeCases] = useState("");

  const expectedTime = problem?.timeComplexity?.optimal || "O(n)";
  const expectedSpace = problem?.spaceComplexity?.optimal || "O(n)";

  // Validation logic checking optimal time and space complexity against this problem
  const validation = useMemo(() => {
    const approachValid = approach.trim().length >= 35;
    const edgeCasesValid = edgeCases.trim().length >= 15;

    const normUserTime = normalizeComp(timeComplexity);
    const normExpTime = normalizeComp(expectedTime);
    const timeValid =
      normUserTime.length > 0 &&
      (normUserTime === normExpTime ||
        normUserTime.includes(normExpTime) ||
        normExpTime.includes(normUserTime));

    const normUserSpace = normalizeComp(spaceComplexity);
    const normExpSpace = normalizeComp(expectedSpace);
    const spaceValid =
      normUserSpace.length > 0 &&
      (normUserSpace === normExpSpace ||
        normUserSpace.includes(normExpSpace) ||
        normExpSpace.includes(normUserSpace));

    const isValid = approachValid && edgeCasesValid && timeValid && spaceValid;

    return {
      approachValid,
      edgeCasesValid,
      timeValid,
      spaceValid,
      isValid,
    };
  }, [approach, edgeCases, timeComplexity, spaceComplexity, expectedTime, expectedSpace]);

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
              5
            </span>
            Final Approach Explanation
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
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div>
              <h5 className="font-medium text-primary">Explain Your Optimal Solution</h5>
              <p className="text-sm text-muted-foreground mt-1">
                Write out your complete algorithm in plain logic. Validate that your Time and Space
                complexities match the optimal bounds for <strong>{problem?.title || "this problem"}</strong>.
              </p>
            </div>
          </div>
        </div>

        {isActive && (
          <>
            {/* Approach */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Describe your step-by-step optimal algorithm:
              </label>
              <Textarea
                value={approach}
                onChange={(e) => setApproach(e.target.value)}
                placeholder="1. Initialize data structures/pointers...&#10;2. Traverse input while maintaining loop invariant...&#10;3. Compute intermediate conditions...&#10;4. Return final result or handle termination..."
                className="min-h-[130px] font-mono text-xs"
              />
            </div>

            {/* Complexity Analysis with Live Validation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    Optimal Time Complexity:
                  </label>
                  {timeComplexity && (
                    validation.timeValid ? (
                      <span className="text-primary text-xs font-bold flex items-center gap-1">
                        <Check className="h-3 w-3" /> Matches {expectedTime}
                      </span>
                    ) : (
                      <span className="text-destructive text-[11px] font-medium flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" /> Expected: {expectedTime}
                      </span>
                    )
                  )}
                </div>
                <Input
                  value={timeComplexity}
                  onChange={(e) => setTimeComplexity(e.target.value)}
                  placeholder={`E.g. ${expectedTime}`}
                  className="font-mono text-sm"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
                    <HardDrive className="h-3.5 w-3.5 text-accent" />
                    Optimal Space Complexity:
                  </label>
                  {spaceComplexity && (
                    validation.spaceValid ? (
                      <span className="text-primary text-xs font-bold flex items-center gap-1">
                        <Check className="h-3 w-3" /> Matches {expectedSpace}
                      </span>
                    ) : (
                      <span className="text-destructive text-[11px] font-medium flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" /> Expected: {expectedSpace}
                      </span>
                    )
                  )}
                </div>
                <Input
                  value={spaceComplexity}
                  onChange={(e) => setSpaceComplexity(e.target.value)}
                  placeholder={`E.g. ${expectedSpace}`}
                  className="font-mono text-sm"
                />
              </div>
            </div>

            {/* Edge Cases */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-warning" />
                Critical Edge Cases to Guard Against:
              </label>
              <Textarea
                value={edgeCases}
                onChange={(e) => setEdgeCases(e.target.value)}
                placeholder="E.g., Empty input, single element, duplicate elements, negative numbers, maximum boundary sizes..."
                className="min-h-[75px] text-xs"
              />
            </div>

            {/* Validation Feedback Box */}
            <div className="bg-secondary/40 border border-border/50 rounded-lg p-3 text-xs space-y-1.5">
              <div className="flex items-center justify-between font-semibold">
                <span className="text-foreground">Step 5 Input Validation:</span>
                {validation.isValid ? (
                  <span className="text-primary font-bold flex items-center gap-1">
                    <Check className="h-3.5 w-3.5" /> Optimal Approach Validated
                  </span>
                ) : (
                  <span className="text-warning font-medium flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" /> Validation Pending
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className={validation.approachValid ? "text-primary" : "text-muted-foreground"}>
                  {validation.approachValid ? "✓" : "○"} Step-by-step logic description ({approach.trim().length}/35)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={validation.timeValid ? "text-primary" : "text-muted-foreground"}>
                  {validation.timeValid ? "✓" : "○"} Correct optimal time complexity ({expectedTime})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={validation.spaceValid ? "text-primary" : "text-muted-foreground"}>
                  {validation.spaceValid ? "✓" : "○"} Correct optimal space complexity ({expectedSpace})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={validation.edgeCasesValid ? "text-primary" : "text-muted-foreground"}>
                  {validation.edgeCasesValid ? "✓" : "○"} Guarded edge cases ({edgeCases.trim().length}/15)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-muted-foreground">
                {validation.isValid
                  ? "✓ Final approach fully validated. Code editor unlocked!"
                  : "Fill in all valid complexities and edge cases to unlock the code editor."}
              </span>
              <Button
                onClick={handleComplete}
                disabled={!validation.isValid}
                variant={validation.isValid ? "default" : "secondary"}
                className="font-semibold"
              >
                Proceed to Coding
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default FinalApproachStep;
