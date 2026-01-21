"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useDashboard } from "@/lib/DashboardContext"; // <--- Import Context

export default function ActivitySummary() {
  const { t } = useDashboard(); // <--- Use translations
  const [stats, setStats] = useState({
    totalMinutes: 0,
    totalSessions: 0,
    totalAlerts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    const channel = supabase
      .channel('stats-updates')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_log' }, () => fetchStats())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  async function fetchStats() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data } = await supabase
        .from('activity_log')
        .select('*')
        .gte('timestamp', today.toISOString());

      const totalMinutes = data?.reduce((sum, activity) => sum + (activity.duration_seconds || 0), 0) || 0;
      const totalSessions = data?.filter(a => a.event_type === 'story_played').length || 0;
      const totalAlerts = data?.filter(a => a.event_type === 'alert').length || 0;

      setStats({
        totalMinutes: Math.round(totalMinutes / 60),
        totalSessions,
        totalAlerts
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow">
        <h3 className="text-lg font-semibold mb-4">{t.activitySummary.title}</h3>
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h3 className="text-lg font-semibold mb-4">{t.activitySummary.title}</h3>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-indigo-600">{stats.totalMinutes}</div>
          <div className="text-sm text-gray-600 mt-1">{t.activitySummary.minutes}</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600">{stats.totalSessions}</div>
          <div className="text-sm text-gray-600 mt-1">{t.activitySummary.sessions}</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-orange-600">{stats.totalAlerts}</div>
          <div className="text-sm text-gray-600 mt-1">{t.activitySummary.alerts}</div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <p className="text-sm text-gray-600 text-center">
          {t.activitySummary.footer}
        </p>
      </div>
    </div>
  );
}