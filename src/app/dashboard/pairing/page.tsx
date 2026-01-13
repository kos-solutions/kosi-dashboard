'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { CheckCircle, Link as LinkIcon, AlertCircle, Loader2 } from 'lucide-react'
import { useDashboard } from '@/lib/DashboardContext'

export default function PairingPage() {
  const { state } = useDashboard()
  const router = useRouter()
  
  const [pairingCode, setPairingCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Verificăm sesiunea la încărcare
  useEffect(() => {
    const checkSession = async () => {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error || !session) {
            // Dacă nu avem sesiune, redirecționăm la login
            router.push('/login')
        }
    }
    checkSession()
  }, [router])

  useEffect(() => {
    if (state.deviceId) setSuccess(true)
  }, [state.deviceId])

  const handlePairing = async () => {
    if (!pairingCode || pairingCode.length < 4) {
        setError("Te rog introdu un cod valid (ex: KOSI-1234).")
        return
    }

    setLoading(true)
    setError(null)

    try {
        // 1. Verificăm sesiunea curentă
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session?.user) {
            router.push('/login')
            throw new Error("Trebuie să fii autentificat.")
        }

        const userId = session.user.id

        // 2. Căutăm dispozitivul
        const { data: device, error: searchError } = await supabase
            .from('devices')
            .select('id, child_name')
            .eq('pairing_code', pairingCode) 
            .maybeSingle()

        if (searchError || !device) {
            throw new Error("Cod incorect! Verifică ecranul robotului Kosi.")
        }

        console.log("✅ Dispozitiv găsit:", device.id)

        // 3. Creăm legătura în parent_devices
        const { error: linkError } = await supabase
            .from('parent_devices')
            .insert({
                parent_id: userId,
                device_id: device.id
            })

        if (linkError) {
            if (!linkError.message.includes('duplicate') && !linkError.message.includes('unique')) {
                throw linkError
            }
        }

        // 4. Succes!
        setSuccess(true)
        setTimeout(() => window.location.href = '/dashboard', 1500)

    } catch (err: any) {
        console.error("Eroare pairing:", err)
        setError(err.message || "Eroare la asociere.")
    } finally {
        setLoading(false)
    }
  }

  if (success || state.deviceId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in">
        <div className="bg-white p-10 rounded-[32px] shadow-xl border border-green-100 text-center max-w-md w-full">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Conectat!</h1>
          <p className="text-slate-500 mb-6">Robotul Kosi este acum asociat contului tău.</p>
          <button onClick={() => router.push('/dashboard')} className="w-full bg-green-600 text-white font-bold py-4 rounded-2xl hover:bg-green-700 transition-all">
            Către Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-white p-10 rounded-[32px] shadow-xl border border-slate-100 max-w-md w-full relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight text-center mb-2">Conectare Robot</h1>
        <p className="text-slate-500 text-center mb-8">Introdu codul de pe ecranul dispozitivului Kosi.</p>

        <div className="space-y-6">
            <input 
              type="text" 
              placeholder="KOSI-XXXX"
              className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-2xl font-mono font-bold text-center uppercase focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300 text-slate-800"
              value={pairingCode}
              onChange={(e) => setPairingCode(e.target.value.toUpperCase())}
            />
          
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-4 rounded-xl border border-red-100">
              <AlertCircle className="w-5 h-5 flex-shrink-0" /> 
              <span>{error}</span>
            </div>
          )}

          <button 
            disabled={loading || !pairingCode}
            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 transition-all disabled:opacity-50 flex justify-center items-center gap-2 shadow-lg shadow-indigo-200"
            onClick={handlePairing}
          >
            {loading ? <Loader2 className="animate-spin" /> : <><LinkIcon className="w-5 h-5" /> Conectează</>}
          </button>
        </div>
      </div>
    </div>
  )
}