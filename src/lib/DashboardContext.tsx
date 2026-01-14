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
  childName: string;
  deviceId: string | null;
  lastActivity: any | null;
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
  childName: "Kosi",
  deviceId: null,
  lastActivity: null,
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
      let targetDeviceId = state.deviceId;

      // Dacă nu avem ID-ul în state, îl căutăm din nou
      if (!targetDeviceId) {
          const { data: devices } = await supabase.from("devices").select("id").limit(1);
          targetDeviceId = devices?.[0]?.id;
      }

      if (!targetDeviceId) {
        console.error("Nu s-a găsit niciun dispozitiv asociat.");
        return;
      }

      console.log(`Trimit comanda ${commandType} către ${targetDeviceId}`);

      const { error } = await supabase.from("parent_commands").insert({
        device_id: targetDeviceId,
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
    try {
        // 1. Fetch Device Info
        const { data: devices } = await supabase
            .from('devices')
            .select('id, child_name')
            .limit(1);

        let currentDeviceId = state.deviceId;
        let currentChildName = state.childName;

        if (devices && devices.length > 0) {
            currentDeviceId = devices[0].id;
            if (devices[0].child_name) currentChildName = devices[0].child_name;
        }

        if (!currentDeviceId) return;

        // 2. Fetch Status - FILTRĂM DUPĂ DEVICE ID EXACT
        const { data: sessions } = await supabase
            .from('device_sessions')
            .select('*')
            .eq('device_id', currentDeviceId) // ⭐ Critic: Luăm doar sesiunea device-ului curent
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
            newState.deviceId = currentDeviceId;
            newState.childName = currentChildName;

            // Update Status
            if (sessions && sessions.length > 0) {
                const session = sessions[0];
                
                // ⭐ DEBUGGING TIMEZONE
                const lastSeenTime = new Date(session.last_seen).getTime();
                const nowTime = new Date().getTime();
                const diffMinutes = (nowTime - lastSeenTime) / 60000;

                console.log(`[Dashboard] LastSeen: ${session.last_seen} | Diff: ${diffMinutes.toFixed(2)} min | Battery: ${session.battery_level}%`);

                // Toleranță de 2 minute (Heartbeat e la 30 secunde)
                newState.deviceStatus = diffMinutes < 2.5 ? 'online' : 'offline'; 
                newState.batteryLevel = session.battery_level;
                newState.wifiStatus = session.wifi_status;
                newState.lastSeen = session.last_seen;
            } else {
                newState.deviceStatus = 'offline';
            }

            // Update Activities & Last Activity
            if (activityLogs && activityLogs.length > 0) {
                newState.activities = activityLogs;
                
                const lastLog = activityLogs[0];
                let details = {};
                
                try {
                    if (typeof lastLog.event_data === 'string') {
                         details = JSON.parse(lastLog.event_data);
                    } else {
                         details = lastLog.event_data;
                    }
                } catch (e) {
                    details = { detail: lastLog.event_data };
                }

                newState.lastActivity = {
                    type: lastLog.event_type,
                    ...details,
                    timestamp: lastLog.created_at
                };
            }

            return newState;
        });
    } catch (e) {
        console.error("Eroare refreshData:", e);
    }
  };

  // Realtime Subscription
  useEffect(() => {
    refreshData();

    // Ascultăm schimbări pe device_sessions
    const statusChannel = supabase
      .channel('dashboard-status')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'device_sessions' }, (payload) => {
          console.log("⚡ Realtime Update Session:", payload);
          refreshData();
      })
      .subscribe();

    // Ascultăm schimbări pe activity_log
    const activityChannel = supabase
      .channel('dashboard-activity')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_log' }, () => {
          console.log("⚡ Realtime New Activity");
          refreshData();
      })
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