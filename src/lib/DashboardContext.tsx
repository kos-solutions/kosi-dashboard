"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "./supabaseClient";

interface DashboardState {
  deviceId: string | null;
  childName: string;
  deviceStatus: "active" | "idle" | "offline";
  lastActivity: any | null;
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
    lastActivity: null,
  });

  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    async function initDashboard() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      console.log("Caut dispozitiv pentru părintele:", user.id);

      // 1. Căutăm legătura în tabela 'parent_devices'
      // Aceasta este tabela ta de legătură
      const { data: link } = await supabase
        .from("parent_devices")
        .select("device_id")
        .eq("parent_id", user.id)
        .limit(1)
        .maybeSingle();

      if (link && link.device_id) {
        console.log("Legătură găsită către device:", link.device_id);

        // 2. Luăm detaliile dispozitivului (numele copilului) din tabela 'devices'
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
            
            // 3. Încărcăm log-urile reale
            fetchRealActivities(device.id);
        }
      } else {
          console.log("Nu s-a găsit nicio legătură în parent_devices.");
      }
    }

    initDashboard();
  }, []);

  // Effect separat pentru Real-time odată ce avem ID-ul
  useEffect(() => {
      if (!state.deviceId) return;

      const channel = supabase
        .channel("activity-monitor")
        .on("postgres_changes", 
            { event: "INSERT", schema: "public", table: "activity_log", filter: `device_id=eq.${state.deviceId}` }, 
            (payload) => {
              setActivities(prev => [payload.new, ...prev].slice(0, 15));
            }
        )
        .subscribe();

      return () => { supabase.removeChannel(channel); };
  }, [state.deviceId]);


  async function fetchRealActivities(deviceId: string) {
    const { data } = await supabase
      .from("activity_log")
      .select("*")
      .eq("device_id", deviceId)
      .order("created_at", { ascending: false })
      .limit(15);
    
    if (data) setActivities(data);
  }

  async function sendCommand(command: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !state.deviceId) return;

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

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) throw new Error("useDashboard must be used within DashboardProvider");
  return context;
};