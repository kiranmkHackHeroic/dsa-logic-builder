import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, AlertTriangle, Zap } from "lucide-react";
import { useState } from "react";

interface BruteForceStepProps {
  constraints: string[];
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

const BruteForceStep = ({ constraints, onComplete, isActive, isCompleted }: BruteForceStepProps) => {
  const [approach, setApproach] = useState("");
  const [selectedComplexity, setSelectedComplexity] = useState("");
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleAnalyze = () => {
    if (approach.length >= 20 && selectedComplexity) {
      setShowAnalysis(true);
    }
  };

  const isReady = showAnalysis;

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
            <Zap className="h-5 w-5 text-warning mt-0.5" />
            <div>
              <h5 className="font-medium text-warning">Start Simple</h5>
              <p className="text-sm text-muted-foreground mt-1">
                What is the most straightforward solution, even if slow? 
                This helps you understand the problem better before optimizing.
              </p>
            </div>
          </div>
        </div>

        {isActive && (
          <>
            {/* Brute Force Approach */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Describe your naive/brute force approach:
              </label>
              <Textarea
                value={approach}
                onChange={(e) => setApproach(e.target.value)}
                placeholder="For each element, I would check every other element to find if their sum equals target. This means using two nested loops..."
                className="min-h-[100px]"
              />
            </div>

            {/* Complexity Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">
                What would be the time complexity of this approach?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {complexityOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={selectedComplexity === option.value ? "step-active" : "step"}
                    size="sm"
                    onClick={() => setSelectedComplexity(option.value)}
                    className="text-xs"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Analyze Button */}
            {!showAnalysis && (
              <Button
                onClick={handleAnalyze}
                disabled={approach.length < 20 || !selectedComplexity}
                className="w-full"
              >
                Analyze Against Constraints
              </Button>
            )}

            {/* Constraint Analysis */}
            {showAnalysis && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 animate-fade-in">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                  <div>
                    <h5 className="font-medium text-destructive">Why This Won't Work</h5>
                    <div className="text-sm text-muted-foreground mt-2 space-y-2">
                      <p>
                        With <strong>{selectedComplexity}</strong> complexity and constraints:
                      </p>
                      <ul className="list-disc list-inside space-y-1 font-mono text-xs">
                        {constraints.map((c, idx) => (
                          <li key={idx}>{c}</li>
                        ))}
                      </ul>
                      <p className="pt-2">
                        {selectedComplexity === "O(n²)" && (
                          <>For n = 10⁴, this means ~10⁸ operations. Most systems allow ~10⁸ operations/second, so this is on the edge. We need something faster.</>
                        )}
                        {selectedComplexity === "O(n³)" && (
                          <>For n = 10⁴, this means ~10¹² operations - way too slow! We definitely need optimization.</>
                        )}
                        {selectedComplexity === "O(n)" && (
                          <>O(n) is efficient! But let's verify if we can actually achieve this, or if we need O(n log n).</>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <Button onClick={onComplete} variant="success" className="w-full">
                    Understood! Let's Optimize
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BruteForceStep;
