"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene";
import { useRoomStore } from "@/store/roomStore";

const HOVER_LABELS: Record<string, string> = {
  desk: "Desk — click to zoom in",
  monitor: "Monitor — click to toggle screen",
  lamp: "Lamp — click to toggle",
  window: "Window — click to flip day/night",
  mug: "Mug — just a mug",
  plant: "Plant — also just a plant",
};

function Hud() {
  const lampOn = useRoomStore((s) => s.lampOn);
  const timeOfDay = useRoomStore((s) => s.timeOfDay);
  const screenOn = useRoomStore((s) => s.screenOn);
  const view = useRoomStore((s) => s.view);
  const hovered = useRoomStore((s) => s.hovered);
  const toggleLamp = useRoomStore((s) => s.toggleLamp);
  const toggleTimeOfDay = useRoomStore((s) => s.toggleTimeOfDay);
  const toggleScreen = useRoomStore((s) => s.toggleScreen);
  const toggleView = useRoomStore((s) => s.toggleView);

  const isDay = timeOfDay === "day";
  const ink = isDay ? "text-[#2b2118]" : "text-white";
  const inkSoft = isDay ? "text-[#2b2118]/45" : "text-white/40";

  return (
    <>
      <div className="pointer-events-none absolute left-6 top-6 sm:left-10 sm:top-10">
        <p className={`text-[11px] font-medium uppercase tracking-[0.35em] ${inkSoft}`}>
          Creative Frontend Lab — 06
        </p>
        <h1 className={`mt-1 text-2xl font-bold tracking-tight sm:text-3xl ${ink}`}>
          Sunny&rsquo;s Desk
        </h1>
        <p className={`mt-1 h-4 text-xs ${inkSoft}`}>
          {hovered ? HOVER_LABELS[hovered] : "Click things."}
        </p>
      </div>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2 sm:bottom-10">
        <button
          onClick={toggleLamp}
          className={`rounded-full px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.1em] transition-colors ${
            lampOn ? "bg-[#ffd23f] text-[#2b2118]" : "bg-black/20 text-white/70"
          }`}
        >
          Lamp {lampOn ? "on" : "off"}
        </button>
        <button
          onClick={toggleTimeOfDay}
          className="rounded-full bg-black/20 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.1em] text-white/70"
        >
          {isDay ? "Day" : "Night"}
        </button>
        <button
          onClick={toggleScreen}
          className="rounded-full bg-black/20 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.1em] text-white/70"
        >
          Screen {screenOn ? "on" : "off"}
        </button>
        <button
          onClick={toggleView}
          className="rounded-full bg-black/20 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.1em] text-white/70"
        >
          {view === "wide" ? "Zoom in" : "Zoom out"}
        </button>
      </div>
    </>
  );
}

export function RoomViewer() {
  return (
    <div className="relative h-[100dvh] w-full">
      <Canvas camera={{ position: [3.0, 2.2, 3.6], fov: 42 }} dpr={[1, 1.8]}>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      <Hud />
    </div>
  );
}
