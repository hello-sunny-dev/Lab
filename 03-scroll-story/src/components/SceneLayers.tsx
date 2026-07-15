"use client";

function Cloud({ className, scale = 1 }: { className?: string; scale?: number }) {
  return (
    <svg
      viewBox="0 0 200 90"
      className={className}
      style={{ width: 200 * scale }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="#fffaf3">
        <ellipse cx="60" cy="55" rx="45" ry="30" />
        <ellipse cx="110" cy="45" rx="52" ry="38" />
        <ellipse cx="155" cy="58" rx="38" ry="26" />
        <rect x="55" y="55" width="105" height="28" rx="14" />
      </g>
    </svg>
  );
}

function Bird({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 20" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2 12 q8 -12 18 0 q10 -12 18 0"
        fill="none"
        stroke="#8a6b96"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}

/** Decorative parallax layers. Each gets a `data-depth` used by the Story
 *  ScrollTrigger to move it at a different speed. */
export function SceneLayers() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* far clouds */}
      <div className="parallax absolute left-[8%] top-[14%] opacity-80" data-depth="0.15">
        <Cloud scale={0.7} />
      </div>
      <div className="parallax absolute right-[10%] top-[26%] opacity-70" data-depth="0.1">
        <Cloud scale={0.55} />
      </div>
      {/* mid clouds */}
      <div className="parallax absolute left-[60%] top-[48%]" data-depth="0.35">
        <Cloud scale={1.1} />
      </div>
      <div className="parallax absolute left-[4%] top-[62%]" data-depth="0.4">
        <Cloud scale={1.3} />
      </div>
      {/* birds */}
      <div className="parallax absolute left-[24%] top-[38%]" data-depth="0.25">
        <Bird className="w-10" />
      </div>
      <div className="parallax absolute left-[30%] top-[41%]" data-depth="0.25">
        <Bird className="w-7" />
      </div>
      {/* near clouds */}
      <div className="parallax absolute right-[6%] top-[74%]" data-depth="0.6">
        <Cloud scale={1.6} />
      </div>
      <div className="parallax absolute left-[40%] top-[88%]" data-depth="0.7">
        <Cloud scale={1.9} />
      </div>
    </div>
  );
}
