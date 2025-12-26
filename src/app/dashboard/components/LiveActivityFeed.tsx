"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { formatDistanceToNow } from "date-fns";
import { ro } from "date-fns/locale";

interface Activity {
  id: string;
  event_type: string;
  event_data: any;
  timestamp: string;
  language: string;
}

export default function LiveActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
    
    // Real-time subscription
    const channel = supabase
      .channel('activity-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'activity_log'
        },
        (payload) => {
          console.log('New activity:', payload);
          setActivities(prev => [payload.new as Activity, ...prev].slice(0, 10));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchActivities() {
    try {
      const { data, error } = await supabase
        .from('activity_log')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching activities:', error);
        return;
      }

      console.log('Fetched activities:', data);
      setActivities(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  function getEventIcon(eventType: string) {
    switch (eventType) {
      case "story_played":
        return "📖";
      case "story_requested":
        return "📚";
      case "story_completed":
        return "✅";
      case "meditation_started":
        return "🧘";
      case "game_started":
        return "🎮";
      case "alert":
        return "⚠️";
      default:
        return "•";
    }
  }

  function getEventText(event: Activity) {
    switch (event.event_type) {
      case "story_played":
        return `A ascultat povestea: "${event.event_data?.title || "..."}"`;
      case "story_requested":
        return `A cerut o poveste: "${event.event_data?.request || "..."}"`;
      case "story_completed":
        return "A ascultat o poveste completă";
      case "meditation_started":
        return "A început o sesiune de liniștire";
      case "alert":
        return event.event_data?.message || "Eveniment care necesită atenție";
      default:
        return event.event_type;
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow">
        <h3 className="text-lg font-semibold mb-4">Activitate Live</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Activitate Live</h3>
        <span className="flex items-center gap-2 text-sm text-green-600">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Live
        </span>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Nicio activitate încă</p>
          <p className="text-sm mt-2">Activitățile vor apărea aici în timp real</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {activities.map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
            >
              <span className="text-2xl">{getEventIcon(event.event_type)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{getEventText(event)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(new Date(event.timestamp), {
                    addSuffix: true,
                    locale: ro,
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}