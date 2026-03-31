import { forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import { ScanFace, TrendingUp, Shield, Eye, Smile, ChevronRight, Camera, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLatestAnalysis, useRunAnalysis, useFaceAnalyses } from "@/hooks/useFaceAnalysis";
import { useProgressPhotos } from "@/hooks/useProgressPhotos";
import { useCourses } from "@/hooks/useCourses";
import { useProducts } from "@/hooks/useProducts";

const gradeColor = (grade: string) => {
  if (grade.startsWith("A")) return "text-emerald-600";
  if (grade.startsWith("B")) return "text-blue-500";
  if (grade.startsWith("C")) return "text-amber-500";
  return "text-red-400";
};

const levelLabel = (level: string) => {
  const map: Record<string, string> = {
    minimal: "极轻微", mild: "轻微", moderate: "中等", noticeable: "明显", prominent: "显著",
    excellent: "优秀", good: "良好", fair: "一般", poor: "较差",
  };
  return map[level] || level;
};

const AnalysisPage = () => {
  const navigate = useNavigate();
  const { data: latest, isLoading: loadingLatest } = useLatestAnalysis();
  const { data: history = [] } = useFaceAnalyses();
  const { data: photos = [] } = useProgressPhotos();
  const { data: courses = [] } = useCourses();
  const { data: products = [] } = useProducts();
  const runAnalysis = useRunAnalysis();
  const [analyzing, setAnalyzing] = useState(false);

  const latestPhoto = photos[0];

  const handleAnalyze = async () => {
    if (!latestPhoto) return;
    setAnalyzing(true);
    try {
      await runAnalysis.mutateAsync(latestPhoto.photo_url);
    } finally {
      setAnalyzing(false);
    }
  };

  // Recommend courses based on weak areas
  const getRecommendedCourses = () => {
    if (!latest) return courses.slice(0, 3);
    const recommended = courses.filter((c) => {
      const cat = c.category.toLowerCase();
      if (latest.jawline_level === "fair" || latest.jawline_level === "poor") {
        if (cat.includes("下颌") || cat.includes("轮廓") || cat.includes("提升")) return true;
      }
      if (latest.nasolabial_level === "noticeable" || latest.nasolabial_level === "prominent") {
        if (cat.includes("法令") || cat.includes("嘴角")) return true;
      }
      if (latest.eye_contour_score < 60) {
        if (cat.includes("眼") || cat.includes("眼部")) return true;
      }
      return false;
    });
    return recommended.length > 0 ? recommended.slice(0, 3) : courses.slice(0, 3);
  };

  // No photos state
  if (!latestPhoto && !loadingLatest) {
    return (
      <div className="px-5 pt-14 pb-8 flex flex-col items-center justify-center min-h-[70vh] gap-6">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
          <Camera className="w-10 h-10 text-muted-foreground" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-lg font-semibold text-foreground">还没有照片</h2>
          <p className="text-sm text-muted-foreground">先去「记录」页拍一张照片，然后回来进行面部分析</p>
        </div>
        <Button
          onClick={() => navigate("/?tab=3")}
          className="rounded-full px-6"
        >
          <Camera className="w-4 h-4 mr-2" />
          去拍照
        </Button>
      </div>
    );
  }

  const recommendedCourses = getRecommendedCourses();

  return (
    <div className="px-5 pt-14 pb-8 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">面部分析</h1>
        <ScanFace className="w-6 h-6 text-primary" />
      </div>

      {/* Photo + Analysis Hero */}
      <div className="relative rounded-2xl overflow-hidden bg-card border border-border shadow-sm">
        {latestPhoto && (
          <div className="relative aspect-[3/4] max-h-[360px] overflow-hidden">
            <img
              src={latestPhoto.photo_url}
              alt="最近照片"
              className="w-full h-full object-cover"
            />
            {/* Overlay labels when analysis exists */}
            {latest && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent">
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-foreground flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  眼部 {latest.eye_contour_score}
                </div>
                <div className="absolute top-14 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-foreground flex items-center gap-1">
                  <Smile className="w-3 h-3" />
                  法令纹 {levelLabel(latest.nasolabial_level)}
                </div>
                <div className="absolute bottom-16 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-foreground flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  下颌 {levelLabel(latest.jawline_level)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Analyze button */}
        <div className="p-4">
          <Button
            onClick={handleAnalyze}
            disabled={analyzing || !latestPhoto}
            className="w-full rounded-xl h-11"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                AI 分析中…
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                {latest ? "重新分析" : "开始 AI 分析"}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Score Cards */}
      {latest && (
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-card border border-border p-4 space-y-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingUp className="w-3.5 h-3.5" />
              弹性评分
            </div>
            <div className="text-3xl font-bold text-foreground">{latest.elasticity_score}</div>
            <div className="text-xs text-muted-foreground">/100</div>
          </div>
          <div className="rounded-2xl bg-card border border-border p-4 space-y-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="w-3.5 h-3.5" />
              健康等级
            </div>
            <div className={`text-3xl font-bold ${gradeColor(latest.health_grade)}`}>
              {latest.health_grade}
            </div>
            <div className="text-xs text-muted-foreground">综合评估</div>
          </div>
        </div>
      )}

      {/* Detail Scores */}
      {latest && (
        <div className="rounded-2xl bg-card border border-border p-4 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">详细指标</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Eye className="w-4 h-4" /> 眼部轮廓
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${latest.eye_contour_score}%` }} />
                </div>
                <span className="text-sm font-medium text-foreground w-8 text-right">{latest.eye_contour_score}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Smile className="w-4 h-4" /> 法令纹
              </div>
              <span className="text-sm font-medium text-foreground">{levelLabel(latest.nasolabial_level)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4" /> 下颌线条
              </div>
              <span className="text-sm font-medium text-foreground">{levelLabel(latest.jawline_level)}</span>
            </div>
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 1 && (
        <div className="rounded-2xl bg-card border border-border p-4 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">历史记录</h3>
          <div className="space-y-2">
            {history.slice(0, 5).map((a) => (
              <div key={a.id} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{a.analysis_date}</span>
                <div className="flex items-center gap-3">
                  <span className="text-foreground">弹性 {a.elasticity_score}</span>
                  <span className={`font-medium ${gradeColor(a.health_grade)}`}>{a.health_grade}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Courses */}
      {latest && recommendedCourses.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">为你推荐</h3>
          <div className="space-y-2">
            {recommendedCourses.map((course) => (
              <button
                key={course.id}
                onClick={() => navigate(`/course/${course.id}`)}
                className="w-full flex items-center gap-3 rounded-2xl bg-card border border-border p-3 text-left transition-colors active:bg-muted"
              >
                <img
                  src={course.image_url}
                  alt={course.title}
                  className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">{course.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{course.duration} · {course.difficulty}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Recommended Products */}
      {products.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">推荐好物</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
            {products.map((product) => (
              <a
                key={product.id}
                href={product.purchase_url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 w-36 rounded-2xl bg-card border border-border overflow-hidden transition-colors active:bg-muted"
              >
                <div className="relative aspect-square">
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {product.tag && (
                    <span className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-[10px] px-2 py-0.5 rounded-full">
                      {product.tag}
                    </span>
                  )}
                </div>
                <div className="p-2.5 space-y-1">
                  <div className="text-xs font-medium text-foreground line-clamp-2 leading-tight">{product.name}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-primary">¥{Number(product.price).toFixed(0)}</span>
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <ChevronRight className="w-3.5 h-3.5 text-primary-foreground" />
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisPage;
