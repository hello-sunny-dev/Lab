export type Project = {
  number: string;
  slug: string;
  title: string;
  /** Short label shown beside the title in the index. */
  kind: string;
  description: string;
  stack: string[];
  url: string;
};

export const PROJECTS: Project[] = [
  {
    number: "01",
    slug: "glasscards-spread",
    kind: "Interface study",
    title: "GlassCards Spread",
    description:
      "Interactive glassmorphic cards with scroll-driven spread, 3D tilt, and click-to-reveal interactions.",
    stack: ["Next.js", "Framer Motion", "Tailwind"],
    url: "https://01-glasscards-spread.vercel.app",
  },
  {
    number: "02",
    slug: "3d-hero-landing",
    kind: "Landing system",
    title: "3D Hero Landing",
    description:
      "A premium landing page built around a single glass 3D object, camera choreographed by scroll.",
    stack: ["Next.js", "React Three Fiber", "Three.js"],
    url: "https://02-3d-hero-landing.vercel.app",
  },
  {
    number: "03",
    slug: "scroll-story",
    kind: "Narrative scroll",
    title: "Scroll Storytelling",
    description:
      "A day passing, told entirely by scrolling — sun crossfades into moon as the sky goes from morning to night.",
    stack: ["Next.js", "GSAP", "Lenis"],
    url: "https://03-scroll-story.vercel.app",
  },
  {
    number: "04",
    slug: "product-exploder",
    kind: "Product teardown",
    title: "Product Exploder",
    description:
      "A 35mm film camera taken apart by hand — drag to explode into named parts, hover for facts.",
    stack: ["Next.js", "React Three Fiber", "Three.js"],
    url: "https://04-product-exploder.vercel.app",
  },
  {
    number: "05",
    slug: "interactive-planet",
    kind: "Shader study",
    title: "Interactive Planet",
    description:
      "A stylized planet in hand-written GLSL — noise-shaded terrain, drifting clouds, Fresnel atmosphere.",
    stack: ["Next.js", "React Three Fiber", "GLSL"],
    url: "https://05-interactive-planet.vercel.app",
  },
  {
    number: "06",
    slug: "interactive-room",
    kind: "Scene system",
    title: "Interactive Room",
    description:
      "\"Sunny's Desk\" — a small office scene with lamp, monitor, and window state shared via Zustand.",
    stack: ["Next.js", "React Three Fiber", "Zustand"],
    url: "https://06-interactive-room.vercel.app",
  },
  {
    number: "07",
    slug: "particle-morph",
    kind: "GPU experiment",
    title: "Particle Morph",
    description:
      "Thousands of GPU particles spelling \"LAB\" — scatter from the cursor, morph into Sunny's silhouette.",
    stack: ["Next.js", "React Three Fiber", "GLSL"],
    url: "https://07-particle-morph.vercel.app",
  },
];
