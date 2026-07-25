import { create } from "zustand";

type View = "wide" | "desk";

type RoomState = {
  lampOn: boolean;
  timeOfDay: "day" | "night";
  screenOn: boolean;
  view: View;
  hovered: string | null;
  toggleLamp: () => void;
  toggleTimeOfDay: () => void;
  toggleScreen: () => void;
  toggleView: () => void;
  setHovered: (id: string | null) => void;
};

// Shared room state — the point of this project over 04's local useState:
// several unrelated components (lamp mesh, ambient light rig, HUD toggle
// row, hover tooltip) all read/write the same state without prop drilling.
export const useRoomStore = create<RoomState>((set) => ({
  lampOn: true,
  timeOfDay: "day",
  screenOn: true,
  view: "wide",
  hovered: null,
  toggleLamp: () => set((s) => ({ lampOn: !s.lampOn })),
  toggleTimeOfDay: () => set((s) => ({ timeOfDay: s.timeOfDay === "day" ? "night" : "day" })),
  toggleScreen: () => set((s) => ({ screenOn: !s.screenOn })),
  toggleView: () => set((s) => ({ view: s.view === "wide" ? "desk" : "wide" })),
  setHovered: (id) => set({ hovered: id }),
}));
