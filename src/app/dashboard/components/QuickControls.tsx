'use client'

import { Power, Square, MessageSquare, RefreshCcw } from 'lucide-react'
import { useDashboard } from '@/lib/DashboardContext'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

export default function QuickControls() {
  const { sendCommand } = useDashboard()
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)

  const handleCommand = async (type: string, payload: any = null, label: string = "") => {
    try {
      setIsSending(true)
      await sendCommand(type, payload)
      if (label) toast.success(`Comandă trimisă: ${label}`)
      
      // Reset vizual
      setTimeout(() => setIsSending(false), 500)
    } catch (e) {
      toast.error("Eroare la trimiterea comenzii.")
      setIsSending(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
      <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Power className="w-5 h-5 text-indigo-500" />
        Control Dispozitiv
      </h3>
      
      {/* Butoane Sincronizate cu MainActivity.kt */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button 
          onClick={() => handleCommand('STOP_AUDIO', null, 'Stop Audio')}
          className="flex flex-col items-center gap-3 p-4 bg-red-50 hover:bg-red-100 hover:text-red-700 rounded-2xl transition-all border border-transparent hover:border-red-200 group active:scale-95"
        >
          <Square className="w-6 h-6 text-red-400 group-hover:text-red-600 fill-current" />
          <span className="text-xs font-bold uppercase tracking-widest">STOP Sunet</span>
        </button>

        <button 
          onClick={() => handleCommand('RESTART_APP', null, 'Restart Aplicație')}
          className="flex flex-col items-center gap-3 p-4 bg-orange-50 hover:bg-orange-100 hover:text-orange-700 rounded-2xl transition-all border border-transparent hover:border-orange-200 group active:scale-95"
        >
          <RefreshCcw className="w-6 h-6 text-orange-400 group-hover:text-orange-600" />
          <span className="text-xs font-bold uppercase tracking-widest">Restart App</span>
        </button>
      </div>

      {/* Mesaje Vocale (TTS) */}
      <div className="border-t border-slate-100 pt-5">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
          <MessageSquare className="w-3 h-3" />
          Trimite Mesaj Vocal
        </label>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Scrie un mesaj..."
            onKeyDown={(e) => e.key === 'Enter' && handleCommand("SPEAK_MESSAGE", { text: message }, "Mesaj Vocal")}
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-slate-800 placeholder:text-slate-400"
          />
          <button
            onClick={() => { handleCommand("SPEAK_MESSAGE", { text: message }, "Mesaj Vocal"); setMessage(""); }}
            disabled={!message || isSending}
            className="bg-indigo-600 text-white px-4 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 active:scale-95 shadow-md shadow-indigo-200 flex items-center justify-center"
          >
            {isSending ? <RefreshCcw className="w-4 h-4 animate-spin" /> : "Speak"}
          </button>
        </div>
      </div>
    </div>
  )
}