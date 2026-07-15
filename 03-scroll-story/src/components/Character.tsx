"use client";

import { forwardRef } from "react";

/**
 * Pip — a round balloon-traveller. Parts are grouped with ids so GSAP can
 * animate them independently (balloons sway, eyes blink, arms wave).
 */
export const Character = forwardRef<SVGSVGElement>(function Character(_, ref) {
  return (
    <svg
      ref={ref}
      viewBox="0 0 200 300"
      className="h-[38vh] w-auto max-h-[320px] drop-shadow-[0_20px_30px_rgba(0,0,0,0.12)]"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Balloons */}
      <g className="pip-balloons" style={{ transformOrigin: "100px 40px" }}>
        <line x1="100" y1="150" x2="78" y2="52" stroke="#3a2e2a" strokeWidth="1.5" opacity="0.5" />
        <line x1="100" y1="150" x2="122" y2="48" stroke="#3a2e2a" strokeWidth="1.5" opacity="0.5" />
        <line x1="100" y1="150" x2="100" y2="30" stroke="#3a2e2a" strokeWidth="1.5" opacity="0.5" />
        <ellipse cx="78" cy="44" rx="26" ry="30" fill="#ff8a4c" />
        <ellipse cx="122" cy="40" rx="24" ry="28" fill="#ffd23f" />
        <ellipse cx="100" cy="24" rx="28" ry="32" fill="#ef476f" />
        {/* highlights */}
        <ellipse cx="70" cy="36" rx="7" ry="9" fill="#fff" opacity="0.35" />
        <ellipse cx="115" cy="32" rx="6" ry="8" fill="#fff" opacity="0.35" />
        <ellipse cx="92" cy="16" rx="8" ry="10" fill="#fff" opacity="0.35" />
      </g>

      {/* Body */}
      <g className="pip-body" style={{ transformOrigin: "100px 210px" }}>
        {/* arms */}
        <path className="pip-arm-l" d="M70 200 q-24 6 -30 26" fill="none" stroke="#6c5ce7" strokeWidth="14" strokeLinecap="round" style={{ transformOrigin: "70px 200px" }} />
        <path className="pip-arm-r" d="M130 200 q24 6 30 26" fill="none" stroke="#6c5ce7" strokeWidth="14" strokeLinecap="round" style={{ transformOrigin: "130px 200px" }} />
        {/* torso */}
        <ellipse cx="100" cy="212" rx="48" ry="52" fill="#6c5ce7" />
        <ellipse cx="100" cy="222" rx="34" ry="34" fill="#a29bfe" opacity="0.55" />
        {/* face */}
        <g className="pip-eyes">
          <circle cx="84" cy="200" r="7" fill="#fff" />
          <circle cx="116" cy="200" r="7" fill="#fff" />
          <circle className="pip-pupil-l" cx="85" cy="202" r="3.4" fill="#2d2438" />
          <circle className="pip-pupil-r" cx="117" cy="202" r="3.4" fill="#2d2438" />
        </g>
        {/* cheeks + smile */}
        <circle cx="74" cy="216" r="6" fill="#ff8a4c" opacity="0.5" />
        <circle cx="126" cy="216" r="6" fill="#ff8a4c" opacity="0.5" />
        <path d="M90 216 q10 10 20 0" fill="none" stroke="#2d2438" strokeWidth="3" strokeLinecap="round" />
        {/* feet */}
        <ellipse cx="84" cy="262" rx="12" ry="8" fill="#4b3fb0" />
        <ellipse cx="116" cy="262" rx="12" ry="8" fill="#4b3fb0" />
      </g>
    </svg>
  );
});
