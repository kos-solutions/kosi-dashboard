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
  todayStats: {
    stories: number;
    drawings: number;
    games: number;
    learningTime: number;
  };
  recentActivity: any[]; // Poți defini un tip mai strict aici dacă vrei
}

interface DashboardContextType {
  state: DashboardState;
  sendCommand: (commandType: string, payload?: any) => Promise<void>;
  refreshData: () => Promise<void>;
}

// Starea inițială
const initialState: DashboardState = {
  deviceStatus: "offline",
  batteryLevel: 0,
  wifiStatus: "unknown",
  lastSeen: new Date().toISOString(),
  todayStats: {
    stories: 0,
    drawings: 0,
    games: 0,
    learningTime: 0,
  },
  recentActivity: [],
};

// Creăm contextul
const DashboardContext = createContext<DashboardContextType>({
  state: initialState,
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
      // 1. Luăm ID-ul dispozitivului (în mod ideal ar fi selectat din UI)
      // Pentru demo, luăm primul dispozitiv găsit
      const { data: devices } = await supabase.from("devices").select("id").limit(1);
      const deviceId = devices?.[0]?.id;

      if (!deviceId) {
        console.error("Nu s-a găsit niciun dispozitiv asociat.");
        return;
      }

      console.log(`Trimit comanda ${commandType} către ${deviceId}`);

      // 2. Inserăm comanda în tabela parent_commands
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
    // Aici poți adăuga logica de fetch pentru statistici reale
    // Momentan lăsăm datele mock sau statice
    
    // Exemplu fetch status dispozitiv
    const { data: sessions } = await supabase
        .from('device_sessions')
        .select('*')
        .order('last_seen', { ascending: false })
        .limit(1);

    if (sessions && sessions.length > 0) {
        const session = sessions[0];
        // Calculăm dacă e online (dacă a fost văzut în ultimele 2 minute)
        const lastSeenDate = new Date(session.last_seen);
        const diffMinutes = (new Date().getTime() - lastSeenDate.getTime()) / 60000;
        
        setState(prev => ({
            ...prev,
            deviceStatus: diffMinutes < 2 ? 'online' : 'offline',
            batteryLevel: session.battery_level,
            wifiStatus: session.wifi_status,
            lastSeen: session.last_seen
        }));
    }
  };

  // Realtime Subscription pentru status
  useEffect(() => {
    refreshData();

    const channel = supabase
      .channel('dashboard-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'device_sessions' },
        (payload) => {
          console.log('Update de la device:', payload);
          refreshData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <DashboardContext.Provider value={{ state, sendCommand, refreshData }}>
      {children}
    </DashboardContext.Provider>
  );
}

// ⭐ FIX-UL ESTE AICI: Exportăm explicit hook-ul
export const useDashboard = () => useContext(DashboardContext);