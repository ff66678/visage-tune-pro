import { useNavigate } from "react-router-dom";
import { ChevronLeft, Crown, Check, Sparkles, Calendar, Clock, Star, Shield } from "lucide-react";
import { usePaywallStatus } from "@/hooks/usePaywallStatus";
import Paywall from "@/pages/Paywall";
import { useTranslation } from "@/i18n/LanguageContext";
import SwipeBack from "@/components/SwipeBack";

const MembershipPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isPaid, isLoading } = usePaywallStatus();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isPaid) {
    return (
      <Paywall mode="content-gate" onClose={() => navigate(-1)} onPaid={() => { window.location.reload(); }} />
    );
  }

  const benefits = [
    { icon: Sparkles, label: t("membership.benefit1"), desc: t("membership.benefit1Desc") },
    { icon: Calendar, label: t("membership.benefit2"), desc: t("membership.benefit2Desc") },
    { icon: Clock, label: t("membership.benefit3"), desc: t("membership.benefit3Desc") },
  ];

  return (
    <SwipeBack className="min-h-screen bg-background flex flex-col">
      <div className="pt-14 px-6 pb-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-foreground shadow-sm">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-foreground">{t("membership.title")}</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-10">
        <div className="relative bg-gradient-to-br from-primary to-primary/70 rounded-[28px] p-6 mb-8 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-primary-foreground/10" />
          <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-primary-foreground/5" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
                <Crown className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-primary-foreground/70 text-[10px] font-bold uppercase tracking-widest">GLOW PRO</p>
                <h2 className="text-xl font-bold text-primary-foreground">{t("membership.annualMember")}</h2>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-primary-foreground/80" />
              <span className="text-sm font-medium text-primary-foreground/90">{t("membership.statusActive")}</span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">{t("membership.benefits")}</h3>
          <div className="space-y-3">
            {benefits.map((b) => (
              <div key={b.label} className="flex items-center gap-4 bg-card p-4 rounded-2xl border border-border">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <b.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{b.label}</p>
                  <p className="text-xs text-muted-foreground">{b.desc}</p>
                </div>
                <Check className="w-4 h-4 text-primary shrink-0" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">{t("membership.manage")}</h3>
          <div className="bg-card rounded-2xl border border-border divide-y divide-border">
            <button className="w-full flex items-center justify-between p-4 text-left">
              <span className="text-sm font-medium text-foreground">{t("membership.switchPlan")}</span>
              <ChevronLeft className="w-4 h-4 text-muted-foreground rotate-180" />
            </button>
            <button className="w-full flex items-center justify-between p-4 text-left">
              <span className="text-sm font-medium text-foreground">{t("membership.restorePurchase")}</span>
              <ChevronLeft className="w-4 h-4 text-muted-foreground rotate-180" />
            </button>
            <button className="w-full flex items-center justify-between p-4 text-left">
              <span className="text-sm font-medium text-muted-foreground">{t("membership.cancel")}</span>
              <ChevronLeft className="w-4 h-4 text-muted-foreground rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </SwipeBack>
  );
};

export default MembershipPage;
