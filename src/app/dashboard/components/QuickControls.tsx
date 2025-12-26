"use client";

import { useState } from "react";

export default function QuickControls() {
  const [pauseTimer, setPauseTimer] = useState(30);

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h3 className="text-lg font-semibold mb-4">Control rapid</h3>

      <div className="space-y-3">
        {/* Pause Button */}
        <button className="w-full py-3 px-4 rounded-lg bg-orange-50 hover:bg-orange-100 transition text-left flex items-center justify-between group">
          <span className="text-gray-700 font-medium">Pauză liniștită</span>
          <span className="text-gray-500 group-hover:text-orange-600">Dezactivat</span>
        </button>

        {/* Story Mode */}
        <button className="w-full py-3 px-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition text-left flex items-center justify-between group">
          <span className="text-gray-700 font-medium">Mod poveste</span>
          <span className="text-gray-500 group-hover:text-blue-600">Dezactivat</span>
        </button>
      </div>

      {/* Pause Timer */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-600 mb-2">
          Pauză pentru următoarele {pauseTimer} de minute
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPauseTimer(15)}
            className={`flex-1 py-2 px-3 rounded text-sm ${
              pauseTimer === 15
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            15 min
          </button>
          <button
            onClick={() => setPauseTimer(30)}
            className={`flex-1 py-2 px-3 rounded text-sm ${
              pauseTimer === 30
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            30 min
          </button>
          <button
            onClick={() => setPauseTimer(60)}
            className={`flex-1 py-2 px-3 rounded text-sm ${
              pauseTimer === 60
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            60 min
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-gray-600">
          ℹ️ Interacțiunile încep atunci când copilul vorbește cu KOSI.
        </p>
      </div>

      {/* Action Button */}
      <button className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg font-semibold hover:from-orange-500 hover:to-orange-600 transition">
        Oprește pentru moment
      </button>
    </div>
  );
}