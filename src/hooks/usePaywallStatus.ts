import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const usePaywallStatus = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: isPaid, isLoading } = useQuery({
    queryKey: ["paywall_status", user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data, error } = await supabase
        .from("profiles")
        .select("paywall_completed")
        .eq("user_id", user.id)
        .single();
      if (error) throw error;
      return data?.paywall_completed ?? false;
    },
    enabled: !!user,
  });

  const { mutateAsync: markPaid } = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("profiles")
        .update({ paywall_completed: true } as any)
        .eq("user_id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paywall_status", user?.id] });
    },
  });

  return { isPaid: isPaid ?? false, isLoading, markPaid };
};
