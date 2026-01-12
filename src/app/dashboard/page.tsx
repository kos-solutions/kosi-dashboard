'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

// Componentele tale originale
import StatusCard from './components/StatusCard'
import QuickControls from './components/QuickControls'
import ActivitySummary from './components/ActivitySummary'
import WeeklyReport from './components/WeeklyReport'
import LiveActivityFeed from './components/LiveActivityFeed'
import StoryHistory from './components/StoryHistory'

// ⭐ Noua componentă pentru Voce
import VoiceCloneCard from './components/VoiceCloneCard'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Verificare autentificare
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Se încarcă...</p>
        </div>
      </div>
    )
  }

  // DashboardProvider a fost mutat în layout.tsx pentru a fi disponibil global
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">KOSI Dashboard</h1>
            <p className="text-gray-600 mt-1">Bun venit, {user?.email}</p>
          </div>
          
          {/* Buton Pairing */}
          <button
            onClick={() => router.push('/pairing')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Conectează Dispozitiv
          </button>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* Coloana 1 - Status, Voce & Control */}
        <div className="space-y-6">
          <StatusCard />
          <VoiceCloneCard /> {/* ⭐ Componenta pentru clonare voce */}
          <QuickControls />
        </div>

        {/* Coloana 2 - Activitate & Feed */}
        <div className="space-y-6">
          <ActivitySummary />
          <LiveActivityFeed />
        </div>

        {/* Coloana 3 - Rapoarte & Istoric */}
        <div className="space-y-6 lg:col-span-2 xl:col-span-1">
          <WeeklyReport />
          <StoryHistory />
        </div>
      </div>
    </div>
  )
}