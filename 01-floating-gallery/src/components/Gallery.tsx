"use client";

import { useState, useEffect, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { cards } from "@/data/cards";
import { GlassCard } from "./GlassCard";

const SCENE_SPRING = { stiffness: 40, damping: 30 };

function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    setM(mq.matches);
    const cb = (e: MediaQueryListEvent) => setM(e.matches);
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
  }, []);
  return m;
}

export function Gallery() {
  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const isMobile = useIsMobile();

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const spreadRaw = useMotionValue(0.25);
  const spread = useSpring(spreadRaw, { stiffness: 80, damping: 25 });

  const sceneRotateX = useSpring(useTransform(my, [0, 1], [4, -4]), SCENE_SPRING);
  const sceneRotateY = useSpring(useTransform(mx, [0, 1], [-4, 4]), SCENE_SPRING);

  const bgX = useSpring(useTransform(mx, [0, 1], [30, -30]), SCENE_SPRING);
  const bgY = useSpring(useTransform(my, [0, 1], [30, -30]), SCENE_SPRING);
  const g1L = useTransform(mx, [0, 1], ["15%", "55%"]);
  const g1T = useTransform(my, [0, 1], ["15%", "45%"]);

  const hintOpacity = useTransform(spread, [0, 0.6], [1, 0]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    function handleMove(e: PointerEvent) {
      mx.set(e.clientX / window.innerWidth);
      my.set(e.clientY / window.innerHeight);
    }
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, [mx, my]);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (selected !== null) return;
      e.preventDefault();
      const next = Math.max(0, Math.min(1, spreadRaw.get() + e.deltaY * 0.0015));
      spreadRaw.set(next);
    },
    [spreadRaw, selected]
  );

  useEffect(() => {
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  const touchStart = useMotionValue(0);
  const touchSpreadStart = useMotionValue(0);

  useEffect(() => {
    function onTouchStart(e: TouchEvent) {
      if (selected !== null) return;
      touchStart.set(e.touches[0].clientY);
      touchSpreadStart.set(spreadRaw.get());
    }
    function onTouchMove(e: TouchEvent) {
      if (selected !== null) return;
      e.preventDefault();
      const delta = (touchStart.get() - e.touches[0].clientY) * 0.003;
      const next = Math.max(0, Math.min(1, touchSpreadStart.get() + delta));
      spreadRaw.set(next);
    }
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [spreadRaw, touchStart, touchSpreadStart, selected]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="relative flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#0a0a0c]"
      onClick={() => selected !== null && setSelected(null)}
    >
      {/* BG glow */}
      <motion.div
        style={{ x: bgX, y: bgY }}
        className="pointer-events-none absolute inset-[-300px]"
      >
        <motion.div
          className="absolute h-[800px] w-[800px] rounded-full blur-[180px]"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)",
            left: g1L, top: g1T,
          }}
        />
      </motion.div>

      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Title */}
      <div className="pointer-events-none absolute text-center px-4" style={{ zIndex: 5 }}>
        <motion.h1
          initial={{ opacity: 0, y: 30, filter: "blur(20px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-white/[0.04]"
        >
          Gallery
        </motion.h1>
      </div>

      {/* Overlay */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-black/60"
            style={{ zIndex: 40 }}
          />
        )}
      </AnimatePresence>

      {/* Scene */}
      <motion.div
        className="relative"
        style={{
          width: isMobile ? 375 : 900,
          height: isMobile ? 550 : 600,
          perspective: 1400,
          zIndex: 45,
          rotateX: isMobile || selected !== null ? 0 : sceneRotateX,
          rotateY: isMobile || selected !== null ? 0 : sceneRotateY,
          transformStyle: "preserve-3d",
        }}
      >
        {cards.map((card, i) => (
          <GlassCard
            key={card.id}
            card={card}
            index={i}
            spread={spread}
            isSelected={selected === card.id}
            anySelected={selected !== null}
            onSelect={setSelected}
            isMobile={isMobile}
          />
        ))}
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-10 flex flex-col items-center gap-3"
        style={{ zIndex: 20, opacity: hintOpacity }}
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center"
        >
          <div className="h-6 w-[1px] bg-gradient-to-b from-transparent to-white/15" />
          <svg width="10" height="6" viewBox="0 0 10 6" className="mt-1 text-white/15">
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" />
          </svg>
        </motion.div>
        <p className="text-[9px] font-medium tracking-[0.3em] uppercase text-white/10">
          {isMobile ? "Swipe" : "Scroll"}
        </p>
      </motion.div>
    </div>
  );
}
