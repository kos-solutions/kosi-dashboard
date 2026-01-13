"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";

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
  sessionHistory: any[];
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

  const [sessionHistory, setSessionHistory] = useState<any[]>([]);

  useEffect(() => {
    async function initDashboard() {
      // 1. Verificăm user-ul logat
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      console.log("🔍 Caut dispozitiv pentru user:", user.id);

      // 2. Căutăm legătura în parent_devices
      const { data: link, error: linkError } = await supabase
        .from("parent_devices")
        .select("device_id")
        .eq("parent_id", user.id)
        .limit(1) // Luăm primul dispozitiv asociat (pentru MVP)
        .maybeSingle();

      if (linkError) console.error("Eroare link:", linkError);

      if (link && link.device_id) {
        console.log("✅ Legătură găsită:", link.device_id);
        
        // 3. Luăm detaliile dispozitivului
        const { data: device } = await supabase
          .from("devices")
          .select("id, child_name") // Atenție: child_name, nu name
          .eq("id", link.device_id)
          .single();

        if (device) {
          setState(prev => ({
            ...prev,
            deviceId: device.id,
            childName: device.child_name || "Miriam"
          }));
          
          // Pornim ascultarea pentru acest device specific
          subscribeToDevice(device.id);
        }
      } else {
        console.log("⚠️ Niciun dispozitiv asociat în parent_devices.");
      }
    }

    initDashboard();
  }, []);

  function subscribeToDevice(deviceId: string) {
    console.log("📡 Abonare la update-uri pentru:", deviceId);
    
    const channel = supabase
      .channel(`device-${deviceId}`)
      .on(
        "postgres_changes", 
        { event: "*", schema: "public", table: "device_sessions", filter: `device_id=eq.${deviceId}` }, 
        (payload) => handleDeviceUpdate(payload.new)
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }

  function handleDeviceUpdate(data: any) {
    console.log("⚡ Update primit:", data);
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
        device_id: state.deviceId, // Important: legăm comanda de device
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