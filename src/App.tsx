import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index.tsx";
import Auth from "./pages/Auth.tsx";
import Paywall from "./pages/Paywall.tsx";
import Onboarding from "./pages/Onboarding.tsx";
import CourseDetail from "./pages/CourseDetail.tsx";
import WorkoutPlayer from "./pages/WorkoutPlayer.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const LoadingSpinner = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, onboardingCompleted, paywallCompleted } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/onboarding" replace />;
  if (onboardingCompleted === null || paywallCompleted === null) return <LoadingSpinner />;
  if (!onboardingCompleted) return <Navigate to="/onboarding" replace />;
  if (!paywallCompleted) return <Navigate to="/paywall" replace />;
  return <>{children}</>;
};

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const OnboardingRoute = () => {
  const { user, loading, onboardingCompleted, paywallCompleted } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (user && onboardingCompleted && paywallCompleted) return <Navigate to="/" replace />;
  if (user && onboardingCompleted && !paywallCompleted) return <Navigate to="/paywall" replace />;
  return <Onboarding />;
};

const PaywallRoute = () => {
  const { user, loading, paywallCompleted } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/onboarding" replace />;
  
  return <Paywall onClose={() => window.location.replace("/")} />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/paywall" element={<PaywallRoute />} />
            <Route path="/onboarding" element={<OnboardingRoute />} />
            <Route path="/course/:id" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
            <Route path="/workout/:id" element={<ProtectedRoute><WorkoutPlayer /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
