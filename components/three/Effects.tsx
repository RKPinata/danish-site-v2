"use client";

import { EffectComposer, Bloom } from "@react-three/postprocessing";

export function Effects() {
  return (
    <EffectComposer>
      <Bloom
        luminanceThreshold={0.3}
        luminanceSmoothing={0.9}
        intensity={1.2}
        mipmapBlur
        radius={0.5}
      />
    </EffectComposer>
  );
}
