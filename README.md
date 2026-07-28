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

### 03 — Scroll Storytelling `✅ Live`

**[View Live](https://03-scroll-story.vercel.app)**

A day passing, told entirely by scrolling: morning → midday → dusk → night, GSAP ScrollTrigger + Lenis smooth scroll. Sunny (the sun mascot) crossfades into a matching Moon character as the sky goes from pale blue through coral dusk to purple-black night, with stars fading in.

- **Stack:** Next.js 16, GSAP, Lenis, Tailwind CSS
- **Key features:**
  - Sky cross-fades through 4 gradient stops tracking a full day
  - Sun and Moon share one motion-path/idle-bob rig and crossfade in place over the dusk→night stretch — nothing moves, one fades out as the other fades in
  - Per-scene text color (dark ink on light morning/midday scenes, pale ink once it's dusk/night)
  - Stars fade in over the night stretch
  - MotionPath character drift synced to scroll, scroll-velocity → character tilt, parallax cloud/bird layers, scene text reveals
- **Focus:** Storytelling, animation timelines, scroll-linked transitions
- **Learned:** GSAP `ScrollTrigger`'s `"X% top"` position syntax is a fraction of the *trigger's own height*, not of the scrollable distance — with `N` stacked `h-screen` sections, nothing past `(N-1)/N × 100`% is ever reachable, so an end position above that silently never completes no matter how far you scroll
- **Not yet done:** real Lottie mascots for Sunny and Moon (both still placeholder SVGs)

---

### 04 — Product Exploder `✅ Live`

**[View Live](https://04-product-exploder.vercel.app)**

A 35mm film camera, taken apart by hand: drag a slider to explode it into its named parts, orbit around it, hover any part for a one-line fact.

- **Stack:** Next.js 16, React Three Fiber, Three.js, Tailwind CSS
- **Key features:**
  - Slider-driven explode (0→1), each part flies out along its own vector/distance rather than a uniform offset
  - Hover a part → highlight + dim the rest + floating label with name and fact
  - Orbit camera, responsive distance for portrait/narrow viewports
  - Procedural leather-grain canvas texture + `meshPhysicalMaterial` per finish (leather/metal/glossy), `RoundedBoxGeometry` throughout instead of sharp-edged boxes
  - Dark studio backdrop with a glow-pool plane and contact shadows to ground the camera and pull focus onto it
- **Focus:** Complex animation choreography, product visualization, first project in the Lab to work with a named-part scene graph instead of a single procedural object
- **Learned:** rounded edges + physical materials + a procedural grain texture take a shape from reading as "placeholder primitive" to "product photo" faster than adding more geometric detail does
- **Not yet done:** the parts are still a procedural stand-in — no sourced 3D camera model

---

### 05 — Interactive Planet `✅ Live`

**[View Live](https://05-interactive-planet.vercel.app)**

A small stylized planet, entirely hand-written GLSL — no textures, no `MeshStandardMaterial`. Terrain color comes from fractal noise sampled directly on the sphere surface, clouds drift via a second noise layer scrolling over time, and the atmosphere is a two-tone Fresnel rim-light shell.

- **Stack:** Next.js 16, React Three Fiber, Three.js, Tailwind CSS
- **Key features:**
  - Custom `ShaderMaterial` terrain: 5-octave fbm elevation banded into ocean/lowland/highland/peak colors, latitude-based ice caps, ocean specular highlight
  - Second transparent shell for drifting clouds (fbm noise scrolls over time in the fragment shader)
  - Third shell for atmosphere glow — two-color (dense/thin) Fresnel gradient with a rim + haze term, tapered to zero right at the shell's own silhouette so it doesn't read as a hard-edged ring
  - Drag-to-orbit + idle auto-rotate, procedural starfield backdrop (`drei`'s `Stars`, no remote HDR/texture)
- **Focus:** Raw GLSL (vertex + fragment), simplex/fbm noise as a shading primitive, Fresnel rim lighting, multi-shell sphere compositing — first project in the Lab writing shader code directly instead of using prebuilt materials
- **Learned:** on `BackSide`-rendered shell geometry, `dot(normal, viewDir)` goes negative across most of the visible surface, so fresnel needs `1.0 - abs(ndotv)`; and fresnel hits its literal max exactly at the shell's own silhouette, so any alpha that increases with fresnel needs an explicit taper back to 0 before that edge or it reads as a hard cutoff
- **Not yet done:** possible interaction beyond orbit (day/night toggle, surface hotspots)

---

### 06 — Interactive Room `✅ Live`

**[View Live](https://06-interactive-room.vercel.app)**

"Sunny's Desk" — a small isometric-ish office desk scene (lamp, monitor, keyboard, mouse, plant, window, rug) with state shared across components via Zustand instead of local `useState`.

- **Stack:** Next.js 16, React Three Fiber, Three.js, Zustand, Tailwind CSS
- **Key features:**
  - Click the lamp → toggles a point light + emissive shade, shared through the store so the HUD button reflects the same state
  - Click the window → flips day/night, driving ambient/directional light color and intensity plus floor/wall/sky color
  - Click the monitor → toggles screen glow
  - Click the desk (or the "Zoom in" HUD button) → camera transitions between a wide shot and a close desk shot, lerped in `useFrame` and reconciled with `OrbitControls`' own target so dragging still works after
  - Procedural wood-grain, fabric-grain, and keycap-grid canvas textures; `meshPhysicalMaterial` throughout; thin monitor bezel and a rug instead of bare floor
  - Same store read from inside the Canvas (meshes) and outside it (HUD buttons, hover label) — the actual point of using Zustand here over 04's local `useState`
- **Focus:** State management (Zustand) shared across the R3F/DOM boundary, immersive UX, scene transitions
- **Learned:** procedural canvas textures (wood grain, fabric weave, key grid) read as far less "toy-like" than flat-colored primitives, for a fraction of the effort of sourcing real texture maps
- **Not yet done:** more objects/detail, possibly a second room

---

### 07 — Particle Morph `✅ Live`

**[View Live](https://07-particle-morph.vercel.app)**

Thousands of particles spelling "LAB" — cursor nearby and they scatter away from it; click and they reform into Sunny's silhouette.

- **Stack:** Next.js 16, React Three Fiber, Three.js, Tailwind CSS
- **Key features:**
  - ~5,200 GPU points, each carrying two target positions (`aTargetA`/`aTargetB`) sampled by rasterizing text/a shape onto an offscreen 2D canvas and reading opaque pixel coordinates
  - Morph between shapes is a vertex-shader `mix()` on a `uMorph` uniform lerped in `useFrame` — no per-particle JS loop
  - Cursor repel: an invisible catcher plane's `onPointerMove` hands R3F's already-projected `event.point` straight to the shader as a uniform, no manual raycasting
  - Per-particle twinkle: size/brightness oscillates at its own speed and phase (derived from a per-particle random value) instead of every particle pulsing in unison
  - Orthographic camera with a responsive zoom so the field doesn't crop on portrait/mobile viewports
- **Focus:** Large-scale GPU point rendering, canvas-to-particle-target sampling, GPU-side shape interpolation — first project in the Lab handling thousands of individually shader-driven elements at once
- **Learned:** desyncing a per-particle animation phase off a single random attribute (rather than driving everything off the same uniform time) is what turns a uniform pulse into something that reads as organic sparkle
- **Not yet done:** more than 2 target shapes, possibly color shift tied to which shape is active

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
├── 02-3d-hero-landing/
├── 03-scroll-story/
├── 04-product-exploder/
├── 05-interactive-planet/
├── 06-interactive-room/
├── 07-particle-morph/
└── 08-portfolio-hub/    (next)
```
