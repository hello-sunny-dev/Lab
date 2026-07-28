"use client";

import * as THREE from "three";

// A cheap, effective trick for de-plasticizing a flat material: a small
// procedural grain texture used as both roughnessMap and bumpMap. Real
// leatherette camera wrap is exactly this — irregular pebbled speckle,
// not a flat color. Generated once and cached (module scope, browser-only —
// this file is only ever imported by client components).
let leatherTexture: THREE.CanvasTexture | null = null;

export function getLeatherTexture(): THREE.CanvasTexture {
  if (leatherTexture) return leatherTexture;

  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#8a8a8a";
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 900; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 0.6 + Math.random() * 1.3;
    const shade = Math.floor(90 + Math.random() * 90);
    ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 4);
  leatherTexture = texture;
  return texture;
}

// Soft radial "light pool" for the floor. On a dark backdrop a plain
// ContactShadows blob (a dark smudge) disappears into the dark ground —
// this gives the object something bright to visually sit in instead.
let glowTexture: THREE.CanvasTexture | null = null;

export function getGlowTexture(): THREE.CanvasTexture {
  if (glowTexture) return glowTexture;

  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  const gradient = ctx.createRadialGradient(
    size / 2, size / 2, 0,
    size / 2, size / 2, size / 2
  );
  gradient.addColorStop(0, "rgba(255,238,214,0.85)");
  gradient.addColorStop(0.45, "rgba(255,222,182,0.32)");
  gradient.addColorStop(1, "rgba(255,222,182,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  glowTexture = new THREE.CanvasTexture(canvas);
  return glowTexture;
}
