'use client'

import { useDashboard } from '@/lib/DashboardContext'
import StatusCard from './components/StatusCard'
import ActivitySummary from './components/ActivitySummary'
import VoiceCloneCard from './components/VoiceCloneCard'
import SendMessageCard from './components/SendMessageCard' // <--- IMPORT NOU
import QuickControls from './components/QuickControls'     // <--- IMPORT NOU
import { Sparkles, Palette } from 'lucide-react'

export default function DashboardPage() {
  const { state, t } = useDashboard()
  const { activities, drawings, childName, pairingCode } = state

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto pb-20">
      {/* Header Secțiune */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            {t.header.hello}
          </h1>
          <p className="text-slate-500 mt-1">
            {t.header.subtitle.replace('{child}', childName)} | Cod: <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{pairingCode}</span>
          </p>
        </div>
      </div>

      {/* Grid Principal: Status + Controale + Mesaje */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Coloana 1: Status Card */}
        <div className="h-full">
          <StatusCard />
        </div>
        
        {/* Coloana 2: Controale Rapide (Butonul de Exit e aici) */}
        <div className="h-full">
          <QuickControls />
        </div>

        {/* Coloana 3: Trimite Mesaj Vocal */}
        <div className="h-full">
          <SendMessageCard />
        </div>
      </div>

      {/* Statistici Scurte */}
      <ActivitySummary />

      {/* Secțiune Galerie și Activitate */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Galerie Desene */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2">
            <Palette className="text-indigo-500" />
            <h2 className="text-xl font-bold text-slate-800">{t.gallery.title}</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {drawings.length > 0 ? drawings.map((drawing) => (
              <div key={drawing.id} className="aspect-square bg-white rounded-3xl overflow-hidden border-4 border-white shadow-sm hover:shadow-lg transition-all duration-300 group relative">
                <img src={drawing.image_url} alt="Kosi Drawing" className="object-cover w-full h-full" />
                {/* Overlay cu data la hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <p className="text-white text-xs font-bold">
                        {new Date(drawing.created_at).toLocaleDateString()}
                    </p>
                </div>
              </div>
            )) : (
              <div className="col-span-full h-48 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                <Sparkles size={32} className="mb-2 opacity-20" />
                <p>{t.gallery.noDrawings}</p>
              </div>
            )}
          </div>
        </div>

        {/* Activitate Recentă & Voice Lab */}
        <div className="space-y-6">
          <VoiceCloneCard />
          
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-[450px] flex flex-col">
            <h3 className="font-bold text-lg text-slate-800 mb-4">{t.activity.recent}</h3>
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {activities.length > 0 ? activities.map((act) => (
                <div key={act.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <div className={`w-2 h-2 rounded-full ${act.event_type === 'GAME' ? 'bg-orange-400' : 'bg-blue-500'}`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">
                      {act.event_type === 'story_played' ? 'Poveste' : 
                       act.event_type === 'SPEAK_MESSAGE' ? 'Mesaj vocal părinte' :
                       act.event_type}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              )) : (
                <p className="text-center text-slate-400 text-sm mt-10">Așteptăm activitate...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}