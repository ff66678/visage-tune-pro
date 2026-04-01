import { useRef, useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Camera, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Sparkles, Loader2, ImageIcon } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { useTodayPhoto, useProgressPhotos, useUploadProgressPhoto } from "@/hooks/useProgressPhotos";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useTranslation, useLanguage } from "@/i18n/LanguageContext";
import { useScrollContainer } from "@/contexts/ScrollContext";

const formatLocalDate = (d: Date) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const ProgressPage = () => {
  const { t, locale } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const { data: todayPhoto } = useTodayPhoto();
  const { data: recentPhotos = [] } = useProgressPhotos();
  const uploadMutation = useUploadProgressPhoto();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const today = new Date();
  const todayStr = formatLocalDate(today);
  const [weekOffset, setWeekOffset] = useState(0);
  const [slideDir, setSlideDir] = useState<"left" | "right" | null>(null);
  const [selectedDate, setSelectedDate] = useState(todayStr);

  const changeWeek = (dir: number) => {
    const newOffset = dir < 0 ? weekOffset - 1 : Math.min(weekOffset + 1, 0);
    if (newOffset === weekOffset) return;
    setSlideDir(dir < 0 ? "right" : "left");
    setTimeout(() => { setWeekOffset(newOffset); setSlideDir(null); }, 200);
  };

  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset + weekOffset * 7);

  const displayMonth = monday.toLocaleDateString(locale, { year: "numeric", month: "long" });

  const photoDates = new Set(recentPhotos.map((p) => p.photo_date));

  const weekDayLabelKeys = [
    "progress.weekMon", "progress.weekTue", "progress.weekWed",
    "progress.weekThu", "progress.weekFri", "progress.weekSat", "progress.weekSun",
  ];
  const weekDates = weekDayLabelKeys.map((key, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const isToday = d.toDateString() === today.toDateString();
    const dateStr = formatLocalDate(d);
    const hasPhoto = photoDates.has(dateStr);
    const isSelected = dateStr === selectedDate;
    return { label: t(key), date: d.getDate(), isToday, hasPhoto, isSelected, dateStr };
  });

  const avatarUrl = profile?.avatar_url || "https://images.pexels.com/photos/3750717/pexels-photo-3750717.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2";

  const isSelectedToday = selectedDate === todayStr;
  const selectedPhoto = recentPhotos.find((p) => p.photo_date === selectedDate);
  const displayPhoto = selectedPhoto?.photo_url || null;

  const navigateToAuth = () => {
    const returnTo = `${location.pathname}${location.search}`;
    navigate(`/auth?returnTo=${encodeURIComponent(returnTo)}`);
  };

  const handleTakePhoto = () => {
    if (!user) { navigateToAuth(); return; }
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadMutation.mutate(file);
    e.target.value = "";
  };

  const pastPhotos = recentPhotos.filter((p) => p.photo_date !== todayStr);

  return (
    <div>
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
              selected={new Date(selectedDate + "T00:00:00")}
              onSelect={(date) => {
                if (!date) return;
                const dayOfWeekSelected = date.getDay();
                const mondayOffsetSelected = dayOfWeekSelected === 0 ? -6 : 1 - dayOfWeekSelected;
                const selectedMonday = new Date(date);
                selectedMonday.setDate(date.getDate() + mondayOffsetSelected);
                const todayMonday = new Date(today);
                todayMonday.setDate(today.getDate() + mondayOffset);
                const weekDiff = Math.round((selectedMonday.getTime() - todayMonday.getTime()) / (1000 * 60 * 60 * 24 * 7));
                setWeekOffset(Math.min(weekDiff, 0));
                setSelectedDate(formatLocalDate(date));
              }}
              className={cn("p-3 pointer-events-auto")}
              modifiers={{ hasPhoto: recentPhotos.map(p => new Date(p.photo_date + "T00:00:00")) }}
              modifiersClassNames={{ hasPhoto: "bg-primary/15 text-primary font-bold aria-selected:bg-primary aria-selected:text-primary-foreground" }}
              classNames={{ day_today: "bg-primary/15 text-primary font-bold aria-selected:bg-primary aria-selected:text-primary-foreground" }}
            />
          </PopoverContent>
        </Popover>
        <h1 className="text-lg font-semibold tracking-tight">{t("progress.title")}</h1>
        <button onClick={() => navigate("/profile")} className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary/20 bg-card cursor-pointer p-0">
          <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
        </button>
      </header>

      <div className="mx-4 mt-2 rounded-2xl bg-surface p-4">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => changeWeek(-1)} className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:bg-surface transition-colors cursor-pointer">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-base font-semibold tracking-tight">{displayMonth}</span>
          <button onClick={() => changeWeek(1)} className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:bg-surface transition-colors cursor-pointer disabled:opacity-30" disabled={weekOffset >= 0}>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div
          className={`flex justify-between items-center touch-pan-y overflow-visible py-1 transition-all duration-200 ease-out ${slideDir === "left" ? "opacity-0 -translate-x-4" : slideDir === "right" ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"}`}
          onTouchStart={(e) => { (e.currentTarget as any)._touchX = e.touches[0].clientX; }}
          onTouchEnd={(e) => { const startX = (e.currentTarget as any)._touchX as number | undefined; if (startX === undefined) return; const diff = e.changedTouches[0].clientX - startX; if (Math.abs(diff) > 50) changeWeek(diff > 0 ? -1 : 1); }}
        >
          {weekDates.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-2 flex-1 cursor-pointer" onClick={() => setSelectedDate(d.dateStr)}>
              <span className="text-[12px] font-medium text-muted-foreground">{d.label}</span>
              <div className="relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${d.isSelected ? "bg-primary text-primary-foreground shadow-md" : d.hasPhoto ? "bg-primary/15 text-primary font-bold" : d.isToday ? "bg-primary/15 text-primary" : "text-foreground"}`}>
                  {d.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-5 mt-2 rounded-3xl bg-gradient-to-b from-primary/10 via-card to-card p-6 pt-8 flex flex-col items-center shadow-sm">
        <div className="relative mb-8">
          <Sparkles className="absolute -top-3 -left-6 w-5 h-5 text-accent-gold/60" />
          <Sparkles className="absolute top-1/4 -left-8 w-4 h-4 text-accent-gold/40" />
          <Sparkles className="absolute -bottom-2 -right-6 w-5 h-5 text-accent-gold/50" />
          <Sparkles className="absolute top-8 -right-8 w-4 h-4 text-accent-gold/30" />
          <div className="w-[240px] h-[300px] rounded-[50%] border-[6px] border-surface-elevated/80 bg-surface-elevated/40 flex items-center justify-center p-3 shadow-inner">
            <div className="w-full h-full rounded-[50%] overflow-hidden bg-surface flex items-center justify-center">
              {uploadMutation.isPending ? (
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              ) : displayPhoto ? (
                <img src={displayPhoto} alt="" className="w-full h-full object-cover" />
              ) : (
                <img src={avatarUrl} alt="" className="w-full h-full object-cover opacity-60" />
              )}
            </div>
          </div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-surface-elevated" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 rounded-full bg-surface-elevated" />
          <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-surface-elevated" />
          <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-surface-elevated" />
        </div>

        <h2 className="text-xl font-semibold tracking-tight mb-1.5">
          {displayPhoto
            ? isSelectedToday ? t("progress.recordedToday") : t("progress.dateRecord", [new Date(selectedDate + "T00:00:00").toLocaleDateString(locale, { month: "long", day: "numeric" })])
            : isSelectedToday ? t("progress.recordToday") : t("progress.noRecord")}
        </h2>
        <p className="text-sm text-muted-foreground font-medium mb-6">
          {displayPhoto
            ? isSelectedToday ? t("progress.keepGoing") : t("progress.trackChanges")
            : isSelectedToday ? t("progress.newDay") : t("progress.keepRecording")}
        </p>

        {isSelectedToday && (
          <button onClick={handleTakePhoto} disabled={uploadMutation.isPending}
            className="w-full max-w-[280px] py-3.5 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center gap-2.5 text-base font-semibold border-none cursor-pointer shadow-md hover:opacity-90 transition-opacity disabled:opacity-50">
            {uploadMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
            {displayPhoto ? t("progress.retake") : t("progress.takePhoto")}
          </button>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" capture="user" className="hidden" onChange={handleFileChange} />
      </div>

      <div className="px-5 mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold tracking-tight">{t("progress.history")}</h3>
          {recentPhotos.length > 0 && (
            <span className="text-[13px] text-muted-foreground font-medium">{t("progress.totalDays", [recentPhotos.length])}</span>
          )}
        </div>

        {pastPhotos.length > 0 ? (
          <div className="grid grid-cols-3 gap-2.5">
            {pastPhotos.map((photo) => {
              const d = new Date(photo.photo_date + "T00:00:00");
              const dayLabel = d.toLocaleDateString(locale, { weekday: "short" });
              const dateLabel = d.toLocaleDateString(locale, { month: "short", day: "numeric" });
              return (
                <div key={photo.id} className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-surface group">
                  <img src={photo.photo_url} alt={photo.photo_date} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
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
              <p className="text-sm font-medium text-muted-foreground">{t("progress.noHistory")}</p>
              <p className="text-xs text-muted-foreground/70 mt-1">{t("progress.noHistoryDesc")}</p>
            </div>
          </div>
        )}
      </div>

      <div className="h-8" />
    </div>
  );
};

export default ProgressPage;
