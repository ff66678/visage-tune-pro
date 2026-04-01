import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import zhCN from "./translations/zh-CN";
import zhTW from "./translations/zh-TW";
import en from "./translations/en";
import ja from "./translations/ja";
import ko from "./translations/ko";

export type LanguageCode = "zh-CN" | "zh-TW" | "en" | "ja" | "ko";

const translations: Record<LanguageCode, Record<string, string>> = {
  "zh-CN": zhCN,
  "zh-TW": zhTW,
  en,
  ja,
  ko,
};

export const localeMap: Record<LanguageCode, string> = {
  "zh-CN": "zh-CN",
  "zh-TW": "zh-TW",
  en: "en-US",
  ja: "ja-JP",
  ko: "ko-KR",
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, args?: (string | number)[]) => string;
  locale: string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const getInitialLanguage = (): LanguageCode => {
  try {
    const stored = localStorage.getItem("app-language");
    if (stored && stored in translations) return stored as LanguageCode;
  } catch {}
  return "zh-CN";
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<LanguageCode>(getInitialLanguage);

  const setLanguage = useCallback((lang: LanguageCode) => {
    setLanguageState(lang);
    try { localStorage.setItem("app-language", lang); } catch {}
  }, []);

  const t = useCallback(
    (key: string, args?: (string | number)[]): string => {
      let text = translations[language]?.[key] || translations["zh-CN"]?.[key] || key;
      if (args) {
        args.forEach((arg, i) => {
          text = text.replace(`{${i}}`, String(arg));
        });
      }
      return text;
    },
    [language]
  );

  const locale = localeMap[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, locale }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};

export const useTranslation = () => {
  const { t, locale } = useLanguage();
  return { t, locale };
};
