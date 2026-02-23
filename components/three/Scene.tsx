"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { CockpitView } from "./CockpitView";
import { Effects } from "./Effects";
import { ScrollZoomCamera } from "./ScrollZoomCamera";

type SceneProps = {
  mousePosition?: { x: number; y: number };
  scrollZoom?: number;
  introZoom?: number;
};

function SceneContent({ mousePosition, scrollZoom = 0, introZoom = 0 }: SceneProps) {
  const effectiveZoom = Math.max(introZoom, scrollZoom);
  return (
    <>
      <color attach="background" args={["#000000"]} />
      <ambientLight intensity={0.2} />
      <ScrollZoomCamera scrollZoom={effectiveZoom} />
      <Suspense
        fallback={
          <mesh>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshBasicMaterial color="#ff3333" wireframe />
          </mesh>
        }
      >
        <CockpitView mouse={mousePosition} scrollZoom={effectiveZoom} />
        <Effects />
      </Suspense>
    </>
  );
}

export function Scene(props: SceneProps) {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <SceneContent {...props} />
      </Canvas>
    </div>
  );
}
