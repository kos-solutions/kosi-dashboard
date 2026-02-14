'use client'

import { useDashboard } from '@/lib/DashboardContext'
import { Wifi, Battery, Zap, Activity, Clock } from 'lucide-react'

export default function StatusCard() {
  const { state } = useDashboard()
  // Extragem datele live din context
  const { deviceStatus, batteryLevel, lastActivity } = state

  // Calculăm statusul vizual
  const isOnline = deviceStatus === 'active' || deviceStatus === 'online'
  
  // Culori dinamice bazate pe status
  const statusColors = isOnline 
    ? { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200', iconBg: 'bg-green-100' }
    : { bg: 'bg-slate-50', text: 'text-slate-500', border: 'border-slate-200', iconBg: 'bg-slate-100' }

  return (
    <div className={`bg-white p-6 rounded-3xl border ${statusColors.border} shadow-sm h-full flex flex-col justify-between relative overflow-hidden transition-all hover:shadow-md`}>
      
      {/* 1. Header: Conexiune */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl ${statusColors.iconBg} ${statusColors.text}`}>
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status Dispozitiv</p>
            <h3 className={`text-lg font-extrabold ${statusColors.text}`}>
              {isOnline ? 'CONECTAT' : 'DECONECTAT'}
            </h3>
          </div>
        </div>
        
        {/* Indicator Pulsând dacă e online */}
        {isOnline && (
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
        )}
      </div>

      {/* 2. Grid Baterie & Wifi */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Card Mic Baterie */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
           <div className="flex items-center gap-2 mb-1 text-slate-400">
              <Battery className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase">Baterie</span>
           </div>
           <p className="text-xl font-bold text-slate-800">
             {batteryLevel > 0 ? `${batteryLevel}%` : '--'}
           </p>
        </div>

        {/* Card Mic Semnal */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
           <div className="flex items-center gap-2 mb-1 text-slate-400">
              <Wifi className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase">Semnal</span>
           </div>
           <p className="text-xl font-bold text-slate-800">
             {isOnline ? 'Bun' : 'Lipsă'}
           </p>
        </div>
      </div>

      {/* 3. Footer: Ultima Activitate */}
      <div className="mt-auto pt-4 border-t border-slate-100">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-500 rounded-full mt-0.5">
            <Activity className="w-4 h-4" />
          </div>
          <div className="min-w-0">
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
               Ultima acțiune
             </p>
             <p className="text-sm font-bold text-slate-700 truncate leading-tight">
               {lastActivity?.detail || lastActivity?.event_type || "Nicio activitate recentă"}
             </p>
             <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                <Clock className="w-3 h-3" />
                <span>
                   {lastActivity?.created_at 
                     ? new Date(lastActivity.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                     : "--:--"}
                </span>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}