import { useRef, useEffect, useLayoutEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BottomTabBar from "@/components/BottomTabBar";
import HomePage from "@/components/HomePage";
import LibraryPage from "@/components/LibraryPage";
import AnalysisPage from "@/components/AnalysisPage";
import ProgressPage from "@/components/ProgressPage";
import { ScrollProvider } from "@/contexts/ScrollContext";

const pages = [HomePage, LibraryPage, AnalysisPage, ProgressPage];

// Module-level storage — survives component unmount/remount
import { scrollPositions, getIsTabSwitch, setIsTabSwitch, getSkipNextAnimation, setSkipNextAnimation } from "@/lib/scrollPositions";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = Number(searchParams.get("tab") || 0);
  const setActiveTab = (tab: number) => setSearchParams({ tab: String(tab) }, { replace: true });
  const ActivePage = pages[activeTab];
  const scrollRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<HTMLDivElement>(null);

  // Save scroll position on scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      scrollPositions.set(activeTab, el.scrollTop);
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [activeTab]);

  // Restore scroll on mount and tab change (useLayoutEffect to restore before paint)
  useLayoutEffect(() => {
    const el = animRef.current;
    if (!el) return;

    if (getSkipNextAnimation()) {
      setSkipNextAnimation(false);
      // No animation — just restore scroll
      const saved = scrollPositions.get(activeTab) || 0;
      scrollRef.current?.scrollTo({ top: saved, behavior: 'instant' });
      return;
    }

    if (getIsTabSwitch()) {
      setIsTabSwitch(false);
      scrollPositions.delete(activeTab);
      scrollRef.current?.scrollTo({ top: 0, behavior: 'instant' });
      el.classList.remove("animate-fade-in");
      el.classList.add("animate-fade-in-opacity");
      const timer = setTimeout(() => el.classList.remove("animate-fade-in-opacity"), 300);
      return () => clearTimeout(timer);
    } else {
      el.classList.remove("animate-fade-in", "animate-fade-in-opacity", "animate-slide-in-left");
      void el.offsetWidth;
      el.classList.add("animate-slide-in-left");
      const saved = scrollPositions.get(activeTab) || 0;
      scrollRef.current?.scrollTo({ top: saved, behavior: 'instant' });
      const timer = setTimeout(() => el.classList.remove("animate-slide-in-left"), 350);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div ref={scrollRef} className="w-full max-w-[480px] h-screen relative pb-[100px] no-scrollbar overflow-y-auto">
        <ScrollProvider value={{ scrollRef }}>
          <div ref={animRef}>
            <ActivePage />
          </div>
        </ScrollProvider>
        <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

export default Index;
