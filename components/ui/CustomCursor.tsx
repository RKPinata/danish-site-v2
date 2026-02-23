"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  const latestRef = useRef({ x: 0, y: 0 });
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const isTouch = "ontouchstart" in window;
    if (isTouch) return;

    setVisible(true);
    document.body.classList.add("custom-cursor-active");

    const handleMove = (e: MouseEvent) => {
      latestRef.current = { x: e.clientX, y: e.clientY };
      if (rafIdRef.current == null) {
        rafIdRef.current = requestAnimationFrame(() => {
          rafIdRef.current = null;
          const { x, y } = latestRef.current;
          setPosition({ x, y });
        });
      }
    };

    document.addEventListener("mousemove", handleMove);

    return () => {
      if (rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current);
      document.body.classList.remove("custom-cursor-active");
      document.removeEventListener("mousemove", handleMove);
    };
  }, []);

  if (!visible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference flex items-center justify-center w-8 h-8 -translate-x-1/2 -translate-y-1/2"
      style={{ x: position.x, y: position.y }}
      initial={false}
      transition={{ type: "tween", duration: 0.05 }}
    >
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="var(--glow-red)"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
    </motion.div>
  );
}
