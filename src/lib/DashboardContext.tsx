'use client'

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// --- TIPURI ---
type DeviceStatus = "online" | "offline" | "active";

// ✅ FIX 1: Definim corect ActivityItem cu câmpul opțional duration_seconds
interface ActivityItem {
  id: string;
  event_type: string;
  event_data: any;
  created_at: string;
  duration_seconds?: number; // <--- AICI ERA EROAREA DE BUILD
}

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
  activities: ActivityItem[]; // Folosim tipul strict
}

interface DashboardContextType {
  state: DashboardState;
  activities: ActivityItem[];
  sendCommand: (commandType: string, payload?: any) => Promise<void>;
  refreshData: () => Promise<void>;
  disconnectDevice: () => void; // ✅ FIX 2: Reintroducem funcția de deconectare
}

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

const DashboardContext = createContext<DashboardContextType>({
  state: initialState,
  activities: [],
  sendCommand: async () => {},
  refreshData: async () => {},
  disconnectDevice: () => {},
});

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DashboardState>(initialState);
  const supabase = createClientComponentClient();

  // 1. Load initial data
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedId = localStorage.getItem('kosi_device_id');
      if (savedId) {
        // Setăm ID-ul temporar ca să declanșăm refreshData
        setState(prev => ({ ...prev, deviceId: savedId }));
      }
    }
  }, []);

  // Efect secundar: Când avem deviceId, facem refresh
  useEffect(() => {
    if (state.deviceId) {
      refreshData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.deviceId]);

  const sendCommand = async (commandType: string, payload: any = null) => {
    try {
      let targetDeviceId = state.deviceId;

      // Fallback: Dacă nu avem ID în state, căutăm primul din DB (pentru teste)
      if (!targetDeviceId) {
          const { data: devices } = await supabase.from("devices").select("id").limit(1);
          targetDeviceId = devices?.[0]?.id || null;
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
        let currentDeviceId = state.deviceId;
        
        // Dacă nu avem deviceId în state, încercăm să luăm din LocalStorage sau DB
        if (!currentDeviceId && typeof window !== 'undefined') {
           currentDeviceId = localStorage.getItem('kosi_device_id');
        }

        if (!currentDeviceId) return;

        // Fetch info de bază
        const { data: deviceData } = await supabase
            .from('devices')
            .select('child_name')
            .eq('id', currentDeviceId)
            .single();

        let currentChildName = state.childName;
        if (deviceData) currentChildName = deviceData.child_name || 'Kosi';

        // Fetch Status
        const { data: sessions } = await supabase
            .from('device_sessions')
            .select('*')
            .eq('device_id', currentDeviceId)
            .order('last_seen', { ascending: false })
            .limit(1);

        // Fetch Activități
        const { data: activityLogs } = await supabase
            .from('activity_log')
            .select('*')
            .eq('device_id', currentDeviceId) // Filtrăm după device
            .order('created_at', { ascending: false })
            .limit(10);

        setState(prev => {
            const newState = { ...prev };
            newState.deviceId = currentDeviceId;
            newState.childName = currentChildName;

            // Logică Status
            if (sessions && sessions.length > 0) {
                const session = sessions[0];
                const lastSeenTime = new Date(session.last_seen).getTime();
                const nowTime = new Date().getTime();
                const diffMinutes = (nowTime - lastSeenTime) / 60000;

                if (session.status === 'offline') {
                    newState.deviceStatus = 'offline';
                } else {
                    newState.deviceStatus = diffMinutes < 2.5 ? 'online' : 'offline';
                }

                newState.batteryLevel = session.battery_level;
                newState.wifiStatus = session.wifi_status;
                newState.lastSeen = session.last_seen;
            } else {
                newState.deviceStatus = 'offline';
            }

            // Update Activities
            if (activityLogs && activityLogs.length > 0) {
                newState.activities = activityLogs;
                
                const lastLog = activityLogs[0];
                let details: any = {};
                
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

  // ✅ FIX 2: Funcția de Deconectare
  const disconnectDevice = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('kosi_device_id');
        window.location.href = '/dashboard/pairing';
    }
  };

  // Realtime Subscriptions
  useEffect(() => {
    const statusChannel = supabase
      .channel('dashboard-status')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'device_sessions' }, refreshData)
      .subscribe();

    const activityChannel = supabase
      .channel('dashboard-activity')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_log' }, refreshData)
      .subscribe();

    return () => {
      supabase.removeChannel(statusChannel);
      supabase.removeChannel(activityChannel);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DashboardContext.Provider value={{ 
        state, 
        activities: state.activities, 
        sendCommand, 
        refreshData,
        disconnectDevice 
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export const useDashboard = () => useContext(DashboardContext);