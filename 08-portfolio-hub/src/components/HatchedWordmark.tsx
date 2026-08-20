type Props = {
  /** Unique per instance — two copies of the wordmark coexist, so their
   *  pattern ids must not collide. */
  idPrefix: string;
  /** Inside the violet slab the palette swaps: lines that were ivory on
   *  violet become violet on ivory. */
  inverted?: boolean;
};

const PAPER = "var(--paper)";
const VIOLET = "var(--violet)";

export function HatchedWordmark({ idPrefix, inverted = false }: Props) {
  const base = inverted ? PAPER : VIOLET;
  const line = inverted ? VIOLET : PAPER;
  const labLine = inverted ? PAPER : VIOLET;

  const sunId = `${idPrefix}-sun`;
  const labId = `${idPrefix}-lab`;

  return (
    <svg
      viewBox="290 0 860 430"
      className="w-full"
      role="img"
      aria-label="Sunny Lab"
      focusable="false"
    >
      <defs>
        <pattern
          id={sunId}
          width="9"
          height="9"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <rect width="9" height="9" fill={base} />
          <line x1="0" y1="0" x2="0" y2="9" stroke={line} strokeWidth="3.2" />
        </pattern>
        <pattern
          id={labId}
          width="9"
          height="9"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-45)"
        >
          <line x1="0" y1="0" x2="0" y2="9" stroke={labLine} strokeWidth="3.6" />
        </pattern>
      </defs>

      <text
        x="720"
        y="192"
        textAnchor="middle"
        fill={`url(#${sunId})`}
        className="wordmark"
      >
        SUNNY
      </text>
      {/* hatch alone loses the letter edges at this size — a hairline stroke
          keeps the counters readable */}
      <text
        x="720"
        y="396"
        textAnchor="middle"
        fill={`url(#${labId})`}
        stroke={labLine}
        strokeWidth="1.6"
        className="wordmark"
      >
        LAB
      </text>
    </svg>
  );
}
