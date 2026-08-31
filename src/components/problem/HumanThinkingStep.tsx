import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Pencil, Brain } from "lucide-react";
import { useState } from "react";

interface HumanThinkingStepProps {
  onComplete: () => void;
  isActive: boolean;
  isCompleted: boolean;
}

const HumanThinkingStep = ({ onComplete, isActive, isCompleted }: HumanThinkingStepProps) => {
  const [thinking, setThinking] = useState("");
  const [examples, setExamples] = useState([
    { input: "[2,7,11,15], target=9", working: "", answer: "" },
  ]);

  const handleComplete = () => {
    if (thinking.length >= 30 && examples[0].working.length >= 10) {
      onComplete();
    }
  };

  const updateExample = (index: number, field: "working" | "answer", value: string) => {
    const newExamples = [...examples];
    newExamples[index][field] = value;
    setExamples(newExamples);
  };

  const isReady = thinking.length >= 30 && examples[0].working.length >= 10;

  return (
    <Card variant={isActive ? "step-active" : isCompleted ? "step-completed" : "step-locked"}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-bold">
              2
            </span>
            Human Thinking Mode
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
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Brain className="h-5 w-5 text-accent mt-0.5" />
            <div>
              <h5 className="font-medium text-accent">Think Like a Human First</h5>
              <p className="text-sm text-muted-foreground mt-1">
                Before thinking about code, solve the problem manually with small examples.
                How would you solve this with pen and paper?
              </p>
            </div>
          </div>
        </div>

        {isActive && (
          <>
            {/* Manual Example Working */}
            <div>
              <h5 className="font-medium mb-3 flex items-center gap-2">
                <Pencil className="h-4 w-4" />
                Work Through an Example
              </h5>
              {examples.map((example, idx) => (
                <div key={idx} className="bg-secondary/50 rounded-lg p-4 space-y-3">
                  <div className="font-mono text-sm">
                    <span className="text-muted-foreground">Example:</span> {example.input}
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground block mb-1">
                      Show your step-by-step working:
                    </label>
                    <Textarea
                      value={example.working}
                      onChange={(e) => updateExample(idx, "working", e.target.value)}
                      placeholder="Step 1: Look at first number 2, I need to find 7 (9-2=7)&#10;Step 2: Scan array for 7, found at index 1&#10;Step 3: Return indices [0, 1]"
                      className="min-h-[100px] font-mono text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* General Thinking */}
            <div>
              <label className="block text-sm font-medium mb-2">
                What pattern or approach did you notice?
              </label>
              <Textarea
                value={thinking}
                onChange={(e) => setThinking(e.target.value)}
                placeholder="I noticed that for each number, I need to check if its complement exists...&#10;The key insight is..."
                className="min-h-[80px]"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span className="text-xs text-muted-foreground">
                {!isReady ? "Complete the working and describe your approach" : "✓ Great thinking! Ready to proceed"}
              </span>
              <Button
                onClick={handleComplete}
                disabled={!isReady}
                variant={isReady ? "success" : "secondary"}
              >
                Continue to Brute Force
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default HumanThinkingStep;
