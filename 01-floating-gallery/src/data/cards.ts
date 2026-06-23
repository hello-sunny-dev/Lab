export interface CardData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  gradient: string;
  glowColor: string;
  icon: string;
}

export const cards: CardData[] = [
  {
    id: 1,
    title: "Design",
    subtitle: "Visual Systems",
    description: "Crafting coherent design languages that scale across products and platforms.",
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    glowColor: "rgba(139, 92, 246, 0.4)",
    icon: "◆",
  },
  {
    id: 2,
    title: "Motion",
    subtitle: "Fluid Interactions",
    description: "Bringing interfaces to life with purposeful animation and micro-interactions.",
    gradient: "from-cyan-400 via-blue-500 to-indigo-500",
    glowColor: "rgba(59, 130, 246, 0.4)",
    icon: "◎",
  },
  {
    id: 3,
    title: "Depth",
    subtitle: "Spatial Layers",
    description: "Creating immersive experiences through parallax, perspective, and dimension.",
    gradient: "from-amber-400 via-orange-500 to-red-500",
    glowColor: "rgba(249, 115, 22, 0.4)",
    icon: "◈",
  },
  {
    id: 4,
    title: "Craft",
    subtitle: "Pixel Precision",
    description: "Obsessing over every detail to deliver polished, production-ready experiences.",
    gradient: "from-emerald-400 via-teal-500 to-cyan-500",
    glowColor: "rgba(20, 184, 166, 0.4)",
    icon: "◇",
  },
  {
    id: 5,
    title: "Play",
    subtitle: "Delight in Detail",
    description: "Surprising users with unexpected moments of joy and interactive discovery.",
    gradient: "from-rose-400 via-pink-500 to-purple-500",
    glowColor: "rgba(236, 72, 153, 0.4)",
    icon: "◉",
  },
];
