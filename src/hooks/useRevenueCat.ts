import { useEffect, useState, useCallback } from "react";
import { Capacitor } from "@capacitor/core";
import { useAuth } from "@/contexts/AuthContext";

// RevenueCat API key (test mode)
const REVENUECAT_API_KEY = "test_YQpbXmWTuCIqwVDxHspjksdHRfe";
const ENTITLEMENT_ID = "premium";

// Lazy-load RevenueCat SDK (only on native platforms)
let Purchases: any = null;
let LOG_LEVEL: any = null;

const loadPurchases = async () => {
  if (Purchases) return { Purchases, LOG_LEVEL };
  try {
    const mod = await import("@revenuecat/purchases-capacitor");
    Purchases = mod.Purchases;
    LOG_LEVEL = mod.LOG_LEVEL;
    return { Purchases, LOG_LEVEL };
  } catch {
    return { Purchases: null, LOG_LEVEL: null };
  }
};

const isNative = () => {
  const platform = Capacitor.getPlatform();
  return platform === "ios" || platform === "android";
};

export const useRevenueCat = () => {
  const { user } = useAuth();
  const [isReady, setIsReady] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [offerings, setOfferings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Initialize RevenueCat
  useEffect(() => {
    const init = async () => {
      if (!isNative()) {
        // On web, fall back to database-based check
        setLoading(false);
        return;
      }

      try {
        const { Purchases: P, LOG_LEVEL: L } = await loadPurchases();
        if (!P) {
          setLoading(false);
          return;
        }

        await P.setLogLevel({ level: L.DEBUG });
        await P.configure({ apiKey: REVENUECAT_API_KEY });

        // Identify user if logged in
        if (user?.id) {
          await P.logIn({ appUserID: user.id });
        }

        setIsReady(true);
        await checkEntitlements();
        await loadOfferings();
      } catch (e) {
        console.error("RevenueCat init error:", e);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [user?.id]);

  const checkEntitlements = useCallback(async () => {
    if (!isNative()) return false;
    try {
      const { Purchases: P } = await loadPurchases();
      if (!P) return false;
      const { customerInfo } = await P.getCustomerInfo();
      const hasPremium = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
      setIsPremium(hasPremium);
      return hasPremium;
    } catch (e) {
      console.error("RevenueCat check entitlements error:", e);
      return false;
    }
  }, []);

  const loadOfferings = useCallback(async () => {
    if (!isNative()) return;
    try {
      const { Purchases: P } = await loadPurchases();
      if (!P) return;
      const { offerings: off } = await P.getOfferings();
      setOfferings(off);
    } catch (e) {
      console.error("RevenueCat load offerings error:", e);
    }
  }, []);

  const purchasePackage = useCallback(async (pkg: any) => {
    if (!isNative()) {
      throw new Error("Purchases only available on native platforms");
    }
    try {
      const { Purchases: P } = await loadPurchases();
      if (!P) throw new Error("RevenueCat SDK not loaded");
      const { customerInfo } = await P.purchasePackage({ aPackage: pkg });
      const hasPremium = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
      setIsPremium(hasPremium);
      return hasPremium;
    } catch (e: any) {
      if (e.userCancelled) {
        return false; // User cancelled, not an error
      }
      throw e;
    }
  }, []);

  const restorePurchases = useCallback(async () => {
    if (!isNative()) {
      throw new Error("Restore only available on native platforms");
    }
    try {
      const { Purchases: P } = await loadPurchases();
      if (!P) throw new Error("RevenueCat SDK not loaded");
      const { customerInfo } = await P.restorePurchases();
      const hasPremium = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
      setIsPremium(hasPremium);
      return hasPremium;
    } catch (e) {
      console.error("RevenueCat restore error:", e);
      throw e;
    }
  }, []);

  return {
    isNative: isNative(),
    isReady,
    isPremium,
    offerings,
    loading,
    purchasePackage,
    restorePurchases,
    checkEntitlements,
  };
};
