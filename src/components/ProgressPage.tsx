import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Calendar, Sparkles, Loader2, ImageIcon } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useTodayPhoto, useProgressPhotos, useUploadProgressPhoto } from "@/hooks/useProgressPhotos";

const ProgressPage = () => {
  const navigate = useNavigate();
  const { data: profile } = useProfile();
  const { data: todayPhoto } = useTodayPhoto();
  const { data: recentPhotos = [] } = useProgressPhotos();
  const uploadMutation = useUploadProgressPhoto();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Build current week dates
  const today = new Date();
  const currentMonth = today.toLocaleDateString("zh-CN", { month: "long" });
  const dayOfWeek = today.getDay(); // 0=Sun
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);

  // Build a set of dates that have photos this week
  const photoDates = new Set(recentPhotos.map((p) => p.photo_date));

  const weekDays = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
  const weekDates = weekDays.map((label, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const isToday = d.toDateString() === today.toDateString();
    const dateStr = d.toISOString().split("T")[0];
    const hasPhoto = photoDates.has(dateStr);
    return { label: isToday ? "今日" : label, date: d.getDate(), isToday, hasPhoto };
  });

  const avatarUrl =
    profile?.avatar_url ||
    "https://images.pexels.com/photos/3750717/pexels-photo-3750717.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2";

  const displayPhoto = todayPhoto?.photo_url || null;

  const handleTakePhoto = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadMutation.mutate(file);
    }
    // Reset so same file can be re-selected
    e.target.value = "";
  };

  // Recent photos excluding today
  const todayStr = new Date().toISOString().split("T")[0];
  const pastPhotos = recentPhotos.filter((p) => p.photo_date !== todayStr);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <header className="flex justify-between items-center px-6 pt-6 pb-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="w-5 h-5" />
          <span className="text-base font-semibold">{currentMonth}</span>
        </div>
        <h1 className="text-lg font-semibold tracking-tight">进度</h1>
        <button
          onClick={() => navigate("/profile")}
          className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary/20 bg-card cursor-pointer p-0"
        >
          <img src={avatarUrl} alt="头像" className="w-full h-full object-cover" />
        </button>
      </header>

      {/* Week Calendar Strip */}
      <div className="flex justify-between items-center px-4 py-4">
        {weekDates.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
            <span
              className={`text-[11px] font-medium ${
                d.isToday ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {d.label}
            </span>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all relative ${
                d.isToday
                  ? "bg-card text-foreground shadow-md ring-2 ring-primary/20"
                  : "text-foreground"
              }`}
            >
              {d.date}
              {d.hasPhoto && (
                <div className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Photo Card */}
      <div className="mx-5 mt-2 rounded-3xl bg-gradient-to-b from-primary/10 via-card to-card p-6 pt-8 flex flex-col items-center shadow-sm">
        {/* Oval Photo Frame */}
        <div className="relative mb-8">
          {/* Decorative sparkles */}
          <Sparkles className="absolute -top-3 -left-6 w-5 h-5 text-accent-gold/60" />
          <Sparkles className="absolute top-1/4 -left-8 w-4 h-4 text-accent-gold/40" />
          <Sparkles className="absolute -bottom-2 -right-6 w-5 h-5 text-accent-gold/50" />
          <Sparkles className="absolute top-8 -right-8 w-4 h-4 text-accent-gold/30" />

          {/* Outer frame */}
          <div className="w-[240px] h-[300px] rounded-[50%] border-[6px] border-surface-elevated/80 bg-surface-elevated/40 flex items-center justify-center p-3 shadow-inner">
            {/* Inner photo */}
            <div className="w-full h-full rounded-[50%] overflow-hidden bg-surface flex items-center justify-center">
              {uploadMutation.isPending ? (
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              ) : displayPhoto ? (
                <img
                  src={displayPhoto}
                  alt="今日照片"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={avatarUrl}
                  alt="你的照片"
                  className="w-full h-full object-cover opacity-60"
                />
              )}
            </div>
          </div>

          {/* Decorative dots */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-surface-elevated" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 rounded-full bg-surface-elevated" />
          <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-surface-elevated" />
          <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-surface-elevated" />
        </div>

        {/* Text */}
        <h2 className="text-xl font-semibold tracking-tight mb-1.5">
          {displayPhoto ? "今天已记录 ✅" : "记录今天的你 ✨"}
        </h2>
        <p className="text-sm text-muted-foreground font-medium mb-6">
          {displayPhoto ? "明天继续坚持哦" : "每一天都是新的开始"}
        </p>

        {/* Camera Button */}
        <button
          onClick={handleTakePhoto}
          disabled={uploadMutation.isPending}
          className="w-full max-w-[280px] py-3.5 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center gap-2.5 text-base font-semibold border-none cursor-pointer shadow-md hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {uploadMutation.isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Camera className="w-5 h-5" />
          )}
          {displayPhoto ? "重新拍照" : "拍照"}
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

      {/* Recent Photos */}
      {pastPhotos.length > 0 && (
        <div className="px-5 mt-8">
          <h3 className="text-lg font-semibold tracking-tight mb-3">历史记录</h3>
          <div className="grid grid-cols-3 gap-2">
            {pastPhotos.map((photo) => (
              <div key={photo.id} className="relative aspect-[3/4] rounded-xl overflow-hidden bg-surface">
                <img
                  src={photo.photo_url}
                  alt={photo.photo_date}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-foreground/60 to-transparent p-2 pt-6">
                  <span className="text-[11px] text-card font-medium">
                    {new Date(photo.photo_date + "T00:00:00").toLocaleDateString("zh-CN", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom tip */}
      <div className="flex flex-col items-center text-center px-6 mt-8 mb-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <ImageIcon className="w-4 h-4" />
          <p className="text-[13px] font-medium leading-relaxed">
            已记录 {recentPhotos.length} 天 · 坚持见证蜕变 🌟
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
