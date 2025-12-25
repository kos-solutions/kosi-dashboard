"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { DashboardProvider } from "@/lib/DashboardContext";

import StatusCard from "./components/StatusCard";
import QuickControls from "./components/QuickControls";
import ActivitySummary from "./components/ActivitySummary";
import WeeklyReport from "./components/WeeklyReport";          // ← ADAUGĂ
import LiveActivityFeed from "./components/LiveActivityFeed";  // ← ADAUGĂ
import StoryHistory from "./components/StoryHistory";          // ← ADAUGĂ

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
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Coloana 1 - Status & Controls */}
        <div className="space-y-6">
          <StatusCard />
          <QuickControls />
        </div>

        {/* Coloana 2 - Activity & Feed */}
        <div className="space-y-6">
          <ActivitySummary />
          <LiveActivityFeed />
        </div>

        {/* Coloana 3 - Reports & History */}
        <div className="space-y-6 lg:col-span-2 xl:col-span-1">
          <WeeklyReport />
          <StoryHistory />
        </div>
      </div>
    </DashboardProvider>
  );
}