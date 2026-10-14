"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";

// Cheie publică Turnstile (site key) — sigur de pus în cod.
const TURNSTILE_SITE_KEY = "0x4AAAAAAFWbpCTaAqbTqRot";

declare global {
  interface Window {
    turnstile?: any;
  }
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    const SCRIPT_ID = "cf-turnstile-script";
    function render() {
      if (!window.turnstile || !widgetRef.current || widgetIdRef.current) return;
      widgetIdRef.current = window.turnstile.render(widgetRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token: string) => {
          setCaptchaToken(token);
          setError(null);
        },
        "expired-callback": () => setCaptchaToken(null),
        "error-callback": () => setCaptchaToken(null),
      });
    }
    if (!document.getElementById(SCRIPT_ID)) {
      const s = document.createElement("script");
      s.id = SCRIPT_ID;
      s.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      s.async = true;
      s.defer = true;
      s.onload = render;
      document.head.appendChild(s);
    } else {
      render();
    }
  }, []);

  function resetCaptcha() {
    setCaptchaToken(null);
    if (window.turnstile && widgetIdRef.current) {
      try {
        window.turnstile.reset(widgetIdRef.current);
      } catch {}
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!captchaToken) {
      setError("Te rog așteaptă confirmarea de securitate (nu ești robot).");
      return;
    }

    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/dashboard`,
        captchaToken,
      },
    });
    setLoading(false);
    resetCaptcha(); // token-ul e de unică folosință

    if (authError) {
      setError(authError.message || "Ceva n-a mers. Încearcă din nou.");
      return;
    }
    setSent(true);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        className="bg-white p-6 rounded-xl shadow w-full max-w-sm"
        onSubmit={handleLogin}
      >
        <h1 className="text-xl font-semibold mb-4">Autentificare părinte</h1>

        {sent ? (
          <p className="text-sm text-green-600">
            Ți-am trimis un link pe email. Verifică și inboxul de spam.
          </p>
        ) : (
          <>
            <input
              type="email"
              required
              placeholder="email@exemplu.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-4"
            />

            {/* Widget Turnstile */}
            <div ref={widgetRef} className="mb-4 flex justify-center min-h-[65px]" />

            {error && (
              <p className="text-sm text-red-600 mb-3">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !captchaToken}
              className="w-full py-2 rounded bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Se trimite..." : "Trimite link magic"}
            </button>
          </>
        )}
      </form>
    </div>
  );
}
