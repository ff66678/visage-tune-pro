import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ScanFace, TrendingUp, Shield, Eye, Smile, ChevronRight, Camera, Sparkles, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLatestAnalysis, useRunAnalysis, useFaceAnalyses } from "@/hooks/useFaceAnalysis";
import { useProgressPhotos, useUploadProgressPhoto } from "@/hooks/useProgressPhotos";
import { useCourses } from "@/hooks/useCourses";
import { useProducts } from "@/hooks/useProducts";

const gradeColor = (grade: string) => {
  if (grade.startsWith("A")) return "text-emerald-600";
  if (grade.startsWith("B")) return "text-blue-500";
  if (grade.startsWith("C")) return "text-amber-500";
  return "text-red-400";
};

const gradeGlow = (grade: string) => {
  if (grade.startsWith("A")) return "shadow-emerald-200/60";
  if (grade.startsWith("B")) return "shadow-blue-200/60";
  if (grade.startsWith("C")) return "shadow-amber-200/60";
  return "shadow-red-200/60";
};

const levelLabel = (level: string) => {
  const map: Record<string, string> = {
    minimal: "极轻微", mild: "轻微", moderate: "中等", noticeable: "明显", prominent: "显著",
    excellent: "优秀", good: "良好", fair: "一般", poor: "较差",
  };
  return map[level] || level;
};

const levelColor = (level: string) => {
  if (["excellent", "minimal"].includes(level)) return "text-emerald-600 bg-emerald-50";
  if (["good", "mild"].includes(level)) return "text-blue-600 bg-blue-50";
  if (["fair", "moderate"].includes(level)) return "text-amber-600 bg-amber-50";
  return "text-red-500 bg-red-50";
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
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center shadow-sm">
            <ScanFace className="w-8 h-8 text-primary" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-lg font-bold text-foreground">开始你的面部分析</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">拍一张正面照片<br />AI 将为你生成专属面部报告</p>
        </div>
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="rounded-full px-8 h-12 text-sm font-semibold shadow-lg shadow-primary/20"
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
        <div>
          <h1 className="text-xl font-bold text-foreground">面部分析</h1>
          <p className="text-xs text-muted-foreground mt-0.5">AI 智能面部健康评估</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <ScanFace className="w-5 h-5 text-primary" />
        </div>
      </div>

      {/* Photo + Analysis Hero */}
      <div className="relative rounded-2xl overflow-hidden bg-card shadow-sm">
        {latestPhoto && (
          <div className="relative aspect-[3/4] max-h-[340px] overflow-hidden">
            <img
              src={latestPhoto.photo_url}
              alt="最近照片"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
            {/* Floating analysis tags */}
            {latest && (
              <>
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-xl px-3 py-1.5 text-xs font-semibold text-foreground flex items-center gap-1.5 shadow-sm">
                  <Eye className="w-3.5 h-3.5 text-primary" />
                  眼部 <span className="text-primary">{latest.eye_contour_score}</span>
                </div>
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md rounded-xl px-3 py-1.5 text-xs font-semibold text-foreground flex items-center gap-1.5 shadow-sm">
                  <Smile className="w-3.5 h-3.5 text-primary" />
                  法令纹 <span className="text-primary">{levelLabel(latest.nasolabial_level)}</span>
                </div>
                <div className="absolute bottom-14 left-4 bg-white/95 backdrop-blur-md rounded-xl px-3 py-1.5 text-xs font-semibold text-foreground flex items-center gap-1.5 shadow-sm">
                  <Shield className="w-3.5 h-3.5 text-primary" />
                  下颌 <span className="text-primary">{levelLabel(latest.jawline_level)}</span>
                </div>
                {/* Overall score badge */}
                <div className="absolute bottom-14 right-4 bg-primary/95 backdrop-blur-md rounded-xl px-3 py-1.5 text-xs font-bold text-primary-foreground flex items-center gap-1.5 shadow-lg shadow-primary/30">
                  <Activity className="w-3.5 h-3.5" />
                  {latest.elasticity_score}分
                </div>
              </>
            )}
          </div>
        )}

        {/* Analyze button */}
        <div className="p-4">
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || runAnalysis.isPending}
            className="w-full rounded-xl h-12 text-sm font-semibold shadow-md shadow-primary/20"
          >
            {isUploading ? (
              <>
                <span className="mr-2 inline-block h-4 w-4 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground animate-spin" />
                上传中…
              </>
            ) : runAnalysis.isPending ? (
              <>
                <span className="mr-2 inline-block h-4 w-4 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground animate-spin" />
                AI 分析中…
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                面部分析
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Score Cards */}
      {latest && (
        <div className="grid grid-cols-2 gap-3">
          <div className={`rounded-2xl bg-card p-4 space-y-1 shadow-sm`}>
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-3 h-3 text-primary" />
              </div>
              弹性评分
            </div>
            <div className="text-3xl font-bold text-foreground tracking-tight">{latest.elasticity_score}</div>
            <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">/100</div>
          </div>
          <div className={`rounded-2xl bg-card p-4 space-y-1 shadow-sm`}>
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="w-3 h-3 text-primary" />
              </div>
              健康等级
            </div>
            <div className={`text-3xl font-bold tracking-tight ${gradeColor(latest.health_grade)}`}>
              {latest.health_grade}
            </div>
            <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">综合评估</div>
          </div>
        </div>
      )}

      {/* Detail Scores */}
      {latest && (
        <div className="rounded-2xl bg-card p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">详细指标</h3>
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">详情</span>
          </div>
          <div className="space-y-4">
            {/* Eye contour */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-foreground font-medium">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Eye className="w-3.5 h-3.5 text-primary" />
                  </div>
                  眼部轮廓
                </div>
                <span className="text-sm font-bold text-foreground">{latest.eye_contour_score}<span className="text-muted-foreground font-normal text-xs">/100</span></span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full transition-all duration-700"
                  style={{ width: `${latest.eye_contour_score}%` }}
                />
              </div>
            </div>
            {/* Nasolabial */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-foreground font-medium">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Smile className="w-3.5 h-3.5 text-primary" />
                </div>
                法令纹
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${levelColor(latest.nasolabial_level)}`}>
                {levelLabel(latest.nasolabial_level)}
              </span>
            </div>
            {/* Jawline */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-foreground font-medium">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="w-3.5 h-3.5 text-primary" />
                </div>
                下颌线条
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${levelColor(latest.jawline_level)}`}>
                {levelLabel(latest.jawline_level)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Recommended Courses */}
      {latest && recommendedCourses.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-foreground">推荐课程</h3>
          <div className="space-y-2">
            {recommendedCourses.map((course) => (
              <button
                key={course.id}
                onClick={() => navigate(`/course/${course.id}`)}
                className="w-full flex items-center gap-3 rounded-2xl bg-card p-3 text-left transition-all active:scale-[0.98] shadow-sm"
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
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <ChevronRight className="w-3.5 h-3.5 text-primary" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Products */}
      {products.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-foreground">推荐好物</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
            {products.map((product) => (
              <a
                key={product.id}
                href={product.purchase_url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 w-36 rounded-2xl bg-card overflow-hidden transition-all active:scale-[0.97] shadow-sm"
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
                    <span className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-[10px] font-medium px-2 py-0.5 rounded-full">
                      {product.tag}
                    </span>
                  )}
                </div>
                <div className="p-2.5 space-y-1.5">
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
