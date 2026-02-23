"use client";

import { SectionReveal } from "@/components/ui/SectionReveal";
import { GlassCard } from "@/components/ui/GlassCard";
import { PROJECTS } from "@/lib/constants";

export function Projects() {
  return (
    <section id="projects" className="relative min-h-screen py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <SectionReveal className="mb-16" stagger={0.1}>
          <h2
            data-reveal
            className="font-mono text-sm text-[var(--glow-red)] uppercase tracking-widest"
          >
            // Work
          </h2>
          <p
            data-reveal
            className="text-3xl md:text-4xl font-semibold text-[var(--star-white)] mt-2"
          >
            Selected projects
          </p>
        </SectionReveal>
        <SectionReveal
          className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-fr"
          stagger={0.12}
        >
          {PROJECTS.map((project, i) => (
            <div
              key={project.id}
              data-reveal
              className={i === 0 ? "md:row-span-2 md:flex md:flex-col" : ""}
            >
              <GlassCard as="a" href={project.href} className="h-full flex flex-col">
                <h3 className="font-mono text-lg text-[var(--glow-red)]">{project.title}</h3>
                <p className="text-white/80 mt-2 flex-1">{project.description}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="text-xs font-mono px-2 py-1 rounded border border-[var(--glass-border)] text-white/60"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </GlassCard>
            </div>
          ))}
        </SectionReveal>
      </div>
    </section>
  );
}
