import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Settings, Clock } from "lucide-react";
import { useCourses } from "@/hooks/useCourses";
import { Skeleton } from "@/components/ui/skeleton";

const filters = ["全部", "眼部", "下颌", "脸颊", "额头", "颈部"];

const LibraryPage = () => {
  const [activeFilter, setActiveFilter] = useState("全部");
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const { data: courses, isLoading } = useCourses();

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
    return Object.values(categoryMap)
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
  }, [courses, searchValue, activeFilter]);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 sticky top-0 bg-background/90 backdrop-blur-xl z-40">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold tracking-tight">课程库</h1>
          <button className="bg-transparent border-none cursor-pointer text-foreground p-1">
            <Settings className="w-6 h-6" />
          </button>
        </div>

        <div className="bg-surface rounded-lg px-4 py-3 flex items-center gap-2.5 mb-4">
          <Search className="w-[18px] h-[18px] text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索课程..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="border-none bg-transparent text-sm text-foreground w-full outline-none placeholder:text-muted-foreground font-sans"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-all cursor-pointer border-none ${
                activeFilter === filter
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface-elevated text-muted-foreground hover:bg-surface-hover"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </header>

      {/* Grid */}
      <div className="px-6 pb-8">
        {isLoading ? (
          <div className="space-y-8">
            {[1, 2].map((i) => (
              <div key={i}>
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-[170px] rounded-lg" />
                  <Skeleton className="h-[170px] rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          groupedCategories.map((category, idx) => (
            <div key={idx} className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-foreground">{category.title}</h2>
                <span
                  className="text-[13px] text-primary font-semibold cursor-pointer"
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
                >查看全部</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {category.routines.map((routine) => (
                  <div
                    key={routine.id}
                    className="bg-card rounded-lg overflow-hidden shadow-sm cursor-pointer group relative"
                    onClick={() => navigate(`/course/${routine.id}`)}
                  >
                    <img
                      src={routine.image_url}
                      alt={routine.title}
                      className="w-full h-[120px] object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-card/90 text-foreground tracking-wide">
                        {routine.difficulty}
                      </span>
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-semibold mb-1 text-foreground">{routine.title}</h3>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {routine.duration}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LibraryPage;
