"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PROJECTS } from "./projects";

const COMMAND = "ls -la ./experiments";

// Deferred to an effect (rather than framer-motion's own useReducedMotion,
// which resolves synchronously on the client) so the first client render
// always matches the server-rendered HTML — the typed command text is real
// DOM content, and diverging on the first paint is a hydration mismatch,
// not just a style attribute.
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

function useTypewriter(text: string, enabled: boolean, speed = 26) {
  const [count, setCount] = useState(enabled ? 0 : text.length);

  useEffect(() => {
    if (!enabled) {
      setCount(text.length);
      return;
    }
    setCount(0);
    const id = setInterval(() => {
      setCount((c) => {
        if (c >= text.length) {
          clearInterval(id);
          return c;
        }
        return c + 1;
      });
    }, speed);
    return () => clearInterval(id);
  }, [text, enabled, speed]);

  return text.slice(0, count);
}

const lineVariants = {
  hidden: ({ reduced }: { i: number; reduced: boolean; base: number }) => ({
    opacity: 0,
    y: reduced ? 0 : 6,
  }),
  visible: ({ i, base }: { i: number; reduced: boolean; base: number }) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay: base + i * 0.05 },
  }),
};

export function TerminalListing() {
  const reducedMotion = usePrefersReducedMotion();
  const typed = useTypewriter(COMMAND, !reducedMotion);
  const typingDone = typed.length === COMMAND.length;
  const [hovered, setHovered] = useState<number | null>(null);

  // Once the command "finishes typing," the rest of the listing reveals —
  // real terminal pacing instead of everything fading in at once.
  const base = reducedMotion ? 0 : 0.35 + COMMAND.length * (26 / 1000) + 0.15;

  return (
    <main className="min-h-screen bg-[#16140f] px-5 py-14 text-[color:var(--ink)] sm:px-10 sm:py-20">
      <div className="mx-auto max-w-3xl">
        {/* window chrome */}
        <div className="mb-6 flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--dot)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--dot)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--dot)]" />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-sm text-[color:var(--muted)]"
        >
          <span className="text-[color:var(--muted)]">sunny@lab</span>{" "}
          <span className="text-[color:var(--dim)]">~</span> $ {typed}
          {!typingDone && <span className="cursor text-[color:var(--accent)]">█</span>}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: reducedMotion ? 0 : 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: base }}
          className="mt-3 text-2xl font-medium text-[#f4ecd0] sm:text-3xl"
        >
          hello-sunny-dev/lab
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: base + 0.08 }}
          className="mt-2 text-sm leading-relaxed text-[color:var(--muted)]"
        >
          # frontend creative experiments — one weekend, one concept, each one.
        </motion.p>

        <div className="mt-10 border-t border-[color:var(--line)]">
          {PROJECTS.map((project, i) => (
            <motion.a
              key={project.slug}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              custom={{ i, reduced: reducedMotion, base: base + 0.25 }}
              initial="hidden"
              animate="visible"
              variants={lineVariants}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered((h) => (h === i ? null : h))}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered((h) => (h === i ? null : h))}
              className="group relative block border-b border-[color:var(--line)] px-2 py-4 transition-colors hover:bg-[#d4c454]/[0.06] sm:px-3"
            >
              {hovered === i && (
                <motion.span
                  layoutId="row-caret"
                  transition={
                    reducedMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 500, damping: 40 }
                  }
                  className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 bg-[color:var(--accent)]"
                />
              )}
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="w-6 shrink-0 text-sm text-[color:var(--dim)]">
                  {project.number}
                </span>
                <span className="font-medium text-[#f4ecd0]">
                  {project.slug}/
                </span>
                <span className="text-sm text-[color:var(--accent)] opacity-0 transition-opacity group-hover:opacity-100">
                  → live
                </span>
                <span className="ml-auto flex flex-wrap gap-x-2 text-xs text-[color:var(--dim)]">
                  {project.stack.map((tech, ti) => (
                    <span key={tech}>
                      {tech}
                      {ti < project.stack.length - 1 && <span className="ml-2 text-[color:var(--line)]">·</span>}
                    </span>
                  ))}
                </span>
              </div>
              <p className="mt-1.5 pl-9 text-sm leading-relaxed text-[color:var(--muted)]">
                {project.description}
              </p>
            </motion.a>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: base + 0.25 + PROJECTS.length * 0.05 + 0.1 }}
          className="mt-6 text-xs text-[color:var(--dim)]"
        >
          {PROJECTS.length} directories, {PROJECTS.length} deployed — all systems live{" "}
          <span className="cursor text-[color:var(--accent)]">█</span>
        </motion.p>
      </div>
    </main>
  );
}
