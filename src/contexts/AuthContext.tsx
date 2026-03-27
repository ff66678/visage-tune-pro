import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  onboardingCompleted: boolean | null;
  paywallCompleted: boolean | null;
  setOnboardingCompleted: (v: boolean) => void;
  setPaywallCompleted: (v: boolean) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  onboardingCompleted: null,
  paywallCompleted: null,
  setOnboardingCompleted: () => {},
  setPaywallCompleted: () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);
  const [paywallCompleted, setPaywallCompleted] = useState<boolean | null>(null);

  const fetchProfileStatus = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("onboarding_completed, paywall_completed")
      .eq("user_id", userId)
      .single();
    setOnboardingCompleted(data?.onboarding_completed ?? false);
    setPaywallCompleted((data as any)?.paywall_completed ?? false);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          setTimeout(() => fetchProfileStatus(session.user.id), 0);
        } else {
          setOnboardingCompleted(null);
          setPaywallCompleted(null);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfileStatus(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, onboardingCompleted, paywallCompleted, setOnboardingCompleted, setPaywallCompleted, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
