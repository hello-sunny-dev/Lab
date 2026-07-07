"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import {
  Float,
  Environment,
  Lightformer,
  MeshTransmissionMaterial,
  ContactShadows,
  useScroll,
} from "@react-three/drei";

function HeroObject({ isSmall }: { isSmall: boolean }) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.x += delta * 0.15;
    mesh.current.rotation.y += delta * 0.2;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh ref={mesh}>
        <torusKnotGeometry args={[1, 0.32, isSmall ? 140 : 220, isSmall ? 24 : 40]} />
        <MeshTransmissionMaterial
          thickness={0.6}
          roughness={0.08}
          transmission={1}
          ior={1.4}
          chromaticAberration={0.06}
          // backside is what makes it read as glass — keep it everywhere,
          // manage mobile cost via lower resolution/samples instead
          backside
          resolution={isSmall ? 256 : 512}
          samples={isSmall ? 4 : 8}
          color="#c4b5fd"
        />
      </mesh>
    </Float>
  );
}

function ScrollRig({ isSmall }: { isSmall: boolean }) {
  const scroll = useScroll();
  const camera = useThree((s) => s.camera);

  useFrame(() => {
    const t = scroll.offset; // 0 → 1 across all pages
    // Portrait screens need the camera further back to fit the object
    const base = isSmall ? 8 : 4.2;
    const angle = t * Math.PI * 0.9;
    const radius = base + t * 2.4;
    camera.position.set(
      Math.sin(angle) * radius,
      0.4 + t * 1.6,
      Math.cos(angle) * radius
    );
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export function Scene() {
  const isSmall = useThree((s) => s.size.width < 640 || s.size.width < s.size.height);

  return (
    <>
      <color attach="background" args={["#0a0a0c"]} />
      <ambientLight intensity={0.4} />
      <spotLight position={[6, 8, 4]} intensity={120} angle={0.4} penumbra={1} />
      <HeroObject isSmall={isSmall} />
      <ScrollRig isSmall={isSmall} />
      <ContactShadows position={[0, -2.2, 0]} opacity={0.5} scale={12} blur={2.8} far={4} />
      {/* Procedural environment — no remote HDR download (a preset would
          fetch a multi-MB file from a CDN and blank the scene while loading) */}
      <Environment resolution={256}>
        <Lightformer intensity={6} position={[0, 5, 5]} scale={[12, 8, 1]} />
        <Lightformer intensity={4} position={[0, -2, -6]} scale={[12, 6, 1]} color="#e9d5ff" />
        <Lightformer intensity={5} position={[-7, 2, -2]} rotation-y={Math.PI / 2} scale={[10, 5, 1]} color="#c4b5fd" />
        <Lightformer intensity={4} position={[7, 0, 1]} rotation-y={-Math.PI / 2} scale={[8, 4, 1]} color="#7dd3fc" />
        <Lightformer intensity={3} position={[0, 7, 0]} rotation-x={Math.PI / 2} scale={[10, 10, 1]} />
      </Environment>
    </>
  );
}
