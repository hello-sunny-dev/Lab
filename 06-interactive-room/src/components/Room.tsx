"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three-stdlib";
import type { ThreeEvent } from "@react-three/fiber";
import { useRoomStore } from "@/store/roomStore";
import { getWoodTexture, getGrainTexture, getKeyGridTexture } from "./textures";

function useInteractive(id: string, onActivate: () => void) {
  const setHovered = useRoomStore((s) => s.setHovered);
  const isHovered = useRoomStore((s) => s.hovered === id);
  return {
    isHovered,
    handlers: {
      onPointerOver: (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        setHovered(id);
      },
      onPointerOut: (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        setHovered(null);
      },
      onClick: (e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        onActivate();
      },
    },
  };
}

function useRoundedBox(w: number, h: number, d: number, radius?: number) {
  return useMemo(
    () => new RoundedBoxGeometry(w, h, d, 4, radius ?? Math.min(0.05, Math.min(w, h, d) * 0.15)),
    [w, h, d, radius]
  );
}

function Desk() {
  const { isHovered, handlers } = useInteractive("desk", useRoomStore((s) => s.toggleView));
  const geometry = useRoundedBox(2.4, 0.6, 1.0, 0.04);
  const wood = useMemo(() => getWoodTexture(3.2, 1.4), []);
  return (
    <mesh position={[0, 0.3, 0]} scale={isHovered ? 1.01 : 1} geometry={geometry} {...handlers}>
      <meshPhysicalMaterial
        color={isHovered ? "#9a7449" : "#7a5a37"}
        map={wood}
        roughness={0.5}
        clearcoat={0.35}
        clearcoatRoughness={0.3}
      />
    </mesh>
  );
}

function Monitor() {
  const screenOn = useRoomStore((s) => s.screenOn);
  const { isHovered, handlers } = useInteractive("monitor", useRoomStore((s) => s.toggleScreen));
  const bezelGeometry = useRoundedBox(0.61, 0.39, 0.018, 0.012);
  const baseGeometry = useRoundedBox(0.22, 0.02, 0.14, 0.006);
  return (
    <group scale={isHovered ? 1.04 : 1} {...handlers}>
      {/* foot */}
      <mesh position={[0, 0.612, -0.2]} geometry={baseGeometry}>
        <meshPhysicalMaterial color="#1c1c1c" roughness={0.35} metalness={0.6} clearcoat={0.3} />
      </mesh>
      <mesh position={[0, 0.66, -0.25]}>
        <cylinderGeometry args={[0.045, 0.05, 0.1, 24]} />
        <meshPhysicalMaterial color="#232323" roughness={0.35} metalness={0.7} clearcoat={0.3} />
      </mesh>
      {/* bezel — thin modern border, the screen sits just proud of it */}
      <mesh position={[0, 0.9, -0.283]} geometry={bezelGeometry}>
        <meshPhysicalMaterial color="#151515" roughness={0.4} metalness={0.3} clearcoat={0.35} />
      </mesh>
      <mesh position={[0, 0.9, -0.27]}>
        <planeGeometry args={[0.58, 0.36]} />
        <meshPhysicalMaterial
          color={screenOn ? "#bfe6f7" : "#0c0c0c"}
          emissive={screenOn ? "#8fd6f2" : "#000000"}
          emissiveIntensity={screenOn ? 0.75 : 0}
          roughness={0.15}
          metalness={0.1}
          clearcoat={0.9}
          clearcoatRoughness={0.08}
        />
      </mesh>
    </group>
  );
}

function Keyboard() {
  const baseGeometry = useRoundedBox(0.52, 0.025, 0.19, 0.012);
  const keys = useMemo(() => getKeyGridTexture(1, 1), []);
  return (
    <group position={[0, 0.625, 0.08]}>
      <mesh geometry={baseGeometry}>
        <meshPhysicalMaterial color="#242424" roughness={0.6} clearcoat={0.1} />
      </mesh>
      <mesh position={[0, 0.014, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.47, 0.16]} />
        <meshPhysicalMaterial map={keys} roughness={0.55} clearcoat={0.2} />
      </mesh>
    </group>
  );
}

function Mouse() {
  const { isHovered, handlers } = useInteractive("mouse", () => {});
  return (
    <group position={[0.42, 0.616, 0.14]} rotation={[0, 0.15, 0]} scale={isHovered ? 1.08 : 1} {...handlers}>
      <mesh scale={[0.05, 0.022, 0.085]}>
        <sphereGeometry args={[1, 24, 16]} />
        <meshPhysicalMaterial color={isHovered ? "#3a3a3a" : "#242424"} roughness={0.45} clearcoat={0.4} />
      </mesh>
      {/* scroll wheel */}
      <mesh position={[0, 0.021, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.012, 10]} />
        <meshPhysicalMaterial color="#111111" roughness={0.4} />
      </mesh>
    </group>
  );
}

function Lamp() {
  const lampOn = useRoomStore((s) => s.lampOn);
  const { isHovered, handlers } = useInteractive("lamp", useRoomStore((s) => s.toggleLamp));
  return (
    <group position={[-0.85, 0, 0.1]} scale={isHovered ? 1.05 : 1} {...handlers}>
      <mesh position={[0, 0.62, 0]}>
        <cylinderGeometry args={[0.08, 0.09, 0.03, 24]} />
        <meshPhysicalMaterial color="#232323" roughness={0.3} metalness={0.8} clearcoat={0.3} />
      </mesh>
      <mesh position={[0.05, 0.78, -0.08]} rotation={[0, 0, -0.5]}>
        <cylinderGeometry args={[0.015, 0.015, 0.35, 12]} />
        <meshPhysicalMaterial color="#3a3a3a" roughness={0.3} metalness={0.8} clearcoat={0.3} />
      </mesh>
      <mesh position={[0.2, 0.95, -0.2]} rotation={[Math.PI, 0, -0.5]}>
        <coneGeometry args={[0.11, 0.14, 24, 1, true]} />
        <meshPhysicalMaterial
          color={lampOn ? "#ffe9a8" : "#4a4438"}
          emissive={lampOn ? "#ffd23f" : "#000000"}
          emissiveIntensity={lampOn ? 0.9 : 0}
          roughness={0.25}
          metalness={0.4}
          clearcoat={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
      {lampOn && <pointLight position={[0.2, 0.9, -0.2]} intensity={2.2} distance={2.2} color="#ffd23f" />}
    </group>
  );
}

// Fixed jittered offsets (not random) so leaf clusters look bushy and
// irregular without a hydration-mismatching Math.random() in render.
const LEAF_CLUSTERS: Array<{ pos: [number, number, number]; r: number; dark?: boolean }> = [
  { pos: [0, 0.9, 0], r: 0.1 },
  { pos: [0.075, 0.85, 0.035], r: 0.082, dark: true },
  { pos: [-0.07, 0.86, -0.025], r: 0.078 },
  { pos: [0.02, 0.97, -0.04], r: 0.07, dark: true },
  { pos: [-0.035, 0.95, 0.045], r: 0.066 },
  { pos: [0.01, 0.81, 0.07], r: 0.066, dark: true },
  { pos: [-0.06, 0.79, -0.06], r: 0.06 },
  { pos: [0.09, 0.92, -0.01], r: 0.058, dark: true },
];

function Plant() {
  const { isHovered, handlers } = useInteractive("plant", () => {});
  const terracotta = useMemo(() => getGrainTexture(2, 1.5), []);
  return (
    <group position={[0.95, 0, -0.28]} scale={isHovered ? 1.06 : 1} {...handlers}>
      <mesh position={[0, 0.67, 0]}>
        <cylinderGeometry args={[0.1, 0.08, 0.14, 20]} />
        <meshPhysicalMaterial color="#b23b2e" map={terracotta} roughness={0.75} clearcoat={0.1} />
      </mesh>
      <mesh position={[0, 0.78, 0]}>
        <cylinderGeometry args={[0.012, 0.016, 0.16, 8]} />
        <meshPhysicalMaterial color="#4a3a22" roughness={0.8} />
      </mesh>
      {LEAF_CLUSTERS.map((leaf, i) => (
        <mesh key={i} position={leaf.pos} scale={[1, 1.2, 1]}>
          <icosahedronGeometry args={[leaf.r, 1]} />
          <meshPhysicalMaterial
            color={leaf.dark ? "#4f6d34" : isHovered ? "#8ea85c" : "#6d8a45"}
            roughness={0.65}
            clearcoat={0.2}
            clearcoatRoughness={0.4}
            flatShading
          />
        </mesh>
      ))}
    </group>
  );
}

function Window() {
  const timeOfDay = useRoomStore((s) => s.timeOfDay);
  const { isHovered, handlers } = useInteractive("window", useRoomStore((s) => s.toggleTimeOfDay));
  const sky = timeOfDay === "day" ? "#bfe6f7" : "#141634";
  // Deep recessed frame (real window depth, not a flat plaque) + a
  // clean painted office frame instead of dark cabin wood, plus a sill.
  const frameGeometry = useRoundedBox(1.1, 0.8, 0.16, 0.015);
  const sillGeometry = useRoundedBox(1.24, 0.035, 0.14, 0.008);
  return (
    <group position={[-1.1, 1.35, -1.58]} {...handlers}>
      <mesh geometry={frameGeometry}>
        <meshPhysicalMaterial color="#eeeae0" roughness={0.42} clearcoat={0.25} clearcoatRoughness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.06]} scale={isHovered ? 1.02 : 1}>
        <planeGeometry args={[0.94, 0.64]} />
        <meshPhysicalMaterial
          color={sky}
          emissive={sky}
          emissiveIntensity={timeOfDay === "day" ? 0.3 : 0.12}
          roughness={0.04}
          clearcoat={1}
          clearcoatRoughness={0.04}
        />
      </mesh>
      <mesh position={[0, -0.42, 0.02]} geometry={sillGeometry}>
        <meshPhysicalMaterial color="#f4f0e6" roughness={0.4} clearcoat={0.2} />
      </mesh>
    </group>
  );
}

function Rug() {
  const grain = useMemo(() => getGrainTexture(5, 3), []);
  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      <mesh position={[0, 0, 0.002]}>
        <planeGeometry args={[3.4, 2.0]} />
        <meshPhysicalMaterial color="#3d3a35" map={grain} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0, 0.003]}>
        <planeGeometry args={[3.02, 1.66]} />
        <meshPhysicalMaterial color="#8a7b68" map={grain} roughness={0.9} />
      </mesh>
    </group>
  );
}

function Shell() {
  const timeOfDay = useRoomStore((s) => s.timeOfDay);
  const floorColor = timeOfDay === "day" ? "#c9b79a" : "#2a2620";
  const wallColor = timeOfDay === "day" ? "#e6d9c2" : "#1c1a22";
  const floorTexture = useMemo(() => getWoodTexture(10, 10), []);
  const wallTexture = useMemo(() => getGrainTexture(8, 4), []);
  return (
    <>
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 6]} />
        <meshPhysicalMaterial color={floorColor} map={floorTexture} roughness={0.6} clearcoat={0.1} />
      </mesh>
      <Rug />
      <mesh position={[0, 1.5, -1.6]}>
        <planeGeometry args={[6, 3]} />
        <meshPhysicalMaterial color={wallColor} map={wallTexture} roughness={0.95} />
      </mesh>
    </>
  );
}

export function Room() {
  return (
    <group>
      <Shell />
      <Desk />
      <Monitor />
      <Keyboard />
      <Mouse />
      <Lamp />
      <Plant />
      <Window />
    </group>
  );
}
