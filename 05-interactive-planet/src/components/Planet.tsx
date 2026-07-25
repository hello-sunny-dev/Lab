"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";
import { extend, useFrame } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import { SNOISE } from "./noise.glsl";

const TerrainMaterial = shaderMaterial(
  { uLightDir: new THREE.Vector3(0.6, 0.5, 0.7) },
  /* vertex */ `
    varying vec3 vNormal;
    varying vec3 vPos;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPos = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /* fragment */ `
    ${SNOISE}
    uniform vec3 uLightDir;
    varying vec3 vNormal;
    varying vec3 vPos;

    void main() {
      vec3 p = normalize(vPos);
      float base = snoise(p * 1.35);
      float detail = snoise(p * 4.5) * 0.35;
      float elevation = base * 0.75 + detail * 0.25;

      vec3 deepOcean = vec3(0.13, 0.22, 0.38);
      vec3 shallow   = vec3(0.30, 0.52, 0.55);
      vec3 lowland   = vec3(0.55, 0.56, 0.30);
      vec3 highland  = vec3(0.72, 0.45, 0.28);
      vec3 peak      = vec3(0.92, 0.88, 0.82);

      vec3 color = deepOcean;
      color = mix(color, shallow, smoothstep(-0.20, -0.15, elevation));
      color = mix(color, lowland, smoothstep(-0.05, 0.00, elevation));
      color = mix(color, highland, smoothstep(0.22, 0.28, elevation));
      color = mix(color, peak, smoothstep(0.40, 0.46, elevation));

      float diff = max(dot(normalize(vNormal), normalize(uLightDir)), 0.0);
      color *= (0.4 + 0.6 * diff);

      gl_FragColor = vec4(color, 1.0);
    }
  `
);

const CloudMaterial = shaderMaterial(
  { uTime: 0 },
  /* vertex */ `
    varying vec3 vPos;
    void main() {
      vPos = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /* fragment */ `
    ${SNOISE}
    uniform float uTime;
    varying vec3 vPos;

    void main() {
      vec3 p = normalize(vPos) + vec3(uTime * 0.025, 0.0, 0.0);
      float n = snoise(p * 3.2);
      float alpha = smoothstep(0.18, 0.55, n) * 0.8;
      gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
    }
  `
);

const AtmosphereMaterial = shaderMaterial(
  { uColor: new THREE.Color("#8fc7ff") },
  /* vertex */ `
    varying vec3 vNormal;
    varying vec3 vViewDir;
    void main() {
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vNormal = normalize(normalMatrix * normal);
      vViewDir = normalize(cameraPosition - worldPos.xyz);
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  /* fragment */ `
    uniform vec3 uColor;
    varying vec3 vNormal;
    varying vec3 vViewDir;
    void main() {
      // BackSide fragments face away from the camera, so dot(N,V) goes
      // negative across most of the visible shell — abs() keeps the glow
      // confined to the grazing silhouette instead of flooding the disc.
      float ndotv = dot(normalize(vNormal), normalize(vViewDir));
      float fresnel = pow(1.0 - abs(ndotv), 3.2);
      gl_FragColor = vec4(uColor, fresnel * 0.75);
    }
  `
);

extend({ TerrainMaterial, CloudMaterial, AtmosphereMaterial });

export function Planet() {
  const cloudMat = useRef<InstanceType<typeof CloudMaterial>>(null);
  const clouds = useRef<THREE.Mesh>(null);
  const planet = useRef<THREE.Mesh>(null);
  const group = useRef<THREE.Group>(null);

  const geometry = useMemo(() => new THREE.SphereGeometry(1, 96, 96), []);

  useFrame((_, delta) => {
    if (cloudMat.current) cloudMat.current.uTime += delta;
    if (clouds.current) clouds.current.rotation.y += delta * 0.045;
    if (planet.current) planet.current.rotation.y += delta * 0.02;
  });

  return (
    <group ref={group}>
      <mesh ref={planet} geometry={geometry}>
        {/* @ts-expect-error -- custom shaderMaterial JSX element registered via extend() */}
        <terrainMaterial />
      </mesh>
      <mesh ref={clouds} geometry={geometry} scale={1.015}>
        <cloudMaterial ref={cloudMat} transparent depthWrite={false} />
      </mesh>
      <mesh geometry={geometry} scale={1.09}>
        {/* @ts-expect-error -- custom shaderMaterial JSX element registered via extend() */}
        <atmosphereMaterial transparent side={THREE.BackSide} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}
