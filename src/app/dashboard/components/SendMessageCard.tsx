'use client'

import { useState } from 'react'
import { Send, MessageSquare, Loader2 } from 'lucide-react'
import { useDashboard } from '@/lib/DashboardContext'

export default function SendMessageCard() {
  const { sendCommand, t } = useDashboard()
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setIsSending(true)
    try {
      // Trimitem comanda SPEAK_MESSAGE către Android
      await sendCommand('SPEAK_MESSAGE', { text: message })
      setMessage('') // Golim câmpul după trimitere
    } catch (error) {
      console.error("Eroare trimitere mesaj:", error)
    } finally {
      // Mic delay ca să se vadă animația
      setTimeout(() => setIsSending(false), 500)
    }
  }

  return (
    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden h-full">
      {/* Cerc decorativ */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-bold text-lg">Trimite Mesaj Vocal</h3>
        </div>

        <p className="text-blue-100 text-sm mb-4">
          Scrie un mesaj aici și Kosi îl va rosti cu voce tare pe dispozitiv.
        </p>

        <form onSubmit={handleSend} className="mt-auto">
          <div className="relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ex: Hai la masă!..."
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pr-12 text-white placeholder-blue-200 focus:outline-none focus:bg-white/20 transition-all"
            />
            <button
              type="submit"
              disabled={isSending || !message.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white text-indigo-600 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}