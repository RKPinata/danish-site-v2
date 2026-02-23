"use client";

import dynamic from "next/dynamic";
import { useRef, useState, useEffect, memo } from "react";
import { usePointerInput } from "@/lib/hooks/usePointerInput";
import { useHeroScrollZoom } from "@/lib/hooks/useHeroScrollZoom";
import { motion } from "framer-motion";
import { CockpitFrame } from "@/components/ui/CockpitFrame";
import { LaunchButton } from "@/components/ui/LaunchButton";

const MemoizedCockpitFrame = memo(CockpitFrame);

const Scene = dynamic(
  () => import("@/components/three/Scene").then((m) => ({ default: m.Scene })),
  { ssr: false }
);

const LAUNCH_DURATION_MS = 600;
const LAUNCH_FADEOUT_MS = 300;

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

export function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);
  const { requestGyroPermission } = usePointerInput();
  const scrollZoom = useHeroScrollZoom(heroRef);
  const [launched, setLaunched] = useState(false);
  const [introZoom, setIntroZoom] = useState(0);
  const [showLaunch, setShowLaunch] = useState(false);
  const [scrollNudge, setScrollNudge] = useState(false);
  const hadScrolledAwayRef = useRef(false);
  const touchStartYRef = useRef(0);
  const nudgeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerNudge = () => {
    setShowLaunch(true);
    setScrollNudge(true);
    if (nudgeTimerRef.current) clearTimeout(nudgeTimerRef.current);
    nudgeTimerRef.current = setTimeout(() => setScrollNudge(false), 1200);
  };

  // Scroll lock when not launched: prevent wheel/touch from scrolling down at top
  useEffect(() => {
    if (launched) return;
    const onWheel = (e: WheelEvent) => {
      if (window.scrollY > 0 || e.deltaY <= 0) return;
      e.preventDefault();
      e.stopPropagation();
      triggerNudge();
    };
    const onTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (window.scrollY > 0) return;
      const dy = touchStartYRef.current - e.touches[0].clientY;
      if (dy > 0) {
        e.preventDefault();
        triggerNudge();
      }
    };
    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false, capture: true });
    return () => {
      window.removeEventListener("wheel", onWheel, true);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove, true);
    };
  }, [launched]);

  // Re-lock when user scrolls back to hero (scrollZoom returns to 0)
  useEffect(() => {
    if (scrollZoom > 0.5) hadScrolledAwayRef.current = true;
    if (launched && hadScrolledAwayRef.current && scrollZoom === 0) {
      hadScrolledAwayRef.current = false;
      const id = requestAnimationFrame(() => {
        setLaunched(false);
        setIntroZoom(0);
        setShowLaunch(false);
      });
      return () => cancelAnimationFrame(id);
    }
  }, [launched, scrollZoom]);

  const handleLaunch = () => {
    requestGyroPermission();
    setShowLaunch(false);
    setTimeout(() => {
      const start = performance.now();
      const tick = () => {
        const elapsed = performance.now() - start;
        const t = Math.min(1, elapsed / LAUNCH_DURATION_MS);
        setIntroZoom(easeOutCubic(t));
        if (t < 1) {
          requestAnimationFrame(tick);
        } else {
          setLaunched(true);
          heroRef.current?.nextElementSibling?.scrollIntoView({ behavior: "smooth" });
        }
      };
      requestAnimationFrame(tick);
    }, LAUNCH_FADEOUT_MS);
  };

  return (
    <>
      <section
        id="hero"
        ref={heroRef}
        className="relative min-h-svh w-full flex flex-col items-center justify-center overflow-hidden"
      >
        <Scene scrollZoom={scrollZoom} introZoom={introZoom} />
        <MemoizedCockpitFrame />
        <LaunchButton onClick={handleLaunch} visible={showLaunch && !launched} nudge={scrollNudge} />
      </section>

      <div
        className="relative z-10 flex flex-col items-center text-center px-6 py-20 transition-opacity duration-150"
        style={{ opacity: Math.max(introZoom, scrollZoom) }}
      >
        <motion.h1
          className="font-display tracking-wider glow-text-sun uppercase"
          style={{ fontSize: "clamp(2.5rem, 10vw, 8rem)" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, delay: 0.1 }}
        >
          <span className="sun-grain-text" aria-hidden="true">DANISH</span>
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
