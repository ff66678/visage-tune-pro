import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Heart, Share2, Play, Star } from "lucide-react";

const CourseDetail = () => {
  const [isFavorited, setIsFavorited] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const navigate = useNavigate();

  const tags = ["下颌线模糊", "苹果肌松弛", "长期低头族"];

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Top Navigation Bar */}
      <div className="absolute top-12 left-0 w-full px-6 flex justify-between items-center z-20">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-card/85 backdrop-blur-xl flex items-center justify-center text-foreground shadow-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex gap-3">
          <button className="w-10 h-10 rounded-full bg-card/85 backdrop-blur-xl flex items-center justify-center text-foreground shadow-sm">
            <Share2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsFavorited(!isFavorited)}
            className="w-10 h-10 rounded-full bg-card/85 backdrop-blur-xl flex items-center justify-center shadow-sm transition-colors"
            style={{ color: isFavorited ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))" }}
          >
            <Heart className="w-5 h-5" fill={isFavorited ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-32 no-scrollbar">
        {/* Hero Image */}
        <div className="relative h-[380px] w-full">
          <img
            src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt="Course Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>

        {/* Content Section */}
        <div className="px-6 -mt-12 relative z-10">
          {/* Main Info Card */}
          <div className="bg-card p-6 rounded-[32px] shadow-sm">
            {/* Tags */}
            <div className="flex gap-2 mb-3">
              <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-wider">
                塑形提升
              </span>
              <span className="px-3 py-1 bg-secondary text-muted-foreground text-[10px] font-bold rounded-full uppercase tracking-wider">
                大师课
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-foreground mb-2">紧致提升大师课</h1>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              本课程专为想要改善下颌线清晰度及苹果肌下垂的人群设计。通过科学的肌肉运动，从深层焕活面部轮廓。
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
              <div className="text-center">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">时长</p>
                <p className="font-bold text-foreground">12 分钟</p>
              </div>
              <div className="text-center border-x border-border">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">难度</p>
                <p className="font-bold text-foreground">进阶级</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">强度</p>
                <p className="font-bold text-foreground">中等</p>
              </div>
            </div>
          </div>

          {/* Target Audience */}
          <div className="mt-8">
            <h3 className="font-bold text-foreground mb-3">适合人群</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-card rounded-2xl text-xs text-foreground border border-border"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Expected Effects */}
          <div className="mt-8 bg-primary/5 p-5 rounded-3xl border border-primary/10">
            <h3 className="font-bold text-primary flex items-center gap-2 mb-2">
              <span>✦</span> 预计效果
            </h3>
            <p className="text-sm text-primary/80 leading-relaxed">
              坚持练习 14 天，可明显观察到面部线条提升约 15%，有效缓解法令纹深度并增强皮肤弹性。
            </p>
          </div>

          {/* Reviews Section */}
          <div className="mt-8 mb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-foreground">学员评价</h3>
              <div className="flex items-center gap-1 text-xs font-bold text-primary">
                <Star className="w-3 h-3 fill-current" />
                <span>4.9 (128)</span>
              </div>
            </div>

            {/* Review Card */}
            <div className="bg-card p-4 rounded-3xl shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                  className="w-8 h-8 rounded-full object-cover"
                  alt="User"
                />
                <div>
                  <p className="text-xs font-bold text-foreground mb-0.5">李美美</p>
                  <div className="flex gap-px text-yellow-400">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-2 h-2 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                练习了一周，早起后的面部浮肿明显改善了！老师讲解得非常细致，动作很好跟练。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA Button */}
      <div className="absolute bottom-0 left-0 w-full bg-card/85 backdrop-blur-xl px-6 pt-4 pb-8 z-30">
        <button
          onClick={() => navigate("/workout")}
          className="w-full h-14 bg-gradient-to-br from-primary to-primary/80 rounded-2xl text-primary-foreground font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
        >
          <Play className="w-5 h-5 fill-current" />
          {isPlaying ? "暂停训练" : "继续今日训练"}
        </button>
      </div>
    </div>
  );
};

export default CourseDetail;
