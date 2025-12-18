"use client";
import { useDashboard } from "@/lib/DashboardContext";


export default function StatusCard() {
  const { state } = useDashboard();
console.log("StatusCard render", state.deviceStatus);

  const deviceStatusText =
    state.deviceStatus === "active"
      ? "KOSI este activ"
      : state.deviceStatus === "idle"
      ? "KOSI este în repaus"
      : "KOSI este offline";

  const moodText =
    state.mood === "calm"
      ? "Calm 😊"
      : state.mood === "neutral"
      ? "Neutru 😐"
      : "Agitat 😟";

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{state.childName}</h2>
        <span className="text-sm text-gray-600">{deviceStatusText}</span>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-500">Stare generală</p>
        <p className="text-lg font-medium">{moodText}</p>
      </div>

      <div className="mb-4 text-sm text-gray-600">
        <p>Ultima interacțiune: {state.lastInteraction}</p>
        <p>Ultimul mod: {state.lastMode}</p>
      </div>

      <div className="text-sm">
        {state.hasAlert ? (
          <p className="text-red-600">⚠️ Atenție necesară</p>
        ) : (
          <p className="text-green-600">Totul este în regulă</p>
        )}
      </div>
    </div>
  );
}
