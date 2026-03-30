import { useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Sparkles, Loader2, ImageIcon } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useTodayPhoto, useProgressPhotos, useUploadProgressPhoto } from "@/hooks/useProgressPhotos";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const ProgressPage = () => {
  const navigate = useNavigate();
  const { data: profile } = useProfile();
  const { data: todayPhoto } = useTodayPhoto();
  const { data: recentPhotos = [] } = useProgressPhotos();
  const uploadMutation = useUploadProgressPhoto();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const [weekOffset, setWeekOffset] = useState(0);
  const [slideDir, setSlideDir] = useState<"left" | "right" | null>(null);
  const [selectedDate, setSelectedDate] = useState(todayStr);

  const changeWeek = (dir: number) => {
    const newOffset = dir < 0 ? weekOffset - 1 : Math.min(weekOffset + 1, 0);
    if (newOffset === weekOffset) return;
    setSlideDir(dir < 0 ? "right" : "left");
    setTimeout(() => {
      setWeekOffset(newOffset);
      setSlideDir(null);
    }, 200);
  };

  // Compute the monday of the displayed week
  const dayOfWeek = today.getDay(); // 0=Sun
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset + weekOffset * 7);

  // Month/year label based on the monday of the displayed week
  const displayMonth = monday.toLocaleDateString("zh-CN", { year: "numeric", month: "long" });

  // Build a set of dates that have photos
  const photoDates = new Set(recentPhotos.map((p) => p.photo_date));

  const weekDayLabels = ["一", "二", "三", "四", "五", "六", "日"];
  const weekDates = weekDayLabels.map((label, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const isToday = d.toDateString() === today.toDateString();
    const dateStr = d.toISOString().split("T")[0];
    const hasPhoto = photoDates.has(dateStr);
    const isSelected = dateStr === selectedDate;
    return { label, date: d.getDate(), isToday, hasPhoto, isSelected, dateStr };
  });

  const avatarUrl =
    profile?.avatar_url ||
    "https://images.pexels.com/photos/3750717/pexels-photo-3750717.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2";

  const isSelectedToday = selectedDate === todayStr;
  const selectedPhoto = recentPhotos.find((p) => p.photo_date === selectedDate);
  const displayPhoto = selectedPhoto?.photo_url || null;

  const handleTakePhoto = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadMutation.mutate(file);
    }
    e.target.value = "";
  };

  const pastPhotos = recentPhotos.filter((p) => p.photo_date !== todayStr);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <header className="flex justify-between items-center px-6 pt-6 pb-2">
        <Popover>
          <PopoverTrigger asChild>
            <button className="w-9 h-9 rounded-full bg-surface-elevated flex items-center justify-center cursor-pointer hover:bg-surface-hover transition-colors">
              <CalendarIcon className="w-5 h-5 text-muted-foreground" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start" sideOffset={8}>
            <Calendar
              mode="single"
              selected={(() => {
                const d = new Date(today);
                d.setDate(today.getDate() + mondayOffset + weekOffset * 7);
                return d;
              })()}
              onSelect={(date) => {
                if (!date) return;
                const diffDays = Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                const dayOfWeekSelected = date.getDay();
                const mondayOffsetSelected = dayOfWeekSelected === 0 ? -6 : 1 - dayOfWeekSelected;
                const selectedMonday = new Date(date);
                selectedMonday.setDate(date.getDate() + mondayOffsetSelected);
                const todayMonday = new Date(today);
                todayMonday.setDate(today.getDate() + mondayOffset);
                const weekDiff = Math.round((selectedMonday.getTime() - todayMonday.getTime()) / (1000 * 60 * 60 * 24 * 7));
                setWeekOffset(Math.min(weekDiff, 0));
              }}
              className={cn("p-3 pointer-events-auto")}
              modifiers={{ hasPhoto: recentPhotos.map(p => new Date(p.photo_date + "T00:00:00")) }}
              modifiersStyles={{ hasPhoto: { fontWeight: 700, color: "hsl(var(--primary))" } }}
            />
          </PopoverContent>
        </Popover>
        <h1 className="text-lg font-semibold tracking-tight">进度</h1>
        <button
          onClick={() => navigate("/profile")}
          className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary/20 bg-card cursor-pointer p-0"
        >
          <img src={avatarUrl} alt="头像" className="w-full h-full object-cover" />
        </button>
      </header>

      {/* Week Calendar Strip */}
      <div className="mx-4 mt-2 rounded-2xl bg-surface p-4">
        {/* Month nav */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => changeWeek(-1)}
            className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:bg-surface transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-base font-semibold tracking-tight">{displayMonth}</span>
          <button
            onClick={() => changeWeek(1)}
            className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:bg-surface transition-colors cursor-pointer disabled:opacity-30"
            disabled={weekOffset >= 0}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Day labels + dates — swipeable */}
        <div
          className={`flex justify-between items-center touch-pan-y overflow-visible py-1 transition-all duration-200 ease-out ${
            slideDir === "left"
              ? "opacity-0 -translate-x-4"
              : slideDir === "right"
              ? "opacity-0 translate-x-4"
              : "opacity-100 translate-x-0"
          }`}
          onTouchStart={(e) => {
            (e.currentTarget as any)._touchX = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            const startX = (e.currentTarget as any)._touchX as number | undefined;
            if (startX === undefined) return;
            const diff = e.changedTouches[0].clientX - startX;
            if (Math.abs(diff) > 50) {
              changeWeek(diff > 0 ? -1 : 1);
            }
          }}
        >
          {weekDates.map((d, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 flex-1 cursor-pointer"
              onClick={() => setSelectedDate(d.dateStr)}
            >
              <span className="text-[12px] font-medium text-muted-foreground">{d.label}</span>
              <div className="relative">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    d.isToday && d.isSelected
                      ? "bg-primary text-primary-foreground shadow-md"
                      : d.isSelected
                      ? "bg-accent text-accent-foreground shadow-md"
                      : d.isToday
                      ? "bg-primary/20 text-primary"
                      : d.hasPhoto
                      ? "ring-2 ring-primary text-primary"
                      : "text-foreground"
                  }`}
                >
                  {d.date}
                </div>
              </div>
            </div>
          ))}
        </div>
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
          {displayPhoto
            ? isSelectedToday ? "今天已记录 ✅" : `${new Date(selectedDate + "T00:00:00").toLocaleDateString("zh-CN", { month: "long", day: "numeric" })} 的记录`
            : isSelectedToday ? "记录今天的你 ✨" : "这天没有记录"}
        </h2>
        <p className="text-sm text-muted-foreground font-medium mb-6">
          {displayPhoto
            ? isSelectedToday ? "明天继续坚持哦" : "记录你的变化"
            : isSelectedToday ? "每一天都是新的开始" : "坚持记录，见证蜕变"}
        </p>

        {/* Camera Button — only show for today */}
        {isSelectedToday && (
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
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="user"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* History Section */}
      <div className="px-5 mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold tracking-tight">历史记录</h3>
          {recentPhotos.length > 0 && (
            <span className="text-[13px] text-muted-foreground font-medium">
              共 {recentPhotos.length} 天
            </span>
          )}
        </div>

        {pastPhotos.length > 0 ? (
          <div className="grid grid-cols-3 gap-2.5">
            {pastPhotos.map((photo) => {
              const d = new Date(photo.photo_date + "T00:00:00");
              const dayLabel = d.toLocaleDateString("zh-CN", { weekday: "short" });
              const dateLabel = d.toLocaleDateString("zh-CN", { month: "short", day: "numeric" });
              return (
                <div
                  key={photo.id}
                  className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-surface group"
                >
                  <img
                    src={photo.photo_url}
                    alt={photo.photo_date}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 inset-x-0 p-2.5 flex flex-col">
                    <span className="text-[10px] text-card/70 font-medium">{dayLabel}</span>
                    <span className="text-[13px] text-card font-semibold">{dateLabel}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-surface rounded-2xl p-8 flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-surface-elevated flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-muted-foreground/50" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">还没有历史记录</p>
              <p className="text-xs text-muted-foreground/70 mt-1">每天拍一张，见证你的蜕变之旅</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom spacer */}
      <div className="h-8" />
    </div>
  );
};

export default ProgressPage;
