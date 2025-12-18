"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/dashboard`,
      },
    });

    setSent(true);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form className="bg-white p-6 rounded-xl shadow w-full max-w-sm" onSubmit={handleLogin}>
        <h1 className="text-xl font-semibold mb-4">
          Autentificare părinte
        </h1>

        {sent ? (
          <p className="text-sm text-green-600">
            Ți-am trimis un link pe email.
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

            <button
              type="submit"
              className="w-full py-2 rounded bg-blue-600 text-white"
            >
              Trimite link magic
            </button>
          </>
        )}
      </form>
    </div>
  );
}
