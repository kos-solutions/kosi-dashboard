'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Mic2, Settings, Link as LinkIcon, LogOut } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useDashboard } from '@/lib/DashboardContext'

// Definim lista de limbi (păstrată din originalul tău)
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

interface SidebarProps {
  onNavigate?: () => void;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname()
  const { t, language, setLanguage } = useDashboard()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const menuItems = [
    { name: t.sidebar.dashboard, href: '/dashboard', icon: LayoutDashboard },
    { name: t.sidebar.voiceLab, href: '/dashboard/voice-lab', icon: Mic2 },
    { name: t.sidebar.pairing, href: '/dashboard/pairing', icon: LinkIcon },
    { name: t.sidebar.settings, href: '/dashboard/settings', icon: Settings },
  ]

  return (
    <aside className="flex flex-col w-64 h-full min-h-screen bg-slate-900 text-slate-300 shadow-xl">
      <div className="p-6">
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white font-bold text-xl">K</span>
          </div>
          <span className="text-white font-bold text-xl tracking-tight">Kosi Admin</span>
        </div>

        {/* Selector Limbă - Restaurat complet */}
        <div className="flex flex-wrap items-center gap-2 p-1 bg-slate-800/50 rounded-2xl mb-8">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code as any)}
              className={`
                flex-1 flex items-center justify-center py-2 rounded-xl transition-all duration-200
                ${language === lang.code 
                  ? 'bg-indigo-600 text-white shadow-lg ring-2 ring-white/20' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-400'}
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
              onClick={() => onNavigate?.()} 
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
          className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  )
}