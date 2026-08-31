import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useUserStreak } from "@/hooks/useUserStreak";
import { useAllProgress } from "@/hooks/useProblemProgress";
import { getProblemById } from "@/data/problems";
import { COMPANY_PROBLEMS } from "@/data/companyProblems";
import { 
  Brain, 
  Target, 
  Clock, 
  TrendingUp, 
  BarChart3,
  PieChart,
  AlertTriangle,
  CheckCircle,
  Zap,
  Loader2,
  ArrowRight,
  CalendarDays,
  Trophy,
  Lightbulb
} from "lucide-react";

const Analytics = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { streak, isLoading: streakLoading } = useUserStreak();
  const { data: allProgress, isLoading: progressLoading } = useAllProgress();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  if (authLoading || streakLoading || progressLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Loading your analytics...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const completedProblems = allProgress?.filter(p => p.status === "completed") || [];
  const inProgressProblems = allProgress?.filter(p => p.status === "in_progress") || [];
  const attemptedCount = allProgress?.length || 0;
  const solvedCount = completedProblems.length;
  
  const logicScore = completedProblems.length > 0
    ? Math.round(completedProblems.reduce((sum, p) => sum + (p.logic_score || 70), 0) / completedProblems.length)
    : 0;

  const avgThinkingTime = completedProblems.length > 0
    ? Math.round(completedProblems.reduce((sum, p) => sum + (p.time_spent_thinking || 0), 0) / completedProblems.length)
    : 0;

  const avgCodingTime = completedProblems.length > 0
    ? Math.round(completedProblems.reduce((sum, p) => sum + (p.time_spent_coding || 0), 0) / completedProblems.length)
    : 0;

  const resolvePattern = (problemId: string) => {
    const numericId = Number(problemId);

    if (problemId.startsWith("company-")) {
      const companyId = Number(problemId.replace("company-", ""));
      const companyProblem = COMPANY_PROBLEMS.find((item) => item.id === companyId);
      return companyProblem?.concept || "General";
    }

    if (Number.isFinite(numericId)) {
      const internalProblem = getProblemById(numericId);
      if (internalProblem?.pattern) return internalProblem.pattern;

      const companyProblem = COMPANY_PROBLEMS.find((item) => item.localProblemId === numericId);
      if (companyProblem?.concept) return companyProblem.concept;
    }

    return "General";
  };

  const patternAttempts = allProgress?.reduce<Record<string, number>>((acc, item) => {
    const key = resolvePattern(item.problem_id);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {}) || {};

  const patternCompletions = completedProblems.reduce<Record<string, number>>((acc, item) => {
    const key = resolvePattern(item.problem_id);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const colorCycle: Array<"primary" | "accent" | "success" | "warning"> = [
    "primary",
    "accent",
    "success",
    "warning",
  ];

  const patternData = Object.keys(patternAttempts)
    .map((name, index) => {
      const attempts = patternAttempts[name] || 0;
      const solved = patternCompletions[name] || 0;
      const mastery = attempts > 0 ? Math.round((solved / attempts) * 100) : 0;
      return {
        name,
        mastery,
        problems: attempts,
        color: colorCycle[index % colorCycle.length],
      };
    })
    .sort((a, b) => b.problems - a.problems)
    .slice(0, 6);

  const weakAreas = patternData
    .filter((item) => item.problems > 0)
    .sort((a, b) => a.mastery - b.mastery)
    .slice(0, 3)
    .map((item) => ({
      area: item.name,
      score: item.mastery,
      suggestion:
        item.mastery < 40
          ? "Solve 3-5 more guided problems in this pattern."
          : item.mastery < 70
            ? "Focus on edge cases and complexity trade-offs."
            : "Keep consistency with timed practice rounds.",
    }));

  const totalTime = avgThinkingTime + avgCodingTime;
  const thinkingPercentage = totalTime > 0 ? Math.round((avgThinkingTime / totalTime) * 100) : 50;
  const completionRate = attemptedCount > 0 ? Math.round((solvedCount / attemptedCount) * 100) : 0;
  const totalMinutesTracked = (allProgress || []).reduce(
    (sum, item) => sum + (item.time_spent_thinking || 0) + (item.time_spent_coding || 0),
    0
  );
  const totalHoursTracked = (totalMinutesTracked / 60).toFixed(1);
  const hasAnyProgress = attemptedCount > 0;
  const strongestPattern = patternData.length > 0 ? [...patternData].sort((a, b) => b.mastery - a.mastery)[0] : null;
  const weakestPattern = weakAreas[0] || null;
  const lastActivityLabel = allProgress?.[0]?.updated_at
    ? new Date(allProgress[0].updated_at).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "No activity yet";

  const reveal = (delayMs: number) => ({
    className: "animate-slide-up opacity-0",
    style: { animationDelay: `${delayMs}ms` } as const,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12 px-3 sm:px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <Badge variant="primary" className="mb-4">Progress Analytics</Badge>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Your Learning Journey</h1>
              <p className="text-muted-foreground">
                Clear insights from your real practice data with next best actions.
              </p>
            </div>
            <div className="inline-flex w-fit flex-wrap items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs sm:text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4 text-primary" />
              Last activity: <span className="font-medium text-foreground">{lastActivityLabel}</span>
            </div>
          </div>

          <Card variant="gradient" className={`mb-8 ${reveal(40).className}`} style={reveal(40).style}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                <Trophy className="h-6 w-6 text-warning" />
                Performance Snapshot
              </CardTitle>
              <CardDescription>
                A concise view of your consistency, speed, and problem-solving quality.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-border bg-card/80 p-4">
                  <p className="text-sm text-muted-foreground mb-1">Completion Rate</p>
                  <p className="text-2xl font-bold">{completionRate}%</p>
                  <p className="text-xs text-muted-foreground mt-1">{solvedCount} solved out of {attemptedCount} attempted</p>
                </div>
                <div className="rounded-lg border border-border bg-card/80 p-4">
                  <p className="text-sm text-muted-foreground mb-1">Tracked Practice Time</p>
                  <p className="text-2xl font-bold">{totalHoursTracked}h</p>
                  <p className="text-xs text-muted-foreground mt-1">Across thinking + coding sessions</p>
                </div>
                <div className="rounded-lg border border-border bg-card/80 p-4">
                  <p className="text-sm text-muted-foreground mb-1">Current Focus</p>
                  <p className="text-xl sm:text-2xl font-bold break-words">{strongestPattern?.name || "Start solving"}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {strongestPattern ? `${strongestPattern.mastery}% mastery in top pattern` : "Solve your first problem to unlock insights"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {!hasAnyProgress && (
            <Card
              variant="elevated"
              className={`mb-8 border-primary/20 bg-primary/5 ${reveal(80).className}`}
              style={reveal(80).style}
            >
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">No progress yet</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Start one guided problem to unlock pattern mastery, time insights, and improvement recommendations.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <Button className="w-full sm:w-auto" variant="hero" onClick={() => navigate("/problems")}>Start Solving</Button>
                    <Button className="w-full sm:w-auto" variant="outline" onClick={() => navigate("/interview")}>Try Interview Mode</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Top Stats */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8 ${reveal(120).className}`}
            style={reveal(120).style}
          >
            <Card variant="feature">
              <CardContent className="pt-6 text-center">
                <Target className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">{attemptedCount}</p>
                <p className="text-xs text-muted-foreground">Problems Attempted</p>
              </CardContent>
            </Card>
            <Card variant="feature">
              <CardContent className="pt-6 text-center">
                <CheckCircle className="h-6 w-6 mx-auto mb-2 text-success" />
                <p className="text-2xl font-bold">{solvedCount}</p>
                <p className="text-xs text-muted-foreground">Problems Solved</p>
              </CardContent>
            </Card>
            <Card variant="feature">
              <CardContent className="pt-6 text-center">
                <Brain className="h-6 w-6 mx-auto mb-2 text-accent" />
                <p className="text-2xl font-bold">{logicScore}%</p>
                <p className="text-xs text-muted-foreground">Logic Accuracy</p>
              </CardContent>
            </Card>
            <Card variant="feature">
              <CardContent className="pt-6 text-center">
                <Clock className="h-6 w-6 mx-auto mb-2 text-warning" />
                <p className="text-2xl font-bold">{avgThinkingTime}m</p>
                <p className="text-xs text-muted-foreground">Avg. Thinking Time</p>
              </CardContent>
            </Card>
            <Card variant="feature">
              <CardContent className="pt-6 text-center">
                <Zap className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">{avgCodingTime}m</p>
                <p className="text-xs text-muted-foreground">Avg. Coding Time</p>
              </CardContent>
            </Card>
            <Card variant="feature">
              <CardContent className="pt-6 text-center">
                <TrendingUp className="h-6 w-6 mx-auto mb-2 text-success" />
                <p className="text-2xl font-bold">{streak?.longest_streak || 0}</p>
                <p className="text-xs text-muted-foreground">Longest Streak</p>
              </CardContent>
            </Card>
          </div>

          <div className={`grid lg:grid-cols-3 gap-6 ${reveal(180).className}`} style={reveal(180).style}>
            {/* Pattern Mastery */}
            <Card variant="elevated" className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Pattern Mastery
                </CardTitle>
              </CardHeader>
              <CardContent>
                {patternData.length > 0 ? (
                  <div className="space-y-4">
                    {patternData.map((pattern) => (
                      <div key={pattern.name}>
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-medium">{pattern.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              {pattern.problems} problems
                            </Badge>
                          </div>
                          <span className="text-sm font-medium shrink-0">{pattern.mastery}%</span>
                        </div>
                        <Progress 
                          value={pattern.mastery} 
                          variant={pattern.color as "primary" | "accent" | "success" | "warning"}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No solved or attempted patterns yet. Start a problem to see pattern mastery.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Time Distribution */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-accent" />
                  Time Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative h-48 flex items-center justify-center mb-6">
                  <div className="relative w-40 h-40">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="80"
                        cy="80"
                        r="60"
                        fill="none"
                        stroke="hsl(var(--muted))"
                        strokeWidth="20"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="60"
                        fill="none"
                        stroke="hsl(var(--primary))"
                        strokeWidth="20"
                        strokeDasharray={`${(thinkingPercentage / 100) * 377} 377`}
                        className="transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold">{thinkingPercentage}%</span>
                      <span className="text-xs text-muted-foreground">Thinking</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-center gap-3 sm:gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span>Thinking ({avgThinkingTime}m avg)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-muted" />
                    <span>Coding ({avgCodingTime}m avg)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weak Areas */}
            <Card variant="elevated" className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  Areas to Improve
                </CardTitle>
              </CardHeader>
              <CardContent>
                {weakAreas.length > 0 ? (
                  <div className="space-y-4">
                    {weakAreas.map((area) => (
                      <div key={area.area} className="bg-warning/5 border border-warning/20 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{area.area}</span>
                          <Badge variant="warning">{area.score}%</Badge>
                        </div>
                        <Progress value={area.score} variant="warning" size="sm" className="mb-2" />
                        <p className="text-sm text-muted-foreground">{area.suggestion}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-success/30 bg-success/5 p-4">
                    <p className="text-sm font-medium text-success">No major weak areas detected yet.</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Keep solving consistently to maintain pattern coverage and reveal deeper optimization opportunities.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-success" />
                  Current Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Current Streak</span>
                    <Badge variant="success">{streak?.current_streak || 0} days</Badge>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Longest Streak</span>
                    <Badge variant="primary">{streak?.longest_streak || 0} days</Badge>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Problems In Progress</span>
                    <Badge variant="warning">{inProgressProblems.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-muted-foreground">Completion Rate</span>
                    <Badge variant="accent">{completionRate}%</Badge>
                  </div>
                  <div className="pt-2 grid gap-2">
                    <Button className="w-full" variant="hero-outline" size="sm" onClick={() => navigate("/problems")}>
                      Continue Practice
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button className="w-full" variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
                      <Lightbulb className="h-4 w-4" />
                      Review Dashboard Goals
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {weakestPattern && (
              <Card variant="elevated" className="lg:col-span-3 border-warning/30 bg-warning/5">
                <CardContent className="pt-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Recommended next focus</p>
                    <p className="text-lg font-semibold">Improve {weakestPattern.area} ({weakestPattern.score}%)</p>
                    <p className="text-sm text-muted-foreground">{weakestPattern.suggestion}</p>
                  </div>
                  <Button className="w-full md:w-auto" variant="warning" onClick={() => navigate("/problems")}>Practice This Pattern</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Analytics;
