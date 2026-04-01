import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";
import { localeMap } from "@/i18n/LanguageContext";

export const useProducts = () => {
  const { language } = useLanguage();

  return useQuery({
    queryKey: ["products", language],
    queryFn: async () => {
      const { data: products, error } = await supabase
        .from("products")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      if (!products) return [];

      if (language === "zh-CN") return products;

      const locale = language === "zh-TW" ? "zh-TW" : language;
      const { data: translations } = await supabase
        .from("product_translations")
        .select("*")
        .eq("locale", locale);

      if (!translations || translations.length === 0) return products;

      const transMap = new Map(translations.map((t: any) => [t.product_id, t]));
      return products.map((p) => {
        const tr = transMap.get(p.id);
        if (!tr) return p;
        return {
          ...p,
          name: tr.name || p.name,
          description: tr.description ?? p.description,
          tag: tr.tag ?? p.tag,
        };
      });
    },
  });
};
