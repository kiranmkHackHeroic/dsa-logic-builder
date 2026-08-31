import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Zap,
  Clock,
  Trophy,
  ChevronRight,
  Flame,
  Target,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLocalStorage } from "@/hooks/useUtils";
import { useAuth } from "@/contexts/AuthContext";

interface DailyChallengeData {
  date: string;
  problemId: number;
  problemTitle: string;
  difficulty: "easy" | "medium" | "hard";
  pattern: string;
  completed: boolean;
  timeSpent?: number;
}

// Mock daily challenges - in real app, fetch from backend
const dailyChallenges = [
  { id: 1, title: "Two Sum", difficulty: "easy" as const, pattern: "Hash Map" },
  { id: 2, title: "Valid Parentheses", difficulty: "easy" as const, pattern: "Stack" },
  { id: 3, title: "Merge Intervals", difficulty: "medium" as const, pattern: "Intervals" },
  { id: 4, title: "LRU Cache", difficulty: "medium" as const, pattern: "Design" },
  { id: 5, title: "Trapping Rain Water", difficulty: "hard" as const, pattern: "Two Pointers" },
  { id: 6, title: "Word Break", difficulty: "medium" as const, pattern: "Dynamic Programming" },
  { id: 7, title: "Maximum Subarray", difficulty: "medium" as const, pattern: "Kadane's Algorithm" },
];

const getTodayChallenge = () => {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  return dailyChallenges[dayOfYear % dailyChallenges.length];
};

const DailyChallenge = () => {
  const { user } = useAuth();
  const challengeHistoryStorageKey = `daily-challenge-history:${user?.id ?? "guest"}`;
  const challengeStreakStorageKey = `daily-challenge-streak:${user?.id ?? "guest"}`;

  const [timeRemaining, setTimeRemaining] = useState("");
  const [challengeHistory, setChallengeHistory] = useLocalStorage<
    Record<string, DailyChallengeData>
  >(challengeHistoryStorageKey, {});
  const [streak, setStreak] = useLocalStorage(challengeStreakStorageKey, 0);

  const today = new Date().toISOString().split("T")[0];
  const todayChallenge = getTodayChallenge();
  const isCompleted = challengeHistory[today]?.completed;

  // Calculate time remaining until midnight
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const completeChallenge = () => {
    setChallengeHistory((prev) => ({
      ...prev,
      [today]: {
        date: today,
        problemId: todayChallenge.id,
        problemTitle: todayChallenge.title,
        difficulty: todayChallenge.difficulty,
        pattern: todayChallenge.pattern,
        completed: true,
        timeSpent: Math.floor(Math.random() * 30) + 10, // Mock time
      },
    }));

    // Update streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toISOString().split("T")[0];

    if (challengeHistory[yesterdayKey]?.completed) {
      setStreak((prev) => prev + 1);
    } else {
      setStreak(1);
    }
  };

  // Calculate stats
  const completedCount = Object.values(challengeHistory).filter(
    (c) => c.completed
  ).length;
  const currentWeekCompleted = Array.from({ length: 7 })
    .map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split("T")[0];
    })
    .filter((d) => challengeHistory[d]?.completed).length;

  return (
    <Card className="overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500" />
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            Daily Challenge
          </CardTitle>
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium">{streak} day streak</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timer */}
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span className="text-sm">New challenge in {timeRemaining}</span>
        </div>

        {/* Challenge Card */}
        <div
          className={`p-4 rounded-lg border-2 ${
            isCompleted
              ? "border-success/50 bg-success/5"
              : "border-primary/50 bg-primary/5"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-lg">{todayChallenge.title}</h3>
            <Badge variant={todayChallenge.difficulty}>
              {todayChallenge.difficulty}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Target className="h-4 w-4" />
            {todayChallenge.pattern}
          </div>

          {isCompleted ? (
            <div className="flex items-center gap-2 text-success">
              <Trophy className="h-5 w-5" />
              <span className="font-medium">Completed!</span>
            </div>
          ) : (
            <Link to={`/problems/${todayChallenge.id}`}>
              <Button className="w-full" onClick={completeChallenge}>
                Start Challenge
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          )}
        </div>

        {/* Weekly Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">This Week</span>
            <span className="text-sm font-medium">{currentWeekCompleted}/7</span>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 7 }).map((_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - (6 - i));
              const dateKey = date.toISOString().split("T")[0];
              const isComplete = challengeHistory[dateKey]?.completed;
              const isToday = dateKey === today;

              return (
                <div
                  key={i}
                  className={`flex-1 h-3 rounded-full ${
                    isComplete
                      ? "bg-success"
                      : isToday
                      ? "bg-primary/30"
                      : "bg-secondary"
                  }`}
                  title={date.toLocaleDateString("en-US", { weekday: "short" })}
                />
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">{completedCount}</p>
            <p className="text-xs text-muted-foreground">Total Completed</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-500">{streak}</p>
            <p className="text-xs text-muted-foreground">Current Streak</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-success">
              {currentWeekCompleted}
            </p>
            <p className="text-xs text-muted-foreground">This Week</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyChallenge;
