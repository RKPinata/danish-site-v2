"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Returns a 0–1 value representing how far the hero section has scrolled out of view.
 * 0 = hero at top of viewport, 1 = hero fully scrolled up (or past a threshold).
 * Used to drive zoom / camera effects when scrolling down.
 */
export function useHeroScrollZoom(heroRef: React.RefObject<HTMLElement | null>) {
  const [scrollZoom, setScrollZoom] = useState(0);
  const rafRef = useRef<number>(0);

  const update = useCallback(() => {
    if (!heroRef.current) {
      rafRef.current = requestAnimationFrame(update);
      return;
    }
    const rect = heroRef.current.getBoundingClientRect();
    const height = rect.height;
    const top = rect.top;
    // 0 when hero top is at viewport top; 1 when hero has scrolled up by its full height
    const progress = height <= 0 ? 1 : Math.min(1, Math.max(0, -top / height));
    setScrollZoom(progress);
    rafRef.current = requestAnimationFrame(update);
  }, [heroRef]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafRef.current);
  }, [update]);

  return scrollZoom;
}
