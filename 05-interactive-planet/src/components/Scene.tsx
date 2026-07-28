"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import { Planet } from "./Planet";

const BASE_DISTANCE = 4.6;

/** Narrow/portrait viewports get less horizontal FOV at any given
 *  distance than a wide desktop window does — without this the planet
 *  crowds the frame edge-to-edge on mobile even though it looks fine
 *  on desktop at the same distance. */
function ResponsiveCamera() {
  const camera = useThree((s) => s.camera);
  const width = useThree((s) => s.size.width);
  const height = useThree((s) => s.size.height);

  useEffect(() => {
    const isSmall = width < 640 || width < height;
    const distance = isSmall ? BASE_DISTANCE * 1.4 : BASE_DISTANCE;
    camera.position.set(0, 0.35, distance);
    camera.lookAt(0, 0, 0);
  }, [camera, width, height]);

  return null;
}

export function Scene() {
  return (
    <>
      <color attach="background" args={["#0b0a16"]} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 2.4, 3.5]} intensity={1.4} />

      <Planet />

      {/* Procedural starfield — generated, not a remote asset */}
      <Stars radius={60} depth={30} count={2400} factor={2} saturation={0} fade speed={0.4} />

      <ResponsiveCamera />
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={3.2}
        maxDistance={11}
        autoRotate
        autoRotateSpeed={0.6}
        rotateSpeed={0.6}
      />
    </>
  );
}
