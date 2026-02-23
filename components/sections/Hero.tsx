"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { useMousePosition } from "@/lib/hooks/useMousePosition";
import { useHeroScrollZoom } from "@/lib/hooks/useHeroScrollZoom";
import { motion } from "framer-motion";
import { CockpitFrame } from "@/components/ui/CockpitFrame";

const Scene = dynamic(
  () => import("@/components/three/Scene").then((m) => ({ default: m.Scene })),
  { ssr: false }
);

export function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);
  const mousePosition = useMousePosition();
  const scrollZoom = useHeroScrollZoom(heroRef);

  return (
    <>
      <section
        id="hero"
        ref={heroRef}
        className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden"
      >
        <Scene mousePosition={mousePosition} scrollZoom={scrollZoom} />
        <CockpitFrame />
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <span
            className="w-6 h-10 rounded-full border-2 border-[var(--glass-border)] flex items-start justify-center p-2 animate-[scroll-bounce_2s_ease-in-out_infinite]"
            aria-hidden
          >
            <span className="w-1 h-2 rounded-full bg-[var(--glow-red)]" />
          </span>
        </motion.div>
      </section>

      <div className="relative z-10 flex flex-col items-center text-center px-6 py-20">
        <motion.h1
          className="font-display tracking-wider text-vercel-red glow-text-red uppercase"
          style={{ fontSize: "clamp(2.5rem, 10vw, 8rem)" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, delay: 0.1 }}
        >
          DANISH
        </motion.h1>
        <motion.p
          className="font-mono text-lg sm:text-xl text-glow-red/90 mt-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.25 }}
        >
          Frontend @ respond.io
        </motion.p>
        <motion.p
          className="text-white/60 text-sm sm:text-base max-w-md mt-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Building interfaces at the edge of the void.
        </motion.p>
      </div>
    </>
  );
}
