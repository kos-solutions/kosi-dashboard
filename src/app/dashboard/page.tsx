'use client'

import { Sparkles, Palette, BrainCircuit, Image as ImageIcon, LayoutTemplate } from 'lucide-react'
import { useDashboard } from '@/lib/DashboardContext'
import StatusCard from './components/StatusCard'
import QuickControls from './components/QuickControls'
import LiveActivityFeed from './components/LiveActivityFeed'
import ActivitySummary from './components/ActivitySummary'
import VoiceCloneCard from './components/VoiceCloneCard'

export default function DashboardPage() {
  const { state, activities } = useDashboard()

  // --- LOGICĂ NOUĂ: Procesăm desenele reale din baza de date ---
  const drawings = activities
    .filter(act => act.event_type === 'DRAW')
    .map(act => {
      let data: any = {};
      try {
        data = typeof act.event_data === 'string' ? JSON.parse(act.event_data) : act.event_data;
      } catch (e) {
        console.error("Eroare parsare desen:", e);
      }
      
      return {
        id: act.id,
        url: data.url, 
        template: data.template || 'Liber', 
        timestamp: act.created_at
      }
    })
    // Luăm doar ultimele 4 desene
    .slice(0, 4);

  return (
    <div className="space-y-6 md:space-y-8">
      {/* 1. Header Simplu */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            Salut, Părinte! 👋
          </h1>
          <p className="text-slate-500 text-sm md:text-base">
            Iată ce a făcut {state.childName} astăzi.
          </p>
        </div>
        
        {/* Status Conexiune (Compact pe mobil) */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm text-sm font-medium border border-slate-100">
            <span className={`w-2 h-2 rounded-full ${state.deviceStatus === 'active' ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></span>
            <span className="text-slate-600">
                {state.deviceStatus === 'active' ? 'Kosi e Online' : 'Kosi e Offline'}
            </span>
        </div>
      </div>

      {/* 2. Statistici Rapide (Grid 2x2 pe mobil, 4x1 pe PC) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <StatusCard 
          icon={Sparkles} 
          title="Povești" 
          value={state.todayStats.stories.toString()} 
          color="bg-purple-500" 
        />
        <StatusCard 
          icon={Palette} 
          title="Desene" 
          value={state.todayStats.drawings.toString()} 
          color="bg-pink-500" 
        />
        <StatusCard 
          icon={BrainCircuit} 
          title="Jocuri" 
          value={state.todayStats.games.toString()} 
          color="bg-blue-500" 
        />
        {/* Timpul poate fi mai lat pe mobil dacă vrei, dar 2x2 e simetric */}
        <StatusCard 
          icon={Sparkles} 
          title="Timp Activ" 
          value={`${state.todayStats.learningTime}m`} 
          color="bg-orange-500" 
        />
      </div>

      {/* 3. Zona Principală (Structură complexă) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* Coloana Stângă (Mare - 2/3) */}
        <div className="lg:col-span-2 space-y-6">
            {/* Galeria de Desene (Responsive) */}
            <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                        <Palette className="w-5 h-5 text-pink-500" />
                        Galeria de Azi
                    </h3>
                </div>

                {drawings.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    {drawings.map((draw) => (
                        <div key={draw.id} className="group relative aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all">
                        <img 
                            src={draw.url} 
                            alt="Desen Kosi" 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
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
                        <p className="text-xs font-bold uppercase tracking-widest opacity-50">Niciun desen azi</p>
                    </div>
                )}
            </div>

            {/* Controale Rapide */}
            <QuickControls sendCommand={async () => {}} /> {/* Adaptează prop-ul sendCommand dacă e necesar */}
        </div>

        {/* Coloana Dreaptă (Mică - 1/3) */}
        <div className="space-y-6">
             <VoiceCloneCard />
             <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-100 h-[400px] overflow-hidden flex flex-col">
                <h3 className="font-bold text-lg text-slate-800 mb-4">Activitate Recentă</h3>
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