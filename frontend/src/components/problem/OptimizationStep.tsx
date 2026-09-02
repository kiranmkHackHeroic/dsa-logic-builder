import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Sparkles, Database, Check, AlertTriangle, Layers } from "lucide-react";
import { useState, useMemo } from "react";

interface OptimizationStepProps {
  problem?: {
    title?: string;
    pattern?: string;
    timeComplexity?: { brute: string; optimal: string };
  };
  onComplete: () => void;
  isActive: boolean;
  isCompleted: boolean;
}

const dataStructures = [
  "Array",
  "Hash Map",
  "Hash Set",
  "Stack",
  "Queue",
  "Heap/Priority Queue",
  "Tree",
  "Graph",
  "Trie",
];

const patternOptions = [
  "Two Pointers",
  "Sliding Window",
  "Binary Search",
  "Dynamic Programming",
  "Greedy",
  "DFS/BFS",
  "Fast & Slow Pointers",
  "Monotonic Stack",
];

const getExpectedPatternsForProblem = (patternName?: string) => {
  const p = (patternName || "").toLowerCase();
  if (p.includes("pointer")) return ["Two Pointers", "Fast & Slow Pointers"];
  if (p.includes("window")) return ["Sliding Window", "Two Pointers"];
  if (p.includes("binary search")) return ["Binary Search"];
  if (p.includes("dynamic") || p.includes("dp") || p.includes("knapsack")) return ["Dynamic Programming"];
  if (p.includes("stack")) return ["Monotonic Stack"];
  if (p.includes("tree") || p.includes("graph") || p.includes("bfs") || p.includes("dfs")) return ["DFS/BFS"];
  if (p.includes("greedy")) return ["Greedy"];
  return ["Two Pointers", "Hash Map", "Binary Search"];
};

const OptimizationStep = ({
  problem,
  onComplete,
  isActive,
  isCompleted,
}: OptimizationStepProps) => {
  const [inefficiency, setInefficiency] = useState("");
  const [selectedDS, setSelectedDS] = useState<string[]>([]);
  const [selectedPattern, setSelectedPattern] = useState<string[]>([]);
  const [optimization, setOptimization] = useState("");

  const expectedPatterns = useMemo(
    () => getExpectedPatternsForProblem(problem?.pattern),
    [problem?.pattern]
  );

  const toggleSelection = (item: string, list: string[], setList: (items: string[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  // Validation logic
  const validation = useMemo(() => {
    const ineffValid = inefficiency.trim().length >= 20;
    const optimValid = optimization.trim().length >= 25;
    const dsSelected = selectedDS.length > 0;

    // Check if the user selected a pattern that matches the problem's expected algorithmic pattern
    const patternMatched =
      selectedPattern.length > 0 &&
      selectedPattern.some((p) =>
        expectedPatterns.some((ep) => ep.toLowerCase() === p.toLowerCase())
      );

    const isValid = ineffValid && optimValid && dsSelected && patternMatched;

    return {
      ineffValid,
      optimValid,
      dsSelected,
      patternMatched,
      isValid,
    };
  }, [inefficiency, optimization, selectedDS, selectedPattern, expectedPatterns]);

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
              4
            </span>
            Optimization Discovery
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
            <Sparkles className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div>
              <h5 className="font-medium text-primary">Find the Optimal Insight</h5>
              <p className="text-sm text-muted-foreground mt-1">
                Why was the brute force slow? Select the exact pattern and data structure that reduces time to{" "}
                <strong>{problem?.timeComplexity?.optimal || "O(N)"}</strong> for{" "}
                <strong>{problem?.title || "this problem"}</strong>.
              </p>
            </div>
          </div>
        </div>

        {isActive && (
          <>
            {/* Inefficiency Analysis */}
            <div>
              <label className="block text-sm font-medium mb-2">
                What repeated computation or nested loop made the brute force slow?
              </label>
              <Textarea
                value={inefficiency}
                onChange={(e) => setInefficiency(e.target.value)}
                placeholder="Repeatedly scanning the array or doing redundant re-evaluations on every element..."
                className="min-h-[80px]"
              />
            </div>

            {/* Pattern Selection with Real Validation */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  Select the optimal Algorithmic Pattern:
                </label>
                {selectedPattern.length > 0 && (
                  validation.patternMatched ? (
                    <span className="text-primary text-xs font-bold flex items-center gap-1">
                      <Check className="h-3.5 w-3.5" /> Optimal pattern matched!
                    </span>
                  ) : (
                    <span className="text-destructive text-xs font-medium flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5" /> Pattern not optimal for {problem?.title}
                    </span>
                  )
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {patternOptions.map((pattern) => {
                  const isSelected = selectedPattern.includes(pattern);
                  return (
                    <Button
                      key={pattern}
                      type="button"
                      variant={isSelected ? "step-active" : "step"}
                      size="sm"
                      onClick={() => toggleSelection(pattern, selectedPattern, setSelectedPattern)}
                      className="text-xs"
                    >
                      {pattern}
                    </Button>
                  );
                })}
              </div>

              {selectedPattern.length > 0 && !validation.patternMatched && (
                <p className="text-xs text-destructive mt-2">
                  💡 Hint: This problem belongs to the <strong>{expectedPatterns.join(" or ")}</strong> category. Select the matching pattern to proceed.
                </p>
              )}
            </div>

            {/* Data Structure Selection */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Database className="h-4 w-4 text-accent" />
                Select the primary Data Structure(s):
              </label>
              <div className="flex flex-wrap gap-2">
                {dataStructures.map((ds) => {
                  const isSelected = selectedDS.includes(ds);
                  return (
                    <Button
                      key={ds}
                      type="button"
                      variant={isSelected ? "step-active" : "step"}
                      size="sm"
                      onClick={() => toggleSelection(ds, selectedDS, setSelectedDS)}
                      className="text-xs"
                    >
                      {ds}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Optimization Explanation */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Explain how this combination eliminates the brute force bottleneck:
              </label>
              <Textarea
                value={optimization}
                onChange={(e) => setOptimization(e.target.value)}
                placeholder="By maintaining state in our chosen data structure or moving pointers in one direction, each element is processed in O(1) amortized time..."
                className="min-h-[80px]"
              />
            </div>

            {/* Validation Feedback Box */}
            <div className="bg-secondary/40 border border-border/50 rounded-lg p-3 text-xs space-y-1.5">
              <div className="flex items-center justify-between font-semibold">
                <span className="text-foreground">Step 4 Input Validation:</span>
                {validation.isValid ? (
                  <span className="text-primary font-bold flex items-center gap-1">
                    <Check className="h-3.5 w-3.5" /> Optimal Strategy Validated
                  </span>
                ) : (
                  <span className="text-warning font-medium flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" /> Validation Pending
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className={validation.ineffValid ? "text-primary" : "text-muted-foreground"}>
                  {validation.ineffValid ? "✓" : "○"} Bottleneck analysis ({inefficiency.trim().length}/20)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={validation.patternMatched ? "text-primary" : "text-muted-foreground"}>
                  {validation.patternMatched ? "✓" : "○"} Optimal algorithmic pattern match ({expectedPatterns.join(" / ")})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={validation.dsSelected ? "text-primary" : "text-muted-foreground"}>
                  {validation.dsSelected ? "✓" : "○"} Data structure selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={validation.optimValid ? "text-primary" : "text-muted-foreground"}>
                  {validation.optimValid ? "✓" : "○"} Optimization justification ({optimization.trim().length}/25)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-muted-foreground">
                {validation.isValid
                  ? "✓ Strategy verified. Ready for Final Approach!"
                  : "Match the optimal pattern and justify your optimization to continue."}
              </span>
              <Button
                onClick={handleComplete}
                disabled={!validation.isValid}
                variant={validation.isValid ? "default" : "secondary"}
                className="font-semibold"
              >
                Confirm Optimization
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default OptimizationStep;
