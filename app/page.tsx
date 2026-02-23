"use client";

import { useRef, useCallback } from "react";
import { useSmoothScroll } from "@/lib/hooks/useSmoothScroll";
import { useScrollProgress } from "@/lib/hooks/useScrollProgress";
import { Navigation } from "@/components/ui/Navigation";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  const lenisRef = useSmoothScroll();
  const { activeIndex } = useScrollProgress();

  const handleNavigate = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (el && lenisRef.current) {
        lenisRef.current.scrollTo(el, { offset: 0, duration: 1.2 });
      }
    },
    [lenisRef]
  );

  return (
    <>
      <CustomCursor />
      <Navigation activeIndex={activeIndex} onNavigate={handleNavigate} />
      <main className="pb-20 md:pb-0 w-full max-w-full overflow-x-hidden">
        <Hero />
        <About />
        <Projects />
        <Contact />
      </main>
    </>
  );
}
