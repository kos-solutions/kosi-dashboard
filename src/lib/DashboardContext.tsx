"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "./supabaseClient";

type DeviceStatus = "active" | "idle" | "offline";
type Mood = "calm" | "neutral" | "agitated";
type ActivityType = "story" | "meditation" | "game";

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
  activities: any[]; // ⭐ REPARAT: Am redenumit din sessionHistory în activities
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DashboardState>({
    deviceId: null,
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

  // ⭐ Folosim 'activities' pentru a fi compatibil cu LiveActivityFeed
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    async function initDashboard() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      console.log("🔍 Caut dispozitiv pentru user:", user.id);

      // 1. Căutăm legătura în parent_devices
      const { data: link } = await supabase
        .from("parent_devices")
        .select("device_id")
        .eq("parent_id", user.id)
        .limit(1)
        .maybeSingle();

      if (link && link.device_id) {
        console.log("✅ Legătură găsită:", link.device_id);
        
        // 2. Luăm detaliile dispozitivului
        const { data: device } = await supabase
          .from("devices")
          .select("id, child_name")
          .eq("id", link.device_id)
          .single();

        if (device) {
          setState(prev => ({
            ...prev,
            deviceId: device.id,
            childName: device.child_name || "Miriam"
          }));
          
          // 3. Încărcăm istoricul inițial și pornim ascultarea
          fetchInitialActivities(device.id);
          subscribeToDevice(device.id);
        }
      }
    }

    initDashboard();
  }, []);

  async function fetchInitialActivities(deviceId: string) {
    const { data } = await supabase
      .from("activity_log")
      .select("*")
      .eq("device_id", deviceId)
      .order("created_at", { ascending: false })
      .limit(20);
    
    if (data) {
      setActivities(data);
    }
  }

  function subscribeToDevice(deviceId: string) {
    console.log("📡 Abonare la update-uri pentru:", deviceId);
    
    // Channel pentru Status (device_sessions)
    const statusChannel = supabase
      .channel(`status-${deviceId}`)
      .on(
        "postgres_changes", 
        { event: "*", schema: "public", table: "device_sessions", filter: `device_id=eq.${deviceId}` }, 
        (payload) => handleDeviceUpdate(payload.new)
      )
      .subscribe();

    // Channel pentru Activități (activity_log) - ⭐ IMPORTANT PENTRU FEED
    const activityChannel = supabase
      .channel(`activities-${deviceId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "activity_log", filter: `device_id=eq.${deviceId}` },
        (payload) => {
          console.log("Activitate nouă:", payload.new);
          setActivities(prev => [payload.new, ...prev].slice(0, 50));
        }
      )
      .subscribe();

    return () => { 
      supabase.removeChannel(statusChannel);
      supabase.removeChannel(activityChannel);
    };
  }

  function handleDeviceUpdate(data: any) {
    setState((prev) => ({
      ...prev,
      deviceStatus: data.status || "idle",
      isListening: data.is_listening || false,
      isSpeaking: data.is_speaking || false,
      currentActivity: data.current_activity,
      sessionStartTime: data.session_start ? new Date(data.session_start) : null,
    }));
  }

  async function sendCommand(command: string) {
    if (!state.deviceId) return;
    
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) return;

      await supabase.from("parent_commands").insert({
        device_id: state.deviceId,
        user_id: session.session.user.id,
        command_type: command,
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error sending command:", error);
    }
  }

  return (
    <DashboardContext.Provider value={{ state, sendCommand, activities }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) throw new Error("useDashboard must be used within DashboardProvider");
  return context;
}