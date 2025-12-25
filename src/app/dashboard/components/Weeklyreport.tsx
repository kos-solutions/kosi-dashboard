"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Calendar, TrendingUp, Clock, Activity } from "lucide-react";
import { startOfWeek, endOfWeek, eachDayOfInterval, format } from "date-fns";
import { ro } from "date-fns/locale";

interface DayStats {
  date: string;
  minutes: number;
  stories: number;
  meditations: number;
  games: number;
  mood: "calm" | "neutral" | "agitated";
}

export default function WeeklyReport() {
  const [weekData, setWeekData] = useState<DayStats[]>([]);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [totalActivities, setTotalActivities] = useState(0);
  const [averageMood, setAverageMood] = useState<string>("calm");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWeeklyData();
  }, []);

  async function loadWeeklyData() {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Luni
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

    // Fetch toate evenimentele din săptămâna curentă
    const { data: events } = await supabase
      .from("activity_events")
      .select("*")
      .gte("created_at", weekStart.toISOString())
      .lte("created_at", weekEnd.toISOString())
      .order("created_at", { ascending: true });

    if (!events) {
      setLoading(false);
      return;
    }

    // Creează array cu fiecare zi din săptămână
    const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

    const statsPerDay: DayStats[] = daysOfWeek.map((day) => {
      const dayEvents = events.filter(
        (e) =>
          format(new Date(e.created_at), "yyyy-MM-dd") ===
          format(day, "yyyy-MM-dd")
      );

      const stories = dayEvents.filter((e) => e.event_type === "story_completed").length;
      const meditations = dayEvents.filter((e) => e.event_type === "meditation_completed").length;
      const games = dayEvents.filter((e) => e.event_type === "game_completed").length;

      // Calculează minute totale
      const minutes = dayEvents.reduce((sum, e) => {
        return sum + (e.event_data?.duration_seconds || 0);
      }, 0) / 60;

      // Calculează mood dominant
      const moods = dayEvents.map((e) => e.mood).filter(Boolean);
      const moodCounts = moods.reduce((acc: any, m) => {
        acc[m] = (acc[m] || 0) + 1;
        return acc;
      }, {});
      const dominantMood = Object.keys(moodCounts).sort(
        (a, b) => moodCounts[b] - moodCounts[a]
      )[0] || "calm";

      return {
        date: format(day, "EEE", { locale: ro }),
        minutes: Math.round(minutes),
        stories,
        meditations,
        games,
        mood: dominantMood as any,
      };
    });

    setWeekData(statsPerDay);

    // Calculate totals
    const totalMins = statsPerDay.reduce((sum, d) => sum + d.minutes, 0);
    const totalActs =
      statsPerDay.reduce((sum, d) => sum + d.stories + d.meditations + d.games, 0);

    setTotalMinutes(totalMins);
    setTotalActivities(totalActs);

    // Calculate average mood
    const allMoods = statsPerDay.map((d) => d.mood);
    const calmCount = allMoods.filter((m) => m === "calm").length;
    if (calmCount > allMoods.length / 2) setAverageMood("calm");
    else if (calmCount > allMoods.length / 3) setAverageMood("neutral");
    else setAverageMood("agitated");

    setLoading(false);
  }

  // Pie chart data - distribuție activități
  const activityDistribution = [
    {
      name: "Povești",
      value: weekData.reduce((sum, d) => sum + d.stories, 0),
      color: "#7EC8B3",
    },
    {
      name: "Meditații",
      value: weekData.reduce((sum, d) => sum + d.meditations, 0),
      color: "#FFD6A5",
    },
    {
      name: "Jocuri",
      value: weekData.reduce((sum, d) => sum + d.games, 0),
      color: "#9AD0A4",
    },
  ].filter((item) => item.value > 0);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="h-64 bg-gray-100 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-kosi-primary" />
          <h3 className="text-lg font-semibold">Raport Săptămânal</h3>
        </div>
        <button
          onClick={loadWeeklyData}
          className="text-sm text-kosi-primary hover:text-kosi-primary/80"
        >
          Reîmprospătează
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-kosi-primary/10 to-kosi-primary/5 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-kosi-primary" />
            <p className="text-sm text-kosi-muted">Total minute</p>
          </div>
          <p className="text-2xl font-bold text-kosi-text">{totalMinutes}</p>
          <p className="text-xs text-kosi-muted mt-1">
            ~{Math.round(totalMinutes / 7)} min/zi
          </p>
        </div>

        <div className="bg-gradient-to-br from-kosi-secondary/10 to-kosi-secondary/5 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-orange-600" />
            <p className="text-sm text-kosi-muted">Activități</p>
          </div>
          <p className="text-2xl font-bold text-kosi-text">{totalActivities}</p>
          <p className="text-xs text-kosi-muted mt-1">această săptămână</p>
        </div>

        <div className="bg-gradient-to-br from-kosi-success/10 to-kosi-success/5 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-kosi-success" />
            <p className="text-sm text-kosi-muted">Stare generală</p>
          </div>
          <p className="text-2xl font-bold text-kosi-text">
            {averageMood === "calm" ? "😊" : averageMood === "neutral" ? "😐" : "😟"}
          </p>
          <p className="text-xs text-kosi-muted mt-1">
            {averageMood === "calm"
              ? "Calm"
              : averageMood === "neutral"
              ? "Neutru"
              : "Agitat"}
          </p>
        </div>
      </div>

      {/* Chart - Minute per zi */}
      <div>
        <h4 className="text-sm font-medium text-kosi-muted mb-3">
          Minute de activitate pe zi
        </h4>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={weekData}>
            <defs>
              <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7EC8B3" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#7EC8B3" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              stroke="#9CA3AF"
            />
            <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Area
              type="monotone"
              dataKey="minutes"
              stroke="#7EC8B3"
              fillOpacity={1}
              fill="url(#colorMinutes)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart - Activități per zi */}
      <div>
        <h4 className="text-sm font-medium text-kosi-muted mb-3">
          Tipuri de activități
        </h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weekData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
            <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="stories" stackId="a" fill="#7EC8B3" name="Povești" />
            <Bar dataKey="meditations" stackId="a" fill="#FFD6A5" name="Meditații" />
            <Bar dataKey="games" stackId="a" fill="#9AD0A4" name="Jocuri" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart - Distribuție */}
      {activityDistribution.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-kosi-muted mb-3">
              Distribuție activități
            </h4>
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie
                  data={activityDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {activityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-col justify-center space-y-2">
            {activityDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-kosi-muted">
                  {item.name}: <strong>{item.value}</strong>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}