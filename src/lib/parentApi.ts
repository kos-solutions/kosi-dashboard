'use client'
// Toate operatiile dashboard-ului trec prin Edge Functions autentificate cu sesiunea
// parintelui (JWT atasat automat de functions.invoke). Proiectul nou respinge anon,
// deci NU mai citim/scriem direct in tabele.
import { supabase } from './supabaseClient'

async function invoke(fn: string, body: Record<string, unknown>) {
  const { data, error } = await supabase.functions.invoke(fn, { body })
  if (error) {
    // Incercam sa scoatem mesajul real din corpul functiei (altfel e generic).
    let detail = error.message
    try {
      const ctx = (error as { context?: Response }).context
      if (ctx && typeof ctx.json === 'function') {
        const j = await ctx.json()
        if (j?.error) detail = j.error
      }
    } catch { /* lasam mesajul generic */ }
    throw new Error(detail)
  }
  return data
}

export interface DeviceRow {
  id: string
  child_name: string | null
  pairing_code: string
  language: string
  is_paired: boolean
  coins: number
  created_at: string
  session: {
    status: string
    last_seen: string
    battery_level: number | null
    wifi_status: string | null
  } | null
}

export const parentApi = {
  pair: (code: string) => invoke('parent', { action: 'pair', code }),
  devices: () => invoke('parent', { action: 'devices' }).then((d) => (d?.devices ?? []) as DeviceRow[]),
  overview: (preferDeviceId?: string) =>
    invoke('parent', { action: 'overview', preferDeviceId }),
  activity: (deviceId: string, opts: { limit?: number; sinceDays?: number } = {}) =>
    invoke('parent', { action: 'activity', deviceId, ...opts }).then((d) => d?.activities ?? []),
  voices: (deviceId: string) =>
    invoke('parent', { action: 'voices', deviceId }).then((d) => d?.voices ?? []),
  setChildName: (deviceId: string, name: string) =>
    invoke('parent', { action: 'setChildName', deviceId, name }),
  sendCommand: (deviceId: string, commandType: string, payload?: unknown) =>
    invoke('parent', { action: 'sendCommand', deviceId, commandType, payload }),
  commandStatus: (deviceId: string, ids: number[]) =>
    invoke('parent', { action: 'commandStatus', deviceId, ids }).then((d) => d?.statuses ?? []),
  deleteData: (deviceId: string) => invoke('parent', { action: 'deleteData', deviceId }),
  unpair: (deviceId: string) => invoke('parent', { action: 'unpair', deviceId }),
  cloneVoice: (deviceId: string, audioBase64: string, sampleDuration?: number) =>
    invoke('clone-voice', { device_id: deviceId, audio_base64: audioBase64, sample_duration: sampleDuration }),
  deleteVoice: (deviceId: string, voiceId: string) =>
    invoke('clone-voice', { action: 'delete', device_id: deviceId, voice_id: voiceId }),
}
