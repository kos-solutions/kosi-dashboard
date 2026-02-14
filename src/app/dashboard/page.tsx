'use client'

import { useDashboard } from '@/lib/DashboardContext'
import StatusCard from './components/StatusCard'
import LiveActivityFeed from './components/LiveActivityFeed'
import ActivitySummary from './components/ActivitySummary'
import VoiceCloneCard from './components/VoiceCloneCard'
import { Sparkles, Palette } from 'lucide-react'

export default function DashboardPage() {
  const { state, t } = useDashboard()
  
  // Extragem datele din starea globală (Context)
  const { activities, drawings, childName, pairingCode } = state

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Secțiune */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            {t.header.hello}
          </h1>
          <p className="text-slate-500 mt-1">
            {t.header.subtitle.replace('{child}', childName)} | Cod: <span className="font-mono font-bold text-indigo-600">{pairingCode}</span>
          </p>
        </div>
      </div>

      {/* Grid Status & Statistici */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivitySummary />
        </div>
        <div>
          <StatusCard />
        </div>
      </div>

      {/* Secțiune principală: Galerie și Activitate */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Galerie Desene */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Palette className="text-indigo-500" />
              <h2 className="text-xl font-bold text-slate-800">{t.gallery.title}</h2>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {drawings.length > 0 ? drawings.map((drawing) => (
              <div key={drawing.id} className="group relative aspect-square bg-white rounded-3xl overflow-hidden border-4 border-white shadow-sm hover:shadow-xl transition-all">
                <img src={drawing.image_url} alt="Drawing" className="object-cover w-full h-full" />
              </div>
            )) : (
              <div className="col-span-full h-48 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                <Sparkles size={32} className="mb-2 opacity-20" />
                <p>{t.gallery.noDrawings}</p>
              </div>
            )}
          </div>
        </div>

        {/* Feed Activitate & Voice Lab */}
        <div className="space-y-6">
          <VoiceCloneCard />
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-[450px] flex flex-col">
            <h3 className="font-bold text-lg text-slate-800 mb-4">{t.activity.recent}</h3>
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {activities.map(act => (
                <div key={act.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <div className={`w-2 h-2 rounded-full ${act.event_type === 'GAME' ? 'bg-orange-400' : 'bg-blue-500'}`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700">
                      {act.event_type === 'story_played' ? 'Poveste ascultată' : 
                       act.event_type === 'DRAW' ? 'Desen nou' : 
                       act.event_type === 'GAME' ? 'Lojă interactivă' : act.event_type}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(act.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}