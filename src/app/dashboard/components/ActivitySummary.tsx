'use client'

import { useDashboard } from '@/lib/DashboardContext'
import { BookOpen, Gamepad2, Clock, Palette } from 'lucide-react'

export default function ActivitySummary() {
  const { state, t } = useDashboard()
  const { todayStats } = state

  const stats = [
    { icon: BookOpen, label: "Povești", value: todayStats.stories, color: "text-blue-500", bg: "bg-blue-100" },
    { icon: Palette, label: "Desene", value: todayStats.drawings, color: "text-pink-500", bg: "bg-pink-100" },
    { icon: Gamepad2, label: "Jocuri", value: todayStats.games, color: "text-orange-500", bg: "bg-orange-100" },
    { icon: Clock, label: "Minute", value: todayStats.learningTime, color: "text-green-500", bg: "bg-green-100" },
  ]

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm h-full">
      <h3 className="text-lg font-bold text-slate-800 mb-4">{t.activitySummary.title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="flex flex-col items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className={`p-3 rounded-full ${stat.bg} ${stat.color} mb-2`}>
              <stat.icon size={20} />
            </div>
            <span className="text-2xl font-bold text-slate-900">{stat.value}</span>
            <span className="text-xs font-medium text-slate-500 uppercase">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}