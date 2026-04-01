import { useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import BottomTabBar from "@/components/BottomTabBar";
import HomePage from "@/components/HomePage";
import LibraryPage from "@/components/LibraryPage";
import AnalysisPage from "@/components/AnalysisPage";
import ProgressPage from "@/components/ProgressPage";

const pages = [HomePage, LibraryPage, AnalysisPage, ProgressPage];

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = Number(searchParams.get("tab") || 0);
  const setActiveTab = (tab: number) => setSearchParams({ tab: String(tab) }, { replace: true });
  const ActivePage = pages[activeTab];
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollPositions = useRef<Map<number, number>>(new Map());
  const prevTabRef = useRef<number>(activeTab);

  // Save scroll position on scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      scrollPositions.current.set(activeTab, el.scrollTop);
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [activeTab]);

  // Restore/reset scroll on tab change only
  useEffect(() => {
    if (prevTabRef.current !== activeTab) {
      const saved = scrollPositions.current.get(activeTab) || 0;
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ top: saved, behavior: 'instant' });
      });
      prevTabRef.current = activeTab;
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div ref={scrollRef} className="w-full max-w-[480px] h-screen relative pb-[100px] no-scrollbar overflow-y-auto">
        <ActivePage />
        <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

export default Index;
