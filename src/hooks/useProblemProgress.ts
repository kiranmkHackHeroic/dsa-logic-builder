import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface ProblemProgress {
  id: string;
  user_id: string;
  problem_id: string;
  current_step: number;
  completed_steps: number[] | null;
  status: string;
  understanding_text: string | null;
  thinking_text: string | null;
  brute_force_text: string | null;
  optimization_text: string | null;
  final_approach_text: string | null;
  code_solution: string | null;
  logic_score: number | null;
  time_spent_thinking: number | null;
  time_spent_coding: number | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export type ProblemProgressUpdate = Partial<Omit<ProblemProgress, "id" | "user_id" | "created_at" | "updated_at">>;
export type ProblemProgressInsert = ProblemProgressUpdate;

export const useProblemProgress = (problemId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: progress, isLoading } = useQuery({
    queryKey: ["problem-progress", problemId, user?.id],
    queryFn: async () => {
      if (!user) return null;
      return apiClient.get<ProblemProgress | null>(`/api/progress/${problemId}`);
    },
    enabled: !!user && !!problemId,
    refetchInterval: 30000, // Poll every 30s instead of Supabase realtime
  });

  const upsertProgress = useMutation({
    mutationFn: async (updates: ProblemProgressUpdate) => {
      if (!user) throw new Error("Not authenticated");
      return apiClient.put<ProblemProgress>(`/api/progress/${problemId}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["problem-progress", problemId] });
      queryClient.invalidateQueries({ queryKey: ["all-problem-progress"] });
    },
    onError: (error) => {
      console.error("Error saving progress:", error);
      toast({
        title: "Error saving progress",
        description: "Your progress could not be saved. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    progress,
    isLoading,
    updateProgress: upsertProgress.mutate,
    updateProgressAsync: upsertProgress.mutateAsync,
    isSaving: upsertProgress.isPending,
  };
};

export const useAllProgress = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["all-problem-progress", user?.id],
    queryFn: async () => {
      if (!user) return [];
      return apiClient.get<ProblemProgress[]>("/api/progress");
    },
    enabled: !!user,
    refetchInterval: 30000,
  });
};
