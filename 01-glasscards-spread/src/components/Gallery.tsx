"use client";

import { useState, useEffect, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";
import { cards, slots, type CardData } from "@/data/cards";
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

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function Gallery() {
  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [orderedCards, setOrderedCards] = useState<CardData[]>(cards);
  const [isShuffling, setIsShuffling] = useState(false);
  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion();

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const spreadRaw = useMotionValue(0.25);
  const spread = useSpring(spreadRaw, { stiffness: 80, damping: 25 });

  const bgX = useSpring(useTransform(mx, [0, 1], [30, -30]), SCENE_SPRING);
  const bgY = useSpring(useTransform(my, [0, 1], [30, -30]), SCENE_SPRING);
  const g1L = useTransform(mx, [0, 1], ["15%", "55%"]);
  const g1T = useTransform(my, [0, 1], ["15%", "45%"]);

  function handleShuffle() {
    if (isShuffling) return;
    if (selected !== null) {
      setSelected(null);
      if (spreadRaw.get() < 0.7) spreadRaw.set(0.7);
      return;
    }
    setIsShuffling(true);
    const prevSpread = spreadRaw.get();
    spreadRaw.set(0);
    setTimeout(() => {
      setOrderedCards(shuffleArray(orderedCards));
      setTimeout(() => {
        spreadRaw.set(prevSpread < 0.5 ? 0.7 : prevSpread);
        setIsShuffling(false);
      }, 300);
    }, 400);
  }

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
      onClick={() => {
        if (selected !== null) {
          setSelected(null);
          if (spreadRaw.get() < 0.7) spreadRaw.set(0.7);
        }
      }}
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

      {/* Shuffle button */}
      <motion.button
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => { e.stopPropagation(); handleShuffle(); }}
        disabled={isShuffling}
        className="absolute top-8 right-8 sm:top-10 sm:right-10 flex items-center gap-2 rounded-full px-4 py-2 text-[11px] sm:text-xs font-medium uppercase tracking-[0.15em] text-white/30 transition-all hover:text-white/60 active:scale-95 disabled:opacity-30"
        style={{ zIndex: 55, cursor: isShuffling ? "default" : "pointer" }}
      >
        {selected !== null ? (
          <>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M4 4L10 10M10 4L4 10" />
            </svg>
            Back
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
              <path d="M1 10L4 7L1 4" />
              <path d="M1 10H9" />
              <path d="M13 4L10 7L13 10" />
              <path d="M13 4H5" />
            </svg>
            Shuffle
          </>
        )}
      </motion.button>

      {/* Overlay */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-black/20"
            style={{ zIndex: 40 }}
          />
        )}
      </AnimatePresence>

      {/* Scene — no mouse-driven tilt here: transforming the container
          moves every card's hit area under the cursor, which makes the
          cursor flicker pointer↔default while the mouse moves */}
      <div
        className="relative"
        style={{
          width: isMobile ? 375 : 900,
          height: isMobile ? 550 : 600,
          perspective: 1400,
          zIndex: 45,
        }}
      >
        {orderedCards.map((card, i) => (
          <GlassCard
            key={card.id}
            card={card}
            index={i}
            slot={slots[i]}
            spread={spread}
            isSelected={selected === card.id}
            selectedId={selected}
            onSelect={setSelected}
            isMobile={isMobile}
          />
        ))}
      </div>

      {/* Scroll hint — always visible, fades when card selected */}
      <motion.div
        className="absolute bottom-8 flex flex-col items-center gap-2 transition-opacity duration-300"
        style={{ zIndex: 20, opacity: selected !== null ? 0 : 1 }}
      >
        <motion.div
          animate={reducedMotion ? { y: 0 } : { y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: reducedMotion ? 0 : Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1"
        >
          <svg width="20" height="32" viewBox="0 0 20 32" className="text-white/25">
            <rect x="5" y="0" width="10" height="20" rx="5" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <motion.circle
              cx="10" cy="8"
              r="2"
              fill="currentColor"
              animate={reducedMotion ? { cy: 8 } : { cy: [7, 13, 7] }}
              transition={{ duration: 2, repeat: reducedMotion ? 0 : Infinity, ease: "easeInOut" }}
            />
            <path d="M6 24L10 28L14 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </svg>
        </motion.div>
        <p className="text-[11px] sm:text-[9px] font-medium tracking-[0.2em] uppercase text-white/30 sm:text-white/15">
          {isMobile ? "Swipe up & down" : "Scroll to explore"}
        </p>
      </motion.div>
    </div>
  );
}
