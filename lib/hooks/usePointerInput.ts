"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const GYRO_LERP = 0.08;
const GYRO_X_SCALE = 1 / 45; // gamma ~ -45 to 45 for typical tilt -> ~ -1 to 1
const GYRO_Y_SCALE = 1 / 45; // beta: 90 upright, 45 tilted -> (90 - beta) / 45

function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

function needsPermission(): boolean {
  if (typeof window === "undefined" || !window.DeviceOrientationEvent) return false;
  return typeof (window.DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission === "function";
}

export type PointerInputResult = {
  x: number;
  y: number;
  requestGyroPermission: () => Promise<void>;
};

/**
 * Returns normalized -1..1 pointer input: mouse on desktop, gyro on mobile (with optional permission request).
 */
export function usePointerInput(): PointerInputResult {
  const [position, setPosition] = useState({ x: 0, y: 0 });
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
      const gamma = e.gamma ?? 0; // left-right tilt -90..90
      const beta = e.beta ?? 90;  // front-back, ~90 when upright
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
      setPosition({ x: s.x, y: s.y });
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

  return { ...position, requestGyroPermission };
}
