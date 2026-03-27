import { useNavigate } from "react-router-dom";
import { Gift, ChevronLeft, Sparkles, Play, Clock, Star, Users } from "lucide-react";

const GiftPage = () => {
  const navigate = useNavigate();

  const senderName = "小美";

  const benefits = [
    { icon: Play, label: "50+ 精品课程全部解锁", desc: "面部瑜伽 · 提拉紧致 · 眼部护理" },
    { icon: Clock, label: "AI 定制每日训练方案", desc: "根据你的肤质和目标智能推荐" },
    { icon: Star, label: "专家点评与进度追踪", desc: "记录每一次变化，看见真实效果" },
  ];

  const handleClaim = () => {
    // For now navigate to onboarding for new users
    navigate("/onboarding");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      {/* Header */}
      <div className="pt-14 px-6 pb-2 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-foreground shadow-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-36">
        {/* Title Section */}
        <div className="mt-4 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Gift className="w-4 h-4 text-primary" />
            </div>
            <span className="text-xs font-bold text-primary uppercase tracking-widest">GIFT FOR YOU</span>
          </div>
          <h1 className="text-[32px] leading-[1.15] font-bold text-foreground tracking-tight">
            你收到一份
            <br />
            <span className="text-primary">专属礼物</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
            {senderName} 送你 <span className="font-semibold text-foreground">7 天 Premium 完整体验</span>，
            开启你的面部焕颜之旅。
          </p>
        </div>

        {/* Gift Card */}
        <div className="relative bg-card rounded-[28px] border border-border overflow-hidden mb-8"
          style={{ boxShadow: "0 12px 40px -12px hsl(var(--primary) / 0.15)" }}>
          {/* Ribbon */}
          <div className="bg-primary/5 border-b border-border px-6 py-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">来自好友</p>
              <p className="text-sm font-bold text-foreground">{senderName}</p>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-baseline justify-between mb-1">
              <h3 className="text-lg font-bold text-foreground">7 天 Premium</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-xs text-muted-foreground line-through">¥25</span>
                <span className="text-lg font-bold text-primary">免费</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              畅享全部会员功能，无需绑定支付方式
            </p>

            {/* Visual separator */}
            <div className="my-5 flex items-center gap-2">
              <div className="flex-1 border-t border-dashed border-border" />
              <Sparkles className="w-3.5 h-3.5 text-primary/40" />
              <div className="flex-1 border-t border-dashed border-border" />
            </div>

            <div className="space-y-3">
              {benefits.map((b) => (
                <div key={b.label} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center shrink-0 mt-0.5">
                    <b.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground leading-tight">{b.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-6 mb-4">
          {["无需支付", "随时取消", "即刻生效"].map((t) => (
            <div key={t} className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-[11px] font-medium text-muted-foreground">{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div
        className="fixed bottom-0 left-0 right-0 p-6 pt-16 z-20"
        style={{
          background: "linear-gradient(to top, hsl(var(--background)) 60%, transparent)",
        }}
      >
        <button
          onClick={handleClaim}
          className="w-full bg-primary text-primary-foreground rounded-2xl py-4 text-[17px] font-bold flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-transform"
        >
          <Gift className="w-5 h-5" />
          领取礼物并开始体验
        </button>
        <p className="text-center text-[11px] text-muted-foreground mt-4">
          仅限新用户领取 · 每人限领一次
        </p>
      </div>
    </div>
  );
};

export default GiftPage;
