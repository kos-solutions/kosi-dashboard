'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Mic2, 
  Settings, 
  Link as LinkIcon, 
  LogOut 
} from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

export default function Sidebar() {
  const pathname = usePathname()

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Voice Lab', href: '/dashboard/voice-lab', icon: Mic2 },
    { name: 'Pairing', href: '/pairing', icon: LinkIcon },
    { name: 'Setări', href: '/dashboard/settings', icon: Settings },
  ]

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen sticky top-0 border-r border-slate-800">
      {/* Logo Unic - Apare doar aici */}
      <div className="p-8">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-indigo-500/20">
            <span className="text-2xl">🤖</span>
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">KOSI</span>
        </Link>
      </div>

      {/* Meniu Navigație */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
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

      {/* Logout button la baza sidebar-ului */}
      <div className="p-4 mt-auto border-t border-slate-800">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Ieșire cont</span>
        </button>
      </div>
    </aside>
  )
}