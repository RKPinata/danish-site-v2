"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Stars } from "@react-three/drei";

const PARALLAX_STRENGTH = 0.1;
const LERP_FACTOR = 0.04;

const STREAK_COUNT = 120;
const STREAK_SPEED_BASE = 0.12;
const STREAK_SPEED_SCROLL_MULT = 2.5;
const STREAK_Z_FAR = -60;
const STREAK_Z_NEAR = 8;
const STREAK_LENGTH = 1.8;
const STREAK_SPREAD = 18;

const DUST_COUNT = 40;
const DUST_SPEED_BASE = 0.04;
const DUST_SPEED_SCROLL_MULT = 2.5;

const dustVertexShader = `
  attribute float aSize;
  attribute float aAlpha;
  varying float vAlpha;
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (120.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    vAlpha = aAlpha;
  }
`;

const dustFragmentShader = `
  varying float vAlpha;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    float alpha = smoothstep(0.5, 0.0, r) * vAlpha;
    gl_FragColor = vec4(0.9, 0.9, 1.0, alpha);
  }
`;

type CockpitViewProps = {
  mouse?: { x: number; y: number };
  scrollZoom?: number;
};

export function CockpitView({ mouse = { x: 0, y: 0 }, scrollZoom = 0 }: CockpitViewProps) {
  const speedMult = 1 + scrollZoom * STREAK_SPEED_SCROLL_MULT;
  const streakSpeed = STREAK_SPEED_BASE * speedMult;
  const dustSpeed = DUST_SPEED_BASE * speedMult;
  const sceneRef = useRef<THREE.Group>(null);
  const streaksRef = useRef<THREE.LineSegments>(null);
  const dustRef = useRef<THREE.Points>(null);
  const parallaxRef = useRef({ x: 0, y: 0 });

  const { streakGeo, streakMat, streakSpeeds } = useMemo(() => {
    const positions = new Float32Array(STREAK_COUNT * 6);
    const colors = new Float32Array(STREAK_COUNT * 6);
    const speeds = new Float32Array(STREAK_COUNT);

    for (let i = 0; i < STREAK_COUNT; i++) {
      const x = (Math.random() - 0.5) * STREAK_SPREAD;
      const y = (Math.random() - 0.5) * STREAK_SPREAD;
      const z = STREAK_Z_FAR + Math.random() * (STREAK_Z_NEAR - STREAK_Z_FAR);
      const spd = 0.7 + Math.random() * 0.6;
      speeds[i] = spd;

      const i6 = i * 6;
      positions[i6] = x;
      positions[i6 + 1] = y;
      positions[i6 + 2] = z;
      positions[i6 + 3] = x;
      positions[i6 + 4] = y;
      positions[i6 + 5] = z - STREAK_LENGTH * spd;

      const brightness = 0.4 + Math.random() * 0.5;
      const r = brightness;
      const g = brightness;
      const b = brightness * 1.1;
      colors[i6] = r; colors[i6 + 1] = g; colors[i6 + 2] = b;
      colors[i6 + 3] = r * 0.1; colors[i6 + 4] = g * 0.1; colors[i6 + 5] = b * 0.1;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    return { streakGeo: geo, streakMat: mat, streakSpeeds: speeds };
  }, []);

  const { dustGeo, dustMat } = useMemo(() => {
    const positions = new Float32Array(DUST_COUNT * 3);
    const sizes = new Float32Array(DUST_COUNT);
    const alphas = new Float32Array(DUST_COUNT);

    for (let i = 0; i < DUST_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = -20 + Math.random() * 25;
      sizes[i] = 1 + Math.random() * 2;
      alphas[i] = 0.08 + Math.random() * 0.15;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("aAlpha", new THREE.BufferAttribute(alphas, 1));

    const mat = new THREE.ShaderMaterial({
      vertexShader: dustVertexShader,
      fragmentShader: dustFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    return { dustGeo: geo, dustMat: mat };
  }, []);

  useFrame(() => {
    if (sceneRef.current) {
      parallaxRef.current.x += (mouse.x * PARALLAX_STRENGTH - parallaxRef.current.x) * LERP_FACTOR;
      parallaxRef.current.y += (mouse.y * PARALLAX_STRENGTH - parallaxRef.current.y) * LERP_FACTOR;
      sceneRef.current.rotation.y = parallaxRef.current.x;
      sceneRef.current.rotation.x = parallaxRef.current.y;
    }

    if (streaksRef.current) {
      const pos = streakGeo.getAttribute("position") as THREE.BufferAttribute;
      const arr = pos.array as Float32Array;
      for (let i = 0; i < STREAK_COUNT; i++) {
        const i6 = i * 6;
        const spd = streakSpeeds[i];
        const dz = streakSpeed * spd;
        arr[i6 + 2] += dz;
        arr[i6 + 5] += dz;
        if (arr[i6 + 2] > STREAK_Z_NEAR) {
          const reset = STREAK_Z_FAR + Math.random() * 5;
          arr[i6 + 2] = reset;
          arr[i6 + 5] = reset - STREAK_LENGTH * spd;
          arr[i6] = (Math.random() - 0.5) * STREAK_SPREAD;
          arr[i6 + 1] = (Math.random() - 0.5) * STREAK_SPREAD;
          arr[i6 + 3] = arr[i6];
          arr[i6 + 4] = arr[i6 + 1];
        }
      }
      pos.needsUpdate = true;
    }

    if (dustRef.current) {
      const pos = dustGeo.getAttribute("position") as THREE.BufferAttribute;
      const arr = pos.array as Float32Array;
      for (let i = 0; i < DUST_COUNT; i++) {
        const i3 = i * 3;
        arr[i3 + 2] += dustSpeed;
        if (arr[i3 + 2] > 5) {
          arr[i3 + 2] = -20;
          arr[i3] = (Math.random() - 0.5) * 12;
          arr[i3 + 1] = (Math.random() - 0.5) * 12;
        }
      }
      pos.needsUpdate = true;
    }
  });

  return (
    <group ref={sceneRef}>
      <Stars
        radius={80}
        depth={80}
        count={5000}
        factor={2.5}
        saturation={0}
        fade
        speed={0.1}
      />

      {/* Tiny 3D Sun — distant, emissive sphere */}
      <mesh position={[0.4, 0.2, -85]}>
        <sphereGeometry args={[6, 32, 32]} />
        <meshBasicMaterial
          color="#fff8e7"
          toneMapped={false}
        />
      </mesh>
      <pointLight position={[0.4, 0.2, -85]} color="#fff5d6" intensity={0.4} distance={120} decay={2} />

      {/* Warp streaks */}
      <lineSegments ref={streaksRef} geometry={streakGeo} material={streakMat} />

      {/* Tiny dust motes */}
      <points ref={dustRef} geometry={dustGeo} material={dustMat} />
    </group>
  );
}
