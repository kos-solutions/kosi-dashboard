"use client";
import { sendCommand } from "@/lib/mockApi";
import { useDashboard } from "@/lib/DashboardContext";

import { useState } from "react";

export default function QuickControls() {
  const [quietMode, setQuietMode] = useState(false);
  const [storyMode, setStoryMode] = useState(false);
const { sendCommand } = useDashboard();

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h3 className="text-lg font-semibold mb-4">Control rapid</h3>

      {/* Quiet Mode */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-700">
          Quiet mode
        </span>
        <button
		onClick={() => {
  setQuietMode(!quietMode);
  sendCommand("SET_MODE_SILENT");
}}

          onClick={() => setQuietMode(!quietMode)}
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
        <span className="text-sm text-gray-700">
          Story mode
        </span>
        <button
		onClick={() => {
  setQuietMode(!quietMode);
  sendCommand("SET_MODE_SILENT");
}}onClick={() => sendCommand("END_SESSION")}


          onClick={() => setStoryMode(!storyMode)}
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
        <button className="w-full text-sm py-2 rounded-lg bg-gray-100 text-gray-700">
          Pauză interacțiune – 30 min
        </button>

        <button className="w-full text-sm py-2 rounded-lg bg-red-100 text-red-600">
          Oprește interacțiunea acum
        </button>
      </div>
    </div>
  );
}
