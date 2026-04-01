import { LogOut, CreditCard, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/i18n/LanguageContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface SettingsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SettingsDrawer = ({ open, onOpenChange }: SettingsDrawerProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSignOut = async () => {
    await signOut();
    onOpenChange(false);
    navigate("/");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl">
        <SheetHeader>
          <SheetTitle>{t("settings.title")}</SheetTitle>
        </SheetHeader>
        <div className="py-4 flex flex-col gap-1">
          <button
            onClick={() => { onOpenChange(false); navigate("/membership"); }}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-foreground hover:bg-muted transition-colors text-left font-medium"
          >
            <CreditCard className="w-5 h-5" />
            {t("settings.manageSubscription")}
          </button>
          <button
            onClick={() => { onOpenChange(false); navigate("/language"); }}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-foreground hover:bg-muted transition-colors text-left font-medium"
          >
            <Globe className="w-5 h-5" />
            {t("settings.changeLanguage")}
          </button>
          <div className="h-px bg-border my-1" />
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-foreground hover:bg-muted transition-colors text-left font-medium"
          >
            <LogOut className="w-5 h-5" />
            {t("settings.signOut")}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsDrawer;
