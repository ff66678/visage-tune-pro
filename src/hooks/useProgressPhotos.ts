import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface ProgressPhoto {
  id: string;
  user_id: string;
  photo_url: string;
  photo_date: string;
  created_at: string;
}

export const useProgressPhotos = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["progress-photos", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("progress_photos")
        .select("*")
        .eq("user_id", user.id)
        .order("photo_date", { ascending: false })
        .limit(30);
      if (error) throw error;
      return data as ProgressPhoto[];
    },
    enabled: !!user,
  });
};

export const useTodayPhoto = () => {
  const { user } = useAuth();
  const todayStr = new Date().toISOString().split("T")[0];

  return useQuery({
    queryKey: ["progress-photo-today", user?.id, todayStr],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("progress_photos")
        .select("*")
        .eq("user_id", user.id)
        .eq("photo_date", todayStr)
        .maybeSingle();
      if (error) throw error;
      return data as ProgressPhoto | null;
    },
    enabled: !!user,
  });
};

export const useUploadProgressPhoto = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const todayStr = new Date().toISOString().split("T")[0];

  return useMutation({
    mutationFn: async (file: File) => {
      if (!user) throw new Error("未登录");

      // Upload to storage
      const ext = file.name.split(".").pop() || "jpg";
      const filePath = `${user.id}/${todayStr}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("progress-photos")
        .upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("progress-photos")
        .getPublicUrl(filePath);
      const photoUrl = urlData.publicUrl;

      // Upsert record
      const { error: dbError } = await supabase
        .from("progress_photos")
        .upsert(
          { user_id: user.id, photo_url: photoUrl, photo_date: todayStr },
          { onConflict: "user_id,photo_date" }
        );
      if (dbError) throw dbError;

      return photoUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress-photo-today"] });
      queryClient.invalidateQueries({ queryKey: ["progress-photos"] });
      toast.success("照片已保存 ✨");
    },
    onError: (err: any) => {
      toast.error("保存失败：" + (err.message || "未知错误"));
    },
  });
};
