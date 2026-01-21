'use client'

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { translations, Language } from "./translations";

// --- TIPURI ---
type DeviceStatus = "online" | "offline" | "active";

interface ActivityItem {
  id: string;
  event_type: string;
  event_data: any;
  created_at: string;
  duration_seconds?: number;
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
  activities: ActivityItem[];
}

interface DashboardContextType {
  state: DashboardState;
  activities: ActivityItem[];
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['en']; // Folosim tipul de la engleză ca bază
  sendCommand: (commandType: string, payload?: any) => Promise<void>;
  refreshData: () => Promise<void>;
  disconnectDevice: () => void;
}

const initialState: DashboardState = {
  deviceStatus: "offline",
  batteryLevel: 0,
  wifiStatus: "unknown",
  lastSeen: new Date().toISOString(),
  childName: "Kosi",
  deviceId: null,
  lastActivity: null,
  todayStats: { stories: 0, drawings: 0, games: 0, learningTime: 0 },
  activities: [], 
};

// @ts-ignore
const DashboardContext = createContext<DashboardContextType>({});

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DashboardState>(initialState);
  const [language, setLanguageState] = useState<Language>('en');
  const supabase = createClientComponentClient();

  // Load language preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
        const savedLang = localStorage.getItem('kosi_lang') as Language;
        if (savedLang) setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
      setLanguageState(lang);
      localStorage.setItem('kosi_lang', lang);
  }

  // Load initial device data
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedId = localStorage.getItem('kosi_device_id');
      if (savedId) {
        setState(prev => ({ ...prev, deviceId: savedId }));
      }
    }
  }, []);

  // Când avem deviceId, facem refresh
  useEffect(() => {
    if (state.deviceId) {
      refreshData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.deviceId]);

  // ✅ FIX REFRESH: Auto-Refresh la fiecare 30 de secunde
  // Asta asigură că dacă trece timpul și nu mai primim semnal, statusul trece pe Offline automat
  useEffect(() => {
    if (!state.deviceId) return;

    const intervalId = setInterval(() => {
        // Nu vrem să facem spam la rețea, dar vrem să recalculăm statusul
        // refreshData face fetch, ceea ce e ok la 30s
        refreshData(); 
    }, 30000); // 30 secunde

    return () => clearInterval(intervalId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.deviceId]);


  const sendCommand = async (commandType: string, payload: any = null) => {
    try {
      let targetDeviceId = state.deviceId;
      if (!targetDeviceId) {
          const { data: devices } = await supabase.from("devices").select("id").limit(1);
          targetDeviceId = devices?.[0]?.id || null;
      }
      if (!targetDeviceId) return;

      await supabase.from("parent_commands").insert({
        device_id: targetDeviceId,
        command_type: commandType,
        payload: payload,
        is_executed: false,
      });
    } catch (error) {
      console.error("Eroare comanda:", error);
    }
  };

  const refreshData = async () => {
    try {
        let currentDeviceId = state.deviceId;
        if (!currentDeviceId && typeof window !== 'undefined') {
           currentDeviceId = localStorage.getItem('kosi_device_id');
        }
        if (!currentDeviceId) return;

        // Fetch Device Info
        const { data: deviceData } = await supabase.from('devices').select('child_name').eq('id', currentDeviceId).single();
        let currentChildName = state.childName;
        if (deviceData) currentChildName = deviceData.child_name || 'Kosi';

        // Fetch Status (Sesiuni)
        const { data: sessions } = await supabase.from('device_sessions').select('*').eq('device_id', currentDeviceId).order('last_seen', { ascending: false }).limit(1);

        // Fetch Activities
        const { data: activityLogs } = await supabase.from('activity_log').select('*').eq('device_id', currentDeviceId).order('created_at', { ascending: false }).limit(10);

        setState(prev => {
            const newState = { ...prev };
            newState.deviceId = currentDeviceId;
            newState.childName = currentChildName;

            if (sessions && sessions.length > 0) {
                const session = sessions[0];
                const lastSeenTime = new Date(session.last_seen).getTime();
                const nowTime = new Date().getTime();
                
                // Diferența în minute
                const diffMinutes = (nowTime - lastSeenTime) / 60000;

                // ⚠️ LOGICĂ STATUS: Dacă au trecut mai puțin de 2.5 min, e Online
                newState.deviceStatus = diffMinutes < 2.5 ? 'online' : 'offline';
                newState.batteryLevel = session.battery_level;
                newState.lastSeen = session.last_seen;
            } else {
                newState.deviceStatus = 'offline';
            }

            if (activityLogs && activityLogs.length > 0) {
                newState.activities = activityLogs;
            }
            return newState;
        });
    } catch (e) { console.error(e); }
  };

  const disconnectDevice = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('kosi_device_id');
        window.location.href = '/dashboard/pairing';
    }
  };

  // Realtime Subscriptions (Rămân active pentru update-uri instantanee)
  useEffect(() => {
    const statusChannel = supabase.channel('dashboard-status')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'device_sessions' }, refreshData)
      .subscribe();
    const activityChannel = supabase.channel('dashboard-activity')
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
        language,
        setLanguage,
        t: translations[language], 
        sendCommand, 
        refreshData,
        disconnectDevice 
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export const useDashboard = () => useContext(DashboardContext);