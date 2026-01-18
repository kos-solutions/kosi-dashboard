'use client'

import React, { createContext, useContext, useEffect, ReactNode, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// --- Tipuri ---
type DeviceStatus = 'offline' | 'online' | 'active'

interface DashboardState {
  deviceId: string | null
  childName: string
  deviceStatus: DeviceStatus
  batteryLevel: number
  wifiStatus: 'weak' | 'medium' | 'strong'
  lastSeen: string | null
  todayStats: {
    stories: number
    drawings: number
    games: number
    learningTime: number
  }
  lastActivity: {
    type: string
    detail: string
    timestamp: string
  } | null
}

interface ActivityItem {
  id: string
  event_type: string
  event_data: any
  created_at: string
}

interface DashboardContextType {
  state: DashboardState
  activities: ActivityItem[]
  sendCommand: (command: string, payload?: any) => Promise<void>
  refreshData: () => Promise<void>
  setDeviceId: (id: string) => void
  disconnectDevice: () => void // 👈 Asta este funcția nouă critică!
}

// --- Initial State ---
const initialState: DashboardState = {
  deviceId: null,
  childName: 'Copil',
  deviceStatus: 'offline',
  batteryLevel: 0,
  wifiStatus: 'medium',
  lastSeen: null,
  todayStats: { stories: 0, drawings: 0, games: 0, learningTime: 0 },
  lastActivity: null
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DashboardState>(initialState)
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const supabase = createClientComponentClient()

  // 1. La încărcare, verificăm LocalStorage
  useEffect(() => {
    // Verificăm dacă suntem în browser (client-side)
    if (typeof window !== 'undefined') {
      const savedId = localStorage.getItem('kosi_device_id')
      if (savedId) {
        fetchDeviceData(savedId)
      }
    }
  }, [])

  // 2. Funcție care aduce datele
  const fetchDeviceData = async (deviceId: string) => {
    try {
      const { data: device } = await supabase
        .from('devices')
        .select('*')
        .eq('device_id', deviceId)
        .single()
      
      if (device) {
        setState(prev => ({
          ...prev,
          deviceId: deviceId,
          childName: device.child_name || 'Kosi',
          deviceStatus: device.status === 'online' ? 'online' : 'offline',
          lastSeen: device.last_seen
        }))

        const { data: acts } = await supabase
          .from('activity_log')
          .select('*')
          .eq('device_id', deviceId)
          .order('created_at', { ascending: false })
          .limit(10)

        if (acts) setActivities(acts)
      }
    } catch (e) {
      console.error("Eroare la fetch:", e)
    }
  }

  // 3. Trimite Comenzi
  const sendCommand = async (command: string, payload: any = {}) => {
    if (!state.deviceId) return
    console.log(`Sending ${command} to ${state.deviceId}`, payload)
    
    await supabase.from('commands').insert({
        device_id: state.deviceId,
        command: command,
        payload: payload,
        status: 'pending'
    })
  }

  // 4. Pairing (Setare ID)
  const setDeviceId = (id: string) => {
    localStorage.setItem('kosi_device_id', id)
    fetchDeviceData(id)
  }

  // 5. DECONECTARE (Funcția Nouă) 🔌
  const disconnectDevice = () => {
    // 1. Ștergem din memorie
    localStorage.removeItem('kosi_device_id')
    localStorage.removeItem('kosi_child_name')
    
    // 2. Resetăm starea
    setState(initialState)
    setActivities([])
    
    // 3. Redirecționăm forțat pentru a cere codul din nou
    window.location.href = '/dashboard/pairing'
  }

  return (
    <DashboardContext.Provider value={{ 
      state, 
      activities, 
      sendCommand, 
      refreshData: async () => { if(state.deviceId) await fetchDeviceData(state.deviceId) },
      setDeviceId,
      disconnectDevice 
    }}>
      {children}
    </DashboardContext.Provider>
  )
}

export const useDashboard = () => {
  const context = useContext(DashboardContext)
  if (!context) throw new Error('useDashboard must be used within a DashboardProvider')
  return context
}