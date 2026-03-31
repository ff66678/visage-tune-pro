import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Course } from "@/hooks/useCourses";

export const useFavorites = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["favorites", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("favorites")
        .select("id, course_id, created_at, courses(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data.map((f: any) => ({ ...f.courses, favorite_id: f.id })) as (Course & { favorite_id: string })[];
    },
    enabled: !!user,
  });
};

export const useFavoriteIds = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["favorite-ids", user?.id],
    queryFn: async () => {
      if (!user) return new Set<string>();
      const { data, error } = await supabase
        .from("favorites")
        .select("course_id")
        .eq("user_id", user.id);
      if (error) throw error;
      return new Set(data.map((f) => f.course_id));
    },
    enabled: !!user,
  });
};

export const useToggleFavorite = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ courseId, isFavorited }: { courseId: string; isFavorited: boolean }) => {
      if (!user) throw new Error("Not authenticated");
      if (isFavorited) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("course_id", courseId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("favorites")
          .insert({ user_id: user.id, course_id: courseId });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["favorite-ids"] });
    },
  });
};
