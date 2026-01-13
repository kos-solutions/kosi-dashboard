'use client'

import { Sparkles, Palette, BrainCircuit } from 'lucide-react'
import { useDashboard } from '@/lib/DashboardContext'
import StatusCard from './components/StatusCard'
import QuickControls from './components/QuickControls'
import LiveActivityFeed from './components/LiveActivityFeed'
import ActivitySummary from './components/ActivitySummary'
import VoiceCloneCard from './components/VoiceCloneCard'

export default function DashboardPage() {
  const { state } = useDashboard()

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header>
        <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase text-[10px] tracking-[0.2em] mb-2">
          <Sparkles className="w-4 h-4" /> Centru de Control Kosi
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          Bună, KOSI te salută! 👋
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Partea de sus */}
        <div className="lg:col-span-4 space-y-8">
          <StatusCard />
          <VoiceCloneCard />
          <QuickControls />
        </div>

        <div className="lg:col-span-5">
          <LiveActivityFeed />
        </div>

        <div className="lg:col-span-3">
          <ActivitySummary />
        </div>

        {/* --- SECȚIUNEA "WOW" LANDSCAPE --- */}
        <div className="lg:col-span-12 grid grid-cols-1 xl:grid-cols-3 gap-8 pt-4">
          
          {/* Profil Creativ AI */}
          <div className="xl:col-span-1 bg-gradient-to-br from-indigo-600 to-violet-700 p-10 rounded-[40px] text-white shadow-xl relative overflow-hidden group">
            <BrainCircuit className="absolute -right-8 -top-8 w-48 h-48 text-white/10 group-hover:rotate-12 transition-all duration-700" />
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">✨ Profil Creativ AI</h3>
              <p className="text-indigo-100 leading-relaxed italic text-lg mb-8">
                "Astăzi, Miriam pare fascinată de culorile calde și de poveștile cu animale. Activitatea ei sugerează o stare de curiozitate ridicată și dorință de explorare."
              </p>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-sm">
                <span className="font-bold text-indigo-200">RECOMANDARE:</span> O poveste despre junglă ar fi perfectă diseară.
              </div>
            </div>
          </div>

          {/* Galeria de Artă */}
          <div className="xl:col-span-2 bg-white p-10 rounded-[40px] shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <Palette className="text-orange-500" /> Galerie desene
              </h3>
              <button className="text-indigo-600 font-bold hover:underline">Vezi tot portofoliul</button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-slate-50 rounded-[24px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 group hover:bg-indigo-50 hover:border-indigo-200 transition-all cursor-pointer">
                  <Palette className="w-8 h-8 text-slate-300 group-hover:text-indigo-400 transition-colors" />
                  <span className="text-[10px] font-black text-slate-300 group-hover:text-indigo-400 uppercase tracking-widest">Azi la 14:{i}0</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}