import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Gift, Star, Crown, Clock, Dumbbell, Flame, Heart, Zap, BookOpen, Play, ChevronRight } from "lucide-react";
import { useCourses } from "@/hooks/useCourses";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { useWeeklyProgress, useWorkoutStats, useRecentCourses } from "@/hooks/useWorkoutLogs";
import { useFavorites } from "@/hooks/useFavorites";
import { usePaywallStatus } from "@/hooks/usePaywallStatus";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useTranslation } from "@/i18n/LanguageContext";

const categoryIcons: Record<string, React.ReactNode> = {
  力量: <Dumbbell className="w-5 h-5" />,
  有氧: <Flame className="w-5 h-5" />,
  瑜伽: <Heart className="w-5 h-5" />,
  HIIT: <Zap className="w-5 h-5" />,
};
const defaultCategoryIcon = <BookOpen className="w-5 h-5" />;

const HomePage = () => {
  const [startClicked, setStartClicked] = useState(false);
  // Reset startClicked when component re-renders (e.g. navigating back)
  useEffect(() => { setStartClicked(false); }, []);
  const navigate = useNavigate();
  const location = useLocation();
  const { data: courses, isLoading } = useCourses();
  const { data: profile } = useProfile();
  const { user } = useAuth();
  const { data: recentCourses = [] } = useRecentCourses();
  const { t } = useTranslation();

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return t("home.greeting.morning");
    if (h < 18) return t("home.greeting.afternoon");
    return t("home.greeting.evening");
  };

  const displayName = user
    ? (profile?.display_name || user?.email?.split("@")[0] || t("home.user"))
    : t("home.guest");
  const avatarUrl = user ? profile?.avatar_url : undefined;
  const initials = displayName.slice(0, 1).toUpperCase();

  const navigateToAuth = () => {
    const returnTo = `${location.pathname}${location.search}`;
    navigate(`/auth?returnTo=${encodeURIComponent(returnTo)}`);
  };

  const handleAvatarClick = () => {
    if (user) {
      navigate("/profile");
    } else {
      navigateToAuth();
    }
  };

  const { data: favorites = [] } = useFavorites();
  const favCount = favorites.length;
  const { isPaid } = usePaywallStatus();

  const weekdayLabels = [
    t("weekday.mon"), t("weekday.tue"), t("weekday.wed"),
    t("weekday.thu"), t("weekday.fri"), t("weekday.sat"), t("weekday.sun")
  ];
  const { weekData, percentage } = useWeeklyProgress(weekdayLabels);
  const { streak } = useWorkoutStats();
  const todayPlan = courses?.find((c) => c.is_today_plan);
  const recommended = courses?.filter((c) => c.is_featured) ?? [];

  const categories = useMemo(() => {
    if (!courses) return [];
    const seen = new Set<string>();
    return courses
      .map((c) => c.category)
      .filter((cat) => {
        if (seen.has(cat)) return false;
        seen.add(cat);
        return true;
      })
      .slice(0, 5);
  }, [courses]);

  return (
    <div>
      {/* Top Nav */}
      <nav className="flex justify-between items-center px-6 pt-8 pb-4 sticky top-0 bg-background/85 backdrop-blur-xl z-40">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 ring-[1.5px] ring-primary cursor-pointer" onClick={handleAvatarClick}>
            {avatarUrl && <AvatarImage src={avatarUrl} alt="Avatar" />}
            <AvatarFallback className="text-sm font-semibold bg-primary/10 text-primary">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">{getGreeting()}</span>
            <span className="text-base font-semibold text-foreground">{displayName}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isPaid && (
            <button
              onClick={() => navigate("/membership")}
              className="bg-primary/10 border-none text-primary cursor-pointer px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-primary/15 transition-colors"
            >
              <Crown className="w-4 h-4" />
              <span className="text-xs font-semibold">PRO</span>
            </button>
          )}
          <button
            onClick={() => navigate("/gift")}
            className="relative bg-transparent border-none text-foreground cursor-pointer p-2 rounded-full hover:bg-foreground/5 transition-colors"
          >
            <Gift className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Weekly Progress */}
      <div className="mx-6 bg-surface rounded-3xl p-6 mb-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[15px] font-semibold">{t("home.weeklyProgress")}</h2>
            <span className="text-[13px] text-primary font-semibold">{t("home.completed", [percentage])}</span>
          </div>
          <div className="flex justify-between items-end">
            {weekData.map((day, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-8 h-[60px] bg-surface-elevated rounded-lg relative overflow-hidden">
                  <div
                    className="absolute bottom-0 left-0 w-full bg-primary rounded-lg transition-all duration-1000"
                    style={{ height: day.height }}
                  />
                </div>
                <span
                  className={`text-[11px] font-medium ${
                    day.active ? "text-foreground font-bold" : "text-muted-foreground"
                  }`}
                >
                  {day.label}
                </span>
              </div>
            ))}
          </div>
        </div>

      {/* Category Shortcuts */}
      {categories.length > 0 && (
        <div className="px-6 mt-4 mb-1">
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => navigate(`/category/${encodeURIComponent(cat)}`)}
                className="flex flex-col items-center gap-1.5 min-w-[56px] bg-transparent border-none cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-2xl bg-surface flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
                  {categoryIcons[cat] || defaultCategoryIcon}
                </div>
                <span className="text-[11px] text-muted-foreground font-medium">{t("category." + cat) || cat}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Today's Plan */}
      <h2 className="px-6 mt-5 mb-3 text-lg font-semibold tracking-tight">{t("home.todayPlan")}</h2>
      {isLoading ? (
        <div className="mx-6"><Skeleton className="h-24 rounded-3xl" /></div>
      ) : todayPlan ? (
        <div
          className="mx-6 rounded-3xl p-6 flex justify-between items-center text-primary-foreground"
          style={{ background: "var(--gradient-plan)", boxShadow: "0 10px 30px hsl(var(--primary-glow))" }}
        >
          <div>
            <h3 className="text-xl font-semibold mb-1">{todayPlan.title}</h3>
            <p className="text-[13px] opacity-90">{todayPlan.duration} · {todayPlan.intensity ? t("home.intensity", [t("intensity." + todayPlan.intensity)]) : t("difficulty." + todayPlan.difficulty)}</p>
          </div>
          <button
            className="bg-card text-primary border-none px-5 py-2.5 rounded-full font-semibold text-sm cursor-pointer transition-all"
            style={{
              opacity: startClicked ? 0.8 : 1,
              transform: startClicked ? "scale(0.96)" : "scale(1)",
            }}
            onClick={() => {
              setStartClicked(true);
              setTimeout(() => navigate(`/course/${todayPlan.id}`, { state: { fromTab: 0 } }), 300);
            }}
          >
            {startClicked ? t("home.starting") : t("home.startNow")}
          </button>
        </div>
      ) : (
        <div
          className="mx-6 rounded-3xl p-5 bg-surface flex items-center justify-between cursor-pointer hover:bg-surface-elevated transition-colors"
          onClick={() => navigate("/?tab=1")}
        >
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-0.5">{t("home.noPlan")}</h3>
            <p className="text-xs text-muted-foreground">{t("home.noPlanDesc")}</p>
          </div>
          <BookOpen className="w-8 h-8 text-muted-foreground/40" />
        </div>
      )}

      {/* Recommended */}
      <h2 className="px-6 mt-5 mb-3 text-lg font-semibold tracking-tight">{t("home.recommended")}</h2>
      {isLoading ? (
        <div className="flex gap-4 px-6">
          <Skeleton className="min-w-[200px] h-[220px] rounded-2xl" />
          <Skeleton className="min-w-[200px] h-[220px] rounded-2xl" />
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2 px-6 scrollbar-hide">
          {recommended.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-36 rounded-2xl bg-card border border-border overflow-hidden cursor-pointer transition-colors active:bg-muted"
              onClick={() => navigate(`/course/${item.id}`, { state: { fromTab: 0 } })}
            >
              <div className="relative aspect-square overflow-hidden">
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                {item.tag && (
                  <span className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-[10px] px-2 py-0.5 rounded-full">
                    {t("tag." + item.tag)}
                  </span>
                )}
              </div>
              <div className="p-2.5 space-y-1">
                <div className="text-xs font-medium text-foreground line-clamp-2 leading-tight">{item.title}</div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">{t("difficulty." + item.difficulty)} · {item.duration}</span>
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <ChevronRight className="w-3.5 h-3.5 text-primary-foreground" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent Training */}
      {recentCourses.length > 0 && (
        <div className="px-6 mt-4">
          <h2 className="text-[15px] font-semibold mb-3">{t("home.recentTraining")}</h2>
          <div className="flex flex-col gap-2.5">
            {recentCourses.map((course: any) => (
              <div
                key={course.id}
                className="bg-surface rounded-2xl p-3.5 flex items-center gap-3.5 cursor-pointer hover:bg-surface-elevated transition-colors"
                onClick={() => navigate(`/course/${course.id}`, { state: { fromTab: 0 } })}
              >
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
        </div>
      )}

      {/* My Favorites & Recently Played */}
      <div className="px-6 mt-4 grid grid-cols-2 gap-3">
          <div
            className="bg-surface rounded-2xl p-4 cursor-pointer hover:bg-surface-elevated transition-colors flex items-center gap-3"
            onClick={() => navigate(user ? "/favorites" : `/auth?returnTo=${encodeURIComponent(`${location.pathname}${location.search}`)}`)}
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-foreground">{t("home.myFavorites")}</h3>
              <p className="text-[11px] text-muted-foreground">{t("home.courseCount", [favCount])}</p>
            </div>
          </div>
          <div
            className="bg-surface rounded-2xl p-4 cursor-pointer hover:bg-surface-elevated transition-colors flex items-center gap-3"
            onClick={() => navigate(user ? "/recently-played" : `/auth?returnTo=${encodeURIComponent(`${location.pathname}${location.search}`)}`)}
          >
            <div className="w-10 h-10 rounded-xl bg-accent-gold/15 flex items-center justify-center text-accent-gold flex-shrink-0">
              <Play className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-foreground">{t("home.recentlyPlayed")}</h3>
              <p className="text-[11px] text-muted-foreground">{t("home.recordCount", [recentCourses.length])}</p>
            </div>
          </div>
        </div>

      {/* Streak */}
      <div className="px-5 mt-4 mb-6">
          <div className="bg-surface rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent-gold/15 flex items-center justify-center text-accent-gold flex-shrink-0">
              <Star className="w-6 h-6" fill="currentColor" />
            </div>
            <div>
              <div className="text-sm font-semibold">{t("home.streak", [streak])}</div>
              <div className="text-xs text-muted-foreground">{streak > 0 ? t("home.streakGreat") : t("home.streakStart")}</div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default HomePage;
