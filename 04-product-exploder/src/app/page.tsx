"use client";

import dynamic from "next/dynamic";

const Exploder = dynamic(
  () => import("@/components/Exploder").then((m) => m.Exploder),
  {
    ssr: false,
    loading: () => (
      <div className="studio-backdrop flex h-[100dvh] w-full items-center justify-center">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#3a2e26]/40">
          Loading camera
        </p>
      </div>
    ),
  }
);

export default function Home() {
  return <Exploder />;
}
