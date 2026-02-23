"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 8000;
const ARM_COUNT = 3;
const SPIRAL_TIGHTNESS = 2;
const CORE_RADIUS = 0.3;
const GALAXY_RADIUS = 2.5;

const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uRepelRadius;
  uniform float uRepelStrength;
  attribute float uSize;
  attribute float uRandom;
  varying float vAlpha;
  varying float vDist;
  void main() {
    vec3 pos = position;
    float drift = sin(uTime * 0.3 + uRandom * 6.28) * 0.05;
    pos.x += drift;
    pos.z += cos(uTime * 0.2 + uRandom * 6.28) * 0.03;
    vec2 mouse2d = vec2(uMouse.x, uMouse.y);
    vec2 pos2d = vec2(pos.x, pos.y);
    float d = length(pos2d - mouse2d);
    if (d < uRepelRadius) {
      float f = (1.0 - d / uRepelRadius) * uRepelStrength;
      vec2 dir = normalize(pos2d - mouse2d);
      pos.x += dir.x * f;
      pos.y += dir.y * f;
    }
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = uSize * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    vAlpha = 0.4 + 0.6 * (1.0 - length(position.xy) / 2.5);
    vDist = length(position.xy);
  }
`;

const fragmentShader = `
  varying float vAlpha;
  varying float vDist;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    float alpha = (1.0 - r * 2.0) * vAlpha;
    float t = vDist / 2.5;
    vec3 color = mix(vec3(0.0, 0.83, 1.0), vec3(0.66, 0.33, 1.0), t);
    gl_FragColor = vec4(color, alpha * 0.9);
  }
`;

type ParticleGalaxyProps = {
  mouse?: { x: number; y: number };
  particleCount?: number;
};

export function ParticleGalaxy({ mouse = { x: 0, y: 0 }, particleCount = PARTICLE_COUNT }: ParticleGalaxyProps) {
  const meshRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const { positions, sizes, randoms } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const randoms = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const arm = Math.floor((i / particleCount) * ARM_COUNT) % ARM_COUNT;
      const t = (i % (particleCount / ARM_COUNT)) / (particleCount / ARM_COUNT);
      const angle = arm * (Math.PI * 2) / ARM_COUNT + t * Math.PI * SPIRAL_TIGHTNESS;
      const r = CORE_RADIUS + t * GALAXY_RADIUS;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      const z = (Math.random() - 0.5) * 0.4;
      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;
      sizes[i] = Math.random() * 1.5 + 0.5;
      randoms[i] = Math.random();
    }

    return { positions, sizes, randoms };
  }, [particleCount]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("uSize", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("uRandom", new THREE.BufferAttribute(randoms, 1));
    return geo;
  }, [positions, sizes, randoms]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.08;
    }
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uMouse.value.set(mouse.x, mouse.y);
    }
  });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uRepelRadius: { value: 0.6 },
      uRepelStrength: { value: 0.15 },
    }),
    []
  );

  return (
    <points ref={meshRef} geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
