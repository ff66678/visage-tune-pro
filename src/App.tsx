import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/i18n/LanguageContext";
import Index from "./pages/Index.tsx";
import Auth from "./pages/Auth.tsx";
import Paywall from "./pages/Paywall.tsx";
import Onboarding from "./pages/Onboarding.tsx";
import CourseDetail from "./pages/CourseDetail.tsx";
import WorkoutPlayer from "./pages/WorkoutPlayer.tsx";
import CategoryAll from "./pages/CategoryAll.tsx";
import Membership from "./pages/Membership.tsx";
import GiftPage from "./pages/GiftPage.tsx";
import ProfileDetail from "./pages/ProfileDetail.tsx";
import Favorites from "./pages/Favorites.tsx";
import RecentlyPlayed from "./pages/RecentlyPlayed.tsx";
import LanguageSettings from "./pages/LanguageSettings.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, onboardingCompleted } = useAuth();
  const location = useLocation();
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) {
    const returnTo = `${location.pathname}${location.search}`;
    return <Navigate to={`/auth?returnTo=${encodeURIComponent(returnTo)}`} replace />;
  }
  if (onboardingCompleted === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!onboardingCompleted) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
};

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (user) {
    const returnTo = new URLSearchParams(location.search).get("returnTo") || "/";
    return <Navigate to={returnTo} replace />;
  }
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
              <Route path="/" element={<Index />} />
              <Route path="/paywall" element={<ProtectedRoute><Paywall onClose={() => window.history.back()} /></ProtectedRoute>} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/course/:id" element={<CourseDetail />} />
              <Route path="/membership" element={<ProtectedRoute><Membership /></ProtectedRoute>} />
              <Route path="/gift" element={<GiftPage />} />
              <Route path="/profile" element={<ProtectedRoute><ProfileDetail /></ProtectedRoute>} />
              <Route path="/category/:category" element={<CategoryAll />} />
              <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
              <Route path="/recently-played" element={<ProtectedRoute><RecentlyPlayed /></ProtectedRoute>} />
              <Route path="/workout/:id" element={<ProtectedRoute><WorkoutPlayer /></ProtectedRoute>} />
              <Route path="/language" element={<ProtectedRoute><LanguageSettings /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
