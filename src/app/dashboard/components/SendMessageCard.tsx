'use client'

import { useState } from 'react'
import { Send, MessageSquare, Loader2 } from 'lucide-react'
import { useDashboard } from '@/lib/DashboardContext'
import { sendWithDelivery, deliveryLabel, deliveryTone, DeliveryState } from '@/lib/commands'

export default function SendMessageCard() {
  const { state, t } = useDashboard()
  const [message, setMessage] = useState('')
  const [st, setSt] = useState<DeliveryState | undefined>(undefined)

  const busy = st === 'sending' || st === 'sent'

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    const text = message.trim()
    if (!text || busy) return
    sendWithDelivery(state.deviceId, 'SPEAK_MESSAGE', text, (s) => {
      setSt(s)
      if (s === 'sent') setMessage('') // golim imediat ce a plecat
    })
  }

  return (
    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden h-full">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-bold text-lg">{t.ui.smTitle}</h3>
        </div>

        <p className="text-blue-100 text-sm mb-4">
          {t.ui.smDesc}
        </p>

        <form onSubmit={handleSend} className="mt-auto">
          <div className="relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t.ui.smPlaceholder}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pr-12 text-white placeholder-blue-200 focus:outline-none focus:bg-white/20 transition-all"
            />
            <button
              type="submit"
              disabled={busy || !message.trim() || !state.deviceId}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white text-indigo-600 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </form>

        {st && (
          <p className={`mt-2 text-xs font-semibold ${st === 'delivered' ? 'text-green-200' : (st === 'timeout' || st === 'error') ? 'text-red-200' : 'text-blue-100'}`}>
            {deliveryLabel(st)}
          </p>
        )}
        {!state.deviceId && <p className="mt-2 text-xs text-blue-100">{t.ui.needDevice}</p>}
      </div>
    </div>
  )
}
