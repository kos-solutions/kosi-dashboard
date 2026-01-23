'use client'

import { useState } from 'react'
import { Play, BookOpen, Star, Clock, Plus, Sparkles, Music } from 'lucide-react'
import { motion } from 'framer-motion'

// Date simulate (până le legăm de Supabase real)
const STORIES = [
  { id: 1, title: "Kosi și Dragonul Somnoroș", category: "Aventură", duration: "5 min", color: "from-orange-400 to-red-500", icon: Sparkles, hero: true },
  { id: 2, title: "Misiune pe Marte", category: "Spațiu", duration: "8 min", color: "from-blue-600 to-purple-600", icon: Star, hero: false },
  { id: 3, title: "Prietenia din Pădure", category: "Animale", duration: "4 min", color: "from-green-400 to-emerald-600", icon: Music, hero: false },
  { id: 4, title: "Secretul Norilor", category: "Magie", duration: "6 min", color: "from-indigo-400 to-cyan-500", icon: Sparkles, hero: false },
  { id: 5, title: "Lecția Micuței Albine", category: "Educativ", duration: "3 min", color: "from-yellow-400 to-orange-500", icon: BookOpen, hero: false },
]

export default function StoriesPage() {
  const [filter, setFilter] = useState('Toate')
  const categories = ['Toate', 'Aventură', 'Spațiu', 'Animale', 'Educativ']

  const heroStory = STORIES.find(s => s.hero)
  const listStories = STORIES.filter(s => !s.hero && (filter === 'Toate' || s.category === filter))

  return (
    <div className="space-y-8 pb-20">
      
      {/* HEADER + ACTION */}
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-slate-800">Biblioteca Magică 📚</h1>
            <p className="text-slate-500">Alege aventura din seara asta.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all transform hover:scale-105">
            <Plus className="w-5 h-5" />
            Generează Poveste
        </button>
      </div>

      {/* HERO SECTION (Featured Story) */}
      {heroStory && (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${heroStory.color} p-8 text-white shadow-2xl`}
        >
            <div className="relative z-10 max-w-lg">
                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">
                    Recomandarea Serii
                </span>
                <h2 className="text-4xl font-black mb-4 leading-tight">{heroStory.title}</h2>
                <p className="text-white/90 mb-8 text-lg">O aventură incredibilă care îl va învăța pe cel mic despre curaj și prietenie, chiar înainte de culcare.</p>
                
                <div className="flex gap-4">
                    <button className="bg-white text-slate-900 px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors">
                        <Play className="w-5 h-5 fill-current" /> Ascultă Acum
                    </button>
                    <button className="bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-full font-bold hover:bg-white/30 transition-colors">
                        Detalii
                    </button>
                </div>
            </div>
            
            {/* Decorative Icon Big */}
            <heroStory.icon className="absolute -bottom-10 -right-10 w-64 h-64 text-white opacity-20 rotate-12" />
        </motion.div>
      )}

      {/* FILTERS */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(cat => (
            <button 
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                    filter === cat 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
            >
                {cat}
            </button>
        ))}
      </div>

      {/* STORY GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listStories.map((story, i) => (
            <motion.div
                key={story.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white rounded-2xl p-2 border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer"
            >
                <div className={`h-40 rounded-xl bg-gradient-to-br ${story.color} flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform`}>
                    <story.icon className="w-16 h-16 text-white opacity-80" />
                    <div className="absolute top-3 right-3 bg-black/20 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {story.duration}
                    </div>
                </div>
                
                <div className="p-4">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{story.category}</div>
                    <h3 className="text-lg font-bold text-slate-800 mb-4 group-hover:text-indigo-600 transition-colors">{story.title}</h3>
                    
                    <div className="flex justify-between items-center border-t border-slate-100 pt-4">
                        <div className="flex -space-x-2">
                            {/* Avatare fake pt cine a ascultat */}
                            <div className="w-8 h-8 rounded-full bg-yellow-200 border-2 border-white"></div>
                            <div className="w-8 h-8 rounded-full bg-blue-200 border-2 border-white"></div>
                        </div>
                        <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                            <Play className="w-4 h-4 fill-current ml-1" />
                        </button>
                    </div>
                </div>
            </motion.div>
        ))}
      </div>
    </div>
  )
}