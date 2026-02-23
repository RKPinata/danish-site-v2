"use client";

import { useState, useEffect, useRef } from "react";

const SECTION_IDS = ["hero", "about", "projects", "contact"];

export function useScrollProgress() {
  const [activeIndex, setActiveIndex] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean);

    if (elements.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          const index = SECTION_IDS.indexOf(id);
          if (index !== -1) setActiveIndex(index);
        });
      },
      {
        root: null,
        rootMargin: "-40% 0px -40% 0px",
        threshold: 0,
      }
    );

    elements.forEach((el) => el && observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  return { activeIndex, sectionIds: SECTION_IDS };
}
