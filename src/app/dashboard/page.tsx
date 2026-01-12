'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { Sparkles } from 'lucide-react'

import StatusCard from './components/StatusCard'
import QuickControls from './components/QuickControls'
import ActivitySummary from './components/ActivitySummary'
import WeeklyReport from './components/WeeklyReport'
import LiveActivityFeed from './components/LiveActivityFeed'
import StoryHistory from './components/StoryHistory'
import VoiceCloneCard from './components/VoiceCloneCard'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data, error }) => {
      if (error || !data.user) {
        router.push('/login')
        return
      }
      setUser(data.user)
      setLoading(false)
    })
  }, [router])

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          <p className="text-slate-500 font-medium animate-pulse">Se pregătește magia...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header - Salut personalizat fără repetiția numelui aplicației */}
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-indigo-600 font-bold tracking-wide uppercase text-xs">
          <Sparkles className="w-4 h-4" />
          Centru de Comandă
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Bună, {user?.email?.split('@')[0]}!
        </h1>
        <p className="text-slate-500 text-lg">Miriam te așteaptă cu o poveste nouă astăzi.</p>
      </header>

      {/* Dashboard Grid principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Coloana de Stare & Control (Stânga) */}
        <div className="lg:col-span-4 space-y-8">
          <StatusCard />
          <VoiceCloneCard />
          <QuickControls />
        </div>

        {/* Coloana de Activitate Live (Mijloc) */}
        <div className="lg:col-span-5 space-y-8">
          <LiveActivityFeed />
          <ActivitySummary />
        </div>

        {/* Coloana de Rapoarte & Istoric (Dreapta) */}
        <div className="lg:col-span-3 space-y-8">
          <WeeklyReport />
          <StoryHistory />
        </div>
      </div>
    </div>
  )
}