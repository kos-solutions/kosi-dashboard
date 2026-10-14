'use client'

import { Mic, Square, Moon, Power } from 'lucide-react'
import { useDashboard } from '@/lib/DashboardContext'
import { useState } from 'react'
import { sendWithDelivery, deliveryLabel, deliveryTone, DeliveryState } from '@/lib/commands'

export default function QuickControls() {
  const { state, t } = useDashboard()
  const [st, setSt] = useState<Record<string, DeliveryState | undefined>>({})

  const busy = (key: string) => st[key] === 'sending' || st[key] === 'sent'

  const run = (key: string, command: string, text: string | null = null) => {
    if (busy(key)) return
    sendWithDelivery(state.deviceId, command, text, (s) => setSt((p) => ({ ...p, [key]: s })))
  }

  const btn = (border: string) =>
    `flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border transition-all active:scale-95 h-full bg-white hover:bg-gray-50 ${border} border-gray-100 disabled:opacity-60 disabled:cursor-wait`

  const Status = ({ k }: { k: string }) =>
    st[k] ? <span className={`mt-1 text-[10px] font-semibold ${deliveryTone(st[k]!)}`}>{deliveryLabel(st[k]!)}</span> : null

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm h-full flex flex-col justify-center">
      <h3 className="text-lg font-bold text-slate-800 mb-4">{t.ui.quickTitle}</h3>

      <div className="grid grid-cols-2 gap-3 h-full">
        <button disabled={busy('STOP_AUDIO')} onClick={() => run('STOP_AUDIO', 'STOP_AUDIO')} className={btn('hover:border-amber-200')}>
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mb-2"><Square className="w-5 h-5 fill-current" /></div>
          <span className="text-xs font-bold text-slate-600">{t.ui.pauseAudio}</span>
          <Status k="STOP_AUDIO" />
        </button>

        <button disabled={busy('SLEEP_MODE')} onClick={() => run('SLEEP_MODE', 'SLEEP_MODE')} className={btn('hover:border-indigo-200')}>
          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center mb-2"><Moon className="w-5 h-5" /></div>
          <span className="text-xs font-bold text-slate-600">{t.ui.sleepMode}</span>
          <Status k="SLEEP_MODE" />
        </button>

        <button disabled={busy('SALUT')} onClick={() => run('SALUT', 'SPEAK_MESSAGE', 'Te iubesc!')} className={btn('hover:border-pink-200')}>
          <div className="w-10 h-10 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center mb-2"><Mic className="w-5 h-5" /></div>
          <span className="text-xs font-bold text-slate-600">{t.ui.quickGreet}</span>
          <Status k="SALUT" />
        </button>

        <button disabled={busy('EXIT_APP')} onClick={() => run('EXIT_APP', 'EXIT_APP')} className={btn('hover:border-red-200')}>
          <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-2"><Power className="w-5 h-5" /></div>
          <span className="text-xs font-bold text-slate-600">{t.ui.closeApp}</span>
          <Status k="EXIT_APP" />
        </button>
      </div>

      {!state.deviceId && <p className="mt-3 text-xs text-amber-600">{t.ui.needDevicePairing}</p>}
    </div>
  )
}
