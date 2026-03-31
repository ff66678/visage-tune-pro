import { Home, BookOpen, ScanFace, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface BottomTabBarProps {
  activeTab: number;
  onTabChange: (tab: number) => void;
}

const tabs = [
  { icon: Home, label: "首页", requiresAuth: false },
  { icon: BookOpen, label: "课程", requiresAuth: false },
  { icon: ScanFace, label: "分析", requiresAuth: false },
  { icon: Camera, label: "记录", requiresAuth: false },
];

const BottomTabBar = ({ activeTab, onTabChange }: BottomTabBarProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleTabClick = (index: number) => {
    const tab = tabs[index];
    if (tab.requiresAuth && !user) {
      toast("请先登录", { description: "点击头像即可登录" });
      navigate("/auth");
      return;
    }
    onTabChange(index);
  };

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] h-[84px] bg-surface/95 backdrop-blur-xl flex justify-around items-center pb-5 border-t border-foreground/5 z-50">
      {tabs.map((tab, i) => (
        <button
          key={tab.label}
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
