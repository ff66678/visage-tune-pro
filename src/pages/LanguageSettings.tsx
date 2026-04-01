import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Check } from "lucide-react";
import { useLanguage, type LanguageCode } from "@/i18n/LanguageContext";
import { useTranslation } from "@/i18n/LanguageContext";
import SwipeBack from "@/components/SwipeBack";

const languages: { code: LanguageCode; native: string }[] = [
  { code: "zh-CN", native: "简体中文" },
  { code: "zh-TW", native: "繁體中文" },
  { code: "en", native: "English" },
  { code: "ja", native: "日本語" },
  { code: "ko", native: "한국어" },
];

const LanguageSettings = () => {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();

  return (
    <SwipeBack className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-4 h-14">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-base font-semibold">{t("lang.title")}</h1>
          <div className="w-9" />
        </div>
      </div>

      <div className="px-4 pt-4">
        <p className="text-sm text-muted-foreground mb-4">{t("lang.desc")}</p>
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          {languages.map((lang, i) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`w-full flex items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-muted ${
                i < languages.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <span className="text-sm font-medium text-foreground">{lang.native}</span>
              {language === lang.code && (
                <Check className="w-4.5 h-4.5 text-primary" />
              )}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4 text-center">
          {t("lang.comingSoon")}
        </p>
      </div>
    </SwipeBack>
  );
};

export default LanguageSettings;
