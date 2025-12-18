"use client";

import { createContext, useContext, useState } from "react";

export type DashboardState = {
  childName: string;
  deviceStatus: "active" | "idle" | "offline";
  mood: "calm" | "neutral" | "agitated";
  lastInteraction: string;
  lastMode: string;
  hasAlert: boolean;
};

const initialState: DashboardState = {
  childName: "Andrei",
  deviceStatus: "active",
  mood: "calm",
  lastInteraction: "acum 12 minute",
  lastMode: "Poveste",
  hasAlert: false,
};

type DashboardContextType = {
  state: DashboardState;
  sendCommand: (command: string) => void;
};

const DashboardContext = createContext<DashboardContextType | null>(null);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DashboardState>(initialState);

 function sendCommand(command: string) {
  console.log("COMMAND FIRED:", command);

  setState((s) => {
    const next = { ...s };

    if (command === "SET_MODE_SILENT") {
      next.deviceStatus = "idle";
    }

    if (command === "SET_MODE_STORY") {
      next.lastMode = "Poveste";
    }

    if (command === "END_SESSION") {
      next.deviceStatus = "offline";
    }

    console.log("NEW STATE:", next);
    return next;
  });
}


  return (
    <DashboardContext.Provider value={{ state, sendCommand }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used inside DashboardProvider");
  return ctx;
}
