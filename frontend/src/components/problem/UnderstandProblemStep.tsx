import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, AlertCircle, Lightbulb, Check, AlertTriangle } from "lucide-react";
import { useState, useMemo } from "react";

interface UnderstandProblemStepProps {
  problem: {
    title: string;
    description: string;
    examples: { input: string; output: string; explanation?: string }[];
    constraints: string[];
    pattern?: string;
  };
  onComplete: () => void;
  isActive: boolean;
}

const UnderstandProblemStep = ({ problem, onComplete, isActive }: UnderstandProblemStepProps) => {
  const [confirmed, setConfirmed] = useState(false);
  const [understanding, setUnderstanding] = useState("");

  // Extract relevant keywords from the specific problem to validate user understanding
  const problemKeywords = useMemo(() => {
    const text = `${problem.title} ${problem.description} ${problem.pattern || ""}`.toLowerCase();
    const commonStopwords = new Set([
      "given", "that", "this", "with", "from", "each", "have", "more", "will",
      "what", "when", "where", "which", "your", "them", "then", "than", "there"
    ]);
    const words = text
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 4 && !commonStopwords.has(w));
    return Array.from(new Set(words));
  }, [problem.title, problem.description, problem.pattern]);

  // Validation logic
  const validation = useMemo(() => {
    const text = understanding.trim().toLowerCase();
    const lengthValid = text.length >= 25;

    // Check if user text contains at least one or two problem-relevant keywords
    const matchedKeywords = problemKeywords.filter((kw) => text.includes(kw));
    const relevanceValid = matchedKeywords.length >= 1;

    // Generic problem reasoning keywords (input, output, return, find, check, sum, etc.)
    const reasoningKeywords = ["return", "find", "input", "output", "given", "array", "string", "number", "target", "index", "indices", "element", "max", "min", "count", "sum", "valid", "check", "order"];
    const hasReasoningWord = reasoningKeywords.some((w) => text.includes(w));

    const isValid = lengthValid && (relevanceValid || hasReasoningWord);

    return {
      lengthValid,
      relevanceValid: relevanceValid || hasReasoningWord,
      matchedKeywords,
      isValid,
    };
  }, [understanding, problemKeywords]);

  const handleConfirm = () => {
    if (validation.isValid) {
      setConfirmed(true);
      onComplete();
    }
  };

  return (
    <Card variant={isActive ? "step-active" : "step-locked"} className="transition-all">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-bold">
              1
            </span>
            Understand the Problem
          </CardTitle>
          {confirmed && (
            <Badge variant="success" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" /> Completed
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Problem Description */}
        <div>
          <h4 className="font-semibold mb-2">{problem.title}</h4>
          <p className="text-muted-foreground leading-relaxed">{problem.description}</p>
        </div>

        {/* Examples */}
        <div>
          <h5 className="font-medium mb-3 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-warning" />
            Examples
          </h5>
          <div className="space-y-3">
            {problem.examples.map((example, idx) => (
              <div key={idx} className="bg-secondary/50 rounded-lg p-4 font-mono text-sm border border-border/40">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Input:</span>
                    <pre className="mt-1 text-foreground whitespace-pre-wrap">{example.input}</pre>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Output:</span>
                    <pre className="mt-1 text-primary font-bold whitespace-pre-wrap">{example.output}</pre>
                  </div>
                </div>
                {example.explanation && (
                  <p className="mt-2 pt-2 border-t border-border/40 text-muted-foreground text-xs font-sans">
                    {example.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Constraints */}
        <div>
          <h5 className="font-medium mb-2 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-destructive" />
            Constraints
          </h5>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            {problem.constraints.map((constraint, idx) => (
              <li key={idx} className="font-mono">{constraint}</li>
            ))}
          </ul>
        </div>

        {/* Understanding Confirmation & Real Validation */}
        {isActive && !confirmed && (
          <div className="pt-4 border-t border-border space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium">
                Explain the problem in your own words:
              </label>
              <span className="text-xs text-muted-foreground">
                Must reference the core goal and input/output
              </span>
            </div>
            
            <Textarea
              value={understanding}
              onChange={(e) => setUnderstanding(e.target.value)}
              placeholder={`E.g., We are given ${problem.title.toLowerCase()} and we need to determine the required output while respecting the given constraints...`}
              className="min-h-[110px]"
            />

            {/* Live Input Space Validation Indicator */}
            <div className="bg-secondary/40 border border-border/50 rounded-lg p-3 text-xs space-y-1.5">
              <div className="flex items-center justify-between font-semibold">
                <span className="text-foreground">Input Validation Check:</span>
                {validation.isValid ? (
                  <span className="text-primary font-bold flex items-center gap-1">
                    <Check className="h-3.5 w-3.5" /> Valid Understanding
                  </span>
                ) : (
                  <span className="text-warning font-medium flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" /> Validation Pending
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className={validation.lengthValid ? "text-primary" : "text-muted-foreground"}>
                  {validation.lengthValid ? "✓" : "○"} At least 25 characters ({understanding.trim().length}/25)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={validation.relevanceValid ? "text-primary" : "text-muted-foreground"}>
                  {validation.relevanceValid ? "✓" : "○"} References problem inputs, outputs, or concepts
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-muted-foreground">
                {validation.isValid
                  ? "✓ Validation passed. Ready to proceed!"
                  : "Explain the input and expected outcome to unlock next step."}
              </span>
              <Button
                onClick={handleConfirm}
                disabled={!validation.isValid}
                variant={validation.isValid ? "default" : "secondary"}
                className="font-semibold"
              >
                Confirm Understanding
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UnderstandProblemStep;
