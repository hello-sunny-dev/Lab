"use client";

import { motion } from "framer-motion";
import { PROJECTS } from "./projects";

const lineVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay: 0.35 + i * 0.05 },
  }),
};

export function TerminalListing() {
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
          <span className="text-[color:var(--dim)]">~</span>{" "}
          $ ls -la ./experiments
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="mt-3 text-2xl font-medium text-[#f4ecd0] sm:text-3xl"
        >
          hello-sunny-dev/lab
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.18 }}
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
              custom={i}
              initial="hidden"
              animate="visible"
              variants={lineVariants}
              className="group block border-b border-[color:var(--line)] px-2 py-4 transition-colors hover:bg-[#d4c454]/[0.06] sm:px-3"
            >
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
          transition={{ duration: 0.3, delay: 0.35 + PROJECTS.length * 0.05 + 0.1 }}
          className="mt-6 text-xs text-[color:var(--dim)]"
        >
          {PROJECTS.length} directories, {PROJECTS.length} deployed — all systems live{" "}
          <span className="cursor text-[color:var(--accent)]">█</span>
        </motion.p>
      </div>
    </main>
  );
}
