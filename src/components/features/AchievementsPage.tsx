import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy,
  Star,
  Lock,
  Flame,
  Brain,
  Target,
  Sparkles,
} from "lucide-react";
import {
  useAchievements,
  achievements,
  Achievement,
  TIER_COLORS,
  TIER_BG_COLORS,
} from "@/hooks/useAchievements";
import FeatureLayout from "@/components/layout/FeatureLayout";

const AchievementCard = ({
  achievement,
  isUnlocked,
  progress,
}: {
  achievement: Achievement;
  isUnlocked: boolean;
  progress: number;
}) => {
  const progressPercent = Math.min(
    (progress / achievement.requirement) * 100,
    100
  );

  return (
    <Card
      className={`relative overflow-hidden transition-all ${
        isUnlocked
          ? "border-primary/50 bg-primary/5"
          : "opacity-75 hover:opacity-100"
      }`}
    >
      {isUnlocked && (
        <div
          className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
            TIER_COLORS[achievement.tier]
          }`}
        />
      )}
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div
            className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${
              isUnlocked
                ? `bg-gradient-to-br ${TIER_COLORS[achievement.tier]} text-white`
                : "bg-secondary text-muted-foreground"
            }`}
          >
            {isUnlocked ? achievement.icon : <Lock className="h-6 w-6" />}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3
                className={`font-semibold ${
                  isUnlocked ? "" : "text-muted-foreground"
                }`}
              >
                {achievement.name}
              </h3>
              <Badge
                className={`text-xs ${TIER_BG_COLORS[achievement.tier]} border-0`}
              >
                {achievement.tier}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {achievement.description}
            </p>
            {!isUnlocked && (
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Progress</span>
                  <span>
                    {progress}/{achievement.requirement}
                  </span>
                </div>
                <Progress value={progressPercent} className="h-1.5" />
              </div>
            )}
            {isUnlocked && (
              <Badge variant="success" className="text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                Unlocked!
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AchievementsPage = () => {
  const { isUnlocked, getProgress, stats, unlockedAchievements } =
    useAchievements();
  const [activeTab, setActiveTab] = useState("all");

  const categoryIcons = {
    problems: Target,
    streaks: Flame,
    patterns: Brain,
    special: Star,
  };

  const filteredAchievements =
    activeTab === "all"
      ? achievements.filter((a) => !a.secret || isUnlocked(a.id))
      : achievements.filter(
          (a) =>
            a.category === activeTab && (!a.secret || isUnlocked(a.id))
        );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Trophy className="h-8 w-8 text-warning" />
          Achievements
        </h1>
        <p className="text-muted-foreground">
          Track your progress and unlock badges as you master DSA
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5">
          <CardContent className="pt-6 text-center">
            <p className="text-4xl font-bold text-amber-600">
              {stats.byTier.bronze}
            </p>
            <p className="text-sm text-muted-foreground">Bronze</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-gray-400/10 to-gray-500/5">
          <CardContent className="pt-6 text-center">
            <p className="text-4xl font-bold text-gray-500">
              {stats.byTier.silver}
            </p>
            <p className="text-sm text-muted-foreground">Silver</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-400/10 to-amber-500/5">
          <CardContent className="pt-6 text-center">
            <p className="text-4xl font-bold text-yellow-500">
              {stats.byTier.gold}
            </p>
            <p className="text-sm text-muted-foreground">Gold</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-cyan-400/10 to-blue-500/5">
          <CardContent className="pt-6 text-center">
            <p className="text-4xl font-bold text-cyan-500">
              {stats.byTier.platinum}
            </p>
            <p className="text-sm text-muted-foreground">Platinum</p>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Overall Progress</h3>
              <p className="text-sm text-muted-foreground">
                {stats.unlocked} of {stats.total} achievements unlocked
              </p>
            </div>
            <span className="text-3xl font-bold text-primary">
              {stats.percentage}%
            </span>
          </div>
          <Progress value={stats.percentage} variant="primary" className="h-3" />
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="problems" className="flex items-center gap-1">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Problems</span>
          </TabsTrigger>
          <TabsTrigger value="streaks" className="flex items-center gap-1">
            <Flame className="h-4 w-4" />
            <span className="hidden sm:inline">Streaks</span>
          </TabsTrigger>
          <TabsTrigger value="patterns" className="flex items-center gap-1">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">Patterns</span>
          </TabsTrigger>
          <TabsTrigger value="special" className="flex items-center gap-1">
            <Star className="h-4 w-4" />
            <span className="hidden sm:inline">Special</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid md:grid-cols-2 gap-4">
            {filteredAchievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                isUnlocked={isUnlocked(achievement.id)}
                progress={getProgress(achievement.id)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const AchievementsPageWithLayout = () => (
  <FeatureLayout>
    <AchievementsPage />
  </FeatureLayout>
);

export default AchievementsPageWithLayout;
