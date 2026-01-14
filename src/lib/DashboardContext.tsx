"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// Definim tipurile de date
type DeviceStatus = "online" | "offline" | "active";

interface DashboardState {
  deviceStatus: DeviceStatus;
  batteryLevel: number;
  wifiStatus: string;
  lastSeen: string;
  childName: string; // ⭐ ADĂUGAT: Numele copilului
  todayStats: {
    stories: number;
    drawings: number;
    games: number;
    learningTime: number;
  };
  activities: any[]; 
}

interface DashboardContextType {
  state: DashboardState;
  activities: any[];
  sendCommand: (commandType: string, payload?: any) => Promise<void>;
  refreshData: () => Promise<void>;
}

// Starea inițială
const initialState: DashboardState = {
  deviceStatus: "offline",
  batteryLevel: 0,
  wifiStatus: "unknown",
  lastSeen: new Date().toISOString(),
  childName: "Kosi", // Valoare default
  todayStats: {
    stories: 0,
    drawings: 0,
    games: 0,
    learningTime: 0,
  },
  activities: [], 
};

// Creăm contextul
const DashboardContext = createContext<DashboardContextType>({
  state: initialState,
  activities: [],
  sendCommand: async () => {},
  refreshData: async () => {},
});

// Provider-ul principal
export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DashboardState>(initialState);
  const supabase = createClientComponentClient();

  // Funcția pentru a trimite comenzi către Android
  const sendCommand = async (commandType: string, payload: any = null) => {
    try {
      const { data: devices } = await supabase.from("devices").select("id").limit(1);
      const deviceId = devices?.[0]?.id;

      if (!deviceId) {
        console.error("Nu s-a găsit niciun dispozitiv asociat.");
        return;
      }

      console.log(`Trimit comanda ${commandType} către ${deviceId}`);

      const { error } = await supabase.from("parent_commands").insert({
        device_id: deviceId,
        command_type: commandType,
        payload: payload,
        is_executed: false,
      });

      if (error) throw error;
      console.log("Comanda trimisă cu succes!");

    } catch (error) {
      console.error("Eroare la trimiterea comenzii:", error);
    }
  };

  const refreshData = async () => {
    // 1. Fetch Device Info (Nume copil)
    const { data: devices } = await supabase
        .from('devices')
        .select('child_name')
        .limit(1);

    // 2. Fetch Status
    const { data: sessions } = await supabase
        .from('device_sessions')
        .select('*')
        .order('last_seen', { ascending: false })
        .limit(1);

    // 3. Fetch Activități
    const { data: activityLogs } = await supabase
        .from('activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

    setState(prev => {
        const newState = { ...prev };

        // Update Nume Copil
        if (devices && devices.length > 0 && devices[0].child_name) {
            newState.childName = devices[0].child_name;
        }

        // Update Status
        if (sessions && sessions.length > 0) {
            const session = sessions[0];
            const lastSeenDate = new Date(session.last_seen);
            const diffMinutes = (new Date().getTime() - lastSeenDate.getTime()) / 60000;
            
            newState.deviceStatus = diffMinutes < 2 ? 'online' : 'offline';
            newState.batteryLevel = session.battery_level;
            newState.wifiStatus = session.wifi_status;
            newState.lastSeen = session.last_seen;
        }

        // Update Activities
        if (activityLogs) {
            newState.activities = activityLogs;
        }

        return newState;
    });
  };

  // Realtime Subscription
  useEffect(() => {
    refreshData();

    // Ascultăm schimbări la sesiuni (baterie/status)
    const statusChannel = supabase
      .channel('dashboard-status')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'device_sessions' }, refreshData)
      .subscribe();

    // Ascultăm schimbări la loguri (activitate nouă)
    const activityChannel = supabase
      .channel('dashboard-activity')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_log' }, refreshData)
      .subscribe();

    return () => {
      supabase.removeChannel(statusChannel);
      supabase.removeChannel(activityChannel);
    };
  }, []);

  return (
    <DashboardContext.Provider value={{ 
        state, 
        activities: state.activities, 
        sendCommand, 
        refreshData 
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export const useDashboard = () => useContext(DashboardContext);