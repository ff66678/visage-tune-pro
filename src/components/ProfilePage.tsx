import { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Camera, Settings, Sparkles, ChevronRight, Play } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useWorkoutStats, useRecentCourses } from "@/hooks/useWorkoutLogs";
import { useCourses } from "@/hooks/useCourses";
import SettingsDrawer from "@/components/SettingsDrawer";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { data: profile } = useProfile();
  const { totalWorkouts, streak } = useWorkoutStats();
  const { data: recentCourses = [] } = useRecentCourses();
  const { data: allCourses = [] } = useCourses();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const avatarUrl = profile?.avatar_url || "";
  const displayName = profile?.display_name || "用户";

  // Build current week days
  const weekDays = useMemo(() => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0=Sun
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

    const labels = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
    return labels.map((label, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const isToday = d.toDateString() === today.toDateString();
      return { label: isToday ? "今日" : label, date: d.getDate(), isToday };
    });
  }, []);

  const currentMonth = new Date().toLocaleDateString("zh-CN", { month: "long" });

  // Next recommended course
  const recentIds = new Set(recentCourses.map((c: any) => c?.id));
  const nextCourse = allCourses.find((c) => c.is_featured && !recentIds.has(c.id)) || allCourses[0];

  return (
    <div className="animate-fade-in pb-4">
      {/* Header */}
      <header className="flex justify-between items-center px-6 pt-8 pb-2">
        <div className="flex items-center gap-2 text-foreground">
          <Calendar className="w-5 h-5" />
          <span className="text-base font-semibold">{currentMonth}</span>
        </div>
        <h1 className="text-lg font-bold tracking-tight text-foreground">进度</h1>
        <button
          onClick={() => setSettingsOpen(true)}
          className="w-9 h-9 rounded-full overflow-hidden border-none cursor-pointer bg-transparent p-0"
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover rounded-full" />
          ) : (
            <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
              {displayName.slice(0, 1)}
            </div>
          )}
        </button>
      </header>

      {/* Week Calendar */}
      <div className="flex justify-between items-center px-6 py-4">
        {weekDays.map((day, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <span className={`text-[11px] font-medium ${day.isToday ? "text-primary" : "text-muted-foreground"}`}>
              {day.label}
            </span>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                day.isToday
                  ? "bg-foreground text-background shadow-md"
                  : "text-foreground"
              }`}
            >
              {day.date}
            </div>
          </div>
        ))}
      </div>

      {/* Photo Card */}
      <div className="mx-4 mt-2 rounded-[28px] bg-gradient-to-b from-[hsl(var(--primary)/0.08)] to-[hsl(var(--primary)/0.02)] p-6 pb-8 flex flex-col items-center">
        {/* Oval Frame */}
        <div className="relative mt-2 mb-6">
          {/* Sparkles */}
          <Sparkles className="absolute -top-2 -left-4 w-5 h-5 text-accent-gold/60 animate-pulse" />
          <Sparkles className="absolute top-6 -left-6 w-3.5 h-3.5 text-accent-gold/40" />
          <Sparkles className="absolute -bottom-2 -right-4 w-4 h-4 text-accent-gold/50 animate-pulse" style={{ animationDelay: "1s" }} />

          {/* Oval border frame */}
          <div className="w-[220px] h-[280px] rounded-[50%] border-[6px] border-card shadow-lg flex items-center justify-center overflow-hidden bg-surface relative">
            {/* Decorative dots */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-card shadow-sm z-10" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-card shadow-sm z-10" />
            <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-3 h-3 rounded-full bg-card shadow-sm z-10" />
            <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-3 h-3 rounded-full bg-card shadow-sm z-10" />

            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-muted-foreground gap-2">
                <Camera className="w-10 h-10 opacity-30" />
                <span className="text-xs opacity-50">等待记录</span>
              </div>
            )}
          </div>
        </div>

        {/* Text */}
        <h2 className="text-xl font-bold tracking-tight text-foreground mb-1.5">
          拍下你今天的样子吧！
        </h2>
        <p className="text-sm text-muted-foreground mb-6">见证你的进度</p>

        {/* Camera Button */}
        <button className="w-full max-w-[280px] py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-base flex items-center justify-center gap-2.5 border-none cursor-pointer shadow-md hover:opacity-90 active:scale-[0.97] transition-all">
          <Camera className="w-5 h-5" />
          拍照
        </button>
      </div>

      {/* Stats Summary */}
      <div className="flex justify-around px-6 mt-6 mb-2">
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-2xl font-bold tabular-nums">{totalWorkouts}</span>
          <span className="text-[11px] text-muted-foreground font-medium">总练习</span>
        </div>
        <div className="w-px bg-foreground/5" />
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-2xl font-bold tabular-nums">{streak}</span>
          <span className="text-[11px] text-muted-foreground font-medium">连续打卡</span>
        </div>
      </div>

      <div className="h-px bg-foreground/5 mx-6 my-5" />

      {/* Hero Card */}
      {nextCourse && (
        <div className="px-6 mb-4">
          <h3 className="text-lg font-semibold tracking-tight mb-3">推荐课程</h3>
          <div
            className="rounded-2xl overflow-hidden relative h-[180px] bg-surface cursor-pointer shadow-sm"
            onClick={() => navigate(`/course/${nextCourse.id}`)}
          >
            <img
              src={nextCourse.image_url}
              alt={nextCourse.title}
              className="absolute inset-0 w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent flex flex-col justify-end p-5">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-[11px] text-card/70 font-semibold uppercase tracking-wider mb-0.5">推荐</div>
                  <div className="text-xl font-semibold tracking-tight text-card">{nextCourse.title}</div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(`/course/${nextCourse.id}`); }}
                  className="w-10 h-10 rounded-full bg-card/95 flex items-center justify-center border-none text-primary shadow-lg cursor-pointer"
                >
                  <Play className="w-4 h-4" fill="currentColor" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Courses */}
      {recentCourses.length > 0 && (
        <div className="px-6 mt-2 flex flex-col gap-3 mb-8">
          <h3 className="text-lg font-semibold tracking-tight">最近练习</h3>
          {recentCourses.map((item: any) =>
            item ? (
              <div
                key={item.id}
                onClick={() => navigate(`/course/${item.id}`)}
                className="bg-surface rounded-xl p-3 flex items-center gap-4 cursor-pointer hover:bg-surface-hover transition-colors"
              >
                <div className="w-[60px] h-[60px] rounded-lg overflow-hidden flex-shrink-0">
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow flex flex-col justify-center">
                  <div className="text-sm font-semibold mb-0.5">{item.title}</div>
                  <div className="text-[12px] text-muted-foreground font-medium">{item.duration}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
              </div>
            ) : null
          )}
        </div>
      )}

      <SettingsDrawer open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
};

export default ProfilePage;
