"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function WeeklyReport() {
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeeklyData();
  }, []);

  async function fetchWeeklyData() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get device ID
      const { data: pairedDevice } = await supabase
        .from('parent_devices')
        .select('device_id')
        .eq('parent_id', user.id)
        .limit(1)
        .single();

      if (!pairedDevice) return;

      // Get last 7 days of activity
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: activities } = await supabase
        .from('activity_log')
        .select('*')
        .eq('device_id', pairedDevice.device_id)
        .gte('timestamp', sevenDaysAgo.toISOString());

      console.log('Weekly activities:', activities);

      // Group by day
      const dayNames = ['Dum', 'Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm'];
      const dailyStats: any = {};

      // Initialize last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayName = dayNames[date.getDay()];
        dailyStats[dayName] = { name: dayName, minute: 0 };
      }

      // Aggregate activity
      let totalSecs = 0;
      activities?.forEach(activity => {
        const date = new Date(activity.timestamp);
        const dayName = dayNames[date.getDay()];
        const minutes = Math.round((activity.duration_seconds || 0) / 60);
        
        if (dailyStats[dayName]) {
          dailyStats[dayName].minute += minutes;
        }
        totalSecs += (activity.duration_seconds || 0);
      });

      setWeeklyData(Object.values(dailyStats));
      setTotalMinutes(Math.round(totalSecs / 60));
    } catch (error) {
      console.error('Error fetching weekly data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow">
        <h3 className="text-lg font-semibold mb-4">Report Săptămânal</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Report Săptămânal</h3>
        <button className="text-sm text-indigo-600 hover:text-indigo-700">
          Reîmprospătează
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-indigo-600">{totalMinutes}</div>
          <div className="text-xs text-gray-600">Total minute</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {weeklyData.filter(d => d.minute > 0).length}
          </div>
          <div className="text-xs text-gray-600">Activități această săptămână</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">😊</div>
          <div className="text-xs text-gray-600">Stare generală</div>
          <div className="text-xs text-green-600">Calm</div>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Minute de activitate pe zi
        </h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Bar 
              dataKey="minute" 
              fill="#6366f1"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Activity Types */}
      <div className="mt-6 pt-4 border-t">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Tipuri de activități
        </h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-gray-600">Povești</span>
            </div>
            <span className="font-medium">{weeklyData.reduce((sum, d) => sum + d.minute, 0)} min</span>
          </div>
        </div>
      </div>
    </div>
  );
}