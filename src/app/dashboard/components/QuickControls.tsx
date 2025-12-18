"use client";

import { useState } from "react";
import { useDashboard } from "@/lib/DashboardContext";

export default function QuickControls() {
  const { sendCommand } = useDashboard();
  const [quietMode, setQuietMode] = useState(false);
  const [storyMode, setStoryMode] = useState(false);

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h3 className="text-lg font-semibold mb-4">Control rapid</h3>

      {/* Quiet Mode */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-700">Quiet mode</span>
        <button
          onClick={() => {
            const next = !quietMode;
            setQuietMode(next);
            sendCommand("SET_MODE_SILENT");
          }}
          className={`px-3 py-1 rounded-full text-sm ${
            quietMode
              ? "bg-gray-800 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {quietMode ? "Activ" : "Dezactivat"}
        </button>
      </div>

      {/* Story Mode */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-700">Story mode</span>
        <button
          onClick={() => {
            const next = !storyMode;
            setStoryMode(next);
            sendCommand("SET_MODE_STORY");
          }}
          className={`px-3 py-1 rounded-full text-sm ${
            storyMode
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {storyMode ? "Activ" : "Dezactivat"}
        </button>
      </div>

      {/* Actions */}
      <div className="border-t pt-4 space-y-2">
        <button
          onClick={() => sendCommand("ALLOW_INTERACTION_WINDOW")}
          className="w-full text-sm py-2 rounded-lg bg-gray-100 text-gray-700"
        >
          Pauză interacțiune – 30 min
        </button>

        <button
          onClick={() => sendCommand("END_SESSION")}
          className="w-full text-sm py-2 rounded-lg bg-red-100 text-red-600"
        >
          Oprește interacțiunea acum
        </button>
      </div>
    </div>
  );
}
