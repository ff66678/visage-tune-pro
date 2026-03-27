import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Gift, Star, Crown } from "lucide-react";
import { useCourses } from "@/hooks/useCourses";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { useWeeklyProgress, useWorkoutStats } from "@/hooks/useWorkoutLogs";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";


const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "早上好，";
  if (h < 18) return "下午好，";
  return "晚上好，";
};

const HomePage = () => {
  const [startClicked, setStartClicked] = useState(false);
  const navigate = useNavigate();
  const { data: courses, isLoading } = useCourses();
  const { data: profile } = useProfile();
  const { user } = useAuth();

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "用户";
  const avatarUrl = profile?.avatar_url;
  const initials = displayName.slice(0, 1).toUpperCase();

  const { weekData, percentage } = useWeeklyProgress();
  const { streak } = useWorkoutStats();
  const todayPlan = courses?.find((c) => c.is_today_plan);
  const recommended = courses?.filter((c) => c.is_featured) ?? [];

  return (
    <div className="animate-fade-in">
      {/* Top Nav */}
      <nav className="flex justify-between items-center px-6 pt-8 pb-4 sticky top-0 bg-background/85 backdrop-blur-xl z-40">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 ring-[1.5px] ring-primary cursor-pointer" onClick={() => navigate("/profile")}>
            {avatarUrl && <AvatarImage src={avatarUrl} alt="Avatar" />}
            <AvatarFallback className="text-sm font-semibold bg-primary/10 text-primary">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">{getGreeting()}</span>
            <span className="text-base font-semibold text-foreground">{displayName}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/membership")}
            className="bg-primary/10 border-none text-primary cursor-pointer px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-primary/15 transition-colors"
          >
            <Crown className="w-4 h-4" />
            <span className="text-xs font-semibold">PRO</span>
          </button>
          <button
            onClick={() => navigate("/gift")}
            className="relative bg-transparent border-none text-foreground cursor-pointer p-2 rounded-full hover:bg-foreground/5 transition-colors"
          >
            <Gift className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background" />
          </button>
        </div>
      </nav>

      {/* Weekly Progress */}
      <div className="mx-6 bg-surface rounded-3xl p-6 mb-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[15px] font-semibold">每周进度</h2>
          <span className="text-[13px] text-primary font-semibold">完成 {percentage}%</span>
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

      {/* Today's Plan */}
      <h2 className="px-6 mt-8 mb-3 text-lg font-semibold tracking-tight">今日计划</h2>
      {isLoading ? (
        <div className="mx-6"><Skeleton className="h-24 rounded-3xl" /></div>
      ) : todayPlan ? (
        <div
          className="mx-6 rounded-3xl p-6 flex justify-between items-center text-primary-foreground"
          style={{ background: "var(--gradient-plan)", boxShadow: "0 10px 30px hsl(var(--primary-glow))" }}
        >
          <div>
            <h3 className="text-xl font-semibold mb-1">{todayPlan.title}</h3>
            <p className="text-[13px] opacity-90">{todayPlan.duration} · {todayPlan.intensity ? `${todayPlan.intensity}强度` : todayPlan.difficulty}</p>
          </div>
          <button
            className="bg-card text-primary border-none px-5 py-2.5 rounded-full font-semibold text-sm cursor-pointer transition-all"
            style={{
              opacity: startClicked ? 0.8 : 1,
              transform: startClicked ? "scale(0.96)" : "scale(1)",
            }}
            onClick={() => {
              setStartClicked(true);
              setTimeout(() => navigate(`/course/${todayPlan.id}`), 300);
            }}
          >
            {startClicked ? "开始中..." : "立即开始"}
          </button>
        </div>
      ) : null}

      {/* Recommended */}
      <h2 className="px-6 mt-8 mb-3 text-lg font-semibold tracking-tight">为你推荐</h2>
      {isLoading ? (
        <div className="flex gap-4 px-6">
          <Skeleton className="min-w-[240px] h-40 rounded-lg" />
          <Skeleton className="min-w-[240px] h-40 rounded-lg" />
        </div>
      ) : (
        <div className="flex overflow-x-auto gap-4 px-6 pb-4 no-scrollbar">
          {recommended.map((item) => (
            <div
              key={item.id}
              className="min-w-[240px] h-40 bg-surface-elevated rounded-lg relative overflow-hidden flex-shrink-0 cursor-pointer group"
              onClick={() => navigate(`/course/${item.id}`)}
            >
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-foreground/70 to-transparent">
                <span className="text-[10px] uppercase tracking-wider text-background/80 bg-accent-gold/90 px-1.5 py-0.5 rounded font-bold mb-1.5 inline-block">
                  {item.tag}
                </span>
                <h3 className="text-base font-semibold text-card m-0">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Streak */}
      <div className="px-5 mt-2 mb-6">
        <div className="bg-surface rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent-gold/15 flex items-center justify-center text-accent-gold flex-shrink-0">
            <Star className="w-6 h-6" fill="currentColor" />
          </div>
          <div>
            <div className="text-sm font-semibold">连续打卡 {streak} 天</div>
            <div className="text-xs text-muted-foreground">{streak > 0 ? "太棒了，继续保持！" : "今天开始打卡吧！"}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
