"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { Environment, Lightformer, ContactShadows, OrbitControls } from "@react-three/drei";
import { CameraModel } from "./CameraModel";

const BASE_CAMERA_POS: [number, number, number] = [3.2, 1.8, 4.6];

/** Exploded parts spread wider than the assembled body — portrait/narrow
 *  screens need the camera pulled back further so nothing clips at max explode. */
function ResponsiveCamera() {
  const camera = useThree((s) => s.camera);
  const width = useThree((s) => s.size.width);
  const height = useThree((s) => s.size.height);

  useEffect(() => {
    const isSmall = width < 640 || width < height;
    const scale = isSmall ? 1.5 : 1;
    camera.position.set(
      BASE_CAMERA_POS[0] * scale,
      BASE_CAMERA_POS[1] * scale,
      BASE_CAMERA_POS[2] * scale
    );
    camera.lookAt(0, 0, 0);
  }, [camera, width, height]);

  return null;
}

export function Scene({
  explode,
  hovered,
  onHover,
}: {
  explode: number;
  hovered: string | null;
  onHover: (id: string | null) => void;
}) {
  return (
    <>
      <color attach="background" args={["#c8c2b4"]} />
      <ambientLight intensity={0.5} />
      <spotLight position={[4, 6, 5]} intensity={90} angle={0.45} penumbra={0.8} />

      <CameraModel explode={explode} hovered={hovered} onHover={onHover} />

      <ContactShadows position={[0, -0.85, 0]} opacity={0.45} scale={8} blur={2.4} far={2} />

      <ResponsiveCamera />
      <OrbitControls
        enablePan={false}
        minDistance={3.5}
        maxDistance={10.5}
        minPolarAngle={Math.PI * 0.15}
        maxPolarAngle={Math.PI * 0.65}
      />

      {/* Procedural studio lighting — no remote HDR to stall the first paint */}
      <Environment resolution={256}>
        <Lightformer intensity={5} position={[0, 5, 4]} scale={[10, 6, 1]} />
        <Lightformer intensity={2.5} position={[-6, 2, 2]} rotation-y={Math.PI / 2} scale={[8, 4, 1]} color="#fff4e0" />
        <Lightformer intensity={2.5} position={[6, 1, 1]} rotation-y={-Math.PI / 2} scale={[8, 4, 1]} color="#e8e2d4" />
      </Environment>
    </>
  );
}
