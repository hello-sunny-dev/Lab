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
  spread: MotionValue<number>;
  sceneMx: MotionValue<number>;
  sceneMy: MotionValue<number>;
  isSelected: boolean;
  onSelect: (id: number | null) => void;
  isMobile: boolean;
}

export function GlassCard({
  card,
  index,
  spread,
  sceneMx,
  sceneMy,
  isSelected,
  onSelect,
  isMobile,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const localMx = useMotionValue(0.5);
  const localMy = useMotionValue(0.5);

  const spring = { stiffness: 250, damping: 25 };
  const rotateX = useSpring(useTransform(localMy, [0, 1], [12, -12]), spring);
  const rotateY = useSpring(useTransform(localMx, [0, 1], [-12, 12]), spring);

  const borderAngle = useTransform([localMx, localMy], ([mx, my]: number[]) =>
    Math.atan2(my - 0.5, mx - 0.5) * (180 / Math.PI) + 180
  );
  const borderGradient = useTransform(
    borderAngle,
    (a) => `conic-gradient(from ${a}deg, ${card.accentColor}, transparent 40%, transparent 60%, ${card.accentColor})`
  );

  const shineX = useSpring(useTransform(localMx, [0, 1], [0, 100]), spring);
  const shineY = useSpring(useTransform(localMy, [0, 1], [0, 100]), spring);
  const shine = useTransform(
    [shineX, shineY],
    ([x, y]: number[]) => `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.15) 0%, transparent 50%)`
  );

  // Position interpolated by spread (0 = gathered at center, 1 = fully spread)
  const w = isMobile ? 160 : CARD_W;
  const h = isMobile ? 220 : CARD_H;
  const targetX = isMobile ? card.position.x * 0.38 : card.position.x;
  const targetY = isMobile ? card.position.y * 0.45 : card.position.y;
  const targetRot = isMobile ? card.rotation * 0.5 : card.rotation;

  const animX = useTransform(spread, [0, 1], [0, targetX]);
  const animY = useTransform(spread, [0, 1], [0, targetY]);
  const animRot = useTransform(spread, [0, 1], [0, targetRot]);
  const animScale = useTransform(spread, [0, 1], [0.85, 1]);

  // Magnetic pull
  const magnetX = useSpring(
    useTransform(sceneMx, [0, 1], [-10, 10]),
    { stiffness: 50, damping: 30 }
  );

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
      style={{
        x: isSelected ? 0 : animX,
        y: isSelected ? 0 : animY,
        rotateZ: isSelected ? 0 : animRot,
        rotateX: isSelected ? 0 : rotateX,
        rotateY: isSelected ? 0 : rotateY,
        scale: isSelected ? (isMobile ? 1.1 : 1.15) : animScale,
        perspective: 1200,
        position: "absolute",
        left: "50%",
        top: "50%",
        marginLeft: -w / 2,
        marginTop: -h / 2,
        zIndex: isSelected ? 60 : index + 1,
      }}
      animate={{
        transition: { type: "spring", stiffness: 200, damping: 25 },
      }}
      whileHover={
        isSelected || isMobile
          ? {}
          : { scale: 1.08, rotateZ: 0, zIndex: 30 }
      }
      whileTap={{ scale: isSelected ? 1.12 : 0.97 }}
      className="cursor-pointer group"
    >
      {/* Gradient border — visible on hover or selected */}
      <motion.div
        className="absolute -inset-[1px] rounded-[22px] sm:rounded-[26px] transition-opacity duration-500"
        style={{
          background: isSelected
            ? `linear-gradient(135deg, ${card.accentColor}, transparent 50%, ${card.accentColor})`
            : borderGradient,
          opacity: isSelected ? 1 : 0,
        }}
      />
      <div
        className="absolute -inset-[1px] rounded-[22px] sm:rounded-[26px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `conic-gradient(from 180deg, ${card.accentColor}, transparent 40%, transparent 60%, ${card.accentColor})`,
        }}
      />

      {/* Idle border */}
      <div
        className="absolute -inset-[1px] rounded-[22px] sm:rounded-[26px] opacity-30"
        style={{
          background: `linear-gradient(135deg, rgba(${card.accentRgb}, 0.3), transparent 50%, rgba(${card.accentRgb}, 0.15))`,
        }}
      />

      {/* Card body */}
      <div
        className="relative overflow-hidden rounded-[21px] sm:rounded-[25px]"
        style={{
          width: w,
          height: h,
          background: isSelected
            ? `linear-gradient(135deg, rgba(${card.accentRgb}, 0.25) 0%, rgba(${card.accentRgb}, 0.08) 100%)`
            : `linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)`,
          backdropFilter: "blur(40px) saturate(1.5)",
          WebkitBackdropFilter: "blur(40px) saturate(1.5)",
          boxShadow: isSelected
            ? `0 8px 40px rgba(${card.accentRgb}, 0.3), 0 0 120px -30px rgba(${card.accentRgb}, 0.4), inset 0 1px 0 rgba(255,255,255,0.15)`
            : `0 8px 32px rgba(0,0,0,0.4), 0 0 80px -20px rgba(${card.accentRgb}, 0.15), inset 0 1px 0 rgba(255,255,255,0.1)`,
          transition: "background 0.6s ease, box-shadow 0.6s ease",
        }}
      >
        {/* Shine */}
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: shine }}
        />

        {/* Accent glow */}
        <div
          className="absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl transition-opacity duration-500"
          style={{
            background: card.accentColor,
            opacity: isSelected ? 0.35 : 0.15,
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col justify-between p-5 sm:p-6">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xl sm:text-2xl" style={{ color: card.accentColor }}>
                {card.icon}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] sm:text-xs font-medium text-white/50">
                0{card.id}
              </span>
            </div>
            <p className="mt-3 sm:mt-4 text-[10px] sm:text-xs font-medium uppercase tracking-[0.2em] text-white/40">
              {card.subtitle}
            </p>
            <h3
              className="mt-1 text-xl sm:text-2xl font-bold transition-colors duration-500"
              style={{ color: isSelected ? card.accentColor : "rgba(255,255,255,0.9)" }}
            >
              {card.title}
            </h3>
          </div>

          {/* Expanded content — shown when selected */}
          <div className="flex-1 flex flex-col justify-center">
            <motion.div
              initial={false}
              animate={{ opacity: isSelected ? 1 : 0, y: isSelected ? 0 : 15 }}
              transition={{ duration: 0.4, delay: isSelected ? 0.15 : 0 }}
              className="pointer-events-none"
            >
              {isSelected && (
                <>
                  <p className="text-xs sm:text-sm leading-relaxed text-white/60">
                    {card.description}
                  </p>
                  <div className="mt-4 flex items-end gap-3">
                    <p className="text-3xl sm:text-4xl font-bold" style={{ color: card.accentColor }}>
                      {card.stat}
                    </p>
                    <p className="mb-1 text-[10px] sm:text-xs text-white/30">{card.statLabel}</p>
                  </div>
                </>
              )}
            </motion.div>
          </div>

          {/* Footer — mini bars (hidden when selected) */}
          <motion.div
            initial={false}
            animate={{ opacity: isSelected ? 0 : 1 }}
            className="flex items-end justify-between"
          >
            <p className="text-2xl sm:text-3xl font-bold" style={{ color: card.accentColor }}>
              {card.stat}
            </p>
            <div className="flex items-end gap-[3px] opacity-30">
              {[0.3, 0.5, 0.8, 0.6, 1, 0.7, 0.4].map((h, i) => (
                <div
                  key={i}
                  className="w-[3px] rounded-full"
                  style={{
                    height: `${h * (isMobile ? 20 : 28)}px`,
                    background: card.accentColor,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Inner border */}
        <div className="absolute inset-0 rounded-[21px] sm:rounded-[25px] ring-1 ring-inset ring-white/[0.08]" />
      </div>

      {/* Under-card glow */}
      <div
        className="absolute inset-6 -z-10 rounded-3xl blur-2xl transition-all duration-700"
        style={{
          background: `rgba(${card.accentRgb}, 0.4)`,
          opacity: isSelected ? 0.7 : 0,
        }}
      />
    </motion.div>
  );
}
