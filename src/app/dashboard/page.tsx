'use client'

import { Sparkles, Palette, BrainCircuit, Image as ImageIcon, LayoutTemplate } from 'lucide-react'
import { useDashboard } from '@/lib/DashboardContext'
import StatusCard from './components/StatusCard'
import QuickControls from './components/QuickControls'
import LiveActivityFeed from './components/LiveActivityFeed'
import ActivitySummary from './components/ActivitySummary'
import VoiceCloneCard from './components/VoiceCloneCard'

export default function DashboardPage() {
  const { state, activities, t } = useDashboard() // <--- T

  const drawings = activities
    .filter(act => act.event_type === 'DRAW')
    .map(act => {
      let data: any = {};
      try { data = typeof act.event_data === 'string' ? JSON.parse(act.event_data) : act.event_data; } catch (e) {}
      return { id: act.id, url: data.url, template: data.template || 'Liber', timestamp: act.created_at }
    })
    .slice(0, 4);

  return (
    <div className="space-y-6 md:space-y-8">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            {t.header.hello} 👋
          </h1>
          <p className="text-slate-500 text-sm md:text-base">
            {t.header.subtitle.replace('{child}', state.childName)}
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm text-sm font-medium border border-slate-100">
            <span className={`w-2 h-2 rounded-full ${state.deviceStatus === 'online' ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></span>
            <span className="text-slate-600">
                {state.deviceStatus === 'online' ? t.header.online : t.header.offline}
            </span>
        </div>
      </div>

      {/* 2. Statistici */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <StatusCard icon={Sparkles} title={t.stats.stories} value={state.todayStats.stories.toString()} color="bg-purple-500" />
        <StatusCard icon={Palette} title={t.stats.drawings} value={state.todayStats.drawings.toString()} color="bg-pink-500" />
        <StatusCard icon={BrainCircuit} title={t.stats.games} value={state.todayStats.games.toString()} color="bg-blue-500" />
        <StatusCard icon={Sparkles} title={t.stats.activeTime} value={`${state.todayStats.learningTime}m`} color="bg-orange-500" />
      </div>

      {/* 3. Zona Principală */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-6">
            {/* Galeria */}
            <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                        <Palette className="w-5 h-5 text-pink-500" />
                        {t.gallery.title}
                    </h3>
                </div>

                {drawings.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    {drawings.map((draw) => (
                        <div key={draw.id} className="group relative aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md">
                        <img src={draw.url} alt="Desen" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-2 translate-y-full group-hover:translate-y-0 transition-transform flex flex-col items-center">
                            <p className="text-[10px] text-white font-bold text-center flex items-center gap-1">
                            <LayoutTemplate className="w-3 h-3 text-orange-400" /> {draw.template}
                            </p>
                        </div>
                        </div>
                    ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-slate-400 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50 h-32 md:h-48">
                        <ImageIcon className="w-8 h-8 md:w-10 md:h-10 mb-2 opacity-30" />
                        <p className="text-xs font-bold uppercase tracking-widest opacity-50">{t.gallery.noDrawings}</p>
                    </div>
                )}
            </div>

            {/* Controale Rapide - Aici am pus logica de traducere direct în prop-uri, va trebui să modifici QuickControls să accepte titluri custom, sau să le lași așa momentan */}
            <QuickControls sendCommand={async () => {}} t={t} /> 
        </div>

        <div className="space-y-6">
             <VoiceCloneCard />
             <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-100 h-[400px] overflow-hidden flex flex-col">
                <h3 className="font-bold text-lg text-slate-800 mb-4">{t.activity.recent}</h3>
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <LiveActivityFeed />
                </div>
             </div>
             <ActivitySummary />
        </div>
      </div>
    </div>
  )
}