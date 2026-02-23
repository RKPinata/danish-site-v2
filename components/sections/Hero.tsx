"use client";

import dynamic from "next/dynamic";
import { useRef, useState, useEffect } from "react";
import { usePointerInput } from "@/lib/hooks/usePointerInput";
import { useHeroScrollZoom } from "@/lib/hooks/useHeroScrollZoom";
import { motion } from "framer-motion";
import { CockpitFrame } from "@/components/ui/CockpitFrame";

const Scene = dynamic(
  () => import("@/components/three/Scene").then((m) => ({ default: m.Scene })),
  { ssr: false }
);

const INTRO_ZOOM_DURATION_MS = 420;
const INTRO_ZOOM_EASE_OUT = (t: number) => 1 - (1 - t) ** 2; // ease-out quad

/** When initial: slow. When user scrolls: delay scroll to show zoom, then scroll. */
export function Hero({ onIntroZoomComplete }: { onIntroZoomComplete?: () => void }) {
  const heroRef = useRef<HTMLElement | null>(null);
  const { x, y, requestGyroPermission } = usePointerInput();
  const pointerPosition = { x, y };
  const gyroRequestedRef = useRef(false);
  const scrollZoom = useHeroScrollZoom(heroRef);
  const [introZoom, setIntroZoom] = useState(0);
  const [introDone, setIntroDone] = useState(false);
  const animRef = useRef<number>(0);
  const introCompleteRef = useRef(false);
  const isAnimatingRef = useRef(false);
  const onCompleteRef = useRef(onIntroZoomComplete);
  useEffect(() => {
    onCompleteRef.current = onIntroZoomComplete;
  }, [onIntroZoomComplete]);

  const runIntroZoom = useRef(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    if (animRef.current) cancelAnimationFrame(animRef.current);
    const start = performance.now();
    let didComplete = false;
    const run = (now: number) => {
      const raw = Math.min((now - start) / INTRO_ZOOM_DURATION_MS, 1);
      const t = INTRO_ZOOM_EASE_OUT(raw);
      setIntroZoom(t);
      if (raw >= 0.75 && !didComplete) {
        didComplete = true;
        onCompleteRef.current?.();
      }
      if (raw < 1) {
        animRef.current = requestAnimationFrame(run);
      } else {
        isAnimatingRef.current = false;
        introCompleteRef.current = true;
        setIntroDone(true);
      }
    };
    animRef.current = requestAnimationFrame(run);
  });

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (window.scrollY > 0 || e.deltaY <= 0) return;
      if (introCompleteRef.current) return;
      e.preventDefault();
      e.stopPropagation();
      runIntroZoom.current();
    };
    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    return () => {
      window.removeEventListener("wheel", onWheel, true);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  // When user scrolls back to top, reset intro so next scroll triggers zoom again
  useEffect(() => {
    if (scrollZoom === 0 && introDone) {
      introCompleteRef.current = false;
      const id = setTimeout(() => {
        setIntroZoom(0);
        setIntroDone(false);
      }, 0);
      return () => clearTimeout(id);
    }
  }, [scrollZoom, introDone]);

  const touchStartY = useRef(0);
  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
      if (!gyroRequestedRef.current) {
        gyroRequestedRef.current = true;
        requestGyroPermission();
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (window.scrollY > 0 || introCompleteRef.current) return;
      const dy = touchStartY.current - e.touches[0].clientY;
      if (dy > 25) {
        e.preventDefault();
        runIntroZoom.current();
      }
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false, capture: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove, true);
    };
  }, [requestGyroPermission]);

  return (
    <>
      <section
        id="hero"
        ref={heroRef}
        className="relative min-h-svh w-full flex flex-col items-center justify-center overflow-hidden"
      >
        <Scene mousePosition={pointerPosition} scrollZoom={scrollZoom} introZoom={introZoom} />
        <CockpitFrame />
      </section>

      <div
        className="relative z-10 flex flex-col items-center text-center px-6 py-20 transition-opacity duration-150"
        style={{ opacity: Math.max(introZoom, scrollZoom) }}
      >
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
