"use client";

import * as THREE from "three";

// Procedural surface detail — same trick as 04's leatherette: draw grain
// onto a small canvas once, tile it. Cheap, and it's what actually breaks
// up the "flat plastic primitive" look more than any geometry change does.

let woodCanvas: HTMLCanvasElement | null = null;

function getWoodCanvas(): HTMLCanvasElement {
  if (woodCanvas) return woodCanvas;
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#8a6a45";
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 40; i++) {
    const y = Math.random() * size;
    const dark = Math.random() > 0.5;
    ctx.strokeStyle = dark ? "rgba(60,40,20,0.18)" : "rgba(210,175,130,0.14)";
    ctx.lineWidth = 1 + Math.random() * 2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= size; x += 8) {
      ctx.lineTo(x, y + Math.sin(x * 0.05 + i) * 3 + (Math.random() - 0.5) * 2);
    }
    ctx.stroke();
  }
  woodCanvas = canvas;
  return canvas;
}

export function getWoodTexture(repeatX = 3, repeatY = 2): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(getWoodCanvas());
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  return texture;
}

let grainCanvas: HTMLCanvasElement | null = null;

function getGrainCanvas(): HTMLCanvasElement {
  if (grainCanvas) return grainCanvas;
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // Neutral mid-grey grayscale so any material.color tints it cleanly —
  // reused for the wall plaster, floor rug and terracotta pot.
  ctx.fillStyle = "#9c9c9c";
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 700; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 0.5 + Math.random();
    const shade = Math.floor(120 + Math.random() * 80);
    ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  grainCanvas = canvas;
  return canvas;
}

export function getGrainTexture(repeatX = 3, repeatY = 3): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(getGrainCanvas());
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  return texture;
}

let keyGridCanvas: HTMLCanvasElement | null = null;

function getKeyGridCanvas(): HTMLCanvasElement {
  if (keyGridCanvas) return keyGridCanvas;
  const cols = 14;
  const rows = 5;
  const cell = 16;
  const canvas = document.createElement("canvas");
  canvas.width = cols * cell;
  canvas.height = rows * cell;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#1c1c1c";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const pad = 2;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * cell + pad;
      const y = r * cell + pad;
      const w = cell - pad * 2;
      const shade = 46 + Math.floor(Math.random() * 8);
      ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
      const radius = 2;
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.arcTo(x + w, y, x + w, y + w, radius);
      ctx.arcTo(x + w, y + w, x, y + w, radius);
      ctx.arcTo(x, y + w, x, y, radius);
      ctx.arcTo(x, y, x + w, y, radius);
      ctx.closePath();
      ctx.fill();
    }
  }
  keyGridCanvas = canvas;
  return canvas;
}

export function getKeyGridTexture(repeatX = 1, repeatY = 1): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(getKeyGridCanvas());
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  return texture;
}
