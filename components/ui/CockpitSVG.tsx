"use client";

import { useState, useEffect } from "react";
import { useYearsOfExperience } from "@/lib/hooks/useYearsOfExperience";

const MOBILE_MAX_WIDTH = 768;

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const s = (startDeg * Math.PI) / 180;
  const e = (endDeg * Math.PI) / 180;
  const x1 = cx + r * Math.cos(s);
  const y1 = cy + r * Math.sin(s);
  const x2 = cx + r * Math.cos(e);
  const y2 = cy + r * Math.sin(e);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M${x1} ${y1} A${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
}

function tickMark(cx: number, cy: number, r1: number, r2: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return {
    x1: cx + r1 * Math.cos(rad),
    y1: cy + r1 * Math.sin(rad),
    x2: cx + r2 * Math.cos(rad),
    y2: cy + r2 * Math.sin(rad),
  };
}

export function CockpitSVG() {
  const [fitMobile, setFitMobile] = useState(false);
  const yoe = useYearsOfExperience();

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`);
    const update = () => setFitMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);
  return (
    <svg
      viewBox={fitMobile ? "0 -400 1920 1480" : "0 0 1920 1080"}
      preserveAspectRatio={fitMobile ? "xMidYMax slice" : "xMidYMid slice"}
      className="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="panelV" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1010" stopOpacity="0.96" />
          <stop offset="100%" stopColor="#080404" stopOpacity="0.98" />
        </linearGradient>
        <radialGradient id="radarBg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0a0303" />
          <stop offset="80%" stopColor="#060202" />
          <stop offset="100%" stopColor="#030101" />
        </radialGradient>
        <linearGradient id="hullBar" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2a8a4a" />
          <stop offset="70%" stopColor="#4aba6a" />
          <stop offset="100%" stopColor="#2a8a4a" />
        </linearGradient>
        <linearGradient id="shieldBar" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2244aa" />
          <stop offset="70%" stopColor="#4488ff" />
          <stop offset="100%" stopColor="#2244aa" />
        </linearGradient>
        <linearGradient id="energyBar" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ff3333" />
          <stop offset="100%" stopColor="#ff6644" />
        </linearGradient>
        <linearGradient id="heatBar" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#aa6622" />
          <stop offset="100%" stopColor="#ff8833" />
        </linearGradient>
        <pattern id="scanH" width="1920" height="3" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="1920" y2="0" stroke="#ff3333" strokeWidth="0.3" opacity="0.04" />
        </pattern>
      </defs>

      {/* ===== CANOPY STRUTS ===== */}
      <line x1="960" y1="1080" x2="80" y2="0" stroke="#221414" strokeWidth="3.5" />
      <line x1="960" y1="1080" x2="1840" y2="0" stroke="#221414" strokeWidth="3.5" />
      <line x1="960" y1="1080" x2="80" y2="0" stroke="#ff3333" strokeWidth="0.4" opacity="0.05" />
      <line x1="960" y1="1080" x2="1840" y2="0" stroke="#ff3333" strokeWidth="0.4" opacity="0.05" />

      {/* ===== CENTER CONSOLE ===== */}
      <path
        d="M520 730 Q540 715 960 715 Q1380 715 1400 730 L1460 1080 L460 1080 Z"
        fill="url(#panelV)"
        stroke="#2a1818"
        strokeWidth="1.5"
      />
      <path
        d="M522 730 Q542 717 960 717 Q1378 717 1398 730"
        fill="none"
        stroke="#ff3333"
        strokeWidth="0.6"
        opacity="0.12"
      />

      {/* ─── RADAR / SCANNER (center-left) ─── */}
      {(() => {
        const rcx = 720, rcy = 830, rr = 70;
        return (
          <g>
            <circle cx={rcx} cy={rcy} r={rr + 4} fill="none" stroke="#2a1818" strokeWidth="1.5" />
            <circle cx={rcx} cy={rcy} r={rr} fill="url(#radarBg)" stroke="#1a0e0e" strokeWidth="1" />
            {/* Range rings */}
            <circle cx={rcx} cy={rcy} r={rr * 0.66} fill="none" stroke="#ff3333" strokeWidth="0.25" opacity="0.1" />
            <circle cx={rcx} cy={rcy} r={rr * 0.33} fill="none" stroke="#ff3333" strokeWidth="0.25" opacity="0.08" />
            {/* Cross hairs */}
            <line x1={rcx - rr} y1={rcy} x2={rcx + rr} y2={rcy} stroke="#ff3333" strokeWidth="0.2" opacity="0.07" />
            <line x1={rcx} y1={rcy - rr} x2={rcx} y2={rcy + rr} stroke="#ff3333" strokeWidth="0.2" opacity="0.07" />
            {/* Sweep line */}
            <line x1={rcx} y1={rcy} x2={rcx + rr * 0.65} y2={rcy - rr * 0.76} stroke="#ff3333" strokeWidth="0.8" opacity="0.35" />
            {/* Contacts */}
            <circle cx={rcx + 22} cy={rcy - 30} r="2.5" fill="#ff3333" opacity="0.4" />
            <circle cx={rcx - 35} cy={rcy + 10} r="2" fill="#3a8a4a" opacity="0.35" />
            <circle cx={rcx + 8} cy={rcy + 40} r="1.8" fill="#3a8a4a" opacity="0.3" />
            <circle cx={rcx - 15} cy={rcy - 48} r="1.5" fill="#aa8833" opacity="0.25" />
            {/* Player center marker */}
            <polygon points={`${rcx},${rcy - 4} ${rcx + 3},${rcy + 3} ${rcx - 3},${rcy + 3}`} fill="#ff3333" opacity="0.4" />
            {/* Cardinal labels */}
            <text x={rcx} y={rcy - rr - 6} textAnchor="middle" fontSize="6" fill="#ff3333" fontFamily="monospace" opacity="0.2">N</text>
            <text x={rcx + rr + 6} y={rcy + 2} textAnchor="middle" fontSize="6" fill="#ff3333" fontFamily="monospace" opacity="0.15">E</text>
            <text x={rcx} y={rcy + rr + 10} textAnchor="middle" fontSize="6" fill="#ff3333" fontFamily="monospace" opacity="0.15">S</text>
            <text x={rcx - rr - 6} y={rcy + 2} textAnchor="middle" fontSize="6" fill="#ff3333" fontFamily="monospace" opacity="0.15">W</text>
            {/* Range label */}
            <text x={rcx + rr - 12} y={rcy + rr + 14} textAnchor="end" fontSize="7" fill="#604040" fontFamily="monospace" opacity="0.35">1,247 PKGS</text>
            <text x={rcx - rr + 2} y={rcy - rr - 6} fontSize="6" fill="#604040" fontFamily="monospace" opacity="0.3">DEPS SCANNER</text>
          </g>
        );
      })()}

      {/* ─── SHIP HOLOGRAM + SHIELD RINGS (dead center) ─── */}
      {(() => {
        const scx = 960, scy = 815;
        return (
          <g>
            {/* Shield rings */}
            <ellipse cx={scx} cy={scy} rx="52" ry="58" fill="none" stroke="#4488ff" strokeWidth="1.8" opacity="0.15" />
            <ellipse cx={scx} cy={scy} rx="48" ry="54" fill="none" stroke="#4488ff" strokeWidth="1.2" opacity="0.1" />
            <ellipse cx={scx} cy={scy} rx="44" ry="50" fill="none" stroke="#4488ff" strokeWidth="0.6" opacity="0.06" />
            {/* Active shield arcs (showing partial shields) */}
            <path d={arcPath(scx, scy - 4, 52, -120, -60)} fill="none" stroke="#4488ff" strokeWidth="2.5" opacity="0.35" />
            <path d={arcPath(scx, scy - 4, 52, -40, 20)} fill="none" stroke="#4488ff" strokeWidth="2.5" opacity="0.3" />
            <path d={arcPath(scx, scy + 4, 52, 60, 120)} fill="none" stroke="#4488ff" strokeWidth="2" opacity="0.2" />
            <path d={arcPath(scx, scy + 4, 52, 140, 220)} fill="none" stroke="#2244aa" strokeWidth="1.5" opacity="0.12" />
            {/* Ship wireframe silhouette */}
            <path
              d={`M${scx} ${scy - 38} L${scx + 6} ${scy - 20} L${scx + 28} ${scy - 8} L${scx + 30} ${scy}
                  L${scx + 28} ${scy + 4} L${scx + 8} ${scy + 8} L${scx + 12} ${scy + 28} L${scx + 8} ${scy + 30}
                  L${scx + 2} ${scy + 14} L${scx} ${scy + 16}
                  L${scx - 2} ${scy + 14} L${scx - 8} ${scy + 30} L${scx - 12} ${scy + 28}
                  L${scx - 8} ${scy + 8} L${scx - 28} ${scy + 4} L${scx - 30} ${scy}
                  L${scx - 28} ${scy - 8} L${scx - 6} ${scy - 20} Z`}
              fill="none"
              stroke="#ff3333"
              strokeWidth="0.8"
              opacity="0.3"
            />
            <line x1={scx} y1={scy - 38} x2={scx} y2={scy + 16} stroke="#ff3333" strokeWidth="0.3" opacity="0.12" />
            {/* Hull status text */}
            <text x={scx} y={scy + 50} textAnchor="middle" fontSize="7" fill="#604040" fontFamily="monospace" opacity="0.4">COVERAGE</text>
            <text x={scx} y={scy + 62} textAnchor="middle" fontSize="12" fill="#3a8a4a" fontFamily="monospace" opacity="0.6">98%</text>
          </g>
        );
      })()}

      {/* ─── TARGET INFO (center-right) ─── */}
      {(() => {
        const tx = 1100, ty = 755;
        return (
          <g>
            <text x={tx} y={ty} fontSize="8" fill="#604040" fontFamily="monospace" opacity="0.4" letterSpacing="2">CURRENT MISSION</text>
            <line x1={tx} y1={ty + 4} x2={tx + 200} y2={ty + 4} stroke="#ff3333" strokeWidth="0.3" opacity="0.1" />
            <text x={tx + 100} y={ty + 22} textAnchor="middle" fontSize="10" fill="#ff3333" fontFamily="monospace" opacity="0.25">respond.io</text>

            {/* Compass indicator */}
            <circle cx={tx + 100} cy={ty + 62} r="22" fill="#080303" stroke="#2a1818" strokeWidth="1" />
            <circle cx={tx + 100} cy={ty + 62} r="18" fill="none" stroke="#ff3333" strokeWidth="0.2" opacity="0.08" />
            <line x1={tx + 100} y1={ty + 44} x2={tx + 100} y2={ty + 80} stroke="#ff3333" strokeWidth="0.2" opacity="0.06" />
            <line x1={tx + 82} y1={ty + 62} x2={tx + 118} y2={ty + 62} stroke="#ff3333" strokeWidth="0.2" opacity="0.06" />
            <text x={tx + 100} y={ty + 92} textAnchor="middle" fontSize="6" fill="#604040" fontFamily="monospace" opacity="0.3">COMPASS</text>

            {/* Distance / bearing readout */}
            <text x={tx} y={ty + 110} fontSize="7" fill="#604040" fontFamily="monospace" opacity="0.35">SPRINT</text>
            <text x={tx + 48} y={ty + 110} fontSize="8" fill="#ff3333" fontFamily="monospace" opacity="0.2">12</text>
            <text x={tx + 100} y={ty + 110} fontSize="7" fill="#604040" fontFamily="monospace" opacity="0.35">ETA</text>
            <text x={tx + 140} y={ty + 110} fontSize="8" fill="#ff3333" fontFamily="monospace" opacity="0.2">3d</text>
          </g>
        );
      })()}

      {/* ─── HEADING TAPE (center bottom strip) ─── */}
      {(() => {
        const hy = 910, hx = 640, hw = 640;
        const headings = ["TS4", "R18", "V3", "NX14", "TW3", "v4.2", "SWR", "ZST", "PG", "Sentry", "Vercel"];
        return (
          <g>
            <rect x={hx} y={hy} width={hw} height="22" rx="2" fill="#080303" stroke="#1a0e0e" strokeWidth="0.8" />
            <rect x={hx} y={hy} width={hw} height="22" rx="2" fill="url(#scanH)" />
            <line x1={hx} y1={hy + 22} x2={hx + hw} y2={hy + 22} stroke="#2a1818" strokeWidth="0.5" />
            {headings.map((h, i) => {
              const x = hx + 20 + i * (hw - 40) / (headings.length - 1);
              return (
                <g key={`ht-${i}`}>
                  <line x1={x} y1={hy + 2} x2={x} y2={hy + 7} stroke="#ff3333" strokeWidth="0.4" opacity="0.2" />
                  <text x={x} y={hy + 17} textAnchor="middle" fontSize="7" fill="#ff3333" fontFamily="monospace" opacity={h === "v4.2" ? 0.5 : 0.2}>{h}</text>
                </g>
              );
            })}
            {/* Current heading marker */}
            <polygon points={`960,${hy - 1} 955,${hy - 7} 965,${hy - 7}`} fill="#ff3333" opacity="0.5" />
            <text x="960" y={hy - 10} textAnchor="middle" fontSize="8" fill="#ff3333" fontFamily="monospace" opacity="0.4">STACK v4.2</text>
          </g>
        );
      })()}

      {/* ─── POWER DISTRIBUTION PIPS (below heading) ─── */}
      {(() => {
        const py = 942, px = 760;
        const cats = [
          { label: "PERF", pips: 2, color: "#4488ff" },
          { label: "A11Y", pips: 3, color: "#ffaa33" },
          { label: "DX", pips: 4, color: "#ff3333" },
        ];
        return (
          <g>
            {cats.map((cat, ci) => {
              const cx = px + ci * 140;
              return (
                <g key={`pw-${ci}`}>
                  <text x={cx} y={py + 10} fontSize="7" fill="#604040" fontFamily="monospace" opacity="0.4">{cat.label}</text>
                  {[0, 1, 2, 3].map((p) => (
                    <rect
                      key={`pip-${ci}-${p}`}
                      x={cx + 36 + p * 16}
                      y={py}
                      width="12"
                      height="12"
                      rx="1.5"
                      fill={p < cat.pips ? cat.color : "#0a0404"}
                      opacity={p < cat.pips ? 0.35 : 0.15}
                      stroke={p < cat.pips ? cat.color : "#1a0e0e"}
                      strokeWidth="0.5"
                    />
                  ))}
                </g>
              );
            })}
          </g>
        );
      })()}

      {/* ─── SPEED READOUT (left of center console) ─── */}
      {(() => {
        const sx = 545, sy = 745;
        return (
          <g>
            <text x={sx} y={sy} fontSize="6" fill="#604040" fontFamily="monospace" opacity="0.3" letterSpacing="1">VELOCITY</text>
            <rect x={sx} y={sy + 4} width="48" height="20" rx="2" fill="#060202" stroke="#1a0e0e" strokeWidth="0.5" />
            <text x={sx + 24} y={sy + 19} textAnchor="middle" fontSize="13" fill="#ff3333" fontFamily="monospace" opacity="0.5">127</text>
            <text x={sx + 52} y={sy + 19} fontSize="6" fill="#604040" fontFamily="monospace" opacity="0.3">PR/mo</text>
            {/* Throttle bar (vertical) */}
            <rect x={sx} y={sy + 30} width="10" height="80" rx="2" fill="#060202" stroke="#1a0e0e" strokeWidth="0.5" />
            <rect x={sx + 1.5} y={sy + 46} width="7" height="62.5" rx="1" fill="url(#energyBar)" opacity="0.25" />
            <text x={sx + 5} y={sy + 120} textAnchor="middle" fontSize="5" fill="#604040" fontFamily="monospace" opacity="0.3">FLOW</text>
            {/* Throttle percentage */}
            <text x={sx + 18} y={sy + 80} fontSize="8" fill="#ff3333" fontFamily="monospace" opacity="0.3">78%</text>
          </g>
        );
      })()}

      {/* ─── HULL & SHIELD BARS (above heading) ─── */}
      {(() => {
        const by = 890;
        return (
          <g>
            {/* Hull bar */}
            <text x="680" y={by - 2} fontSize="6" fill="#3a8a4a" fontFamily="monospace" opacity="0.4">CODE COV</text>
            <rect x="710" y={by - 8} width="220" height="6" rx="2" fill="#0a0404" stroke="#1a0e0e" strokeWidth="0.4" />
            <rect x="711" y={by - 7} width="212" height="4" rx="1.5" fill="url(#hullBar)" opacity="0.4" />
            {/* Shield bar */}
            <text x="980" y={by - 2} fontSize="6" fill="#4488ff" fontFamily="monospace" opacity="0.4">PERF SCORE</text>
            <rect x="1010" y={by - 8} width="220" height="6" rx="2" fill="#0a0404" stroke="#1a0e0e" strokeWidth="0.4" />
            <rect x="1011" y={by - 7} width="156" height="4" rx="1.5" fill="url(#shieldBar)" opacity="0.35" />
          </g>
        );
      })()}

      {/* ===== LEFT PANEL — WEAPONS ===== */}
      {(() => {
        const lx = 18, ly = 740;
        return (
          <g>
            <path
              d={`M${lx} ${ly} Q${lx} ${ly - 12} ${lx + 18} ${ly - 12}
                  L${lx + 235} ${ly - 12} Q${lx + 250} ${ly - 12} ${lx + 250} ${ly}
                  L${lx + 255} ${ly + 310} L${lx - 5} ${ly + 310} Z`}
              fill="url(#panelV)"
              stroke="#2a1818"
              strokeWidth="1.2"
            />
            <text x={lx + 12} y={ly + 8} fontSize="8" fill="#ff3333" fontFamily="monospace" opacity="0.35" letterSpacing="2">TECH STACK</text>
            <line x1={lx + 10} y1={ly + 14} x2={lx + 240} y2={ly + 14} stroke="#ff3333" strokeWidth="0.3" opacity="0.1" />

            {/* Weapon 1: Beam Laser — arc gauge + readout */}
            {(() => {
              const gcx = lx + 60, gcy = ly + 68, gr = 32;
              return (
                <g>
                  {/* Background arc */}
                  <path d={arcPath(gcx, gcy, gr, 135, 405)} fill="none" stroke="#1a0e0e" strokeWidth="4" />
                  {/* Value arc (energy level ~80%) */}
                  <path d={arcPath(gcx, gcy, gr, 135, 351)} fill="none" stroke="url(#energyBar)" strokeWidth="4" opacity="0.4" />
                  {/* Tick marks */}
                  {[135, 180, 225, 270, 315, 360, 405].map((d) => {
                    const t = tickMark(gcx, gcy, gr - 6, gr - 2, d);
                    return <line key={d} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="#ff3333" strokeWidth="0.3" opacity="0.15" />;
                  })}
                  <text x={gcx} y={gcy + 3} textAnchor="middle" fontSize="10" fill="#ff3333" fontFamily="monospace" opacity="0.45">80</text>
                  <text x={gcx} y={gcy + 12} textAnchor="middle" fontSize="5" fill="#604040" fontFamily="monospace" opacity="0.35">PROFICIENCY</text>
                </g>
              );
            })()}
            <text x={lx + 110} y={ly + 42} fontSize="9" fill="#888070" fontFamily="monospace" opacity="0.55">REACT.TSX</text>
            <text x={lx + 220} y={ly + 42} textAnchor="end" fontSize="13" fill="#3a8a4a" fontFamily="monospace" opacity="0.6">OK</text>
            {/* Heat bar */}
            <text x={lx + 110} y={ly + 60} fontSize="6" fill="#604040" fontFamily="monospace" opacity="0.3">BUNDLE SIZE</text>
            <rect x={lx + 110} y={ly + 64} width="120" height="4" rx="1" fill="#0a0404" stroke="#1a0e0e" strokeWidth="0.3" />
            <rect x={lx + 111} y={ly + 65} width="30" height="2" rx="0.5" fill="url(#heatBar)" opacity="0.35" />
            {/* DPS readout */}
            <text x={lx + 110} y={ly + 82} fontSize="6" fill="#604040" fontFamily="monospace" opacity="0.3">COMP/DAY</text>
            <text x={lx + 135} y={ly + 82} fontSize="7" fill="#ff3333" fontFamily="monospace" opacity="0.25">12</text>
            <text x={lx + 175} y={ly + 82} fontSize="6" fill="#604040" fontFamily="monospace" opacity="0.3">VER</text>
            <text x={lx + 200} y={ly + 82} fontSize="7" fill="#ff3333" fontFamily="monospace" opacity="0.25">19.x</text>

            <line x1={lx + 12} y1={ly + 96} x2={lx + 240} y2={ly + 96} stroke="#1a0e0e" strokeWidth="0.8" />

            {/* Weapon 2: Light Missile — arc gauge + readout */}
            {(() => {
              const gcx = lx + 60, gcy = ly + 150, gr = 32;
              return (
                <g>
                  <path d={arcPath(gcx, gcy, gr, 135, 405)} fill="none" stroke="#1a0e0e" strokeWidth="4" />
                  {/* Ammo level ~40% */}
                  <path d={arcPath(gcx, gcy, gr, 135, 243)} fill="none" stroke="#ff3333" strokeWidth="4" opacity="0.3" />
                  {[135, 180, 225, 270, 315, 360, 405].map((d) => {
                    const t = tickMark(gcx, gcy, gr - 6, gr - 2, d);
                    return <line key={d} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="#ff3333" strokeWidth="0.3" opacity="0.15" />;
                  })}
                  <text x={gcx} y={gcy + 3} textAnchor="middle" fontSize="12" fill="#ff3333" fontFamily="monospace" opacity="0.5">16</text>
                  <text x={gcx} y={gcy + 12} textAnchor="middle" fontSize="5" fill="#604040" fontFamily="monospace" opacity="0.35">ROUTES</text>
                </g>
              );
            })()}
            <text x={lx + 110} y={ly + 124} fontSize="9" fill="#888070" fontFamily="monospace" opacity="0.55">NEXT.JS</text>
            <text x={lx + 220} y={ly + 124} textAnchor="end" fontSize="13" fill="#ff6633" fontFamily="monospace" opacity="0.5">16</text>
            <text x={lx + 110} y={ly + 142} fontSize="6" fill="#604040" fontFamily="monospace" opacity="0.3">BUILD</text>
            <text x={lx + 170} y={ly + 142} fontSize="7" fill="#ff3333" fontFamily="monospace" opacity="0.25">2.4s</text>
            <text x={lx + 110} y={ly + 158} fontSize="6" fill="#604040" fontFamily="monospace" opacity="0.3">MODE</text>
            <text x={lx + 135} y={ly + 158} fontSize="7" fill="#ff3333" fontFamily="monospace" opacity="0.25">APP ROUTER</text>
            <text x={lx + 185} y={ly + 158} fontSize="6" fill="#604040" fontFamily="monospace" opacity="0.3">RENDER</text>
            <text x={lx + 207} y={ly + 158} fontSize="7" fill="#ff3333" fontFamily="monospace" opacity="0.25">SSR</text>

            <line x1={lx + 12} y1={ly + 178} x2={lx + 240} y2={ly + 178} stroke="#1a0e0e" strokeWidth="0.8" />

            {/* Weapon group selector */}
            <text x={lx + 12} y={ly + 196} fontSize="7" fill="#604040" fontFamily="monospace" opacity="0.35">ENV</text>
            {["DEV", "STG", "PRD"].map((g, i) => (
              <g key={`wg-${i}`}>
                <rect x={lx + 58 + i * 34} y={ly + 186} width="28" height="14" rx="2"
                  fill={i === 0 ? "#1a0808" : "#0a0404"} stroke={i === 0 ? "#ff3333" : "#1a0e0e"} strokeWidth={i === 0 ? "0.8" : "0.4"} opacity={i === 0 ? 0.6 : 0.3} />
                <text x={lx + 72 + i * 34} y={ly + 197} textAnchor="middle" fontSize="6" fill={i === 0 ? "#ff3333" : "#604040"} fontFamily="monospace" opacity={i === 0 ? 0.5 : 0.25}>{g}</text>
              </g>
            ))}
            {/* Fire mode */}
            <rect x={lx + 170} y={ly + 186} width="60" height="14" rx="2" fill="#0a0404" stroke="#3a8a4a" strokeWidth="0.5" opacity="0.5" />
            <text x={lx + 200} y={ly + 197} textAnchor="middle" fontSize="7" fill="#3a8a4a" fontFamily="monospace" opacity="0.5">DEPLOY</text>

            {/* Total ammo summary */}
            <text x={lx + 12} y={ly + 224} fontSize="6" fill="#604040" fontFamily="monospace" opacity="0.3">COMMITS</text>
            <text x={lx + 12} y={ly + 240} fontSize="16" fill="#ff3333" fontFamily="monospace" opacity="0.35">248<tspan fontSize="8" opacity="0.5">/∞</tspan></text>
          </g>
        );
      })()}

      {/* ===== RIGHT PANEL — SYSTEMS ===== */}
      {(() => {
        const rx = 1652, ry = 740;
        return (
          <g>
            <path
              d={`M${rx} ${ry} Q${rx} ${ry - 12} ${rx + 18} ${ry - 12}
                  L${rx + 235} ${ry - 12} Q${rx + 250} ${ry - 12} ${rx + 250} ${ry}
                  L${rx + 255} ${ry + 310} L${rx - 5} ${ry + 310} Z`}
              fill="url(#panelV)"
              stroke="#2a1818"
              strokeWidth="1.2"
            />
            <text x={rx + 12} y={ry + 8} fontSize="8" fill="#ff3333" fontFamily="monospace" opacity="0.35" letterSpacing="2">OPERATIONS</text>
            <line x1={rx + 10} y1={ry + 14} x2={rx + 240} y2={ry + 14} stroke="#ff3333" strokeWidth="0.3" opacity="0.1" />

            {/* Shield Arc Gauge */}
            {(() => {
              const gcx = rx + 60, gcy = ry + 68, gr = 32;
              return (
                <g>
                  <path d={arcPath(gcx, gcy, gr, 135, 405)} fill="none" stroke="#1a0e0e" strokeWidth="4" />
                  {/* Shield level ~72% */}
                  <path d={arcPath(gcx, gcy, gr, 135, 329.4)} fill="none" stroke="url(#shieldBar)" strokeWidth="4" opacity="0.35" />
                  {[135, 180, 225, 270, 315, 360, 405].map((d) => {
                    const t = tickMark(gcx, gcy, gr - 6, gr - 2, d);
                    return <line key={d} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="#4488ff" strokeWidth="0.3" opacity="0.15" />;
                  })}
                  <text x={gcx} y={gcy + 3} textAnchor="middle" fontSize="10" fill="#4488ff" fontFamily="monospace" opacity="0.45">72</text>
                  <text x={gcx} y={gcy + 12} textAnchor="middle" fontSize="5" fill="#604040" fontFamily="monospace" opacity="0.35">TYPES</text>
                </g>
              );
            })()}
            <text x={rx + 110} y={ry + 42} fontSize="9" fill="#888070" fontFamily="monospace" opacity="0.55">TYPESCRIPT</text>
            <text x={rx + 220} y={ry + 42} textAnchor="end" fontSize="13" fill="#3a8a4a" fontFamily="monospace" opacity="0.6">OK</text>
            <text x={rx + 110} y={ry + 60} fontSize="6" fill="#604040" fontFamily="monospace" opacity="0.3">TYPES/DAY</text>
            <text x={rx + 175} y={ry + 60} fontSize="7" fill="#4488ff" fontFamily="monospace" opacity="0.25">4.2</text>
            <text x={rx + 110} y={ry + 76} fontSize="6" fill="#604040" fontFamily="monospace" opacity="0.3">ANY</text>
            <text x={rx + 150} y={ry + 76} fontSize="7" fill="#4488ff" fontFamily="monospace" opacity="0.25">0%</text>
            <text x={rx + 200} y={ry + 76} fontSize="7" fill="#4488ff" fontFamily="monospace" opacity="0.2">STRICT</text>

            <line x1={rx + 12} y1={ry + 96} x2={rx + 240} y2={ry + 96} stroke="#1a0e0e" strokeWidth="0.8" />

            {/* Engine / Fuel Gauge */}
            {(() => {
              const gcx = rx + 60, gcy = ry + 150, gr = 32;
              return (
                <g>
                  <path d={arcPath(gcx, gcy, gr, 135, 405)} fill="none" stroke="#1a0e0e" strokeWidth="4" />
                  {/* Fuel ~65% */}
                  <path d={arcPath(gcx, gcy, gr, 135, 310.5)} fill="none" stroke="url(#heatBar)" strokeWidth="4" opacity="0.35" />
                  {[135, 180, 225, 270, 315, 360, 405].map((d) => {
                    const t = tickMark(gcx, gcy, gr - 6, gr - 2, d);
                    return <line key={d} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="#ffaa33" strokeWidth="0.3" opacity="0.15" />;
                  })}
                  <text x={gcx} y={gcy + 3} textAnchor="middle" fontSize="10" fill="#ffaa33" fontFamily="monospace" opacity="0.45">65</text>
                  <text x={gcx} y={gcy + 12} textAnchor="middle" fontSize="5" fill="#604040" fontFamily="monospace" opacity="0.35">UTILS</text>
                </g>
              );
            })()}
            <text x={rx + 110} y={ry + 124} fontSize="9" fill="#888070" fontFamily="monospace" opacity="0.55">TAILWIND</text>
            <text x={rx + 220} y={ry + 124} textAnchor="end" fontSize="13" fill="#3a8a4a" fontFamily="monospace" opacity="0.6">OK</text>
            <text x={rx + 110} y={ry + 142} fontSize="6" fill="#604040" fontFamily="monospace" opacity="0.3">UTILS</text>
            <text x={rx + 140} y={ry + 142} fontSize="7" fill="#ffaa33" fontFamily="monospace" opacity="0.3">4,280</text>
            <text x={rx + 110} y={ry + 158} fontSize="6" fill="#604040" fontFamily="monospace" opacity="0.3">HMR</text>
            <text x={rx + 140} y={ry + 158} fontSize="7" fill="#ffaa33" fontFamily="monospace" opacity="0.25">482ms</text>
            <text x={rx + 185} y={ry + 158} fontSize="6" fill="#604040" fontFamily="monospace" opacity="0.3">JIT</text>
            <text x={rx + 200} y={ry + 158} fontSize="7" fill="#ffaa33" fontFamily="monospace" opacity="0.25">94.2%</text>

            <line x1={rx + 12} y1={ry + 178} x2={rx + 240} y2={ry + 178} stroke="#1a0e0e" strokeWidth="0.8" />

            {/* Countermeasures */}
            <text x={rx + 12} y={ry + 196} fontSize="7" fill="#604040" fontFamily="monospace" opacity="0.35">QUALITY GATES</text>
            <g>
              <rect x={rx + 12} y={ry + 204} width="56" height="36" rx="2" fill="#060202" stroke="#1a0e0e" strokeWidth="0.5" />
              <text x={rx + 40} y={ry + 218} textAnchor="middle" fontSize="5" fill="#604040" fontFamily="monospace" opacity="0.35">TESTS</text>
              <text x={rx + 40} y={ry + 234} textAnchor="middle" fontSize="14" fill="#ff3333" fontFamily="monospace" opacity="0.35">42</text>
            </g>
            <g>
              <rect x={rx + 78} y={ry + 204} width="56" height="36" rx="2" fill="#060202" stroke="#1a0e0e" strokeWidth="0.5" />
              <text x={rx + 106} y={ry + 218} textAnchor="middle" fontSize="5" fill="#604040" fontFamily="monospace" opacity="0.35">LINTS</text>
              <text x={rx + 106} y={ry + 234} textAnchor="middle" fontSize="10" fill="#3a8a4a" fontFamily="monospace" opacity="0.4">PASS</text>
            </g>
            <g>
              <rect x={rx + 144} y={ry + 204} width="56" height="36" rx="2" fill="#060202" stroke="#1a0e0e" strokeWidth="0.5" />
              <text x={rx + 172} y={ry + 218} textAnchor="middle" fontSize="5" fill="#604040" fontFamily="monospace" opacity="0.35">CI/CD</text>
              <text x={rx + 172} y={ry + 234} textAnchor="middle" fontSize="11" fill="#3a8a4a" fontFamily="monospace" opacity="0.4">RDY</text>
            </g>
          </g>
        );
      })()}

      {/* ===== LOWER CENTER — STATUS STRIP ===== */}
      {(() => {
        const sy = 970;
        return (
          <g>
            <rect x="580" y={sy} width="760" height="22" rx="2" fill="#080404" stroke="#1a0e0e" strokeWidth="0.5" />
            {/* Warning indicators */}
            {[
              { label: "TECH DEBT", color: "#aa8833", active: true },
              { label: "TYPES", color: "#3a8a4a", active: true },
              { label: "BUILD", color: "#3a8a4a", active: true },
              { label: "DEPLOY", color: "#3a8a4a", active: true },
              { label: "ROUTER", color: "#3a8a4a", active: true },
              { label: "API", color: "#3a8a4a", active: true },
              { label: "TESTS", color: "#3a8a4a", active: true },
              { label: "A11Y", color: "#3a8a4a", active: true },
            ].map((ind, i) => (
              <g key={`ind-${i}`}>
                <circle cx={610 + i * 92} cy={sy + 11} r="3" fill={ind.color} opacity="0.3" />
                <text x={620 + i * 92} y={sy + 14} fontSize="6.5" fill={ind.color} fontFamily="monospace" opacity="0.4">{ind.label}</text>
              </g>
            ))}
          </g>
        );
      })()}

      {/* ===== CENTER BOTTOM — CREDITS / MISSION ===== */}
      <text x="960" y="1010" textAnchor="middle" fontSize="7" fill="#604040" fontFamily="monospace" opacity="0.25">SECTOR KL — respond.io</text>
      <text x="960" y="1025" textAnchor="middle" fontSize="6" fill="#ff3333" fontFamily="monospace" opacity="0.15">{yoe} YOE | REACT / NEXT / TS | FRONTEND DIVISION</text>

      {/* Edge vignette */}
      <rect x="0" y="0" width="1920" height="1080" fill="none" stroke="#050202" strokeWidth="16" opacity="0.4" />
    </svg>
  );
}
