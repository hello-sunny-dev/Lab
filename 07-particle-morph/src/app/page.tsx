"use client";

import dynamic from "next/dynamic";

const ParticlesViewer = dynamic(
  () => import("@/components/ParticlesViewer").then((m) => m.ParticlesViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[100dvh] w-full items-center justify-center bg-[#120f1c]">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/25">
          Loading particles
        </p>
      </div>
    ),
  }
);

export default function Home() {
  return <ParticlesViewer />;
}
