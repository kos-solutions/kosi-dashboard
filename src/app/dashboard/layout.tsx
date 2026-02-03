'use client'

import { useState } from "react";
import { DashboardProvider } from "@/lib/DashboardContext";
import Sidebar from "./components/Sidebar";
import { Menu, X } from "lucide-react"; // Importăm iconițele

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <DashboardProvider>
      <div className="flex flex-col md:flex-row min-h-screen bg-[#F8FAFC]">
        
        {/* Header Mobil - Apare doar pe ecran mic */}
        <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 text-white">
          <span className="font-bold tracking-tight">KOSI DASHBOARD</span>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Sidebar-ul: Acum este Overlay pe mobil, Sidebar fix pe Desktop */}
        <div className={`
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 fixed md:relative z-50 w-64 h-full 
          transition-transform duration-300 ease-in-out
          md:block flex-shrink-0
        `}>
            {/* Închidem meniul când dăm click pe un link (opțional, pasat ca prop) */}
            <Sidebar onNavigate={() => setIsMenuOpen(false)} />
        </div>

        {/* Overlay negru când meniul e deschis pe mobil */}
        {isMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden" 
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        {/* Zona principală de conținut */}
        <main className="flex-1 overflow-y-auto w-full">
          <div className="w-full max-w-7xl mx-auto px-4 py-6 md:px-8 md:py-10">
            {children}
          </div>
        </main>
      </div>
    </DashboardProvider>
  );
}