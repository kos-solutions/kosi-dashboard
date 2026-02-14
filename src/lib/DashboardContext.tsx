'use client'

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { translations, Language } from "./translations";

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
  pairingCode: string;
  activities: ActivityItem[];
  drawings: any[];
  lastActivity: any;
  // Statistici calculate global
  todayStats: {
    stories: number;
    drawings: number;
    games: number;
    learningTime: number;
  };
}

interface DashboardContextType {
  state: DashboardState;
  activities: ActivityItem[];
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['ro'];
  sendCommand: (commandType: string, payload?: any) => Promise<void>;
  refreshData: () => Promise<void>;
  disconnectDevice: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const supabase = createClientComponentClient();
  const [language, setLanguage] = useState<Language>('ro');
  
  const [state, setDashboardState] = useState<DashboardState>({
    deviceStatus: "offline",
    batteryLevel: 0,
    wifiStatus: "lipsă",
    lastSeen: "",
    childName: "Explorator",
    deviceId: null,
    pairingCode: "....",
    activities: [],
    drawings: [],
    lastActivity: null,
    todayStats: { stories: 0, drawings: 0, games: 0, learningTime: 0 }
  });

  const refreshData = async () => {
    try {
      // 1. Identificăm dispozitivul (Hardware ID din localStorage sau fallback)
      const savedHardwareId = typeof window !== 'undefined' ? localStorage.getItem('kosi_device_id') : null;
      let query = supabase.from('devices').select('*');
      
      if (savedHardwareId) {
        query = query.eq('device_id', savedHardwareId);
      } else {
        query = query.order('last_active_at', { ascending: false }).limit(1);
      }

      const { data: deviceData } = await query.maybeSingle();

      if (deviceData) {
        // 2. Tragem datele folosind UUID-ul (deviceData.id) - CRITIC PENTRU DESENE
        const [activityLogs, drawingsData] = await Promise.all([
          supabase.from('activity_log').select('*').eq('device_id', deviceData.id).order('created_at', { ascending: false }).limit(50),
          supabase.from('drawings').select('*').eq('device_id', deviceData.id).order('created_at', { ascending: false }).limit(12)
        ]);

        const activities = activityLogs.data || [];
        const drawings = drawingsData.data || [];

        // 3. Calculăm statisticile
        const stats = {
            stories: activities.filter(a => a.event_type === 'story_played' || a.event_type === 'STORY').length,
            drawings: activities.filter(a => a.event_type === 'DRAW').length + drawings.length,
            games: activities.filter(a => a.event_type === 'GAME').length,
            learningTime: Math.floor(activities.reduce((acc, curr) => acc + (curr.duration_seconds || 0), 0) / 60)
        };

        // 4. Verificăm dacă e online (activ în ultimele 5 minute)
        const lastActive = new Date(deviceData.last_active_at).getTime();
        const now = new Date().getTime();
        const isOnline = (now - lastActive) < 5 * 60 * 1000;

        setDashboardState(prev => ({
          ...prev,
          deviceId: deviceData.id,
          pairingCode: deviceData.pairing_code,
          childName: deviceData.child_name || "Micuțul tău",
          batteryLevel: deviceData.battery_level || 0, // Aici citim bateria reală
          wifiStatus: deviceData.wifi_status || 'offline',
          deviceStatus: isOnline ? 'online' : 'offline',
          lastSeen: deviceData.last_active_at,
          activities: activities,
          drawings: drawings,
          lastActivity: activities[0] || null,
          todayStats: stats
        }));
      }
    } catch (e) {
      console.error("Sync Error:", e);
    }
  };

  useEffect(() => {
    refreshData();
    const channel = supabase.channel('global-dashboard-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'devices' }, refreshData)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_log' }, refreshData)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'drawings' }, refreshData)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const sendCommand = async (commandType: string, payload?: any) => {
    if (!state.deviceId) return;
    await supabase.from('device_commands').insert([{
      device_id: state.deviceId,
      command_type: commandType,
      payload: payload,
      status: 'pending'
    }]);
  };

  const disconnectDevice = () => {
    localStorage.removeItem('kosi_device_id');
    supabase.auth.signOut().then(() => { window.location.href = '/'; });
  };

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

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) throw new Error("useDashboard must be used within DashboardProvider");
  return context;
};