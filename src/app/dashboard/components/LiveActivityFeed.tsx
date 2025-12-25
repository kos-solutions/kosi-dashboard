"use client";

import { useDashboard } from "@/lib/DashboardContext";
import { formatDistanceToNow } from "date-fns";
import { ro } from "date-fns/locale";

export default function LiveActivityFeed() {
  const { sessionHistory, state } = useDashboard();

  function getEventIcon(eventType: string) {
    switch (eventType) {
      case "story_requested":
        return "📖";
      case "story_completed":
        return "✅";
      case "meditation_started":
        return "🧘";
      case "game_started":
        return "🎮";
      case "alert":
        return "⚠️";
      case "session_start":
        return "▶️";
      case "session_end":
        return "⏹️";
      default:
        return "•";
    }
  }

  function getEventText(event: any) {
    switch (event.event_type) {
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

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Activitate Live</h3>
        {state.isListening && (
          <span className="flex items-center gap-2 text-sm text-blue-600">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            Ascultă
          </span>
        )}
        {state.isSpeaking && (
          <span className="flex items-center gap-2 text-sm text-orange-600">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
            </span>
            Vorbește
          </span>
        )}
      </div>

      {sessionHistory.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">
          Nicio activitate recent
        </p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {sessionHistory.map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
            >
              <span className="text-2xl">{getEventIcon(event.event_type)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {getEventText(event)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(new Date(event.created_at), {
                    addSuffix: true,
                    locale: ro,
                  })}
                </p>
                {event.event_data?.story_text && (
                  <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                    "{event.event_data.story_text}"
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}