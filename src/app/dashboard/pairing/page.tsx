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

  // Dacă avem deja deviceId în context, înseamnă că e conectat
  useEffect(() => {
    if (state.deviceId) setSuccess(true)
  }, [state.deviceId])

  const handlePairing = async () => {
    if (!pairingCode || pairingCode.length < 4) {
        setError("Introdu un cod valid (ex: KOSI-1234).")
        return
    }

    setLoading(true)
    setError(null)

    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            router.push('/login')
            throw new Error("Te rog autentifică-te din nou.")
        }

        // 1. Găsim dispozitivul
        const { data: device, error: searchError } = await supabase
            .from('devices')
            .select('id')
            .eq('pairing_code', pairingCode.toUpperCase()) 
            .maybeSingle()

        if (searchError || !device) {
            throw new Error("Cod incorect. Verifică ecranul robotului.")
        }

        console.log("✅ Device găsit:", device.id)

        // 2. Creăm legătura (Dacă există deja, insert-ul va eșua sau îl ignorăm)
        const { error: linkError } = await supabase
            .from('parent_devices')
            .insert({
                parent_id: user.id,
                device_id: device.id
            })

        // Ignorăm eroarea de duplicat (înseamnă că e deja legat)
        if (linkError && !linkError.message.includes('duplicate') && !linkError.message.includes('unique')) {
             throw linkError
        }

        // 3. IMPORTANT: Setăm flag-ul pe device ca să știe Android-ul că e conectat
        await supabase
            .from('devices')
            .update({ is_paired: true })
            .eq('id', device.id)

        setSuccess(true)
        
        // Refresh complet pentru a forța DashboardContext să reîncarce
        setTimeout(() => {
            window.location.href = '/dashboard'
        }, 1500)

    } catch (err: any) {
        console.error(err)
        setError(err.message || "Eroare la conectare.")
    } finally {
        setLoading(false)
    }
  }

  if (success || state.deviceId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in">
        <div className="bg-white p-10 rounded-[32px] shadow-xl border border-green-100 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Conectat cu succes!</h1>
          <p className="text-slate-500 mb-6">Dashboard-ul este acum sincronizat.</p>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-all"
          >
            Intră în Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-white p-8 rounded-[32px] shadow-xl border border-slate-100 max-w-md w-full relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600"></div>
        
        <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-slate-900">Conectare Kosi</h1>
            <p className="text-slate-500 text-sm mt-1">Introdu codul de pe ecranul dispozitivului</p>
        </div>

        <div className="space-y-4">
            <input 
              type="text" 
              placeholder="KOSI-XXXX"
              className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-xl font-mono font-bold text-center uppercase focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300 text-slate-800"
              value={pairingCode}
              onChange={(e) => setPairingCode(e.target.value.toUpperCase())}
            />
          
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 p-3 rounded-lg border border-red-100">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> 
              <span>{error}</span>
            </div>
          )}

          <button 
            disabled={loading || pairingCode.length < 4}
            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 flex justify-center items-center gap-2 shadow-lg shadow-indigo-200"
            onClick={handlePairing}
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Conectează"}
          </button>
        </div>
      </div>
    </div>
  )
}