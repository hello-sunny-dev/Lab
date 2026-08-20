"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { HatchedWordmark } from "./HatchedWordmark";
import { PROJECTS } from "./projects";

/** Resting square size, relative to the shorter side of the stage, clamped
 *  so it stays a deliberate mark on a phone and never a billboard. */
function restingSquare(w: number, h: number) {
  return Math.max(96, Math.min(180, Math.min(w, h) * 0.19));
}

/** Deferred to an effect rather than framer-motion's useReducedMotion, which
 *  resolves synchronously on the client and would diverge from the server's
 *  first paint. */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const cb = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
  }, []);
  return reduced;
}

export function LabIndex() {
  const page = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  const [size, setSize] = useState({ w: 0, h: 0 });
  const [indexLive, setIndexLive] = useState(false);

  const { scrollYProgress } = useScroll({
    target: page,
    offset: ["start start", "end end"],
  });

  // Cursor, normalised. Springs give the square its trailing lag — it chases
  // the pointer rather than snapping to it.
  // At rest the square sits on the wordmark, not the dead centre of the
  // viewport — on touch, where nothing moves it, that is where it stays.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.45);
  const sx = useSpring(px, { stiffness: 120, damping: 22, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 120, damping: 22, mass: 0.6 });

  // Growth, smoothstepped so the takeover accelerates. It finishes well
  // before the scroll does — the wordmark has to still be on screen while
  // the slab eats it, or the inversion never gets seen.
  const grow = useTransform(scrollYProgress, (v) => {
    const p = Math.min(1, Math.max(0, v / 0.55));
    return p * p * (3 - 2 * p);
  });

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    // Pointer chase is a desktop affordance; a touch device has no hover.
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;
    const el = stage.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      px.set((e.clientX - r.left) / r.width);
      py.set((e.clientY - r.top) / r.height);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [px, py, reducedMotion]);

  // The square's rect, as a clip-path. Cursor influence decays to nothing
  // exactly as the slab takes the page over, so the two never fight.
  const toClip = (input: number[]) => {
    const [x, y, g] = input;
    const { w, h } = size;
    if (!w || !h) return "inset(50% 50% 50% 50%)";

    const follow = 1 - g;
    const cx = (x * follow + 0.5 * (1 - follow)) * w;
    const cy = (y * follow + 0.5 * (1 - follow)) * h;

    const sq = restingSquare(w, h);
    const bw = sq + (w - sq) * g;
    const bh = sq + (h - sq) * g;
    const left = cx - bw / 2;
    const top = cy - bh / 2;

    return `inset(${top}px ${w - left - bw}px ${h - top - bh}px ${left}px)`;
  };

  // A motion value is owned by the element it is bound to, so the slab and
  // its inverted twin each need their own — sharing one leaves the second
  // element stuck on a stale value. Same for the two hero layers.
  const clipSlab = useTransform<number, string>([sx, sy, grow], toClip);
  const clipCopy = useTransform<number, string>([sx, sy, grow], toClip);

  // Hero holds until the slab has almost swallowed it, then hands over.
  // Written straight to the nodes: binding three opacities through motion
  // components left their inline styles stale here, and a wrong opacity is
  // the difference between the hand-off reading as a cut or as a mess.
  const heroBaseRef = useRef<HTMLDivElement>(null);
  const heroCopyRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef<HTMLDivElement>(null);

  const headRef = useRef<HTMLHeadingElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  const applyPhase = (v: number) => {
    const span = (from: number, to: number) =>
      Math.min(1, Math.max(0, (v - from) / (to - from)));

    const hero = String(1 - span(0.34, 0.5));
    if (heroBaseRef.current) heroBaseRef.current.style.opacity = hero;
    if (heroCopyRef.current) heroCopyRef.current.style.opacity = hero;

    // The index is cut in, not faded — by the time it arrives the slab is
    // already solid violet, so there is nothing for a fade to happen against.
    if (indexRef.current) indexRef.current.style.opacity = v >= 0.53 ? "1" : "0";

    // Each line rises out of its own overflow mask, one after the next.
    const rise = (p: number) => `translateY(${((1 - p) * 105).toFixed(2)}%)`;
    if (headRef.current) headRef.current.style.transform = rise(span(0.53, 0.62));
    rowRefs.current.forEach((el, i) => {
      if (!el) return;
      const start = 0.56 + i * 0.028;
      el.style.transform = rise(span(start, start + 0.1));
    });
  };

  useEffect(() => {
    applyPhase(scrollYProgress.get());
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setIndexLive(v > 0.6);
    applyPhase(v);
  });

  return (
    <div ref={page} className="relative h-[220vh] bg-[color:var(--paper)]">
      <div
        ref={stage}
        className="sticky top-0 h-[100dvh] overflow-hidden text-[color:var(--ink)]"
      >
        {/* spine */}
        <div className="pointer-events-none absolute inset-y-0 left-1/2 z-[1] w-px bg-[color:var(--ink)] opacity-[0.16]" />

        {/* ---------- base layer, on ivory ---------- */}
        <div className="absolute inset-0 z-[2]">
          <Chrome />
          <div ref={heroBaseRef}>
            <Hero>
              <HatchedWordmark idPrefix="base" />
            </Hero>
          </div>
        </div>

        {/* ---------- the slab ---------- */}
        <motion.div
          style={{ clipPath: clipSlab }}
          className="pointer-events-none absolute inset-0 z-[3] bg-[color:var(--violet)]"
        />

        {/* ---------- inverted copy, clipped to the slab ---------- */}
        <motion.div
          style={{ clipPath: clipCopy }}
          className="pointer-events-none absolute inset-0 z-[4] text-[color:var(--paper)]"
        >
          <div className="absolute inset-y-0 left-1/2 w-px bg-[color:var(--paper)] opacity-30" />
          <Chrome inverted />
          <div ref={heroCopyRef}>
            <Hero inverted>
              <HatchedWordmark idPrefix="inv" inverted />
            </Hero>
          </div>
        </motion.div>

        {/* ---------- the index, once the slab owns the page ---------- */}
        <div
          ref={indexRef}
          style={{ opacity: 0 }}
          className="absolute inset-0 z-[5] flex flex-col px-6 py-10 text-[color:var(--paper)] sm:px-12"
          aria-hidden={!indexLive}
        >
          {/* the persistent chrome already names the page — a second header
              here just stacks on top of it */}
          <div className="shrink-0 overflow-hidden">
            <h2
              ref={headRef}
              className="mt-8 text-center text-2xl font-black tracking-tight sm:mt-12 sm:text-4xl"
            >
              THE INDEX
            </h2>
          </div>

          {/* Rows share whatever height is left, so the list always reaches
              the bottom of the screen instead of bunching at the top. Each
              keeps a floor; when the floors no longer fit — a short phone —
              the list scrolls rather than being squeezed or clipped. */}
          <ul className="mt-6 flex min-h-0 flex-1 flex-col overflow-y-auto sm:mt-10">
            {PROJECTS.map((project, i) => (
              <li
                key={project.slug}
                className="flex min-h-[62px] flex-1 overflow-hidden border-t border-white/25 sm:min-h-[72px]"
              >
                <div
                  className="flex w-full items-center"
                  ref={(el) => {
                    rowRefs.current[i] = el;
                  }}
                >
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={indexLive ? 0 : -1}
                    className="group grid w-full grid-cols-[auto_1fr] items-center gap-3 opacity-70 transition-opacity duration-200 hover:opacity-100 focus-visible:opacity-100 sm:grid-cols-[1fr_auto_1fr] sm:gap-6"
                  >
                    <span className="order-2 text-lg font-black tracking-tight transition-transform duration-300 group-hover:translate-x-1 sm:order-1 sm:text-right sm:text-3xl sm:group-hover:translate-x-0 sm:group-hover:-translate-x-1.5">
                      {project.title}
                    </span>
                    <span className="order-1 inline-flex h-6 w-11 items-center justify-center border border-white/50 font-mono text-[10px] transition-colors duration-200 group-hover:bg-[color:var(--paper)] group-hover:text-[color:var(--violet)] sm:order-2">
                      {project.number}
                    </span>
                    <span className="order-3 hidden sm:block">
                      <span className="block font-mono text-[10px] uppercase tracking-[0.14em] opacity-70">
                        {project.kind}
                      </span>
                      <span className="mt-1 block text-[13px] leading-snug">
                        {project.summary}
                      </span>
                    </span>
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Chrome({ inverted = false }: { inverted?: boolean }) {
  return (
    <div className="flex items-center justify-between px-6 py-6 font-mono text-[10px] tracking-[0.16em] sm:px-12 sm:text-[11px]">
      <span className={inverted ? "opacity-70" : "opacity-60"}>SUNNY&rsquo;S LAB</span>
      <span className={inverted ? "opacity-70" : "opacity-60"}>INDEX &mdash; 2026</span>
    </div>
  );
}

function Hero({
  children,
  inverted = false,
}: {
  children: React.ReactNode;
  inverted?: boolean;
}) {
  return (
    <>
      <p
        className={`absolute inset-x-0 top-[14%] px-6 text-center font-mono text-[10px] tracking-[0.16em] sm:text-[11px] ${
          inverted ? "opacity-75" : "opacity-60"
        }`}
      >
        AN ONGOING SIDE PRACTICE &mdash; MOTION, MATERIAL, THE BROWSER.
      </p>

      <div className="absolute inset-x-0 top-[28%] mx-auto w-full max-w-[1000px] px-4 sm:px-10">
        {children}
      </div>

      <p
        className={`absolute inset-x-0 bottom-[11%] px-6 text-center text-sm sm:text-[15px] ${
          inverted ? "opacity-80" : "opacity-70"
        }`}
      >
        {PROJECTS.length} experiments. Each about one idea. All of them live.
      </p>

      <span
        className={`absolute inset-x-0 bottom-[5%] text-center font-mono text-[10px] tracking-[0.16em] ${
          inverted ? "opacity-70" : "opacity-55"
        }`}
      >
        SCROLL
      </span>
    </>
  );
}
