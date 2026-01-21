'use client'
import { useState } from 'react'
import { useDashboard } from '@/lib/DashboardContext'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function PairingPage() {
  const { t, refreshData } = useDashboard()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClientComponentClient()

  const handlePair = async () => {
    setLoading(true)
    // Simulare pairing
    setTimeout(() => {
        setLoading(false);
        // Aici ar trebui logica reală de verificare în DB
        alert(t.pairing.success);
        refreshData();
    }, 1000)
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mt-10">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">{t.pairing.title}</h1>
      
      <div className="space-y-6">
        {/* Instrucțiuni vizuale */}
        <div className="bg-indigo-50 p-4 rounded-2xl space-y-3 text-sm text-slate-700">
            <p className="font-medium">{t.pairing.step1}</p>
            <p className="font-bold text-indigo-700">{t.pairing.step2}</p>
            <p className="font-medium">{t.pairing.step3}</p>
        </div>

        <div>
          <input 
            type="text" 
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder={t.pairing.placeholder} // Ex: KOSI-1234
            className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-2xl text-center tracking-widest font-mono uppercase"
          />
        </div>

        <button 
          onClick={handlePair}
          disabled={loading || code.length < 4}
          className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50"
        >
          {loading ? '...' : t.pairing.button}
        </button>
      </div>
    </div>
  )
}