import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { X, Heart } from "lucide-react";
import { useCourse } from "@/hooks/useCourses";
import { useAuth } from "@/contexts/AuthContext";
import { useFavoriteIds, useToggleFavorite } from "@/hooks/useFavorites";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "@/i18n/LanguageContext";
  

const TimerRing = ({ dashOffset }: { dashOffset: number }) => (
  <svg className="w-full h-full" style={{ transform: "rotate(-90deg)" }}>
    <circle cx="96" cy="96" r="90" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/10" />
    <circle cx="96" cy="96" r="90" stroke="hsl(var(--primary))" strokeWidth="6" fill="transparent" strokeLinecap="round"
      style={{ strokeDasharray: "283", strokeDashoffset: dashOffset, transition: "stroke-dashoffset 1s linear" }} />
  </svg>
);

const RewindIcon = () => (
  <svg width="30" height="30" fill="currentColor" viewBox="0 0 256 256">
    <path d="M230.66,55.5A15.87,15.87,0,0,0,215,56.88L128,111.5V72a16,16,0,0,0-25.37-12.9l-96,72a16,16,0,0,0,0,25.8l96,72A16,16,0,0,0,128,216V176.5l87,54.62A16,16,0,0,0,240,216V72A16,16,0,0,0,230.66,55.5Z" />
  </svg>
);

const FastForwardIcon = () => (
  <svg width="30" height="30" fill="currentColor" viewBox="0 0 256 256">
    <path d="M25.34,55.5A16,16,0,0,1,41,56.88L128,111.5V72a16,16,0,0,1,25.37-12.9l96,72a16,16,0,0,1,0,25.8l-96,72A16,16,0,0,1,128,216V176.5L41,231.12A16,16,0,0,1,16,216V72A16,16,0,0,1,25.34,55.5Z" />
  </svg>
);

const PauseIcon = () => (
  <svg width="30" height="30" fill="currentColor" viewBox="0 0 256 256">
    <path d="M200,32H160a16,16,0,0,0-16,16V208a16,16,0,0,0,16,16h40a16,16,0,0,0,16-16V48A16,16,0,0,0,200,32Zm0,176H160V48h40ZM96,32H56A16,16,0,0,0,40,48V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V48A16,16,0,0,0,96,32Zm0,176H56V48H96Z" />
  </svg>
);

const PlayIcon = () => (
  <svg width="30" height="30" fill="currentColor" viewBox="0 0 256 256">
    <path d="M240,128a15.74,15.74,0,0,1-7.6,13.51L88.32,229.65a16,16,0,0,1-16.2.3A15.86,15.86,0,0,1,64,216.13V39.87a15.86,15.86,0,0,1,8.12-13.82,16,16,0,0,1,16.2.3L232.4,114.49A15.74,15.74,0,0,1,240,128Z" />
  </svg>
);

const WorkoutPlayer = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const fromTab = (location.state as any)?.fromTab ?? 0;
  const [isPlaying, setIsPlaying] = useState(true);
  const [seconds, setSeconds] = useState(45);
  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const navigate = useNavigate();
  const { data: course } = useCourse(id);
  const { user } = useAuth();
  const { data: favoriteIds } = useFavoriteIds();
  const toggleFavorite = useToggleFavorite();
  const queryClient = useQueryClient();
  const containerRef = useRef<HTMLDivElement>(null);

  const isFavorited = id ? (favoriteIds?.has(id) ?? false) : false;

  const handleToggleFavorite = () => {
    if (!user) {
      toast(t("workout.loginFirst"), { description: t("workout.loginToFav") });
      return;
    }
    if (!id) return;
    toggleFavorite.mutate({ courseId: id, isFavorited });
  };

  const parseDuration = (dur: string | undefined): number => {
    if (!dur) return 60;
    const nums = dur.match(/(\d+)/g);
    if (!nums) return 60;
    if (dur.includes("分") || dur.includes("min")) return parseInt(nums[0]) * 60 + (nums[1] ? parseInt(nums[1]) : 0);
    if (dur.includes(":")) return parseInt(nums[0]) * 60 + (nums[1] ? parseInt(nums[1]) : 0);
    return parseInt(nums[0]) * 60;
  };

  const [totalSeconds, setTotalSeconds] = useState(60);

  useEffect(() => {
    if (course?.duration) {
      const parsed = parseDuration(course.duration);
      setTotalSeconds(parsed);
      setSeconds(parsed);
    }
  }, [course?.duration]);

  const circumference = 283;
  const dashOffset = (1 - seconds / totalSeconds) * circumference;
  const elapsed = totalSeconds - seconds;

  useEffect(() => {
    if (seconds === 0 && !isFinished && user && id) {
      setIsFinished(true);
      supabase.from("workout_logs").insert({ user_id: user.id, course_id: id, duration_seconds: totalSeconds })
        .then(({ error }) => {
          if (!error) {
            queryClient.invalidateQueries({ queryKey: ["workout-logs"] });
            toast.success(t("workout.completed"));
          }
        });
    }
  }, [seconds, isFinished, user, id, totalSeconds, queryClient, t]);

  useEffect(() => {
    if (isPlaying && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) { clearInterval(intervalRef.current!); setIsPlaying(false); return 0; }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, seconds]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const handleRewind = () => setSeconds((prev) => Math.min(prev + 10, totalSeconds));
  const handleFastForward = () => setSeconds((prev) => Math.max(prev - 10, 0));
  const handlePlayPause = () => {
    if (seconds === 0) { setSeconds(totalSeconds); setIsPlaying(true); setIsFinished(false); }
    else { setIsPlaying((prev) => !prev); }
  };

  const handleClose = () => {
    if (containerRef.current) {
      containerRef.current.style.transition = "transform 0.35s ease-in, opacity 0.35s ease-in";
      containerRef.current.style.transform = "translateY(100%)";
      containerRef.current.style.opacity = "0";
      setTimeout(() => navigate(`/?tab=${fromTab}`, { replace: true }), 320);
    }
  };

  const courseTitle = course?.title || t("workout.training");

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden animate-slide-in-up">
      <div className="absolute inset-0 z-0">
        <img src={course?.image_url || "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} alt="" className="w-full h-full object-cover opacity-90" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 40%, rgba(0,0,0,0.8) 100%)" }} />
      </div>

      <div className="absolute top-12 left-0 w-full px-6 flex justify-between items-center z-20">
        <button onClick={handleClose} className="w-10 h-10 rounded-full flex items-center justify-center text-white border border-white/20 bg-white/15 backdrop-blur-xl">
          <X className="w-5 h-5" />
        </button>
        <div className="text-center"><h2 className="text-sm font-bold tracking-wide">{courseTitle}</h2></div>
        <button onClick={handleToggleFavorite} className="w-10 h-10 rounded-full flex items-center justify-center border border-white/20 bg-white/15 backdrop-blur-xl active:scale-90 transition-transform">
          <Heart className={`w-5 h-5 transition-all duration-300 ${isFavorited ? 'scale-110' : 'text-white scale-100'}`} style={isFavorited ? { color: 'hsl(var(--primary))', fill: 'hsl(var(--primary))' } : undefined} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative z-10 pt-20">
        <div className="relative w-48 h-48 flex items-center justify-center mb-8"><TimerRing dashOffset={dashOffset} /></div>
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">{course?.title || t("workout.training")}</h1>
          <p className="text-white/70 text-sm px-12">{course?.description || ""}</p>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/10 px-6 pt-6 pb-12 bg-white/5 backdrop-blur-3xl">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[10px] font-mono text-white/50">{formatTime(elapsed)}</span>
          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${totalSeconds > 0 ? (elapsed / totalSeconds) * 100 : 0}%`, background: "linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--primary)) 100%)" }} />
          </div>
          <span className="text-[10px] font-mono text-white/50">{formatTime(totalSeconds)}</span>
        </div>
        <div className="flex justify-center items-center">
          <div className="flex items-center gap-8">
            <button className="text-white/80 active:scale-90 transition-transform" onClick={handleRewind}><RewindIcon /></button>
            <button className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-xl active:scale-90 transition-transform text-foreground" onClick={handlePlayPause}>
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
            <button className="text-white/80 active:scale-90 transition-transform" onClick={handleFastForward}><FastForwardIcon /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutPlayer;
