"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, Lightformer } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { Room } from "./Room";
import { useRoomStore } from "@/store/roomStore";

const VIEWS = {
  wide: { pos: new THREE.Vector3(3.0, 2.2, 3.6), look: new THREE.Vector3(0, 0.6, -0.2) },
  desk: { pos: new THREE.Vector3(0.75, 1.05, 1.35), look: new THREE.Vector3(0, 0.78, -0.15) },
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const cb = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
  }, []);
  return reduced;
}

function CameraRig({ controlsRef }: { controlsRef: React.RefObject<OrbitControlsImpl | null> }) {
  const view = useRoomStore((s) => s.view);
  const { camera } = useThree();
  const transitioning = useRef(true);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    transitioning.current = true;
  }, [view]);

  useFrame((_, delta) => {
    if (!transitioning.current || !controlsRef.current) return;
    const { pos, look } = VIEWS[view];
    // Reduced motion: cut straight to the target instead of panning the
    // camera through the room — a moving 3D viewpoint is exactly the kind
    // of motion that setting asks to avoid.
    const t = reducedMotion ? 1 : Math.min(1, delta * 3);
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

      {/* Procedural lighting for reflections — clearcoat/metal materials
          read as dull plastic without something in the environment to
          actually reflect. No remote HDR, just a couple of Lightformers. */}
      <Environment resolution={192}>
        <Lightformer intensity={2.5} position={[0, 4, 2]} scale={[6, 4, 1]} color={isDay ? "#fff4e0" : "#4a5a8f"} />
        <Lightformer intensity={1.2} position={[-3, 1.5, 3]} rotation-y={Math.PI / 3} scale={[4, 3, 1]} color="#ffd23f" />
      </Environment>

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
