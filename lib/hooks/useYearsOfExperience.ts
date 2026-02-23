"use client";

import { useState, useEffect } from "react";
import { getYearsOfExperience } from "@/lib/constants";

/**
 * Returns years-of-experience string that is safe for SSR/hydration.
 * Uses a stable initial value so server and first client render match;
 * updates to the real value after mount (client-only).
 */
export function useYearsOfExperience(): string {
  const [yoe, setYoe] = useState("2+");

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setYoe(getYearsOfExperience());
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return yoe;
}
