"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three-stdlib";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { getLeatherTexture } from "./textures";

export type Finish = "leather" | "metal" | "glossy";

export type PartDef = {
  id: string;
  name: string;
  fact: string;
  position: [number, number, number];
  explodeDir: [number, number, number];
  distance: number;
  color: string;
  finish: Finish;
  geometry:
    | { kind: "box"; args: [number, number, number] }
    | { kind: "cylinder"; args: [number, number, number]; axis?: "x" | "y" | "z" }
    | { kind: "prism"; args: [number, number, number] };
};

// A 35mm SLR, taken apart into the pieces worth naming. Procedural
// geometry, tuned by hand for silhouette rather than sourced from a scan —
// the lens is built as separate mount/barrel/ring/glass pieces (not one
// cylinder) so both the resting shape AND the explode sequence read as a
// real lens, and the viewfinder hump is a real triangular roof instead of
// a box sitting on top.
export const PARTS: PartDef[] = [
  {
    id: "body",
    name: "Body",
    fact: "Die-cast shell — the one part everything else bolts to.",
    position: [0, 0, 0],
    explodeDir: [0, 0, 0],
    distance: 0,
    color: "#3a3632",
    finish: "leather",
    geometry: { kind: "box", args: [2.4, 1.4, 1.0] },
  },
  {
    id: "lens-mount",
    name: "Lens mount",
    fact: "Bayonet mount — quarter-turn to lock onto the body.",
    position: [0, -0.05, 0.56],
    explodeDir: [0, 0, 1],
    distance: 0.85,
    color: "#1c1c1c",
    finish: "metal",
    geometry: { kind: "cylinder", args: [0.46, 0.46, 0.1], axis: "z" },
  },
  {
    id: "lens-barrel",
    name: "Lens barrel",
    fact: "50mm f/1.8 — the “nifty fifty.”",
    position: [0, -0.05, 0.92],
    explodeDir: [0, 0, 1],
    distance: 1.15,
    color: "#171717",
    finish: "glossy",
    geometry: { kind: "cylinder", args: [0.4, 0.38, 0.62], axis: "z" },
  },
  {
    id: "lens-ring",
    name: "Focus ring",
    fact: "Turn to pull focus — by feel, without looking away from the frame.",
    position: [0, -0.05, 1.16],
    explodeDir: [0, 0, 1],
    distance: 1.4,
    color: "#232323",
    finish: "metal",
    geometry: { kind: "cylinder", args: [0.41, 0.41, 0.09], axis: "z" },
  },
  {
    id: "lens-glass",
    name: "Front element",
    fact: "Coated glass — that faint purple tint is the anti-reflective coating.",
    position: [0, -0.05, 1.31],
    explodeDir: [0, 0, 1],
    distance: 1.65,
    color: "#0d1a2b",
    finish: "glossy",
    geometry: { kind: "cylinder", args: [0.36, 0.36, 0.05], axis: "z" },
  },
  {
    id: "prism",
    name: "Viewfinder prism",
    fact: "Five internal reflections stand the image upright.",
    position: [0, 0.68, -0.15],
    explodeDir: [0, 1, 0],
    distance: 1.1,
    color: "#2f2f2f",
    finish: "metal",
    geometry: { kind: "prism", args: [0.72, 0.4, 0.62] },
  },
  {
    id: "hotshoe",
    name: "Hot shoe",
    fact: "Mounts an external flash — bypasses the built-in metering.",
    position: [0, 1.1, -0.18],
    explodeDir: [0, 1, 0],
    distance: 1.0,
    color: "#141414",
    finish: "metal",
    geometry: { kind: "box", args: [0.22, 0.08, 0.3] },
  },
  {
    id: "rewind",
    name: "Rewind knob",
    fact: "Fold out and crank to rewind the film before opening the back.",
    position: [-0.85, 0.78, -0.1],
    explodeDir: [-0.4, 1, -0.2],
    distance: 1.2,
    color: "#c9c2b0",
    finish: "metal",
    geometry: { kind: "cylinder", args: [0.19, 0.19, 0.16], axis: "y" },
  },
  {
    id: "dial",
    name: "Film advance",
    fact: "One thumb-flick winds one frame.",
    position: [0.85, 0.78, -0.1],
    explodeDir: [0.4, 1, -0.2],
    distance: 1.2,
    color: "#c9c2b0",
    finish: "metal",
    geometry: { kind: "cylinder", args: [0.22, 0.22, 0.18], axis: "y" },
  },
  {
    id: "shutter",
    name: "Shutter button",
    fact: "Half-press meters. Full press shoots.",
    position: [0.95, 0.85, 0.25],
    explodeDir: [0.3, 1, 0.4],
    distance: 1.4,
    color: "#b23b2e",
    finish: "glossy",
    geometry: { kind: "cylinder", args: [0.07, 0.07, 0.12], axis: "y" },
  },
  {
    id: "back",
    name: "Back plate",
    fact: "Opens to load the film — the part everyone forgets exists.",
    position: [0, 0, -0.55],
    explodeDir: [0, 0, -1],
    distance: 1.5,
    color: "#3a3632",
    finish: "leather",
    geometry: { kind: "box", args: [2.2, 1.3, 0.12] },
  },
  {
    id: "lugL",
    name: "Strap lug",
    fact: "Where the neck strap clips on.",
    position: [-1.25, 0.2, 0],
    explodeDir: [-1, 0.15, 0],
    distance: 1.0,
    color: "#8a8a8a",
    finish: "metal",
    geometry: { kind: "cylinder", args: [0.12, 0.12, 0.14], axis: "x" },
  },
  {
    id: "lugR",
    name: "Strap lug",
    fact: "Where the neck strap clips on.",
    position: [1.25, 0.2, 0],
    explodeDir: [1, 0.15, 0],
    distance: 1.0,
    color: "#8a8a8a",
    finish: "metal",
    geometry: { kind: "cylinder", args: [0.12, 0.12, 0.14], axis: "x" },
  },
];

const AXIS_ROTATION: Record<string, [number, number, number]> = {
  x: [0, 0, Math.PI / 2],
  y: [0, 0, 0],
  z: [Math.PI / 2, 0, 0],
};

function Part({
  part,
  explode,
  hovered,
  onHover,
}: {
  part: PartDef;
  explode: number;
  hovered: string | null;
  onHover: (id: string | null) => void;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const target = useRef(new THREE.Vector3());
  const isDimmed = hovered !== null && hovered !== part.id;
  const isHovered = hovered === part.id;

  const geometry = useMemo(() => {
    if (part.geometry.kind === "box") {
      const [w, h, d] = part.geometry.args;
      // Rounded rather than sharp edges — the single biggest thing that
      // reads as "hand-placed primitive" instead of a manufactured part.
      const radius = Math.min(0.08, Math.min(w, h, d) * 0.12);
      return new RoundedBoxGeometry(w, h, d, 4, radius);
    }
    if (part.geometry.kind === "prism") {
      const [width, height, depth] = part.geometry.args;
      // A real pentaprism roof silhouette — a triangular cross-section
      // extruded front-to-back — instead of a box floating on top of the
      // body. Bevelled so the ridge isn't a razor edge.
      const shape = new THREE.Shape();
      shape.moveTo(-width / 2, 0);
      shape.lineTo(width / 2, 0);
      shape.lineTo(0, height);
      shape.closePath();
      const geo = new THREE.ExtrudeGeometry(shape, {
        depth,
        bevelEnabled: true,
        bevelThickness: 0.025,
        bevelSize: 0.025,
        bevelSegments: 2,
        curveSegments: 1,
      });
      geo.translate(0, 0, -depth / 2);
      return geo;
    }
    const [rTop, rBottom, height] = part.geometry.args;
    return new THREE.CylinderGeometry(rTop, rBottom, height, 48);
  }, [part.geometry]);

  const leatherTexture = useMemo(
    () => (part.finish === "leather" ? getLeatherTexture() : null),
    [part.finish]
  );

  const materialProps: Partial<THREE.MeshPhysicalMaterialParameters> =
    part.finish === "leather"
      ? { roughness: 0.85, metalness: 0, clearcoat: 0.15, clearcoatRoughness: 0.6, roughnessMap: leatherTexture ?? undefined, bumpMap: leatherTexture ?? undefined, bumpScale: 0.004 }
      : part.finish === "metal"
        ? { roughness: 0.35, metalness: 0.85, clearcoat: 0.3, clearcoatRoughness: 0.25 }
        : { roughness: 0.12, metalness: 0.15, clearcoat: 0.9, clearcoatRoughness: 0.08 };

  useFrame((_, delta) => {
    if (!mesh.current) return;
    target.current.set(
      part.position[0] + part.explodeDir[0] * explode * part.distance,
      part.position[1] + part.explodeDir[1] * explode * part.distance,
      part.position[2] + part.explodeDir[2] * explode * part.distance
    );
    mesh.current.position.lerp(target.current, Math.min(1, delta * 6));

    const mat = mesh.current.material as THREE.MeshStandardMaterial;
    const targetOpacity = isDimmed ? 0.35 : 1;
    mat.opacity += (targetOpacity - mat.opacity) * Math.min(1, delta * 8);
    const targetEmissive = isHovered ? 0.35 : 0;
    mat.emissiveIntensity += (targetEmissive - mat.emissiveIntensity) * Math.min(1, delta * 8);
  });

  return (
    <mesh
      ref={mesh}
      position={part.position}
      rotation={part.geometry.kind === "cylinder" ? AXIS_ROTATION[part.geometry.axis ?? "y"] : [0, 0, 0]}
      geometry={geometry}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(part.id);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onHover(null);
      }}
    >
      <meshPhysicalMaterial
        color={part.color}
        emissive="#ffd23f"
        emissiveIntensity={0}
        transparent
        opacity={1}
        {...materialProps}
      />
      {isHovered && (
        <Html distanceFactor={8} occlude={false} className="pointer-events-none">
          <div className="w-max max-w-[220px] -translate-y-full rounded-lg bg-[#1c1c1c]/92 px-3 py-2 text-left shadow-lg">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#f4dfa3]">
              {part.name}
            </p>
            <p className="mt-0.5 text-[11px] leading-snug text-white/80">{part.fact}</p>
          </div>
        </Html>
      )}
    </mesh>
  );
}

export function CameraModel({
  explode,
  hovered,
  onHover,
}: {
  explode: number;
  hovered: string | null;
  onHover: (id: string | null) => void;
}) {
  return (
    <group>
      {PARTS.map((part, i) => (
        <Part key={`${part.id}-${i}`} part={part} explode={explode} hovered={hovered} onHover={onHover} />
      ))}
    </group>
  );
}
