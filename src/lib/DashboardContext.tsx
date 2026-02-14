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
  pairingCode: string;
  activities: ActivityItem[];
  drawings: any[];
}

interface DashboardContextType {
  state: DashboardState;
  activities: ActivityItem[]; // Critic pentru build-ul Vercel
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
      // Căutăm device-ul salvat local sau ultimul activ (pentru showcase)
      const savedHardwareId = typeof window !== 'undefined' ? localStorage.getItem('kosi_device_id') : null;
      
      let query = supabase.from('devices').select('*');
      
      if (savedHardwareId) {
        query = query.eq('device_id', savedHardwareId);
      } else {
        query = query.order('last_active_at', { ascending: false }).limit(1);
      }

      const { data: deviceData } = await query.maybeSingle();

      if (deviceData) {
        // Folosim UUID-ul (deviceData.id) pentru a trage restul datelor
        const [activityLogs, drawingsData] = await Promise.all([
          supabase.from('activity_log').select('*').eq('device_id', deviceData.id).order('created_at', { ascending: false }).limit(20),
          supabase.from('drawings').select('*').eq('device_id', deviceData.id).order('created_at', { ascending: false }).limit(12)
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
      }
    } catch (e) {
      console.error("Eroare Sincronizare:", e);
    }
  };

  useEffect(() => {
    refreshData();
    
    // Subscripție Realtime pentru orice schimbare (pairing code nou, desene noi etc.)
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