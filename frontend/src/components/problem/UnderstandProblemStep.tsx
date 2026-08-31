import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, AlertCircle, Lightbulb } from "lucide-react";
import { useState } from "react";

interface UnderstandProblemStepProps {
  problem: {
    title: string;
    description: string;
    examples: { input: string; output: string; explanation?: string }[];
    constraints: string[];
  };
  onComplete: () => void;
  isActive: boolean;
}

const UnderstandProblemStep = ({ problem, onComplete, isActive }: UnderstandProblemStepProps) => {
  const [confirmed, setConfirmed] = useState(false);
  const [understanding, setUnderstanding] = useState("");

  const handleConfirm = () => {
    if (understanding.length >= 20) {
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
          <p className="text-muted-foreground">{problem.description}</p>
        </div>

        {/* Examples */}
        <div>
          <h5 className="font-medium mb-3 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-warning" />
            Examples
          </h5>
          <div className="space-y-3">
            {problem.examples.map((example, idx) => (
              <div key={idx} className="bg-secondary/50 rounded-lg p-4 font-mono text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-muted-foreground">Input:</span>
                    <pre className="mt-1 text-foreground">{example.input}</pre>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Output:</span>
                    <pre className="mt-1 text-success">{example.output}</pre>
                  </div>
                </div>
                {example.explanation && (
                  <p className="mt-2 text-muted-foreground text-xs">{example.explanation}</p>
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

        {/* Understanding Confirmation */}
        {isActive && !confirmed && (
          <div className="pt-4 border-t border-border">
            <label className="block text-sm font-medium mb-2">
              Explain the problem in your own words:
            </label>
            <Textarea
              value={understanding}
              onChange={(e) => setUnderstanding(e.target.value)}
              placeholder="What is the problem asking you to do? What are the inputs and expected outputs?"
              className="min-h-[100px] mb-3"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {understanding.length < 20 ? `${20 - understanding.length} more characters needed` : "✓ Ready to proceed"}
              </span>
              <Button
                onClick={handleConfirm}
                disabled={understanding.length < 20}
                variant={understanding.length >= 20 ? "success" : "secondary"}
              >
                I Understand the Problem
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UnderstandProblemStep;
