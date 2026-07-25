"use client";

import dynamic from "next/dynamic";

const RoomViewer = dynamic(
  () => import("@/components/RoomViewer").then((m) => m.RoomViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[100dvh] w-full items-center justify-center bg-[#1a1712]">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/25">
          Loading room
        </p>
      </div>
    ),
  }
);

export default function Home() {
  return <RoomViewer />;
}
