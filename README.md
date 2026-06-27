# Lab

Frontend creative experiments — interactive experiences, motion, WebGL, and spatial UI.

Each project is a weekend-sized, deployable experiment exploring a single concept.

## Projects

### 01 — Floating Gallery `✅ Live`

**[View Live](https://01-floating-gallery.vercel.app)**

A glassmorphic card experience with scroll-driven spread, 3D tilt, and click-to-reveal interactions.

- **Stack:** Next.js 16, Framer Motion, Tailwind CSS
- **Key features:**
  - Scroll/swipe to spread/gather cards
  - Click card → smooth center animation with accent color fill
  - Per-card 3D tilt on hover with spring physics
  - Shuffle button to randomize card positions
  - Scene-level 3D tilt following cursor
  - Mobile responsive with touch support
- **Learned:** Framer Motion springs, `useMotionValue`/`useTransform` composition, separating layout slots from data for shuffle, hit area vs transform separation for 3D click targets

---

### 02 — 3D Hero Landing `🔜 Next`

A premium landing page with a central 3D object, scroll-driven camera, and product-marketing interactions.

- **Focus:** React Three Fiber, GLTF loading, scroll animation, camera movement
- **Cloud:** CDN delivery for 3D models, Draco compression

---

### 03 — Scroll Storytelling `—`

A narrative experience driven by scroll position, combining GSAP ScrollTrigger with R3F.

- **Focus:** Storytelling, animation timelines, scroll-linked 3D transitions

---

### 04 — Product Exploder `—`

An interactive exploded-view product experience with sequenced animations.

- **Focus:** Complex animation choreography, product visualization

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
├── 01-floating-gallery/
├── 02-3d-hero/          (upcoming)
├── 03-scroll-story/     (upcoming)
└── ...
```
