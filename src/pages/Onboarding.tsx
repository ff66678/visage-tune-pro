import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ArrowRight, Check, Droplets, Wind, Link, Heart, Sparkles, TrendingDown, Moon, Frown, Clock, Timer, Hourglass, Infinity, Rocket, CalendarCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Paywall from "./Paywall";

const TOTAL_STEPS = 6;

// Step 1: Welcome
const WelcomeStep = ({ onNext }: { onNext: () => void }) => (
  <div className="flex-1 flex flex-col items-center justify-center px-8">
    <div className="w-28 h-28 rounded-full bg-primary/10 flex items-center justify-center mb-8">
      <Sparkles className="w-14 h-14 text-primary" />
    </div>
    <h1 className="text-3xl font-bold text-foreground mb-3 text-center">欢迎来到面部瑜伽</h1>
    <p className="text-sm text-muted-foreground text-center leading-relaxed max-w-[280px]">
      让我们花几分钟了解您的需求，为您打造专属的面部护理方案。
    </p>
    <div className="absolute bottom-0 left-0 w-full p-6 pt-12" style={{ background: 'linear-gradient(to top, hsl(var(--background)) 60%, transparent)' }}>
      <button onClick={onNext} className="w-full bg-primary text-primary-foreground rounded-2xl py-5 font-bold text-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-lg">
        开始定制 <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  </div>
);

// Step 2: Goal
const goals = [
  { icon: TrendingDown, label: "紧致提升", desc: "改善面部轮廓，提拉下垂" },
  { icon: Sparkles, label: "焕亮肤色", desc: "提升气色，自然光泽" },
  { icon: Clock, label: "抗衰老", desc: "减少细纹，延缓老化" },
  { icon: Heart, label: "放松减压", desc: "缓解面部紧张，身心放松" },
];

const GoalStep = ({ selected, onSelect }: { selected: string | null; onSelect: (v: string) => void }) => (
  <div className="flex-1 overflow-y-auto px-6 pb-32">
    <h1 className="text-3xl font-bold text-foreground mb-2">您的主要目标？</h1>
    <p className="text-sm text-muted-foreground mb-8">选择一个最符合您需求的目标，我们将围绕它定制方案。</p>
    <div className="space-y-4">
      {goals.map((g) => {
        const active = selected === g.label;
        return (
          <button key={g.label} onClick={() => onSelect(g.label)}
            className={`w-full flex items-center gap-4 p-5 rounded-3xl border-2 transition-all ${active ? 'border-primary bg-primary/5' : 'border-transparent bg-card'}`}
            style={{ boxShadow: active ? undefined : '0 10px 30px -10px rgba(181,137,137,0.15)' }}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${active ? 'bg-primary/20' : 'bg-secondary'}`}>
              <g.icon className={`w-6 h-6 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
            </div>
            <div className="flex-1 text-left">
              <div className="font-bold text-foreground">{g.label}</div>
              <div className="text-xs text-muted-foreground">{g.desc}</div>
            </div>
            <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${active ? 'bg-primary border-primary' : 'border-muted'}`}>
              {active && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
            </div>
          </button>
        );
      })}
    </div>
  </div>
);

// Step 3: Skin Type
const skinTypes = [
  { icon: Droplets, label: "油性", desc: "光泽过盛，毛孔明显" },
  { icon: Wind, label: "干性", desc: "起皮、紧绷或暗沉" },
  { icon: Link, label: "混合性", desc: "T区油，脸颊干" },
  { icon: Heart, label: "敏感性", desc: "易泛红和刺激" },
];

const SkinTypeStep = ({ selected, onSelect }: { selected: string | null; onSelect: (v: string) => void }) => (
  <div className="flex-1 overflow-y-auto px-6 pb-32">
    <h1 className="text-3xl font-bold text-foreground mb-2">您的肤质是什么？</h1>
    <p className="text-sm text-muted-foreground mb-8">这有助于我们根据您独特的肌肤需求定制锻炼和护肤建议。</p>
    <div className="space-y-4">
      {skinTypes.map((s) => {
        const active = selected === s.label;
        return (
          <button key={s.label} onClick={() => onSelect(s.label)}
            className={`w-full flex items-center gap-4 p-5 rounded-3xl border-2 transition-all ${active ? 'border-primary bg-primary/5' : 'border-transparent bg-card'}`}
            style={{ boxShadow: active ? undefined : '0 10px 30px -10px rgba(181,137,137,0.15)' }}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${active ? 'bg-primary/20' : 'bg-secondary'}`}>
              <s.icon className={`w-6 h-6 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
            </div>
            <div className="flex-1 text-left">
              <div className="font-bold text-foreground">{s.label}</div>
              <div className="text-xs text-muted-foreground">{s.desc}</div>
            </div>
            <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${active ? 'bg-primary border-primary' : 'border-muted'}`}>
              {active && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
            </div>
          </button>
        );
      })}
    </div>
  </div>
);

// Step 4: Skin Concerns (multi-select)
const concerns = [
  { icon: Sparkles, label: "细纹", desc: "眼周和额头皱纹" },
  { icon: TrendingDown, label: "松弛", desc: "脸颊和下颌失去弹性" },
  { icon: Moon, label: "黑眼圈", desc: "眼部疲劳和浮肿" },
  { icon: Frown, label: "暗沉", desc: "缺乏自然光泽" },
];

const ConcernsStep = ({ selected, onToggle }: { selected: string[]; onToggle: (v: string) => void }) => (
  <div className="flex-1 overflow-y-auto px-6 pb-32">
    <h1 className="text-3xl font-bold text-foreground mb-2">您的皮肤关注点是什么？</h1>
    <p className="text-sm text-muted-foreground mb-8">选择所有适用项来个性化您的每日面部瑜伽练习。</p>
    <div className="space-y-4">
      {concerns.map((c) => {
        const active = selected.includes(c.label);
        return (
          <button key={c.label} onClick={() => onToggle(c.label)}
            className={`w-full flex items-center gap-4 p-5 rounded-3xl border-2 transition-all ${active ? 'border-primary bg-primary/5' : 'border-transparent bg-card'}`}
            style={{ boxShadow: active ? undefined : '0 10px 30px -10px rgba(181,137,137,0.15)' }}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${active ? 'bg-primary/20' : 'bg-secondary'}`}>
              <c.icon className={`w-6 h-6 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
            </div>
            <div className="flex-1 text-left">
              <div className="font-bold text-foreground">{c.label}</div>
              <div className="text-xs text-muted-foreground">{c.desc}</div>
            </div>
            <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${active ? 'bg-primary border-primary' : 'border-muted'}`}>
              {active && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
            </div>
          </button>
        );
      })}
    </div>
    {selected.length === 0 && (
      <div className="flex justify-center mt-6">
        <div className="bg-foreground text-primary-foreground text-xs font-medium px-4 py-2 rounded-full">
          至少选择一项开始 ✨
        </div>
      </div>
    )}
  </div>
);

// Step 5: Time
const timeOptions = [
  { icon: Clock, label: "5 分钟", desc: "适合晨间快速焕活" },
  { icon: Hourglass, label: "10 分钟", desc: "日常练习的理想平衡" },
  { icon: Timer, label: "15 分钟", desc: "针对重点部位的深度护理" },
  { icon: Infinity, label: "20+ 分钟", desc: "全面蜕变完整护理" },
];

const TimeStep = ({ selected, onSelect }: { selected: string | null; onSelect: (v: string) => void }) => (
  <div className="flex-1 overflow-y-auto px-6 pb-32">
    <h1 className="text-3xl font-bold text-foreground mb-2">您能投入多少时间？</h1>
    <p className="text-sm text-muted-foreground mb-8">即使每天几分钟，日积月累也能带来显著效果。</p>
    <div className="space-y-4">
      {timeOptions.map((t) => {
        const active = selected === t.label;
        return (
          <button key={t.label} onClick={() => onSelect(t.label)}
            className={`w-full flex items-center gap-4 p-5 rounded-3xl border-2 transition-all ${active ? 'border-primary bg-primary/5' : 'border-transparent bg-card'}`}
            style={{ boxShadow: active ? undefined : '0 10px 30px -10px rgba(181,137,137,0.15)' }}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${active ? 'bg-primary/20' : 'bg-secondary'}`}>
              <t.icon className={`w-6 h-6 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
            </div>
            <div className="flex-1 text-left">
              <div className="font-bold text-foreground">{t.label}</div>
              <div className="text-xs text-muted-foreground">{t.desc}</div>
            </div>
            <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${active ? 'bg-primary border-primary' : 'border-muted'}`}>
              {active && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
            </div>
          </button>
        );
      })}
    </div>
  </div>
);

// Step 6: Plan Summary
const PlanStep = ({ timeLabel }: { timeLabel: string }) => (
  <div className="flex-1 overflow-y-auto px-6 pb-32">
    <h1 className="text-3xl font-bold text-foreground mb-2">您的专属计划已就绪</h1>
    <p className="text-sm text-muted-foreground mb-6">基于您的目标和时间表，我们为您定制了最佳方案。</p>

    <div className="bg-card rounded-[32px] p-8 border border-card text-center mb-6" style={{ boxShadow: '0 10px 30px -10px rgba(181,137,137,0.15)' }}>
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <Sparkles className="w-10 h-10 text-primary" />
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-2">"焕采新生"计划</h2>
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-semibold text-sm mb-6 bg-primary/10 text-primary">
        <Timer className="w-3.5 h-3.5" />
        每日 {timeLabel || "10 分钟"}
      </div>
      <div className="space-y-4 text-left border-t border-border pt-6">
        {["针对眼周与下颌线的定制练习", "每周进度跟踪与面部分析", "配套护肤建议与按摩手法"].map((text) => (
          <div key={text} className="flex items-start gap-3">
            <div className="mt-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
              <Check className="w-2.5 h-2.5 text-primary-foreground" />
            </div>
            <p className="text-sm text-foreground font-medium">{text}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="flex flex-col items-center space-y-2 mb-4">
      <p className="text-primary font-bold uppercase tracking-widest text-[10px]">准备好了吗？</p>
      <h3 className="text-xl font-bold text-foreground">坚持 21 天，见证蜕变</h3>
    </div>

    <div className="grid grid-cols-3 gap-3 mb-8">
      {[{ label: "提升", value: "15%" }, { label: "平滑", value: "22%" }, { label: "提亮", value: "30%" }].map((s) => (
        <div key={s.label} className="bg-card/60 p-3 rounded-2xl text-center border border-card">
          <div className="text-xs text-muted-foreground mb-1">{s.label}</div>
          <div className="text-lg font-bold text-primary">{s.value}</div>
        </div>
      ))}
    </div>
  </div>
);

// Loading Screen
const LoadingScreen = ({ onDone }: { onDone: () => void }) => {
  const [progress, setProgress] = useState(0);
  const steps = ["分析面部对称性", "选择针对性练习", "优化胶原蛋白生成", "确定您的专属计划"];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(timer); return 100; }
        return p + 2;
      });
    }, 80);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const t = setTimeout(onDone, 500);
      return () => clearTimeout(t);
    }
  }, [progress, onDone]);

  const currentStep = Math.min(Math.floor(progress / 25), 3);

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-full max-w-[480px] min-h-screen flex flex-col items-center justify-center px-8 relative">
        {/* Glow */}
        <div className="absolute w-64 h-64 rounded-full bg-primary/10 blur-[60px] top-1/4 left-1/2 -translate-x-1/2" />

        <div className="relative mb-12">
          <div className="w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full animate-spin" style={{ animationDuration: '8s' }} viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" stroke="hsl(var(--muted))" strokeWidth="0.5" fill="none" />
              <circle cx="50" cy="50" r="45" stroke="hsl(var(--primary))" strokeWidth="2" fill="none" strokeDasharray="20 180" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-card shadow-xl flex items-center justify-center border-4 border-border">
                <Sparkles className="w-12 h-12 text-primary" />
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-2">正在制定计划...</h2>
          <p className="text-sm font-medium text-muted-foreground px-4">AI正在分析您的面部特征，为您定制完美的日常护肤训练。</p>
        </div>

        <div className="w-full max-w-[280px] space-y-5">
          {steps.map((step, i) => (
            <div key={step} className={`flex items-center gap-4 ${i > currentStep ? 'opacity-40' : ''}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${i < currentStep ? 'bg-primary' : i === currentStep ? 'bg-primary/20' : 'bg-secondary'}`}>
                {i < currentStep ? <Check className="w-3 h-3 text-primary-foreground" /> :
                  i === currentStep ? <div className="w-2 h-2 rounded-full bg-primary animate-ping" /> :
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />}
              </div>
              <span className={`text-sm ${i <= currentStep ? 'font-semibold text-foreground' : 'font-medium text-foreground'}`}>{step}</span>
            </div>
          ))}
        </div>

        <div className="absolute bottom-12 left-0 w-full px-8">
          <div className="rounded-2xl p-4 flex items-center justify-between bg-card/60 backdrop-blur-sm border border-card">
            <div className="flex items-center gap-3">
              <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">即将完成</span>
            </div>
            <span className="text-xs font-bold text-muted-foreground">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Success Screen
const SuccessScreen = ({ onStart }: { onStart: () => void }) => (
  <div className="min-h-screen bg-background flex justify-center">
    <div className="w-full max-w-[480px] min-h-screen flex flex-col relative">
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="relative mb-10">
          <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center animate-pulse" style={{ animationDuration: '3s' }}>
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg">
                <Check className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
          </div>
          <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-primary animate-bounce" />
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-foreground">一切就绪！</h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-[280px] mx-auto">
            您的专属塑颜焕肤计划已准备就绪。<br />让我们共同开启这段美丽旅程。
          </p>
        </div>

        <div className="mt-10 w-full bg-card p-5 rounded-3xl border border-border flex items-center gap-4" style={{ boxShadow: '0 10px 30px -10px rgba(181,137,137,0.2)' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-secondary">
            <CalendarCheck className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest">今日重点</p>
            <h4 className="font-bold text-foreground">下颌线塑形</h4>
            <p className="text-xs text-muted-foreground">初级 · 8分钟</p>
          </div>
        </div>
      </div>

      <div className="p-8 w-full">
        <button onClick={onStart}
          className="w-full bg-primary text-primary-foreground rounded-2xl py-5 font-bold text-lg flex items-center justify-center gap-3 active:scale-[0.98] transition-transform shadow-lg">
          开启首次训练 <Rocket className="w-5 h-5" />
        </button>
        <p className="text-center text-xs text-muted-foreground mt-6">
          我们将在每日 <span className="font-semibold text-foreground">上午8:30</span> 提醒您
        </p>
      </div>
    </div>
  </div>
);

// Main Onboarding Component
const Onboarding = () => {
  const navigate = useNavigate();
  const { user, setOnboardingCompleted } = useAuth();

  const completeOnboarding = async () => {
    if (user) {
      await supabase.from("profiles").update({ onboarding_completed: true } as any).eq("user_id", user.id);
      setOnboardingCompleted(true);
      navigate("/");
    }
  };

  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<string | null>(null);
  const [skinType, setSkinType] = useState<string | null>(null);
  const [concerns, setConcerns] = useState<string[]>([]);
  const [time, setTime] = useState<string | null>(null);
  const [showLoading, setShowLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  const toggleConcern = (c: string) => {
    setConcerns((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);
  };

  const canContinue = () => {
    if (step === 1) return !!goal;
    if (step === 2) return !!skinType;
    if (step === 3) return concerns.length > 0;
    if (step === 4) return !!time;
    return true;
  };

  const handleNext = () => {
    if (step === 5) {
      setShowLoading(true);
      return;
    }
    if (step < TOTAL_STEPS - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  // After success → if not logged in, show auth; if logged in, show paywall
  const handleSuccessNext = () => {
    if (user) {
      setShowSuccess(false);
      setShowPaywall(true);
    } else {
      setShowSuccess(false);
      setShowAuth(true);
    }
  };

  // When user logs in during onboarding auth step, move to paywall
  useEffect(() => {
    if (showAuth && user) {
      setShowAuth(false);
      setShowPaywall(true);
    }
  }, [user, showAuth]);

  if (showPaywall) {
    return <Paywall onClose={completeOnboarding} />;
  }

  if (showAuth) {
    return <Auth />;
  }

  if (showSuccess) {
    return <SuccessScreen onStart={handleSuccessNext} />;
  }

  if (showLoading) {
    return <LoadingScreen onDone={() => { setShowLoading(false); setShowSuccess(true); }} />;
  }

  // Step 0 = Welcome (no header)
  if (step === 0) {
    return (
      <div className="min-h-screen bg-background flex justify-center">
        <div className="w-full max-w-[480px] min-h-screen relative flex flex-col">
          <WelcomeStep onNext={() => setStep(1)} />
        </div>
      </div>
    );
  }

  const progressWidth = `${(step / TOTAL_STEPS) * 100}%`;

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-full max-w-[480px] min-h-screen relative flex flex-col no-scrollbar overflow-y-auto">
        {/* Header with progress */}
        <div className="pt-14 px-6 pb-6">
          <div className="flex items-center gap-4 mb-8">
            <button onClick={handleBack} className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-foreground shadow-sm active:scale-95 transition-transform">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-500 ease-out" style={{ width: progressWidth }} />
            </div>
            <span className="text-xs font-bold text-primary">{step}/{TOTAL_STEPS}</span>
          </div>
        </div>

        {/* Steps */}
        {step === 1 && <GoalStep selected={goal} onSelect={setGoal} />}
        {step === 2 && <SkinTypeStep selected={skinType} onSelect={setSkinType} />}
        {step === 3 && <ConcernsStep selected={concerns} onToggle={toggleConcern} />}
        {step === 4 && <TimeStep selected={time} onSelect={setTime} />}
        {step === 5 && <PlanStep timeLabel={time || "10 分钟"} />}

        {/* Bottom CTA */}
        <div className="absolute bottom-0 left-0 w-full p-6 pt-12" style={{ background: 'linear-gradient(to top, hsl(var(--background)) 60%, transparent)' }}>
          <button onClick={handleNext} disabled={!canContinue()}
            className="w-full bg-primary text-primary-foreground rounded-2xl py-5 font-bold text-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-lg disabled:opacity-50 disabled:scale-100">
            {step === 5 ? "开启我的旅程" : "继续"} <ArrowRight className="w-5 h-5" />
          </button>
          {step === 5 && (
            <p className="text-center text-[11px] text-muted-foreground mt-4">点击即表示您同意我们的服务条款与隐私政策</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
