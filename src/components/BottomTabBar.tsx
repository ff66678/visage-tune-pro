import { Home, BookOpen, ScanFace, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/i18n/LanguageContext";
import { toast } from "sonner";
import { setIsTabSwitch } from "@/lib/scrollPositions";

interface BottomTabBarProps {
  activeTab: number;
  onTabChange: (tab: number) => void;
}

const BottomTabBar = ({ activeTab, onTabChange }: BottomTabBarProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const tabs = [
    { icon: Home, label: t("tab.home"), requiresAuth: false },
    { icon: BookOpen, label: t("tab.courses"), requiresAuth: false },
    { icon: ScanFace, label: t("tab.analysis"), requiresAuth: false },
    { icon: Camera, label: t("tab.progress"), requiresAuth: false },
  ];

  const handleTabClick = (index: number) => {
    const tab = tabs[index];
    if (tab.requiresAuth && !user) {
      toast(t("tab.loginFirst"), { description: t("tab.loginHint") });
      navigate("/auth");
      return;
    }
    setIsTabSwitch(true);
    onTabChange(index);
  };

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] h-[84px] bg-surface/95 backdrop-blur-xl flex justify-around items-center pb-5 border-t border-foreground/5 z-50">
      {tabs.map((tab, i) => (
        <button
          key={i}
          onClick={() => handleTabClick(i)}
          className={`flex flex-col items-center gap-1 bg-transparent border-none cursor-pointer transition-colors ${
            activeTab === i ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <tab.icon className="w-6 h-6" />
          <span className="text-[10px] font-semibold">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomTabBar;
