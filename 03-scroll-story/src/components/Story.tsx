"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useGSAP } from "@gsap/react";
import { Character } from "./Character";
import { Moon } from "./Moon";
import { SceneLayers } from "./SceneLayers";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, useGSAP);

// Sky gradients — a full day, morning to night
const SKIES = [
  "linear-gradient(180deg, #bfe0f5 0%, #f0d3e8 100%)",   // morning: pale blue to lavender horizon
  "linear-gradient(180deg, #f6cfe0 0%, #ffd9a0 100%)",   // midday: warm pink-gold, sun high
  "linear-gradient(180deg, #ff9a76 0%, #4b2e6b 100%)",   // dusk: coral bleeding into purple
  "linear-gradient(180deg, #2a1a45 0%, #0c0916 100%)",   // night: purple-black
];

// Text color shifts with the sky — dark ink on the light morning/midday
// scenes, pale ink once the background goes dusk/night.
const SCENES = [
  {
    kicker: "Morning",
    title: "Meet Sunny",
    body: "A small sun clears the horizon. Nowhere in particular to be.",
    ink: "#4a3a5c",
    inkMuted: "rgba(74,58,92,0.55)",
  },
  {
    kicker: "Midday",
    title: "High and warm",
    body: "The sky opens wide and Sunny climbs with it.",
    ink: "#4a3a5c",
    inkMuted: "rgba(74,58,92,0.55)",
  },
  {
    kicker: "Dusk",
    title: "Sunny dips low",
    body: "Colour drains west as the sky leans purple.",
    ink: "#fdeede",
    inkMuted: "rgba(253,238,222,0.65)",
  },
  {
    kicker: "Night",
    title: "Hello, Moon",
    body: "Sunny rests. Something quieter takes the sky.",
    ink: "#f2ecff",
    inkMuted: "rgba(242,236,255,0.6)",
  },
];

export function Story() {
  const root = useRef<HTMLDivElement>(null);
  const drift = useRef<HTMLDivElement>(null); // MotionPath + tilt
  const bob = useRef<HTMLDivElement>(null); // idle float
  const character = useRef<SVGSVGElement>(null);
  const sunGroup = useRef<HTMLDivElement>(null);
  const moon = useRef<SVGSVGElement>(null);
  const moonGroup = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // Sky cross-fade across the whole scroll.
      // Note: "X% top" positions are a fraction of the TRIGGER's own height,
      // not of the scrollable distance. With N equal-height (h-screen)
      // scenes, total trigger height is N * viewport height, but you can
      // only ever scroll (N-1) viewport-heights — so as a fraction of
      // trigger height, nothing past (N-1)/N (75% for N=4) is reachable.
      // Any "end" above that never finishes, however far you scroll.
      const skyLayers = gsap.utils.toArray<HTMLElement>(".sky");
      const REACHABLE_MAX = ((skyLayers.length - 1) / skyLayers.length) * 100; // 75 for 4 scenes
      skyLayers.forEach((layer, i) => {
        if (i === 0) return; // first is the base, always visible underneath
        gsap.set(layer, { opacity: 0 });
        gsap.to(layer, {
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: `${(i - 0.5) / skyLayers.length * 100}% top`,
            end: `${Math.min((i + 0.2) / skyLayers.length * 100, REACHABLE_MAX - 1)}% top`,
            scrub: true,
          },
        });
      });

      // Sunny sets, Moon rises — crossfade across dusk into night, landing
      // fully swapped just before the reachable ceiling above.
      gsap.set(moonGroup.current, { opacity: 0 });
      gsap.to(sunGroup.current, {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "50% top",
          end: `${REACHABLE_MAX - 1}% top`,
          scrub: true,
        },
      });
      gsap.to(moonGroup.current, {
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "50% top",
          end: `${REACHABLE_MAX - 1}% top`,
          scrub: true,
        },
      });

      // Stars fade in a little after the moon starts taking over
      gsap.to(".stars", {
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "58% top",
          end: `${REACHABLE_MAX - 1}% top`,
          scrub: true,
        },
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

      // Scroll velocity → tilt. Fast scroll = more lean. Skipped under
      // reduced motion — a page-wide lean tied to scroll speed is exactly
      // the kind of motion that setting asks to remove.
      if (!prefersReducedMotion) {
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
      }

      // Idle bob + glow pulse + blink — all continuous, autoplaying loops,
      // independent of scroll. Skipped under reduced motion; the character
      // stays put instead of endlessly bobbing/pulsing/blinking.
      if (!prefersReducedMotion) {
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
        gsap.to(".sunny-eyes", {
          scaleY: 0.1,
          duration: 0.09,
          repeat: -1,
          yoyo: true,
          repeatDelay: 2.6,
          transformOrigin: "center",
        });
        gsap.to(".moon-glow", {
          scale: 1.05,
          duration: 3.6,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          transformOrigin: "center",
        });
        gsap.to(".moon-eyes", {
          scaleY: 0.1,
          duration: 0.09,
          repeat: -1,
          yoyo: true,
          repeatDelay: 3.4,
          transformOrigin: "center",
        });
      }

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

      {/* Character (fixed, centred). Sunny and Moon share the exact same
          drift/bob transform and stack on top of each other — the scroll
          crossfade trades one for the other in place, nothing moves. */}
      <div className="pointer-events-none fixed left-1/2 top-[24%] z-20 -translate-x-1/2 -translate-y-1/2 sm:top-1/2">
        <div ref={drift}>
          <div ref={bob} className="relative">
            <div ref={sunGroup}>
              <Character ref={character} />
            </div>
            <div ref={moonGroup} className="absolute inset-0">
              <Moon ref={moon} />
            </div>
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
              <p
                className="reveal mb-3 text-xs font-semibold uppercase tracking-[0.3em] transition-colors duration-500"
                style={{ color: s.inkMuted }}
              >
                {s.kicker}
              </p>
              <h2
                className="reveal max-w-md text-4xl font-black tracking-tight transition-colors duration-500 sm:text-6xl"
                style={{ color: s.ink }}
              >
                {s.title}
              </h2>
              <p
                className="reveal mt-4 max-w-sm text-sm leading-relaxed transition-colors duration-500 sm:text-base"
                style={{ color: s.inkMuted }}
              >
                {s.body}
              </p>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
