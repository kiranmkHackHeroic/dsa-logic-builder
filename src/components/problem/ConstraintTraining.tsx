import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Zap, Timer, CheckCircle, XCircle, TrendingUp } from "lucide-react";
import { useState } from "react";

interface Constraint {
  text: string;
  value: number;
  maxValue: number;
  unit: string;
}

interface ComplexityQuestion {
  constraint: string;
  complexity: string;
  operations: string;
  willPass: boolean;
  explanation: string;
}

const ConstraintTraining = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<boolean[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const questions: ComplexityQuestion[] = [
    {
      constraint: "n ≤ 10⁴",
      complexity: "O(n²)",
      operations: "10⁸ operations",
      willPass: true,
      explanation: "10⁴ × 10⁴ = 10⁸ operations. Most systems handle ~10⁸ ops/second, so this is on the edge but usually passes within 1 second."
    },
    {
      constraint: "n ≤ 10⁵",
      complexity: "O(n²)",
      operations: "10¹⁰ operations",
      willPass: false,
      explanation: "10⁵ × 10⁵ = 10¹⁰ operations. This would take ~100 seconds - way too slow! Need O(n log n) or O(n)."
    },
    {
      constraint: "n ≤ 10⁶",
      complexity: "O(n log n)",
      operations: "~2×10⁷ operations",
      willPass: true,
      explanation: "10⁶ × log(10⁶) ≈ 10⁶ × 20 = 2×10⁷ operations. Very fast, easily passes."
    },
    {
      constraint: "n ≤ 20",
      complexity: "O(2ⁿ)",
      operations: "~10⁶ operations",
      willPass: true,
      explanation: "2²⁰ ≈ 10⁶ operations. Small n with exponential is fine. This is why backtracking works for n ≤ 20."
    },
    {
      constraint: "n ≤ 10³",
      complexity: "O(n³)",
      operations: "10⁹ operations",
      willPass: false,
      explanation: "10³ × 10³ × 10³ = 10⁹ operations. Takes ~10 seconds - too slow for most online judges (1-2s limit)."
    },
    {
      constraint: "n ≤ 10⁷",
      complexity: "O(n)",
      operations: "10⁷ operations",
      willPass: true,
      explanation: "Linear time with 10⁷ elements is perfectly fine. Runs in well under 1 second."
    },
  ];

  const handleAnswer = (answer: boolean) => {
    const newAnswers = [...userAnswers, answer];
    setUserAnswers(newAnswers);
    setShowResult(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowResult(false);
    } else {
      setIsComplete(true);
    }
  };

  const resetTraining = () => {
    setCurrentQuestion(0);
    setUserAnswers([]);
    setShowResult(false);
    setIsComplete(false);
  };

  const question = questions[currentQuestion];
  const isCorrect = userAnswers[currentQuestion] === question.willPass;
  const score = userAnswers.filter((a, i) => a === questions[i].willPass).length;

  return (
    <Card variant="elevated">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-warning" />
            Constraint Awareness Training
          </CardTitle>
          <Badge variant="primary">
            {currentQuestion + 1}/{questions.length}
          </Badge>
        </div>
        <Progress 
          value={((currentQuestion + (showResult ? 1 : 0)) / questions.length) * 100} 
          variant="accent" 
        />
      </CardHeader>
      <CardContent className="space-y-6">
        {!isComplete ? (
          <>
            {/* Question */}
            <div className="text-center py-6 bg-secondary/30 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Given constraint:</p>
              <p className="text-3xl font-mono font-bold text-primary mb-4">{question.constraint}</p>
              <p className="text-sm text-muted-foreground mb-2">With complexity:</p>
              <p className="text-2xl font-mono font-bold">{question.complexity}</p>
              <p className="text-sm text-muted-foreground mt-2">
                ({question.operations})
              </p>
            </div>

            {!showResult ? (
              <div className="space-y-3">
                <p className="text-center font-medium">Will this pass the time limit?</p>
                <div className="flex gap-3 justify-center">
                  <Button
                    variant="success"
                    size="lg"
                    onClick={() => handleAnswer(true)}
                    className="w-32"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Yes
                  </Button>
                  <Button
                    variant="destructive"
                    size="lg"
                    onClick={() => handleAnswer(false)}
                    className="w-32"
                  >
                    <XCircle className="h-5 w-5 mr-2" />
                    No
                  </Button>
                </div>
              </div>
            ) : (
              <div className={`
                p-4 rounded-lg animate-fade-in
                ${isCorrect ? "bg-success/10 border border-success/30" : "bg-destructive/10 border border-destructive/30"}
              `}>
                <div className="flex items-center gap-2 mb-2">
                  {isCorrect ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span className="font-semibold text-success">Correct!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-destructive" />
                      <span className="font-semibold text-destructive">Incorrect</span>
                    </>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{question.explanation}</p>
                <Button variant="hero" className="w-full mt-4" onClick={nextQuestion}>
                  {currentQuestion < questions.length - 1 ? "Next Question" : "See Results"}
                </Button>
              </div>
            )}
          </>
        ) : (
          /* Results */
          <div className="text-center space-y-4">
            <div className="py-8">
              <TrendingUp className="h-16 w-16 mx-auto text-primary mb-4" />
              <p className="text-4xl font-bold">{score}/{questions.length}</p>
              <p className="text-muted-foreground">Correct Answers</p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-success/10 rounded-lg">
                <p className="text-lg font-bold text-success">{score}</p>
                <p className="text-xs text-muted-foreground">Correct</p>
              </div>
              <div className="p-3 bg-destructive/10 rounded-lg">
                <p className="text-lg font-bold text-destructive">{questions.length - score}</p>
                <p className="text-xs text-muted-foreground">Incorrect</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <p className="text-lg font-bold text-primary">{Math.round((score / questions.length) * 100)}%</p>
                <p className="text-xs text-muted-foreground">Accuracy</p>
              </div>
            </div>

            {score < questions.length && (
              <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 text-left">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-warning">Quick Reference</p>
                    <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                      <li>• O(n²) works for n ≤ 10⁴</li>
                      <li>• O(n log n) works for n ≤ 10⁶</li>
                      <li>• O(n) works for n ≤ 10⁷ or 10⁸</li>
                      <li>• O(2ⁿ) works only for n ≤ 20-25</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <Button variant="outline" onClick={resetTraining}>
              Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConstraintTraining;
