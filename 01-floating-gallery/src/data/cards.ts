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
}

export const slots = [
  { position: { x: -270, y: -80 }, rotation: -6 },
  { position: { x: 0, y: -160 }, rotation: 2 },
  { position: { x: 300, y: -50 }, rotation: 5 },
  { position: { x: -180, y: 150 }, rotation: -3 },
  { position: { x: 200, y: 170 }, rotation: 4 },
];

export const cards: CardData[] = [
  {
    id: 1,
    title: "Design",
    subtitle: "Visual Systems",
    description: "Coherent design languages that scale across products and platforms. Building component libraries that empower teams.",
    stat: "2.4k",
    statLabel: "components",
    accentColor: "#a78bfa",
    accentRgb: "167, 139, 250",
    icon: "◆",
  },
  {
    id: 2,
    title: "Motion",
    subtitle: "Fluid Interactions",
    description: "Purposeful animation that guides attention and creates seamless transitions between states.",
    stat: "60fps",
    statLabel: "always",
    accentColor: "#38bdf8",
    accentRgb: "56, 189, 248",
    icon: "◎",
  },
  {
    id: 3,
    title: "Depth",
    subtitle: "Spatial Layers",
    description: "Immersive experiences through parallax, perspective, and spatial computing paradigms.",
    stat: "∞",
    statLabel: "layers",
    accentColor: "#fb923c",
    accentRgb: "251, 146, 60",
    icon: "◈",
  },
  {
    id: 4,
    title: "Craft",
    subtitle: "Pixel Precision",
    description: "Every detail polished to production quality. Obsessive attention to spacing, typography, and interaction feel.",
    stat: "1px",
    statLabel: "precision",
    accentColor: "#34d399",
    accentRgb: "52, 211, 153",
    icon: "◇",
  },
  {
    id: 5,
    title: "Play",
    subtitle: "Delight in Detail",
    description: "Unexpected moments of joy. Easter eggs, satisfying micro-interactions, and playful discovery.",
    stat: "✦",
    statLabel: "moments",
    accentColor: "#f472b6",
    accentRgb: "244, 114, 182",
    icon: "◉",
  },
];
