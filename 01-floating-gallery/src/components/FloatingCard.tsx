"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, type MouseEvent, type TouchEvent } from "react";
import type { CardData } from "@/data/cards";

const SPRING = { stiffness: 200, damping: 20, mass: 0.5 };

interface Props {
  card: CardData;
  index: number;
  total: number;
  isMobile: boolean;
}

export function FloatingCard({ card, index, total, isMobile }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [25, -25]), SPRING);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-25, 25]), SPRING);
  const glowX = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 100]), SPRING);
  const glowY = useSpring(useTransform(mouseY, [-0.5, 0.5], [0, 100]), SPRING);
  const shineBackground = useTransform(
    [glowX, glowY],
    ([x, y]: number[]) =>
      `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.7) 0%, transparent 50%)`
  );

  function handleMouse(e: MouseEvent) {
    if (isMobile) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleTouch(e: TouchEvent) {
    const touch = e.touches[0];
    if (!touch) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((touch.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((touch.clientY - rect.top) / rect.height - 0.5);
  }

  function handleLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  const cardW = isMobile ? 130 : 220;
  const cardH = isMobile ? 185 : 300;
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  const orbitX = Math.cos(angle) * (isMobile ? 105 : 250);
  const orbitY = Math.sin(angle) * (isMobile ? 115 : 140);
  const baseRotateZ = (index - 2) * (isMobile ? 3 : 6);
  const baseScale = isMobile ? 0.9 : 0.85 + Math.cos(angle) * 0.1;
  const floatY = Math.sin(angle + 1) * 8;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      onTouchMove={handleTouch}
      onTouchEnd={handleLeave}
      initial={{
        opacity: 0,
        y: 120,
        scale: 0.2,
        rotateZ: baseRotateZ + 30,
      }}
      animate={{
        opacity: 1,
        x: orbitX,
        y: orbitY,
        scale: baseScale,
        rotateZ: baseRotateZ,
        zIndex: index + 1,
      }}
      whileHover={
        isMobile
          ? {}
          : {
              scale: baseScale * 1.18,
              rotateZ: 0,
              zIndex: 30,
              y: orbitY - 25 + floatY,
              transition: { type: "spring", stiffness: 300, damping: 20 },
            }
      }
      whileTap={{ scale: baseScale * 0.95 }}
      transition={{
        duration: 1.2,
        delay: 0.3 + index * 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        rotateX,
        rotateY,
        perspective: 1000,
        position: "absolute",
        left: "50%",
        top: "50%",
        marginLeft: -cardW / 2,
        marginTop: -cardH / 2,
      }}
      className="cursor-pointer group"
    >
      <div
        className={`relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br ${card.gradient}`}
        style={{
          width: cardW,
          height: cardH,
          boxShadow: `0 25px 50px -12px ${card.glowColor}, 0 0 0 1px rgba(255,255,255,0.1) inset`,
        }}
      >
        {/* Shine on hover */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl sm:rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-50"
          style={{ background: shineBackground }}
        />

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col justify-between p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <span className="text-xl sm:text-3xl text-white/80">{card.icon}</span>
            <span className="rounded-full bg-black/20 px-2 py-0.5 text-[10px] sm:text-xs font-medium text-white/70">
              0{card.id}
            </span>
          </div>
          <div>
            <p className="text-[10px] sm:text-sm font-medium text-white/60">{card.subtitle}</p>
            <h3 className="mt-0.5 sm:mt-1 text-lg sm:text-2xl font-bold text-white">{card.title}</h3>
          </div>
        </div>

        {/* Inset ring */}
        <div className="absolute inset-0 rounded-2xl sm:rounded-3xl ring-1 ring-inset ring-white/15" />
      </div>

      {/* Glow under card on hover */}
      <div
        className="absolute inset-4 -z-10 rounded-2xl opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-80"
        style={{ background: card.glowColor }}
      />
    </motion.div>
  );
}
