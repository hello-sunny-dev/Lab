"use client";

import { useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
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
  const isMobile = useIsMobile();

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  // Scene-level 3D tilt
  const sceneRotateX = useSpring(useTransform(my, [0, 1], [8, -8]), SCENE_SPRING);
  const sceneRotateY = useSpring(useTransform(mx, [0, 1], [-8, 8]), SCENE_SPRING);

  // Background parallax
  const bgX = useSpring(useTransform(mx, [0, 1], [50, -50]), SCENE_SPRING);
  const bgY = useSpring(useTransform(my, [0, 1], [50, -50]), SCENE_SPRING);

  // Glow positions
  const g1L = useTransform(mx, [0, 1], ["10%", "60%"]);
  const g1T = useTransform(my, [0, 1], ["10%", "50%"]);
  const g2L = useTransform(mx, [0, 1], ["50%", "80%"]);
  const g2T = useTransform(my, [0, 1], ["40%", "70%"]);

  useEffect(() => {
    setMounted(true);
    function handleMove(e: PointerEvent) {
      mx.set(e.clientX / window.innerWidth);
      my.set(e.clientY / window.innerHeight);
    }
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, [mx, my]);

  if (!mounted) return null;

  return (
    <div className="relative flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#08080c]">
      {/* Background layer */}
      <motion.div
        style={{ x: bgX, y: bgY }}
        className="pointer-events-none absolute inset-[-300px]"
      >
        {/* Ambient glow orbs */}
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
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Dot pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Title */}
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
          className="text-4xl sm:text-7xl md:text-8xl font-bold tracking-tight text-white/[0.07]"
        >
          Gallery
        </motion.h1>
      </div>

      {/* 3D Scene container — whole thing tilts with mouse */}
      <motion.div
        className="relative"
        style={{
          width: isMobile ? 375 : 900,
          height: isMobile ? 500 : 600,
          perspective: 1400,
          zIndex: 10,
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
            sceneMx={mx}
            sceneMy={my}
            isMobile={isMobile}
          />
        ))}
      </motion.div>

      {/* Vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(8,8,12,0.8) 100%)",
          zIndex: 15,
        }}
      />

      {/* Bottom text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 text-[11px] font-medium tracking-widest text-white/15"
        style={{ zIndex: 20 }}
      >
        {isMobile ? "TAP TO EXPLORE" : "MOVE YOUR CURSOR"}
      </motion.p>
    </div>
  );
}
