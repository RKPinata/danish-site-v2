"use client";

import { useEffect, useRef, useCallback } from "react";
import { pointer } from "@/lib/pointer";

const GYRO_LERP = 0.08;
const GYRO_X_SCALE = 1 / 45;
const GYRO_Y_SCALE = 1 / 45;

function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

function needsPermission(): boolean {
  if (typeof window === "undefined" || !window.DeviceOrientationEvent) return false;
  return typeof (window.DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission === "function";
}

/**
 * Writes smoothed pointer input to the shared `pointer` store.
 * R3F components read from `pointer` in useFrame — zero React re-renders.
 */
export function usePointerInput() {
  const mouseRef = useRef({ x: 0, y: 0 });
  const gyroRef = useRef({ x: 0, y: 0 });
  const gyroEnabledRef = useRef(!needsPermission());
  const smoothingRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current = { x, y };
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  useEffect(() => {
    if (!isTouchDevice() || typeof window === "undefined" || !window.DeviceOrientationEvent) return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (!gyroEnabledRef.current) return;
      const gamma = e.gamma ?? 0;
      const beta = e.beta ?? 90;
      const x = Math.max(-1, Math.min(1, gamma * GYRO_X_SCALE));
      const y = Math.max(-1, Math.min(1, (90 - beta) * GYRO_Y_SCALE));
      gyroRef.current = { x, y };
    };

    window.addEventListener("deviceorientation", handleOrientation);
    return () => window.removeEventListener("deviceorientation", handleOrientation);
  }, []);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const useGyro = isTouchDevice() && gyroEnabledRef.current;
      const target = useGyro ? gyroRef.current : mouseRef.current;
      const s = smoothingRef.current;
      const lerp = useGyro ? GYRO_LERP : 0.15;
      s.x += (target.x - s.x) * lerp;
      s.y += (target.y - s.y) * lerp;
      pointer.x = s.x;
      pointer.y = s.y;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const requestGyroPermission = useCallback(async () => {
    if (!needsPermission()) {
      gyroEnabledRef.current = true;
      return;
    }
    const DevOrient = window.DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
    if (DevOrient.requestPermission) {
      const state = await DevOrient.requestPermission();
      gyroEnabledRef.current = state === "granted";
    }
  }, []);

  return { requestGyroPermission };
}
