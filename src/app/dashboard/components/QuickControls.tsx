'use client'

import { Power, Volume2, Pause, Play } from 'lucide-react'
import { useDashboard } from '@/lib/DashboardContext'
import { toast } from 'react-hot-toast'

export default function QuickControls() {
  const { sendCommand, state } = useDashboard()

  const handleCommand = async (type: string, label: string) => {
    try {
      await sendCommand(type)
      toast.success(`Comandă trimisă: ${label}`)
    } catch (e) {
      toast.error("Eroare la trimiterea comenzii.")
    }
  }

  return (
    <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
      <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Power className="w-5 h-5 text-indigo-500" />
        Control Dispozitiv
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => handleCommand('PAUSE_APP', 'Pauză Aplicație')}
          className="flex flex-col items-center gap-3 p-4 bg-slate-50 hover:bg-amber-50 hover:text-amber-700 rounded-2xl transition-all border border-transparent hover:border-amber-100 group"
        >
          <Pause className="w-6 h-6 text-slate-400 group-hover:text-amber-500" />
          <span className="text-xs font-bold uppercase tracking-widest">Pauză Activă</span>
        </button>

        <button 
          onClick={() => handleCommand('RESUME_APP', 'Reluare Aplicație')}
          className="flex flex-col items-center gap-3 p-4 bg-slate-50 hover:bg-green-50 hover:text-green-700 rounded-2xl transition-all border border-transparent hover:border-green-100 group"
        >
          <Play className="w-6 h-6 text-slate-400 group-hover:text-green-500" />
          <span className="text-xs font-bold uppercase tracking-widest">Reluare</span>
        </button>

        <button 
          onClick={() => handleCommand('SET_VOLUME_HIGH', 'Volum Maxim')}
          className="flex flex-col items-center gap-3 p-4 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 rounded-2xl transition-all border border-transparent hover:border-blue-100 group"
        >
          <Volume2 className="w-6 h-6 text-slate-400 group-hover:text-blue-500" />
          <span className="text-xs font-bold uppercase tracking-widest">Volum +</span>
        </button>

        <button 
          onClick={() => handleCommand('STOP_STORY', 'Oprire Poveste')}
          className="flex flex-col items-center gap-3 p-4 bg-slate-50 hover:bg-red-50 hover:text-red-700 rounded-2xl transition-all border border-transparent hover:border-red-100 group"
        >
          <Power className="w-6 h-6 text-slate-400 group-hover:text-red-500" />
          <span className="text-xs font-bold uppercase tracking-widest">Stop Imediat</span>
        </button>
      </div>
    </div>
  )
}