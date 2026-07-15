"use client";

import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene";

export function Exploder() {
  const [explode, setExplode] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="studio-backdrop relative h-[100dvh] w-full">
      <Canvas camera={{ position: [3.2, 1.8, 4.6], fov: 38 }} dpr={[1, 1.8]}>
        <Suspense fallback={null}>
          <Scene explode={explode} hovered={hovered} onHover={setHovered} />
        </Suspense>
      </Canvas>

      <div className="pointer-events-none absolute left-6 top-6 sm:left-10 sm:top-10">
        <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#3a2e26]/45">
          Creative Frontend Lab — 04
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#2b2118] sm:text-3xl">
          Product Exploder
        </h1>
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center gap-2 px-6 pb-8 sm:pb-10">
        <p className="text-[11px] uppercase tracking-[0.25em] text-[#3a2e26]/45">
          {hovered ? "Release to see it whole again" : "Drag to orbit · slide to explode"}
        </p>
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(explode * 100)}
          onChange={(e) => setExplode(Number(e.target.value) / 100)}
          className="h-1 w-full max-w-xs cursor-pointer appearance-none rounded-full bg-[#3a2e26]/20 accent-[#b23b2e]"
          aria-label="Explode amount"
        />
      </div>
    </div>
  );
}
