'use client'

import Link from 'next/link'
import { useDashboard } from '@/lib/DashboardContext'
import StatusCard from './components/StatusCard'
import ActivitySummary from './components/ActivitySummary'
import VoiceCloneCard from './components/VoiceCloneCard'
import SendMessageCard from './components/SendMessageCard'
import QuickControls from './components/QuickControls'
import WeeklyReport from './components/WeeklyReport'
import { Sparkles, Palette, Link as LinkIcon, Smartphone, LogIn } from 'lucide-react'
import { activityMeta, isMeaningful, relativeTime } from '@/lib/activity'

export default function DashboardPage() {
  const { state, t, loaded, authed } = useDashboard()
  const { activities, drawings, childName, pairingCode } = state

  // Prima incarcare: schelet, nu flash de "neconectat".
  if (!loaded) return <DashboardSkeleton />
  if (!authed) return <LoginPrompt />

  // --- STARE: niciun dispozitiv conectat ---
  if (!state.deviceId) {
    return (
      <div className="max-w-md mx-auto mt-16 text-center">
        <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Smartphone className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">{t.ui.noDeviceTitle}</h1>
          <p className="text-slate-500 mb-8">
            {t.ui.noDeviceDesc}
          </p>
          <Link
            href="/dashboard/pairing"
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
          >
            <LinkIcon className="w-5 h-5" />
            {t.ui.connectDevice}
          </Link>
        </div>
      </div>
    )
  }

  const feed = activities.filter((a) => isMeaningful(a.event_type))

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto pb-20">
      {/* Header secțiune */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{t.header.hello}</h1>
          <p className="text-slate-500 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{t.header.subtitle.replace('{child}', childName)}</span>
            <span className="inline-flex items-center gap-1 text-xs text-slate-400">
              {t.ui.deviceCode}
              <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{pairingCode}</span>
            </span>
          </p>
        </div>
      </div>

      {/* Grid principal: Status + Controale + Mesaje */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="h-full"><StatusCard /></div>
        <div className="h-full"><QuickControls /></div>
        <div className="h-full"><SendMessageCard /></div>
      </div>

      {/* Statistici scurte */}
      <ActivitySummary />

      {/* Raport saptamanal */}
      <WeeklyReport />

      {/* Galerie + activitate */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Galerie desene */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2">
            <Palette className="text-indigo-500" />
            <h2 className="text-xl font-bold text-slate-800">{t.gallery.title}</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {drawings.length > 0 ? drawings.map((drawing) => (
              <div key={drawing.id} className="aspect-square bg-white rounded-3xl overflow-hidden border-4 border-white shadow-sm hover:shadow-lg transition-all duration-300 group relative">
                <img src={drawing.image_url} alt="Desen Kosi" className="object-cover w-full h-full" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <p className="text-white text-xs font-bold">{new Date(drawing.created_at).toLocaleDateString('ro-RO')}</p>
                </div>
              </div>
            )) : (
              <div className="col-span-full h-48 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                <Sparkles size={32} className="mb-2 opacity-20" />
                <p>{t.gallery.noDrawings}</p>
              </div>
            )}
          </div>
        </div>

        {/* Voice Lab + activitate recentă */}
        <div className="space-y-6">
          <VoiceCloneCard />

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-[450px] flex flex-col">
            <h3 className="font-bold text-lg text-slate-800 mb-4">{t.activity.recent}</h3>
            <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
              {feed.length > 0 ? feed.map((act) => {
                const meta = activityMeta(act.event_type)
                return (
                  <div key={act.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                    <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${meta.bg} ${meta.color}`}>
                      <meta.Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">{meta.label}</p>
                      <p className="text-xs text-slate-400">{relativeTime(act.created_at)}</p>
                    </div>
                  </div>
                )
              }) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <Sparkles size={28} className="mb-2 opacity-20" />
                  <p className="text-sm">{t.ui.noneToday}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto animate-pulse">
      <div className="h-9 w-64 bg-slate-200 rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[0, 1, 2].map((i) => <div key={i} className="h-56 bg-slate-100 rounded-3xl border border-slate-200" />)}
      </div>
      <div className="h-32 bg-slate-100 rounded-3xl border border-slate-200" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 h-64 bg-slate-100 rounded-3xl border border-slate-200" />
        <div className="h-64 bg-slate-100 rounded-3xl border border-slate-200" />
      </div>
    </div>
  )
}

function LoginPrompt() {
  const { t } = useDashboard()
  return (
    <div className="max-w-md mx-auto mt-16 text-center">
      <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <LogIn className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">{t.ui.authTitle}</h1>
        <p className="text-slate-500 mb-8">{t.ui.authDesc}</p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
        >
          <LogIn className="w-5 h-5" />
          {t.ui.goToLogin}
        </Link>
      </div>
    </div>
  )
}
