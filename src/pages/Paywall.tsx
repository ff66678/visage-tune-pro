import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { X, Check, ChevronDown, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation, useLanguage } from "@/i18n/LanguageContext";
import { useRevenueCat } from "@/hooks/useRevenueCat";
import { usePaywallStatus } from "@/hooks/usePaywallStatus";
import { toast } from "sonner";

interface PaywallProps {
  mode?: "onboarding" | "content-gate";
  onClose?: () => void;
  onPaid?: () => void;
}

const Paywall = ({ mode = "onboarding", onClose, onPaid }: PaywallProps) => {
  const { t } = useTranslation();
  const { locale } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState("annual");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAllPlans, setShowAllPlans] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { isNative, offerings, purchasePackage, restorePurchases } = useRevenueCat();
  const { markPaid } = usePaywallStatus();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Get packages from RevenueCat offerings (native only)
  const currentOffering = offerings?.current;
  const annualPackage = currentOffering?.availablePackages?.find(
    (p: any) => p.packageType === "ANNUAL" || p.identifier === "$rc_annual"
  );
  const monthlyPackage = currentOffering?.availablePackages?.find(
    (p: any) => p.packageType === "MONTHLY" || p.identifier === "$rc_monthly"
  );

  const handleStartTrial = async () => {
    if (!user) {
      const currentPath = location.pathname;
      navigate(`/auth?returnTo=${encodeURIComponent(currentPath + "?showPaywall=true")}`);
      return;
    }

    if (isNative) {
      // Real purchase via RevenueCat
      const pkg = selectedPlan === "annual" ? annualPackage : monthlyPackage;
      if (!pkg) {
        toast.error(t("paywall.packageNotAvailable") || "Package not available");
        return;
      }
      setPurchasing(true);
      try {
        const success = await purchasePackage(pkg);
        if (success) {
          // Also mark in database for cross-platform sync
          await markPaid();
          setShowSuccess(true);
          setTimeout(() => { setShowSuccess(false); onPaid?.(); }, 1500);
        }
      } catch (e: any) {
        toast.error(e.message || "Purchase failed");
      } finally {
        setPurchasing(false);
      }
    } else {
      // Web fallback: mark as paid in database (for testing/development)
      await markPaid();
      setShowSuccess(true);
      setTimeout(() => { setShowSuccess(false); onPaid?.(); }, 1500);
    }
  };

  const handleRestore = async () => {
    if (!user) {
      toast.error(t("auth.loginRequired"));
      return;
    }
    if (!isNative) {
      toast(t("paywall.restoreWebHint") || "Restore is available on the mobile app");
      return;
    }
    setPurchasing(true);
    try {
      const success = await restorePurchases();
      if (success) {
        await markPaid();
        toast.success(t("paywall.restoreSuccess") || "Purchase restored!");
        setTimeout(() => onPaid?.(), 1000);
      } else {
        toast(t("paywall.restoreNone") || "No purchases found to restore");
      }
    } catch (e: any) {
      toast.error(e.message || "Restore failed");
    } finally {
      setPurchasing(false);
    }
  };

  const images = [
    { src: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=300&h=400", alt: t("paywall.imgLift"), category: "Facial Workout", title: t("paywall.imgLift") },
    { src: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=300&h=400", alt: t("paywall.imgEye"), category: "Eye Care", title: t("paywall.imgEye") },
    { src: "https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&q=80&w=300&h=400", alt: t("paywall.imgJaw"), category: "Jawline Sculpt", title: t("paywall.imgJaw") },
  ];

  const features = [
    { title: t("paywall.feature1Title"), description: t("paywall.feature1Desc") },
    { title: t("paywall.feature2Title"), description: t("paywall.feature2Desc") },
    { title: t("paywall.feature3Title"), description: t("paywall.feature3Desc") },
  ];

  const annualRenewal = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
  const monthlyRenewal = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });

  // Use RevenueCat prices when available on native
  const annualPrice = isNative && annualPackage
    ? annualPackage.product?.priceString || t("paywall.annualPrice")
    : t("paywall.annualPrice");
  const monthlyPrice = isNative && monthlyPackage
    ? monthlyPackage.product?.priceString || t("paywall.monthlyPrice")
    : t("paywall.monthlyPrice");

  return (
    <div className="relative min-h-screen w-full bg-background text-foreground pb-36">
      <header className="flex justify-between items-center px-6 py-4 sticky top-0 z-10 backdrop-blur-md bg-background/90">
        <div className="w-6" />
        <h1 className="text-xl tracking-[0.3em] font-medium ml-4">G L O W</h1>
        <button onClick={onClose} className="p-2 -mr-2 text-foreground opacity-60 hover:opacity-100 transition-opacity">
          <X className="w-6 h-6" />
        </button>
      </header>

      <section className="mt-2 pl-6">
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 pr-6 no-scrollbar">
          {images.map((img) => (
            <div key={img.alt} className="snap-start shrink-0 relative w-[140px] h-[170px] rounded-2xl overflow-hidden shadow-sm">
              <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
              <div className="absolute bottom-3 left-3 text-primary-foreground">
                <span className="text-[10px] font-semibold tracking-wider uppercase opacity-90">{img.category}</span>
                <p className="text-sm font-medium leading-tight mt-0.5">{img.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 mt-8">
        <h2 className="text-[38px] leading-[1.1] font-semibold tracking-tight text-foreground whitespace-pre-line">{t("paywall.heroTitle")}</h2>
        <div className="mt-4 text-[15px] font-medium text-foreground">
          <span>{t("paywall.freeToday")}</span><br />
          <span className="border-b border-primary pb-0.5">{t("paywall.freeTodayCN")}</span>
        </div>
      </section>

      <section className="px-6 mt-10 flex flex-col gap-6">
        {features.map((f) => (
          <div key={f.title} className="flex justify-between items-center">
            <div>
              <h3 className="text-[16px] font-semibold text-foreground">{f.title}</h3>
              <p className="text-[14px] text-muted-foreground mt-1 font-medium">{f.description}</p>
            </div>
            <div className="pl-4"><Check className="w-5 h-5 text-primary" /></div>
          </div>
        ))}
      </section>

      <section className="px-6 mt-7 flex flex-col gap-4">
        <div className={`relative rounded-2xl border-2 bg-card p-5 cursor-pointer shadow-sm transition-transform active:scale-[0.98] ${selectedPlan === "annual" ? "border-primary" : "border-border"}`} onClick={() => setSelectedPlan("annual")}>
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-[17px] font-semibold text-foreground">{t("paywall.annual")}</span>
              <span className="text-[14px] font-semibold text-primary mt-1">{t("paywall.freeTrial")}</span>
              <div className="mt-3">
                <div className="inline-flex items-center border border-primary rounded-full px-2.5 py-1">
                  <span className="text-[12px] font-medium text-primary">{t("paywall.save")}</span>
                  <Check className="w-3.5 h-3.5 ml-1 text-primary" />
                </div>
              </div>
            </div>
            <span className="text-[17px] font-semibold text-foreground">{annualPrice}</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-5 uppercase tracking-wide font-medium">{t("paywall.annualBilling", [annualRenewal])}</p>
        </div>

        {!showAllPlans && (
          <div className="flex justify-center">
            <button onClick={() => setShowAllPlans(true)} className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 uppercase tracking-widest hover:text-foreground transition-colors">
              {t("paywall.viewAll")}<ChevronDown className="w-3 h-3" />
            </button>
          </div>
        )}

        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showAllPlans ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
          <div className={`rounded-2xl border-2 p-5 cursor-pointer transition-all active:scale-[0.98] ${selectedPlan === "monthly" ? "bg-card border-primary" : "bg-card/60 border-border hover:bg-card"}`} onClick={() => setSelectedPlan("monthly")}>
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <span className="text-[17px] font-semibold text-foreground">{t("paywall.monthly")}</span>
                <span className="text-[14px] font-semibold text-primary mt-1">{t("paywall.freeTrial")}</span>
              </div>
              <span className="text-[17px] font-semibold text-foreground">{monthlyPrice}</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-8 uppercase tracking-wide font-medium">{t("paywall.monthlyBilling", [monthlyRenewal])}</p>
          </div>
        </div>
      </section>

      <section className="px-6 mt-14 border-t border-border pt-8">
        <div className="mt-8 space-y-6">
          <div className="flex flex-col gap-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            <a href="#" className="flex items-center w-max hover:text-foreground transition-colors">{t("paywall.terms")}<ArrowRight className="w-3 h-3 ml-1" /></a>
            <a href="#" className="flex items-center w-max hover:text-foreground transition-colors">{t("paywall.privacy")}<ArrowRight className="w-3 h-3 ml-1" /></a>
            <a href="#" className="flex items-center w-max hover:text-foreground transition-colors">{t("paywall.howToCancel")}<ArrowRight className="w-3 h-3 ml-1" /></a>
          </div>
        </div>
      </section>

      <div className="h-40" />

      <div className="fixed bottom-0 left-0 right-0 p-6 pt-16 z-20" style={{ background: "linear-gradient(to top, hsl(var(--background)) 60%, transparent)" }}>
        <button
          onClick={handleStartTrial}
          disabled={purchasing}
          className="w-full bg-primary text-primary-foreground rounded-full py-4 text-[17px] font-medium flex items-center justify-center gap-2 shadow-lg hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-60"
        >
          {purchasing ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : showSuccess ? (
            t("paywall.trialStarted")
          ) : (
            <>{t("paywall.startTrial")}<ArrowRight className="w-5 h-5" /></>
          )}
        </button>
        <div className="text-center mt-4">
          <button
            onClick={handleRestore}
            disabled={purchasing}
            className="text-[13px] text-muted-foreground font-medium flex items-center justify-center gap-1 w-full hover:text-foreground transition-colors disabled:opacity-50"
          >
            {t("paywall.restore")}<ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Paywall;
