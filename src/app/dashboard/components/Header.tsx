"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

<button
  onClick={async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }}
  className="text-sm text-gray-500"
>
  Deconectare
</button>
export default function Header() {
  const router = useRouter();

  return (
    <header>
      <button onClick={() => router.push("/dashboard")}>
        KOSI
      </button>
    </header>
  );
}
