import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { useAuth } from "@/contexts/AuthContext";

export interface UserStreak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  total_problems_solved: number;
  total_problems_attempted: number;
  created_at: string;
  updated_at: string;
}

export type UserStreakUpdate = Partial<Pick<UserStreak,
  "current_streak" | "longest_streak" | "last_activity_date" |
  "total_problems_solved" | "total_problems_attempted"
>>;

export const useUserStreak = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: streak, isLoading } = useQuery({
    queryKey: ["user-streak", user?.id],
    queryFn: async () => {
      if (!user) return null;
      return apiClient.get<UserStreak | null>("/api/streaks");
    },
    enabled: !!user,
  });

  const updateStreak = useMutation({
    mutationFn: async (updates: UserStreakUpdate) => {
      if (!user) throw new Error("Not authenticated");
      return apiClient.put<UserStreak>("/api/streaks", updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-streak"] });
    },
  });

  const recordActivity = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");
      return apiClient.post<UserStreak>("/api/streaks/record-activity");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-streak"] });
    },
  });

  const incrementProblemsSolved = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");
      return apiClient.post<UserStreak>("/api/streaks/increment-solved");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-streak"] });
    },
  });

  const incrementProblemsAttempted = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");
      return apiClient.post<UserStreak>("/api/streaks/increment-attempted");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-streak"] });
    },
  });

  return {
    streak,
    isLoading,
    updateStreak: updateStreak.mutate,
    recordActivity: recordActivity.mutate,
    incrementProblemsSolved: incrementProblemsSolved.mutate,
    incrementProblemsAttempted: incrementProblemsAttempted.mutate,
  };
};
