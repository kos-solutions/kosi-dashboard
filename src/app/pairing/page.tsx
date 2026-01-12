'use client'

import { useState } from 'react'
import { CheckCircle, Link as LinkIcon, AlertCircle, Loader2 } from 'lucide-react'
import { useDashboard } from '@/lib/DashboardContext'
import { supabase } from '@/lib/supabaseClient'

export default function PairingPage() {
  const { state } = useDashboard()
  const [pairingCode, setPairingCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePairing = async () => {
    if (!pairingCode) return
    setLoading(true)
    setError(null)
    
    // Simulare proces pairing - în realitate cauți codul în DB
    // Logica aici va actualiza tabelul 'devices' cu user_id-ul curent
    setLoading(false)
  }

  // UI pentru dispozitiv deja asociat
  if (state.deviceId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in duration-500">
        <div className="bg-white p-10 rounded-[32px] shadow-xl border border-green-100 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Conectat!</h1>
          <p className="text-slate-500 mb-8">
            Dashboard-ul tău este sincronizat cu dispozitivul lui <strong>{state.childName || 'Miriam'}</strong>.
          </p>
          <div className="p-4 bg-slate-50 rounded-2xl text-xs text-slate-400 font-mono break-all">
            UUID: {state.deviceId}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-white p-10 rounded-[32px] shadow-xl border border-slate-100 max-w-md w-full">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-indigo-100 rounded-2xl text-indigo-600">
            <LinkIcon className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Asociere Dispozitiv</h1>
        </div>

        <p className="text-slate-500 mb-8">
          Introdu codul de 8 cifre (ex: KOSI-7066) afișat pe ecranul aplicației Android.
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-tight">Cod Pairing</label>
            <input 
              type="text" 
              placeholder="KOSI-XXXX"
              className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none transition-all text-xl font-mono uppercase"
              value={pairingCode}
              onChange={(e) => setPairingCode(e.target.value)}
            />
          </div>
          
          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-xl">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <button 
            disabled={loading || !pairingCode}
            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 flex items-center justify-center gap-2"
            onClick={handlePairing}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Conectează Dispozitiv"}
          </button>
        </div>
      </div>
    </div>
  )
}