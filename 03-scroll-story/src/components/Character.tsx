"use client";

import { forwardRef } from "react";

/**
 * Sunny — placeholder mascot until the sourced Lottie sun replaces this SVG.
 * Parts are grouped with classnames so GSAP can animate them independently
 * (glow pulses, eyes blink).
 */
export const Character = forwardRef<SVGSVGElement>(function Character(_, ref) {
  return (
    <svg
      ref={ref}
      viewBox="0 0 200 200"
      className="h-[30vh] w-auto max-h-[260px] drop-shadow-[0_20px_30px_rgba(107,75,125,0.18)]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="sunnyHalo" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#fff6ea" stopOpacity="0.95" />
          <stop offset="55%" stopColor="#f7c9df" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#f7c9df" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="sunnyBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff2df" />
          <stop offset="100%" stopColor="#f6c9e0" />
        </linearGradient>
      </defs>

      <g className="sunny-glow" style={{ transformOrigin: "100px 100px" }}>
        <circle cx="100" cy="100" r="98" fill="url(#sunnyHalo)" />
        <circle
          cx="100"
          cy="100"
          r="60"
          fill="none"
          stroke="#c9aee0"
          strokeWidth="2"
          strokeDasharray="1 11"
          strokeLinecap="round"
          opacity="0.85"
        />
      </g>

      <circle cx="100" cy="100" r="50" fill="url(#sunnyBody)" />

      <g className="sunny-eyes">
        <circle cx="84" cy="94" r="4.5" fill="#8a6b96" />
        <circle cx="116" cy="94" r="4.5" fill="#8a6b96" />
      </g>
      <path
        d="M85 114 Q100 124 115 114"
        fill="none"
        stroke="#8a6b96"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <circle cx="76" cy="106" r="5" fill="#f6a8ca" opacity="0.55" />
      <circle cx="124" cy="106" r="5" fill="#f6a8ca" opacity="0.55" />
    </svg>
  );
});
