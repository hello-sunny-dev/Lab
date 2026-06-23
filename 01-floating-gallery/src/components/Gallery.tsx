"use client";

import { useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { cards } from "@/data/cards";
import { FloatingCard } from "./FloatingCard";

const BG_SPRING = { stiffness: 30, damping: 30 };

function Background() {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const x = useSpring(useTransform(mouseX, [0, 1], [40, -40]), BG_SPRING);
  const y = useSpring(useTransform(mouseY, [0, 1], [40, -40]), BG_SPRING);
  const gx = useSpring(useTransform(mouseX, [0, 1], [20, 80]), BG_SPRING);
  const gy = useSpring(useTransform(mouseY, [0, 1], [20, 80]), BG_SPRING);
  const g1L = useTransform(gx, (v) => `${v - 10}%`);
  const g1T = useTransform(gy, (v) => `${v - 10}%`);
  const g2L = useTransform(gx, (v) => `${v + 20}%`);
  const g2T = useTransform(gy, (v) => `${v + 15}%`);
  const g3L = useTransform(gx, (v) => `${v - 20}%`);
  const g3T = useTransform(gy, (v) => `${v + 25}%`);

  useEffect(() => {
    function handleMove(e: PointerEvent) {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    }
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div style={{ x, y }} className="pointer-events-none absolute inset-[-200px]">
      <motion.div
        className="absolute h-[600px] w-[600px] rounded-full blur-[120px]"
        style={{ background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)", left: g1L, top: g1T, opacity: 0.15 }}
      />
      <motion.div
        className="absolute h-[500px] w-[500px] rounded-full blur-[100px]"
        style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)", left: g2L, top: g2T, opacity: 0.1 }}
      />
      <motion.div
        className="absolute h-[400px] w-[400px] rounded-full blur-[80px]"
        style={{ background: "radial-gradient(circle, #ec4899 0%, transparent 70%)", left: g3L, top: g3T, opacity: 0.08 }}
      />
    </motion.div>
  );
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    setIsMobile(mq.matches);
    function onChange(e: MediaQueryListEvent) { setIsMobile(e.matches); }
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return isMobile;
}

export function Gallery() {
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="relative flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-zinc-950">
      {/* BG */}
      <div className="absolute inset-0" style={{ zIndex: 0, isolation: "isolate" }}>
        <Background />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Title */}
      <div className="pointer-events-none absolute text-center px-4" style={{ zIndex: 5 }}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-2 text-xs sm:text-sm font-medium uppercase tracking-[0.3em] text-white/30"
        >
          Creative Frontend
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white/90"
        >
          Floating Gallery
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-3 sm:mt-4 text-sm sm:text-base text-white/20"
        >
          {isMobile ? "tap to explore" : "hover · explore"}
        </motion.p>
      </div>

      {/* Cards */}
      <div
        className="relative"
        style={{
          width: isMobile ? 340 : 700,
          height: isMobile ? 400 : 500,
          perspective: 1200,
          zIndex: 10,
        }}
      >
        {cards.map((card, i) => (
          <FloatingCard
            key={card.id}
            card={card}
            index={i}
            total={cards.length}
            isMobile={isMobile}
          />
        ))}
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-zinc-950 to-transparent" style={{ zIndex: 15 }} />
    </div>
  );
}
