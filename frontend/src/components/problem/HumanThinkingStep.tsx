import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { CheckCircle, Pencil, Brain, Check, AlertTriangle, Lightbulb } from "lucide-react";
import { useState, useMemo, useEffect } from "react";

interface HumanThinkingStepProps {
  problem?: {
    title: string;
    examples?: { input: string; output: string; explanation?: string }[];
    pattern?: string;
  };
  onComplete: () => void;
  isActive: boolean;
  isCompleted: boolean;
}

const normalize = (str: string) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .trim();

const HumanThinkingStep = ({
  problem,
  onComplete,
  isActive,
  isCompleted,
}: HumanThinkingStepProps) => {
  const activeExample = problem?.examples?.[0] || {
    input: "nums = [2,7,11,15], target = 9",
    output: "[0, 1]",
  };

  const [working, setWorking] = useState("");
  const [manualAnswer, setManualAnswer] = useState("");
  const [thinking, setThinking] = useState("");

  // Validation logic
  const validation = useMemo(() => {
    const traceValid = working.trim().length >= 25;
    const thinkingValid = thinking.trim().length >= 20;

    const expectedNorm = normalize(activeExample.output);
    const userNorm = normalize(manualAnswer);

    // Validate if the user's manual calculated answer matches the problem's expected output
    const answerValid =
      expectedNorm.length > 0 &&
      (userNorm === expectedNorm ||
        userNorm.includes(expectedNorm) ||
        expectedNorm.includes(userNorm));

    const isValid = traceValid && thinkingValid && answerValid;

    return {
      traceValid,
      thinkingValid,
      answerValid,
      isValid,
    };
  }, [working, thinking, manualAnswer, activeExample.output]);

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
            <Brain className="h-5 w-5 text-accent mt-0.5 shrink-0" />
            <div>
              <h5 className="font-medium text-accent">Think Like a Human First</h5>
              <p className="text-sm text-muted-foreground mt-1">
                Before writing any code or syntax, manually trace through an example for{" "}
                <strong>{problem?.title || "this problem"}</strong> using pen and paper logic.
              </p>
            </div>
          </div>
        </div>

        {isActive && (
          <>
            {/* Manual Example Working */}
            <div className="space-y-4">
              <h5 className="font-medium flex items-center gap-2">
                <Pencil className="h-4 w-4 text-primary" />
                Work Through Problem Example
              </h5>

              <div className="bg-secondary/50 rounded-lg p-4 space-y-3 border border-border/40">
                <div className="font-mono text-sm">
                  <span className="text-muted-foreground font-sans text-xs uppercase font-bold tracking-wider">Example Input:</span>
                  <pre className="mt-1 text-foreground whitespace-pre-wrap">{activeExample.input}</pre>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">
                    Show your step-by-step manual trace:
                  </label>
                  <Textarea
                    value={working}
                    onChange={(e) => setWorking(e.target.value)}
                    placeholder="Step 1: Inspect first element...&#10;Step 2: Check conditions against constraints...&#10;Step 3: Arrive at final state..."
                    className="min-h-[100px] font-mono text-xs"
                  />
                </div>

                {/* Manual Output Verification Input Space */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">
                    What output did your manual trace produce?
                  </label>
                  <div className="flex gap-2 items-center">
                    <Input
                      value={manualAnswer}
                      onChange={(e) => setManualAnswer(e.target.value)}
                      placeholder={`Enter manual result (e.g. ${activeExample.output})`}
                      className="font-mono text-sm max-w-sm"
                    />
                    {manualAnswer.trim().length > 0 && (
                      validation.answerValid ? (
                        <span className="text-primary text-xs font-bold flex items-center gap-1">
                          <Check className="h-4 w-4" /> Correct output!
                        </span>
                      ) : (
                        <span className="text-destructive text-xs font-medium flex items-center gap-1">
                          <AlertTriangle className="h-4 w-4" /> Output does not match expected result
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* General Thinking Observation */}
            <div>
              <label className="block text-sm font-medium mb-2">
                What pattern or recurring rule did you notice during your manual trace?
              </label>
              <Textarea
                value={thinking}
                onChange={(e) => setThinking(e.target.value)}
                placeholder="Explain the pattern: Do we need to look backwards, keep two pointers, expand a window, or use a lookup table?"
                className="min-h-[80px]"
              />
            </div>

            {/* Input Space Validation Summary */}
            <div className="bg-secondary/40 border border-border/50 rounded-lg p-3 text-xs space-y-1.5">
              <div className="flex items-center justify-between font-semibold">
                <span className="text-foreground">Step 2 Input Validation:</span>
                {validation.isValid ? (
                  <span className="text-primary font-bold flex items-center gap-1">
                    <Check className="h-3.5 w-3.5" /> Validation Passed
                  </span>
                ) : (
                  <span className="text-warning font-medium flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" /> Pending Correct Input
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className={validation.traceValid ? "text-primary" : "text-muted-foreground"}>
                  {validation.traceValid ? "✓" : "○"} Step-by-step trace ({working.trim().length}/25)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={validation.answerValid ? "text-primary" : "text-muted-foreground"}>
                  {validation.answerValid ? "✓" : "○"} Output matches expected example result
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={validation.thinkingValid ? "text-primary" : "text-muted-foreground"}>
                  {validation.thinkingValid ? "✓" : "○"} Algorithmic pattern intuition ({thinking.trim().length}/20)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-muted-foreground">
                {validation.isValid
                  ? "✓ Verified manual execution. Ready to proceed to Brute Force."
                  : "Verify the manual trace output matches the expected result to continue."}
              </span>
              <Button
                onClick={handleComplete}
                disabled={!validation.isValid}
                variant={validation.isValid ? "default" : "secondary"}
                className="font-semibold"
              >
                Complete Human Thinking
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default HumanThinkingStep;
