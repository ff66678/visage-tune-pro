import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Settings } from "lucide-react";
import ProfileDetailContent from "@/components/ProfileDetailContent";
import SettingsDrawer from "@/components/SettingsDrawer";
import SwipeBack from "@/components/SwipeBack";

const ProfileDetail = () => {
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <SwipeBack className="min-h-screen bg-background flex justify-center">
      <div className="w-full max-w-[480px] min-h-screen relative pb-8 no-scrollbar overflow-y-auto">
        {/* Top bar overlay */}
        <div className="sticky top-0 z-50 px-4 pt-4 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-surface/90 backdrop-blur-md flex items-center justify-center border-none cursor-pointer text-foreground hover:bg-surface-hover transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setSettingsOpen(true)}
            className="w-10 h-10 rounded-full bg-surface/90 backdrop-blur-md flex items-center justify-center border-none cursor-pointer text-foreground hover:bg-surface-hover transition-colors shadow-sm"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
        <SettingsDrawer open={settingsOpen} onOpenChange={setSettingsOpen} />
        <div className="-mt-14">
          <ProfileDetailContent />
        </div>
      </div>
    </div>
  );
};

export default ProfileDetail;
