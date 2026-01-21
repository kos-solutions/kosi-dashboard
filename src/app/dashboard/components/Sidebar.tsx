'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Mic2, Settings, Link as LinkIcon, LogOut } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useDashboard } from '@/lib/DashboardContext'

// Definim lista de limbi pentru a le mapa ușor
const LANGUAGES = [
  { code: 'en', flag: '🇬🇧' },
  { code: 'ro', flag: '🇷🇴' },
  { code: 'tr', flag: '🇹🇷' },
  { code: 'sr', flag: '🇷🇸' },
  { code: 'hr', flag: '🇭🇷' },
  { code: 'bg', flag: '🇧🇬' },
  { code: 'el', flag: '🇬🇷' },
  { code: 'sq', flag: '🇦🇱' },
] as const;

export default function Sidebar() {
  const pathname = usePathname()
  const { t, language, setLanguage } = useDashboard()

  const menuItems = [
    { name: t.sidebar.dashboard, href: '/dashboard', icon: LayoutDashboard },
    { name: t.sidebar.voiceLab, href: '/dashboard/voice-lab', icon: Mic2 },
    { name: t.sidebar.pairing, href: '/dashboard/pairing', icon: LinkIcon },
    { name: t.sidebar.settings, href: '/dashboard/settings', icon: Settings },
  ]

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen sticky top-0 border-r border-slate-800">
      <div className="p-8 pb-4">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-indigo-500/20">
            <span className="text-2xl">🤖</span>
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">KOSI</span>
        </Link>
      </div>

      {/* --- GRID SELECTOR LIMBĂ --- */}
      <div className="px-6 mb-6">
        <p className="text-[10px] uppercase text-slate-500 font-bold mb-2 px-2">Language / Limbă</p>
        <div className="grid grid-cols-4 gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`
                flex items-center justify-center p-1.5 rounded-lg transition-all hover:scale-110
                ${language === lang.code ? 'bg-indigo-600 shadow-md ring-1 ring-white/20' : 'bg-slate-800 hover:bg-slate-700 text-slate-400'}
              `}
              title={lang.code.toUpperCase()}
            >
              <span className="text-lg leading-none">{lang.flag}</span>
            </button>
          ))}
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'group-hover:text-indigo-400'}`} />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-slate-800">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">{t.sidebar.signOut}</span>
        </button>
      </div>
    </aside>
  )
}