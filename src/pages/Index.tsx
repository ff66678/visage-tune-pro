import { useSearchParams } from "react-router-dom";
import BottomTabBar from "@/components/BottomTabBar";
import HomePage from "@/components/HomePage";
import LibraryPage from "@/components/LibraryPage";
import ProfilePage from "@/components/ProfilePage";

const pages = [HomePage, LibraryPage, ProfilePage];

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = Number(searchParams.get("tab") || 0);
  const setActiveTab = (tab: number) => setSearchParams({ tab: String(tab) }, { replace: true });
  const ActivePage = pages[activeTab];

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-full max-w-[480px] min-h-screen relative pb-[100px] no-scrollbar overflow-y-auto">
        <ActivePage />
        <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

export default Index;
