"use client";

import { useRef, useState } from "react";
import * as THREE from "three";
import { extend, useFrame, type ThreeEvent } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import { samplePoints, drawLabText, drawSunSilhouette } from "./canvasSample";

const COUNT = 5200;

const ParticleMaterial = shaderMaterial(
  {
    uMorph: 0,
    uMouse: new THREE.Vector3(999, 999, 0),
    uTime: 0,
    uColor: new THREE.Color("#ffd23f"),
  },
  /* vertex */ `
    attribute vec3 aTargetA;
    attribute vec3 aTargetB;
    attribute float aRandom;
    uniform float uMorph;
    uniform vec3 uMouse;
    uniform float uTime;
    varying float vRandom;
    varying float vTwinkle;

    void main() {
      vRandom = aRandom;
      vec3 base = mix(aTargetA, aTargetB, uMorph);
      base.x += sin(uTime * 0.6 + aRandom * 6.2831) * 0.03;
      base.y += cos(uTime * 0.5 + aRandom * 6.2831) * 0.03;

      vec2 toParticle = base.xy - uMouse.xy;
      float dist = length(toParticle);
      float repel = smoothstep(1.3, 0.0, dist);
      base.xy += normalize(toParticle + 1e-4) * repel * 1.1;

      // Each particle twinkles at its own speed/phase (derived from
      // aRandom) instead of every particle holding a constant brightness
      // — that per-particle desync is what actually reads as "sparkle"
      // rather than the whole field pulsing in unison.
      vTwinkle = 0.5 + 0.5 * sin(uTime * (1.5 + aRandom * 4.5) + aRandom * 37.0);

      vec4 mvPosition = modelViewMatrix * vec4(base, 1.0);
      gl_PointSize = (4.5 + aRandom * 3.5) * (0.7 + vTwinkle * 0.7);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  /* fragment */ `
    uniform vec3 uColor;
    varying float vRandom;
    varying float vTwinkle;
    void main() {
      vec2 c = gl_PointCoord - vec2(0.5);
      float d = length(c);
      if (d > 0.5) discard;
      float alpha = smoothstep(0.5, 0.1, d) * (0.45 + 0.65 * vTwinkle);
      gl_FragColor = vec4(uColor * (0.7 + 0.35 * vRandom) * (0.6 + 0.7 * vTwinkle), alpha);
    }
  `
);

extend({ ParticleMaterial });

function createParticleBuffers() {
  const a = samplePoints(drawLabText, COUNT);
  const b = samplePoints(drawSunSilhouette, COUNT);
  const r = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) r[i] = Math.random();
  return { positions: new Float32Array(a), targetsA: a, targetsB: b, randoms: r };
}

export function ParticleField({ morphTarget }: { morphTarget: number }) {
  const matRef = useRef<InstanceType<typeof ParticleMaterial>>(null);
  const mouse = useRef(new THREE.Vector3(999, 999, 0));

  const [{ positions, targetsA, targetsB, randoms }] = useState(createParticleBuffers);

  useFrame((_, delta) => {
    if (!matRef.current) return;
    matRef.current.uMorph += (morphTarget - matRef.current.uMorph) * Math.min(1, delta * 2.5);
    matRef.current.uTime += delta;
    matRef.current.uMouse.copy(mouse.current);
  });

  return (
    <group>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-aTargetA" args={[targetsA, 3]} />
          <bufferAttribute attach="attributes-aTargetB" args={[targetsB, 3]} />
          <bufferAttribute attach="attributes-aRandom" args={[randoms, 1]} />
        </bufferGeometry>
        {/* @ts-expect-error -- custom shaderMaterial JSX element registered via extend() */}
        <particleMaterial ref={matRef} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>

      {/* Invisible catcher plane — its onPointerMove gives us the mouse
          position already projected into world space, no manual raycast. */}
      <mesh
        onPointerMove={(e: ThreeEvent<PointerEvent>) => mouse.current.set(e.point.x, e.point.y, 0)}
        onPointerLeave={() => mouse.current.set(999, 999, 0)}
      >
        <planeGeometry args={[24, 16]} />
        <meshBasicMaterial visible={false} />
      </mesh>
    </group>
  );
}
