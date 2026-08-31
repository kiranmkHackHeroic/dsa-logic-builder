import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useUserStreak } from "@/hooks/useUserStreak";
import { useAllProgress } from "@/hooks/useProblemProgress";
import { useSEO, pageSEO } from "@/hooks/useSEO";
import { DashboardSkeleton } from "@/components/ui/skeleton-loaders";
import { getProblemById } from "@/data/problems";
import { COMPANY_PROBLEMS } from "@/data/companyProblems";
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Play,
  BookOpen,
  ArrowRight,
  Flame,
} from "lucide-react";

const toDate = (value?: string | null) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const resolveProblemMeta = (problemId: string) => {
  if (problemId.startsWith("company-")) {
    const companyId = Number(problemId.replace("company-", ""));
    const companyProblem = COMPANY_PROBLEMS.find((item) => item.id === companyId);
    return {
      routeId: problemId,
      title: companyProblem?.title || `Problem ${problemId}`,
      difficulty: companyProblem?.difficulty || "medium",
      pattern: companyProblem?.concept || "General",
    };
  }

  const numericId = Number(problemId);
  if (Number.isFinite(numericId)) {
    const internalProblem = getProblemById(numericId);
    if (internalProblem) {
      return {
        routeId: String(numericId),
        title: internalProblem.title,
        difficulty: internalProblem.difficulty,
        pattern: internalProblem.pattern,
      };
    }

    const companyProblem = COMPANY_PROBLEMS.find((item) => item.localProblemId === numericId);
    if (companyProblem) {
      return {
        routeId: String(numericId),
        title: companyProblem.title,
        difficulty: companyProblem.difficulty,
        pattern: companyProblem.concept,
      };
    }
  }

  return {
    routeId: problemId,
    title: `Problem ${problemId}`,
    difficulty: "medium",
    pattern: "General",
  };
};

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  const { streak, isLoading: streakLoading } = useUserStreak();
  const { data: allProgress, isLoading: progressLoading } = useAllProgress();

  // SEO
  useSEO(pageSEO.dashboard);

  // Only block on auth loading. Data sections render with fallbacks to avoid indefinite buffering.
  if (authLoading) {
    return (
      <>
        <Navbar />
        <DashboardSkeleton />
      </>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-12 px-4">
          <div className="container mx-auto max-w-xl text-center">
            <h1 className="text-2xl font-bold mb-2">Session Required</h1>
            <p className="text-muted-foreground mb-6">
              Please sign in again to view your dashboard.
            </p>
            <Link to="/auth">
              <Button variant="hero">Go to Login</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isDataLoading = profileLoading || streakLoading || progressLoading;

  const completedProblems = allProgress?.filter(p => p.status === "completed") || [];
  const inProgressProblems = allProgress?.filter(p => p.status === "in_progress") || [];
  
  const logicScore = completedProblems.length > 0
    ? Math.round(completedProblems.reduce((sum, p) => sum + (p.logic_score || 70), 0) / completedProblems.length)
    : 0;

  const recentProblems = (allProgress || [])
    .slice(0, 6)
    .map((item) => {
      const meta = resolveProblemMeta(item.problem_id);
      return {
        id: meta.routeId,
        title: meta.title,
        difficulty: meta.difficulty,
        status: item.status,
        pattern: meta.pattern,
      };
    });

  const patternAttempts = (allProgress || []).reduce<Record<string, number>>((acc, item) => {
    const pattern = resolveProblemMeta(item.problem_id).pattern;
    acc[pattern] = (acc[pattern] || 0) + 1;
    return acc;
  }, {});

  const patternSolved = completedProblems.reduce<Record<string, number>>((acc, item) => {
    const pattern = resolveProblemMeta(item.problem_id).pattern;
    acc[pattern] = (acc[pattern] || 0) + 1;
    return acc;
  }, {});

  const patternColors: Array<"primary" | "accent" | "warning"> = ["primary", "accent", "warning"];
  const suggestedPatterns = Object.entries(patternAttempts)
    .map(([name, attempts], index) => {
      const solved = patternSolved[name] || 0;
      return {
        name,
        progress: attempts > 0 ? Math.round((solved / attempts) * 100) : 0,
        color: patternColors[index % patternColors.length],
      };
    })
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 3);

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weeklySolved = completedProblems.filter((item) => {
    const completedDate = toDate(item.completed_at) || toDate(item.updated_at);
    return completedDate ? completedDate >= weekAgo : false;
  }).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, <span className="gradient-text">{profile?.display_name || user.email?.split("@")[0]}</span>
            </h1>
            <p className="text-muted-foreground">Continue building your problem-solving skills</p>
            {isDataLoading && (
              <p className="text-xs text-muted-foreground mt-1">Syncing your latest progress...</p>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card variant="feature">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                    <Flame className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{streak?.current_streak || 0}</p>
                    <p className="text-xs text-muted-foreground">Day Streak</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="feature">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{streak?.total_problems_solved || 0}</p>
                    <p className="text-xs text-muted-foreground">Problems Solved</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="feature">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Brain className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{logicScore}%</p>
                    <p className="text-xs text-muted-foreground">Logic Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="feature">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Target className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{streak?.longest_streak || 0}</p>
                    <p className="text-xs text-muted-foreground">Longest Streak</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Continue Learning */}
            <div className="lg:col-span-2 space-y-6">
              <Card variant="elevated">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Play className="h-5 w-5 text-primary" />
                      Continue Learning
                    </CardTitle>
                    <Link to="/problems">
                      <Button variant="ghost" size="sm">
                        View All <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {recentProblems.length > 0 ? (
                    <div className="space-y-3">
                      {recentProblems.map((problem) => (
                        <Link key={problem.id} to={`/problems/${problem.id}`}>
                          <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors group">
                            <div className="flex items-center gap-4">
                              <div className={`
                                w-8 h-8 rounded-lg flex items-center justify-center
                                ${problem.status === "completed" ? "bg-success/10" : problem.status === "in_progress" ? "bg-warning/10" : "bg-muted"}
                              `}>
                                {problem.status === "completed" ? (
                                  <CheckCircle className="h-4 w-4 text-success" />
                                ) : problem.status === "in_progress" ? (
                                  <Clock className="h-4 w-4 text-warning" />
                                ) : (
                                  <Target className="h-4 w-4 text-muted-foreground" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium group-hover:text-primary transition-colors">{problem.title}</p>
                                <p className="text-xs text-muted-foreground">{problem.pattern}</p>
                              </div>
                            </div>
                            <Badge variant={problem.difficulty as "easy" | "medium" | "hard"}>
                              {problem.difficulty}
                            </Badge>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No progress yet. Start your first problem to build your learning feed.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="grid md:grid-cols-2 gap-4">
                <Link to="/problems/1">
                  <Card variant="interactive" className="group h-full">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Brain className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">Daily Challenge</h3>
                          <p className="text-sm text-muted-foreground">Solve today's problem</p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link to="/interview">
                  <Card variant="interactive" className="group h-full">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center group-hover:bg-warning/20 transition-colors">
                          <Clock className="h-6 w-6 text-warning" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">Interview Mode</h3>
                          <p className="text-sm text-muted-foreground">Practice under pressure</p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-warning transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Pattern Progress */}
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BookOpen className="h-5 w-5 text-accent" />
                    Pattern Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {suggestedPatterns.length > 0 ? (
                    suggestedPatterns.map((pattern) => (
                      <div key={pattern.name}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{pattern.name}</span>
                          <span className="text-muted-foreground">{pattern.progress}%</span>
                        </div>
                        <Progress 
                          value={pattern.progress} 
                          variant={pattern.color as "primary" | "accent" | "warning"}
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Pattern insights will appear after your first solved problem.
                    </p>
                  )}
                  <Link to="/patterns">
                    <Button variant="outline" className="w-full mt-4">
                      View All Patterns
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Weekly Goal */}
              <Card variant="gradient">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Weekly Goal</span>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>5 problems this week</span>
                      <span className="text-primary font-medium">{Math.min(weeklySolved, 5)}/5</span>
                    </div>
                      <Progress value={Math.min((weeklySolved / 5) * 100, 100)} variant="accent" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                      {weeklySolved >= 5 
                      ? "Goal achieved! 🎉" 
                        : `${5 - weeklySolved} more to reach your goal!`}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
