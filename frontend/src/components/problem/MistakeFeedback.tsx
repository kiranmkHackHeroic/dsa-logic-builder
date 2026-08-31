import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Brain, CheckCircle, XCircle, Lightbulb, RefreshCw } from "lucide-react";
import { useState } from "react";

interface MistakeFeedback {
  mistake: string;
  whyWrong: string;
  correctThinking: string;
  commonTrap: string;
}

const MistakeFeedback = () => {
  const [userApproach, setUserApproach] = useState("");
  const [analyzedMistakes, setAnalyzedMistakes] = useState<MistakeFeedback[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const commonMistakes: MistakeFeedback[] = [
    {
      mistake: "Using nested loops without checking constraints",
      whyWrong: "O(n²) seems simple but fails for n > 10⁴. You assumed brute force would work without analyzing constraints.",
      correctThinking: "Always check constraints FIRST. If n > 10⁴, immediately look for O(n) or O(n log n) solutions.",
      commonTrap: "The simple solution seems correct, so you skip constraint analysis"
    },
    {
      mistake: "Not considering negative numbers",
      whyWrong: "Many array problems include negative values. Assumptions about positivity break algorithms.",
      correctThinking: "Read constraints carefully. If not specified as positive, assume negatives and zeros are possible.",
      commonTrap: "Examples often use positive numbers, leading to false assumptions"
    },
    {
      mistake: "Forgetting about duplicate elements",
      whyWrong: "Algorithms that assume unique elements fail silently with duplicates, giving wrong answers.",
      correctThinking: "Ask: 'What if all elements are the same?' This reveals duplicate-related bugs.",
      commonTrap: "Test cases rarely cover the 'all same elements' scenario"
    },
    {
      mistake: "Off-by-one in array bounds",
      whyWrong: "Using <= instead of < or vice versa causes index out of bounds or missing elements.",
      correctThinking: "For 0-indexed arrays: valid indices are 0 to n-1. 'Less than n' not 'less than or equal'.",
      commonTrap: "The last/first element is often forgotten in loop bounds"
    },
    {
      mistake: "Not handling empty input",
      whyWrong: "Empty arrays, strings, or null inputs cause crashes if not explicitly handled.",
      correctThinking: "Add guard clauses at the start: 'if (arr.length === 0) return defaultValue'",
      commonTrap: "Most examples have valid input, so empty case seems unnecessary"
    },
  ];

  const analyzeApproach = () => {
    setIsAnalyzing(true);
    
    // Simulate analysis
    setTimeout(() => {
      const detectedMistakes: MistakeFeedback[] = [];
      const lowerApproach = userApproach.toLowerCase();
      
      if (lowerApproach.includes("nested loop") || lowerApproach.includes("for i") && lowerApproach.includes("for j")) {
        detectedMistakes.push(commonMistakes[0]);
      }
      if (!lowerApproach.includes("negative") && !lowerApproach.includes("constraint")) {
        detectedMistakes.push(commonMistakes[1]);
      }
      if (!lowerApproach.includes("duplicate") && !lowerApproach.includes("same")) {
        detectedMistakes.push(commonMistakes[2]);
      }
      if (!lowerApproach.includes("empty") && !lowerApproach.includes("null") && !lowerApproach.includes("edge")) {
        detectedMistakes.push(commonMistakes[4]);
      }
      
      // If no specific mistakes found, show general advice
      if (detectedMistakes.length === 0) {
        detectedMistakes.push({
          mistake: "Approach looks reasonable",
          whyWrong: "No obvious mistakes detected, but always verify with edge cases.",
          correctThinking: "Good start! Now trace through with edge cases: empty input, single element, all duplicates, maximum values.",
          commonTrap: "Confidence in initial approach without thorough testing"
        });
      }
      
      setAnalyzedMistakes(detectedMistakes);
      setIsAnalyzing(false);
    }, 1500);
  };

  const reset = () => {
    setUserApproach("");
    setAnalyzedMistakes([]);
  };

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-accent" />
          Mistake-Driven Feedback
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-accent mt-0.5" />
            <div>
              <p className="font-medium text-accent">Learn from Common Mistakes</p>
              <p className="text-sm text-muted-foreground mt-1">
                Describe your approach and we will identify potential pitfalls before you code.
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Describe your approach:</label>
          <Textarea
            value={userApproach}
            onChange={(e) => setUserApproach(e.target.value)}
            placeholder="I would use nested loops to check every pair..."
            className="min-h-[120px]"
          />
        </div>

        {analyzedMistakes.length === 0 ? (
          <Button 
            variant="hero" 
            className="w-full"
            onClick={analyzeApproach}
            disabled={userApproach.length < 20 || isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Analyze My Approach
              </>
            )}
          </Button>
        ) : (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Feedback</h4>
              <Button variant="ghost" size="sm" onClick={reset}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>

            {analyzedMistakes.map((feedback, idx) => (
              <div key={idx} className="border border-border rounded-lg overflow-hidden">
                <div className="bg-destructive/10 px-4 py-2 border-b border-border">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-destructive" />
                    <span className="font-medium text-destructive">{feedback.mistake}</span>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Why this is wrong:</p>
                    <p className="text-sm">{feedback.whyWrong}</p>
                  </div>
                  <div className="bg-success/10 border border-success/20 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-success uppercase tracking-wide mb-1">Correct Thinking:</p>
                        <p className="text-sm text-muted-foreground">{feedback.correctThinking}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-warning uppercase tracking-wide mb-1">Common Trap:</p>
                        <p className="text-sm text-muted-foreground">{feedback.commonTrap}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MistakeFeedback;
