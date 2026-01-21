'use client'

import { useState, useEffect } from 'react'
import { Mic, CheckCircle, ArrowRight, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { useDashboard } from '@/lib/DashboardContext'

export default function VoiceCloneCard() {
  const router = useRouter()
  const { state, t } = useDashboard() // <--- IMPORT 't'
  
  const [hasVoice, setHasVoice] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkVoiceStatus() {
      if (!state.deviceId) {
        setIsLoading(false)
        return
      }
      try {
        setIsLoading(true)
        const { data } = await supabase
          .from('device_voices')
          .select('is_active')
          .eq('device_id', state.deviceId)
          .eq('is_active', true)
          .maybeSingle()
        setHasVoice(!!data)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    checkVoiceStatus()
  }, [state.deviceId])

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-indigo-50 hover:border-indigo-200 transition-all">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-indigo-100 rounded-lg">
          <Mic className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{t.voiceCloneCard.title}</h3>
          <p className="text-sm text-gray-500">{t.voiceCloneCard.subtitle}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
        </div>
      ) : (
        <>
          {hasVoice ? (
            <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-xl mb-4 border border-green-100">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{t.voiceCloneCard.active}</span>
            </div>
          ) : (
            <div className="text-sm text-gray-600 mb-4 leading-relaxed">
              {t.voiceCloneCard.inactive}
            </div>
          )}

          <button
            onClick={() => router.push('/dashboard/voice-lab')}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${
              hasVoice 
                ? 'bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
            }`}
          >
            {hasVoice ? t.voiceCloneCard.btnManage : t.voiceCloneCard.btnStart}
            <ArrowRight className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  )
}