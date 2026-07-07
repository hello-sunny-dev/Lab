"use client";

import { Suspense, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ScrollControls, Scroll, useScroll } from "@react-three/drei";
import { Scene } from "./Scene";

function Section({
  align,
  kicker,
  title,
  body,
}: {
  align: "left" | "right" | "center";
  kicker: string;
  title: string;
  body: string;
}) {
  const alignCls =
    align === "left"
      ? "items-start text-left"
      : align === "right"
        ? "items-end text-right"
        : "items-center text-center";
  return (
    <section
      className={`flex h-screen w-[100vw] max-w-full flex-col justify-center gap-4 px-8 sm:px-20 ${alignCls}`}
    >
      <p className="text-[11px] sm:text-xs font-medium uppercase tracking-[0.35em] text-white/30">
        {kicker}
      </p>
      <h2 className="max-w-xl text-4xl sm:text-6xl font-bold tracking-tight text-white/90">
        {title}
      </h2>
      <p className="max-w-md text-sm sm:text-base leading-relaxed text-white/40">
        {body}
      </p>
    </section>
  );
}

/** Lives inside ScrollControls; reports whether we're on the last page. */
function ScrollWatcher({ onAtEnd }: { onAtEnd: (atEnd: boolean) => void }) {
  const scroll = useScroll();
  const [atEnd, setAtEnd] = useState(false);

  useFrame(() => {
    const next = scroll.offset > 0.8;
    if (next !== atEnd) {
      setAtEnd(next);
      onAtEnd(next);
    }
  });

  return null;
}

function ScrollIndicator({ atEnd }: { atEnd: boolean }) {
  return (
    <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2">
      {/* Wrapper carries the direction flip so the bounce animation and the
          chevron both point the right way (rotating the animated SVG itself
          would fight animate-bounce's own transform). */}
      <div
        className="transition-transform duration-500"
        style={{ transform: atEnd ? "rotate(180deg)" : undefined }}
      >
        <svg width="18" height="28" viewBox="0 0 18 28" className="animate-bounce text-white/30">
          <rect x="4" y="0" width="10" height="18" rx="5" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <circle cx="9" cy="6" r="1.8" fill="currentColor" />
          <path d="M5 22L9 26L13 22" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
      </div>
      <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/25 transition-opacity duration-300">
        {atEnd ? "Scroll up" : "Scroll down"}
      </p>
    </div>
  );
}

export function Hero3D() {
  const [atEnd, setAtEnd] = useState(false);

  return (
    <div className="relative h-[100dvh] w-full bg-[#0a0a0c]">
      <Canvas camera={{ position: [0, 0.4, 4.2], fov: 42 }} dpr={[1, 1.8]}>
        <Suspense fallback={null}>
          {/* All assets are procedural/bundled — nothing remote to stall on */}
          <ScrollControls pages={3} damping={0.18}>
            <Scene />
            <ScrollWatcher onAtEnd={setAtEnd} />
            <Scroll html>
              <Section
                align="center"
                kicker="Creative Frontend Lab — 02"
                title="Glass in Motion"
                body="A single object, sculpted in light. Scroll to move the camera through the scene."
              />
              <Section
                align="left"
                kicker="Material"
                title="Glass, refracted"
                body="Physically-based transmission with chromatic aberration — rendered in real time in your browser."
              />
              <Section
                align="right"
                kicker="Camera"
                title="Choreographed by scroll"
                body="The camera orbits and pulls back as you scroll, revealing the object from every angle."
              />
            </Scroll>
          </ScrollControls>
        </Suspense>
      </Canvas>
      <ScrollIndicator atEnd={atEnd} />
    </div>
  );
}
