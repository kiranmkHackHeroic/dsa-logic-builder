import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowLeft,
  Calendar,
  Flame,
  Target,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useAllProgress } from "@/hooks/useProblemProgress";
import { useAuth } from "@/contexts/AuthContext";
import { useUserStreak } from "@/hooks/useUserStreak";
import { getProblemById } from "@/data/problems";
import { COMPANY_PROBLEMS } from "@/data/companyProblems";

const toDateKey = (value?: string | null) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().split("T")[0];
};

const resolveProblemTitle = (problemId: string) => {
  if (problemId.startsWith("company-")) {
    const companyId = Number(problemId.replace("company-", ""));
    const companyProblem = COMPANY_PROBLEMS.find((item) => item.id === companyId);
    return companyProblem?.title || `Problem ${problemId}`;
  }

  const numericId = Number(problemId);
  if (Number.isFinite(numericId)) {
    const internalProblem = getProblemById(numericId);
    if (internalProblem?.title) return internalProblem.title;

    const companyProblem = COMPANY_PROBLEMS.find((item) => item.localProblemId === numericId);
    if (companyProblem?.title) return companyProblem.title;
  }

  return `Problem ${problemId}`;
};

const ProgressHeatmap = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: allProgress, isLoading: progressLoading } = useAllProgress();
  const { streak, isLoading: streakLoading } = useUserStreak();
  const [year, setYear] = useState(new Date().getFullYear());

  const activityData = useMemo(() => {
    const data: Record<string, { count: number; problems: string[] }> = {};
    if (!allProgress) return data;

    allProgress.forEach((item) => {
      const dateKey =
        toDateKey(item.completed_at) ||
        toDateKey(item.updated_at) ||
        toDateKey(item.started_at);

      if (!dateKey) return;

      if (!data[dateKey]) {
        data[dateKey] = { count: 0, problems: [] };
      }

      data[dateKey].count += 1;
      data[dateKey].problems.push(resolveProblemTitle(item.problem_id));
    });

    return data;
  }, [allProgress]);
  
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Generate calendar weeks
  const calendarWeeks = useMemo(() => {
    const weeks: { date: Date; dateStr: string }[][] = [];
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    
    // Start from the first Sunday
    const firstDay = new Date(startDate);
    firstDay.setDate(firstDay.getDate() - firstDay.getDay());
    
    const currentDate = new Date(firstDay);
    let currentWeek: { date: Date; dateStr: string }[] = [];
    
    while (currentDate <= endDate || currentWeek.length > 0) {
      currentWeek.push({
        date: new Date(currentDate),
        dateStr: currentDate.toISOString().split("T")[0],
      });
      
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
      
      if (currentDate > endDate && currentWeek.length === 0) break;
    }
    
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }
    
    return weeks;
  }, [year]);

  // Calculate stats
  const stats = useMemo(() => {
    let totalProblems = 0;
    let activeDays = 0;

    Object.entries(activityData).forEach(([dateStr, activity]) => {
      const activityYear = new Date(dateStr).getFullYear();
      if (activityYear !== year) return;
      if (activity.count <= 0) return;

      totalProblems += activity.count;
      activeDays += 1;
    });

    return {
      totalProblems,
      activeDays,
      currentStreak: streak?.current_streak || 0,
      longestStreak: streak?.longest_streak || 0,
    };
  }, [activityData, streak?.current_streak, streak?.longest_streak, year]);

  if (authLoading || progressLoading || streakLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const getActivityLevel = (count: number): number => {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 4) return 2;
    if (count <= 6) return 3;
    return 4;
  };

  const getActivityColor = (level: number): string => {
    const colors = [
      "bg-muted hover:bg-muted",
      "bg-green-900/50 hover:bg-green-900/70",
      "bg-green-700/60 hover:bg-green-700/80",
      "bg-green-500/70 hover:bg-green-500/90",
      "bg-green-400 hover:bg-green-300",
    ];
    return colors[level];
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold">
                  <span className="gradient-text">Progress Heatmap</span>
                </h1>
                <p className="text-muted-foreground">
                  Track your daily problem-solving activity
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setYear((y) => y - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Select value={year.toString()} onValueChange={(v) => setYear(parseInt(v))}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[2024, 2025, 2026].map((y) => (
                    <SelectItem key={y} value={y.toString()}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setYear((y) => y + 1)}
                disabled={year >= new Date().getFullYear()}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.totalProblems}</p>
                    <p className="text-xs text-muted-foreground">Problems Solved ({year})</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.activeDays}</p>
                    <p className="text-xs text-muted-foreground">Active Days ({year})</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <Flame className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.currentStreak}</p>
                    <p className="text-xs text-muted-foreground">Current Streak</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.longestStreak}</p>
                    <p className="text-xs text-muted-foreground">Longest Streak</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Heatmap */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {year} Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Month Labels */}
              <div className="flex mb-2 ml-10">
                {months.map((month, i) => (
                  <div key={month} className="flex-1 text-xs text-muted-foreground">
                    {month}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="flex">
                {/* Day Labels */}
                <div className="flex flex-col gap-[3px] mr-2 text-xs text-muted-foreground">
                  {days.map((day, i) => (
                    <div key={day} className="h-[13px] flex items-center">
                      {i % 2 === 1 ? day : ""}
                    </div>
                  ))}
                </div>

                {/* Weeks */}
                <div className="flex gap-[3px] overflow-x-auto pb-2">
                  {calendarWeeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-[3px]">
                      {week.map(({ date, dateStr }) => {
                        const activity = activityData[dateStr] || { count: 0, problems: [] };
                        const level = getActivityLevel(activity.count);
                        const isCurrentYear = date.getFullYear() === year;
                        
                        return (
                          <Tooltip key={dateStr}>
                            <TooltipTrigger asChild>
                              <div
                                className={`w-[13px] h-[13px] rounded-sm cursor-pointer transition-colors ${
                                  isCurrentYear
                                    ? getActivityColor(level)
                                    : "bg-transparent"
                                }`}
                              />
                            </TooltipTrigger>
                            {isCurrentYear && (
                              <TooltipContent>
                                <div className="text-sm">
                                  <p className="font-semibold">
                                    {activity.count} problem{activity.count !== 1 ? "s" : ""} solved
                                  </p>
                                  <p className="text-muted-foreground">
                                    {formatDate(date)}
                                  </p>
                                  {activity.problems.length > 0 && (
                                    <div className="mt-1 text-xs">
                                      {activity.problems.slice(0, 3).map((p, i) => (
                                        <p key={i}>• {p}</p>
                                      ))}
                                      {activity.problems.length > 3 && (
                                        <p>...and {activity.problems.length - 3} more</p>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </TooltipContent>
                            )}
                          </Tooltip>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-end gap-2 mt-4 text-sm text-muted-foreground">
                <span>Less</span>
                {[0, 1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`w-[13px] h-[13px] rounded-sm ${getActivityColor(level)}`}
                  />
                ))}
                <span>More</span>
              </div>

              {!user && (
                <p className="text-sm text-muted-foreground mt-4">
                  Sign in to view your personal heatmap activity.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Monthly Breakdown */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Monthly Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {months.map((month, index) => {
                  const monthStart = new Date(year, index, 1);
                  const monthEnd = new Date(year, index + 1, 0);
                  let monthTotal = 0;
                  
                  for (let d = new Date(monthStart); d <= monthEnd; d.setDate(d.getDate() + 1)) {
                    const dateStr = d.toISOString().split("T")[0];
                    monthTotal += activityData[dateStr]?.count || 0;
                  }
                  
                  return (
                    <div key={month} className="text-center p-3 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground">{month}</p>
                      <p className="text-xl font-bold">{monthTotal}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ProgressHeatmap;
