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
    varying vec3 vWorldPos;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPos = position;
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPos = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  /* fragment */ `
    ${SNOISE}
    uniform vec3 uLightDir;
    varying vec3 vNormal;
    varying vec3 vPos;
    varying vec3 vWorldPos;

    void main() {
      vec3 p = normalize(vPos);
      // fBm instead of a two-tap noise blend — real coastlines are jagged
      // at several scales at once, not one smooth wave.
      float elevation = fbm(p * 1.6);

      vec3 deepOcean = vec3(0.02, 0.09, 0.24);
      vec3 shallow   = vec3(0.04, 0.32, 0.42);
      vec3 lowland   = vec3(0.18, 0.40, 0.16);
      vec3 highland  = vec3(0.42, 0.32, 0.16);
      vec3 peak      = vec3(0.85, 0.84, 0.82);

      // Tight bands right at sea level for a crisp coastline; softer up
      // near the peaks where a real snowline gradient is more gradual.
      vec3 color = deepOcean;
      color = mix(color, shallow, smoothstep(-0.05, -0.02, elevation));
      color = mix(color, lowland, smoothstep(-0.015, 0.01, elevation));
      color = mix(color, highland, smoothstep(0.24, 0.30, elevation));
      color = mix(color, peak, smoothstep(0.40, 0.46, elevation));

      // Polar ice caps — driven by latitude (p.y), independent of elevation.
      float lat = abs(p.y);
      float polar = smoothstep(0.78, 0.92, lat);
      color = mix(color, vec3(0.92, 0.94, 0.98), polar);

      vec3 N = normalize(vNormal);
      vec3 L = normalize(uLightDir);
      float diff = max(dot(N, L), 0.0);
      color *= (0.35 + 0.65 * diff);

      // Ocean glint: a tight specular highlight only where it's water,
      // so oceans read as reflective/wet against matte land.
      float isOcean = 1.0 - smoothstep(-0.03, -0.005, elevation);
      vec3 V = normalize(cameraPosition - vWorldPos);
      vec3 H = normalize(L + V);
      float spec = pow(max(dot(N, H), 0.0), 60.0) * isOcean * diff;
      color += vec3(0.9, 0.95, 1.0) * spec * 0.8;

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
      vec3 p = normalize(vPos) + vec3(uTime * 0.02, 0.0, 0.0);
      float n = fbm(p * 2.4);
      float alpha = smoothstep(0.05, 0.45, n) * 0.75;
      gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
    }
  `
);

const AtmosphereMaterial = shaderMaterial(
  {
    uColorDense: new THREE.Color("#dcefff"),
    uColorThin: new THREE.Color("#2f5f9e"),
  },
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
    uniform vec3 uColorDense;
    uniform vec3 uColorThin;
    varying vec3 vNormal;
    varying vec3 vViewDir;
    void main() {
      // BackSide fragments face away from the camera, so dot(N,V) goes
      // negative across most of the visible shell — abs() keeps the glow
      // confined to the grazing silhouette instead of flooding the disc.
      float ndotv = dot(normalize(vNormal), normalize(vViewDir));
      float fresnel = 1.0 - abs(ndotv);

      // A flat single color read as a hard blue "ring." Real atmosphere
      // grades from pale/bright close to the surface (more air in the
      // sightline) to a deeper, thinner blue further out into space —
      // and it's two glows layered, not one falloff curve: a tight bright
      // rim right at the limb, plus a much softer, wider haze beyond it.
      vec3 color = mix(uColorDense, uColorThin, pow(fresnel, 0.6));
      float rim = pow(fresnel, 4.0);
      float haze = pow(fresnel, 1.15) * 0.3;
      float alpha = clamp(rim + haze, 0.0, 1.0);

      gl_FragColor = vec4(color, alpha * 0.85);
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
      <mesh geometry={geometry} scale={1.18}>
        {/* @ts-expect-error -- custom shaderMaterial JSX element registered via extend() */}
        <atmosphereMaterial transparent side={THREE.BackSide} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}
