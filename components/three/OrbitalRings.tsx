"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const RINGS = [
  { radius: 1.0, tiltX: 1.2, tiltZ: 0.3, speed: 0.4, color: "#00d4ff" },
  { radius: 1.5, tiltX: 0.5, tiltZ: 1.0, speed: -0.3, color: "#33bbff" },
  { radius: 2.0, tiltX: 0.8, tiltZ: -0.6, speed: 0.2, color: "#7744ee" },
  { radius: 2.6, tiltX: -0.4, tiltZ: 0.9, speed: -0.15, color: "#a855f7" },
] as const;

const PARTICLES_PER_RING = 4;
const TOTAL_PARTICLES = RINGS.length * PARTICLES_PER_RING;

const PARALLAX_STRENGTH = 0.3;
const LERP_FACTOR = 0.05;

const particleVertexShader = `
  attribute float aSize;
  varying float vAlpha;
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    vAlpha = 0.9;
  }
`;

const particleFragmentShader = `
  varying float vAlpha;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    float alpha = (1.0 - r * 2.0) * vAlpha;
    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
  }
`;

type OrbitalRingsProps = {
  mouse?: { x: number; y: number };
};

function getPositionOnRing(
  radius: number,
  tiltX: number,
  tiltZ: number,
  angle: number
): THREE.Vector3 {
  const x = radius * Math.cos(angle);
  const z = radius * Math.sin(angle);
  const v = new THREE.Vector3(x, 0, z);
  v.applyAxisAngle(new THREE.Vector3(1, 0, 0), tiltX);
  v.applyAxisAngle(new THREE.Vector3(0, 0, 1), tiltZ);
  return v;
}

export function OrbitalRings({ mouse = { x: 0, y: 0 } }: OrbitalRingsProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const tiltRef = useRef({ x: 0, y: 0 });

  const particleGeometry = useMemo(() => {
    const positions = new Float32Array(TOTAL_PARTICLES * 3);
    const sizes = new Float32Array(TOTAL_PARTICLES);
    for (let i = 0; i < TOTAL_PARTICLES; i++) {
      sizes[i] = 12 + Math.random() * 8;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, []);

  const particleMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: particleVertexShader,
        fragmentShader: particleFragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (groupRef.current) {
      const targetTiltX = mouse.y * PARALLAX_STRENGTH;
      const targetTiltY = mouse.x * PARALLAX_STRENGTH;
      tiltRef.current.x += (targetTiltX - tiltRef.current.x) * LERP_FACTOR;
      tiltRef.current.y += (targetTiltY - tiltRef.current.y) * LERP_FACTOR;
      groupRef.current.rotation.x = tiltRef.current.x;
      groupRef.current.rotation.y = tiltRef.current.y;
    }

    if (coreRef.current) {
      coreRef.current.rotation.y = time * 0.15;
    }

    if (pointsRef.current && particleGeometry) {
      const posAttr = particleGeometry.getAttribute(
        "position"
      ) as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;
      let idx = 0;
      for (let r = 0; r < RINGS.length; r++) {
        const ring = RINGS[r];
        for (let p = 0; p < PARTICLES_PER_RING; p++) {
          const angle =
            time * ring.speed + (p / PARTICLES_PER_RING) * Math.PI * 2;
          const v = getPositionOnRing(
            ring.radius,
            ring.tiltX,
            ring.tiltZ,
            angle
          );
          posArray[idx++] = v.x;
          posArray[idx++] = v.y;
          posArray[idx++] = v.z;
        }
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      <pointLight color="#00d4ff" intensity={0.8} distance={8} decay={2} />
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.15, 2]} />
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={1.2}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
      {RINGS.map((ring, i) => (
        <group
          key={i}
          rotation-x={ring.tiltX}
          rotation-z={ring.tiltZ}
        >
          <mesh rotation-x={Math.PI / 2}>
            <torusGeometry args={[ring.radius, 0.008, 16, 100]} />
            <meshBasicMaterial
              color={ring.color}
              transparent
              opacity={0.9}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
      <points
        ref={pointsRef}
        geometry={particleGeometry}
        material={particleMaterial}
      />
    </group>
  );
}
