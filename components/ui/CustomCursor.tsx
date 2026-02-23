"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isTouch = "ontouchstart" in window;
    if (isTouch) return;

    setVisible(true);

    const handleMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleOver = () => setIsHovering(true);
    const handleOut = () => setIsHovering(false);

    document.addEventListener("mousemove", handleMove);
    document.body.addEventListener("mouseover", handleOver);
    document.body.addEventListener("mouseout", handleOut);

    const interactive = document.querySelectorAll("a, button, [role='button'], input, textarea");
    interactive.forEach((el) => {
      el.addEventListener("mouseenter", handleOver);
      el.addEventListener("mouseleave", handleOut);
    });

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.body.removeEventListener("mouseover", handleOver);
      document.body.removeEventListener("mouseout", handleOut);
      interactive.forEach((el) => {
        el.removeEventListener("mouseenter", handleOver);
        el.removeEventListener("mouseleave", handleOut);
      });
    };
  }, []);

  if (!visible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
      style={{ x: position.x, y: position.y }}
      initial={false}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
    >
      <motion.span
        className="block w-3 h-3 rounded-full bg-[var(--glow-red)] -translate-x-1/2 -translate-y-1/2"
        animate={{
          scale: isHovering ? 1.8 : 1,
          boxShadow: isHovering ? "0 0 20px rgba(255,51,51,0.8)" : "0 0 10px rgba(255,51,51,0.4)",
        }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
}
