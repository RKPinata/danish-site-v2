"use client";

import { Suspense, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { CockpitView } from "./CockpitView";
import { Effects } from "./Effects";
import { ScrollZoomCamera } from "./ScrollZoomCamera";

type SceneProps = {
  scrollZoom?: number;
  introZoom?: number;
  onReady?: () => void;
};

function SceneContent({ scrollZoom = 0, introZoom = 0 }: Omit<SceneProps, "onReady">) {
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
        <CockpitView scrollZoom={effectiveZoom} />
        <Effects />
      </Suspense>
    </>
  );
}

export function Scene({ onReady, ...props }: SceneProps) {
  const handleCreated = useCallback(() => {
    onReady?.();
  }, [onReady]);

  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
        onCreated={handleCreated}
      >
        <SceneContent {...props} />
      </Canvas>
    </div>
  );
}
