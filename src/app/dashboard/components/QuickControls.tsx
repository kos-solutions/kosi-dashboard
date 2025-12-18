"use client";

import { useState } from "react";
import { useDashboard } from "@/lib/DashboardContext";

export default function QuickControls() {
  const { sendCommand } = useDashboard();
  const [quietMode, setQuietMode] = useState(false);
  const [storyMode, setStoryMode] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  function trigger(command: string) {
    sendCommand(command);
    setFeedback("Comandă trimisă");
    setTimeout(() => setFeedback(null), 2000);
  }

  return (
    <div className="bg-kosi-surface rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-4">Control rapid</h3>

      {/* Pauză liniștită */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-kosi-muted">
          Pauză liniștită
        </span>
        <button
          onClick={() => {
            const next = !quietMode;
            setQuietMode(next);
            trigger("SET_MODE_SILENT");
          }}
          className={`px-3 py-1 rounded-full text-sm transition ${
            quietMode
              ? "bg-kosi-primary text-white"
              : "bg-gray-100 text-kosi-muted"
          }`}
        >
          {quietMode ? "Activă" : "Dezactivată"}
        </button>
      </div>

      {/* Mod poveste */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-kosi-muted">
          Mod poveste
        </span>
        <button
          onClick={() => {
            const next = !storyMode;
            setStoryMode(next);
            trigger("SET_MODE_STORY");
          }}
          className={`px-3 py-1 rounded-full text-sm transition ${
            storyMode
              ? "bg-kosi-primary text-white"
              : "bg-gray-100 text-kosi-muted"
          }`}
        >
          {storyMode ? "Activ" : "Dezactivat"}
        </button>
      </div>

      {feedback && (
        <div className="mb-4 text-sm text-kosi-success">
          {feedback}
        </div>
      )}

      {/* Acțiuni */}
      <div className="border-t pt-4 space-y-2">
        <button
          onClick={() => trigger("ALLOW_INTERACTION_WINDOW")}
          className="w-full text-sm py-2 rounded-lg bg-gray-100 text-kosi-text"
        >
          Pauză pentru următoarele 30 de minute
        </button>

        <button
          onClick={() => trigger("END_SESSION")}
          className="w-full text-sm py-2 rounded-lg bg-kosi-secondary text-kosi-text"
        >
          Oprește pentru moment
        </button>

        <p className="text-xs text-kosi-muted mt-2">
          Interacțiunea începe atunci când copilul vorbește cu KOSI.
        </p>
      </div>
    </div>
  );
}
