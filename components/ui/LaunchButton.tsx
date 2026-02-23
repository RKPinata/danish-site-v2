"use client";

import { motion } from "framer-motion";

type LaunchButtonProps = {
  onClick: () => void;
  visible: boolean;
  nudge?: boolean;
};

/** Hexagonal HUD launch control: spaceship-style button with rotating ring, scan line, corner brackets */
export function LaunchButton({ onClick, visible, nudge = false }: LaunchButtonProps) {
  const cx = 100;
  const cy = 56;
  const R = 44; // hexagon vertex radius (flat-top) — larger for more gap from text
  const sqrt3 = Math.sqrt(3);
  // Flat-top hexagon vertices: 0°=top, 60°, 120°, 180°, 240°, 300°
  const hexPoints = [
    [cx, cy - R],
    [cx + (R * sqrt3) / 2, cy - R / 2],
    [cx + (R * sqrt3) / 2, cy + R / 2],
    [cx, cy + R],
    [cx - (R * sqrt3) / 2, cy + R / 2],
    [cx - (R * sqrt3) / 2, cy - R / 2],
  ].map(([x, y]) => `${x},${y}`).join(" ");

  const bracketLen = 6;
  const corners = hexPoints.split(" ").map((p) => p.split(",").map(Number)) as [number, number][];

  function cornerBracketPath(i: number): string {
    const curr = corners[i];
    const prev = corners[(i - 1 + 6) % 6];
    const next = corners[(i + 1) % 6];
    const dx1 = next[0] - curr[0];
    const dy1 = next[1] - curr[1];
    const dx2 = prev[0] - curr[0];
    const dy2 = prev[1] - curr[1];
    const len1 = Math.hypot(dx1, dy1) || 1;
    const len2 = Math.hypot(dx2, dy2) || 1;
    const end1 = [curr[0] + (dx1 / len1) * bracketLen, curr[1] + (dy1 / len1) * bracketLen] as const;
    const end2 = [curr[0] + (dx2 / len2) * bracketLen, curr[1] + (dy2 / len2) * bracketLen] as const;
    return `M${curr[0]},${curr[1]} L${end1[0]},${end1[1]} M${curr[0]},${curr[1]} L${end2[0]},${end2[1]}`;
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={false}
      animate={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
      }}
      transition={{ opacity: { duration: 0.25 } }}
      className="pointer-events-auto absolute left-1/2 bottom-[28%] md:bottom-auto md:top-1/2 md:-translate-y-1/2 z-10 -translate-x-1/2 launch-button-hud"
      style={{ width: "clamp(180px, 28vw, 260px)", height: "auto" }}
      aria-label="Launch — continue to content"
      aria-hidden={!visible}
    >
      <svg
        viewBox="0 0 200 112"
        className="w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="launchGl" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="launchGlSoft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Hexagon frame with pulsing glow */}
        <motion.polygon
          points={hexPoints}
          stroke="#ff3333"
          strokeWidth="1.2"
          fill="rgba(10, 4, 4, 0.4)"
          filter="url(#launchGl)"
          className="hud-pulse"
          animate={nudge ? { opacity: 0.9 } : {}}
          transition={{ duration: nudge ? 0.15 : 0.6 }}
          style={{ opacity: 0.5 }}
        />
        <polygon
          points={hexPoints}
          stroke="#2a1818"
          strokeWidth="0.6"
          fill="none"
          opacity={0.8}
        />

        {/* Corner brackets at hex vertices */}
        {corners.map((_, i) => (
          <path
            key={i}
            d={cornerBracketPath(i)}
            stroke="#ff3333"
            strokeWidth="0.8"
            strokeLinecap="round"
            fill="none"
            opacity={0.4}
            filter="url(#launchGl)"
          />
        ))}

        {/* Nudge chevrons */}
        <motion.g
          animate={
            nudge
              ? { x: [0, 4, 0], opacity: [0.3, 0.9, 0.3] }
              : { x: 0, opacity: 0 }
          }
          transition={
            nudge
              ? { duration: 0.6, repeat: 1, ease: "easeInOut" }
              : { duration: 0.3 }
          }
        >
          <path
            d={`M${cx - 62} ${cy - 5} L${cx - 54} ${cy} L${cx - 62} ${cy + 5}`}
            stroke="#ff3333"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
            filter="url(#launchGl)"
          />
        </motion.g>
        <motion.g
          animate={
            nudge
              ? { x: [0, -4, 0], opacity: [0.3, 0.9, 0.3] }
              : { x: 0, opacity: 0 }
          }
          transition={
            nudge
              ? { duration: 0.6, repeat: 1, ease: "easeInOut" }
              : { duration: 0.3 }
          }
        >
          <path
            d={`M${cx + 62} ${cy - 5} L${cx + 54} ${cy} L${cx + 62} ${cy + 5}`}
            stroke="#ff3333"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
            filter="url(#launchGl)"
          />
        </motion.g>

        {/* LAUNCH text */}
        <motion.text
          x={cx}
          y={cy + 5}
          textAnchor="middle"
          fill="#ff3333"
          fontFamily="monospace"
          fontSize="12"
          letterSpacing="0.35em"
          filter="url(#launchGl)"
          animate={
            nudge
              ? { opacity: 1 }
              : visible
                ? { opacity: [0.75, 1, 0.75] }
                : { opacity: 0.4 }
          }
          transition={
            nudge
              ? { duration: 0.15 }
              : { opacity: { duration: 1.8, repeat: visible ? Infinity : 0 } }
          }
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        >
          LAUNCH
        </motion.text>

        {/* Status micro-labels */}
        <text
          x={cx}
          y={cy - R - 6}
          textAnchor="middle"
          fontSize="6"
          fill="#ff3333"
          fontFamily="monospace"
          opacity={0.35}
          letterSpacing="0.15em"
        >
          SYS RDY
        </text>
        <text
          x={cx}
          y={cy + R + 10}
          textAnchor="middle"
          fontSize="6"
          fill="#ff3333"
          fontFamily="monospace"
          opacity={0.35}
          letterSpacing="0.15em"
        >
          NAV LOCK
        </text>
      </svg>
    </motion.button>
  );
}
