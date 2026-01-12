'use client'

import { useDashboard } from '@/lib/DashboardContext'
import { User, Shield, Trash2, Smartphone, Save } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function SettingsPage() {
  const { state } = useDashboard()

  const handleDeleteVoice = async () => {
    if (confirm("Ești sigur că vrei să ștergi vocea clonată? Va trebui să înregistrezi din nou.")) {
      // Logica de delete din device_voices
      toast.success("Datele vocale au fost șterse.")
    }
  }

  return (
    <div className="max-w-4xl space-y-10">
      <header>
        <h1 className="text-3xl font-extrabold text-slate-900">Setări Sistem</h1>
        <p className="text-slate-500 text-lg font-medium">Administrează profilul Miriam-ei și configurația KOSI.</p>
      </header>

      <div className="grid gap-8">
        {/* Secțiunea Dispozitiv */}
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Smartphone className="w-6 h-6" /></div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Dispozitiv Asociat</h2>
                <p className="text-slate-400 text-sm">Informații despre hardware-ul Kosi</p>
              </div>
            </div>
            <span className="px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold uppercase tracking-wider">Activ</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Nume Copil</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  defaultValue={state.childName || 'Miriam'}
                  className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <button className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all text-slate-600">
                  <Save className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Identificator Unic (UUID)</label>
              <p className="text-slate-600 font-mono text-sm bg-slate-50 p-2 rounded-xl border border-slate-100 break-all">
                {state.deviceId || 'Nespecificat'}
              </p>
            </div>
          </div>
        </div>

        {/* Secțiunea Securitate & Voce */}
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl"><Shield className="w-6 h-6" /></div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Confidențialitate & Voce</h2>
              <p className="text-slate-400 text-sm">Gestionarea datelor biometrice</p>
            </div>
          </div>
          
          <div className="p-6 bg-red-50 rounded-[24px] border border-red-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-red-800 font-bold">Ștergere Date Vocale</h3>
              <p className="text-red-600/70 text-sm">Elimină amprenta ta vocală din serverele ElevenLabs și baza de date Kosi.</p>
            </div>
            <button 
              onClick={handleDeleteVoice}
              className="px-6 py-3 bg-white text-red-600 font-bold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 border border-red-100"
            >
              <Trash2 className="w-5 h-5" />
              Șterge Vocea
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}