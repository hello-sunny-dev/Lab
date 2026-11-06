export interface StoryScene {
  kicker: string;
  title: string;
  body: string;
  ink: string;
  inkMuted: string;
}

// Sky gradients — a full day, morning to night
export const SKIES: string[] = [
  "linear-gradient(180deg, #bfe0f5 0%, #f0d3e8 100%)",   // morning: pale blue to lavender horizon
  "linear-gradient(180deg, #f6cfe0 0%, #ffd9a0 100%)",   // midday: warm pink-gold, sun high
  "linear-gradient(180deg, #ff9a76 0%, #4b2e6b 100%)",   // dusk: coral bleeding into purple
  "linear-gradient(180deg, #2a1a45 0%, #0c0916 100%)",   // night: purple-black
];

// Text color shifts with the sky — dark ink on the light morning/midday
// scenes, pale ink once the background goes dusk/night.
export const SCENES: StoryScene[] = [
  {
    kicker: "Morning",
    title: "Meet Sunny",
    body: "A small sun clears the horizon. Nowhere in particular to be.",
    ink: "#4a3a5c",
    inkMuted: "rgba(74,58,92,0.55)",
  },
  {
    kicker: "Midday",
    title: "High and warm",
    body: "The sky opens wide and Sunny climbs with it.",
    ink: "#4a3a5c",
    inkMuted: "rgba(74,58,92,0.55)",
  },
  {
    kicker: "Dusk",
    title: "Sunny dips low",
    body: "Colour drains west as the sky leans purple.",
    ink: "#fdeede",
    inkMuted: "rgba(253,238,222,0.65)",
  },
  {
    kicker: "Night",
    title: "Hello, Moon",
    body: "Sunny rests. Something quieter takes the sky.",
    ink: "#f2ecff",
    inkMuted: "rgba(242,236,255,0.6)",
  },
];
