'use client'

import { BookOpen, Palette, Music, Gamepad2, Clock, Activity } from 'lucide-react'
import { useDashboard } from '@/lib/DashboardContext'

export default function LiveActivityFeed() {
  const { activities, t } = useDashboard()

  const getActivityConfig = (type: string) => {
    switch(type) {
      case 'story_played': 
      case 'STORY':
        return { icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50', label: t.activity.types.story || 'Poveste' };
      case 'DRAW': 
        return { icon: Palette, color: 'text-orange-600', bg: 'bg-orange-50', label: t.activity.types.draw || 'Desen' };
      case 'MUSIC': 
        return { icon: Music, color: 'text-pink-600', bg: 'bg-pink-50', label: t.activity.types.music || 'Muzică' };
      case 'GAME': 
        return { icon: Gamepad2, color: 'text-green-600', bg: 'bg-green-50', label: t.activity.types.game || 'Joc' };
      default: 
        return { icon: Activity, color: 'text-slate-600', bg: 'bg-slate-50', label: t.activity.types.default || 'Activitate' };
    }
  }

  const getDetailText = (act: any) => {
    try {
      if (typeof act.event_data === 'string' && act.event_data.startsWith('{')) {
        const parsed = JSON.parse(act.event_data);
        return parsed.detail || parsed.message || parsed.song || 'Detalii indisponibile';
      }
      return act.event_data || act.event_type;
    } catch (e) {
      return act.event_type;
    }
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-[450px] flex flex-col">
      <h3 className="font-bold text-lg text-slate-800 mb-4">{t.activity.recent}</h3>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {activities && activities.length > 0 ? activities.map((act) => {
            const style = getActivityConfig(act.event_type);
            const detailText = getDetailText(act);
            const time = new Date(act.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

            return (
              <div key={act.id} className="group flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-3 w-full">
                  <div className={`p-2.5 rounded-xl ${style.bg} ${style.color} shrink-0`}>
                    <style.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-700 leading-tight mb-0.5 truncate">
                       {style.label}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                       {detailText}
                    </p>
                  </div>
                  <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                    {time}
                  </span>
                </div>
              </div>
            )
        }) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
                <Activity size={32} className="mb-2" />
                <p>Nicio activitate recentă</p>
            </div>
        )}
      </div>
    </div>
  )
}