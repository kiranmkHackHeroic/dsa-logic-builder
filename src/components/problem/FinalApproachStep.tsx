import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, FileText, Clock, HardDrive, AlertCircle } from "lucide-react";
import { useState } from "react";

interface FinalApproachStepProps {
  onComplete: () => void;
  isActive: boolean;
  isCompleted: boolean;
}

const FinalApproachStep = ({ onComplete, isActive, isCompleted }: FinalApproachStepProps) => {
  const [approach, setApproach] = useState("");
  const [timeComplexity, setTimeComplexity] = useState("");
  const [spaceComplexity, setSpaceComplexity] = useState("");
  const [edgeCases, setEdgeCases] = useState("");

  const isReady = 
    approach.length >= 50 && 
    timeComplexity.length >= 3 && 
    spaceComplexity.length >= 3 && 
    edgeCases.length >= 20;

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
        <div className="bg-success/10 border border-success/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-success mt-0.5" />
            <div>
              <h5 className="font-medium text-success">Explain Your Optimal Solution</h5>
              <p className="text-sm text-muted-foreground mt-1">
                Write out your complete approach in plain English. No code yet - just logic!
              </p>
            </div>
          </div>
        </div>

        {isActive && (
          <>
            {/* Approach */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Describe your optimal approach step by step:
              </label>
              <Textarea
                value={approach}
                onChange={(e) => setApproach(e.target.value)}
                placeholder="1. Create an empty hash map to store numbers we've seen&#10;2. For each number in the array:&#10;   a. Calculate its complement (target - current)&#10;   b. Check if complement exists in hash map&#10;   c. If yes, return the indices&#10;   d. If no, add current number and index to hash map&#10;3. If no pair found, return empty/null"
                className="min-h-[150px] font-mono text-sm"
              />
            </div>

            {/* Complexity Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Time Complexity
                </label>
                <Textarea
                  value={timeComplexity}
                  onChange={(e) => setTimeComplexity(e.target.value)}
                  placeholder="O(n) - we iterate once, hash map operations are O(1)"
                  className="min-h-[60px]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <HardDrive className="h-4 w-4" />
                  Space Complexity
                </label>
                <Textarea
                  value={spaceComplexity}
                  onChange={(e) => setSpaceComplexity(e.target.value)}
                  placeholder="O(n) - worst case, we store all n elements in the hash map"
                  className="min-h-[60px]"
                />
              </div>
            </div>

            {/* Edge Cases */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                What edge cases should you handle?
              </label>
              <Textarea
                value={edgeCases}
                onChange={(e) => setEdgeCases(e.target.value)}
                placeholder="- Empty array&#10;- Array with single element&#10;- No valid pair exists&#10;- Duplicate numbers (same element used twice)&#10;- Negative numbers"
                className="min-h-[100px]"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span className="text-xs text-muted-foreground">
                {!isReady ? "Complete all fields before coding" : "✓ Ready to code!"}
              </span>
              <Button
                onClick={onComplete}
                disabled={!isReady}
                variant={isReady ? "hero" : "secondary"}
                size="lg"
              >
                🎉 Unlock Code Editor
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default FinalApproachStep;
