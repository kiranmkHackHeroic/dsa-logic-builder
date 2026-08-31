import { useCallback, useMemo } from "react";
import { useLocalStorage } from "@/hooks/useUtils";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Achievement and Badge system for gamification
 */

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "problems" | "streaks" | "patterns" | "special";
  requirement: number;
  tier: "bronze" | "silver" | "gold" | "platinum";
  secret?: boolean;
}

export interface UserAchievement {
  achievementId: string;
  unlockedAt: string;
  progress: number;
}

// Define all achievements
export const achievements: Achievement[] = [
  // Problem milestones
  {
    id: "first-solve",
    name: "First Steps",
    description: "Solve your first problem",
    icon: "🎉",
    category: "problems",
    requirement: 1,
    tier: "bronze",
  },
  {
    id: "ten-problems",
    name: "Getting Started",
    description: "Solve 10 problems",
    icon: "📚",
    category: "problems",
    requirement: 10,
    tier: "bronze",
  },
  {
    id: "fifty-problems",
    name: "Problem Solver",
    description: "Solve 50 problems",
    icon: "🧠",
    category: "problems",
    requirement: 50,
    tier: "silver",
  },
  {
    id: "hundred-problems",
    name: "Century Club",
    description: "Solve 100 problems",
    icon: "💯",
    category: "problems",
    requirement: 100,
    tier: "gold",
  },
  {
    id: "two-fifty-problems",
    name: "Master Solver",
    description: "Solve 250 problems",
    icon: "🏆",
    category: "problems",
    requirement: 250,
    tier: "platinum",
  },

  // Streak achievements
  {
    id: "three-day-streak",
    name: "Consistent",
    description: "Maintain a 3-day streak",
    icon: "🔥",
    category: "streaks",
    requirement: 3,
    tier: "bronze",
  },
  {
    id: "seven-day-streak",
    name: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: "⚡",
    category: "streaks",
    requirement: 7,
    tier: "silver",
  },
  {
    id: "thirty-day-streak",
    name: "Monthly Master",
    description: "Maintain a 30-day streak",
    icon: "🌟",
    category: "streaks",
    requirement: 30,
    tier: "gold",
  },
  {
    id: "hundred-day-streak",
    name: "Centurion",
    description: "Maintain a 100-day streak",
    icon: "👑",
    category: "streaks",
    requirement: 100,
    tier: "platinum",
  },

  // Pattern mastery
  {
    id: "first-pattern",
    name: "Pattern Finder",
    description: "Master your first pattern (80%+ in one pattern)",
    icon: "🎯",
    category: "patterns",
    requirement: 1,
    tier: "bronze",
  },
  {
    id: "three-patterns",
    name: "Pattern Pro",
    description: "Master 3 different patterns",
    icon: "🧩",
    category: "patterns",
    requirement: 3,
    tier: "silver",
  },
  {
    id: "five-patterns",
    name: "Pattern Expert",
    description: "Master 5 different patterns",
    icon: "🎨",
    category: "patterns",
    requirement: 5,
    tier: "gold",
  },
  {
    id: "all-patterns",
    name: "Pattern Master",
    description: "Master all patterns",
    icon: "🌈",
    category: "patterns",
    requirement: 12,
    tier: "platinum",
  },

  // Special achievements
  {
    id: "speed-demon",
    name: "Speed Demon",
    description: "Solve a medium problem in under 15 minutes",
    icon: "⚡",
    category: "special",
    requirement: 1,
    tier: "silver",
  },
  {
    id: "perfectionist",
    name: "Perfectionist",
    description: "Get 100% logic score on 10 problems",
    icon: "✨",
    category: "special",
    requirement: 10,
    tier: "gold",
  },
  {
    id: "hard-crusher",
    name: "Hard Crusher",
    description: "Solve 10 hard problems",
    icon: "💀",
    category: "special",
    requirement: 10,
    tier: "gold",
  },
  {
    id: "early-bird",
    name: "Early Bird",
    description: "Solve a problem before 6 AM",
    icon: "🌅",
    category: "special",
    requirement: 1,
    tier: "bronze",
    secret: true,
  },
  {
    id: "night-owl",
    name: "Night Owl",
    description: "Solve a problem after midnight",
    icon: "🦉",
    category: "special",
    requirement: 1,
    tier: "bronze",
    secret: true,
  },
  {
    id: "weekend-warrior",
    name: "Weekend Warrior",
    description: "Solve 5 problems on a weekend",
    icon: "🗓️",
    category: "special",
    requirement: 5,
    tier: "silver",
  },
  {
    id: "blind-75-complete",
    name: "Blind 75 Champion",
    description: "Complete the entire Blind 75 study plan",
    icon: "🏅",
    category: "special",
    requirement: 75,
    tier: "platinum",
  },
];

// Tier colors
export const TIER_COLORS = {
  bronze: "from-amber-600 to-amber-800",
  silver: "from-gray-300 to-gray-500",
  gold: "from-yellow-400 to-amber-500",
  platinum: "from-cyan-300 to-blue-500",
};

export const TIER_BG_COLORS = {
  bronze: "bg-amber-100 dark:bg-amber-900/30",
  silver: "bg-gray-100 dark:bg-gray-800/30",
  gold: "bg-yellow-100 dark:bg-yellow-900/30",
  platinum: "bg-cyan-100 dark:bg-cyan-900/30",
};

/**
 * Hook for managing achievements
 */
export function useAchievements() {
  const { user } = useAuth();
  const achievementStorageKey = `user-achievements:${user?.id ?? "guest"}`;

  const [userAchievements, setUserAchievements] = useLocalStorage<
    Record<string, UserAchievement>
  >(achievementStorageKey, {});

  // Check if achievement is unlocked
  const isUnlocked = useCallback(
    (achievementId: string) => !!userAchievements[achievementId],
    [userAchievements]
  );

  // Get achievement progress
  const getProgress = useCallback(
    (achievementId: string) => userAchievements[achievementId]?.progress ?? 0,
    [userAchievements]
  );

  // Update achievement progress
  const updateProgress = useCallback(
    (achievementId: string, progress: number) => {
      const achievement = achievements.find((a) => a.id === achievementId);
      if (!achievement) return;

      const shouldUnlock = progress >= achievement.requirement;

      setUserAchievements((prev) => ({
        ...prev,
        [achievementId]: {
          achievementId,
          progress,
          unlockedAt: shouldUnlock
            ? prev[achievementId]?.unlockedAt || new Date().toISOString()
            : "",
        },
      }));

      return shouldUnlock && !userAchievements[achievementId]?.unlockedAt;
    },
    [userAchievements, setUserAchievements]
  );

  // Unlock achievement
  const unlockAchievement = useCallback(
    (achievementId: string) => {
      const achievement = achievements.find((a) => a.id === achievementId);
      if (!achievement || userAchievements[achievementId]?.unlockedAt) return false;

      setUserAchievements((prev) => ({
        ...prev,
        [achievementId]: {
          achievementId,
          progress: achievement.requirement,
          unlockedAt: new Date().toISOString(),
        },
      }));

      return true;
    },
    [userAchievements, setUserAchievements]
  );

  // Get unlocked achievements
  const unlockedAchievements = useMemo(() => {
    return achievements.filter(
      (a) => userAchievements[a.id]?.unlockedAt
    );
  }, [userAchievements]);

  // Get locked achievements (non-secret)
  const lockedAchievements = useMemo(() => {
    return achievements.filter(
      (a) => !a.secret && !userAchievements[a.id]?.unlockedAt
    );
  }, [userAchievements]);

  // Get stats
  const stats = useMemo(() => {
    const total = achievements.filter((a) => !a.secret).length;
    const unlocked = unlockedAchievements.length;
    const byCategory = {
      problems: achievements.filter(
        (a) => a.category === "problems" && userAchievements[a.id]?.unlockedAt
      ).length,
      streaks: achievements.filter(
        (a) => a.category === "streaks" && userAchievements[a.id]?.unlockedAt
      ).length,
      patterns: achievements.filter(
        (a) => a.category === "patterns" && userAchievements[a.id]?.unlockedAt
      ).length,
      special: achievements.filter(
        (a) => a.category === "special" && userAchievements[a.id]?.unlockedAt
      ).length,
    };
    const byTier = {
      bronze: unlockedAchievements.filter((a) => a.tier === "bronze").length,
      silver: unlockedAchievements.filter((a) => a.tier === "silver").length,
      gold: unlockedAchievements.filter((a) => a.tier === "gold").length,
      platinum: unlockedAchievements.filter((a) => a.tier === "platinum").length,
    };

    return { total, unlocked, percentage: Math.round((unlocked / total) * 100), byCategory, byTier };
  }, [unlockedAchievements, userAchievements]);

  return {
    achievements,
    userAchievements,
    isUnlocked,
    getProgress,
    updateProgress,
    unlockAchievement,
    unlockedAchievements,
    lockedAchievements,
    stats,
    TIER_COLORS,
    TIER_BG_COLORS,
  };
}

export default useAchievements;
