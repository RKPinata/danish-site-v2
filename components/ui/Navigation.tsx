"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_SECTIONS } from "@/lib/constants";

type NavigationProps = {
  activeIndex: number;
  onNavigate: (id: string) => void;
};

export function Navigation({ activeIndex, onNavigate }: NavigationProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const hide = activeIndex === 0;

  return (
    <>
    <motion.nav
      initial={false}
      animate={{ opacity: hide ? 0 : 1 }}
      transition={{ duration: 0.25 }}
      className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-4"
      style={{ pointerEvents: hide ? "none" : "auto" }}
      aria-label="Section navigation"
      aria-hidden={hide}
    >
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-full min-h-[120px] bg-gradient-to-b from-transparent via-[var(--glass-border)] to-transparent" />
      {NAV_SECTIONS.map((section, i) => (
        <div
          key={section.id}
          className="relative flex items-center justify-end gap-3"
          onMouseEnter={() => setHoveredIndex(i)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === i && (
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="font-mono text-xs text-[var(--glow-red)]/90"
              >
                {section.label}
              </motion.span>
            )}
          </AnimatePresence>
          <button
            type="button"
            onClick={() => onNavigate(section.id)}
            className="relative flex items-center justify-center w-3 h-3 rounded-full transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glow-red)]"
            aria-label={`Go to ${section.label}`}
          >
            <span
              className={`block rounded-full transition-all duration-300 ${
                activeIndex === i
                  ? "w-3 h-3 bg-[var(--glow-red)] shadow-[0_0_15px_var(--glow-red)]"
                  : "w-2 h-2 bg-white/50 hover:bg-white/80"
              }`}
            />
            {activeIndex === i && (
              <motion.span
                layoutId="nav-glow"
                className="absolute inset-0 rounded-full border border-[var(--glow-red)] opacity-60"
                initial={false}
                animate={{ scale: [1, 1.8, 1.8], opacity: [0.6, 0.2, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </button>
        </div>
      ))}
    </motion.nav>
    <motion.nav
      initial={false}
      animate={{ opacity: hide ? 0 : 1 }}
      transition={{ duration: 0.25 }}
      style={{ pointerEvents: hide ? "none" : "auto" }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden flex justify-center gap-8 py-4 px-6 glass-panel border-t border-[var(--glass-border)]"
      aria-label="Section navigation (mobile)"
      aria-hidden={hide}
    >
      {NAV_SECTIONS.map((section, i) => (
        <button
          key={section.id}
          type="button"
          onClick={() => onNavigate(section.id)}
          className={`font-mono text-xs transition-colors ${
            activeIndex === i ? "text-[var(--glow-red)]" : "text-white/60"
          }`}
        >
          {section.label.replace("// ", "")}
        </button>
      ))}
    </motion.nav>
    </>
  );
}
