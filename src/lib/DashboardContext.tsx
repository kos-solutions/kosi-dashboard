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
  // ⭐ Câmpuri noi pentru Baterie & WiFi
  batteryLevel: number | null;
  wifiStatus: "strong" | "good" | "weak" | "offline" | "unknown";
}

interface DashboardContextType {
  state: DashboardState;
  sendCommand: (command: string) => void;
  activities: any[];
}

const DashboardContext = createContext<DashboardContextType | null>(null);

// ⭐ HELPER: Logica "Dead Man's Switch"
// Verifică dacă timestamp-ul este mai vechi de 70 de secunde
function checkActivityStatus(lastSeenIso: string | null, statusFromDb: string): DeviceStatus {
    if (!lastSeenIso) return "offline";
    
    const lastSeen = new Date(lastSeenIso).getTime();
    const now = new Date().getTime();
    const diffSeconds = (now - lastSeen) / 1000;

    // Telefonul trimite puls la 30 secunde.
    // Dacă au trecut 70 secunde fără puls, considerăm dispozitivul mort/offline.
    if (diffSeconds > 70) {
        return "offline";
    }
    return statusFromDb as DeviceStatus;
}

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
    lastActivity: null,
    batteryLevel: null,
    wifiStatus: "unknown"
  });

  const [activities, setActivities] = useState<any[]>([]);

  // ⭐ TIMER DE SIGURANȚĂ
  // Rulează la fiecare 30 secunde pentru a verifica dacă telefonul a "tăcut"
  useEffect(() => {
      const interval = setInterval(() => {
          if (state.deviceId) {
              refreshSessionStatus();
          }
      }, 30000); 

      return () => clearInterval(interval);
  }, [state.deviceId]);

  useEffect(() => {
    initDashboard();
  }, []);

  async function initDashboard() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: link } = await supabase
        .from("parent_devices")
        .select("device_id")
        .eq("parent_id", user.id)
        .limit(1)
        .maybeSingle();

      if (link && link.device_id) {
        const { data: device } = await supabase
          .from("devices")
          .select("id, child_name")
          .eq("id", link.device_id)
          .single();

        if (device) {
          // Citim starea inițială
          const { data: session } = await supabase
            .from("device_sessions")
            .select("status, last_seen, battery_level, wifi_status")
            .eq("device_id", device.id)
            .maybeSingle();

          // Calculăm statusul REAL (folosind timpul)
          const realStatus = checkActivityStatus(session?.last_seen, session?.status || "offline");

          setState(prev => ({
            ...prev,
            deviceId: device.id,
            childName: device.child_name || "Dispozitiv Kosi",
            deviceStatus: realStatus,
            batteryLevel: session?.battery_level ?? null,
            wifiStatus: session?.wifi_status || "unknown"
          }));
          
          fetchInitialActivities(device.id);
          subscribeToDevice(device.id);
        }
      }
  }

  // Funcție apelată periodic de timer
  async function refreshSessionStatus() {
      if (!state.deviceId) return;
      
      const { data: session } = await supabase
        .from("device_sessions")
        .select("status, last_seen, battery_level, wifi_status")
        .eq("device_id", state.deviceId)
        .maybeSingle();
      
      if (session) {
          const realStatus = checkActivityStatus(session.last_seen, session.status);
          
          // Actualizăm starea dacă s-a schimbat ceva (de ex: a expirat timpul)
          setState(prev => ({ 
              ...prev, 
              deviceStatus: realStatus,
              batteryLevel: session.battery_level ?? prev.batteryLevel,
              wifiStatus: session.wifi_status || prev.wifiStatus
          }));
      }
  }

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
      .channel(`device-live-${deviceId}`)
      .on(
        "postgres_changes", 
        { event: "*", schema: "public", table: "device_sessions", filter: `device_id=eq.${deviceId}` }, 
        (payload) => {
            const data = payload.new as any;
            if (data) {
                // Chiar și la date live, verificăm timpul pentru siguranță
                const realStatus = checkActivityStatus(data.last_seen, data.status);

                setState((prev) => ({
                  ...prev,
                  deviceStatus: realStatus,
                  isListening: data.is_listening || false,
                  isSpeaking: data.is_speaking || false,
                  currentActivity: data.current_activity,
                  batteryLevel: data.battery_level,
                  wifiStatus: data.wifi_status
                }));
            }
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "activity_log", filter: `device_id=eq.${deviceId}` },
        (payload) => {
          const newAct = payload.new as any;
          if (newAct) {
              setActivities(prev => [newAct, ...prev].slice(0, 50));
              updateLastActivity(newAct);
          }
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

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) throw new Error("useDashboard must be used within DashboardProvider");
  return context;
}