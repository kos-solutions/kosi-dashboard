'use client'
import { useDashboard } from '@/lib/DashboardContext'

export default function SettingsPage() {
  const { t, state } = useDashboard()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">{t.settings.title}</h1>

      {/* Card Nume Copil */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">{t.settings.childName}</label>
        <div className="flex gap-4">
            <input type="text" defaultValue={state.childName} className="flex-1 p-3 rounded-xl border border-slate-200" />
            <button className="bg-slate-900 text-white px-6 rounded-xl font-medium hover:bg-slate-800">{t.settings.save}</button>
        </div>
      </div>

      {/* Card Device Info */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
         <h3 className="font-bold text-lg mb-4">{t.settings.device}</h3>
         <p className="text-slate-600">{state.deviceId ? `ID: ${state.deviceId}` : 'Not connected'}</p>
      </div>
    </div>
  )
}