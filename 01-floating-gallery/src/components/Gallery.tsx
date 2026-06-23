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

  // Spread: 0 = cards gathered, 1 = fully spread
  const spreadRaw = useMotionValue(0.3);
  const spread = useSpring(spreadRaw, { stiffness: 80, damping: 25 });

  // Scene tilt
  const sceneRotateX = useSpring(useTransform(my, [0, 1], [6, -6]), SCENE_SPRING);
  const sceneRotateY = useSpring(useTransform(mx, [0, 1], [-6, 6]), SCENE_SPRING);

  // BG parallax
  const bgX = useSpring(useTransform(mx, [0, 1], [40, -40]), SCENE_SPRING);
  const bgY = useSpring(useTransform(my, [0, 1], [40, -40]), SCENE_SPRING);
  const g1L = useTransform(mx, [0, 1], ["10%", "60%"]);
  const g1T = useTransform(my, [0, 1], ["10%", "50%"]);
  const g2L = useTransform(mx, [0, 1], ["50%", "80%"]);
  const g2T = useTransform(my, [0, 1], ["40%", "70%"]);

  // Scroll hint opacity — fades out as you scroll
  const hintOpacity = useTransform(spread, [0, 0.5], [1, 0]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    function handleMove(e: PointerEvent) {
      mx.set(e.clientX / window.innerWidth);
      my.set(e.clientY / window.innerHeight);
    }
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, [mx, my]);

  // Wheel → spread cards
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (selected !== null) return;
      e.preventDefault();
      const delta = e.deltaY * 0.002;
      const next = Math.max(0, Math.min(1, spreadRaw.get() + delta));
      spreadRaw.set(next);
    },
    [spreadRaw, selected]
  );

  useEffect(() => {
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  // Touch drag → spread cards
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

  // Escape to deselect
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSelected(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="relative flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#08080c]"
      onClick={() => selected !== null && setSelected(null)}
    >
      {/* BG */}
      <motion.div
        style={{ x: bgX, y: bgY }}
        className="pointer-events-none absolute inset-[-300px]"
      >
        <motion.div
          className="absolute h-[700px] w-[700px] rounded-full blur-[150px]"
          style={{ background: "radial-gradient(circle, rgba(120,80,255,0.12) 0%, transparent 70%)", left: g1L, top: g1T }}
        />
        <motion.div
          className="absolute h-[500px] w-[500px] rounded-full blur-[120px]"
          style={{ background: "radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)", left: g2L, top: g2T }}
        />
        <div
          className="absolute left-[20%] top-[60%] h-[400px] w-[400px] rounded-full blur-[100px]"
          style={{ background: "radial-gradient(circle, rgba(244,114,182,0.06) 0%, transparent 70%)" }}
        />
      </motion.div>

      {/* Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Title — fades as cards spread */}
      <div className="pointer-events-none absolute text-center px-4" style={{ zIndex: 5 }}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-3 text-[10px] sm:text-xs font-medium uppercase tracking-[0.4em] text-white/20"
        >
          Creative Frontend Lab
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 40, filter: "blur(20px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-7xl md:text-8xl font-bold tracking-tight text-white/[0.06]"
        >
          Gallery
        </motion.h1>
      </div>

      {/* Overlay when card is selected */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/70"
            style={{ zIndex: 40 }}
          />
        )}
      </AnimatePresence>

      {/* 3D Scene */}
      <motion.div
        className="relative"
        style={{
          width: isMobile ? 375 : 900,
          height: isMobile ? 550 : 600,
          perspective: 1400,
          zIndex: selected !== null ? 50 : 10,
          rotateX: isMobile ? 0 : sceneRotateX,
          rotateY: isMobile ? 0 : sceneRotateY,
          transformStyle: "preserve-3d",
        }}
      >
        {cards.map((card, i) => (
          <GlassCard
            key={card.id}
            card={card}
            index={i}
            spread={spread}
            sceneMx={mx}
            sceneMy={my}
            isSelected={selected === card.id}
            onSelect={setSelected}
            isMobile={isMobile}
          />
        ))}
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 flex flex-col items-center gap-2"
        style={{ zIndex: 20, opacity: hintOpacity }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1"
        >
          <div className="h-8 w-[1px] bg-gradient-to-b from-transparent to-white/20" />
          <svg width="12" height="8" viewBox="0 0 12 8" className="text-white/20">
            <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </svg>
        </motion.div>
        <p className="text-[10px] font-medium tracking-[0.3em] uppercase text-white/15">
          {isMobile ? "Swipe to spread" : "Scroll to spread"}
        </p>
      </motion.div>

      {/* Vignette */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(8,8,12,0.8) 100%)",
          zIndex: selected !== null ? 0 : 15,
          opacity: selected !== null ? 0 : 1,
        }}
      />
    </div>
  );
}
