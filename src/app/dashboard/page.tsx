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
    <div className="space-y-6 animate-in fade-in duration-700 pb-10">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase text-[10px] tracking-[0.2em] mb-2">
          <Sparkles className="w-4 h-4" /> Centru de Control Kosi
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Panou de comandă
        </h1>
      </header>

      {/* --- RÂNDUL 1: DASHBOARD VITAL (Status + Telecomandă + Stats) --- */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* 1. Status Card (Stânga) */}
        <div className="md:col-span-4 lg:col-span-3">
          <StatusCard />
        </div>

        {/* 2. Telecomandă (Centru - Prioritate Maximă) */}
        <div className="md:col-span-8 lg:col-span-6">
          <QuickControls />
        </div>

        {/* 3. Statistici Rapide (Dreapta) */}
        <div className="md:col-span-12 lg:col-span-3">
          <ActivitySummary />
        </div>
      </div>

      {/* --- RÂNDUL 2: MONITORIZARE & SETĂRI --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Feed Activitate (Mai lat acum, ca să nu fie foarte înalt) */}
        <div className="lg:col-span-8">
          <LiveActivityFeed />
        </div>

        {/* Voice Cloning */}
        <div className="lg:col-span-4">
          <VoiceCloneCard />
        </div>
      </div>

      {/* --- RÂNDUL 3: CREATIVITATE & INSIGHTS --- */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 pt-2">
          
        {/* Profil Creativ AI */}
        <div className="xl:col-span-1 bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-[32px] text-white shadow-xl relative overflow-hidden group min-h-[300px] flex flex-col justify-center">
          <BrainCircuit className="absolute -right-8 -top-8 w-48 h-48 text-white/10 group-hover:rotate-12 transition-all duration-700" />
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">✨ Profil Creativ AI</h3>
            <p className="text-indigo-100 leading-relaxed italic text-md mb-6">
              "Astăzi, {state.childName || 'copilul'} pare fascinat de culorile calde și de poveștile cu animale. Activitatea sugerează o stare de curiozitate ridicată."
            </p>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-xs">
              <span className="font-bold text-indigo-200">RECOMANDARE:</span> O poveste despre junglă ar fi perfectă diseară.
            </div>
          </div>
        </div>

        {/* Galeria de Artă */}
        <div className="xl:col-span-2 bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 flex flex-col justify-center">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
              <Palette className="text-orange-500" /> Galerie desene
            </h3>
            <button className="text-indigo-600 text-sm font-bold hover:underline">Vezi tot</button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-slate-50 rounded-[20px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 group hover:bg-indigo-50 hover:border-indigo-200 transition-all cursor-pointer">
                <Palette className="w-6 h-6 text-slate-300 group-hover:text-indigo-400 transition-colors" />
                <span className="text-[9px] font-black text-slate-300 group-hover:text-indigo-400 uppercase tracking-widest">Desen #{i}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}