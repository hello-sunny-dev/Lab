"use client";

import { useRef, type MouseEvent } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import type { CardData } from "@/data/cards";

const CARD_W = 250;
const CARD_H = 340;

interface Props {
  card: CardData;
  index: number;
  slot: { position: { x: number; y: number }; rotation: number };
  spread: MotionValue<number>;
  isSelected: boolean;
  anySelected: boolean;
  onSelect: (id: number | null) => void;
  isMobile: boolean;
}

export function GlassCard({
  card,
  index,
  slot,
  spread,
  isSelected,
  anySelected,
  onSelect,
  isMobile,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const localMx = useMotionValue(0.5);
  const localMy = useMotionValue(0.5);

  const spring = { stiffness: 250, damping: 25 };
  const rotateX = useSpring(useTransform(localMy, [0, 1], [6, -6]), spring);
  const rotateY = useSpring(useTransform(localMx, [0, 1], [-6, 6]), spring);

  const w = isMobile ? 160 : CARD_W;
  const h = isMobile ? 220 : CARD_H;
  const targetX = isMobile ? slot.position.x * 0.38 : slot.position.x;
  const targetY = isMobile ? slot.position.y * 0.45 : slot.position.y;
  const targetRot = isMobile ? slot.rotation * 0.5 : slot.rotation;

  const spreadX = useTransform(spread, [0, 1], [0, targetX]);
  const spreadY = useTransform(spread, [0, 1], [0, targetY]);
  const spreadRot = useTransform(spread, [0, 1], [0, targetRot]);
  const spreadScale = useTransform(spread, [0, 1], [0.88, 1]);

  function onMove(e: MouseEvent) {
    if (isMobile || isSelected) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    localMx.set((e.clientX - rect.left) / rect.width);
    localMy.set((e.clientY - rect.top) / rect.height);
  }

  function onLeave() {
    localMx.set(0.5);
    localMy.set(0.5);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(isSelected ? null : card.id);
      }}
      animate={
        isSelected
          ? { x: 0, y: 0, scale: isMobile ? 1.15 : 1.2, rotateZ: 0 }
          : anySelected
            ? { x: targetX * 1.3, y: targetY * 1.3, scale: 0.75, rotateZ: targetRot }
            : undefined
      }
      transition={{ type: "spring", stiffness: 150, damping: 22, mass: 0.8 }}
      style={{
        x: isSelected || anySelected ? undefined : spreadX,
        y: isSelected || anySelected ? undefined : spreadY,
        rotateZ: isSelected || anySelected ? undefined : spreadRot,
        scale: isSelected || anySelected ? undefined : spreadScale,
        position: "absolute",
        left: "50%",
        top: "50%",
        marginLeft: -w / 2,
        marginTop: -h / 2,
        zIndex: isSelected ? 60 : anySelected ? 1 : index + 1,
        opacity: anySelected && !isSelected ? 0.1 : 1,
        transition: "opacity 0.4s ease",
        cursor: "pointer",
      }}
    >
      {/* Inner wrapper for 3D tilt — doesn't affect hit area */}
      <motion.div
        style={{
          rotateX: isSelected ? 0 : rotateX,
          rotateY: isSelected ? 0 : rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl transition-all duration-500"
          style={{
            width: w,
            height: h,
            background: isSelected
              ? `linear-gradient(160deg, rgba(${card.accentRgb}, 0.3) 0%, rgba(${card.accentRgb}, 0.08) 100%)`
              : "linear-gradient(160deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)",
            backdropFilter: "blur(40px) saturate(1.4)",
            WebkitBackdropFilter: "blur(40px) saturate(1.4)",
            boxShadow: isSelected
              ? `0 20px 60px rgba(${card.accentRgb}, 0.3), 0 0 0 1px rgba(${card.accentRgb}, 0.35), inset 0 1px 0 rgba(255,255,255,0.2)`
              : "0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          {/* Accent glow — only when selected */}
          <div
            className="absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl transition-opacity duration-700"
            style={{ background: card.accentColor, opacity: isSelected ? 0.4 : 0 }}
          />
          <div
            className="absolute -left-10 bottom-0 h-32 w-32 rounded-full blur-3xl transition-opacity duration-700"
            style={{ background: card.accentColor, opacity: isSelected ? 0.2 : 0 }}
          />

          {/* Content */}
          <div className="relative z-10 flex h-full flex-col p-5 sm:p-6">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between">
                <span
                  className="text-lg sm:text-xl transition-colors duration-500"
                  style={{ color: isSelected ? card.accentColor : "rgba(255,255,255,0.3)" }}
                >
                  {card.icon}
                </span>
                <span className="rounded-full border border-white/[0.06] px-2 py-0.5 text-[10px] sm:text-xs font-medium text-white/30">
                  0{card.id}
                </span>
              </div>
              <p
                className="mt-4 sm:mt-5 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.2em] transition-colors duration-500"
                style={{ color: isSelected ? `rgba(${card.accentRgb}, 0.7)` : "rgba(255,255,255,0.25)" }}
              >
                {card.subtitle}
              </p>
              <h3
                className="mt-1 text-xl sm:text-2xl font-semibold tracking-tight transition-colors duration-500"
                style={{ color: isSelected ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.7)" }}
              >
                {card.title}
              </h3>
            </div>

            {/* Expanded content — visible when selected */}
            <div className="mt-3 flex-1 flex flex-col justify-center overflow-hidden">
              <motion.div
                animate={{ opacity: isSelected ? 1 : 0, y: isSelected ? 0 : 15 }}
                transition={{ duration: 0.5, delay: isSelected ? 0.15 : 0, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="text-xs sm:text-sm leading-relaxed text-white/70">
                  {card.description}
                </p>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-bold" style={{ color: card.accentColor }}>
                    {card.stat}
                  </span>
                  <span className="text-[10px] sm:text-xs text-white/40">{card.statLabel}</span>
                </div>
              </motion.div>
            </div>

            {/* Collapsed footer */}
            <motion.div
              animate={{ opacity: isSelected ? 0 : 1 }}
              transition={{ duration: 0.15 }}
              className="mt-auto flex items-end justify-between"
            >
              <span className="text-lg sm:text-xl font-semibold text-white/20">{card.stat}</span>
              <span className="text-[10px] text-white/15">{card.statLabel}</span>
            </motion.div>
          </div>

          {/* Inner border */}
          <div
            className="absolute inset-0 rounded-2xl sm:rounded-3xl transition-all duration-500"
            style={{
              boxShadow: isSelected
                ? `inset 0 0 0 1px rgba(${card.accentRgb}, 0.25)`
                : "inset 0 0 0 1px rgba(255,255,255,0.06)",
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
