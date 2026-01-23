'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Sparkles, Palette, BrainCircuit, Image as ImageIcon, LayoutTemplate, StopCircle, Mic, Send, Zap, Activity, Power, Wifi } from 'lucide-react'
import { useDashboard } from '@/lib/DashboardContext'
import StatusCard from './components/StatusCard'
import LiveActivityFeed from './components/LiveActivityFeed'
import ActivitySummary from './components/ActivitySummary'
import VoiceCloneCard from './components/VoiceCloneCard'

// --- CONFIGURARE SUPABASE ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export default function DashboardPage() {
  const { state, activities, t } = useDashboard()
  
  // --- STATE LOCAL ---
  const [loadingCmd, setLoadingCmd] = useState(false)
  const [message, setMessage] = useState('')
  
  // Stocăm ID-ul și Pairing Code-ul găsit pentru debug
  const [activeDevice, setActiveDevice] = useState<{id: string, code: string} | null>(null)

  // 1. Căutăm CEL MAI NOU device conectat
  useEffect(() => {
    const fetchDevice = async () => {
         console.log("🔍 Caut cel mai recent dispozitiv...")
         
         const { data, error } = await supabase
            .from('devices')
            .select('id, pairing_code, created_at')
            .order('created_at', { ascending: false }) // <--- SECRETUL: Luăm cel mai nou
            .limit(1)
            
         if (error) {
             console.error("Eroare Supabase:", error)
         }

         if (data && data.length > 0) {
             const device = data[0]
             setActiveDevice({ id: device.id, code: device.pairing_code })
             console.log("✅ Jucărie găsită:", device)
         } else {
             console.warn("❌ Nu s-a găsit niciun dispozitiv în baza de date!")
         }
    }
    fetchDevice()
  }, [])

  // 2. Funcția de trimitere comenzi
  const sendCommand = async (type: string, payload: any = {}) => {
    if (!activeDevice) {
      alert("Nu s-a găsit Jucăria! Verifică dacă aplicația e pornită.")
      return
    }
    
    setLoadingCmd(true)
    try {
      const { error } = await supabase.from('parent_commands').insert({
        device_id: activeDevice.id, // Folosim ID-ul găsit proaspăt
        command_type: type,
        payload: payload
      })
      
      if (error) throw error
      console.log(`✅ Comandă ${type} trimisă către ${activeDevice.id}`)
    } catch (e: any) {
      alert(`Eroare: ${e.message}`)
    } finally {
      setLoadingCmd(false)
    }
  }

  // 3. Procesare Desene
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
      
      {/* 1. Header & Debug Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            {t.header.hello} 👋
          </h1>
          {/* Debug vizual ca să vezi ce ID a prins dashboard-ul */}
          <div className="text-xs text-slate-400 font-mono mt-1">
            {activeDevice 
                ? `Conectat la: ${activeDevice.code} (ID: ${activeDevice.id.substring(0, 8)}...)` 
                : "Se caută dispozitiv..."}
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm text-sm font-medium border border-slate-100">
            <span className={`w-2 h-2 rounded-full ${activeDevice ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
            <span className="text-slate-600">
                {activeDevice ? "Online" : "Offline"}
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
            
            {/* --- TELECOMANDĂ --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Butoane Rapide */}
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-amber-500" /> Control Rapid
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        <button 
                            onClick={() => sendCommand('STOP_AUDIO')}
                            disabled={loadingCmd}
                            className="bg-red-50 hover:bg-red-100 active:bg-red-200 text-red-600 p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-all border border-red-100 group"
                        >
                            <StopCircle className="w-8 h-8 group-active:scale-90 transition-transform" />
                            <span className="font-bold text-sm">STOP</span>
                        </button>
                        <button 
                            onClick={() => sendCommand('RESTART_APP')}
                            disabled={loadingCmd}
                            className="bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-600 p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-all border border-indigo-100 group"
                        >
                            <Power className="w-8 h-8 group-active:scale-90 transition-transform" />
                            <span className="font-bold text-sm">Restart</span>
                        </button>
                    </div>
                </div>

                {/* Text-to-Speech */}
                <div className="bg-slate-900 p-5 rounded-3xl shadow-lg text-white flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold mb-1 flex items-center gap-2">
                            <Mic className="w-5 h-5 text-cyan-400" /> Vorbește
                        </h3>
                        <p className="text-xs text-slate-400 mb-4">Trimite un mesaj vocal.</p>
                    </div>
                    <div className="flex gap-2 relative z-10">
                        <input 
                            type="text" 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="..."
                            className="flex-1 bg-slate-800 border-none rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-cyan-500"
                        />
                        <button 
                            onClick={() => {
                                if(message) { sendCommand('SPEAK_MESSAGE', message); setMessage('') }
                            }}
                            disabled={loadingCmd || !message}
                            className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 p-2.5 rounded-xl transition-colors disabled:opacity-50"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

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
        </div>

        {/* Coloana Dreapta */}
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