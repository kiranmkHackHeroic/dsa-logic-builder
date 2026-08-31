import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import problems, { getProblemById } from "@/data/problems";
import { Difficulty, Problem } from "@/types/problem";
import { 
  Timer, 
  Lock, 
  Unlock,
  Play, 
  RotateCcw,
  Brain,
  Code,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Check,
  Circle,
  FlaskConical,
  ListChecks
} from "lucide-react";

type InterviewPhase = "approach" | "coding" | "review";
type TestStatus = "idle" | "pass" | "fail";

const STORAGE_KEY = "interview-mode-state-v2";
const MIN_APPROACH_CHARS = 140;
const DURATION_OPTIONS = [30, 45, 60];

const clampScore = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

const hasComplexityMention = (text: string) => /o\([^)]*\)/i.test(text);
const hasEdgeCaseMention = (text: string) => /edge\s*case|empty|null|single|duplicate|overflow/i.test(text);

const pickRandomProblem = (difficulty: Difficulty | "any") => {
  const eligible = problems.filter((problem) => {
    if (!problem.description) return false;
    if (difficulty === "any") return true;
    return problem.difficulty === difficulty;
  });

  if (eligible.length === 0) return null;
  return eligible[Math.floor(Math.random() * eligible.length)];
};

const calculateScores = (
  approachText: string,
  codeText: string,
  testStatus: TestStatus,
  timeLeft: number,
  totalTimeSeconds: number
) => {
  const normalizedApproach = approachText.trim();
  const normalizedCode = codeText.trim();
  const keywordMatches = ["hash", "pointer", "binary", "dp", "stack", "queue", "map"].filter((token) =>
    new RegExp(token, "i").test(`${normalizedApproach} ${normalizedCode}`)
  ).length;

  const logicClarity = clampScore(
    (normalizedApproach.length / 260) * 75 +
      (hasComplexityMention(normalizedApproach) ? 15 : 0) +
      (hasEdgeCaseMention(normalizedApproach) ? 10 : 0)
  );

  const correctness = clampScore(
    (normalizedCode.length / 220) * 50 +
      (/(return|def |function |class )/i.test(normalizedCode) ? 20 : 0) +
      (testStatus === "pass" ? 30 : testStatus === "fail" ? 5 : 15)
  );

  const optimization = clampScore(
    (hasComplexityMention(normalizedApproach) ? 30 : 10) +
      keywordMatches * 8 +
      (/(optimi|trade\s*off|space|time)/i.test(normalizedApproach) ? 20 : 0)
  );

  const communication = clampScore(
    (normalizedApproach.length / 280) * 70 +
      (/(first|then|finally|step)/i.test(normalizedApproach) ? 20 : 0) +
      (/(because|therefore|so that)/i.test(normalizedApproach) ? 10 : 0)
  );

  const pacing = clampScore((timeLeft / totalTimeSeconds) * 30 + 70);
  const overall = clampScore((logicClarity + correctness + optimization + communication + pacing) / 5);

  return { logicClarity, correctness, optimization, communication, pacing, overall };
};

const InterviewMode = () => {
  const { toast } = useToast();

  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | "any">("any");
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [isStarted, setIsStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45 * 60);
  const [currentPhase, setCurrentPhase] = useState<InterviewPhase>("approach");
  const [approachText, setApproachText] = useState("");
  const [codeText, setCodeText] = useState("");
  const [isCodeUnlocked, setIsCodeUnlocked] = useState(false);
  const [testStatus, setTestStatus] = useState<TestStatus>("idle");
  const [testMessage, setTestMessage] = useState("");
  const [activeProblem, setActiveProblem] = useState<Problem | null>(null);

  const totalTimeSeconds = durationMinutes * 60;

  const interviewScores = useMemo(
    () => calculateScores(approachText, codeText, testStatus, timeLeft, totalTimeSeconds),
    [approachText, codeText, testStatus, timeLeft, totalTimeSeconds]
  );

  const approachChecks = {
    minChars: approachText.trim().length >= MIN_APPROACH_CHARS,
    complexity: hasComplexityMention(approachText),
    edgeCases: hasEdgeCaseMention(approachText),
  };

  const canUnlockCode = approachChecks.minChars && approachChecks.complexity;

  useEffect(() => {
    setTimeLeft(durationMinutes * 60);
  }, [durationMinutes]);

  useEffect(() => {
    try {
      const rawState = localStorage.getItem(STORAGE_KEY);
      if (!rawState) return;

      const parsed = JSON.parse(rawState) as {
        selectedDifficulty: Difficulty | "any";
        durationMinutes: number;
        isStarted: boolean;
        timeLeft: number;
        currentPhase: InterviewPhase;
        approachText: string;
        codeText: string;
        isCodeUnlocked: boolean;
        testStatus: TestStatus;
        testMessage: string;
        activeProblemId: number | null;
      };

      setSelectedDifficulty(parsed.selectedDifficulty ?? "any");
      setDurationMinutes(parsed.durationMinutes ?? 45);
      setIsStarted(parsed.isStarted ?? false);
      setTimeLeft(parsed.timeLeft ?? 45 * 60);
      setCurrentPhase(parsed.currentPhase ?? "approach");
      setApproachText(parsed.approachText ?? "");
      setCodeText(parsed.codeText ?? "");
      setIsCodeUnlocked(parsed.isCodeUnlocked ?? false);
      setTestStatus(parsed.testStatus ?? "idle");
      setTestMessage(parsed.testMessage ?? "");
      setActiveProblem(parsed.activeProblemId ? getProblemById(parsed.activeProblemId) ?? null : null);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    const snapshot = {
      selectedDifficulty,
      durationMinutes,
      isStarted,
      timeLeft,
      currentPhase,
      approachText,
      codeText,
      isCodeUnlocked,
      testStatus,
      testMessage,
      activeProblemId: activeProblem?.id ?? null,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  }, [
    selectedDifficulty,
    durationMinutes,
    isStarted,
    timeLeft,
    currentPhase,
    approachText,
    codeText,
    isCodeUnlocked,
    testStatus,
    testMessage,
    activeProblem,
  ]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isStarted && currentPhase !== "review" && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isStarted, currentPhase, timeLeft]);

  useEffect(() => {
    if (!isStarted || currentPhase === "review" || timeLeft > 0) return;
    setCurrentPhase("review");
    toast({
      title: "Time is up",
      description: "Interview moved to review. Focus on how clearly you explained your approach.",
      variant: "destructive",
    });
  }, [currentPhase, isStarted, timeLeft, toast]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startInterview = () => {
    const selectedProblem = pickRandomProblem(selectedDifficulty);
    if (!selectedProblem) {
      toast({
        title: "No problem available",
        description: "Try another difficulty to start interview mode.",
        variant: "destructive",
      });
      return;
    }

    setActiveProblem(selectedProblem);
    setIsStarted(true);
    setTimeLeft(durationMinutes * 60);
    setCurrentPhase("approach");
    setApproachText("");
    setCodeText("");
    setIsCodeUnlocked(false);
    setTestStatus("idle");
    setTestMessage("");
  };

  const handleUnlockCode = () => {
    if (!canUnlockCode) return;
    setIsCodeUnlocked(true);
    setCurrentPhase("coding");
    toast({
      title: "Code editor unlocked",
      description: "Great. Implement your solution and run a quick sanity test.",
    });
  };

  const handleRunTests = () => {
    const normalizedCode = codeText.trim();
    if (normalizedCode.length < 60) {
      setTestStatus("fail");
      setTestMessage("Add a full implementation before running tests.");
      return;
    }

    if (!/(return|def |function |class )/i.test(normalizedCode)) {
      setTestStatus("fail");
      setTestMessage("Tests failed: no executable function/return detected.");
      return;
    }

    setTestStatus("pass");
    setTestMessage("Basic checks passed. Validate edge cases and complexity in your explanation.");
  };

  const submitSolution = () => {
    if (!codeText.trim()) {
      toast({
        title: "Code required",
        description: "Add your solution before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (testStatus === "idle") {
      toast({
        title: "Tip",
        description: "Run a quick test pass before submit for stronger correctness score.",
      });
    }

    setCurrentPhase("review");
  };

  const resetInterview = () => {
    setIsStarted(false);
    setTimeLeft(durationMinutes * 60);
    setCurrentPhase("approach");
    setApproachText("");
    setCodeText("");
    setIsCodeUnlocked(false);
    setTestStatus("idle");
    setTestMessage("");
    setActiveProblem(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <Badge variant="warning" className="mb-4">Interview Mode</Badge>
            <h1 className="text-3xl font-bold mb-2">Simulate Real Interviews</h1>
            <p className="text-muted-foreground">
              Practice under pressure with locked code and forced explanation
            </p>
          </div>

          {!isStarted ? (
            /* Pre-Interview Screen */
            <Card variant="elevated" className="max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Ready to Begin?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Choose difficulty</p>
                    <div className="flex flex-wrap gap-2">
                      {(["any", "easy", "medium", "hard"] as const).map((difficulty) => (
                        <Button
                          key={difficulty}
                          variant={selectedDifficulty === difficulty ? "hero" : "outline"}
                          size="sm"
                          onClick={() => setSelectedDifficulty(difficulty)}
                        >
                          {difficulty === "any" ? "Mixed" : difficulty}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Interview duration</p>
                    <div className="flex gap-2">
                      {DURATION_OPTIONS.map((minutes) => (
                        <Button
                          key={minutes}
                          variant={durationMinutes === minutes ? "hero" : "outline"}
                          size="sm"
                          onClick={() => setDurationMinutes(minutes)}
                        >
                          {minutes} min
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-secondary/50 rounded-lg">
                    <Timer className="h-8 w-8 mx-auto mb-2 text-warning" />
                    <p className="font-semibold">{durationMinutes} Minutes</p>
                    <p className="text-xs text-muted-foreground">Time Limit</p>
                  </div>
                  <div className="p-4 bg-secondary/50 rounded-lg">
                    <Lock className="h-8 w-8 mx-auto mb-2 text-destructive" />
                    <p className="font-semibold">Locked Code</p>
                    <p className="text-xs text-muted-foreground">Until Explained</p>
                  </div>
                  <div className="p-4 bg-secondary/50 rounded-lg">
                    <Brain className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="font-semibold">Logic First</p>
                    <p className="text-xs text-muted-foreground">Think Before Code</p>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Interview Rules:</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• You must explain your approach before coding</li>
                    <li>• Code editor is locked until approach is accepted</li>
                    <li>• You will be evaluated on logic clarity, correctness, and optimization</li>
                    <li>• Timer runs continuously once started</li>
                  </ul>
                </div>

                <Button 
                  variant="hero" 
                  size="xl" 
                  className="w-full"
                  onClick={startInterview}
                >
                  <Play className="h-5 w-5 mr-2" />
                  Start Interview
                </Button>
              </CardContent>
            </Card>
          ) : (
            /* Interview in Progress */
            <div className="space-y-6">
              {/* Timer Bar */}
              <Card variant={timeLeft < 300 ? "step-active" : "elevated"}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`text-3xl font-mono font-bold ${timeLeft < 300 ? "text-destructive" : "text-foreground"}`}>
                        {formatTime(timeLeft)}
                      </div>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={resetInterview}
                        title="Reset interview"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={currentPhase === "approach" ? "warning" : currentPhase === "coding" ? "primary" : "success"}>
                        {currentPhase === "approach" ? "Explain Approach" : currentPhase === "coding" ? "Coding" : "Review"}
                      </Badge>
                      {isCodeUnlocked ? (
                        <Unlock className="h-5 w-5 text-success" />
                      ) : (
                        <Lock className="h-5 w-5 text-destructive" />
                      )}
                    </div>
                  </div>
                  <Progress 
                    value={(timeLeft / totalTimeSeconds) * 100} 
                    variant={timeLeft < 300 ? "warning" : "accent"} 
                    className="mt-3"
                  />
                </CardContent>
              </Card>

              {/* Problem */}
              <Card variant="elevated">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{activeProblem?.title ?? "Interview Problem"}</CardTitle>
                    <Badge variant={activeProblem?.difficulty ?? "easy"}>{activeProblem?.difficulty ?? "easy"}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{activeProblem?.description}</p>
                  {activeProblem?.constraints?.length ? (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Constraints</p>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                        {activeProblem.constraints.slice(0, 4).map((constraint) => (
                          <li key={constraint}>{constraint}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </CardContent>
              </Card>

              {/* Approach Phase */}
              {currentPhase === "approach" && (
                <Card variant="step-active">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-primary" />
                      Explain Your Approach
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
                        <div>
                          <p className="font-medium text-warning">Code is locked!</p>
                          <p className="text-sm text-muted-foreground">
                            Write a detailed explanation of your approach. The code editor will unlock 
                            when your explanation includes complexity reasoning (min {MIN_APPROACH_CHARS} characters).
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-3">
                      <div className="flex items-center gap-2 text-sm">
                        {approachChecks.minChars ? (
                          <Check className="h-4 w-4 text-success" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span>Enough detail</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {approachChecks.complexity ? (
                          <Check className="h-4 w-4 text-success" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span>Complexity included</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {approachChecks.edgeCases ? (
                          <Check className="h-4 w-4 text-success" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span>Edge cases covered</span>
                      </div>
                    </div>

                    <Textarea
                      value={approachText}
                      onChange={(e) => setApproachText(e.target.value)}
                      placeholder="Explain your approach here...&#10;&#10;1. What data structure will you use?&#10;2. What is your algorithm?&#10;3. What is the time and space complexity?&#10;4. What edge cases should you consider?"
                      className="min-h-[200px]"
                    />

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {approachText.length}/{MIN_APPROACH_CHARS} characters minimum
                      </span>
                      <Button
                        variant={canUnlockCode ? "hero" : "secondary"}
                        onClick={handleUnlockCode}
                        disabled={!canUnlockCode}
                      >
                        <Unlock className="h-4 w-4 mr-2" />
                        Unlock Code Editor
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Coding Phase */}
              {currentPhase === "coding" && (
                <Card variant="step-active">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="h-5 w-5 text-primary" />
                      Code Your Solution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border border-border rounded-lg overflow-hidden">
                      <div className="bg-secondary/50 px-4 py-2 border-b border-border flex items-center gap-2">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-destructive/50" />
                          <div className="w-3 h-3 rounded-full bg-warning/50" />
                          <div className="w-3 h-3 rounded-full bg-success/50" />
                        </div>
                        <span className="text-xs text-muted-foreground font-mono ml-2">solution.py</span>
                      </div>
                      <textarea
                        className="w-full h-64 bg-background p-4 font-mono text-sm resize-none focus:outline-none"
                        placeholder="# Write your solution here..."
                        spellCheck={false}
                        value={codeText}
                        onChange={(e) => setCodeText(e.target.value)}
                      />
                    </div>

                    {testMessage ? (
                      <div className={`mt-4 rounded-lg border p-3 text-sm ${testStatus === "pass" ? "bg-success/10 border-success/20 text-success" : "bg-destructive/10 border-destructive/20 text-destructive"}`}>
                        {testMessage}
                      </div>
                    ) : null}

                    <div className="flex justify-end gap-3 mt-4">
                      <Button variant="outline" onClick={handleRunTests}>
                        <FlaskConical className="h-4 w-4 mr-2" />
                        Run Tests
                      </Button>
                      <Button variant="hero" onClick={submitSolution}>
                        Submit Solution
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Review Phase */}
              {currentPhase === "review" && (
                <Card variant="step-completed">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-success" />
                      Interview Complete!
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-success/10 border border-success/20 rounded-lg p-4 text-center">
                        <p className="text-3xl font-bold text-success">{interviewScores.logicClarity}%</p>
                        <p className="text-sm text-muted-foreground">Logic Clarity</p>
                      </div>
                      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-center">
                        <p className="text-3xl font-bold text-primary">{interviewScores.correctness}%</p>
                        <p className="text-sm text-muted-foreground">Correctness</p>
                      </div>
                      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 text-center">
                        <p className="text-3xl font-bold text-accent">{interviewScores.optimization}%</p>
                        <p className="text-sm text-muted-foreground">Optimization</p>
                      </div>
                    </div>

                    <div className="bg-muted/40 border border-border rounded-lg p-4 mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-medium flex items-center gap-2">
                          <ListChecks className="h-4 w-4 text-primary" />
                          Interview Summary
                        </p>
                        <Badge variant="primary">Overall {interviewScores.overall}%</Badge>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <p>Communication: <span className="text-foreground font-medium">{interviewScores.communication}%</span></p>
                        <p>Pacing: <span className="text-foreground font-medium">{interviewScores.pacing}%</span></p>
                        <p>Tests: <span className="text-foreground font-medium">{testStatus === "pass" ? "Passed" : testStatus === "fail" ? "Failed" : "Not run"}</span></p>
                        <p>Problem: <span className="text-foreground font-medium">{activeProblem?.title}</span></p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button variant="outline" onClick={resetInterview} className="flex-1">
                        Try Another Problem
                      </Button>
                      <Link to="/analytics" className="flex-1">
                        <Button variant="hero" className="w-full">
                          View Analytics
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default InterviewMode;
