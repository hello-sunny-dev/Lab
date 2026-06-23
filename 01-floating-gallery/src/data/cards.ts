export interface CardData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  stat: string;
  statLabel: string;
  accentColor: string;
  accentRgb: string;
  icon: string;
  position: { x: number; y: number };
  rotation: number;
}

export const cards: CardData[] = [
  {
    id: 1,
    title: "Design",
    subtitle: "Visual Systems",
    description: "Coherent design languages that scale across products.",
    stat: "2.4k",
    statLabel: "components",
    accentColor: "#a78bfa",
    accentRgb: "167, 139, 250",
    icon: "◆",
    position: { x: -270, y: -80 },
    rotation: -6,
  },
  {
    id: 2,
    title: "Motion",
    subtitle: "Fluid Interactions",
    description: "Purposeful animation and micro-interactions.",
    stat: "60fps",
    statLabel: "always",
    accentColor: "#38bdf8",
    accentRgb: "56, 189, 248",
    icon: "◎",
    position: { x: 0, y: -160 },
    rotation: 2,
  },
  {
    id: 3,
    title: "Depth",
    subtitle: "Spatial Layers",
    description: "Immersive parallax and dimensional experiences.",
    stat: "∞",
    statLabel: "layers",
    accentColor: "#fb923c",
    accentRgb: "251, 146, 60",
    icon: "◈",
    position: { x: 300, y: -50 },
    rotation: 5,
  },
  {
    id: 4,
    title: "Craft",
    subtitle: "Pixel Precision",
    description: "Every detail polished to production quality.",
    stat: "1px",
    statLabel: "precision",
    accentColor: "#34d399",
    accentRgb: "52, 211, 153",
    icon: "◇",
    position: { x: -180, y: 150 },
    rotation: -3,
  },
  {
    id: 5,
    title: "Play",
    subtitle: "Delight in Detail",
    description: "Unexpected moments of joy and discovery.",
    stat: "✦",
    statLabel: "moments",
    accentColor: "#f472b6",
    accentRgb: "244, 114, 182",
    icon: "◉",
    position: { x: 200, y: 170 },
    rotation: 4,
  },
];
