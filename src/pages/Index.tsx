import { useRef, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BottomTabBar from "@/components/BottomTabBar";
import HomePage from "@/components/HomePage";
import LibraryPage from "@/components/LibraryPage";
import AnalysisPage from "@/components/AnalysisPage";
import ProgressPage from "@/components/ProgressPage";

const pages = [HomePage, LibraryPage, AnalysisPage, ProgressPage];

// Module-level storage — survives component unmount/remount
import { scrollPositions, getIsTabSwitch, setIsTabSwitch } from "@/lib/scrollPositions";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = Number(searchParams.get("tab") || 0);
  const setActiveTab = (tab: number) => setSearchParams({ tab: String(tab) }, { replace: true });
  const ActivePage = pages[activeTab];
  const scrollRef = useRef<HTMLDivElement>(null);

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

  // Restore scroll on mount and tab change
  useEffect(() => {
    if (getIsTabSwitch()) {
      setIsTabSwitch(false);
      scrollPositions.delete(activeTab);
      scrollRef.current?.scrollTo({ top: 0, behavior: 'instant' });
    } else {
      const saved = scrollPositions.get(activeTab) || 0;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollRef.current?.scrollTo({ top: saved, behavior: 'instant' });
        });
      });
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
