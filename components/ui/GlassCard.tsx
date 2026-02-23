"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "a";
  href?: string;
};

export function GlassCard({ children, className = "", as: Component = "div", href }: GlassCardProps) {
  const base =
    "glass-panel rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(255,51,51,0.15),inset_0_0_30px_rgba(255,51,51,0.03)] border-[var(--glass-border)]";

  if (Component === "a") {
    return (
      <motion.a
        href={href}
        className={`${base} block ${className}`}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.div
      className={`${base} ${className}`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      {children}
    </motion.div>
  );
}
