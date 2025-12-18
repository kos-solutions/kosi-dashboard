"use client";
import { useDashboard } from "@/lib/DashboardContext";
import { useEffect, useState } from "react";

export default function StatusCard() {
  const { state } = useDashboard();
  const [highlight, setHighlight] = useState(false);

  useEffect(() => {
    setHighlight(true);
    const t = setTimeout(() => setHighlight(false), 1500);
    return () => clearTimeout(t);
  }, [state.deviceStatus]);

  const deviceStatusText =
    state.deviceStatus === "active"
      ? "KOSI este alături de copil"
      : state.deviceStatus === "idle"
      ? "KOSI așteaptă o nouă interacțiune"
      : "KOSI este oprit momentan";

  const moodText =
    state.mood === "calm"
      ? "Calm 😊"
      : state.mood === "neutral"
      ? "Neutru 😐"
      : "Agitat 😟";

  return (
    <div
      className={`bg-kosi-surface rounded-xl p-6 shadow-sm border border-gray-100 transition-all ${
        highlight ? "ring-2 ring-kosi-primary/40" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{state.childName}</h2>
        <span className="text-sm text-kosi-muted">
          {deviceStatusText}
        </span>
      </div>

      <div className="mb-4">
        <p className="text-sm text-kosi-muted">Stare generală</p>
        <p className="text-lg font-medium">{moodText}</p>
      </div>

      <div className="mb-4 text-sm text-kosi-muted">
        <p>Copilul a interacționat recent cu KOSI</p>
        <p>Ultimul mod folosit: {state.lastMode}</p>
      </div>

      <div className="text-sm">
        {state.hasAlert ? (
          <p className="text-kosi-warning">
            Este nevoie de atenția părintelui
          </p>
        ) : (
          <p className="text-kosi-success">
            Nu sunt motive de îngrijorare
          </p>
        )}
      </div>
    </div>
  );
}
