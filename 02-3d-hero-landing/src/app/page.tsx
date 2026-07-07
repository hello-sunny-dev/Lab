"use client";

import dynamic from "next/dynamic";

const Hero3D = dynamic(
  () => import("@/components/Hero3D").then((m) => m.Hero3D),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[100dvh] w-full items-center justify-center bg-[#0a0a0c]">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/25">
          Loading scene
        </p>
      </div>
    ),
  }
);

export default function Home() {
  return <Hero3D />;
}
