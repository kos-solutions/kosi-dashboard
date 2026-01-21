'use client'

import { useState, useEffect } from 'react'
import { useDashboard } from '@/lib/DashboardContext'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { CheckCircle, Smartphone, Unlink, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function PairingPage() {
  const { t, state, refreshData, disconnectDevice } = useDashboard()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClientComponentClient()

  // Funcția care leagă efectiv dispozitivul în baza de date
  const handlePair = async () => {
    if (code.length < 4) return;
    setLoading(true);

    try {
      // 1. Căutăm dispozitivul după codul de pairing (pairing_code)
      // *Presupunem că în tabelul 'devices' ai o coloană 'pairing_code' sau similar
      // Dacă nu ai logica backend, facem simularea pe care o aveai, dar ideal e un query real:
      /*
      const { data: device, error } = await supabase
        .from('devices')
        .select('id')
        .eq('pairing_code', code.toUpperCase())
        .single();
      
      if (error || !device) throw new Error("Cod invalid");
      const deviceId = device.id;
      */

      // SIMULARE PENTRU TEST (Cum aveai înainte):
      // Aici poți pune un ID real din baza ta de date pentru test, sau îl lași să treacă
      const fakeDeviceId = "00a172d8d6a6abec"; // ID-ul tău de test
      
      // Salvăm în LocalStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('kosi_device_id', fakeDeviceId);
      }
      
      // Facem refresh la context ca să vadă noul ID
      await refreshData();
      
      toast.success(t.pairing.success);
      setCode('');

    } catch (err) {
      toast.error(t.pairing.error);
    } finally {
      setLoading(false);
    }
  }

  // --- STAREA 1: UTILIZATOR DEJA CONECTAT ---
  if (state.deviceId) {
    return (
      <div className="max-w-md mx-auto mt-10">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-green-100 text-center space-y-6">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">{t.pairing.success}</h1>
            <p className="text-slate-500">
              {t.header.subtitle.replace('{child}', state.childName)}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg text-sm font-mono text-slate-600">
              <Smartphone className="w-4 h-4" />
              ID: {state.deviceId.slice(0, 8)}...
            </div>
          </div>

          <button 
            onClick={disconnectDevice}
            className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 py-3 rounded-xl transition-all font-medium border border-transparent hover:border-red-100"
          >
            <Unlink className="w-4 h-4" />
            Deconectează Dispozitivul
          </button>
        </div>
      </div>
    )
  }

  // --- STAREA 2: NECONECTAT (FORMULAR) ---
  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mt-10">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">{t.pairing.title}</h1>
      
      <div className="space-y-6">
        {/* Instrucțiuni vizuale */}
        <div className="bg-indigo-50 p-5 rounded-2xl space-y-3 text-sm text-slate-700 border border-indigo-100">
            <p className="flex gap-2"><span className="font-bold text-indigo-600">1.</span> {t.pairing.step1}</p>
            <p className="flex gap-2"><span className="font-bold text-indigo-600">2.</span> {t.pairing.step2}</p>
            <p className="flex gap-2"><span className="font-bold text-indigo-600">3.</span> {t.pairing.step3}</p>
        </div>

        <div>
          <input 
            type="text" 
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder={t.pairing.placeholder} 
            className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-2xl text-center tracking-widest font-mono uppercase text-slate-800 placeholder:text-slate-300"
          />
        </div>

        <button 
          onClick={handlePair}
          disabled={loading || code.length < 4}
          className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t.pairing.button}
        </button>
      </div>
    </div>
  )
}