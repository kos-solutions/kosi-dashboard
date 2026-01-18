'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient' // Asigură-te că importul e corect
import { useRouter } from 'next/navigation'

export default function PairingScreen() {
  const [pairingCode, setPairingCode] = useState('')
  const [childName, setChildName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [checkingAuth, setCheckingAuth] = useState(true)
  const router = useRouter()

  // Check authentication on mount
  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setCheckingAuth(false)
    }
    checkAuth()
  }, [router])

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Se verifică autentificarea...</p>
        </div>
      </div>
    )
  }

  async function handlePairing(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // 1. Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('Nu ești autentificat')
        setLoading(false)
        return
      }

      // 2. Find device by pairing code
      const { data: device, error: deviceError } = await supabase
        .from('devices')
        .select('*')
        .eq('pairing_code', pairingCode.toUpperCase())
        .single()

      if (deviceError || !device) {
        setError('Cod invalid sau device inexistent')
        setLoading(false)
        return
      }

      // 3. Check if already paired
      // NOTĂ: Dacă vrei să permiți repararea (re-pairing) aceluiași device, poți scoate verificarea asta.
      // Momentan o lăsăm, dar dacă testezi des, s-ar putea să te încurce.
      /* if (device.is_paired) {
        setError('Acest dispozitiv e deja conectat la un cont')
        setLoading(false)
        return
      } 
      */

      // 4. Update device name if provided
      const updateData: any = { is_paired: true }
      if (childName.trim()) {
        updateData.child_name = childName
      }

      await supabase
          .from('devices')
          .update(updateData)
          .eq('id', device.id)

      // 5. Link device to parent (Ignorăm eroarea dacă există deja link-ul)
      const { error: linkError } = await supabase
        .from('parent_devices')
        .insert({
          parent_id: user.id,
          device_id: device.id
        })
      
      // Dacă eroarea e "duplicate key", e ok, înseamnă că legătura există deja
      if (linkError && !linkError.message.includes('duplicate')) {
         console.error('Link Error:', linkError)
      }

      // ⭐⭐⭐ PASUL CRITIC ADAUGAT ⭐⭐⭐
      // Salvăm ID-ul în browser ca Dashboard-ul să știe pe cine să asculte
      localStorage.setItem('kosi_device_id', device.id);
      localStorage.setItem('kosi_child_name', childName || device.child_name || 'Kosi');

      console.log("✅ Pairing reușit! Salvat local ID:", device.id);

      // Success! Redirect to dashboard
      // Folosim window.location.href pentru a forța reîncărcarea completă a contextului
      window.location.href = '/dashboard';

    } catch (err: any) {
      console.error(err)
      setError('Eroare: ' + err.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-indigo-100 rounded-full mb-4">
            <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Conectează Dispozitivul</h1>
          <p className="text-gray-600 mt-2">Introdu codul afișat în aplicația copilului</p>
        </div>

        <form onSubmit={handlePairing} className="space-y-6">
          {/* Pairing Code Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cod de conectare
            </label>
            <input
              type="text"
              required
              placeholder="KOSI-1234"
              value={pairingCode}
              onChange={(e) => setPairingCode(e.target.value.toUpperCase())}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center text-2xl font-mono tracking-wider"
              maxLength={9}
              pattern="KOSI-\d{4}"
            />
            <p className="text-xs text-gray-500 mt-1">Format: KOSI-1234</p>
          </div>

          {/* Child Name Input (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Numele copilului (opțional)
            </label>
            <input
              type="text"
              placeholder="ex: Maria"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || pairingCode.length < 9}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Se conectează...' : 'Conectează'}
          </button>
        </form>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Cum obțin codul?</h3>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Deschide aplicația KOSI pe dispozitivul copilului</li>
            <li>Ține apăsat 3 secunde pe personajul KOSI</li>
            <li>Notează codul afișat (ex: KOSI-1234)</li>
            <li>Introdu codul aici</li>
          </ol>
        </div>
      </div>
    </div>
  )
}