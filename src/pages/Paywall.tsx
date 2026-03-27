import { useState } from "react";
import { X, Check, ChevronDown } from "lucide-react";

const Paywall = ({ onClose }: { onClose?: () => void }) => {
  const [selectedPlan, setSelectedPlan] = useState("yearly");
  const [showAllPlans, setShowAllPlans] = useState(false);

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-full max-w-[480px] min-h-screen flex flex-col relative overflow-hidden">
        {/* Top Bar */}
        <div className="absolute top-0 w-full flex justify-end items-center p-5 z-20">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center text-foreground shadow-sm active:scale-95 transition-transform"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar" style={{ paddingBottom: "140px" }}>
          {/* Hero Image Cards */}
          <div className="pt-14 px-5">
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4">
              {[
                { img: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&q=80", label: "面部提升" },
                { img: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&q=80", label: "深度放松" },
                { img: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&q=80", label: "晨间唤醒" },
              ].map((card) => (
                <div key={card.label} className="relative shrink-0 w-[160px] h-[200px] rounded-2xl overflow-hidden">
                  <img src={card.img} alt={card.label} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-3 left-3 text-[11px] font-semibold tracking-wider uppercase text-white">
                    {card.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Headline */}
          <div className="px-5 mt-4">
            <h1 className="text-[32px] leading-[1.15] font-bold tracking-tight text-foreground">
              开启你的<br />自然光彩之旅
            </h1>
          </div>

          {/* Free trial callout */}
          <div className="px-5 mt-4">
            <p className="text-base text-foreground/90 font-medium">
              ¥0 今天开始，免费体验7天。
            </p>
            <p className="text-sm text-muted-foreground underline underline-offset-2 mt-0.5">
              随时取消。
            </p>
          </div>

          {/* Feature checklist */}
          <div className="px-5 mt-6 space-y-4">
            {[
              { title: "减少细纹，焕发光彩", desc: "专家设计的面部瑜伽课程。" },
              { title: "雕塑面部轮廓", desc: "紧致下颌线，提升面部线条。" },
              { title: "专业导师指导", desc: "认证导师高清视频，科学有效。" },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-[15px] text-foreground">{f.title}</h3>
                  <p className="text-[13px] mt-0.5 text-muted-foreground">{f.desc}</p>
                </div>
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="px-5 mt-8">
            <div className="h-px bg-border" />
          </div>

          {/* Pricing - Yearly (always visible) */}
          <div className="px-5 mt-6">
            <div
              className={`rounded-2xl p-5 cursor-pointer transition-all active:scale-[0.98] border-2 bg-card ${selectedPlan === "yearly" ? "border-primary" : "border-border"}`}
              onClick={() => setSelectedPlan("yearly")}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-lg text-foreground">年卡会员</h4>
                  <p className="text-sm text-primary font-medium mt-1">7天免费试用</p>
                  <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full border border-primary/30 text-primary text-xs font-semibold">
                    省 ¥67.89/年 <Check className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-2 uppercase tracking-wide">
                    之后 ¥39.99/年 自动续费，可随时取消
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-foreground">¥3.33</div>
                  <div className="text-[11px] text-muted-foreground">/月</div>
                </div>
              </div>
            </div>
          </div>

          {/* View all options toggle */}
          <div className="px-5 mt-4 flex justify-center">
            <button
              onClick={() => setShowAllPlans(!showAllPlans)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium uppercase tracking-wider"
            >
              查看全部方案
              <ChevronDown className={`w-4 h-4 transition-transform ${showAllPlans ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* Monthly Plan (collapsible) */}
          {showAllPlans && (
            <div className="px-5 mt-4">
              <div
                className={`rounded-2xl p-5 cursor-pointer transition-all active:scale-[0.98] border-2 bg-card ${selectedPlan === "monthly" ? "border-primary" : "border-border"}`}
                onClick={() => setSelectedPlan("monthly")}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-lg text-foreground">月卡会员</h4>
                    <p className="text-[11px] text-muted-foreground mt-2 uppercase tracking-wide">
                      按月自动续费 ¥8.99/月，可随时取消
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-foreground">¥8.99</div>
                    <div className="text-[11px] text-muted-foreground">/月</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div style={{ height: "40px" }} />
        </div>

        {/* Fixed Bottom CTA */}
        <div className="absolute bottom-0 left-0 w-full z-30 px-5 pb-6 pt-6" style={{ background: "linear-gradient(to top, hsl(var(--background)) 70%, transparent)" }}>
          <button className="w-full bg-primary text-primary-foreground rounded-full py-4 font-bold text-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-lg">
            开始免费试用 →
          </button>
          <button className="w-full text-center mt-3 text-sm text-muted-foreground font-medium">
            恢复购买 →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Paywall;
