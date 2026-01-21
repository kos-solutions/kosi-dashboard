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
    // Aici vine logica ta de pairing (exemplu simplificat)
    // ... logic ...
    setTimeout(() => {
        setLoading(false);
        alert(t.pairing.success); // Traducere
        refreshData();
    }, 1000)
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mt-10">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">{t.pairing.title}</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">{t.pairing.instruction}</label>
          <input 
            type="text" 
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={t.pairing.placeholder}
            className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-2xl text-center tracking-widest font-mono"
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