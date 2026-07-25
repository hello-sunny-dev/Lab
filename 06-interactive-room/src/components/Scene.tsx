"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { Room } from "./Room";
import { useRoomStore } from "@/store/roomStore";

const VIEWS = {
  wide: { pos: new THREE.Vector3(3.0, 2.2, 3.6), look: new THREE.Vector3(0, 0.6, -0.2) },
  desk: { pos: new THREE.Vector3(0.75, 1.05, 1.35), look: new THREE.Vector3(0, 0.78, -0.15) },
};

function CameraRig({ controlsRef }: { controlsRef: React.RefObject<OrbitControlsImpl | null> }) {
  const view = useRoomStore((s) => s.view);
  const { camera } = useThree();
  const transitioning = useRef(true);

  useEffect(() => {
    transitioning.current = true;
  }, [view]);

  useFrame((_, delta) => {
    if (!transitioning.current || !controlsRef.current) return;
    const { pos, look } = VIEWS[view];
    const t = Math.min(1, delta * 3);
    camera.position.lerp(pos, t);
    controlsRef.current.target.lerp(look, t);
    controlsRef.current.update();
    if (camera.position.distanceTo(pos) < 0.01) transitioning.current = false;
  });

  return null;
}

export function Scene() {
  const timeOfDay = useRoomStore((s) => s.timeOfDay);
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const isDay = timeOfDay === "day";

  return (
    <>
      <color attach="background" args={[isDay ? "#efe4cf" : "#0f0d16"]} />
      <ambientLight intensity={isDay ? 0.55 : 0.15} color={isDay ? "#fff4e0" : "#4a5a8f"} />
      <directionalLight
        position={[2, 3, 2]}
        intensity={isDay ? 1.1 : 0.08}
        color={isDay ? "#fff6e6" : "#7d8fd6"}
      />

      <Room />

      <CameraRig controlsRef={controlsRef} />
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        minDistance={1.0}
        maxDistance={5.5}
        minPolarAngle={Math.PI * 0.15}
        maxPolarAngle={Math.PI * 0.5}
      />
    </>
  );
}
