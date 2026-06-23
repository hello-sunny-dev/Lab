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
  sceneMx: MotionValue<number>;
  sceneMy: MotionValue<number>;
  isMobile: boolean;
}

export function GlassCard({ card, index, sceneMx, sceneMy, isMobile }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const localMx = useMotionValue(0.5);
  const localMy = useMotionValue(0.5);
  const isHovered = useMotionValue(0);

  const spring = { stiffness: 250, damping: 25 };
  const localRotateX = useSpring(useTransform(localMy, [0, 1], [12, -12]), spring);
  const localRotateY = useSpring(useTransform(localMx, [0, 1], [-12, 12]), spring);

  // Gradient border angle follows mouse
  const borderAngle = useTransform([localMx, localMy], ([mx, my]: number[]) => {
    return Math.atan2(my - 0.5, mx - 0.5) * (180 / Math.PI) + 180;
  });
  const borderGradient = useTransform(
    borderAngle,
    (a) =>
      `conic-gradient(from ${a}deg, ${card.accentColor}, transparent 40%, transparent 60%, ${card.accentColor})`
  );

  // Shine position
  const shineX = useSpring(useTransform(localMx, [0, 1], [0, 100]), spring);
  const shineY = useSpring(useTransform(localMy, [0, 1], [0, 100]), spring);
  const shine = useTransform(
    [shineX, shineY],
    ([x, y]: number[]) =>
      `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.15) 0%, transparent 50%)`
  );

  // Magnetic pull toward mouse
  const magnetX = useSpring(
    useTransform(sceneMx, [0, 1], [-15, 15]),
    { stiffness: 50, damping: 30 }
  );
  const magnetY = useSpring(
    useTransform(sceneMy, [0, 1], [-15, 15]),
    { stiffness: 50, damping: 30 }
  );

  const w = isMobile ? 150 : CARD_W;
  const h = isMobile ? 210 : CARD_H;
  const px = isMobile ? card.position.x * 0.38 : card.position.x;
  const py = isMobile ? card.position.y * 0.45 : card.position.y;
  const rot = isMobile ? card.rotation * 0.5 : card.rotation;

  function onMove(e: MouseEvent) {
    if (isMobile) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    localMx.set((e.clientX - rect.left) / rect.width);
    localMy.set((e.clientY - rect.top) / rect.height);
  }

  function onLeave() {
    localMx.set(0.5);
    localMy.set(0.5);
    isHovered.set(0);
  }

  function onEnter() {
    isHovered.set(1);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      initial={{
        opacity: 0,
        y: py + 80,
        x: px,
        scale: 0.6,
        rotateZ: rot + 15,
      }}
      animate={{
        opacity: 1,
        x: px,
        y: py,
        scale: 1,
        rotateZ: rot,
      }}
      whileHover={
        isMobile
          ? {}
          : {
              scale: 1.06,
              rotateZ: 0,
              zIndex: 30,
              transition: { type: "spring", stiffness: 300, damping: 22 },
            }
      }
      whileTap={{ scale: 0.97 }}
      transition={{
        duration: 1.4,
        delay: 0.2 + index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        rotateX: localRotateX,
        rotateY: localRotateY,
        x: useTransform([magnetX], ([mx]: number[]) => px + mx * (1 + index * 0.2)),
        perspective: 1200,
        position: "absolute",
        left: "50%",
        top: "50%",
        marginLeft: -w / 2,
        marginTop: -h / 2,
        zIndex: index + 1,
      }}
      className="cursor-pointer group"
    >
      {/* Gradient border wrapper */}
      <motion.div
        className="absolute -inset-[1px] rounded-[22px] sm:rounded-[26px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: borderGradient }}
      />

      {/* Idle glow ring — always subtly visible */}
      <div
        className="absolute -inset-[1px] rounded-[22px] sm:rounded-[26px] opacity-30"
        style={{
          background: `linear-gradient(135deg, rgba(${card.accentRgb}, 0.3), transparent 50%, rgba(${card.accentRgb}, 0.15))`,
        }}
      />

      {/* Glass card */}
      <div
        className="relative overflow-hidden rounded-[21px] sm:rounded-[25px]"
        style={{
          width: w,
          height: h,
          background: `linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)`,
          backdropFilter: "blur(40px) saturate(1.5)",
          WebkitBackdropFilter: "blur(40px) saturate(1.5)",
          boxShadow: `
            0 8px 32px rgba(0,0,0,0.4),
            0 0 80px -20px rgba(${card.accentRgb}, 0.15),
            inset 0 1px 0 rgba(255,255,255,0.1),
            inset 0 -1px 0 rgba(255,255,255,0.05)
          `,
        }}
      >
        {/* Shine overlay */}
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: shine }}
        />

        {/* Accent glow blob */}
        <div
          className="absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-40"
          style={{ background: card.accentColor }}
        />

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col justify-between p-5 sm:p-7">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between">
              <span
                className="text-2xl sm:text-3xl"
                style={{ color: card.accentColor }}
              >
                {card.icon}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] sm:text-xs font-medium text-white/50">
                0{card.id}
              </span>
            </div>
            <p className="mt-4 sm:mt-6 text-[11px] sm:text-xs font-medium uppercase tracking-[0.2em] text-white/40">
              {card.subtitle}
            </p>
            <h3 className="mt-1 text-2xl sm:text-3xl font-bold text-white/90">{card.title}</h3>
            <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-relaxed text-white/40">
              {card.description}
            </p>
          </div>

          {/* Stat */}
          <div className="flex items-end justify-between">
            <div>
              <p
                className="text-3xl sm:text-4xl font-bold"
                style={{ color: card.accentColor }}
              >
                {card.stat}
              </p>
              <p className="mt-0.5 text-[10px] sm:text-xs text-white/30">{card.statLabel}</p>
            </div>
            {/* Decorative line */}
            <div className="flex items-end gap-[3px] opacity-30">
              {[0.3, 0.5, 0.8, 0.6, 1, 0.7, 0.4].map((h, i) => (
                <div
                  key={i}
                  className="w-[3px] rounded-full"
                  style={{
                    height: `${h * (isMobile ? 28 : 36)}px`,
                    background: card.accentColor,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Inner border */}
        <div className="absolute inset-0 rounded-[21px] sm:rounded-[25px] ring-1 ring-inset ring-white/[0.08]" />
      </div>

      {/* Under-card glow */}
      <div
        className="absolute inset-6 -z-10 rounded-3xl opacity-0 blur-2xl transition-all duration-700 group-hover:opacity-60 group-hover:inset-2"
        style={{ background: `rgba(${card.accentRgb}, 0.4)` }}
      />
    </motion.div>
  );
}
