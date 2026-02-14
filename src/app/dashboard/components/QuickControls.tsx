'use client'

import { Mic, Square, Sun, Moon, Volume2, Power } from 'lucide-react'
import { useDashboard } from '@/lib/DashboardContext'
import { useState } from 'react'

export default function QuickControls() {
  // 1. Folosim funcția sendCommand din context
  const { sendCommand, t } = useDashboard()
  const [loading, setLoading] = useState<string | null>(null)

  const handleCommand = async (command: string, payload: any = {}) => {
    setLoading(command)
    try {
      // Trimitem comanda către Supabase -> Device
      await sendCommand(command, payload)
      
      // Mic delay vizual pentru feedback
      setTimeout(() => setLoading(null), 1000)
    } catch (err) {
      console.error(err)
      setLoading(null)
    }
  }

  // Helper pentru starea butonului
  const getBtnClass = (cmdName: string, colorClass: string) => `
    flex flex-col items-center justify-center p-4 rounded-2xl 
    border transition-all active:scale-95 group
    ${loading === cmdName ? 'bg-gray-100 border-gray-200 opacity-70 cursor-wait' : `bg-white hover:bg-gray-50 border-gray-100 ${colorClass}`}
  `

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Control Rapid</h3>
      
      <div className="grid grid-cols-4 gap-3">
        {/* STOP */}
        <button 
           onClick={() => handleCommand('STOP_AUDIO')}
           className={getBtnClass('STOP_AUDIO', 'hover:border-red-200')}
        >
           <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-2">
             <Square className="w-5 h-5 fill-current" />
           </div>
           <span className="text-xs font-bold text-slate-600">{t.controls?.stop || "Stop"}</span>
        </button>

        {/* SALUT */}
        <button 
           onClick={() => handleCommand('SPEAK_MESSAGE', { text: "Salut! Eu sunt Kosi." })}
           className={getBtnClass('SPEAK_MESSAGE', 'hover:border-indigo-200')}
        >
           <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center mb-2">
             <Mic className="w-5 h-5" />
           </div>
           <span className="text-xs font-bold text-slate-600">{t.controls?.greet || "Salut"}</span>
        </button>

        {/* LUMINĂ */}
        <button 
           onClick={() => handleCommand('LIGHT_ON')}
           className={getBtnClass('LIGHT_ON', 'hover:border-amber-200')}
        >
           <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mb-2">
             <Sun className="w-5 h-5" />
           </div>
           <span className="text-xs font-bold text-slate-600">{t.controls?.light || "Lumină"}</span>
        </button>

        {/* SLEEP */}
        <button 
           onClick={() => handleCommand('SLEEP_MODE')}
           className={getBtnClass('SLEEP_MODE', 'hover:border-slate-300')}
        >
           <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mb-2">
             <Moon className="w-5 h-5" />
           </div>
           <span className="text-xs font-bold text-slate-600">{t.controls?.sleep || "Somn"}</span>
        </button>
      </div>
    </div>
  )
}