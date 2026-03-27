import { useState, useEffect } from "react";
import { ArrowLeft, Check, Star, Crown, Sparkles, Zap, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    id: "monthly",
    name: "月度会员",
    price: 28,
    originalPrice: 38,
    period: "/月",
    tag: null,
  },
  {
    id: "yearly",
    name: "年度会员",
    price: 168,
    originalPrice: 456,
    period: "/年",
    tag: "最受欢迎",
    monthly: "¥14/月",
  },
  {
    id: "lifetime",
    name: "终身会员",
    price: 298,
    originalPrice: 598,
    period: "一次性",
    tag: "最超值",
  },
];

const features = [
  { name: "基础面部瑜伽课程", free: true, pro: true },
  { name: "每日个性化训练计划", free: false, pro: true },
  { name: "高级面部雕塑技巧", free: false, pro: true },
  { name: "AI 面部分析追踪", free: false, pro: true },
  { name: "专属社区和专家指导", free: false, pro: true },
  { name: "离线下载课程", free: false, pro: true },
];

const reviews = [
  {
    name: "小美",
    avatar: "https://images.pexels.com/photos/3750717/pexels-photo-3750717.jpeg?auto=compress&cs=tinysrgb&w=100",
    rating: 5,
    text: "坚持了 30 天，法令纹明显淡了！朋友都说我看起来年轻了好几岁 ✨",
    days: "使用 30 天",
  },
  {
    name: "Jessica",
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100",
    rating: 5,
    text: "下颌线变得很清晰，双下巴几乎看不到了。每天只要 15 分钟，效果惊人！",
    days: "使用 45 天",
  },
  {
    name: "阿花",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100",
    rating: 5,
    text: "比去美容院性价比高太多了，而且课程讲解很专业，跟着做就行。",
    days: "使用 60 天",
  },
];

const Paywall = ({ onClose }: { onClose?: () => void }) => {
  const [selectedPlan, setSelectedPlan] = useState("yearly");
  const [countdown, setCountdown] = useState({ hours: 2, minutes: 37, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 0; minutes = 0; seconds = 0; }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-90"
          style={{ background: "var(--gradient-plan)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        <div className="relative px-6 pt-12 pb-16">
          <button
            onClick={onClose}
            className="absolute top-12 right-5 w-8 h-8 rounded-full bg-card/20 backdrop-blur-sm flex items-center justify-center text-primary-foreground"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-card/20 backdrop-blur-sm flex items-center justify-center">
              <Crown className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-primary-foreground text-center mb-2">
            解锁全部高级功能
          </h1>
          <p className="text-sm text-primary-foreground/80 text-center max-w-[280px] mx-auto">
            开启 7 天免费试用，随时取消，无风险体验
          </p>
        </div>
      </div>

      {/* Limited Time Offer */}
      <div className="mx-6 -mt-6 bg-card rounded-2xl p-4 shadow-sm border border-border mb-6">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
            <Zap className="w-5 h-5 text-destructive" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">限时特惠 · 低至 3.7 折</p>
            <p className="text-xs text-muted-foreground">优惠倒计时</p>
          </div>
          <div className="flex gap-1">
            {[pad(countdown.hours), pad(countdown.minutes), pad(countdown.seconds)].map(
              (val, i) => (
                <div key={i} className="flex items-center gap-1">
                  <span className="bg-foreground text-card text-xs font-bold px-1.5 py-1 rounded-md min-w-[28px] text-center">
                    {val}
                  </span>
                  {i < 2 && <span className="text-muted-foreground text-xs font-bold">:</span>}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Plan Selection */}
      <div className="px-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">选择你的计划</h2>
        <div className="flex flex-col gap-3">
          {plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative w-full p-4 rounded-2xl border-2 text-left transition-all ${
                selectedPlan === plan.id
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border bg-card"
              }`}
            >
              {plan.tag && (
                <span className="absolute -top-2.5 right-4 bg-primary text-primary-foreground text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  {plan.tag}
                </span>
              )}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-semibold text-foreground">{plan.name}</p>
                  {plan.monthly && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      折合 {plan.monthly}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xs text-muted-foreground line-through">
                      ¥{plan.originalPrice}
                    </span>
                    <span className="text-xl font-bold text-foreground">¥{plan.price}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{plan.period}</p>
                </div>
              </div>
              {/* Radio indicator */}
              <div
                className={`absolute top-1/2 -translate-y-1/2 left-4 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedPlan === plan.id ? "border-primary" : "border-muted-foreground/30"
                }`}
              >
                {selectedPlan === plan.id && (
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                )}
              </div>
              <div className="pl-7">
                {/* spacer for radio */}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Features Comparison */}
      <div className="px-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">免费 vs 高级会员</h2>
        <div className="bg-card rounded-2xl overflow-hidden border border-border">
          <div className="grid grid-cols-[1fr_60px_60px] px-4 py-3 border-b border-border">
            <span className="text-xs text-muted-foreground font-medium">功能</span>
            <span className="text-xs text-muted-foreground font-medium text-center">免费</span>
            <span className="text-xs text-primary font-semibold text-center">PRO</span>
          </div>
          {features.map((f, i) => (
            <div
              key={i}
              className={`grid grid-cols-[1fr_60px_60px] px-4 py-3 ${
                i < features.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <span className="text-sm text-foreground">{f.name}</span>
              <div className="flex justify-center">
                {f.free ? (
                  <Check className="w-4 h-4 text-accent" />
                ) : (
                  <X className="w-4 h-4 text-muted-foreground/30" />
                )}
              </div>
              <div className="flex justify-center">
                <Check className="w-4 h-4 text-primary" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="px-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">用户好评</h2>
        <div className="flex overflow-x-auto gap-3 no-scrollbar -mx-6 px-6 pb-2">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="min-w-[260px] bg-card rounded-2xl p-4 border border-border flex-shrink-0"
            >
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={r.avatar}
                  alt={r.name}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-foreground">{r.name}</p>
                  <p className="text-[10px] text-muted-foreground">{r.days}</p>
                </div>
              </div>
              <div className="flex gap-0.5 mb-2">
                {Array.from({ length: r.rating }).map((_, j) => (
                  <Star
                    key={j}
                    className="w-3.5 h-3.5 text-accent-gold"
                    fill="currentColor"
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{r.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 pb-10">
        <Button
          className="w-full h-14 rounded-2xl text-base font-semibold shadow-lg"
          style={{ background: "var(--gradient-plan)", boxShadow: "0 8px 24px hsl(var(--primary-glow))" }}
        >
          <Sparkles className="w-5 h-5 mr-2" />
          开始 7 天免费试用
        </Button>
        <p className="text-[11px] text-muted-foreground text-center mt-3">
          免费试用结束后自动续费，可随时取消
        </p>
        <button className="w-full text-xs text-muted-foreground underline mt-2 bg-transparent border-none cursor-pointer">
          恢复购买
        </button>
      </div>
    </div>
  );
};

export default Paywall;
