"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Story {
  id: string;
  request: string;
  story_text: string;
  timestamp: string;
  duration_seconds: number;
}

export default function StoryHistory() {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  useEffect(() => {
    loadStories();
  }, []);

  async function loadStories() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get paired device
      const { data: pairedDevice } = await supabase
        .from('parent_devices')
        .select('device_id')
        .eq('parent_id', user.id)
        .limit(1)
        .single();

      if (!pairedDevice) return;

      // Get stories from activity_log
      const { data } = await supabase
        .from("activity_log")
        .select("*")
        .eq("device_id", pairedDevice.device_id)
        .eq("event_type", "story_played")
        .order("timestamp", { ascending: false })
        .limit(20);

      console.log('Story history data:', data);

      if (data) {
        setStories(
          data.map((event) => ({
            id: event.id,
            request: event.event_data?.title || "Poveste",
            story_text: event.event_data?.story_text || "Povestea nu este disponibilă.",
            timestamp: event.timestamp,
            duration_seconds: event.duration_seconds || 0,
          }))
        );
      }
    } catch (error) {
      console.error('Error loading stories:', error);
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Astăzi ${date.toLocaleTimeString("ro-RO", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Ieri ${date.toLocaleTimeString("ro-RO", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else {
      return date.toLocaleDateString("ro-RO", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h3 className="text-lg font-semibold mb-4">Povești Ascultate</h3>

      <div className="space-y-2">
        {stories.map((story) => (
          <button
            key={story.id}
            onClick={() =>
              setSelectedStory(selectedStory?.id === story.id ? null : story)
            }
            className="w-full text-left p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-sm">📖 {story.request}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(story.timestamp)} •{" "}
                  {Math.round(story.duration_seconds / 60)} min
                </p>
              </div>
              <span className="text-gray-400">
                {selectedStory?.id === story.id ? "▼" : "▶"}
              </span>
            </div>

            {selectedStory?.id === story.id && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {story.story_text}
                </p>
              </div>
            )}
          </button>
        ))}

        {stories.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-8">
            Nicio poveste ascultată încă
          </p>
        )}
      </div>
    </div>
  );
}