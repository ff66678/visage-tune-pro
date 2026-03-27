import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";
import { useCourses } from "@/hooks/useCourses";
import { Skeleton } from "@/components/ui/skeleton";

const categoryLabels: Record<string, string> = {
  "眼部": "眼部 & 上脸",
  "下颌": "下颌 & 轮廓",
  "脸颊": "脸颊 & 光泽",
  "颈部": "颈部护理",
  "全脸": "全脸训练",
};

const CategoryAll = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { data: courses, isLoading } = useCourses();

  const decodedCategory = decodeURIComponent(category || "");
  const title = categoryLabels[decodedCategory] || decodedCategory;

  const filtered = courses?.filter((c) => c.category === decodedCategory) || [];

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-full max-w-[480px] min-h-screen">
        {/* Header */}
        <header className="px-6 pt-8 pb-4 sticky top-0 bg-background/90 backdrop-blur-xl z-40">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-full bg-surface flex items-center justify-center cursor-pointer border-none"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="text-xl font-bold tracking-tight text-foreground">{title}</h1>
            <span className="text-sm text-muted-foreground ml-auto">
              {!isLoading && `${filtered.length} 个课程`}
            </span>
          </div>
        </header>

        {/* Course Grid */}
        <div className="px-6 pb-10">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-[190px] rounded-lg" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground text-sm">
              暂无课程
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filtered.map((routine) => (
                <div
                  key={routine.id}
                  className="bg-card rounded-lg overflow-hidden shadow-sm cursor-pointer group relative active:scale-[0.97] transition-transform duration-150"
                  onClick={() => navigate(`/course/${routine.id}`)}
                >
                  <img
                    src={routine.image_url}
                    alt={routine.title}
                    className="w-full h-[130px] object-cover group-hover:scale-105 transition-transform duration-300"
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
                    {routine.subtitle && (
                      <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{routine.subtitle}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryAll;
