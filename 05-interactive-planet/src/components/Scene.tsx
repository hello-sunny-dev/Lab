"use client";

import { Stars, OrbitControls } from "@react-three/drei";
import { Planet } from "./Planet";

export function Scene() {
  return (
    <>
      <color attach="background" args={["#0b0a16"]} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 2.4, 3.5]} intensity={1.4} />

      <Planet />

      {/* Procedural starfield — generated, not a remote asset */}
      <Stars radius={60} depth={30} count={2400} factor={2} saturation={0} fade speed={0.4} />

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={2.4}
        maxDistance={5.5}
        autoRotate
        autoRotateSpeed={0.6}
        rotateSpeed={0.6}
      />
    </>
  );
}
