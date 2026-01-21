'use client'

import { Mic, Square, Sun, Moon } from 'lucide-react'
import { useDashboard } from '@/lib/DashboardContext'
import { useState } from 'react'

// 👇 FIX: Adăugăm 't' în interfață ca să scăpăm de eroarea de build
interface QuickControlsProps {
  sendCommand?: (command: string, payload?: any) => Promise<void>;
  t?: any; // Îl lăsăm 'any' momentan pentru a evita importuri complexe
}

export default function QuickControls({ sendCommand: propSendCommand, t: propT }: QuickControlsProps) {
  
  // Luăm datele din context, dar permitem suprascrierea prin props
  const { sendCommand: contextSendCommand, t: contextT } = useDashboard();
  
  const sendCommand = contextSendCommand || propSendCommand;
  // Folosim traducerile primite prin props (din page.tsx) SAU cele din context
  // Fallback la un obiect gol ca să nu crape dacă e undefined
  const t = propT || contextT || { controls: { title: "Controls", stop: "Stop", greet: "Greet", light: "Light", sleep: "Sleep" } };

  const [loading, setLoading] = useState<string | null>(null)

  const handleCommand = async (command: string) => {
    if (!sendCommand) return;
    
    setLoading(command)
    try {
      await sendCommand(command, {})
      setTimeout(() => setLoading(null), 500)
    } catch (error) {
      console.error(`Failed to send command ${command}:`, error)
      setLoading(null)
    }
  }

  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
           ⚡ {t.controls?.title || "Comenzi Rapide"}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {/* Buton STOP */}
        <button 
          onClick={() => handleCommand('STOP_AUDIO')}
          disabled={loading !== null}
          className="flex flex-col items-center justify-center p-4 rounded-2xl bg-red-50 hover:bg-red-100 border border-red-100 transition-all active:scale-95 group"
        >
          <div className="w-10 h-10 rounded-full bg-white text-red-500 flex items-center justify-center mb-2 shadow-sm group-hover:shadow-md transition-all">
            <Square className="w-5 h-5 fill-current" />
          </div>
          <span className="text-xs font-bold text-red-700">{t.controls?.stop || "Stop"}</span>
        </button>

        {/* Buton SALUT */}
        <button 
          onClick={() => handleCommand('SPEAK_MESSAGE')}
          disabled={loading !== null}
          className="flex flex-col items-center justify-center p-4 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 transition-all active:scale-95 group"
        >
          <div className="w-10 h-10 rounded-full bg-white text-indigo-500 flex items-center justify-center mb-2 shadow-sm group-hover:shadow-md transition-all">
            <Mic className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-indigo-700">{t.controls?.greet || "Salut"}</span>
        </button>

        {/* Buton LIGHT */}
        <button 
           onClick={() => handleCommand('LIGHT_ON')}
           disabled={loading !== null}
           className="flex flex-col items-center justify-center p-4 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-100 transition-all active:scale-95 group"
        >
           <div className="w-10 h-10 rounded-full bg-white text-amber-500 flex items-center justify-center mb-2 shadow-sm group-hover:shadow-md transition-all">
             <Sun className="w-5 h-5" />
           </div>
           <span className="text-xs font-bold text-amber-700">{t.controls?.light || "Lumină"}</span>
        </button>

        {/* Buton SLEEP */}
        <button 
           onClick={() => handleCommand('SLEEP_MODE')}
           disabled={loading !== null}
           className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-all active:scale-95 group"
        >
           <div className="w-10 h-10 rounded-full bg-white text-slate-500 flex items-center justify-center mb-2 shadow-sm group-hover:shadow-md transition-all">
             <Moon className="w-5 h-5" />
           </div>
           <span className="text-xs font-bold text-slate-700">{t.controls?.sleep || "Somn"}</span>
        </button>
      </div>
    </div>
  )
}