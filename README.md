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

### 03 — Scroll Storytelling `🚧 Draft pushed`

A narrative experience driven by scroll position, combining GSAP ScrollTrigger with Lenis smooth scroll. A "Sunny" sun mascot drifts through a Pastel Dream sky (lavender → pink → peach → cream) across 4 scenes.

- **Stack:** Next.js 16, GSAP, Lenis, Tailwind CSS
- **Key features (so far):** MotionPath character drift synced to scroll, scroll-velocity → character tilt, cross-fading sky gradient per scene, parallax cloud/bird layers, scene text reveals
- **Focus:** Storytelling, animation timelines, scroll-linked transitions
- **Not yet done:** real Lottie mascot (current sun is a placeholder SVG), deploy — pending Sunny's desktop review

---

### 04 — Product Exploder `🚧 Draft scaffold`

A 35mm film camera, taken apart by hand: drag a slider to explode it into its named parts, orbit around it, hover any part for a one-line fact.

- **Stack:** Next.js 16, React Three Fiber, Three.js, Tailwind CSS
- **Key features (so far):**
  - Slider-driven explode (0→1), each part flies out along its own vector/distance rather than a uniform offset
  - Hover a part → highlight + dim the rest + floating label with name and fact
  - Orbit camera, responsive distance for portrait/narrow viewports
  - Procedural placeholder geometry (no remote assets) standing in for the real model
- **Focus:** Complex animation choreography, product visualization, first project in the Lab to work with a named-part scene graph instead of a single procedural object
- **Not yet done:** placeholder box/cylinder parts are standing in for a real sourced 3D model (film camera); narrative/copy polish; deploy

---

### 05 — Interactive Planet `🚧 Draft scaffold`

A small stylized planet, entirely hand-written GLSL — no textures, no `MeshStandardMaterial`. Terrain comes from fractal-noise elevation banded into ocean/lowland/highland/peak, with polar ice caps and ocean specular glint; clouds drift via a second fBm layer scrolling over time; the atmosphere is a Fresnel rim-light shell.

- **Stack:** Next.js 16, React Three Fiber, Three.js, Tailwind CSS
- **Key features (so far):**
  - Custom `ShaderMaterial` terrain: `fbm()` (5-octave fractal Brownian motion, not a single noise tap) drives elevation, banded into ocean/lowland/highland/peak colors with a crisp sea-level coastline and a softer snowline
  - Latitude-driven polar ice caps, independent of elevation
  - Ocean-only Blinn-Phong specular glint (wet/reflective water against matte land)
  - Second transparent shell for drifting clouds (fBm scrolls over time in the fragment shader)
  - Third shell for atmosphere glow — Fresnel term on `BackSide` geometry, careful with `dot(normal, viewDir)` sign since back-facing fragments flip it
  - Drag-to-orbit + idle auto-rotate, procedural starfield backdrop (`drei`'s `Stars`, no remote HDR/texture)
- **Focus:** Raw GLSL (vertex + fragment), fractal noise as a shading primitive, Fresnel rim lighting, multi-shell sphere compositing — first project in the Lab writing shader code directly instead of using prebuilt materials
- **Not yet done:** deploy, possible interaction beyond orbit (day/night toggle, surface hotspots)

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
