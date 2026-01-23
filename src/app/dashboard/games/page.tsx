'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Gift, Lock, Coins, Gamepad2, Sparkles } from 'lucide-react'
import confetti from 'canvas-confetti' // Dacă nu ai asta, dă npm install canvas-confetti sau ștergem linia

export default function GamesPage() {
  const [coins, setCoins] = useState(1250) // Simulare monede
  const [chestOpen, setChestOpen] = useState(false)

  const handleOpenChest = () => {
    if (coins < 100) return;
    setCoins(c => c - 100);
    setChestOpen(true);
    
    // Efect de confetti (dacă instalezi pachetul, altfel șterge linia)
    // confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    
    setTimeout(() => setChestOpen(false), 3000);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* HEADER CU STATISTICI */}
      <div className="bg-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20 -mr-16 -mt-16"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                    Zona de Distracție <Gamepad2 className="w-8 h-8 text-yellow-400" />
                </h1>
                <p className="text-indigo-200">Joacă-te, câștigă puncte și deblochează surprize!</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 flex items-center gap-4 border border-white/10">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/50">
                    <Coins className="w-6 h-6 text-yellow-900" />
                </div>
                <div>
                    <div className="text-xs font-bold text-indigo-200 uppercase">Kosi Coins</div>
                    <div className="text-2xl font-black">{coins}</div>
                </div>
            </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* ZONA 1: DAILY CHEST / REWARDS */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center justify-center gap-2">
                <Gift className="w-5 h-5 text-purple-500" /> Cufărul Magic
            </h2>

            <div className="bg-purple-50 rounded-2xl p-8 mb-6 relative group">
                <motion.div 
                    animate={chestOpen ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
                    onClick={handleOpenChest}
                    className="cursor-pointer"
                >
                    <div className="text-6xl mb-4 filter drop-shadow-xl transition-transform transform group-hover:scale-110">
                        {chestOpen ? '🎁' : '🧰'}
                    </div>
                </motion.div>
                
                {chestOpen ? (
                     <div className="text-green-600 font-bold animate-bounce">Ai câștigat o piesă de puzzle! 🧩</div>
                ) : (
                    <p className="text-sm text-purple-700 font-medium">Deschide pentru 100 Coins</p>
                )}
            </div>
        </div>

        {/* ZONA 2: ACHIEVEMENTS */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
             <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" /> Insigne
            </h2>
            
            <div className="space-y-4">
                {[
                    { name: "Ascultător de Noapte", desc: "Ascultă 3 povești seara", progress: "3/3", done: true, icon: "🌙" },
                    { name: "Artist Începător", desc: "Desenează 5 planșe", progress: "2/5", done: false, icon: "🎨" },
                    { name: "Explorator", desc: "Deschide aplicația 7 zile la rând", progress: "1/7", done: false, icon: "🧭" },
                ].map((ach, i) => (
                    <div key={i} className={`flex items-center gap-4 p-3 rounded-xl ${ach.done ? 'bg-green-50 border border-green-100' : 'bg-slate-50 border border-slate-100 opacity-70'}`}>
                        <div className="text-2xl">{ach.icon}</div>
                        <div className="flex-1">
                            <h4 className={`font-bold text-sm ${ach.done ? 'text-green-800' : 'text-slate-700'}`}>{ach.name}</h4>
                            <p className="text-xs text-slate-500">{ach.desc}</p>
                        </div>
                        {ach.done ? (
                            <Sparkles className="w-5 h-5 text-green-500" />
                        ) : (
                            <div className="text-xs font-mono font-bold text-slate-400 bg-white px-2 py-1 rounded-md">{ach.progress}</div>
                        )}
                    </div>
                ))}
            </div>
        </div>

      </div>

      {/* GAMES GRID - LOCKED */}
      <div>
         <h3 className="font-bold text-slate-800 text-lg mb-4">Jocuri Disponibile</h3>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {/* Joc Activ */}
             <div className="aspect-square bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl p-4 text-white flex flex-col justify-between cursor-pointer hover:scale-105 transition-transform shadow-lg">
                <Gamepad2 className="w-8 h-8 opacity-80" />
                <span className="font-bold">Simon Spune</span>
             </div>

             {/* Jocuri Blocate */}
             {[1, 2, 3].map((_, i) => (
                <div key={i} className="aspect-square bg-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center text-slate-400 relative border border-slate-200">
                    <Lock className="w-8 h-8 mb-2" />
                    <span className="text-xs font-bold uppercase">În curând</span>
                </div>
             ))}
         </div>
      </div>

    </div>
  )
}