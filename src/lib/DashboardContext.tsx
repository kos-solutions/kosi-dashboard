'use client'

import { supabase } from "./supabaseClient";
import { parentApi, DeviceRow } from "./parentApi";
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
  todayStats: { stories: number; drawings: number; games: number; learningTime: number };
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

const EMPTY: DashboardState = {
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
  todayStats: { stories: 0, drawings: 0, games: 0, learningTime: 0 },
};

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ro');
  const [state, setDashboardState] = useState<DashboardState>(EMPTY);

  const refreshData = async () => {
    try {
      // Fara sesiune de parinte nu avem ce incarca (anon e respins de backend).
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setDashboardState(EMPTY); return; }

      const devices: DeviceRow[] = await parentApi.devices();
      if (!devices.length) {
        // parinte logat, dar niciun device legat inca
        setDashboardState({ ...EMPTY, deviceId: null });
        return;
      }

      // Device preferat din localStorage, altfel primul legat.
      const preferred = typeof window !== 'undefined' ? localStorage.getItem('kosi_device_id') : null;
      const device = devices.find(d => d.id === preferred) ?? devices[0];

      const activities: ActivityItem[] = await parentApi.activity(device.id, { limit: 100 });

      const drawings = activities
        .filter(a => a.event_type === 'DRAW')
        .map(a => ({
          id: a.id,
          created_at: a.created_at,
          image_url: typeof a.event_data === 'string' ? a.event_data.replace(/(^"|"$)/g, '') : a.event_data,
        }));

      const todayStr = new Date().toDateString();
      const today = activities.filter(a => new Date(a.created_at).toDateString() === todayStr);
      const stats = {
        stories: today.filter(a => a.event_type === 'story_played' || a.event_type === 'STORY').length,
        drawings: today.filter(a => a.event_type === 'DRAW').length,
        games: today.filter(a => a.event_type === 'GAME').length,
        learningTime: Math.floor(today.reduce((acc, c) => acc + (c.duration_seconds || 0), 0) / 60),
      };

      const lastSeen = device.session?.last_seen ?? "";
      const isOnline = lastSeen ? (Date.now() - new Date(lastSeen).getTime()) < 5 * 60 * 1000 : false;

      setDashboardState({
        deviceStatus: isOnline ? 'online' : 'offline',
        batteryLevel: device.session?.battery_level ?? 0,
        wifiStatus: device.session?.wifi_status ?? 'offline',
        lastSeen,
        childName: device.child_name || "Micuțul tău",
        deviceId: device.id,
        pairingCode: device.pairing_code,
        activities: activities.slice(0, 30),
        drawings,
        lastActivity: activities[0] || null,
        todayStats: stats,
      });
    } catch (e) {
      console.error("Sync Error:", e);
    }
  };

  useEffect(() => {
    refreshData();
    // Realtime nu merge prin anon pe proiectul nou -> polling simplu.
    const id = setInterval(refreshData, 20000);
    const { data: sub } = supabase.auth.onAuthStateChange(() => refreshData());
    return () => { clearInterval(id); sub.subscription.unsubscribe(); };
  }, []);

  const sendCommand = async (commandType: string, payload?: any) => {
    if (!state.deviceId) return;
    let finalPayload = payload;
    if (typeof payload === 'object' && payload?.text) finalPayload = payload.text;
    try {
      await parentApi.sendCommand(state.deviceId, commandType, finalPayload != null ? String(finalPayload) : undefined);
    } catch (e) {
      console.error("sendCommand:", e);
    }
  };

  const disconnectDevice = () => {
    const id = state.deviceId;
    if (typeof window !== 'undefined') localStorage.removeItem('kosi_device_id');
    const after = () => { setDashboardState(EMPTY); };
    if (id) parentApi.unpair(id).catch(() => {}).finally(after);
    else after();
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
      disconnectDevice,
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
