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
  deviceId: string | null; // Acesta va fi UUID-ul (id)
  pairingCode: string;
  activities: ActivityItem[];
  drawings: any[];
}

interface DashboardContextType {
  state: DashboardState;
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
    wifiStatus: "offline",
    lastSeen: "",
    childName: "Explorator",
    deviceId: null,
    pairingCode: "....",
    activities: [],
    drawings: [],
  });

  const refreshData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Găsim dispozitivul asociat utilizatorului curent
      const { data: deviceData } = await supabase
        .from('devices')
        .select('*')
        .eq('user_id', user.id) // IMPORTANT: Căutăm device-ul testerului logat
        .maybeSingle();

      if (!deviceData) return;

      // 2. Tragem activitățile și desenele folosind UUID-ul (deviceData.id)
      // Folosind deviceData.id (UUID) eliminăm eroarea 22P02
      const [activityLogs, drawingsData] = await Promise.all([
        supabase.from('activity_log').select('*').eq('device_id', deviceData.id).order('created_at', { ascending: false }).limit(20),
        supabase.from('drawings').select('*').eq('device_id', deviceData.id).order('created_at', { ascending: false }).limit(10)
      ]);

      setDashboardState(prev => ({
        ...prev,
        deviceId: deviceData.id,
        pairingCode: deviceData.pairing_code,
        childName: deviceData.child_name || "Micuțul tău",
        activities: activityLogs.data || [],
        drawings: drawingsData.data || [],
        deviceStatus: deviceData.is_paired ? "active" : "offline"
      }));
    } catch (e) {
      console.error("Sync Error:", e);
    }
  };

  useEffect(() => {
    refreshData();
    
    // Subscripție Realtime pentru activitate nouă
    const activityChannel = supabase.channel('dashboard-sync')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_log' }, refreshData)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'devices' }, refreshData)
      .subscribe();

    return () => { supabase.removeChannel(activityChannel); };
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
    supabase.auth.signOut().then(() => { window.location.href = '/login'; });
  };

  return (
    <DashboardContext.Provider value={{ state, language, setLanguage, t: translations[language], sendCommand, refreshData, disconnectDevice }}>
      {children}
    </DashboardContext.Provider>
  );
}

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) throw new Error("useDashboard must be used within DashboardProvider");
  return context;
};