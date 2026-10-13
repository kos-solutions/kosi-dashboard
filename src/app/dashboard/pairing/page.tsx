'use client'

import { useState, useEffect } from 'react'
import { useDashboard } from '@/lib/DashboardContext'
import { parentApi } from '@/lib/parentApi'
import { supabase } from '@/lib/supabaseClient'
import { CheckCircle, Smartphone, Unlink, Loader2, AlertCircle, LogIn } from 'lucide-react'
import toast from 'react-hot-toast'

export default function PairingPage() {
  const { t, state, refreshData, disconnectDevice } = useDashboard()
  const [digits, setDigits] = useState('')
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState<string | null>(null)
  const [authReady, setAuthReady] = useState(false)
  const [msg, setMsg] = useState<{ type: 'error' | 'ok'; text: string } | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null)
      setAuthReady(true)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) =>
      setEmail(s?.user?.email ?? null),
    )
    return () => sub.subscription.unsubscribe()
  }, [])

  const handlePair = async () => {
    setMsg(null)
    if (!email) {
      setMsg({ type: 'error', text: 'Nu ești autentificat. Intră cu linkul magic (pagina de login) și revino.' })
      return
    }
    if (digits.length < 3) {
      setMsg({ type: 'error', text: 'Introdu cifrele codului de pe dispozitiv (ex: 4207).' })
      return
    }
    setLoading(true)
    try {
      const res: any = await parentApi.pair(`KOSI-${digits}`)
      if (typeof window !== 'undefined' && res?.device_id) {
        localStorage.setItem('kosi_device_id', res.device_id)
      }
      await refreshData()
      toast.success('Dispozitiv conectat!')
      setMsg({ type: 'ok', text: `Conectat la ${res?.child_name || 'dispozitiv'}.` })
      setDigits('')
    } catch (err: any) {
      const m = String(err?.message || '')
      let text = 'Nu am putut conecta dispozitivul.'
      if (/401|parinte invalida|autentificare/i.test(m)) {
        text = 'Sesiune expirată — intră din nou cu linkul magic.'
      } else if (/404|niciun device|acest cod/i.test(m)) {
        text = `Codul KOSI-${digits} nu există. Verifică cifrele de pe ecranul dispozitivului.`
      } else if (m) {
        text = m
      }
      setMsg({ type: 'error', text })
      toast.error(text)
    } finally {
      setLoading(false)
    }
  }

  // --- STAREA 1: DEJA CONECTAT ---
  if (state.deviceId) {
    return (
      <div className="max-w-md mx-auto mt-10">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-green-100 text-center space-y-6">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">{t.pairing.success}</h1>
            <p className="text-slate-500">{t.header.subtitle.replace('{child}', state.childName)}</p>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg text-sm font-mono text-slate-600">
              <Smartphone className="w-4 h-4" />
              ID: {state.deviceId.slice(0, 8)}...
            </div>
          </div>
          <button
            onClick={disconnectDevice}
            className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 py-3 rounded-xl transition-all font-medium border border-transparent hover:border-red-100"
          >
            <Unlink className="w-4 h-4" />
            Deconectează Dispozitivul
          </button>
        </div>
      </div>
    )
  }

  // --- STAREA 2: NECONECTAT (FORMULAR) ---
  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mt-10">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">{t.pairing.title}</h1>

      {/* Stare autentificare */}
      {authReady && !email && (
        <div className="mb-5 flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>
            Nu ești autentificat.{' '}
            <a href="/login" className="font-bold underline inline-flex items-center gap-1">
              <LogIn className="w-4 h-4" /> Autentifică-te
            </a>{' '}
            ca să poți conecta dispozitivul.
          </span>
        </div>
      )}
      {email && (
        <div className="mb-5 flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 p-3 rounded-xl text-sm">
          <CheckCircle className="w-4 h-4 shrink-0" /> Autentificat ca <span className="font-semibold">{email}</span>
        </div>
      )}

      <div className="space-y-6">
        <div className="bg-indigo-50 p-5 rounded-2xl space-y-3 text-sm text-slate-700 border border-indigo-100">
          <p className="flex gap-2"><span className="font-bold text-indigo-600">1.</span> {t.pairing.step1}</p>
          <p className="flex gap-2"><span className="font-bold text-indigo-600">2.</span> {t.pairing.step2}</p>
          <p className="flex gap-2"><span className="font-bold text-indigo-600">3.</span> {t.pairing.step3}</p>
        </div>

        {/* Cod: prefix KOSI- fix, tastezi doar cifrele */}
        <div>
          <label className="block text-sm font-medium text-slate-500 mb-2">Codul de pe ecranul dispozitivului</label>
          <div className="flex items-stretch rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-500 overflow-hidden">
            <span className="flex items-center px-4 bg-slate-100 text-slate-500 text-2xl font-mono select-none">KOSI-</span>
            <input
              type="text"
              inputMode="numeric"
              value={digits}
              onChange={(e) => setDigits(e.target.value.replace(/\D/g, '').slice(0, 6))}
              onKeyDown={(e) => { if (e.key === 'Enter') handlePair() }}
              placeholder="4207"
              className="flex-1 p-4 outline-none text-2xl text-center tracking-widest font-mono text-slate-800 placeholder:text-slate-300"
            />
          </div>
          <p className="mt-2 text-xs text-slate-400">Scrie doar cifrele (ex: 4207). Partea „KOSI-" e deja pusă.</p>
        </div>

        {msg && (
          <div className={
            msg.type === 'error'
              ? 'flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-sm'
              : 'flex items-start gap-2 bg-green-50 border border-green-200 text-green-700 p-3 rounded-xl text-sm'
          }>
            {msg.type === 'error' ? <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" /> : <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />}
            <span>{msg.text}</span>
          </div>
        )}

        <button
          onClick={handlePair}
          disabled={loading || !email || digits.length < 3}
          className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t.pairing.button}
        </button>
      </div>
    </div>
  )
}
