"use client";

import type { ThreeEvent } from "@react-three/fiber";
import { useRoomStore } from "@/store/roomStore";

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

function Desk() {
  const { isHovered, handlers } = useInteractive("desk", useRoomStore((s) => s.toggleView));
  return (
    <mesh position={[0, 0.3, 0]} scale={isHovered ? 1.01 : 1} {...handlers}>
      <boxGeometry args={[2.4, 0.6, 1.0]} />
      <meshStandardMaterial color={isHovered ? "#7a5a3a" : "#5c4530"} roughness={0.7} />
    </mesh>
  );
}

function Monitor() {
  const screenOn = useRoomStore((s) => s.screenOn);
  const { isHovered, handlers } = useInteractive("monitor", useRoomStore((s) => s.toggleScreen));
  return (
    <group scale={isHovered ? 1.04 : 1} {...handlers}>
      <mesh position={[0, 0.66, -0.25]}>
        <cylinderGeometry args={[0.05, 0.06, 0.12, 16]} />
        <meshStandardMaterial color="#2b2b2b" />
      </mesh>
      <mesh position={[0, 0.9, -0.28]}>
        <boxGeometry args={[0.62, 0.4, 0.03]} />
        <meshStandardMaterial
          color={screenOn ? "#bfe6f7" : "#1c1c1c"}
          emissive={screenOn ? "#8fd6f2" : "#000000"}
          emissiveIntensity={screenOn ? 0.8 : 0}
        />
      </mesh>
    </group>
  );
}

function Keyboard() {
  return (
    <mesh position={[0, 0.625, 0.08]}>
      <boxGeometry args={[0.5, 0.03, 0.18]} />
      <meshStandardMaterial color="#3a3a3a" />
    </mesh>
  );
}

function Mug() {
  const { isHovered, handlers } = useInteractive("mug", () => {});
  return (
    <mesh position={[0.55, 0.645, 0.08]} scale={isHovered ? 1.08 : 1} {...handlers}>
      <cylinderGeometry args={[0.05, 0.045, 0.08, 20]} />
      <meshStandardMaterial color={isHovered ? "#f4dfa3" : "#e8853a"} />
    </mesh>
  );
}

function Lamp() {
  const lampOn = useRoomStore((s) => s.lampOn);
  const { isHovered, handlers } = useInteractive("lamp", useRoomStore((s) => s.toggleLamp));
  return (
    <group position={[-0.85, 0, 0.1]} scale={isHovered ? 1.05 : 1} {...handlers}>
      <mesh position={[0, 0.62, 0]}>
        <cylinderGeometry args={[0.08, 0.09, 0.03, 20]} />
        <meshStandardMaterial color="#2b2b2b" />
      </mesh>
      <mesh position={[0.05, 0.78, -0.08]} rotation={[0, 0, -0.5]}>
        <cylinderGeometry args={[0.015, 0.015, 0.35, 8]} />
        <meshStandardMaterial color="#3a3a3a" />
      </mesh>
      <mesh position={[0.2, 0.95, -0.2]} rotation={[Math.PI, 0, -0.5]}>
        <coneGeometry args={[0.11, 0.14, 20, 1, true]} />
        <meshStandardMaterial
          color={lampOn ? "#ffe9a8" : "#4a4438"}
          emissive={lampOn ? "#ffd23f" : "#000000"}
          emissiveIntensity={lampOn ? 0.9 : 0}
          side={2}
        />
      </mesh>
      {lampOn && <pointLight position={[0.2, 0.9, -0.2]} intensity={2.2} distance={2.2} color="#ffd23f" />}
    </group>
  );
}

function Plant() {
  const { isHovered, handlers } = useInteractive("plant", () => {});
  return (
    <group position={[0.95, 0, -0.28]} scale={isHovered ? 1.06 : 1} {...handlers}>
      <mesh position={[0, 0.67, 0]}>
        <cylinderGeometry args={[0.1, 0.08, 0.14, 16]} />
        <meshStandardMaterial color="#b23b2e" />
      </mesh>
      <mesh position={[0.02, 0.85, 0.02]} scale={[1, 1.3, 1]}>
        <icosahedronGeometry args={[0.13, 0]} />
        <meshStandardMaterial color={isHovered ? "#8ea85c" : "#6d8a45"} flatShading />
      </mesh>
      <mesh position={[-0.08, 0.78, -0.05]} scale={[0.8, 1, 0.8]}>
        <icosahedronGeometry args={[0.1, 0]} />
        <meshStandardMaterial color="#557a3b" flatShading />
      </mesh>
    </group>
  );
}

function Window() {
  const timeOfDay = useRoomStore((s) => s.timeOfDay);
  const { isHovered, handlers } = useInteractive("window", useRoomStore((s) => s.toggleTimeOfDay));
  const sky = timeOfDay === "day" ? "#bfe6f7" : "#141634";
  return (
    <group position={[-1.1, 1.35, -1.58]} {...handlers}>
      <mesh>
        <boxGeometry args={[1.05, 0.75, 0.05]} />
        <meshStandardMaterial color="#2b2118" />
      </mesh>
      <mesh position={[0, 0, 0.03]} scale={isHovered ? 1.03 : 1}>
        <planeGeometry args={[0.92, 0.62]} />
        <meshStandardMaterial
          color={sky}
          emissive={sky}
          emissiveIntensity={timeOfDay === "day" ? 0.35 : 0.15}
        />
      </mesh>
      <mesh position={[0, 0, 0.035]}>
        <planeGeometry args={[0.04, 0.62]} />
        <meshStandardMaterial color="#2b2118" />
      </mesh>
      <mesh position={[0, 0, 0.035]}>
        <planeGeometry args={[0.92, 0.04]} />
        <meshStandardMaterial color="#2b2118" />
      </mesh>
    </group>
  );
}

function Shell() {
  const timeOfDay = useRoomStore((s) => s.timeOfDay);
  const floorColor = timeOfDay === "day" ? "#c9b79a" : "#2a2620";
  const wallColor = timeOfDay === "day" ? "#e6d9c2" : "#1c1a22";
  return (
    <>
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial color={floorColor} />
      </mesh>
      <mesh position={[0, 1.5, -1.6]}>
        <planeGeometry args={[6, 3]} />
        <meshStandardMaterial color={wallColor} />
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
      <Mug />
      <Lamp />
      <Plant />
      <Window />
    </group>
  );
}
