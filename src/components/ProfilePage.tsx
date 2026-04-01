import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Clock, Play, ChevronRight } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useWorkoutStats, useHeatmapData, useRecentCourses } from "@/hooks/useWorkoutLogs";
import { useCourses } from "@/hooks/useCourses";
import SettingsDrawer from "@/components/SettingsDrawer";
import { useTranslation, useLanguage } from "@/i18n/LanguageContext";

const heatColors: Record<number, string> = {
  0: "bg-surface-elevated",
  1: "bg-[hsl(0_20%_87%)]",
  2: "bg-[hsl(0_22%_79%)]",
  3: "bg-primary",
  4: "bg-[hsl(0_20%_56%)]",
};

const ProfilePage = () => {
  const { t, locale } = useTranslation();
  const navigate = useNavigate();
  const { data: profile } = useProfile();
  const { totalWorkouts, activeWeeks, streak, categories } = useWorkoutStats();
  const heatmapCells = useHeatmapData();
  const { data: recentCourses = [] } = useRecentCourses();
  const { data: allCourses = [] } = useCourses();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [heroHovered, setHeroHovered] = useState(false);

  const recentIds = new Set(recentCourses.map((c: any) => c?.id));
  const nextCourse = allCourses.find((c) => c.is_featured && !recentIds.has(c.id)) || allCourses[0];

  const joinDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString(locale, { month: "long", day: "numeric" })
    : "";

  const weekLabels = [
    t("profile.weekSun"), t("profile.weekMon"), t("profile.weekTue"),
    t("profile.weekWed"), t("profile.weekThu"), t("profile.weekFri"), t("profile.weekSat"),
  ];

  const stats = [
    { label: t("profile.totalWorkouts"), value: String(totalWorkouts) },
    { label: t("profile.activeWeeks"), value: String(activeWeeks) },
    { label: t("profile.streak"), value: String(streak) },
    { label: t("profile.categories"), value: String(categories) },
  ];

  return (
    <div className="animate-fade-in pb-4">
      <header className="flex justify-between items-center px-6 pt-6">
        <button onClick={() => setSettingsOpen(true)} className="w-10 h-10 rounded-full bg-transparent flex items-center justify-center text-foreground hover:bg-foreground/5 transition-colors border-none cursor-pointer">
          <Settings className="w-5 h-5" />
        </button>
        <div className="w-10" />
      </header>

      <section className="flex flex-col items-center -mt-2 px-6">
        <div className="relative mb-4">
          <img src={profile?.avatar_url || "https://images.pexels.com/photos/3750717/pexels-photo-3750717.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2"} alt={profile?.display_name || t("home.user")} className="w-[120px] h-[120px] rounded-full object-cover border-[3px] border-card bg-card shadow-md" />
        </div>
        <h1 className="text-[28px] font-semibold tracking-tight mb-2">{profile?.display_name || t("home.user")}</h1>
        {joinDate && (
          <div className="flex gap-4 text-[13px] text-muted-foreground font-medium">
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-accent-gold" />{t("profile.joinedAt", [joinDate])}</span>
          </div>
        )}
      </section>

      <div className="grid grid-cols-2 gap-2.5 px-6 mt-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-surface rounded-xl p-4 flex flex-col gap-1">
            <span className="text-xs text-muted-foreground font-medium">{s.label}</span>
            <span className="text-2xl font-semibold tracking-tight tabular-nums">{s.value}</span>
          </div>
        ))}
      </div>

      <div className="h-px bg-foreground/5 mx-6 my-8" />

      <div className="px-6 mb-4">
        <h2 className="text-xl font-semibold tracking-tight mb-0.5">{t("profile.consistencyLog")}</h2>
        <p className="text-sm text-muted-foreground">{t("profile.consistencyDesc")}</p>
      </div>
      <div className="px-6 flex gap-2 items-end">
        <div className="flex flex-col justify-between h-[100px] pb-0.5">
          {weekLabels.map((l, i) => (
            <span key={i} className="text-[10px] text-muted-foreground font-medium leading-none">{l}</span>
          ))}
        </div>
        <div className="grid grid-cols-[repeat(20,1fr)] grid-rows-[repeat(7,1fr)] gap-1 flex-grow">
          {heatmapCells.map((level, i) => (
            <div key={i} className={`aspect-square rounded-[4px] ${heatColors[level]}`} />
          ))}
        </div>
      </div>
      {totalWorkouts === 0 && <p className="text-xs text-muted-foreground text-center mt-3">{t("profile.noRecords")}</p>}

      <div className="h-px bg-foreground/5 mx-6 my-8" />

      {nextCourse && (
        <div className="mx-6 rounded-3xl overflow-hidden relative h-[220px] bg-surface cursor-pointer shadow-sm"
          onMouseEnter={() => setHeroHovered(true)} onMouseLeave={() => setHeroHovered(false)} onClick={() => navigate(`/course/${nextCourse.id}`, { state: { fromTab: 3 } })}>
          <img src={nextCourse.image_url} alt={nextCourse.title} className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-500" style={{ transform: heroHovered ? "scale(1.03)" : "scale(1)" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent flex flex-col justify-between p-4 px-6">
            <div className="flex justify-between items-center"><span className="text-[13px] text-card/90 font-medium">{nextCourse.duration}</span></div>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-[13px] text-card/80 font-semibold uppercase tracking-wider mb-0.5">{t("profile.recommend")}</div>
                <div className="text-2xl font-semibold tracking-tight text-card">{nextCourse.title}</div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); navigate(`/course/${nextCourse.id}`, { state: { fromTab: 3 } }); }} className="w-11 h-11 rounded-full bg-card/95 flex items-center justify-center border-none text-primary shadow-lg cursor-pointer">
                <Play className="w-[18px] h-[18px]" fill="currentColor" />
              </button>
            </div>
          </div>
        </div>
      )}

      {recentCourses.length > 0 && (
        <div className="px-6 mt-6 flex flex-col gap-3">
          <h3 className="text-lg font-semibold tracking-tight">{t("profile.recentWorkouts")}</h3>
          {recentCourses.map((item: any) => item ? (
            <div key={item.id} onClick={() => navigate(`/course/${item.id}`)} className="bg-surface rounded-xl p-3 flex items-center gap-4 cursor-pointer hover:bg-surface-hover transition-colors">
              <div className="w-[68px] h-[68px] rounded-lg bg-surface-elevated relative overflow-hidden flex-shrink-0">
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover opacity-90" />
              </div>
              <div className="flex-grow flex flex-col justify-center">
                <div className="text-base font-semibold mb-0.5">{item.title}</div>
                <div className="text-[13px] text-muted-foreground font-medium">{item.duration}</div>
              </div>
              <div className="w-10 flex justify-center items-center text-muted-foreground/60"><ChevronRight className="w-5 h-5" /></div>
            </div>
          ) : null)}
        </div>
      )}

      <div className="flex flex-col items-center text-center px-6 mt-8 mb-12">
        <button onClick={() => navigate("/paywall")} className="inline-flex items-center gap-2 bg-card border border-foreground/[0.04] px-4 py-2 pl-2 rounded-full text-sm font-semibold shadow-sm mb-4 cursor-pointer">
          <div className="w-6 h-6 rounded-full bg-accent-gold flex items-center justify-center text-card text-xs shadow-md">+</div>
          {t("profile.premium")}
        </button>
        <p className="text-sm text-muted-foreground font-medium leading-relaxed">
          {t("profile.unlockDesc")}<br />{t("profile.upgradePremium")}
        </p>
      </div>

      <SettingsDrawer open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
};

export default ProfilePage;
