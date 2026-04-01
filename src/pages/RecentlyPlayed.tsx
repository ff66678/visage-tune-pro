import { useNavigate } from "react-router-dom";
import { ChevronLeft, Clock, Play } from "lucide-react";
import { useRecentCourses } from "@/hooks/useWorkoutLogs";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/i18n/LanguageContext";

const RecentlyPlayed = () => {
  const navigate = useNavigate();
  const { data: recentCourses = [], isLoading } = useRecentCourses();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <nav className="flex items-center gap-3 px-4 pt-12 pb-4 sticky top-0 bg-background/85 backdrop-blur-xl z-40">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-surface flex items-center justify-center">
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-semibold">{t("recent.title")}</h1>
      </nav>
      <div className="px-6 pb-8">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}
          </div>
        ) : recentCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Play className="w-12 h-12 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground text-sm">{t("recent.empty")}</p>
            <p className="text-muted-foreground/60 text-xs mt-1">{t("recent.emptyHint")}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {recentCourses.map((course: any) => (
              <div key={course.id} className="bg-surface rounded-2xl p-3.5 flex items-center gap-3.5 cursor-pointer hover:bg-surface-elevated transition-colors" onClick={() => navigate(`/course/${course.id}`)}>
                <img src={course.image_url} alt={course.title} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground line-clamp-1">{course.title}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground mt-0.5">
                    <span className="text-[11px]">{t("difficulty." + course.difficulty)}</span>
                    <span className="text-[11px]">·</span>
                    <Clock className="w-3 h-3" />
                    <span className="text-[11px]">{course.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentlyPlayed;
