"use client";

import { forwardRef } from "react";

/**
 * Moon — Sunny's night counterpart. Same silhouette/construction as
 * Character.tsx (halo, gradient body, dot eyes, smile) so the two read as
 * a matched pair, just recolored cool and given craters instead of a blush.
 */
export const Moon = forwardRef<SVGSVGElement>(function Moon(_, ref) {
  return (
    <svg
      ref={ref}
      viewBox="0 0 200 200"
      className="h-[30vh] w-auto max-h-[260px] drop-shadow-[0_20px_30px_rgba(20,15,40,0.35)]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="moonHalo" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#e6e8fb" stopOpacity="0.9" />
          <stop offset="55%" stopColor="#9aa0d6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#9aa0d6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="moonBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#eef0fb" />
          <stop offset="100%" stopColor="#a9addb" />
        </linearGradient>
      </defs>

      <g className="moon-glow" style={{ transformOrigin: "100px 100px" }}>
        <circle cx="100" cy="100" r="98" fill="url(#moonHalo)" />
        <circle
          cx="100"
          cy="100"
          r="60"
          fill="none"
          stroke="#c7cbee"
          strokeWidth="2"
          strokeDasharray="1 11"
          strokeLinecap="round"
          opacity="0.85"
        />
      </g>

      <circle cx="100" cy="100" r="50" fill="url(#moonBody)" />

      {/* craters */}
      <circle cx="80" cy="82" r="7" fill="#8d92c4" opacity="0.4" />
      <circle cx="118" cy="76" r="4.5" fill="#8d92c4" opacity="0.35" />
      <circle cx="122" cy="112" r="6" fill="#8d92c4" opacity="0.4" />

      <g className="moon-eyes">
        <circle cx="84" cy="94" r="4.5" fill="#4a4a6e" />
        <circle cx="116" cy="94" r="4.5" fill="#4a4a6e" />
      </g>
      <path
        d="M85 114 Q100 122 115 114"
        fill="none"
        stroke="#4a4a6e"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
});
