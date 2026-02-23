"use client";

import { SectionReveal } from "@/components/ui/SectionReveal";
import { GlassCard } from "@/components/ui/GlassCard";
import { EXPERIENCE } from "@/lib/constants";
import { useYearsOfExperience } from "@/lib/hooks/useYearsOfExperience";

export function About() {
  const yoe = useYearsOfExperience();
  const stats = [
    { value: yoe, label: "Years experience" },
    { value: "∞", label: "Cups of coffee" },
  ];
  return (
    <section id="about" className="relative min-h-screen py-24 px-6 md:px-12 lg:px-24 overflow-x-hidden w-full max-w-full box-border">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 min-w-0 box-border">
        <SectionReveal className="lg:col-span-7 space-y-8" stagger={0.12}>
          <h2
            data-reveal
            className="font-mono text-sm text-[var(--glow-red)] uppercase tracking-widest"
          >
            // About
          </h2>
          <p data-reveal className="text-lg md:text-xl text-[var(--star-white)]/90 leading-relaxed">
            I build human-centered applications that look and feel good. I believe in doing things
            the right way, but I prioritize getting things done even more. Good software comes from
            good communication—and I care about clean architecture, performance, and the details
            that make interfaces feel alive.
          </p>
          <p data-reveal className="text-lg text-white/70 leading-relaxed">
            I explore design systems, typography, and animation when I&apos;m not in the codebase.
            Always building, always learning.
          </p>
        </SectionReveal>
        <SectionReveal className="lg:col-span-5 relative" stagger={0.1}>
          <div className="relative grid gap-4">
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
              aria-hidden
            >
              <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--glow-red)" stopOpacity="0" />
                  <stop offset="50%" stopColor="var(--glow-red)" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="var(--glow-red)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <line
                x1="40"
                y1="60"
                x2="120"
                y2="60"
                stroke="url(#lineGrad)"
                strokeWidth="0.5"
              />
              <line
                x1="120"
                y1="60"
                x2="180"
                y2="120"
                stroke="url(#lineGrad)"
                strokeWidth="0.5"
              />
              <line
                x1="120"
                y1="60"
                x2="180"
                y2="180"
                stroke="url(#lineGrad)"
                strokeWidth="0.5"
              />
            </svg>
            {stats.map((stat) => (
              <div key={stat.label} data-reveal>
                <GlassCard className="relative">
                  <span className="font-mono text-3xl text-[var(--glow-red)]">{stat.value}</span>
                  <span className="block text-sm text-white/60 mt-1">{stat.label}</span>
                </GlassCard>
              </div>
            ))}
          </div>
        </SectionReveal>
        <SectionReveal className="lg:col-span-12 mt-12 lg:mt-16 min-w-0 w-full max-w-full overflow-hidden" stagger={0.08}>
          <h3
            data-reveal
            className="font-mono text-xs text-[var(--glow-red)] uppercase tracking-widest mb-10"
          >
            Where I&apos;ve shipped
          </h3>
          <div className="relative w-full max-w-full min-w-0" style={{ overflow: "hidden" }}>
            {/* Vertical line — pointer-events-none so it doesn't block card hover */}
            <div
              className="absolute left-3 sm:left-4 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--glow-red)]/0 via-[var(--glow-red)]/40 to-[var(--glow-red)]/0 pointer-events-none"
              aria-hidden
            />
            <div className="space-y-0 w-full min-w-0" style={{ overflow: "hidden" }}>
              {EXPERIENCE.map((exp) => (
                <div
                  key={exp.company}
                  data-reveal
                  className="grid grid-cols-[auto_1fr] gap-3 sm:gap-4 pb-10 last:pb-0 w-full min-w-0 items-start"
                  style={{ overflow: "hidden" }}
                >
                  {/* Node */}
                  <div className="relative z-10 flex shrink-0 items-start pt-0.5 w-3 sm:w-4">
                    <span
                      className="h-3 w-3 rounded-full border-2 border-[var(--glow-red)] bg-[var(--space-black)] shadow-[0_0_12px_var(--glow-red)] block"
                      aria-hidden
                    />
                  </div>
                  {/* Card - second column can shrink; content stays within it */}
                  <div className="min-w-0 overflow-hidden">
                    <GlassCard noMotion className="relative z-[1] py-4 px-4 sm:px-6 border border-white/5 hover:border-[var(--glow-red)]/40 transition-colors min-w-0 w-full max-w-full box-border">
                      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 min-w-0">
                        <span className="font-mono text-sm sm:text-base text-[var(--glow-red)] break-words min-w-0">
                          {exp.company}
                        </span>
                        <span className="text-xs text-white/50 tabular-nums sm:shrink-0">{exp.period}</span>
                      </div>
                      <span className="text-sm sm:text-base text-white/90 font-medium block mt-1 break-words min-w-0">
                        {exp.role}
                      </span>
                    </GlassCard>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
