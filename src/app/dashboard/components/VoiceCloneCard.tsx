'use client'
import { useState, useEffect } from 'react'
import { Mic, Wand2, CheckCircle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { useDashboard } from '@/lib/DashboardContext'

export default function VoiceCloneCard() {
  const router = useRouter()
  const { state, t } = useDashboard()
  const [hasVoice, setHasVoice] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkVoice() {
      if (!state.deviceId) return;
      try {
        // Verificăm dacă există o voce activă pentru acest device
        const { data } = await supabase
            .from('device_voices') // Asigură-te că tabela există
            .select('id')
            .eq('device_id', state.deviceId)
            .maybeSingle();
        
        setHasVoice(!!data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    checkVoice();
  }, [state.deviceId]);

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full translate-x-10 -translate-y-10"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
            <Mic className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-bold text-lg">{t.voiceCloneCard.title}</h3>
        </div>
        
        <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
          {hasVoice ? t.voiceCloneCard.active : t.voiceCloneCard.subtitle}
        </p>

        {isLoading ? (
            <div className="w-full h-10 flex items-center justify-center">
                <Loader2 className="animate-spin text-white opacity-50" />
            </div>
        ) : (
            <button 
            onClick={() => router.push('/dashboard/voice-lab')}
            className={`w-full py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 ${
                hasVoice ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-white text-indigo-600 hover:bg-indigo-50'
            }`}>
            {hasVoice ? <CheckCircle size={16} /> : <Wand2 size={16} />}
            {hasVoice ? "Voce Activă" : t.voiceCloneCard.btnStart}
            </button>
        )}
      </div>
    </div>
  )
}