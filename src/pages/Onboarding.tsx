import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { ChevronLeft, ArrowRight, Check, Droplets, Wind, Link, Heart, Sparkles, TrendingDown, Moon, Frown, Clock, Timer, Hourglass, Infinity, Rocket, CalendarCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Paywall from "./Paywall";
import Auth from "./Auth";
import { useTranslation } from "@/i18n/LanguageContext";

const TOTAL_STEPS = 6;

// Step 1: Welcome
const WelcomeStep = ({ onNext, t }: { onNext: () => void; t: (k: string, a?: (string | number)[]) => string }) => (
  <div className="flex-1 flex flex-col items-center justify-center px-8">
    <div className="w-28 h-28 rounded-full bg-primary/10 flex items-center justify-center mb-8">
      <Sparkles className="w-14 h-14 text-primary" />
    </div>
    <h1 className="text-3xl font-bold text-foreground mb-3 text-center">{t("onboarding.welcome")}</h1>
    <p className="text-sm text-muted-foreground text-center leading-relaxed max-w-[280px]">{t("onboarding.welcomeDesc")}</p>
    <div className="absolute bottom-0 left-0 w-full p-6 pt-12" style={{ background: 'linear-gradient(to top, hsl(var(--background)) 60%, transparent)' }}>
      <button onClick={onNext} className="w-full bg-primary text-primary-foreground rounded-2xl py-5 font-bold text-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-lg">
        {t("onboarding.startCustom")} <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  </div>
);

// Step 2: Goal
const GoalStep = ({ selected, onSelect, t }: { selected: string | null; onSelect: (v: string) => void; t: (k: string) => string }) => {
  const goals = [
    { key: "lift", icon: TrendingDown, label: t("onboarding.goalLift"), desc: t("onboarding.goalLiftDesc") },
    { key: "glow", icon: Sparkles, label: t("onboarding.goalGlow"), desc: t("onboarding.goalGlowDesc") },
    { key: "anti_age", icon: Clock, label: t("onboarding.goalAntiAge"), desc: t("onboarding.goalAntiAgeDesc") },
    { key: "relax", icon: Heart, label: t("onboarding.goalRelax"), desc: t("onboarding.goalRelaxDesc") },
  ];
  return (
    <div className="flex-1 overflow-y-auto px-6 pb-32">
      <h1 className="text-3xl font-bold text-foreground mb-2">{t("onboarding.goalTitle")}</h1>
      <p className="text-sm text-muted-foreground mb-8">{t("onboarding.goalDesc")}</p>
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
};

// Step 3: Skin Type
const SkinTypeStep = ({ selected, onSelect, t }: { selected: string | null; onSelect: (v: string) => void; t: (k: string) => string }) => {
  const skinTypes = [
    { icon: Droplets, label: t("onboarding.skinOily"), desc: t("onboarding.skinOilyDesc") },
    { icon: Wind, label: t("onboarding.skinDry"), desc: t("onboarding.skinDryDesc") },
    { icon: Link, label: t("onboarding.skinCombo"), desc: t("onboarding.skinComboDesc") },
    { icon: Heart, label: t("onboarding.skinSensitive"), desc: t("onboarding.skinSensitiveDesc") },
  ];
  return (
    <div className="flex-1 overflow-y-auto px-6 pb-32">
      <h1 className="text-3xl font-bold text-foreground mb-2">{t("onboarding.skinTitle")}</h1>
      <p className="text-sm text-muted-foreground mb-8">{t("onboarding.skinDesc")}</p>
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
};

// Step 4: Skin Concerns
const ConcernsStep = ({ selected, onToggle, t }: { selected: string[]; onToggle: (v: string) => void; t: (k: string) => string }) => {
  const concerns = [
    { icon: Sparkles, label: t("onboarding.concernLines"), desc: t("onboarding.concernLinesDesc") },
    { icon: TrendingDown, label: t("onboarding.concernSag"), desc: t("onboarding.concernSagDesc") },
    { icon: Moon, label: t("onboarding.concernDark"), desc: t("onboarding.concernDarkDesc") },
    { icon: Frown, label: t("onboarding.concernDull"), desc: t("onboarding.concernDullDesc") },
  ];
  return (
    <div className="flex-1 overflow-y-auto px-6 pb-32">
      <h1 className="text-3xl font-bold text-foreground mb-2">{t("onboarding.concernTitle")}</h1>
      <p className="text-sm text-muted-foreground mb-8">{t("onboarding.concernDesc")}</p>
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
          <div className="bg-foreground text-primary-foreground text-xs font-medium px-4 py-2 rounded-full">{t("onboarding.concernHint")}</div>
        </div>
      )}
    </div>
  );
};

// Step 5: Time
const TimeStep = ({ selected, onSelect, t }: { selected: string | null; onSelect: (v: string) => void; t: (k: string) => string }) => {
  const timeOptions = [
    { icon: Clock, label: t("onboarding.time5"), desc: t("onboarding.time5Desc") },
    { icon: Hourglass, label: t("onboarding.time10"), desc: t("onboarding.time10Desc") },
    { icon: Timer, label: t("onboarding.time15"), desc: t("onboarding.time15Desc") },
    { icon: Infinity, label: t("onboarding.time20"), desc: t("onboarding.time20Desc") },
  ];
  return (
    <div className="flex-1 overflow-y-auto px-6 pb-32">
      <h1 className="text-3xl font-bold text-foreground mb-2">{t("onboarding.timeTitle")}</h1>
      <p className="text-sm text-muted-foreground mb-8">{t("onboarding.timeDesc")}</p>
      <div className="space-y-4">
        {timeOptions.map((opt) => {
          const active = selected === opt.label;
          return (
            <button key={opt.label} onClick={() => onSelect(opt.label)}
              className={`w-full flex items-center gap-4 p-5 rounded-3xl border-2 transition-all ${active ? 'border-primary bg-primary/5' : 'border-transparent bg-card'}`}
              style={{ boxShadow: active ? undefined : '0 10px 30px -10px rgba(181,137,137,0.15)' }}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${active ? 'bg-primary/20' : 'bg-secondary'}`}>
                <opt.icon className={`w-6 h-6 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>
              <div className="flex-1 text-left">
                <div className="font-bold text-foreground">{opt.label}</div>
                <div className="text-xs text-muted-foreground">{opt.desc}</div>
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
};

// Step 6: Plan Summary
const PlanStep = ({ timeLabel, t }: { timeLabel: string; t: (k: string, a?: (string | number)[]) => string }) => {
  const planFeatures = [t("onboarding.planFeature1"), t("onboarding.planFeature2"), t("onboarding.planFeature3")];
  const stats = [
    { label: t("onboarding.lift"), value: "15%" },
    { label: t("onboarding.smooth"), value: "22%" },
    { label: t("onboarding.brighten"), value: "30%" },
  ];
  return (
    <div className="flex-1 overflow-y-auto px-6 pb-32">
      <h1 className="text-3xl font-bold text-foreground mb-2">{t("onboarding.planReady")}</h1>
      <p className="text-sm text-muted-foreground mb-6">{t("onboarding.planReadyDesc")}</p>
      <div className="bg-card rounded-[32px] p-8 border border-card text-center mb-6" style={{ boxShadow: '0 10px 30px -10px rgba(181,137,137,0.15)' }}>
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"><Sparkles className="w-10 h-10 text-primary" /></div>
        <h2 className="text-2xl font-bold text-foreground mb-2">{t("onboarding.planName")}</h2>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-semibold text-sm mb-6 bg-primary/10 text-primary">
          <Timer className="w-3.5 h-3.5" />{t("onboarding.dailyTime", [timeLabel || t("onboarding.time10")])}
        </div>
        <div className="space-y-4 text-left border-t border-border pt-6">
          {planFeatures.map((text) => (
            <div key={text} className="flex items-start gap-3">
              <div className="mt-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0"><Check className="w-2.5 h-2.5 text-primary-foreground" /></div>
              <p className="text-sm text-foreground font-medium">{text}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center space-y-2 mb-4">
        <p className="text-primary font-bold uppercase tracking-widest text-[10px]">{t("onboarding.readyQ")}</p>
        <h3 className="text-xl font-bold text-foreground">{t("onboarding.challenge")}</h3>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-card/60 p-3 rounded-2xl text-center border border-card">
            <div className="text-xs text-muted-foreground mb-1">{s.label}</div>
            <div className="text-lg font-bold text-primary">{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Loading Screen
const LoadingScreen = ({ onDone, t }: { onDone: () => void; t: (k: string) => string }) => {
  const [progress, setProgress] = useState(0);
  const steps = [t("onboarding.loadStep1"), t("onboarding.loadStep2"), t("onboarding.loadStep3"), t("onboarding.loadStep4")];

  useEffect(() => {
    const timer = setInterval(() => { setProgress((p) => { if (p >= 100) { clearInterval(timer); return 100; } return p + 2; }); }, 80);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => { if (progress >= 100) { const tm = setTimeout(onDone, 500); return () => clearTimeout(tm); } }, [progress, onDone]);

  const currentStep = Math.min(Math.floor(progress / 25), 3);

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-full max-w-[480px] min-h-screen flex flex-col items-center justify-center px-8 relative">
        <div className="absolute w-64 h-64 rounded-full bg-primary/10 blur-[60px] top-1/4 left-1/2 -translate-x-1/2" />
        <div className="relative mb-12">
          <div className="w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full animate-spin" style={{ animationDuration: '8s' }} viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" stroke="hsl(var(--muted))" strokeWidth="0.5" fill="none" />
              <circle cx="50" cy="50" r="45" stroke="hsl(var(--primary))" strokeWidth="2" fill="none" strokeDasharray="20 180" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-card shadow-xl flex items-center justify-center border-4 border-border"><Sparkles className="w-12 h-12 text-primary" /></div>
            </div>
          </div>
        </div>
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-2">{t("onboarding.loading")}</h2>
          <p className="text-sm font-medium text-muted-foreground px-4">{t("onboarding.loadingDesc")}</p>
        </div>
        <div className="w-full max-w-[280px] space-y-5">
          {steps.map((step, i) => (
            <div key={step} className={`flex items-center gap-4 ${i > currentStep ? 'opacity-40' : ''}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${i < currentStep ? 'bg-primary' : i === currentStep ? 'bg-primary/20' : 'bg-secondary'}`}>
                {i < currentStep ? <Check className="w-3 h-3 text-primary-foreground" /> : i === currentStep ? <div className="w-2 h-2 rounded-full bg-primary animate-ping" /> : <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />}
              </div>
              <span className={`text-sm ${i <= currentStep ? 'font-semibold text-foreground' : 'font-medium text-foreground'}`}>{step}</span>
            </div>
          ))}
        </div>
        <div className="absolute bottom-12 left-0 w-full px-8">
          <div className="rounded-2xl p-4 flex items-center justify-between bg-card/60 backdrop-blur-sm border border-card">
            <div className="flex items-center gap-3">
              <div className="flex space-x-1">{[0, 1, 2].map((i) => (<div key={i} className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />))}</div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">{t("onboarding.almostDone")}</span>
            </div>
            <span className="text-xs font-bold text-muted-foreground">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Success Screen
const SuccessScreen = ({ onStart, t }: { onStart: () => void; t: (k: string) => string }) => (
  <div className="min-h-screen bg-background flex justify-center">
    <div className="w-full max-w-[480px] min-h-screen flex flex-col relative">
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="relative mb-10">
          <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center animate-pulse" style={{ animationDuration: '3s' }}>
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg"><Check className="w-8 h-8 text-primary-foreground" /></div>
            </div>
          </div>
          <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-primary animate-bounce" />
        </div>
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-foreground">{t("onboarding.allSet")}</h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-[280px] mx-auto whitespace-pre-line">{t("onboarding.allSetDesc")}</p>
        </div>
        <div className="mt-10 w-full bg-card p-5 rounded-3xl border border-border flex items-center gap-4" style={{ boxShadow: '0 10px 30px -10px rgba(181,137,137,0.2)' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-secondary"><CalendarCheck className="w-6 h-6 text-primary" /></div>
          <div className="flex-1">
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{t("onboarding.todayFocus")}</p>
            <h4 className="font-bold text-foreground">{t("onboarding.jawSculpt")}</h4>
            <p className="text-xs text-muted-foreground">{t("onboarding.beginner8min")}</p>
          </div>
        </div>
      </div>
      <div className="p-8 w-full">
        <button onClick={onStart} className="w-full bg-primary text-primary-foreground rounded-2xl py-5 font-bold text-lg flex items-center justify-center gap-3 active:scale-[0.98] transition-transform shadow-lg">
          {t("onboarding.startFirst")} <Rocket className="w-5 h-5" />
        </button>
        <p className="text-center text-xs text-muted-foreground mt-6">{t("onboarding.reminder")}</p>
      </div>
    </div>
  </div>
);

// Main Onboarding Component
const Onboarding = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, setOnboardingCompleted, onboardingCompleted, loading } = useAuth();

  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<string | null>(null);
  const [skinType, setSkinType] = useState<string | null>(null);
  const [concernsList, setConcernsList] = useState<string[]>([]);
  const [time, setTime] = useState<string | null>(null);
  const [showLoading, setShowLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Auth showClose={false} onSuccess={() => {}} />;
  }

  if (!loading && user && onboardingCompleted === true) {
    return <Navigate to="/" replace />;
  }

  const completeOnboarding = async () => {
    if (user) {
      await supabase.from("profiles").update({
        onboarding_completed: true,
        onboarding_goal: goal,
        skin_type: skinType,
        concerns: concernsList,
        preferred_time: time,
      } as any).eq("user_id", user.id);
      setOnboardingCompleted(true);
      navigate("/");
    }
  };

  const toggleConcern = (c: string) => {
    setConcernsList((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);
  };

  const canContinue = () => {
    if (step === 1) return !!goal;
    if (step === 2) return !!skinType;
    if (step === 3) return concernsList.length > 0;
    if (step === 4) return !!time;
    return true;
  };

  const handleNext = () => {
    if (step === 5) { setShowLoading(true); return; }
    if (step < TOTAL_STEPS - 1) setStep(step + 1);
  };

  const handleBack = () => { if (step > 0) setStep(step - 1); };

  const handleSuccessNext = () => { setShowSuccess(false); setShowPaywall(true); };

  const completeOnboardingWithPayment = async () => {
    if (user) {
      await supabase.from("profiles").update({
        onboarding_completed: true,
        paywall_completed: true,
        onboarding_goal: goal,
        skin_type: skinType,
        concerns: concernsList,
        preferred_time: time,
      } as any).eq("user_id", user.id);
      setOnboardingCompleted(true);
      navigate("/");
    }
  };

  if (showPaywall) {
    return <Paywall mode="onboarding" onClose={completeOnboarding} onPaid={completeOnboardingWithPayment} />;
  }

  if (showSuccess) {
    return <SuccessScreen onStart={handleSuccessNext} t={t} />;
  }

  if (showLoading) {
    return <LoadingScreen onDone={() => { setShowLoading(false); setShowSuccess(true); }} t={t} />;
  }

  if (step === 0) {
    return (
      <div className="min-h-screen bg-background flex justify-center">
        <div className="w-full max-w-[480px] min-h-screen relative flex flex-col">
          <WelcomeStep onNext={() => setStep(1)} t={t} />
        </div>
      </div>
    );
  }

  const progressWidth = `${(step / TOTAL_STEPS) * 100}%`;

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-full max-w-[480px] min-h-screen relative flex flex-col no-scrollbar overflow-y-auto">
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

        {step === 1 && <GoalStep selected={goal} onSelect={setGoal} t={t} />}
        {step === 2 && <SkinTypeStep selected={skinType} onSelect={setSkinType} t={t} />}
        {step === 3 && <ConcernsStep selected={concernsList} onToggle={toggleConcern} t={t} />}
        {step === 4 && <TimeStep selected={time} onSelect={setTime} t={t} />}
        {step === 5 && <PlanStep timeLabel={time || t("onboarding.time10")} t={t} />}

        <div className="absolute bottom-0 left-0 w-full p-6 pt-12" style={{ background: 'linear-gradient(to top, hsl(var(--background)) 60%, transparent)' }}>
          <button onClick={handleNext} disabled={!canContinue()}
            className="w-full bg-primary text-primary-foreground rounded-2xl py-5 font-bold text-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-lg disabled:opacity-50 disabled:scale-100">
            {step === 5 ? t("onboarding.startJourney") : t("onboarding.continue")} <ArrowRight className="w-5 h-5" />
          </button>
          {step === 5 && (
            <p className="text-center text-[11px] text-muted-foreground mt-4">{t("onboarding.termsAgree")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
