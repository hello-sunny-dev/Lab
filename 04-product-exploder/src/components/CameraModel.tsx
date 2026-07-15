"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";

export type PartDef = {
  id: string;
  name: string;
  fact: string;
  position: [number, number, number];
  explodeDir: [number, number, number];
  distance: number;
  color: string;
  geometry:
    | { kind: "box"; args: [number, number, number] }
    | { kind: "cylinder"; args: [number, number, number]; axis?: "x" | "y" | "z" };
};

// A 35mm SLR, taken apart into the pieces worth naming. Placeholder
// procedural geometry — swaps for a sourced GLTF once one's picked, but the
// explode/hover mechanism here doesn't change when that happens.
export const PARTS: PartDef[] = [
  {
    id: "body",
    name: "Body",
    fact: "Die-cast shell — the one part everything else bolts to.",
    position: [0, 0, 0],
    explodeDir: [0, 0, 0],
    distance: 0,
    color: "#2b2b2b",
    geometry: { kind: "box", args: [2.4, 1.4, 1.0] },
  },
  {
    id: "lens",
    name: "Lens",
    fact: "50mm f/1.8 — the “nifty fifty.”",
    position: [0, -0.05, 0.9],
    explodeDir: [0, 0, 1],
    distance: 1.7,
    color: "#1c1c1c",
    geometry: { kind: "cylinder", args: [0.42, 0.42, 1.0], axis: "z" },
  },
  {
    id: "prism",
    name: "Viewfinder prism",
    fact: "Five internal reflections stand the image upright.",
    position: [0, 0.85, -0.15],
    explodeDir: [0, 1, 0],
    distance: 1.1,
    color: "#242424",
    geometry: { kind: "box", args: [0.7, 0.5, 0.6] },
  },
  {
    id: "dial",
    name: "Film advance",
    fact: "One thumb-flick winds one frame.",
    position: [0.85, 0.78, -0.1],
    explodeDir: [0.4, 1, -0.2],
    distance: 1.2,
    color: "#3a3a3a",
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
    geometry: { kind: "cylinder", args: [0.07, 0.07, 0.12], axis: "y" },
  },
  {
    id: "back",
    name: "Back plate",
    fact: "Opens to load the film — the part everyone forgets exists.",
    position: [0, 0, -0.55],
    explodeDir: [0, 0, -1],
    distance: 1.5,
    color: "#242424",
    geometry: { kind: "box", args: [2.2, 1.3, 0.12] },
  },
  {
    id: "lugL",
    name: "Strap lug",
    fact: "Where the neck strap clips on.",
    position: [-1.25, 0.2, 0],
    explodeDir: [-1, 0.15, 0],
    distance: 1.0,
    color: "#555555",
    geometry: { kind: "cylinder", args: [0.12, 0.12, 0.14], axis: "x" },
  },
  {
    id: "lugR",
    name: "Strap lug",
    fact: "Where the neck strap clips on.",
    position: [1.25, 0.2, 0],
    explodeDir: [1, 0.15, 0],
    distance: 1.0,
    color: "#555555",
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
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(part.id);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onHover(null);
      }}
    >
      {part.geometry.kind === "box" ? (
        <boxGeometry args={part.geometry.args} />
      ) : (
        <cylinderGeometry
          args={[part.geometry.args[0], part.geometry.args[1], part.geometry.args[2], 32]}
        />
      )}
      <meshStandardMaterial
        color={part.color}
        roughness={0.4}
        metalness={0.6}
        emissive="#ffd23f"
        emissiveIntensity={0}
        transparent
        opacity={1}
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
