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
  lastActivity: { type: string; detail: string; time: string } | null;
}

interface DashboardContextType {
  state: DashboardState;
  sendCommand: (command: string) => void;
  activities: any[]; // ✅ Acesta este câmpul pe care îl caută LiveActivityFeed
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
    lastActivity: null
  });

  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    async function initDashboard() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Căutăm legătura în parent_devices
      const { data: link } = await supabase
        .from("parent_devices")
        .select("device_id")
        .eq("parent_id", user.id)
        .limit(1)
        .maybeSingle();

      if (link && link.device_id) {
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
            childName: device.child_name || "Dispozitiv Kosi"
          }));
          
          // 3. Încărcăm istoricul și pornim ascultarea
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
      if (data.length > 0) {
        updateLastActivity(data[0]);
      }
    }
  }

  function updateLastActivity(act: any) {
    let detail = "Activitate";
    try {
        const json = typeof act.event_data === 'string' ? JSON.parse(act.event_data) : act.event_data;
        detail = json.title || json.detail || act.event_type;
    } catch(e) {}

    setState(prev => ({
        ...prev,
        lastActivity: {
            type: act.event_type,
            detail: detail,
            time: new Date(act.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        }
    }));
  }

  function subscribeToDevice(deviceId: string) {
    const channel = supabase
      .channel(`device-room-${deviceId}`)
      .on(
        "postgres_changes", 
        { event: "*", schema: "public", table: "device_sessions", filter: `device_id=eq.${deviceId}` }, 
        (payload) => {
            const data = payload.new;
            setState((prev) => ({
              ...prev,
              deviceStatus: data.status || "idle",
              isListening: data.is_listening || false,
              isSpeaking: data.is_speaking || false,
              currentActivity: data.current_activity,
            }));
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "activity_log", filter: `device_id=eq.${deviceId}` },
        (payload) => {
          const newAct = payload.new;
          setActivities(prev => [newAct, ...prev].slice(0, 50));
          updateLastActivity(newAct);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }

  async function sendCommand(command: string) {
    if (!state.deviceId) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("parent_commands").insert({
      device_id: state.deviceId,
      user_id: user.id,
      command_type: command,
    });
  }

  return (
    <DashboardContext.Provider value={{ state, sendCommand, activities }}>
      {children}
    </DashboardContext.Provider>
  );
}

// ✅ EXPORTUL ESTE AICI
export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) throw new Error("useDashboard must be used within DashboardProvider");
  return context;
}