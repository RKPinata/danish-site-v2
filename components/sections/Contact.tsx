"use client";

import { SectionReveal } from "@/components/ui/SectionReveal";
import { GlowInput } from "@/components/ui/GlowInput";
import { useRef } from "react";

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/RKPinata", icon: "↗" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/danishteuku/", icon: "↗" },
];

export function Contact() {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder: wire to your backend or service
  };

  return (
    <section id="contact" className="relative min-h-screen py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-2xl mx-auto">
        <SectionReveal className="mb-12" stagger={0.1}>
          <h2
            data-reveal
            className="font-mono text-sm text-[var(--glow-red)] uppercase tracking-widest"
          >
            // Contact
          </h2>
          <p
            data-reveal
            className="text-3xl md:text-4xl font-semibold text-[var(--star-white)] mt-2"
          >
            Get in touch
          </p>
        </SectionReveal>
        <SectionReveal stagger={0.08}>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div data-reveal>
              <GlowInput label="Name" name="name" placeholder="Your name" required />
            </div>
            <div data-reveal>
              <GlowInput
                label="Email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>
            <div data-reveal>
              <GlowInput
                label="Message"
                name="message"
                as="textarea"
                placeholder="Say hello..."
                rows={4}
              />
            </div>
            <div data-reveal>
              <button
                type="submit"
                className="relative w-full md:w-auto px-8 py-4 font-mono text-sm rounded-lg text-[var(--star-white)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,51,51,0.3)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glow-red)] bg-[var(--space-dark)] border border-[var(--glass-border)] hover:border-[var(--glow-red)]"
              >
                Send message
              </button>
            </div>
          </form>
        </SectionReveal>
        <SectionReveal className="mt-16 pt-12 border-t border-[var(--glass-border)]">
          <div data-reveal className="flex flex-wrap gap-6">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm text-[var(--glow-red)]/90 hover:text-[var(--glow-red)] transition-colors flex items-center gap-2"
              >
                {link.label}
                <span className="text-xs">{link.icon}</span>
              </a>
            ))}
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
