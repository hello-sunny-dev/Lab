"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useGSAP } from "@gsap/react";
import { Character } from "./Character";
import { SceneLayers } from "./SceneLayers";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, useGSAP);

// Sky gradients for each phase of the drift — Pastel Dream (lavender → pink → peach → cream)
const SKIES = [
  "linear-gradient(180deg, #e9dcf5 0%, #f0d3e8 100%)",   // lavender wake-up
  "linear-gradient(180deg, #f0d3e8 0%, #f6cfe0 100%)",   // pink drift
  "linear-gradient(180deg, #f6cfe0 0%, #fbe0c4 100%)",   // peach warmth
  "linear-gradient(180deg, #fbe0c4 0%, #fff6ea 100%)",   // cream settle
];

const SCENES = [
  { kicker: "Rise and shine", title: "Meet Sunny", body: "A small sun, a soft sky, and nowhere in particular to be." },
  { kicker: "Through lavender clouds", title: "Soft and slow", body: "The wind takes its time up here. So does Sunny." },
  { kicker: "Peach light", title: "Everything warms", body: "Colours lean gold for a while before they settle." },
  { kicker: "Cotton-candy landing", title: "Made it.", body: "A cloud bed, a soft glow, and a story told entirely by scrolling." },
];

export function Story() {
  const root = useRef<HTMLDivElement>(null);
  const drift = useRef<HTMLDivElement>(null); // MotionPath + tilt
  const bob = useRef<HTMLDivElement>(null); // idle float
  const character = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      // Sky cross-fade across the whole scroll
      const skyLayers = gsap.utils.toArray<HTMLElement>(".sky");
      skyLayers.forEach((layer, i) => {
        if (i === 0) return; // first is the base, always visible underneath
        gsap.set(layer, { opacity: 0 });
        gsap.to(layer, {
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: `${(i - 0.5) / skyLayers.length * 100}% top`,
            end: `${(i + 0.2) / skyLayers.length * 100}% top`,
            scrub: true,
          },
        });
      });

      // Character drifts along an S-path as you scroll (MotionPath)
      gsap.to(drift.current, {
        immediateRender: true,
        motionPath: {
          path: [
            { x: 0, y: -10 },
            { x: -110, y: 0 },
            { x: 90, y: 10 },
            { x: -80, y: 0 },
            { x: 60, y: 12 },
            { x: 0, y: 0 },
          ],
          curviness: 1.4,
        },
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
      });

      // Scroll velocity → tilt. Fast scroll = more lean.
      const tiltTo = gsap.quickTo(drift.current, "rotation", {
        duration: 0.5,
        ease: "power3.out",
      });
      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const v = self.getVelocity();
          tiltTo(gsap.utils.clamp(-14, 14, -v / 180));
        },
      });

      // Idle bob + balloon sway (independent of scroll)
      gsap.to(bob.current, {
        y: 14,
        duration: 2.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
      gsap.to(".sunny-glow", {
        scale: 1.06,
        duration: 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        transformOrigin: "center",
      });
      // blink
      gsap.to(".sunny-eyes", {
        scaleY: 0.1,
        duration: 0.09,
        repeat: -1,
        yoyo: true,
        repeatDelay: 2.6,
        transformOrigin: "center",
      });

      // Parallax decorative layers
      gsap.utils.toArray<HTMLElement>(".parallax").forEach((el) => {
        const depth = parseFloat(el.dataset.depth || "0.3");
        gsap.to(el, {
          yPercent: -depth * 260,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        });
      });

      // Scene text reveals
      gsap.utils.toArray<HTMLElement>(".scene").forEach((s) => {
        gsap.from(s.querySelectorAll(".reveal"), {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: s, start: "top 65%" },
        });
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className="relative w-full">
      {/* Sky background layers (fixed) */}
      {SKIES.map((bg, i) => (
        <div
          key={i}
          className="sky pointer-events-none fixed inset-0"
          style={{ background: bg }}
        />
      ))}

      {/* Parallax clouds/birds */}
      <SceneLayers />

      {/* Character (fixed, centred). Layered so scroll-drift, idle-bob and
          the SVG's own part animations never fight over the same transform. */}
      <div className="pointer-events-none fixed left-1/2 top-[24%] z-20 -translate-x-1/2 -translate-y-1/2 sm:top-1/2">
        <div ref={drift}>
          <div ref={bob}>
            <Character ref={character} />
          </div>
        </div>
      </div>

      {/* Text scenes */}
      <div className="relative z-10">
        {SCENES.map((s, i) => (
          <section
            key={i}
            className={`scene flex h-screen w-full flex-col justify-end pb-20 px-8 sm:justify-center sm:pb-0 sm:px-20 ${
              i % 2 === 0 ? "items-start text-left" : "items-end text-right"
            }`}
          >
            <div className={i % 2 === 0 ? "" : "flex flex-col items-end"}>
              <p className="reveal mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#5b3f66]/45">
                {s.kicker}
              </p>
              <h2 className="reveal max-w-md text-4xl font-black tracking-tight text-[#5b3f66] sm:text-6xl">
                {s.title}
              </h2>
              <p className="reveal mt-4 max-w-sm text-sm leading-relaxed text-[#5b3f66]/65 sm:text-base">
                {s.body}
              </p>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
