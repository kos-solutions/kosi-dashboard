"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { DashboardProvider } from "@/lib/DashboardContext";

import StatusCard from "./components/StatusCard";
import QuickControls from "./components/QuickControls";
import ActivitySummary from "./components/ActivitySummary";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });
  }, []);

  if (loading) return null;

  if (!user) {
    window.location.href = "/login";
    return null;
  }

  return (
    <DashboardProvider>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusCard />
        <QuickControls />
        <ActivitySummary />
      </div>
    </DashboardProvider>
  );
}
