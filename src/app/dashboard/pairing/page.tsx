'use client'

import { useState } from 'react'
import { CheckCircle, Link as LinkIcon, Loader2 } from 'lucide-react'
import { useDashboard } from '@/lib/DashboardContext'

export default function PairingPage() {
  const { state } = useDashboard() // Acum va funcționa pentru că e sub /dashboard
  const [pairingCode, setPairingCode] = useState('')
  const [loading, setLoading] = useState(false)

  // Verificăm dacă dispozitivul este deja asociat în DB
  if (state.deviceId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in">
        <div className="bg-white p-10 rounded-[32px] shadow-xl border border-green-100 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Conectat!</h1>
          <p className="text-slate-500 mb-6">Robotul Kosi este sincronizat cu contul tău.</p>
          <div className="p-3 bg-slate-50 rounded-xl text-xs font-mono text-slate-400 uppercase tracking-widest">
            ID: {state.deviceId}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-white p-10 rounded-[32px] shadow-xl border border-slate-100 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <LinkIcon className="text-indigo-600" /> Asociere
        </h1>
        <input 
          type="text" 
          placeholder="KOSI-1234" 
          className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl mb-4 uppercase font-mono text-center text-xl"
          value={pairingCode}
          onChange={(e) => setPairingCode(e.target.value)}
        />
        <button className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all">
          Conectează Robotul
        </button>
      </div>
    </div>
  )
}