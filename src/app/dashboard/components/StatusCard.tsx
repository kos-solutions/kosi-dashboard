"use client";

import { useDashboard } from "@/lib/DashboardContext";
import { Battery, Signal, Wifi, Activity, Clock } from "lucide-react";

export default function StatusCard() {
  const { state } = useDashboard();

  // Helper pentru culoarea statusului
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500 shadow-green-200";
      case "active":
        return "bg-blue-500 shadow-blue-200";
      default:
        return "bg-slate-300 shadow-slate-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "online": return "Online";
      case "active": return "Activ";
      default: return "Offline";
    }
  };

  // Helper pentru baterie
  const getBatteryIcon = (level: number) => {
    if (level > 80) return <Battery className="w-5 h-5 text-green-600" />;
    if (level > 20) return <Battery className="w-5 h-5 text-slate-600" />;
    return <Battery className="w-5 h-5 text-red-600" />;
  };

  return (
    <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 h-full relative overflow-hidden">
      {/* Background Decorativ */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-bl-[100px] -mr-8 -mt-8 opacity-50" />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-3 h-3 rounded-full shadow-[0_0_10px] ${getStatusColor(state.deviceStatus)}`} />
              <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">
                {getStatusText(state.deviceStatus)}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Ultima actualizare: {state.lastSeen ? new Date(state.lastSeen).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
            <div className="flex items-center gap-1.5" title="Baterie">
              {getBatteryIcon(state.batteryLevel)}
              <span className="text-xs font-bold text-slate-700">{state.batteryLevel}%</span>
            </div>
            <div className="w-px h-3 bg-slate-200" />
            <div className="flex items-center gap-1.5" title="Semnal WiFi">
              <Wifi className={`w-4 h-4 ${state.wifiStatus === 'strong' ? 'text-indigo-600' : 'text-slate-400'}`} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">
              {state.childName}
            </h3>
            <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              Dispozitiv conectat
            </p>
          </div>

          {!state.deviceId && (
             <div className="p-3 bg-amber-50 text-amber-700 text-xs rounded-xl border border-amber-100">
                ⚠ Niciun dispozitiv Kosi detectat.
             </div>
          )}

          {/* Ultima Activitate Card Mic */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-indigo-600 shadow-sm">
               <Activity className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
               <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                 Ultima activitate
               </p>
               <p className="text-sm font-bold text-slate-700 truncate">
                 {state.lastActivity?.detail || state.lastActivity?.type || "Inactiv"}
               </p>
            </div>
            <div className="text-right">
                <p className="text-xs font-medium text-slate-400">
                    {state.lastActivity?.timestamp ? new Date(state.lastActivity.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : ''}
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}