import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ScanFace, TrendingUp, Shield, Eye, Smile, ChevronRight, Camera, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLatestAnalysis, useRunAnalysis, useFaceAnalyses } from "@/hooks/useFaceAnalysis";
import { useProgressPhotos, useUploadProgressPhoto } from "@/hooks/useProgressPhotos";
import { useCourses } from "@/hooks/useCourses";
import { useProducts } from "@/hooks/useProducts";
import { useAuth } from "@/contexts/AuthContext";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: latest, isLoading: loadingLatest } = useLatestAnalysis();
  const { data: history = [] } = useFaceAnalyses();
  const { data: photos = [] } = useProgressPhotos();
  const { data: courses = [] } = useCourses();
  const { data: products = [] } = useProducts();
  const runAnalysis = useRunAnalysis();
  const { mutateAsync: uploadPhoto, isPending: isUploading } = useUploadProgressPhoto();

  const latestPhoto = photos[0];

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const photoUrl = await uploadPhoto(file);
    e.target.value = "";
    if (photoUrl) {
      await runAnalysis.mutateAsync(photoUrl);
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
        <input
          type="file"
          accept="image/*"
          capture="user"
          ref={fileInputRef}
          onChange={handleCapture}
          className="hidden"
        />
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
          <Camera className="w-10 h-10 text-muted-foreground" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-lg font-semibold text-foreground">还没有照片</h2>
          <p className="text-sm text-muted-foreground">拍一张照片，开始面部分析</p>
        </div>
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="rounded-full px-6"
        >
          {isUploading ? (
            <>
              <span className="mr-2 inline-block h-4 w-4 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground animate-spin" />
              上传中…
            </>
          ) : (
            <>
              <Camera className="w-4 h-4 mr-2" />
              拍照分析
            </>
          )}
        </Button>
      </div>
    );
  }

  const recommendedCourses = getRecommendedCourses();

  return (
    <div className="px-5 pt-14 pb-8 space-y-5">
      <input
        type="file"
        accept="image/*"
        capture="user"
        ref={fileInputRef}
        onChange={handleCapture}
        className="hidden"
      />
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">面部分析</h1>
        <ScanFace className="w-6 h-6 text-primary" />
      </div>

      {/* Photo + Analysis Hero */}
      <div className="rounded-3xl bg-gradient-to-b from-primary/10 via-card to-card p-6 pt-8 flex flex-col items-center shadow-sm">
        {/* Oval Photo Frame */}
        <div className="relative mb-8">
          <Sparkles className="absolute -top-3 -left-6 w-5 h-5 text-accent-gold/60" />
          <Sparkles className="absolute top-1/4 -left-8 w-4 h-4 text-accent-gold/40" />
          <Sparkles className="absolute -bottom-2 -right-6 w-5 h-5 text-accent-gold/50" />
          <Sparkles className="absolute top-8 -right-8 w-4 h-4 text-accent-gold/30" />

          <div className="w-[240px] h-[300px] rounded-[50%] border-[6px] border-surface-elevated/80 bg-surface-elevated/40 flex items-center justify-center p-3 shadow-inner">
            <div className="w-full h-full rounded-[50%] overflow-hidden bg-surface flex items-center justify-center">
              {isUploading ? (
                <span className="inline-block h-8 w-8 rounded-full border-2 border-primary/40 border-t-primary animate-spin" />
              ) : latestPhoto ? (
                <img
                  src={latestPhoto.photo_url}
                  alt="最近照片"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera className="w-10 h-10 text-muted-foreground/50" />
              )}
            </div>
          </div>

          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-surface-elevated" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 rounded-full bg-surface-elevated" />
          <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-surface-elevated" />
          <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-surface-elevated" />
        </div>

        <h2 className="text-xl font-semibold tracking-tight mb-1.5">
          {latest ? `健康等级 ${latest.health_grade}` : "开始面部分析 ✨"}
        </h2>
        <p className="text-sm text-muted-foreground font-medium mb-6">
          {latest ? `弹性评分 ${latest.elasticity_score}/100` : "拍一张照片，AI 为你分析"}
        </p>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || runAnalysis.isPending}
          className="w-full max-w-[280px] py-3.5 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center gap-2.5 text-base font-semibold border-none cursor-pointer shadow-md hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isUploading ? (
            <>
              <span className="inline-block h-5 w-5 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground animate-spin" />
              上传中…
            </>
          ) : runAnalysis.isPending ? (
            <>
              <span className="inline-block h-5 w-5 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground animate-spin" />
              AI 分析中…
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              面部分析
            </>
          )}
        </button>
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




      {/* Recommended Courses */}
      {latest && recommendedCourses.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">推荐课程</h3>
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
