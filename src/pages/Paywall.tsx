import { useState } from "react";
import { X, Sparkles, Wand2, Shrink, UserCog, Star, Check } from "lucide-react";

const Paywall = ({ onClose }: { onClose?: () => void }) => {
  const [selectedPlan, setSelectedPlan] = useState("yearly");

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-full max-w-[480px] min-h-screen flex flex-col relative overflow-hidden">
        {/* Top Bar */}
        <div className="absolute top-0 w-full flex justify-between items-center p-5 z-20">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center text-foreground shadow-sm active:scale-95 transition-transform"
          >
            <X className="w-4 h-4" />
          </button>
          <button className="text-sm font-medium text-muted-foreground bg-card/50 backdrop-blur-sm px-3 py-1 rounded-full">
            恢复购买
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar" style={{ paddingBottom: "160px" }}>
          {/* Hero Image */}
          <div
            className="relative w-full overflow-hidden"
            style={{ height: "320px", borderBottomLeftRadius: "40px", borderBottomRightRadius: "40px" }}
          >
            <div className="w-full h-full bg-secondary" />
            <img
              src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="面部瑜伽"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ mixBlendMode: "multiply", opacity: 0.8 }}
            />
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-transparent to-transparent" />
            <div className="absolute bottom-6 left-0 w-full px-6 z-20 text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3 shadow-sm bg-card/80 backdrop-blur-sm text-primary">
                <Sparkles className="w-3 h-3" />
                专属计划已就绪
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
                开启<br />自然光彩
              </h1>
              <p className="text-sm font-medium text-foreground/80">每天只需15分钟，塑造精致面容。</p>
            </div>
          </div>

          {/* Features */}
          <div className="px-5 mt-8 space-y-3">
            {[
              { icon: Wand2, title: "减少细纹", desc: "抚平皱纹，自然促进胶原蛋白生成。" },
              { icon: Shrink, title: "雕塑下颌线", desc: "锻炼面部肌肉，打造立体轮廓。" },
              { icon: UserCog, title: "专业指导", desc: "认证导师高清视频教程。" },
            ].map((f) => (
              <div key={f.title} className="flex items-center gap-4 p-4 rounded-2xl bg-card" style={{ boxShadow: "0 10px 30px -10px rgba(181,137,137,0.15)" }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-primary/10">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-foreground">{f.title}</h3>
                  <p className="text-xs mt-0.5 text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="px-5 mt-8">
            <h3 className="text-sm font-semibold mb-3 ml-1 text-muted-foreground">数千人喜爱</h3>
            <div className="p-5 relative bg-secondary/50 rounded-3xl border border-card">
              <div className="absolute font-serif text-4xl text-primary/30" style={{ top: "-12px", right: "-8px" }}>"</div>
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-3.5 h-3.5 text-primary" fill="currentColor" />
                ))}
              </div>
              <p className="leading-relaxed italic mb-3 text-[13px] text-foreground">
                "我已经练习3周了，下颌线明显更紧致。这已成为我最喜欢的晨间仪式！"
              </p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-primary-foreground text-[10px] bg-primary">
                  E
                </div>
                <span className="text-xs font-semibold text-foreground">Elena M.</span>
                <span className="text-xs text-muted-foreground">• 已认证用户</span>
              </div>
            </div>
          </div>

          {/* Pricing Plans */}
          <div className="px-5 mt-8 mb-8">
            {/* Yearly */}
            {/* Yearly Plan */}
            <div
              className={`relative rounded-3xl p-5 cursor-pointer mb-4 transition-all active:scale-[0.98] bg-card border-2 ${selectedPlan === "yearly" ? "border-primary" : "border-border opacity-70"}`}
              onClick={() => setSelectedPlan("yearly")}
            >
              <div className="absolute flex items-center gap-1.5 font-bold uppercase text-primary-foreground shadow-md whitespace-nowrap bg-primary text-[10px] tracking-wider px-4 py-1.5 rounded-full"
                style={{ top: "-14px", left: "50%", transform: "translateX(-50%)" }}>
                🔥 限时优惠
              </div>
              <div className="flex justify-between items-start mt-1">
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${selectedPlan === "yearly" ? "bg-primary" : "border-2 border-border"}`}>
                    {selectedPlan === "yearly" && <div className="w-2 h-2 rounded-full bg-primary-foreground" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-foreground">年卡会员</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-sm font-semibold text-primary">7天免费试用</span>
                      <span className="text-xs text-muted-foreground">之后 ¥39.99/年</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-foreground">¥3.33</div>
                  <div className="font-medium uppercase text-[10px] text-muted-foreground tracking-wide mt-0.5">每月</div>
                </div>
              </div>
            </div>

            {/* Monthly Plan */}
            <div
              className={`relative rounded-3xl p-5 cursor-pointer transition-all active:scale-[0.98] bg-card border-2 ${selectedPlan === "monthly" ? "border-primary" : "border-border opacity-70"}`}
              onClick={() => setSelectedPlan("monthly")}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${selectedPlan === "monthly" ? "bg-primary" : "border-2 border-border"}`}>
                    {selectedPlan === "monthly" && <div className="w-2 h-2 rounded-full bg-primary-foreground" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-foreground">月卡会员</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">按月计费</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-foreground">¥8.99</div>
                  <div className="font-medium uppercase text-[10px] text-muted-foreground tracking-wide mt-0.5">每月</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ height: "40px" }} />
        </div>

        {/* Fixed Bottom CTA */}
        <div className="absolute bottom-0 left-0 w-full z-30 px-5 pb-8 pt-10" style={{ background: "linear-gradient(to top, hsl(var(--background)), hsl(var(--background)), transparent)" }}>
          <button className="w-full bg-primary text-primary-foreground rounded-2xl py-4 font-bold text-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-lg">
            开始7天免费试用
          </button>
          <p className="text-center mt-4 leading-relaxed px-2 text-[10px] text-muted-foreground">
            试用结束后，您将被收取 ¥39.99/年。可在试用结束前在设置中随时取消，避免扣费。
            <br />
            继续使用即表示您同意我们的{" "}
            <a href="#" className="underline">服务条款</a>
            {" "}与{" "}
            <a href="#" className="underline">隐私政策</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Paywall;
