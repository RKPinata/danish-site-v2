"use client";

import { EffectComposer, Bloom } from "@react-three/postprocessing";

export function Effects() {
  return (
    <EffectComposer>
      <Bloom
        luminanceThreshold={0.4}
        luminanceSmoothing={0.9}
        intensity={0.8}
        radius={0.4}
      />
    </EffectComposer>
  );
}
