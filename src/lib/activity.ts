import { BookOpen, Palette, Gamepad2, MessageSquare, Moon, Activity, type LucideIcon } from 'lucide-react'

export type ActivityMeta = { label: string; Icon: LucideIcon; color: string; bg: string }

const MAP: Record<string, ActivityMeta> = {
  story_played: { label: 'Poveste', Icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-100' },
  STORY: { label: 'Poveste', Icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-100' },
  DRAW: { label: 'Desen nou', Icon: Palette, color: 'text-pink-500', bg: 'bg-pink-100' },
  GAME: { label: 'Joc', Icon: Gamepad2, color: 'text-orange-500', bg: 'bg-orange-100' },
  SPEAK_MESSAGE: { label: 'Mesaj vocal (părinte)', Icon: MessageSquare, color: 'text-indigo-500', bg: 'bg-indigo-100' },
  MEDITATION: { label: 'Relaxare', Icon: Moon, color: 'text-violet-500', bg: 'bg-violet-100' },
  CALM: { label: 'Relaxare', Icon: Moon, color: 'text-violet-500', bg: 'bg-violet-100' },
}

// Evenimente tehnice care nu au ce căuta în feed-ul părintelui.
const HIDDEN = new Set(['DRAW_START', 'heartbeat', 'HEARTBEAT', 'session', 'SESSION', 'register', 'REGISTER', 'log'])

export function isMeaningful(type: string): boolean {
  return !HIDDEN.has(type)
}

export function activityMeta(type: string): ActivityMeta {
  return MAP[type] ?? {
    label: type.replace(/_/g, ' ').toLowerCase().replace(/^./, (c) => c.toUpperCase()),
    Icon: Activity,
    color: 'text-slate-400',
    bg: 'bg-slate-100',
  }
}

export function relativeTime(iso: string): string {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'chiar acum'
  if (m < 60) return `acum ${m} min`
  const h = Math.floor(m / 60)
  if (h < 24) return `acum ${h} h`
  const d = Math.floor(h / 24)
  return d === 1 ? 'ieri' : `acum ${d} zile`
}
