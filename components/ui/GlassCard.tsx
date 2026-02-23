"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "a";
  href?: string;
  /** When true, disables hover lift/scale so the card only uses hover styles from className (e.g. for timelines) */
  noMotion?: boolean;
};

export function GlassCard({
  children,
  className = "",
  as: Component = "div",
  href,
  noMotion = false,
}: GlassCardProps) {
  const hoverStyles = noMotion
    ? ""
    : " hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(255,51,51,0.15),inset_0_0_30px_rgba(255,51,51,0.03)]";
  const base = `glass-panel rounded-xl p-6 transition-all duration-300 border-[var(--glass-border)]${hoverStyles}`;

  if (Component === "a") {
    return (
      <motion.a
        href={href}
        className={`${base} block ${className}`}
        whileHover={noMotion ? undefined : { scale: 1.01 }}
        whileTap={noMotion ? undefined : { scale: 0.99 }}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.div
      className={`${base} ${className}`}
      whileHover={noMotion ? undefined : { scale: 1.01 }}
      whileTap={noMotion ? undefined : { scale: 0.99 }}
    >
      {children}
    </motion.div>
  );
}
