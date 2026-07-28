"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene";

export function PlanetViewer() {
  return (
    <div className="relative h-[100dvh] w-full bg-[#0b0a16]">
      <Canvas camera={{ position: [0, 0.35, 5.6], fov: 40 }} dpr={[1, 1.8]}>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>

      <div className="pointer-events-none absolute left-6 top-6 sm:left-10 sm:top-10">
        <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-white/30">
          Creative Frontend Lab — 05
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-white/90 sm:text-3xl">
          Interactive Planet
        </h1>
      </div>

      <p className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.25em] text-white/30 sm:bottom-10">
        Drag to spin · scroll to zoom
      </p>
    </div>
  );
}
