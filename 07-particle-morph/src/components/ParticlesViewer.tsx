"use client";

import { Suspense, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import { ParticleField } from "./ParticleField";

const TARGET_HALF_WIDTH = 6;

/** Keeps ~6 world units of half-width visible regardless of viewport size,
 *  so the particle field doesn't crop on narrow/mobile screens. */
function ResponsiveCamera() {
  const width = useThree((s) => s.size.width);
  return <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={width / 2 / TARGET_HALF_WIDTH} />;
}

export function ParticlesViewer() {
  const [morphed, setMorphed] = useState(false);

  return (
    <div className="relative h-[100dvh] w-full bg-[#120f1c]">
      <Canvas dpr={[1, 1.8]}>
        <Suspense fallback={null}>
          <ResponsiveCamera />
          <ParticleField morphTarget={morphed ? 1 : 0} />
        </Suspense>
      </Canvas>

      <div className="pointer-events-none absolute left-6 top-6 sm:left-10 sm:top-10">
        <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-white/30">
          Creative Frontend Lab — 07
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-white/90 sm:text-3xl">
          Particle Morph
        </h1>
      </div>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 sm:bottom-10">
        <p className="pointer-events-none text-[11px] uppercase tracking-[0.25em] text-white/30">
          Move your cursor over the particles
        </p>
        <button
          onClick={() => setMorphed((m) => !m)}
          className="rounded-full bg-white/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.1em] text-white/80 transition-colors hover:bg-white/15"
        >
          {morphed ? "Back to LAB" : "Become Sunny"}
        </button>
      </div>
    </div>
  );
}
