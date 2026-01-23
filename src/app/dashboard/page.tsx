'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Sparkles, Palette, BrainCircuit, Image as ImageIcon, LayoutTemplate, StopCircle, Mic, Send, Zap, Power } from 'lucide-react'
import { useDashboard } from '@/lib/DashboardContext'
import StatusCard from './components/StatusCard'
import LiveActivityFeed from './components/LiveActivityFeed'
import ActivitySummary from './components/ActivitySummary'
import VoiceCloneCard from './components/VoiceCloneCard'

// Configurare Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export default function DashboardPage() {
  const { t } = useDashboard() // Folosim doar traducerile din context, datele le luăm live
  
  // Stare locală
  const [loadingCmd, setLoadingCmd] = useState(false)
  const [message, setMessage] = useState('')
  const [activeDevice, setActiveDevice] = useState<{id: string, code: string} | null>(null)
  
  // Date reale din DB
  const [stats, setStats] = useState({ stories: 0, drawings: 0, games: 0, activeTime: 0 })
  const [recentDrawings, setRecentDrawings] = useState<any[]>([])
  const [recentActivities, setRecentActivities] = useState<any[]>([])

  // 1. Căutăm dispozitivul
  useEffect(() => {
    const fetchDevice = async () => {
         const { data } = await supabase
            .from('devices')
            .select('id, pairing_code, created_at')
            .order('created_at', { ascending: false })
            .limit(1)
            
         if (data && data.length > 0) {
             const device = data[0]
             setActiveDevice({ id: device.id, code: device.pairing_code })
         }
    }
    fetchDevice()
  }, [])

  // 2. Încărcăm datele (Statistici + Desene)
  useEffect(() => {
    if (!activeDevice) return

    const fetchData = async () => {
      // A. Fetch Activități (pentru statistici și feed)
      const { data: logs } = await supabase
        .from('activity_log')
        .select('*')
        .eq('device_id', activeDevice.id)
        .order('created_at', { ascending: false })
        .limit(50) // Luăm ultimele 50 pentru calcule rapide

      if (logs) {
          // Calculăm statisticile local
          let s = 0, d = 0, g = 0, time = 0
          logs.forEach((log: any) => {
              if (log.event_type === 'story_played') { s++; time += (log.duration_seconds || 0) }
              if (log.event_type === 'DRAW') { d++; time += 5 } // 5 min per desen estimat
              if (log.event_type === 'GAME') { g++; time += 10 } // 10 min per joc estimat
          })
          
          setStats({ stories: s, drawings: d, games: g, activeTime: Math.round(time / 60) })
          setRecentActivities(logs.slice(0, 10))

          // B. Extragem Desenele din log-uri
          const drawingLogs = logs.filter((l: any) => l.event_type === 'DRAW').slice(0, 4)
          const drawings = drawingLogs.map((act: any) => {
            let data: any = {};
            try { data = typeof act.event_data === 'string' ? JSON.parse(act.event_data) : act.event_data; } catch (e) {}
            return { id: act.id, url: data.url, template: data.template || 'Liber', timestamp: act.created_at }
          })
          setRecentDrawings(drawings)
      }
    }

    fetchData()
    
    // Auto-refresh la date noi
    const channel = supabase
      .channel('dashboard_updates')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_log', filter: `device_id=eq.${activeDevice.id}` }, 
        () => fetchData()
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [activeDevice])

  // 3. Trimitere Comenzi
  const sendCommand = async (type: string, payload: any = {}) => {
    if (!activeDevice) return
    setLoadingCmd(true)
    try {
      await supabase.from('parent_commands').insert({
        device_id: activeDevice.id,
        command_type: type,
        payload: payload
      })
    } catch (e) { console.error(e) } 
    finally { setLoadingCmd(false) }
  }

  return (
    <div className="space-y-6 md:space-y-8">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{t.header.hello} 👋</h1>
          <div className="text-xs text-slate-400 mt-1">
            {activeDevice ? `Conectat: ${activeDevice.code}` : "Se caută..."}
          </div>
        </div>
        <div className={`w-3 h-3 rounded-full ${activeDevice ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
      </div>

      {/* Statistici */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <StatusCard icon={Sparkles} title={t.stats.stories} value={stats.stories.toString()} color="bg-purple-500" />
        <StatusCard icon={Palette} title={t.stats.drawings} value={stats.drawings.toString()} color="bg-pink-500" />
        <StatusCard icon={BrainCircuit} title={t.stats.games} value={stats.games.toString()} color="bg-blue-500" />
        <StatusCard icon={Sparkles} title="Ore Active" value={`${(stats.activeTime / 60).toFixed(1)}h`} color="bg-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-6">
            
            {/* Control Panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-amber-500" /> Control</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => sendCommand('STOP_AUDIO')} disabled={loadingCmd} className="bg-red-50 hover:bg-red-100 text-red-600 p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-all border border-red-100">
                            <StopCircle className="w-8 h-8" /> <span className="font-bold text-sm">STOP</span>
                        </button>
                        <button onClick={() => sendCommand('RESTART_APP')} disabled={loadingCmd} className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-all border border-indigo-100">
                            <Power className="w-8 h-8" /> <span className="font-bold text-sm">Restart</span>
                        </button>
                    </div>
                </div>

                <div className="bg-slate-900 p-5 rounded-3xl shadow-lg text-white flex flex-col justify-between">
                    <div><h3 className="font-bold mb-1 flex items-center gap-2"><Mic className="w-5 h-5 text-cyan-400" /> Mesaj Vocal</h3><p className="text-xs text-slate-400 mb-4">Trimite un mesaj audio.</p></div>
                    <div className="flex gap-2">
                        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="..." className="flex-1 bg-slate-800 border-none rounded-lg px-3 py-2 text-sm text-white" />
                        <button onClick={() => { if(message) { sendCommand('SPEAK_MESSAGE', message); setMessage('') }}} disabled={loadingCmd || !message} className="bg-cyan-500 text-slate-900 p-2.5 rounded-xl"><Send className="w-5 h-5" /></button>
                    </div>
                </div>
            </div>

            {/* Galeria */}
            <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-100">
                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2 mb-6"><Palette className="w-5 h-5 text-pink-500" /> {t.gallery.title}</h3>
                {recentDrawings.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {recentDrawings.map((draw) => (
                        <div key={draw.id} className="aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                        <img src={draw.url} alt="Desen" className="w-full h-full object-cover" />
                        </div>
                    ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-slate-400 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50 h-32">
                        <ImageIcon className="w-8 h-8 opacity-30" /><p className="text-xs font-bold uppercase tracking-widest opacity-50">{t.gallery.noDrawings}</p>
                    </div>
                )}
            </div>
        </div>

        {/* Feed Activitate */}
        <div className="space-y-6">
             <VoiceCloneCard />
             <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-100 h-[400px] overflow-hidden flex flex-col">
                <h3 className="font-bold text-lg text-slate-800 mb-4">{t.activity.recent}</h3>
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                    {recentActivities.map(act => (
                        <div key={act.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <div>
                                <p className="text-sm font-medium text-slate-700">
                                    {act.event_type === 'story_played' ? 'Poveste ascultată' : 
                                     act.event_type === 'DRAW' ? 'Desen nou' : act.event_type}
                                </p>
                                <p className="text-xs text-slate-400">{new Date(act.created_at).toLocaleTimeString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
             </div>
             <ActivitySummary />
        </div>
      </div>
    </div>
  )
}