import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/i18n/LanguageContext";
import type { Course } from "@/hooks/useCourses";

export const useFavorites = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const needsTranslation = language !== "zh-CN";

  return useQuery({
    queryKey: ["favorites", user?.id, language],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("favorites")
        .select("id, course_id, created_at, courses(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;

      const courses = data.map((f: any) => ({ ...f.courses, favorite_id: f.id })) as (Course & { favorite_id: string })[];

      if (!needsTranslation || courses.length === 0) return courses;

      const locale = language === "zh-TW" ? "zh-TW" : language;
      const courseIds = courses.map(c => c.id);
      const { data: translations } = await supabase
        .from("course_translations")
        .select("*")
        .eq("locale", locale)
        .in("course_id", courseIds);

      if (!translations || translations.length === 0) return courses;

      const transMap = new Map(translations.map((t: any) => [t.course_id, t]));

      return courses.map((course) => {
        const t = transMap.get(course.id);
        if (!t) return course;
        return {
          ...course,
          title: t.title || course.title,
          subtitle: t.subtitle ?? course.subtitle,
          description: t.description ?? course.description,
          duration: t.duration || course.duration,
          expected_effect: t.expected_effect ?? course.expected_effect,
          target_audience: t.target_audience ?? course.target_audience,
        };
      });
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
