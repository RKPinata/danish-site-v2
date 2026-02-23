"use client";

import { Stars } from "@react-three/drei";

export function StarField() {
  return (
    <Stars
      radius={50}
      depth={50}
      count={2000}
      factor={4}
      saturation={0.5}
      fade
      speed={0.2}
    />
  );
}
