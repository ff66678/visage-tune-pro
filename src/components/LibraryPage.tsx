import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Clock, Heart, Star, ChevronRight, SlidersHorizontal, Trophy } from "lucide-react";
import { useCourses } from "@/hooks/useCourses";
import { useFavoriteIds, useToggleFavorite } from "@/hooks/useFavorites";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const filters = [
  { label: "全部", emoji: "🔥" },
  { label: "眼部", emoji: "👁" },
  { label: "下颌", emoji: "🦴" },
  { label: "脸颊", emoji: "✨" },
  { label: "额头", emoji: "🧠" },
  { label: "颈部", emoji: "💆" },
];

const difficultyColor = (d: string) => {
  if (d === "初级") return "bg-emerald-500/90 text-white";
  if (d === "中级") return "bg-amber-500/90 text-white";
  if (d === "高级") return "bg-rose-500/90 text-white";
  return "bg-muted text-muted-foreground";
};

const LibraryPage = () => {
  const [activeFilter, setActiveFilter] = useState("全部");
  const [searchValue, setSearchValue] = useState("");
  const [sortBy, setSortBy] = useState<"default" | "rating" | "duration">("default");
  const [showSort, setShowSort] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const collapseRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { data: courses, isLoading } = useCourses();
  const { data: favoriteIds } = useFavoriteIds();
  const toggleFavorite = useToggleFavorite();
  const { user } = useAuth();

  useEffect(() => {
    const container = document.querySelector('.no-scrollbar');
    if (!container) return;
    const onScroll = () => setScrolled(container.scrollTop > 20);
    container.addEventListener('scroll', onScroll);
    return () => container.removeEventListener('scroll', onScroll);
  }, []);
  const featuredCourse = useMemo(() => {
    if (!courses) return null;
    return courses.find((c) => c.is_featured) || courses[0] || null;
  }, [courses]);

  const topRated = useMemo(() => {
    if (!courses) return [];
    return [...courses]
      .filter((c) => c.rating)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 6);
  }, [courses]);

  const groupedCategories = useMemo(() => {
    if (!courses) return [];
    const categoryMap: Record<string, { title: string; routines: typeof courses }> = {};
    const categoryLabels: Record<string, string> = {
      "眼部": "眼部 & 上脸",
      "下颌": "下颌 & 轮廓",
      "脸颊": "脸颊 & 光泽",
      "颈部": "颈部护理",
      "全脸": "全脸训练",
    };
    courses.forEach((c) => {
      const key = c.category;
      if (!categoryMap[key]) {
        categoryMap[key] = { title: categoryLabels[key] || key, routines: [] };
      }
      categoryMap[key].routines.push(c);
    });

    let result = Object.values(categoryMap)
      .map((cat) => ({
        ...cat,
        routines: cat.routines.filter(
          (r) => !searchValue || r.title.toLowerCase().includes(searchValue.toLowerCase())
        ),
      }))
      .filter((cat) => {
        if (activeFilter === "全部") return cat.routines.length > 0;
        return cat.title.toLowerCase().includes(activeFilter.toLowerCase()) && cat.routines.length > 0;
      });

    // Sort routines within each category
    if (sortBy === "rating") {
      result = result.map((cat) => ({
        ...cat,
        routines: [...cat.routines].sort((a, b) => (b.rating || 0) - (a.rating || 0)),
      }));
    } else if (sortBy === "duration") {
      result = result.map((cat) => ({
        ...cat,
        routines: [...cat.routines].sort((a, b) => {
          const da = parseInt(a.duration) || 0;
          const db = parseInt(b.duration) || 0;
          return da - db;
        }),
      }));
    }

    return result;
  }, [courses, searchValue, activeFilter, sortBy]);

  const handleToggleFav = (e: React.MouseEvent, courseId: string) => {
    e.stopPropagation();
    if (!user) {
      toast.error("请先登录");
      return;
    }
    const isFav = favoriteIds?.has(courseId) || false;
    toggleFavorite.mutate({ courseId, isFavorited: isFav });
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <header className={`px-6 sticky top-0 bg-background/90 backdrop-blur-xl z-40 transition-all duration-300 ${scrolled ? 'pt-2 pb-1' : 'pt-8 pb-2'}`}>
        <div className={`transition-all duration-300 overflow-hidden ${scrolled ? 'max-h-0 opacity-0 mb-0' : 'max-h-40 opacity-100 mb-4'}`}>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold tracking-tight">课程库</h1>
          </div>

          {/* Search */}
          <div className="flex gap-2">
            <div className="flex-1 bg-surface rounded-2xl px-4 py-3 flex items-center gap-2.5 shadow-sm">
              <Search className="w-[18px] h-[18px] text-muted-foreground" />
              <input
                type="text"
                placeholder="搜索课程..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="border-none bg-transparent text-sm text-foreground w-full outline-none placeholder:text-muted-foreground font-sans"
              />
            </div>
            <button
              onClick={() => setShowSort(!showSort)}
              className="w-12 h-12 rounded-2xl bg-surface flex items-center justify-center shadow-sm active:scale-95 transition-transform"
            >
              <SlidersHorizontal className="w-[18px] h-[18px] text-muted-foreground" />
            </button>
          </div>

          {/* Sort options */}
          {showSort && (
            <div className="flex gap-2 mt-3 animate-fade-in">
              {[
                { key: "default" as const, label: "默认" },
                { key: "rating" as const, label: "按评分" },
                { key: "duration" as const, label: "按时长" },
              ].map((s) => (
                <button
                  key={s.key}
                  onClick={() => { setSortBy(s.key); setShowSort(false); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    sortBy === s.key
                      ? "bg-primary text-primary-foreground"
                      : "bg-surface-elevated text-muted-foreground"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filter tabs - always visible */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {filters.map((filter) => (
            <button
              key={filter.label}
              onClick={() => setActiveFilter(filter.label)}
              className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-all cursor-pointer border-none flex items-center gap-1.5 ${
                activeFilter === filter.label
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-surface-elevated text-muted-foreground hover:bg-surface-hover"
              }`}
            >
              <span>{filter.emoji}</span>
              {filter.label}
            </button>
          ))}
        </div>
      </header>

      <div className="px-6 pb-8">
        {isLoading ? (
          <div className="space-y-6 mt-4">
            <Skeleton className="h-[180px] w-full rounded-2xl" />
            <div className="flex gap-3 overflow-hidden">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-[100px] w-[140px] rounded-2xl flex-shrink-0" />)}
            </div>
            {[1, 2].map((i) => (
              <div key={i}>
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-[190px] rounded-2xl" />
                  <Skeleton className="h-[190px] rounded-2xl" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Featured Banner */}
            {featuredCourse && activeFilter === "全部" && !searchValue && (
              <div
                className="relative w-full h-[180px] rounded-2xl overflow-hidden mb-6 mt-4 cursor-pointer active:scale-[0.98] transition-transform"
                onClick={() => navigate(`/course/${featuredCourse.id}`)}
              >
                <img
                  src={featuredCourse.image_url}
                  alt={featuredCourse.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-primary text-primary-foreground mb-2 inline-block">
                    精选推荐
                  </span>
                  <h2 className="text-white text-lg font-bold mb-1">{featuredCourse.title}</h2>
                  <div className="flex items-center gap-3 text-white/80 text-xs">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{featuredCourse.duration}</span>
                    <span>{featuredCourse.difficulty}</span>
                    {featuredCourse.rating && (
                      <span className="flex items-center gap-0.5"><Star className="w-3 h-3 fill-amber-400 text-amber-400" />{featuredCourse.rating}</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Hot Ranking */}
            {topRated.length > 0 && activeFilter === "全部" && !searchValue && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="w-4 h-4 text-primary" />
                  <h2 className="text-base font-semibold text-foreground">热门排行</h2>
                </div>
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                  {topRated.map((course, i) => (
                    <div
                      key={course.id}
                      className="flex-shrink-0 w-[140px] rounded-2xl overflow-hidden bg-card shadow-sm cursor-pointer active:scale-[0.97] transition-transform relative"
                      onClick={() => navigate(`/course/${course.id}`)}
                    >
                      <div className="relative">
                        <img src={course.image_url} alt={course.title} className="w-full h-[90px] object-cover" />
                        <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                          {i + 1}
                        </div>
                      </div>
                      <div className="p-2">
                        <h3 className="text-xs font-semibold text-foreground line-clamp-1">{course.title}</h3>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                          <span className="text-[10px] text-muted-foreground">{course.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Category Groups */}
            {groupedCategories.map((category, idx) => (
              <div key={idx} className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-[3px] h-5 rounded-full bg-primary" />
                    <h2 className="text-lg font-semibold text-foreground">{category.title}</h2>
                  </div>
                  <span
                    className="text-[13px] text-primary font-semibold cursor-pointer flex items-center gap-0.5"
                    onClick={() => {
                      const categoryKey = Object.entries({
                        "眼部 & 上脸": "眼部",
                        "下颌 & 轮廓": "下颌",
                        "脸颊 & 光泽": "脸颊",
                        "颈部护理": "颈部",
                        "全脸训练": "全脸",
                      }).find(([label]) => label === category.title)?.[1] || category.title;
                      navigate(`/category/${encodeURIComponent(categoryKey)}`);
                    }}
                  >
                    查看全部
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>

                {/* First item = featured large card */}
                {category.routines.length > 0 && (
                  <div
                    className="relative w-full h-[160px] rounded-2xl overflow-hidden mb-4 cursor-pointer active:scale-[0.98] transition-transform"
                    onClick={() => navigate(`/course/${category.routines[0].id}`)}
                  >
                    <img
                      src={category.routines[0].image_url}
                      alt={category.routines[0].title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    {/* Fav button */}
                    <button
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center"
                      onClick={(e) => handleToggleFav(e, category.routines[0].id)}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          favoriteIds?.has(category.routines[0].id)
                            ? "fill-primary text-primary"
                            : "text-white"
                        }`}
                      />
                    </button>
                    <div className="absolute top-2.5 left-2.5">
                      <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${difficultyColor(category.routines[0].difficulty)}`}>
                        {category.routines[0].difficulty}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="text-white text-sm font-bold mb-1">{category.routines[0].title}</h3>
                      <div className="flex items-center gap-3 text-white/80 text-[11px]">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{category.routines[0].duration}</span>
                        {category.routines[0].rating && (
                          <span className="flex items-center gap-0.5"><Star className="w-3 h-3 fill-amber-400 text-amber-400" />{category.routines[0].rating}</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Rest in 2-col grid */}
                {category.routines.length > 1 && (
                  <div className="grid grid-cols-2 gap-3">
                    {category.routines.slice(1).map((routine) => (
                      <div
                        key={routine.id}
                        className="bg-card rounded-2xl overflow-hidden shadow-sm cursor-pointer active:scale-[0.97] transition-transform relative"
                        onClick={() => navigate(`/course/${routine.id}`)}
                      >
                        <div className="relative">
                          <img
                            src={routine.image_url}
                            alt={routine.title}
                            className="w-full h-[110px] object-cover"
                          />
                          <div className="absolute top-2 left-2">
                            <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full ${difficultyColor(routine.difficulty)}`}>
                              {routine.difficulty}
                            </span>
                          </div>
                          <button
                            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center"
                            onClick={(e) => handleToggleFav(e, routine.id)}
                          >
                            <Heart
                              className={`w-3.5 h-3.5 ${
                                favoriteIds?.has(routine.id)
                                  ? "fill-primary text-primary"
                                  : "text-white"
                              }`}
                            />
                          </button>
                        </div>
                        <div className="p-2.5">
                          <h3 className="text-sm font-semibold mb-1 text-foreground line-clamp-1">{routine.title}</h3>
                          <div className="flex items-center justify-between">
                            <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {routine.duration}
                            </div>
                            {routine.rating && (
                              <div className="flex items-center gap-0.5">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                <span className="text-[10px] text-muted-foreground">{routine.rating}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default LibraryPage;
