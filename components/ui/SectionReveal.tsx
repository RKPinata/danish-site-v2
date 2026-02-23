"use client";

import { useRef, useEffect, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type SectionRevealProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
};

export function SectionReveal({ children, className = "", stagger = 0.1 }: SectionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const childRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const children = el.querySelectorAll("[data-reveal]");
    childRefs.current = Array.from(children) as HTMLDivElement[];

    const anim = gsap.fromTo(
      children,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 75%",
          end: "top 25%",
          toggleActions: "play none none reverse",
        },
      }
    );

    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, [stagger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
