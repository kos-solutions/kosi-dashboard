'use client'

import { useState } from 'react'
import { useDashboard } from '@/lib/DashboardContext'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Trash2, AlertTriangle, Save, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { t, state, refreshData } = useDashboard()
  const supabase = createClientComponentClient()
  
  const [loadingSave, setLoadingSave] = useState(false)
  const [loadingDelete, setLoadingDelete] = useState(false)
  const [childName, setChildName] = useState(state.childName)

  // 1. Salvare Nume Copil
  const handleSaveName = async () => {
    if (!state.deviceId) return;
    setLoadingSave(true)
    try {
        const { error } = await supabase
            .from('devices')
            .update({ child_name: childName })
            .eq('id', state.deviceId)
        
        if (error) throw error;
        toast.success(t.settings.save + " OK!");
        refreshData(); // Actualizăm contextul
    } catch (e) {
        toast.error("Eroare la salvare");
    } finally {
        setLoadingSave(false);
    }
  }

  // 2. Ștergere Date (Ceea ce lipsea)
  const handleDeleteData = async () => {
    if (!state.deviceId) return;
    
    // Confirmare simplă browser (sau poți face un modal fancy)
    if (!window.confirm(t.settings.confirm || "Are you sure?")) return;

    setLoadingDelete(true)
    try {
        // Ștergem tot din activity_log pentru acest device
        const { error } = await supabase
            .from('activity_log')
            .delete()
            .eq('device_id', state.deviceId)

        // Opțional: Dacă ai și alte tabele (ex: drawings), șterge și de acolo:
        // await supabase.from('drawings').delete().eq('device_id', state.deviceId)

        if (error) throw error;

        toast.success(t.settings.deleted || "Deleted!");
        refreshData();
    } catch (e) {
        console.error(e);
        toast.error("Eroare la ștergere");
    } finally {
        setLoadingDelete(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-slate-800">{t.settings.title}</h1>

      {/* Card Nume Copil */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
            {t.settings.childName}
        </label>
        <div className="flex gap-3">
            <input 
                type="text" 
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                className="flex-1 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
            />
            <button 
                onClick={handleSaveName}
                disabled={loadingSave}
                className="bg-indigo-600 text-white px-6 rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
            >
                {loadingSave ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {t.settings.save}
            </button>
        </div>
      </div>

      {/* Card Device Info */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
         <h3 className="font-bold text-lg mb-4 text-slate-800">{t.settings.device}</h3>
         <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-slate-600 text-sm break-all">
            {state.deviceId || 'Not connected'}
         </div>
      </div>

      {/* ⚠️ ZONA DE PERICOL (Reintrodusă) */}
      <div className="bg-red-50 p-6 rounded-3xl border border-red-100 shadow-sm">
         <h3 className="font-bold text-lg mb-2 text-red-700 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            {t.settings.dangerZone || "Danger Zone"}
         </h3>
         <p className="text-sm text-red-600/80 mb-6">
            {t.settings.deleteWarning || "This action removes all history."}
         </p>

         <button 
            onClick={handleDeleteData}
            disabled={loadingDelete || !state.deviceId}
            className="w-full bg-white border border-red-200 text-red-600 py-3 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
         >
            {loadingDelete ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            {t.settings.deleteData || "Delete Data"}
         </button>
      </div>
    </div>
  )
}