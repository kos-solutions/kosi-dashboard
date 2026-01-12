"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "./supabaseClient";

type DeviceStatus = "active" | "idle" | "offline";
type Mood = "calm" | "neutral" | "agitated";

interface DashboardState {
  deviceId: string | null;
  childName: string;
  deviceStatus: DeviceStatus;
  mood: Mood;
  lastActivity: { type: string; detail: string; time: string } | null;
}

interface DashboardContextType {
  state: DashboardState;
  sendCommand: (command: string) => void;
  activities: any[];
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DashboardState>({
    deviceId: null,
    childName: "Miriam",
    deviceStatus: "idle",
    mood: "calm",
    lastActivity: null,
  });
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    async function initDashboard() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Căutăm dispozitivul asociat acestui părinte
      const { data: device } = await supabase
        .from("devices")
        .select("id, name")
        .limit(1)
        .maybeSingle();

      if (device) {
        setState(prev => ({ ...prev, deviceId: device.id, childName: device.name || "Miriam" }));
        fetchLatestActivities(device.id);
      }
    }

    async function fetchLatestActivities(deviceId: string) {
      const { data } = await supabase
        .from("device_logs")
        .select("*")
        .eq("device_id", deviceId)
        .order("created_at", { ascending: false })
        .limit(10);
      
      if (data && data.length > 0) {
        setActivities(data);
        setState(prev => ({
          ...prev,
          lastActivity: {
            type: data[0].activity_type,
            detail: data[0].detail,
            time: new Date(data[0].created_at).toLocaleTimeString()
          }
        }));
      }
    }

    initDashboard();

    // Real-time subscription pentru activitate nouă
    const channel = supabase
      .channel("live-activity")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "device_logs" }, 
        (payload) => {
          setActivities(prev => [payload.new, ...prev].slice(0, 10));
          setState(prev => ({
            ...prev,
            lastActivity: {
              type: payload.new.activity_type,
              detail: payload.new.detail,
              time: "Chiar acum"
            }
          }));
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  async function sendCommand(command: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !state.deviceId) return;

    await supabase.from("parent_commands").insert({
      device_id: state.deviceId,
      user_id: user.id,
      command_type: command
    });
  }

  return (
    <DashboardContext.Provider value={{ state, sendCommand, activities }}>
      {children}
    </DashboardContext.Provider>
  );
}

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) throw new Error("useDashboard must be used within DashboardProvider");
  return context;
};