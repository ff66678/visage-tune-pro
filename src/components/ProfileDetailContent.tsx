import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Gift, Share2, ChevronLeft, ChevronRight, Flame, Trophy, Calendar as CalendarIcon, Dumbbell } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useWorkoutStats, useWorkoutLogs, useRecentCourses } from "@/hooks/useWorkoutLogs";
import SettingsDrawer from "@/components/SettingsDrawer";
import { toast } from "sonner";
import { useTranslation, useLanguage } from "@/i18n/LanguageContext";

const ProfileDetailContent = () => {
  const { t, locale } = useTranslation();
  const navigate = useNavigate();
  const { data: profile } = useProfile();
  const { totalWorkouts, streak, longestStreak, totalDuration, practiceDays } = useWorkoutStats();
  const { data: logs = [] } = useWorkoutLogs();
  const { data: recentCourses = [] } = useRecentCourses();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [calMonth, setCalMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const joinDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString(locale, { month: "long", day: "numeric" })
    : "";

  const hours = Math.floor(totalDuration / 3600);
  const mins = Math.floor((totalDuration % 3600) / 60);
  const durationStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  const workoutDaySet = new Set(
    logs.map((l) => {
      const d = new Date(l.completed_at);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    })
  );

  const today = new Date();
  const calYear = calMonth.getFullYear();
  const calMon = calMonth.getMonth();
  const daysInMonth = new Date(calYear, calMon + 1, 0).getDate();
  const firstDayOfWeek = new Date(calYear, calMon, 1).getDay();
  const weekLabels = [
    t("profile.weekSun"), t("profile.weekMon"), t("profile.weekTue"),
    t("profile.weekWed"), t("profile.weekThu"), t("profile.weekFri"), t("profile.weekSat"),
  ];
  const monthLabel = calMonth.toLocaleDateString(locale, { year: "numeric", month: "long" });

  const canGoNext = calYear < today.getFullYear() || (calYear === today.getFullYear() && calMon < today.getMonth());

  const handleShareStats = async () => {
    const text = t("profileDetail.shareStatsText", [practiceDays, totalWorkouts, durationStr]);
    if (navigator.share) {
      try { await navigator.share({ title: "GLOW", text, url: window.location.origin }); } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      toast.success(t("profileDetail.copiedToClipboard"));
    }
  };

  const handleShareStreak = async () => {
    const text = t("profileDetail.shareStreakText", [streak, longestStreak]);
    if (navigator.share) {
      try { await navigator.share({ title: "GLOW", text, url: window.location.origin }); } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      toast.success(t("profileDetail.copiedToClipboard"));
    }
  };

  const monthWorkoutDays = Array.from({ length: daysInMonth }, (_, i) => {
    const key = `${calYear}-${calMon}-${i + 1}`;
    return workoutDaySet.has(key) ? 1 : 0;
  }).reduce((a, b) => a + b, 0);

  return (
    <div className="animate-fade-in pb-4">
      <div className="pt-6" />

      <section className="flex flex-col items-center -mt-2 px-6">
        <div className="relative mb-4">
          <img src={profile?.avatar_url || "https://images.pexels.com/photos/3750717/pexels-photo-3750717.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2"} alt={profile?.display_name || t("home.user")} className="w-[120px] h-[120px] rounded-full object-cover border-[3px] border-card bg-card shadow-md" />
        </div>
        <h1 className="text-[28px] font-semibold tracking-tight mb-2">{profile?.display_name || t("home.user")}</h1>
        {joinDate && (
          <div className="flex gap-4 text-[13px] text-muted-foreground font-medium">
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-accent" />{t("profile.joinedAt", [joinDate])}</span>
          </div>
        )}
      </section>

      <div className="px-5 mt-8">
        <div className="bg-surface rounded-3xl p-6 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center mb-3">
            <span className="text-3xl font-bold text-primary tabular-nums">{practiceDays}</span>
          </div>
          <p className="text-sm text-muted-foreground font-medium mb-6">{t("profileDetail.practiceDays")}</p>

          <div className="grid grid-cols-3 gap-4 w-full mb-5">
            <div className="flex flex-col items-center gap-1">
              <Dumbbell className="w-4 h-4 text-muted-foreground" />
              <span className="text-lg font-semibold tabular-nums">{totalWorkouts}</span>
              <span className="text-[11px] text-muted-foreground">{t("profileDetail.totalCourses")}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-lg font-semibold tabular-nums">{durationStr}</span>
              <span className="text-[11px] text-muted-foreground">{t("profileDetail.practiceTime")}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Trophy className="w-4 h-4 text-muted-foreground" />
              <span className="text-lg font-semibold tabular-nums">{longestStreak}</span>
              <span className="text-[11px] text-muted-foreground">{t("profileDetail.longestStreak")}</span>
            </div>
          </div>

          <button onClick={handleShareStats} className="w-full bg-card text-foreground rounded-2xl py-3 text-sm font-semibold flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-transform">
            <Share2 className="w-4 h-4" />{t("profileDetail.shareStats")}
          </button>
        </div>
      </div>

      <div className="px-5 mt-4">
        <div className="bg-surface rounded-3xl p-6 flex flex-col">
          <div className="grid grid-cols-3 gap-4 w-full mb-5">
            <div className="flex flex-col items-center gap-1">
              <Flame className="w-4 h-4 text-primary" />
              <span className="text-lg font-semibold tabular-nums">{practiceDays}</span>
              <span className="text-[11px] text-muted-foreground">{t("profileDetail.totalPracticeDays")}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Trophy className="w-4 h-4 text-primary" />
              <span className="text-lg font-semibold tabular-nums">{longestStreak}</span>
              <span className="text-[11px] text-muted-foreground">{t("profileDetail.longestStreak")}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Flame className="w-4 h-4 text-primary" />
              <span className="text-lg font-semibold tabular-nums">{streak}</span>
              <span className="text-[11px] text-muted-foreground">{t("profileDetail.currentStreak")}</span>
            </div>
          </div>

          <div className="h-px bg-foreground/5 w-full mb-5" />

          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setCalMonth(new Date(calYear, calMon - 1, 1))} className="p-1 rounded-full hover:bg-foreground/5 transition-colors">
              <ChevronLeft className="w-4.5 h-4.5 text-muted-foreground" />
            </button>
            <span className="text-sm font-semibold">{monthLabel}</span>
            <button onClick={() => canGoNext && setCalMonth(new Date(calYear, calMon + 1, 1))} className={`p-1 rounded-full transition-colors ${canGoNext ? "hover:bg-foreground/5" : "opacity-30"}`} disabled={!canGoNext}>
              <ChevronRight className="w-4.5 h-4.5 text-muted-foreground" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekLabels.map((l) => (
              <div key={l} className="text-center text-[10px] text-muted-foreground font-medium">{l}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (<div key={`empty-${i}`} className="aspect-square" />))}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const hasWorkout = workoutDaySet.has(`${calYear}-${calMon}-${day}`);
              const isToday = calYear === today.getFullYear() && calMon === today.getMonth() && day === today.getDate();
              return (
                <div key={day} className={`aspect-square rounded-full flex items-center justify-center text-xs font-medium transition-colors ${hasWorkout ? "bg-primary text-primary-foreground" : isToday ? "ring-1 ring-primary text-foreground" : "text-muted-foreground"}`}>
                  {day}
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-muted-foreground text-center mt-3">{t("profileDetail.monthPractice", [monthWorkoutDays])}</p>

          <button onClick={handleShareStreak} className="w-full bg-card text-foreground rounded-2xl py-3 text-sm font-semibold flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-transform mt-5">
            <Share2 className="w-4 h-4" />{t("profileDetail.shareStreak")}
          </button>
        </div>
      </div>

      <div className="px-5 mt-4">
        <div className="rounded-3xl p-6 flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-transform"
          style={{ background: "linear-gradient(135deg, hsl(var(--accent-gold)), hsl(var(--accent-gold) / 0.75))" }}
          onClick={() => navigate("/gift")}>
          <div className="w-12 h-12 rounded-2xl bg-card/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
            <Gift className="w-6 h-6 text-card" />
          </div>
          <div className="flex-grow">
            <h3 className="text-base font-semibold text-card">{t("profileDetail.giftTitle")}</h3>
            <p className="text-[13px] text-card/80 mt-0.5">{t("profileDetail.giftDesc")}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-card/70 flex-shrink-0" />
        </div>
      </div>

      {practiceDays > 0 && (
        <div className="px-5 mt-4">
          <div className="bg-surface rounded-3xl p-5 flex flex-col items-center text-center">
            <p className="text-sm text-foreground font-medium leading-relaxed">
              {t("profileDetail.journeyDays", [practiceDays])}
            </p>
            <p className="text-[11px] text-muted-foreground mt-1.5">
              {today.toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
        </div>
      )}

      {recentCourses.length > 0 && (
        <div className="px-5 mt-6 flex flex-col gap-3">
          <h3 className="text-lg font-semibold tracking-tight px-1">{t("profile.recentWorkouts")}</h3>
          {recentCourses.map((item: any) => item ? (
            <div key={item.id} onClick={() => navigate(`/course/${item.id}`)} className="bg-surface rounded-xl p-3 flex items-center gap-4 cursor-pointer hover:bg-surface-hover transition-colors">
              <div className="w-[68px] h-[68px] rounded-lg bg-card relative overflow-hidden flex-shrink-0">
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

      <div className="h-8" />
      <SettingsDrawer open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
};

export default ProfileDetailContent;
