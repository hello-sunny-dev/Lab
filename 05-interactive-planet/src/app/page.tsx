"use client";

import dynamic from "next/dynamic";

const PlanetViewer = dynamic(
  () => import("@/components/PlanetViewer").then((m) => m.PlanetViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[100dvh] w-full items-center justify-center bg-[#0b0a16]">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/25">
          Loading planet
        </p>
      </div>
    ),
  }
);

export default function Home() {
  return <PlanetViewer />;
}
