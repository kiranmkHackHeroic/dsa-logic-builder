import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Trophy,
  Target,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  Medal,
  Flame,
  ChevronRight,
} from "lucide-react";
import { problems } from "@/data/problems";

interface ContestProblem {
  id: number;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  points: number;
  timeLimit: number; // in minutes
  solved: boolean;
}

interface ContestResult {
  totalScore: number;
  problemsSolved: number;
  totalProblems: number;
  timeSpent: number;
  ranking: string;
}

const contestProblems: ContestProblem[] = [
  { id: 1, title: "Two Sum", difficulty: "easy", points: 100, timeLimit: 15, solved: false },
  { id: 2, title: "Container With Most Water", difficulty: "medium", points: 200, timeLimit: 25, solved: false },
  { id: 3, title: "Longest Substring Without Repeating Characters", difficulty: "medium", points: 200, timeLimit: 25, solved: false },
  { id: 4, title: "Median of Two Sorted Arrays", difficulty: "hard", points: 300, timeLimit: 35, solved: false },
];

const ContestMode = () => {
  const [contestState, setContestState] = useState<"waiting" | "active" | "finished">("waiting");
  const [timeRemaining, setTimeRemaining] = useState(60 * 60); // 60 minutes in seconds
  const [isPaused, setIsPaused] = useState(false);
  const [currentProblems, setCurrentProblems] = useState<ContestProblem[]>(contestProblems);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<ContestProblem | null>(null);

  // Timer logic
  useEffect(() => {
    if (contestState !== "active" || isPaused) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setContestState("finished");
          setShowResults(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [contestState, isPaused]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startContest = () => {
    setContestState("active");
    setTimeRemaining(60 * 60);
    setCurrentProblems(contestProblems.map((p) => ({ ...p, solved: false })));
    setScore(0);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const resetContest = () => {
    setContestState("waiting");
    setTimeRemaining(60 * 60);
    setCurrentProblems(contestProblems.map((p) => ({ ...p, solved: false })));
    setScore(0);
    setShowResults(false);
    setIsPaused(false);
  };

  const solveProblem = (problemId: number) => {
    setCurrentProblems((prev) =>
      prev.map((p) => {
        if (p.id === problemId && !p.solved) {
          setScore((s) => s + p.points);
          return { ...p, solved: true };
        }
        return p;
      })
    );
    setSelectedProblem(null);
  };

  const endContest = () => {
    setContestState("finished");
    setShowResults(true);
  };

  const solvedCount = currentProblems.filter((p) => p.solved).length;
  const totalPoints = currentProblems.reduce((sum, p) => sum + p.points, 0);
  const progressPercent = (score / totalPoints) * 100;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-500 bg-green-500/10";
      case "medium":
        return "text-yellow-500 bg-yellow-500/10";
      case "hard":
        return "text-red-500 bg-red-500/10";
      default:
        return "";
    }
  };

  const getTimeColor = () => {
    if (timeRemaining > 30 * 60) return "text-green-500";
    if (timeRemaining > 10 * 60) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">
                <span className="gradient-text">Contest Mode</span>
              </h1>
              <p className="text-muted-foreground">
                Test your skills under time pressure
              </p>
            </div>
          </div>

          {/* Waiting State */}
          {contestState === "waiting" && (
            <Card className="mb-8">
              <CardContent className="py-12 text-center">
                <Trophy className="h-16 w-16 mx-auto mb-6 text-primary" />
                <h2 className="text-2xl font-bold mb-4">Weekly Coding Contest</h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Solve 4 problems in 60 minutes. Each problem has points based on difficulty.
                  Complete as many as you can to earn your ranking!
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-2xl mx-auto">
                  <div className="p-4 rounded-lg bg-muted">
                    <Timer className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">60</p>
                    <p className="text-xs text-muted-foreground">Minutes</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted">
                    <Target className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">4</p>
                    <p className="text-xs text-muted-foreground">Problems</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted">
                    <Zap className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">800</p>
                    <p className="text-xs text-muted-foreground">Max Points</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted">
                    <Medal className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">Top 10%</p>
                    <p className="text-xs text-muted-foreground">To Rank Up</p>
                  </div>
                </div>

                <Button size="lg" className="gap-2" onClick={startContest}>
                  <Play className="h-5 w-5" />
                  Start Contest
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Active Contest */}
          {contestState === "active" && (
            <>
              {/* Timer & Score Bar */}
              <Card className="mb-6 border-primary/50">
                <CardContent className="py-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Clock className={`h-6 w-6 ${getTimeColor()}`} />
                        <span className={`text-3xl font-mono font-bold ${getTimeColor()}`}>
                          {formatTime(timeRemaining)}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={togglePause}>
                          {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                        </Button>
                        <Button variant="outline" size="sm" onClick={resetContest}>
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-sm text-muted-foreground">Score</p>
                        <p className="text-2xl font-bold text-primary">{score} / {totalPoints}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Solved</p>
                        <p className="text-2xl font-bold">{solvedCount} / {currentProblems.length}</p>
                      </div>
                      <Button variant="destructive" size="sm" onClick={endContest}>
                        End Contest
                      </Button>
                    </div>
                  </div>
                  <Progress value={progressPercent} className="mt-4 h-2" />
                </CardContent>
              </Card>

              {/* Problem List */}
              <div className="grid gap-4">
                {currentProblems.map((problem, index) => (
                  <Card
                    key={problem.id}
                    className={`cursor-pointer transition-all ${
                      problem.solved
                        ? "border-green-500/50 bg-green-500/5"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => !problem.solved && setSelectedProblem(problem)}
                  >
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              problem.solved
                                ? "bg-green-500/20 text-green-500"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {problem.solved ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : (
                              <span className="font-bold">{index + 1}</span>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold">{problem.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge
                                variant="outline"
                                className={getDifficultyColor(problem.difficulty)}
                              >
                                {problem.difficulty}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                <Clock className="h-3 w-3 inline mr-1" />
                                {problem.timeLimit} min
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary">{problem.points}</p>
                            <p className="text-xs text-muted-foreground">points</p>
                          </div>
                          {!problem.solved && <ChevronRight className="h-5 w-5 text-muted-foreground" />}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* Problem Dialog */}
          <Dialog open={!!selectedProblem} onOpenChange={() => setSelectedProblem(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selectedProblem?.title}
                  <Badge className={getDifficultyColor(selectedProblem?.difficulty || "easy")}>
                    {selectedProblem?.difficulty}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  Solve this problem to earn {selectedProblem?.points} points
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-muted-foreground mb-4">
                  This is where the full problem description would appear. In a real implementation,
                  you would have a code editor and test cases here.
                </p>
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={() => solveProblem(selectedProblem!.id)}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Solved (Demo)
                  </Button>
                  <Link to={`/problems/${selectedProblem?.id}`}>
                    <Button variant="outline">
                      Open Full Problem
                    </Button>
                  </Link>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Results Dialog */}
          <Dialog open={showResults} onOpenChange={setShowResults}>
            <DialogContent className="max-w-md text-center">
              <DialogHeader>
                <DialogTitle className="text-2xl">Contest Complete! 🎉</DialogTitle>
              </DialogHeader>
              <div className="py-6">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <Trophy className="h-12 w-12 text-primary" />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-lg bg-muted">
                    <p className="text-3xl font-bold text-primary">{score}</p>
                    <p className="text-sm text-muted-foreground">Total Score</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted">
                    <p className="text-3xl font-bold">{solvedCount}/{currentProblems.length}</p>
                    <p className="text-sm text-muted-foreground">Problems Solved</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted">
                    <p className="text-3xl font-bold">{formatTime(3600 - timeRemaining)}</p>
                    <p className="text-sm text-muted-foreground">Time Spent</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted">
                    <p className="text-3xl font-bold">
                      {score >= 600 ? "Gold" : score >= 400 ? "Silver" : score >= 200 ? "Bronze" : "Participant"}
                    </p>
                    <p className="text-sm text-muted-foreground">Ranking</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1" onClick={resetContest}>
                    Try Again
                  </Button>
                  <Link to="/dashboard" className="flex-1">
                    <Button variant="outline" className="w-full">
                      Back to Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
};

export default ContestMode;
