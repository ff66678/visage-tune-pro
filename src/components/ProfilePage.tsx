import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, CalendarDays } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import SettingsDrawer from "@/components/SettingsDrawer";

const getWeekDays = () => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sun
  // Monday as start
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));

  const labels = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
  return labels.map((label, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const isToday = d.toDateString() === now.toDateString();
    return { label: isToday ? "今日" : label, date: d.getDate(), isToday };
  });
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const { data: profile } = useProfile();
  const { user } = useAuth();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "用户";
  const avatarUrl = profile?.avatar_url;
  const initials = displayName.slice(0, 1).toUpperCase();

  const weekDays = getWeekDays();
  const currentMonth = new Date().getMonth() + 1;

  const handleCapture = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setCapturedPhoto(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const photoSrc = capturedPhoto || avatarUrl || "https://images.pexels.com/photos/3750717/pexels-photo-3750717.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2";

  return (
    <div className="animate-fade-in min-h-screen" style={{ background: "linear-gradient(180deg, hsl(145 30% 88%) 0%, hsl(var(--background)) 45%)" }}>
      {/* Header */}
      <nav className="flex justify-between items-center px-6 pt-8 pb-2">
        <div className="flex items-center gap-2 text-foreground/70">
          <CalendarDays className="w-5 h-5" />
          <span className="text-base font-semibold">{currentMonth}月</span>
        </div>
        <h1 className="text-lg font-bold tracking-tight text-foreground">进度</h1>
        <Avatar
          className="w-9 h-9 cursor-pointer ring-[1.5px] ring-primary/30"
          onClick={() => setSettingsOpen(true)}
        >
          {avatarUrl && <AvatarImage src={avatarUrl} alt="Avatar" />}
          <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">{initials}</AvatarFallback>
        </Avatar>
      </nav>

      {/* Weekly Calendar Strip */}
      <div className="flex justify-between items-center px-6 mt-4 mb-6">
        {weekDays.map((day, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <span className={`text-xs font-medium ${day.isToday ? "text-primary font-bold" : "text-muted-foreground"}`}>
              {day.label}
            </span>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                day.isToday
                  ? "bg-card text-foreground shadow-md ring-2 ring-primary/20"
                  : "text-muted-foreground"
              }`}
            >
              {day.date}
            </div>
          </div>
        ))}
      </div>

      {/* Photo Frame Card */}
      <div className="mx-5 bg-card rounded-[28px] shadow-sm pt-10 pb-8 px-6 flex flex-col items-center relative overflow-hidden">
        {/* Sparkle decorations */}
        <svg className="absolute top-16 left-8 text-accent-gold/40" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
        <svg className="absolute top-24 left-14 text-accent-gold/25" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
        <svg className="absolute bottom-32 right-10 text-accent-gold/35" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
        <svg className="absolute top-40 right-6 text-accent-gold/20" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>

        {/* Oval frame */}
        <div className="relative mb-8">
          {/* Outer decorative oval border */}
          <div className="w-[240px] h-[300px] rounded-[50%] border-[3px] border-foreground/[0.06] flex items-center justify-center relative">
            {/* Decorative dots on border */}
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-card border-2 border-foreground/10" />
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-card border-2 border-foreground/10" />
            <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 rounded-full bg-card border-2 border-foreground/10" />
            <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 rounded-full bg-card border-2 border-foreground/10" />

            {/* Inner photo oval */}
            <div className="w-[210px] h-[270px] rounded-[50%] overflow-hidden bg-surface">
              <img
                src={photoSrc}
                alt="Progress"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* CTA text */}
        <h2 className="text-xl font-bold tracking-tight text-foreground mb-1.5">
          拍下你今天的样子吧！
        </h2>
        <p className="text-sm text-muted-foreground font-medium mb-6">
          见证你的进度
        </p>

        {/* Capture button */}
        <button
          onClick={handleCapture}
          className="w-full max-w-[280px] flex items-center justify-center gap-2.5 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-base border-none cursor-pointer hover:opacity-90 transition-opacity shadow-md"
        >
          <Camera className="w-5 h-5" />
          拍照
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="user"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <SettingsDrawer open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
};

export default ProfilePage;
