'use client'

import { Sparkles, Palette, BrainCircuit, Image as ImageIcon, LayoutTemplate } from 'lucide-react'
import { useDashboard } from '@/lib/DashboardContext'
import StatusCard from './components/StatusCard'
import QuickControls from './components/QuickControls'
import LiveActivityFeed from './components/LiveActivityFeed'
import ActivitySummary from './components/ActivitySummary'
import VoiceCloneCard from './components/VoiceCloneCard'

export default function DashboardPage() {
  // AICI ESTE CHEIA: Extragem 'activities' pentru a vedea desenele reale
  const { state, activities } = useDashboard()

  // --- LOGICĂ NOUĂ: Procesăm desenele reale din baza de date ---
  const drawings = activities
    .filter(act => act.event_type === 'DRAW')
    .map(act => {
      // 1. Parsăm JSON-ul salvat de Android
      let data: any = {};
      try {
        data = typeof act.event_data === 'string' ? JSON.parse(act.event_data) : act.event_data;
      } catch (e) {
        console.error("Eroare parsare desen:", e);
      }
      
      // 2. Extragem datele (URL și Șablon)
      return {
        id: act.id,
        url: data.url, // Link-ul către poză
        template: data.template || 'Liber', // Șablonul (ex: Pisică)
        timestamp: act.created_at
      };
    })
    .filter(item => item.url) // Păstrăm doar ce are URL valid
    .slice(0, 4); // Luăm doar ultimele 4

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-10">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase text-[10px] tracking-[0.2em] mb-2">
          <Sparkles className="w-4 h-4" /> Centru de Control Kosi
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Panou de comandă
        </h1>
      </header>

      {/* --- RÂNDUL 1: DASHBOARD VITAL --- */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-4 lg:col-span-3">
          <StatusCard />
        </div>
        <div className="md:col-span-8 lg:col-span-6">
          <QuickControls />
        </div>
        <div className="md:col-span-12 lg:col-span-3">
          <ActivitySummary />
        </div>
      </div>

      {/* --- RÂNDUL 2: MONITORIZARE --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <LiveActivityFeed />
        </div>
        <div className="lg:col-span-4">
          <VoiceCloneCard />
        </div>
      </div>

      {/* --- RÂNDUL 3: GALERIA REALĂ --- */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 pt-2">
          
        {/* Profil Creativ AI */}
        <div className="xl:col-span-1 bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-[32px] text-white shadow-xl relative overflow-hidden group min-h-[300px] flex flex-col justify-center">
          <BrainCircuit className="absolute -right-8 -top-8 w-48 h-48 text-white/10 group-hover:rotate-12 transition-all duration-700" />
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">✨ Profil Creativ AI</h3>
            <p className="text-indigo-100 leading-relaxed italic text-md mb-6">
              "Astăzi, {state.childName || 'copilul'} a fost foarte creativ. Ultimele desene sugerează o stare de curiozitate și bucurie."
            </p>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-xs">
              <span className="font-bold text-indigo-200">SFAT:</span> Întreabă-l despre {drawings.length > 0 ? 'ultimul desen' : 'ziua de azi'} diseară.
            </div>
          </div>
        </div>

        {/* Galeria de Artă - DINAMICĂ */}
        <div className="xl:col-span-2 bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 flex flex-col justify-center">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
              <Palette className="text-orange-500" /> Galerie desene
            </h3>
            <button className="text-indigo-600 text-sm font-bold hover:underline">Vezi tot</button>
          </div>
          
          {drawings.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {drawings.map((draw) => (
                <div key={draw.id} className="aspect-square bg-slate-50 rounded-[20px] border-2 border-slate-100 overflow-hidden group relative cursor-pointer hover:border-indigo-200 transition-all shadow-sm">
                  {/* Imaginea Reală din Cloud */}
                  <img 
                    src={draw.url} 
                    alt="Desen Kosi" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Overlay cu Info Șablon și Oră */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-2 translate-y-full group-hover:translate-y-0 transition-transform flex flex-col items-center">
                    <p className="text-[10px] text-white font-bold text-center flex items-center gap-1">
                       <LayoutTemplate className="w-3 h-3 text-orange-400" /> {draw.template}
                    </p>
                    <p className="text-[9px] text-slate-300">
                      {new Date(draw.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Fallback dacă nu sunt desene în baza de date
            <div className="flex flex-col items-center justify-center py-8 text-slate-400 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50 h-48">
                <ImageIcon className="w-10 h-10 mb-2 opacity-30" />
                <p className="text-xs font-bold uppercase tracking-widest opacity-60">Încă nu sunt desene</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}