'use client'

import { useDashboard } from '@/lib/DashboardContext'
import { Wifi, WifiOff, Battery, Smartphone } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function StatusCard() {
  const { state } = useDashboard()
  const router = useRouter()

  const isOnline = state.deviceStatus === 'active'

  return (
    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 relative overflow-hidden">
      <div className={`absolute top-0 right-0 p-4 ${isOnline ? 'text-green-500' : 'text-slate-300'}`}>
        <Wifi className="w-6 h-6" />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
            isOnline ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'
          }`}>
            <Smartphone className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {state.childName || 'Dispozitiv Kosi'}
            </h3>
            <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
              Status: 
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                isOnline ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
              }`}>
                {isOnline ? 'Conectat' : 'Deconectat'}
              </span>
            </p>
          </div>
        </div>

        {!state.deviceId && (
          <div className="mt-2 p-4 bg-orange-50 rounded-2xl border border-orange-100">
            <p className="text-sm text-orange-800 mb-3 font-medium">
              Niciun robot Kosi asociat acestui cont.
            </p>
            <button 
              // ⭐ AICI AM CORECTAT LINK-UL
              onClick={() => router.push('/dashboard/pairing')}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-orange-200"
            >
              Conectează un dispozitiv →
            </button>
          </div>
        )}

        {state.deviceId && (
           <div className="flex items-center gap-4 mt-2 pt-4 border-t border-slate-50">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg">
                <Battery className="w-4 h-4" /> 84%
              </div>
              <div className="text-xs text-slate-400">
                Ultima sinc: {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
           </div>
        )}
      </div>
    </div>
  )
}