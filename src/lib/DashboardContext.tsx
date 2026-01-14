"use client";

import { useDashboard } from "@/lib/DashboardContext";
import { Square, MessageSquare, Volume2, Power } from "lucide-react";
import { useState } from "react";

export default function DeviceControl() {
  const { state, sendCommand } = useDashboard();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleCommand = async (type: string, payload: any = null) => {
    setIsSending(true);
    await sendCommand(type, payload);
    setTimeout(() => setIsSending(false), 500); // Mic delay vizual
  };

  const isOffline = state.deviceStatus === "offline";

  return (
    <div className={`bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 transition-opacity ${isOffline ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-indigo-600" />
          Control Dispozitiv
        </h3>
        {isOffline && <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full">OFFLINE</span>}
      </div>

      {/* Butoane de acțiune rapidă */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => handleCommand("STOP_AUDIO")}
          className="flex flex-col items-center justify-center p-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl transition-all border border-red-100 active:scale-95 group"
        >
          <Square className="w-8 h-8 mb-2 fill-current group-hover:scale-110 transition-transform" />
          <span className="font-bold text-sm">STOP Sunet</span>
        </button>

        <button
          onClick={() => handleCommand("RESTART_APP")}
          className="flex flex-col items-center justify-center p-4 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-2xl border border-orange-100 transition-all active:scale-95"
        >
          <Power className="w-8 h-8 mb-2" />
          <span className="font-bold text-sm">Restart App</span>
        </button>
      </div>

      {/* Zona de Mesaje Vocale (TTS) */}
      <div className="border-t border-slate-100 pt-4">
        <label className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-indigo-500" />
          Vorbește prin robot (TTS)
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ex: Te rog vino la masă..."
            onKeyDown={(e) => e.key === 'Enter' && handleCommand("SPEAK_MESSAGE", { text: message })}
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-slate-800 placeholder:text-slate-400"
          />
          <button
            onClick={() => { handleCommand("SPEAK_MESSAGE", { text: message }); setMessage(""); }}
            disabled={!message || isSending}
            className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 active:scale-95 shadow-md shadow-indigo-200"
          >
            {isSending ? "..." : "Trimite"}
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-2 pl-1">
          Robotul va rosti acest mesaj cu vocea sa curentă.
        </p>
      </div>
    </div>
  );
}