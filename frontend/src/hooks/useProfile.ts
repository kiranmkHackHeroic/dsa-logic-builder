import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { useAuth } from "@/contexts/AuthContext";

export interface Profile {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export type ProfileUpdate = Partial<Pick<Profile, "display_name" | "avatar_url">>;

export const useProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      return apiClient.get<Profile>("/api/profiles/me");
    },
    enabled: !!user,
  });

  const updateProfile = useMutation({
    mutationFn: async (updates: ProfileUpdate) => {
      if (!user) throw new Error("Not authenticated");
      return apiClient.put<Profile>("/api/profiles/me", updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  return {
    profile,
    isLoading,
    updateProfile: updateProfile.mutate,
  };
};
