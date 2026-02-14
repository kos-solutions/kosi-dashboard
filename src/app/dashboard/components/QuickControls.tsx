'use client'

import { Mic, Square, Sun, Moon, Power, LogOut } from 'lucide-react'
import { useDashboard } from '@/lib/DashboardContext'
import { useState } from 'react'

export default function QuickControls() {
  const { sendCommand, t } = useDashboard()
  const [loading, setLoading] = useState<string | null>(null)

  const handleCommand = async (command: string, payload: any = {}) => {
    setLoading(command)
    try {
      await sendCommand(command, payload)
      setTimeout(() => setLoading(null), 1000)
    } catch (err) {
      console.error(err)
      setLoading(null)
    }
  }

  const getBtnClass = (cmdName: string, colorClass: string, borderClass: string) => `
    flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl 
    border transition-all active:scale-95 group h-full
    ${loading === cmdName ? 'bg-gray-100 border-gray-200 opacity-70 cursor-wait' : `bg-white hover:bg-gray-50 ${borderClass} border-gray-100`}
  `

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm h-full flex flex-col justify-center">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Control Rapid</h3>
      
      <div className="grid grid-cols-2 gap-3 h-full">
        {/* Buton 1: Pauză/Stop Audio */}
        <button 
           onClick={() => handleCommand('STOP_AUDIO')}
           className={getBtnClass('STOP_AUDIO', 'text-amber-600', 'hover:border-amber-200')}
        >
           <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mb-2">
             <Square className="w-5 h-5 fill-current" />
           </div>
           <span className="text-xs font-bold text-slate-600">Pauză Audio</span>
        </button>

        {/* Buton 2: Mod Somn (Ecran negru) */}
        <button 
           onClick={() => handleCommand('SLEEP_MODE')}
           className={getBtnClass('SLEEP_MODE', 'text-indigo-600', 'hover:border-indigo-200')}
        >
           <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center mb-2">
             <Moon className="w-5 h-5" />
           </div>
           <span className="text-xs font-bold text-slate-600">Mod Somn</span>
        </button>

        {/* Buton 3: Salut Rapid */}
        <button 
           onClick={() => handleCommand('SPEAK_MESSAGE', { text: "Te iubesc!" })}
           className={getBtnClass('SPEAK_MESSAGE', 'text-pink-600', 'hover:border-pink-200')}
        >
           <div className="w-10 h-10 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center mb-2">
             <Mic className="w-5 h-5" />
           </div>
           <span className="text-xs font-bold text-slate-600">Salut Rapid</span>
        </button>

        {/* Buton 4: ÎNCHIDE APLICAȚIA (EXIT) */}
        <button 
           onClick={() => handleCommand('EXIT_APP')} 
           className={getBtnClass('EXIT_APP', 'text-red-600', 'hover:border-red-200')}
        >
           <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-2">
             <Power className="w-5 h-5" />
           </div>
           <span className="text-xs font-bold text-slate-600">Închide App</span>
        </button>
      </div>
    </div>
  )
}