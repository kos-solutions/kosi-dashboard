'use client'

import { useDashboard } from '@/lib/DashboardContext'
import { LogOut, Trash2, Smartphone, ShieldAlert, Wifi, Battery } from 'lucide-react'
import { useState } from 'react'

export default function SettingsPage() {
  // Aici preluăm funcția de deconectare din Context
  const { state, disconnectDevice } = useDashboard()
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Setări Dispozitiv</h1>
        <p className="text-slate-500 mt-1">Gestionează conexiunea cu jucăria Kosi.</p>
      </div>

      {/* Card Info Dispozitiv */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-start justify-between mb-6 gap-4">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
                    <Smartphone className="w-6 h-6" />
                </div>
                <div className="overflow-hidden">
                    <h3 className="text-lg font-bold text-slate-800">Dispozitiv Asociat</h3>
                    <p className="text-sm text-slate-500 truncate">
                        UUID: <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700 select-all">{state.deviceId || 'Niciunul'}</span>
                    </p>
                </div>
            </div>
            <div className={`self-start px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${state.deviceId ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                {state.deviceId ? 'Conectat' : 'Neasociat'}
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nume Copil</label>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium">
                    {state.childName}
                </div>
             </div>
             <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ultima sincronizare</label>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium">
                    {state.lastSeen ? new Date(state.lastSeen).toLocaleString() : '-'}
                </div>
             </div>
        </div>

        {/* Status Tehnic */}
        {state.deviceId && (
            <div className="mt-6 pt-6 border-t border-slate-100 flex gap-6">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Battery className={`w-4 h-4 ${state.batteryLevel < 20 ? 'text-red-500' : 'text-slate-400'}`} />
                    Baterie: <span className="font-bold">{state.batteryLevel}%</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Wifi className="w-4 h-4 text-slate-400" />
                    WiFi: <span className="font-bold">{state.wifiStatus === 'strong' ? 'Puternic' : 'Mediu'}</span>
                </div>
            </div>
        )}
      </div>

      {/* Card Danger Zone (Deconectare) */}
      <div className="bg-red-50 rounded-3xl p-6 md:p-8 border border-red-100">
        <div className="flex items-center gap-3 mb-4">
            <ShieldAlert className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-bold text-red-900">Zonă Periculoasă</h3>
        </div>
        <p className="text-red-700/80 mb-6 text-sm max-w-2xl">
            Dacă deconectezi dispozitivul, legătura cu acest browser va fi ștearsă. Va trebui să introduci din nou codul de 6 cifre de pe ecranul jucăriei pentru a-l controla din nou.
        </p>

        {!showConfirm ? (
            <button 
                onClick={() => setShowConfirm(true)}
                className="flex items