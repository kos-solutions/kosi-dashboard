export type ChildStatus = "online" | "idle" | "offline";
export type EmotionStatus = "calm" | "neutral" | "agitated";

export interface Child {
  id: string;
  name: string;
}

export interface Device {
  id: string;
  name: string;
  wifiStatus: "connected" | "weak" | "offline";
  battery?: number;
}

export interface ActivityEvent {
  id: string;
  type: string;
  timestamp: string;
}
