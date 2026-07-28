# Lab

Frontend creative experiments — interactive experiences, motion, WebGL, and spatial UI.

Each project is a weekend-sized, deployable experiment exploring a single concept.

## Projects

### 01 — GlassCards Spread `✅ Live`

**[View Live](https://01-glasscards-spread.vercel.app)**

Interactive glassmorphic cards with scroll-driven spread, 3D tilt, and click-to-reveal interactions.

- **Stack:** Next.js 16, Framer Motion, Tailwind CSS
- **Key features:**
  - Scroll/swipe to spread/gather cards
  - Click card → grows from its spot to center with accent color fill
  - Per-card 3D tilt + wiggle on hover (visual layers only)
  - Shuffle button reorders cards across layout slots; doubles as Back
  - Background glow parallax following cursor
  - Mobile responsive with touch support
- **Learned:**
  - Framer Motion springs, `useMotionValue`/`useTransform` composition
  - Never mix `animate` prop and `style` motion values on the same property
  - Keep hit areas on flat, non-transforming elements — mouse-driven transforms on containers move hit targets under the cursor and cause cursor flicker
  - Separate layout slots from card data so shuffle actually moves content

---

### 02 — 3D Hero Landing `✅ Live`

**[View Live](https://02-3d-hero-landing.vercel.app)**

A premium landing page built around a single glass 3D object, with a camera choreographed entirely by scroll.

- **Stack:** Next.js 16, React Three Fiber, Three.js, Tailwind CSS
- **Key features:**
  - Glass torus-knot with `MeshTransmissionMaterial` (real-time refraction + chromatic aberration)
  - Scroll-driven camera orbiting ~160° and pulling back across 3 pages
  - Three text sections flowing with the scroll (center / left / right)
  - Procedural Lightformer environment — no remote HDR, renders instantly
  - Directional scroll indicator (flips to "Scroll up" on the last page)
  - Mobile-tuned: camera distance, geometry/sample resolution, capped DPR
- **Learned:**
  - R3F fundamentals — `Canvas`, `useFrame`, `useThree`, `ScrollControls`/`useScroll`
  - Physically-based transmission materials and why `backside` sells the glass look
  - Procedural env lighting to avoid multi-MB HDR downloads that blank the scene
  - Keeping DOM overlays `pointer-events-none` and out of the Canvas

---

### 03 — Scroll Storytelling `🔜 Next`

A narrative experience driven by scroll position, combining GSAP ScrollTrigger with R3F.

- **Focus:** Storytelling, animation timelines, scroll-linked 3D transitions

---

### 04 — Product Exploder `🚧 Draft scaffold`

A 35mm film camera, taken apart by hand: drag a slider to explode it into its named parts, orbit around it, hover any part for a one-line fact.

- **Stack:** Next.js 16, React Three Fiber, Three.js, Tailwind CSS
- **Key features (so far):**
  - Slider-driven explode (0→1), each part flies out along its own vector/distance rather than a uniform offset
  - Hover a part → highlight + dim the rest + floating label with name and fact
  - Orbit camera, responsive distance for portrait/narrow viewports
  - Procedural placeholder geometry (no remote assets), rounded (`RoundedBoxGeometry`) rather than sharp-edged, with per-part clearcoat materials (leather/metal/glossy) and a procedural canvas-generated grain texture standing in for real leatherette
  - Dark studio backdrop with a procedural floor light-pool (a dark contact shadow disappears into a dark background, so grounding comes from a bright glow instead)
- **Focus:** Complex animation choreography, product visualization, first project in the Lab to work with a named-part scene graph instead of a single procedural object
- **Not yet done:** placeholder parts (now nicely finished, still not a real camera model); narrative/copy polish; deploy

---

### 05 — Interactive Planet `—`

A rotating 3D planet with custom shaders, dynamic lighting, and user interaction.

- **Focus:** Shader programming, custom materials, scene composition

---

### 06 — Interactive Room `—`

A room with interactive objects, environmental controls, and scene transitions.

- **Focus:** State management (Zustand), immersive UX, scene transitions

---

## Stack

- Next.js / React / TypeScript
- React Three Fiber / Three.js
- Framer Motion / GSAP
- Tailwind CSS / Zustand
- Deployed on Vercel

## Structure

Each project is a standalone Next.js app in its own directory:

```
Lab/
├── 01-glasscards-spread/
├── 02-3d-hero/          (upcoming)
├── 03-scroll-story/     (upcoming)
└── ...
```
