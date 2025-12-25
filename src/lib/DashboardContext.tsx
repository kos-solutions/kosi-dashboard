"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "./supabaseClient";

type DeviceStatus = "active" | "idle" | "offline";
type Mood = "calm" | "neutral" | "agitated";
type ActivityType = "story" | "meditation" | "game";

interface DashboardState {
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

  // Real-time subscription pentru device status
  useEffect(() => {
    const channel = supabase
      .channel("kosi-device-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "device_sessions",
        },
        (payload) => {
          console.log("Device update:", payload);
          handleDeviceUpdate(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Real-time subscription pentru activity events
  useEffect(() => {
    const channel = supabase
      .channel("kosi-activity-events")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "activity_events",
        },
        (payload) => {
          console.log("New activity:", payload);
          handleActivityEvent(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  function handleDeviceUpdate(data: any) {
    setState((prev) => ({
      ...prev,
      deviceStatus: data.status,
      isListening: data.is_listening || false,
      isSpeaking: data.is_speaking || false,
      currentActivity: data.current_activity,
      sessionStartTime: data.session_start ? new Date(data.session_start) : null,
    }));
  }

  function handleActivityEvent(event: any) {
    // Update state based on activity type
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

    // Add to session history
    setSessionHistory((prev) => [event, ...prev].slice(0, 50));
  }

  async function sendCommand(command: string) {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) return;

      // Send command to device via Supabase
      await supabase.from("parent_commands").insert({
        user_id: session.session.user.id,
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
    throw new Error("useDashboard must be used within DashboardProvider");
  }
  return context;
}