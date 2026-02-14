"use client";

import { useState, useEffect } from "react";
import { useDashboard } from "@/lib/DashboardContext"; // Folosim contextul
import { BookOpen, PlayCircle, StopCircle } from "lucide-react";

export default function StoryHistory() {
  const { state } = useDashboard(); // Accesăm activitățile deja încărcate în context
  const [stories, setStories] = useState<any[]>([]);

  useEffect(() => {
    // Filtrăm doar poveștile din activitățile globale
    if (state.activities) {
        const storyLogs = state.activities.filter(a => 
            a.event_type === 'story_played' || a.event_type === 'STORY'
        );
        setStories(storyLogs);
    }
  }, [state.activities]);

  if (stories.length === 0) {
      return (
          <div className="bg-white p-6 rounded-3xl border border-slate-100 text-center py-10">
              <BookOpen className="w-10 h-10 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400">Încă nu s-au ascultat povești.</p>
          </div>
      )
  }

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Istoric Povești</h3>
      <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
        {stories.map((story) => {
            let details = "Poveste audio";
            try {
                if (typeof story.event_data === 'string' && story.event_data.includes('{')) {
                    const parsed = JSON.parse(story.event_data);
                    details = parsed.detail || parsed.message || "Poveste magică";
                } else {
                    details = story.event_data;
                }
            } catch (e) {}

            return (
                <div key={story.id} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors group cursor-pointer border border-transparent hover:border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                        <BookOpen size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-700 truncate">{details}</p>
                        <p className="text-xs text-slate-400">
                            {new Date(story.created_at).toLocaleDateString('ro-RO')} • {new Date(story.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                        </p>
                    </div>
                </div>
            )
        })}
      </div>
    </div>
  );
}