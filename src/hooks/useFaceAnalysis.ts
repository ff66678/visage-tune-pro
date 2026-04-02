import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useTranslation } from "@/i18n/LanguageContext";

export interface FaceAnalysis {
  id: string;
  user_id: string;
  photo_url: string;
  elasticity_score: number;
  health_grade: string;
  nasolabial_level: string;
  jawline_level: string;
  eye_contour_score: number;
  analysis_date: string;
  created_at: string;
}

export const useFaceAnalyses = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["face-analyses", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("face_analyses")
        .select("*")
        .eq("user_id", user.id)
        .order("analysis_date", { ascending: false })
        .limit(30);
      if (error) throw error;
      return data as FaceAnalysis[];
    },
    enabled: !!user,
  });
};

export const useLatestAnalysis = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["face-analysis-latest", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("face_analyses")
        .select("*")
        .eq("user_id", user.id)
        .order("analysis_date", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as FaceAnalysis | null;
    },
    enabled: !!user,
  });
};

export const useRunAnalysis = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (photoUrl: string) => {
      const { data, error } = await supabase.functions.invoke("analyze-face", {
        body: { photo_url: photoUrl },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data as FaceAnalysis;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["face-analyses"] });
      queryClient.invalidateQueries({ queryKey: ["face-analysis-latest"] });
      toast.success(t("analysis.success"));
    },
    onError: (err: any) => {
      toast.error(t("analysis.failed") + (err.message || "Unknown error"));
    },
  });
};
