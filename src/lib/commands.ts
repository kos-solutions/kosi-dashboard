'use client'
// Trimite o comanda si urmareste livrarea pana cand telefonul o preia
// (serverul seteaza consumed_at). Da feedback real in loc de spinner mut.
import { parentApi } from './parentApi'

export type DeliveryState = 'sending' | 'sent' | 'delivered' | 'timeout' | 'error'

export async function sendWithDelivery(
  deviceId: string | null,
  type: string,
  payload: string | null,
  onState: (s: DeliveryState) => void,
): Promise<void> {
  if (!deviceId) { onState('error'); return }
  onState('sending')
  try {
    const res: any = await parentApi.sendCommand(deviceId, type, payload ?? undefined)
    const id: number | undefined = res?.id
    onState('sent')
    if (!id) return
    const deadline = Date.now() + 14000
    while (Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, 1300))
      const statuses: any[] = await parentApi.commandStatus(deviceId, [id])
      if (statuses.find((x) => x.id === id)?.consumed_at) { onState('delivered'); return }
    }
    onState('timeout')
  } catch {
    onState('error')
  }
}

export function deliveryLabel(s: DeliveryState): string {
  switch (s) {
    case 'sending': return 'Se trimite…'
    case 'sent': return 'Trimis, se livrează…'
    case 'delivered': return 'Livrat ✓'
    case 'timeout': return 'Nelivrat (dispozitiv offline?)'
    case 'error': return 'Eroare'
  }
}

export function deliveryTone(s: DeliveryState): string {
  if (s === 'delivered') return 'text-green-600'
  if (s === 'timeout' || s === 'error') return 'text-red-500'
  return 'text-slate-400'
}
