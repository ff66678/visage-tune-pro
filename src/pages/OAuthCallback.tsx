import { useEffect, useState } from "react";
import { lovable } from "@/integrations/lovable/index";

const OAuthCallback = () => {
  const [status, setStatus] = useState("正在登录...");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const returnScheme = params.get("returnScheme");

    if (!returnScheme) {
      setStatus("Missing returnScheme parameter");
      return;
    }

    const doAuth = async () => {
      try {
        const redirectUri =
          window.location.origin +
          window.location.pathname +
          "?returnScheme=" +
          encodeURIComponent(returnScheme);

        const result = await lovable.auth.signInWithOAuth("google", {
          redirect_uri: redirectUri,
        });

        // First call: browser redirects to Google
        if (result.redirected) return;

        if (result.error) {
          setStatus("登录失败: " + String(result.error));
          return;
        }

        // Second call (after Google callback): we have tokens
        if (result.tokens) {
          const { access_token, refresh_token } = result.tokens;
          setStatus("登录成功，正在返回 App...");
          window.location.href = `${returnScheme}://callback?access_token=${encodeURIComponent(access_token)}&refresh_token=${encodeURIComponent(refresh_token)}`;
        }
      } catch (err: any) {
        setStatus("登录出错: " + (err?.message || String(err)));
      }
    };

    doAuth();
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-muted-foreground">{status}</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
