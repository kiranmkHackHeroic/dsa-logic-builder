import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  Clock,
  Target,
  CheckCircle,
  Play,
  Search,
  Filter,
  ChevronRight,
} from "lucide-react";
import { studyPlans, StudyPlan } from "@/data/studyPlans";
import { useLocalStorage } from "@/hooks/useUtils";
import FeatureLayout from "@/components/layout/FeatureLayout";
import { useAuth } from "@/contexts/AuthContext";

interface StudyPlanProgress {
  planId: string;
  startedAt: string;
  completedProblems: number[];
  lastActivityAt: string;
}

const StudyPlanCard = ({
  plan,
  progress,
  onStart,
}: {
  plan: StudyPlan;
  progress?: StudyPlanProgress;
  onStart: () => void;
}) => {
  const completedCount = progress?.completedProblems.length ?? 0;
  const totalCount = plan.problemIds.length;
  const progressPercent = (completedCount / totalCount) * 100;
  const isStarted = !!progress;
  const isCompleted = completedCount === totalCount;

  return (
    <Card className="group hover:border-primary/50 transition-all overflow-hidden">
      <div className={`h-2 bg-gradient-to-r ${plan.color}`} />
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{plan.icon}</span>
            <div>
              <CardTitle className="text-lg">{plan.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant={
                    plan.difficulty === "beginner"
                      ? "success"
                      : plan.difficulty === "intermediate"
                      ? "warning"
                      : "destructive"
                  }
                >
                  {plan.difficulty}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {plan.estimatedDays} days
                </span>
              </div>
            </div>
          </div>
          {isCompleted && (
            <Badge variant="success" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Completed
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {plan.description}
        </p>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Target className="h-4 w-4" />
            {totalCount} problems
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            {plan.estimatedDays} days
          </div>
        </div>

        {isStarted && (
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span className="text-primary font-medium">
                {completedCount}/{totalCount}
              </span>
            </div>
            <Progress value={progressPercent} variant="primary" />
          </div>
        )}

        <div className="flex flex-wrap gap-1">
          {plan.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2">
          {isStarted ? (
            <Link to={`/study-plans/${plan.id}`} className="w-full">
              <Button variant="default" className="w-full">
                Continue Learning
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          ) : (
            <Button variant="outline" className="w-full" onClick={onStart}>
              <Play className="h-4 w-4 mr-2" />
              Start Plan
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const StudyPlansPage = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const studyPlanStorageKey = `study-plan-progress:${user?.id ?? "guest"}`;
  const [planProgress, setPlanProgress] = useLocalStorage<Record<string, StudyPlanProgress>>(
    studyPlanStorageKey,
    {}
  );

  const filteredPlans = studyPlans.filter((plan) => {
    const matchesSearch =
      plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDifficulty =
      !selectedDifficulty || plan.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  const startPlan = (planId: string) => {
    setPlanProgress((prev) => ({
      ...prev,
      [planId]: {
        planId,
        startedAt: new Date().toISOString(),
        completedProblems: [],
        lastActivityAt: new Date().toISOString(),
      },
    }));
  };

  const inProgressPlans = studyPlans.filter(
    (p) => planProgress[p.id] && planProgress[p.id].completedProblems.length < p.problemIds.length
  );
  const completedPlans = studyPlans.filter(
    (p) => planProgress[p.id]?.completedProblems.length === p.problemIds.length
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Study Plans</h1>
        <p className="text-muted-foreground">
          Structured learning paths to master DSA patterns and ace your interviews
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{studyPlans.length}</p>
                <p className="text-xs text-muted-foreground">Total Plans</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{inProgressPlans.length}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedPlans.length}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search study plans..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedDifficulty === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDifficulty(null)}
              >
                All
              </Button>
              {["beginner", "intermediate", "advanced"].map((diff) => (
                <Button
                  key={diff}
                  variant={selectedDifficulty === diff ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDifficulty(diff)}
                >
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Continue Learning */}
      {inProgressPlans.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-warning" />
            Continue Learning
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inProgressPlans.map((plan) => (
              <StudyPlanCard
                key={plan.id}
                plan={plan}
                progress={planProgress[plan.id]}
                onStart={() => startPlan(plan.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Plans */}
      <div>
        <h2 className="text-xl font-semibold mb-4">All Study Plans</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => (
            <StudyPlanCard
              key={plan.id}
              plan={plan}
              progress={planProgress[plan.id]}
              onStart={() => startPlan(plan.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const StudyPlansPageWithLayout = () => (
  <FeatureLayout>
    <StudyPlansPage />
  </FeatureLayout>
);

export default StudyPlansPageWithLayout;
