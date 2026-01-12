'use client'

import { BookOpen, Palette, Music, Gamepad2, Clock, Activity } from 'lucide-react'
import { useDashboard } from '@/lib/DashboardContext'

// Configurația vizuală pentru fiecare tip de activitate
const activityStyles: any = {
  story_played: { icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Poveste' },
  DRAW: { icon: Palette, color: 'text-orange-600', bg: 'bg-orange-50', label: 'Desen' },
  MUSIC: { icon: Music, color: 'text-pink-600', bg: 'bg-pink-50', label: 'Muzică' },
  GAME: { icon: Gamepad2, color: 'text-green-600', bg: 'bg-green-50', label: 'Joc' },
  default: { icon: Activity, color: 'text-slate-600', bg: 'bg-slate-50', label: 'Activitate' }
}

export default function LiveActivityFeed() {
  const { activities } = useDashboard()

  // Helper pentru a extrage textul detaliat din JSON-ul evenimentului
  const getDetailText = (act: any) => {
    try {
      // Dacă event_data e string JSON, îl parsăm
      const data = typeof act.event_data === 'string' 
        ? JSON.parse(act.event_data) 
        : act.event_data;
      
      // Returnăm titlul sau detaliul, în funcție de tip
      return data.title || data.detail || 'Activitate nouă';
    } catch (e) {
      return 'Detalii indisponibile';
    }
  }

  return (
    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-500" />
          Activitate Live
        </h3>
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
      </div>
      
      <div className="space-y-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Activity className="w-8 h-8 text-slate-300" />
            </div>
            <p className="italic">Așteptăm prima aventură a Miriam-ei...</p>
          </div>
        ) : (
          activities.map((act) => {
            const style = activityStyles[act.event_type] || activityStyles.default
            const detailText = getDetailText(act);
            const time = new Date(act.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

            return (
              <div key={act.id} className="group flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 cursor-default">
                <div className="flex items-center gap-4 w-full">
                  <div className={`p-3 rounded-2xl ${style.bg} ${style.color} group-hover:scale-110 transition-transform shadow-sm`}>
                    <style.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 leading-tight mb-1 truncate">
                      {style.label}: <span className="text-slate-600 font-medium">{detailText}</span>
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-slate-400 flex items-center gap-1 font-medium bg-white px-2 py-0.5 rounded-full border border-slate-100 inline-block">
                        <Clock className="w-3 h-3" /> {time}
                      </p>
                      {act.duration_seconds && (
                        <p className="text-xs text-slate-400 font-medium">
                          • {Math.round(act.duration_seconds / 60)} min
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}