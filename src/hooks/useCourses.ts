import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";

export interface Course {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  tag: string | null;
  category: string;
  duration: string;
  difficulty: string;
  intensity: string | null;
  description: string | null;
  target_audience: string[] | null;
  expected_effect: string | null;
  rating: number | null;
  review_count: number | null;
  is_featured: boolean;
  is_today_plan: boolean;
  created_at: string;
}

export const useCourses = () => {
  const { language } = useLanguage();
  const needsTranslation = language !== "zh-CN";

  return useQuery({
    queryKey: ["courses", language],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at");
      if (error) throw error;
      const courses = data as Course[];

      if (!needsTranslation) return courses;

      // Fetch translations for current locale
      const locale = language === "zh-TW" ? "zh-TW" : language;
      const { data: translations } = await supabase
        .from("course_translations")
        .select("*")
        .eq("locale", locale);

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
  });
};

export const useCourse = (id: string | undefined) => {
  const { language } = useLanguage();
  const needsTranslation = language !== "zh-CN";

  return useQuery({
    queryKey: ["course", id, language],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;

      if (!needsTranslation) return data as Course;

      const locale = language === "zh-TW" ? "zh-TW" : language;
      const { data: trans } = await supabase
        .from("course_translations")
        .select("*")
        .eq("course_id", id)
        .eq("locale", locale)
        .maybeSingle();

      if (!trans) return data as Course;

      return {
        ...data,
        title: trans.title || data.title,
        subtitle: trans.subtitle ?? data.subtitle,
        description: trans.description ?? data.description,
        duration: trans.duration || data.duration,
        expected_effect: trans.expected_effect ?? data.expected_effect,
        target_audience: trans.target_audience ?? data.target_audience,
      } as Course;
    },
    enabled: !!id,
  });
};
