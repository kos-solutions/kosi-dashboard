export type DashboardState = {
  childName: string;
  deviceStatus: "active" | "idle" | "offline";
  mood: "calm" | "neutral" | "agitated";
  lastInteraction: string;
  lastMode: string;
  hasAlert: boolean;
};

let state: DashboardState = {
  childName: "Andrei",
  deviceStatus: "active",
  mood: "calm",
  lastInteraction: "acum 12 minute",
  lastMode: "Poveste",
  hasAlert: false,
};

export function getDashboardState(): DashboardState {
  return state;
}

export function sendCommand(command: string) {
  console.log("COMMAND SENT:", command);

  // simulări simple
  if (command === "SET_MODE_SILENT") {
    state = { ...state, deviceStatus: "idle" };
  }

  if (command === "SET_MODE_STORY") {
    state = { ...state, lastMode: "Poveste" };
  }

  if (command === "END_SESSION") {
    state = { ...state, deviceStatus: "offline" };
  }
}
