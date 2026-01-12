"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "./supabaseClient";

type DeviceStatus = "active" | "idle" | "offline";
type Mood = "calm" | "neutral" | "agitated";
type ActivityType = "story" | "meditation" | "game";

// ⭐ Am adăugat deviceId aici pentru a fi recunoscut de TypeScript
interface DashboardState {
  deviceId: string | null; 
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
    // 1. Fetch inițial pentru ultima sesiune
    async function fetchInitialState() {
      const { data: session } = await supabase
        .from("device_sessions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (session) {
        handleDeviceUpdate(session);
      }
    }

    fetchInitialState();

    // 2. Real-time subscripție
    const channel = supabase
      .channel("dashboard-updates")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "device_events" },
        (payload) => handleNewEvent(payload.new)
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "device_sessions" },
        (payload) => handleDeviceUpdate(payload.new)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  function handleDeviceUpdate(data: any) {
    setState((prev) => ({
      ...prev,
      deviceId: data.device_id, // ⭐ Salvăm ID-ul dispozitivului în stare
      deviceStatus: data.status,
      sessionStartTime: data.started_at ? new Date(data.started_at) : null,
    }));
  }

  function handleNewEvent(event: any) {
    // Logica ta originală de procesare evenimente
    if (event.event_type === "story_requested") {
      setState((prev) => ({
        ...prev,
        currentActivity: "story",
        lastMode: "Povești",
      }));
    } else if (event.event_type === "story_completed") {
      setState((prev) => ({
        ...prev,
        currentStory: event.story_text,
      }));
    } else if (event.event_type === "alert") {
      setState((prev) => ({
        ...prev,
        hasAlert: true,
        mood: "agitated",
      }));
    }

    setSessionHistory((prev) => [event, ...prev].slice(0, 50));
  }

  async function sendCommand(command: string) {
    try {
      const { data: authSession } = await supabase.auth.getSession();
      if (!authSession?.session) return;

      await supabase.from("parent_commands").insert({
        user_id: authSession.session.user.id,
        command_type: command,
        created_at: new Date().toISOString(),
      });

      console.log("Command sent:", command);
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
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}