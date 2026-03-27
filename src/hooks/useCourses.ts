import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  return useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at");
      if (error) throw error;
      return data as Course[];
    },
  });
};

export const useCourse = (id: string | undefined) => {
  return useQuery({
    queryKey: ["course", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data as Course | null;
    },
    enabled: !!id,
  });
};
