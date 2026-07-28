// Samples opaque pixels from a 2D canvas drawing into world-space points —
// the technique that turns arbitrary text/shapes into a particle target set.
export type Draw = (ctx: CanvasRenderingContext2D, w: number, h: number) => void;

export function samplePoints(
  draw: Draw,
  count: number,
  { width = 480, height = 300, worldWidth = 8, worldHeight = 5 } = {}
): Float32Array {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, width, height);
  draw(ctx, width, height);

  const { data } = ctx.getImageData(0, 0, width, height);
  const candidates: Array<[number, number]> = [];
  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < width; x += 2) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha > 128) candidates.push([x, y]);
    }
  }

  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const [px, py] = candidates.length
      ? candidates[Math.floor(Math.random() * candidates.length)]
      : [width / 2, height / 2];
    out[i * 3] = (px / width - 0.5) * worldWidth;
    out[i * 3 + 1] = -(py / height - 0.5) * worldHeight;
    out[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
  }
  return out;
}

export function drawLabText(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = "#fff";
  ctx.font = "900 180px -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("LAB", w / 2, h / 2 + 8);
}

export function drawSunSilhouette(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = "#fff";
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) * 0.2;

  const rayCount = 10;
  for (let i = 0; i < rayCount; i++) {
    const a = (i / rayCount) * Math.PI * 2;
    const innerR = r * 1.15;
    const outerR = r * 1.95;
    const x1 = cx + Math.cos(a) * innerR;
    const y1 = cy + Math.sin(a) * innerR;
    const x2 = cx + Math.cos(a) * outerR;
    const y2 = cy + Math.sin(a) * outerR;
    const perp = a + Math.PI / 2;
    const half = r * 0.16;
    ctx.beginPath();
    ctx.moveTo(x1 + Math.cos(perp) * half, y1 + Math.sin(perp) * half);
    ctx.lineTo(x1 - Math.cos(perp) * half, y1 - Math.sin(perp) * half);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.fill();
  }

  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
}
