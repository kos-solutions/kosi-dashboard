'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Star, Shield, Mic, Cloud, Heart, Battery, Wifi } from 'lucide-react'
import { useState } from 'react'

export default function LandingPage() {
  const [email, setEmail] = useState('')

  const handleJoinWaitlist = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Super! Te-am adăugat pe lista de așteptare cu: ${email} (Aici vom lega Supabase mai târziu)`)
    setEmail('')
  }

  // Variabile pentru animații
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden font-sans">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🤖</span>
            <span className="text-2xl font-black tracking-tighter text-slate-900">KOSI</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors hidden md:block">
              Intră în cont
            </Link>
            <Link href="#waitlist" className="bg-indigo-600 text-white px-5 py-2.5 rounded-full font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30 text-sm">
              Pre-comandă
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-20 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-6">
              <Star className="w-3 h-3 fill-current" /> Coming Soon on Kickstarter
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] mb-6">
              Povestea de seară, <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                reinventată.
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Kosi este jucăria inteligentă care îi citește copilului tău povești educative, folosind chiar <strong>vocea ta clonată cu AI</strong>. Fără ecrane. Doar imaginație.
            </p>
            
            <form onSubmit={handleJoinWaitlist} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto lg:mx-0">
              <input 
                type="email" 
                placeholder="Adresa ta de email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-6 py-4 rounded-full border border-slate-200 bg-white focus:ring-4 focus:ring-indigo-100 outline-none text-lg"
              />
              <button type="submit" className="px-8 py-4 rounded-full bg-slate-900 text-white font-bold text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                Join Waitlist <ArrowRight className="w-5 h-5" />
              </button>
            </form>
            <p className="mt-4 text-xs text-slate-400 font-medium">Primii 500 primesc 40% reducere la lansare.</p>
          </motion.div>

          {/* PRODUCT IMAGE PLACEHOLDER - AICI PUI O POZĂ CU JUCĂRIA 3D SAU REALĂ */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
             <div className="aspect-square rounded-[3rem] bg-gradient-to-br from-indigo-100 to-white border border-indigo-50 shadow-2xl flex items-center justify-center relative overflow-hidden group">
                {/* Element decorativ sau imaginea reală */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555449372-5bb5a3424168?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
                
                {/* Reprezentare jucărie (înlocuiește cu <img>) */}
                <div className="w-64 h-80 bg-slate-900 rounded-[2rem] shadow-2xl transform rotate-[-6deg] group-hover:rotate-0 transition-all duration-500 flex flex-col items-center justify-center text-white p-6 relative z-10">
                    <div className="w-20 h-20 bg-indigo-500 rounded-full mb-4 flex items-center justify-center animate-pulse">
                        <span className="text-4xl">👀</span>
                    </div>
                    <div className="text-center">
                        <h3 className="font-bold text-xl">Kosi Toy</h3>
                        <p className="text-indigo-200 text-sm">AI Storyteller</p>
                    </div>
                    {/* Speaker Grille */}
                    <div className="mt-8 flex gap-2">
                        <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                        <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                        <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                    </div>
                </div>

                {/* Card Plutitor 1 */}
                <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="absolute top-10 right-10 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 z-20"
                >
                    <div className="p-2 bg-green-100 rounded-lg text-green-600"><Mic className="w-5 h-5" /></div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase">Voce</p>
                        <p className="font-bold text-slate-800">Tati (Cloned)</p>
                    </div>
                </motion.div>

                 {/* Card Plutitor 2 */}
                 <motion.div 
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 5, delay: 1 }}
                    className="absolute bottom-10 left-10 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 z-20"
                >
                    <div className="p-2 bg-orange-100 rounded-lg text-orange-600"><Battery className="w-5 h-5" /></div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase">Baterie</p>
                        <p className="font-bold text-slate-800">2 Săptămâni</p>
                    </div>
                </motion.div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* --- PROBLEM VS SOLUTION --- */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">De ce am creat Kosi?</h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">Suntem părinți. Știm cum e să vii obosit de la muncă și copilul să ceară "încă o poveste".</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {[
                    { icon: Shield, title: "100% Sigur", desc: "Fără microfoane ascunse, fără date vândute. Totul rămâne în familie." },
                    { icon: Heart, title: "Conexiune Emoțională", desc: "Copilul aude vocea TA chiar și când ești plecat în delegație." },
                    { icon: Cloud, title: "Povești Infinite", desc: "AI-ul generează aventuri noi în fiecare seară. Adio plictiseală!" },
                ].map((item, i) => (
                    <motion.div 
                        whileHover={{ y: -5 }}
                        key={i} 
                        className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all"
                    >
                        <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                            <item.icon className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                        <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* --- HOW IT WORKS (THE MAGIC) --- */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
                <div className="order-2 md:order-1 relative">
                     {/* Placeholder Phone Interface */}
                     <div className="bg-slate-900 rounded-[3rem] p-4 max-w-sm mx-auto shadow-2xl border-4 border-slate-800">
                        <div className="bg-white rounded-[2.5rem] overflow-hidden h-[600px] relative">
                             {/* Screen content simulated */}
                             <div className="bg-indigo-600 h-1/2 p-8 text-white flex flex-col justify-end">
                                <h3 className="text-2xl font-bold mb-2">Voice Lab</h3>
                                <p className="opacity-80">Înregistrează 60 secunde...</p>
                             </div>
                             <div className="p-6 space-y-4">
                                <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                                <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                                <div className="mt-8 p-4 bg-green-50 text-green-700 rounded-xl font-bold text-center">
                                    Voce Clonată cu Succes!
                                </div>
                             </div>
                        </div>
                     </div>
                </div>
                <div className="order-1 md:order-2">
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">Vocea ta.<br/>Poveștile lor.</h2>
                    <div className="space-y-8">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">1</div>
                            <div>
                                <h4 className="text-xl font-bold text-slate-900">Tu înregistrezi un minut</h4>
                                <p className="text-slate-600">Citești un text scurt în aplicație. AI-ul nostru îți învață tonul și intonația.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">2</div>
                            <div>
                                <h4 className="text-xl font-bold text-slate-900">Kosi generează povestea</h4>
                                <p className="text-slate-600">Alegi tema (ex: dinozauri în spațiu) și Kosi creează o poveste educativă.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">3</div>
                            <div>
                                <h4 className="text-xl font-bold text-slate-900">Magia se întâmplă</h4>
                                <p className="text-slate-600">Jucăria citește povestea copilului seara, cu VOCEA TA, chiar dacă tu ești în altă cameră sau la birou.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- CTA / FOOTER --- */}
      <section id="waitlist" className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-8">Fii primul care îl aduce pe Kosi acasă.</h2>
            <p className="text-xl text-slate-300 mb-12">Lansăm campania de crowdfunding în curând. Înscrie-te pentru a prinde oferta Early Bird (40% reducere).</p>
            
            <form onSubmit={handleJoinWaitlist} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Email-ul tău" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-6 py-4 rounded-full border border-slate-700 bg-slate-800 text-white focus:ring-2 focus:ring-indigo-500 outline-none text-lg"
              />
              <button type="submit" className="px-8 py-4 rounded-full bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-500 transition-all">
                Mă înscriu
              </button>
            </form>
            <p className="mt-8 text-sm text-slate-500">Nu trimitem spam. Doar vești bune.</p>
        </div>
      </section>

      <footer className="bg-slate-950 py-12 text-slate-500 text-sm border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
                <span className="font-bold text-white text-lg">KOSI</span> © 2026. Made with ❤️ in Romania/Europe.
            </div>
            <div className="flex gap-6">
                <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                <Link href="mailto:hello@kosiapp.com" className="hover:text-white transition-colors">Contact</Link>
            </div>
        </div>
      </footer>

    </div>
  )
}