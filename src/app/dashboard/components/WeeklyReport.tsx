"use client";

import { useEffect, useState } from "react";
import { parentApi } from "@/lib/parentApi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useDashboard } from "@/lib/DashboardContext"; // Folosim contextul

export default function WeeklyReport() {
  const { state, t } = useDashboard(); // Accesăm ID-ul corect din context
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (state.deviceId) {
      fetchWeeklyData();
    }
  }, [state.deviceId]);

  async function fetchWeeklyData() {
    try {
      setLoading(true);
      // Calculăm data de acum 7 zile
      const activities = await parentApi.activity(state.deviceId!, { sinceDays: 7 });

      if (!activities) {
          setWeeklyData([]);
          return;
      }

      // Procesare date pentru grafic
      const days = t.ui.days;
      const chartData = days.map(d => ({ name: d, minute: 0 }));

      activities.forEach(act => {
        const date = new Date(act.created_at);
        const dayIndex = date.getDay();
        // Adăugăm durata (dacă există) sau 5 minute default per activitate
        const duration = (act.duration_seconds || 300) / 60; 
        chartData[dayIndex].minute += Math.round(duration);
      });

      setWeeklyData(chartData);
    } catch (error) {
      console.error("Eroare grafic:", error);
    } finally {
      setLoading(false);
    }
  }

  const hasData = weeklyData.some((d) => d.minute > 0);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
      <h3 className="text-lg font-bold text-slate-800 mb-6">{t.ui.wkTitle}</h3>
      {loading ? (
        <div className="h-64 flex items-center justify-center text-slate-400">{t.ui.wkLoading}</div>
      ) : !hasData ? (
        <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-1">
          <span className="text-3xl opacity-20">📊</span>
          <p className="text-sm">{t.ui.wkEmpty}</p>
        </div>
      ) : (
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              dy={10}
            />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar 
              dataKey="minute" 
              fill="#6366f1" 
              radius={[6, 6, 6, 6]} 
              barSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      )}
    </div>
  );
}