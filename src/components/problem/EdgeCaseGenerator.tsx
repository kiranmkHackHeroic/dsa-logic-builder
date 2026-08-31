import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Lightbulb, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { useState } from "react";

interface EdgeCase {
  input: string;
  expected: string;
  explanation: string;
  isTrapped: boolean;
}

interface EdgeCaseGeneratorProps {
  problemType?: string;
}

const EdgeCaseGenerator = ({ problemType = "array" }: EdgeCaseGeneratorProps) => {
  const [generatedCases, setGeneratedCases] = useState<EdgeCase[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, boolean>>({});
  const [showResults, setShowResults] = useState(false);

  const edgeCaseTemplates: Record<string, EdgeCase[]> = {
    array: [
      { input: "[]", expected: "Handle empty array", explanation: "Empty array should return default value or throw appropriate error", isTrapped: true },
      { input: "[1]", expected: "Single element", explanation: "Single element array - no pairs possible for two sum type problems", isTrapped: true },
      { input: "[1, 1, 1, 1]", expected: "All duplicates", explanation: "All same elements - might affect pair finding or uniqueness", isTrapped: true },
      { input: "[-1, -2, -3]", expected: "All negative", explanation: "Negative numbers can affect sum calculations and comparisons", isTrapped: false },
      { input: "[0, 0, 0]", expected: "All zeros", explanation: "Zero values might cause division issues or unexpected behavior", isTrapped: true },
      { input: "[1, 2, ..., 10000]", expected: "Large array", explanation: "Performance edge case - ensure O(n) not O(n²)", isTrapped: false },
    ],
    string: [
      { input: '""', expected: "Empty string", explanation: "Empty string should return empty or handle gracefully", isTrapped: true },
      { input: '"a"', expected: "Single character", explanation: "Single char - might affect substring/window logic", isTrapped: true },
      { input: '"aaaa"', expected: "All same chars", explanation: "Repeated characters affect uniqueness calculations", isTrapped: true },
      { input: '"!@#$"', expected: "Special characters", explanation: "Non-alphanumeric might need special handling", isTrapped: false },
    ],
    tree: [
      { input: "null", expected: "Empty tree", explanation: "Null root should be handled without null pointer errors", isTrapped: true },
      { input: "Single node", expected: "One node tree", explanation: "Tree with only root - no children to process", isTrapped: true },
      { input: "Left-skewed", expected: "Linked list structure", explanation: "Degenerate tree becomes linked list - affects complexity", isTrapped: false },
    ],
  };

  const generateEdgeCases = () => {
    const cases = edgeCaseTemplates[problemType] || edgeCaseTemplates.array;
    // Shuffle and select random subset
    const shuffled = [...cases].sort(() => Math.random() - 0.5);
    setGeneratedCases(shuffled.slice(0, 4));
    setUserAnswers({});
    setShowResults(false);
  };

  const handleAnswer = (index: number, answer: boolean) => {
    setUserAnswers({ ...userAnswers, [index]: answer });
  };

  const checkAnswers = () => {
    setShowResults(true);
  };

  const score = generatedCases.filter((c, idx) => userAnswers[idx] === c.isTrapped).length;

  return (
    <Card variant="elevated">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Edge Case Generator
          </CardTitle>
          <Button variant="outline" size="sm" onClick={generateEdgeCases}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Generate Cases
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {generatedCases.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Click "Generate Cases" to practice edge case awareness</p>
            <p className="text-sm mt-2">Identify which inputs would trap most programmers!</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              Which of these inputs would trap most programmers? Select the tricky ones!
            </p>

            <div className="space-y-3">
              {generatedCases.map((edgeCase, idx) => (
                <div
                  key={idx}
                  className={`
                    p-4 rounded-lg border transition-all
                    ${showResults 
                      ? edgeCase.isTrapped 
                        ? "bg-warning/10 border-warning/30" 
                        : "bg-secondary/50 border-border"
                      : userAnswers[idx] !== undefined
                        ? userAnswers[idx] 
                          ? "bg-warning/10 border-warning/30"
                          : "bg-secondary/50 border-border"
                        : "bg-card border-border hover:border-primary/30"
                    }
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                        {edgeCase.input}
                      </code>
                      <p className="text-sm text-muted-foreground mt-2">{edgeCase.expected}</p>
                      
                      {showResults && (
                        <div className="mt-2 text-sm animate-fade-in">
                          <div className="flex items-center gap-2">
                            {userAnswers[idx] === edgeCase.isTrapped ? (
                              <CheckCircle className="h-4 w-4 text-success" />
                            ) : (
                              <XCircle className="h-4 w-4 text-destructive" />
                            )}
                            <span className={userAnswers[idx] === edgeCase.isTrapped ? "text-success" : "text-destructive"}>
                              {userAnswers[idx] === edgeCase.isTrapped ? "Correct!" : "Incorrect"}
                            </span>
                          </div>
                          <p className="text-muted-foreground mt-1 flex items-start gap-2">
                            <Lightbulb className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                            {edgeCase.explanation}
                          </p>
                        </div>
                      )}
                    </div>

                    {!showResults && (
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant={userAnswers[idx] === true ? "warning" : "outline"}
                          size="sm"
                          onClick={() => handleAnswer(idx, true)}
                        >
                          Tricky
                        </Button>
                        <Button
                          variant={userAnswers[idx] === false ? "secondary" : "outline"}
                          size="sm"
                          onClick={() => handleAnswer(idx, false)}
                        >
                          Safe
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {!showResults ? (
              <Button 
                variant="hero" 
                className="w-full"
                onClick={checkAnswers}
                disabled={Object.keys(userAnswers).length !== generatedCases.length}
              >
                Check Answers
              </Button>
            ) : (
              <div className="text-center p-4 bg-secondary/50 rounded-lg">
                <p className="text-2xl font-bold">
                  {score}/{generatedCases.length}
                </p>
                <p className="text-sm text-muted-foreground">Edge cases identified correctly</p>
                <Button variant="outline" className="mt-3" onClick={generateEdgeCases}>
                  Try Again
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EdgeCaseGenerator;
