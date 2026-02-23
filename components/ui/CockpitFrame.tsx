"use client";

import { CockpitSVG } from "./CockpitSVG";

export function CockpitFrame() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 z-5"
        aria-hidden
      >
        <CockpitSVG />

        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(
              ellipse 80% 70% at 50% 45%,
              transparent 0%,
              transparent 50%,
              rgba(4, 4, 10, 0.35) 80%,
              rgba(4, 4, 10, 0.7) 100%
            )`,
          }}
        />
      </div>
    </>
  );
}
