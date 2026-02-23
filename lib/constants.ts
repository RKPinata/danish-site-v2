export const THEME = {
  spaceBlack: "#0a0404",
  spaceDark: "#1a0a0d",
  nebulaRed: "#4e1a1a",
  nebulaCrimson: "#691b2d",
  starWhite: "#ffe8e8",
  glowRed: "#ff3333",
  glowOrange: "#ff6b35",
} as const;

export const PARTICLE_COUNT_DESKTOP = 8000;
export const PARTICLE_COUNT_MOBILE = 3000;

/** Career start date (first professional role from LinkedIn). Update when needed. */
export const CAREER_START_DATE = "2021-08-01";

export function getYearsOfExperience(): string {
  const start = new Date(CAREER_START_DATE);
  const now = new Date();
  const years = (now.getTime() - start.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
  const fullYears = Math.floor(years);
  return fullYears + "+";
}

export const PROJECTS = [
  {
    id: "1",
    title: "AI Agents @ respond.io",
    description:
      "Led Test AI Agent feature for secure agent testing; delivered AI Agent management and conversation summarization. Resolved production issues with Sentry and backend collaboration; drove component consistency and JSDoc type documentation.",
    tech: ["React", "TypeScript", "Sentry"],
    href: "https://respond.io",
  },
  {
    id: "2",
    title: "MoneyLion Instacash",
    description:
      "Core features for cash advance serving millions. Spearheaded performance and architecture improvements—reduced network requests and load times by over 50% with useSWR and Zustand.",
    tech: ["React", "useSWR", "Zustand"],
    href: "#",
  },
  {
    id: "3",
    title: "JBI Access & Auth (JAAS)",
    description:
      "Designed and implemented NestJS API modules with TypeORM and PostgreSQL; proposed and implemented feature flags for controlled rollouts and A/B testing.",
    tech: ["NestJS", "Vue", "TypeORM", "PostgreSQL"],
    href: "#",
  },
  {
    id: "4",
    title: "Vet on Call / Pet Mall",
    description:
      "Vet on Call: video call app with Alibaba Cloud and Vercel deployment; significantly reduced time to connect to a vet. Pet Mall: React Native e-commerce with mobile team.",
    tech: ["React Native", "WebRTC", "Vercel"],
    href: "#",
  },
  {
    id: "5",
    title: "BeyondGo / Snappymob",
    description:
      "BeyondGo: Webflow-based pages for a crypto startup; layouts, image carousel, responsiveness, scroll animation. Snappymob: site revamp, interactions, and bug fixes from design.",
    tech: ["Webflow", "React"],
    href: "#",
  },
];

export const EXPERIENCE = [
  { company: "respond.io", role: "Frontend Developer", period: "Mar 2025 – Present" },
  { company: "Snappymob", role: "Software Engineer", period: "Jul 2023 – Feb 2025" },
  { company: "Furtory", role: "Frontend Engineer", period: "Mar 2023 – May 2023" },
  { company: "Doctorate Support Group (DSG)", role: "Web Dev Intern", period: "Feb 2022 – Apr 2022" },
  { company: "UNS Electrical", role: "Frontend Dev Intern", period: "Aug 2021 – Dec 2021" },
];

export const NAV_SECTIONS = [
  { id: "hero", label: "// HERO" },
  { id: "about", label: "// ABOUT" },
  { id: "projects", label: "// WORK" },
  { id: "contact", label: "// CONTACT" },
];
