import { useState } from "react";
import { X, Check, ChevronDown, ArrowRight } from "lucide-react";

const Paywall = ({ onClose }: { onClose?: () => void }) => {
  const [selectedPlan, setSelectedPlan] = useState("annual");
  const [promoCode, setPromoCode] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleStartTrial = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const images = [
    {
      src: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=300&h=400",
      alt: "紧致提拉",
      category: "Facial Workout",
      title: "紧致提拉",
    },
    {
      src: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=300&h=400",
      alt: "眼部焕活",
      category: "Eye Care",
      title: "眼部焕活",
    },
    {
      src: "https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&q=80&w=300&h=400",
      alt: "下颌线雕塑",
      category: "Jawline Sculpt",
      title: "下颌线雕塑",
    },
  ];

  const features = [
    { title: "每天只需15分钟", description: "轻松融入日常护肤流程，随时随地练习" },
    { title: "定制化专属方案", description: "根据您的面部特征和目标，智能推荐课程" },
    { title: "专家级指导", description: "由资深面部瑜伽导师设计，科学安全有效" },
  ];

  return (
    <div className="relative min-h-screen w-full bg-background text-foreground pb-36">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 sticky top-0 z-10 backdrop-blur-md bg-background/90">
        <div className="w-6" />
        <h1 className="text-xl tracking-[0.3em] font-medium ml-4">G L O W</h1>
        <button
          onClick={onClose}
          className="p-2 -mr-2 text-foreground opacity-60 hover:opacity-100 transition-opacity"
        >
          <X className="w-6 h-6" />
        </button>
      </header>

      {/* Image Gallery */}
      <section className="mt-2 pl-6">
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 pr-6 no-scrollbar">
          {images.map((img) => (
            <div
              key={img.alt}
              className="snap-start shrink-0 relative w-[140px] h-[170px] rounded-2xl overflow-hidden shadow-sm"
            >
              <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
              <div className="absolute bottom-3 left-3 text-primary-foreground">
                <span className="text-[10px] font-semibold tracking-wider uppercase opacity-90">
                  {img.category}
                </span>
                <p className="text-sm font-medium leading-tight mt-0.5">{img.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hero Text */}
      <section className="px-6 mt-8">
        <h2 className="text-[38px] leading-[1.1] font-semibold tracking-tight text-foreground">
          开启你的
          <br />
          逆龄之旅
        </h2>
        <div className="mt-4 text-[15px] font-medium text-foreground">
          <span>$0 today. Free for 7 days.</span>
          <br />
          <span className="border-b border-primary pb-0.5">
            今天免费，7天试用，随时取消。
          </span>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 mt-10 flex flex-col gap-6">
        {features.map((f) => (
          <div key={f.title} className="flex justify-between items-center">
            <div>
              <h3 className="text-[16px] font-semibold text-foreground">{f.title}</h3>
              <p className="text-[14px] text-muted-foreground mt-1 font-medium">{f.description}</p>
            </div>
            <div className="pl-4">
              <Check className="w-5 h-5 text-primary" />
            </div>
          </div>
        ))}
      </section>

      {/* Pricing Plans */}
      <section className="px-6 mt-12 flex flex-col gap-4">
        {/* Annual */}
        <div
          className={`relative rounded-2xl border-2 bg-card p-5 cursor-pointer shadow-sm transition-transform active:scale-[0.98] ${
            selectedPlan === "annual" ? "border-primary" : "border-border"
          }`}
          onClick={() => setSelectedPlan("annual")}
        >
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-[17px] font-semibold text-foreground">年度订阅</span>
              <span className="text-[14px] font-semibold text-primary mt-1">7天免费试用</span>
              <div className="mt-3">
                <div className="inline-flex items-center border border-primary rounded-full px-2.5 py-1">
                  <span className="text-[12px] font-medium text-primary">立省 ¥300/年</span>
                  <Check className="w-3.5 h-3.5 ml-1 text-primary" />
                </div>
              </div>
            </div>
            <span className="text-[17px] font-semibold text-foreground">¥12.50/月</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-5 uppercase tracking-wide font-medium">
            按年扣费 ¥150，可随时取消。自动续订至 2027年4月4日。
          </p>
        </div>

        {/* Monthly */}
        <div
          className={`rounded-2xl border-2 p-5 cursor-pointer transition-all active:scale-[0.98] ${
            selectedPlan === "monthly"
              ? "bg-card border-primary"
              : "bg-card/60 border-border hover:bg-card"
          }`}
          onClick={() => setSelectedPlan("monthly")}
        >
          <div className="flex justify-between items-start">
            <span className="text-[17px] font-semibold text-foreground">月度订阅</span>
            <span className="text-[17px] font-semibold text-foreground">¥25.00/月</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-8 uppercase tracking-wide font-medium">
            按月扣费 ¥25，可随时取消。自动续订至 2025年5月4日。
          </p>
        </div>

        {/* View all */}
        <div className="flex justify-center mt-2">
          <button className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 uppercase tracking-widest hover:text-foreground transition-colors">
            查看所有选项
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </section>

      {/* Promo & Legal */}
      <section className="px-6 mt-14 border-t border-border pt-8">
        <div className="border-b border-border pb-3">
          <input
            type="text"
            placeholder="输入优惠码 (PROMO CODE)"
            className="w-full bg-transparent outline-none text-[13px] font-medium text-foreground placeholder:text-muted-foreground"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          />
        </div>

        <div className="mt-8 space-y-6">
          <p className="text-[12px] text-muted-foreground leading-relaxed font-medium">
            我们致力于提供包容性的服务。如果您需要经济支持，我们提供专项奖学金计划。请发送邮件至{" "}
            <a href="mailto:support@glow-yoga.com" className="underline underline-offset-2">
              support@glow-yoga.com
            </a>{" "}
            了解更多信息。
          </p>

          <div className="flex flex-col gap-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            <a href="#" className="flex items-center w-max hover:text-foreground transition-colors">
              服务条款 (TERMS)
              <ArrowRight className="w-3 h-3 ml-1" />
            </a>
            <a href="#" className="flex items-center w-max hover:text-foreground transition-colors">
              隐私政策 (PRIVACY)
              <ArrowRight className="w-3 h-3 ml-1" />
            </a>
            <a href="#" className="flex items-center w-max hover:text-foreground transition-colors">
              如何取消 (HOW TO CANCEL)
              <ArrowRight className="w-3 h-3 ml-1" />
            </a>
          </div>
        </div>
      </section>

      <div className="h-40" />

      {/* Fixed Bottom CTA */}
      <div
        className="fixed bottom-0 left-0 right-0 p-6 pt-16 z-20"
        style={{
          background: "linear-gradient(to top, hsl(var(--background)) 60%, transparent)",
        }}
      >
        <button
          onClick={handleStartTrial}
          className="w-full bg-primary text-primary-foreground rounded-full py-4 text-[17px] font-medium flex items-center justify-center gap-2 shadow-lg hover:bg-primary/90 active:scale-[0.98] transition-all"
        >
          {showSuccess ? "试用已开始 ✓" : "开始免费试用"}
          {!showSuccess && <ArrowRight className="w-5 h-5" />}
        </button>
        <div className="text-center mt-4">
          <button className="text-[13px] text-muted-foreground font-medium flex items-center justify-center gap-1 w-full hover:text-foreground transition-colors">
            恢复购买 (Restore)
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Paywall;
