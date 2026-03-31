import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Check } from "lucide-react";

const languages = [
  { code: "zh-CN", label: "简体中文", native: "简体中文" },
  { code: "zh-TW", label: "繁體中文", native: "繁體中文" },
  { code: "en", label: "English", native: "English" },
  { code: "ja", label: "日本語", native: "日本語" },
  { code: "ko", label: "한국어", native: "한국어" },
];

const LanguageSettings = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("zh-CN");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-4 h-14">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-base font-semibold">更改语言</h1>
          <div className="w-9" />
        </div>
      </div>

      {/* Language List */}
      <div className="px-4 pt-4">
        <p className="text-sm text-muted-foreground mb-4">选择应用显示语言</p>
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          {languages.map((lang, i) => (
            <button
              key={lang.code}
              onClick={() => setSelected(lang.code)}
              className={`w-full flex items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-muted ${
                i < languages.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <span className="text-sm font-medium text-foreground">{lang.native}</span>
              {selected === lang.code && (
                <Check className="w-4.5 h-4.5 text-primary" />
              )}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4 text-center">
          更多语言即将推出
        </p>
      </div>
    </div>
  );
};

export default LanguageSettings;
