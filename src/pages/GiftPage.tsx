import { useNavigate } from "react-router-dom";
import { X, Share2 } from "lucide-react";

const GiftPage = () => {
  const navigate = useNavigate();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "GLOW 面部瑜伽",
        text: "送你 7 天 GLOW Premium 体验，一起变美吧！",
        url: window.location.origin + "/gift",
      }).catch(() => {});
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{
        background: "linear-gradient(165deg, hsl(var(--primary) / 0.15) 0%, hsl(var(--background)) 40%, hsl(var(--primary) / 0.08) 100%)",
      }}
    >
      {/* Close */}
      <div className="pt-14 px-6">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-foreground/10 backdrop-blur-sm flex items-center justify-center text-foreground"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Gift Card */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div
          className="w-[280px] h-[200px] rounded-[24px] flex items-center justify-center relative overflow-hidden mb-10"
          style={{
            background: "linear-gradient(135deg, hsl(var(--primary) / 0.9), hsl(var(--primary) / 0.6), hsl(var(--primary) / 0.85))",
            boxShadow: "0 20px 60px -15px hsl(var(--primary) / 0.4), 0 0 0 1px hsl(var(--primary-foreground) / 0.15) inset",
          }}
        >
          {/* Shine effect */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: "linear-gradient(120deg, transparent 30%, hsl(var(--primary-foreground) / 0.4) 50%, transparent 70%)",
            }}
          />
          <div
            className="absolute top-0 left-0 w-full h-full opacity-20"
            style={{
              background: "radial-gradient(circle at 20% 80%, hsl(var(--primary-foreground) / 0.3), transparent 60%)",
            }}
          />
          <span
            className="relative text-[42px] font-light tracking-[0.15em] text-primary-foreground"
            style={{ fontStyle: "italic" }}
          >
            GLOW
          </span>
        </div>

        {/* Badge */}
        <div className="mb-5">
          <span className="px-4 py-1.5 rounded-full bg-card border border-border text-xs font-semibold text-foreground shadow-sm">
            限时特别礼物
          </span>
        </div>

        {/* Title */}
        <h1 className="text-[28px] leading-[1.2] font-bold text-foreground text-center tracking-tight">
          赠予免费 <span className="text-muted-foreground line-through text-[22px]">7天</span>{" "}
          <span className="text-primary">30 天</span> GLOW
          <br />
          Premium 通行证
        </h1>

        {/* Subtitle */}
        <p className="text-sm text-muted-foreground text-center mt-4 leading-relaxed max-w-[300px]">
          将通行证传送给你在乎的人，让她们可以在一个月内免费使用 GLOW Premium 所有内容。
        </p>
      </div>

      {/* Bottom CTA */}
      <div className="px-6 pb-10 pt-4">
        <button
          onClick={handleShare}
          className="w-full bg-card text-foreground border border-border rounded-full py-4 text-[17px] font-semibold flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-transform"
        >
          <Share2 className="w-4.5 h-4.5" />
          立即分享
        </button>
      </div>
    </div>
  );
};

export default GiftPage;
