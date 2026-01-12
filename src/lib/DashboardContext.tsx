"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "./supabaseClient";

type DeviceStatus = "active" | "idle" | "offline";
type Mood = "calm" | "neutral" | "agitated";
type ActivityType = "story" | "meditation" | "game";

interface DashboardState {
  deviceId: string | null; // ⭐ Adăugat pentru validarea TypeScript
  childName: string;
  deviceStatus: DeviceStatus;
  mood: Mood;
  lastMode: string;
  hasAlert: boolean;
  currentActivity: ActivityType | null;
  isListening: boolean;
  isSpeaking: boolean;
  currentStory: string | null;
  sessionStartTime: Date | null;
}

interface DashboardContextType {
  state: DashboardState;
  sendCommand: (command: string) => void;
  sessionHistory: any[];
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DashboardState>({
    deviceId: null, // ⭐ Inițializat cu null
    childName: "Copilul tău",
    deviceStatus: "idle",
    mood: "calm",
    lastMode: "Povești",
    hasAlert: false,
    currentActivity: null,
    isListening: false,
    isSpeaking: false,
    currentStory: null,
    sessionStartTime: null,
  });

  const [sessionHistory, setSessionHistory] = useState<any[]>([]);

  useEffect(() => {
  async function fetchDeviceInfo() {
    // 1. Încercăm să luăm datele direct din tabelul 'devices' unde știm că există Miriam
    const { data: device, error } = await supabase
      .from("devices")
      .select("id, name")
      .limit(1)
      .maybeSingle();

    if (device) {
      console.log("Dispozitiv găsit:", device.id);
      setState(prev => ({
        ...prev,
        deviceId: device.id,
        childName: device.name || "Miriam"
      }));
    } else {
      console.log("Nu am găsit niciun dispozitiv în tabelul 'devices'");
    }
  }

  fetchDeviceInfo();
  
  // Păstrăm și subscripția real-time pentru update-uri de status
  const channel = supabase
    .channel("kosi-updates")
    .on("postgres_changes", { event: "*", schema: "public", table: "device_sessions" }, 
      (payload) => handleDeviceUpdate(payload.new)
    )
    .subscribe();

  return () => { supabase.removeChannel(channel); };
}, []);

  function handleDeviceUpdate(data: any) {
    setState((prev) => ({
      ...prev,
      deviceId: data.device_id, // ⭐ Mapăm device_id din tabel în starea noastră
      deviceStatus: data.status,
      isListening: data.is_listening || false,
      isSpeaking: data.is_speaking || false,
      currentActivity: data.current_activity,
      sessionStartTime: data.session_start ? new Date(data.session_start) : null,
    }));
  }

  function handleActivityEvent(event: any) {
    if (event.event_type === "story_requested") {
      setState((prev) => ({ ...prev, currentActivity: "story", lastMode: "Povești" }));
    } else if (event.event_type === "story_completed") {
      setState((prev) => ({ ...prev, currentStory: event.story_text }));
    } else if (event.event_type === "alert") {
      setState((prev) => ({ ...prev, hasAlert: true, mood: "agitated" }));
    }
    setSessionHistory((prev) => [event, ...prev].slice(0, 50));
  }

  async function sendCommand(command: string) {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) return;

      await supabase.from("parent_commands").insert({
        user_id: session.session.user.id,
        command_type: command,
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error sending command:", error);
    }
  }

  return (
    <DashboardContext.Provider value={{ state, sendCommand, sessionHistory }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) throw new Error("useDashboard must be used within DashboardProvider");
  return context;
}
//add