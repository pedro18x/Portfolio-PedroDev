/**
 * Fonte única de todo o conteúdo do site.
 * Regra de tom (spec 2026-07-15): isto não é o currículo — descreve o trabalho
 * qualitativamente, sem métricas, percentuais ou contagens.
 */

export const site = {
  name: 'Pedro Ernesto',
  role: 'Software Engineer',
  location: 'João Pessoa, Brazil',
  currently: 'Maestro (mobile.dev)',
  email: 'pedroernestovogado@gmail.com',
  url: 'https://pedro-dev-five.vercel.app/',
  github: 'https://github.com/pedro18x',
  githubUser: 'pedro18x',
  linkedin: 'https://linkedin.com/in/pedroernestovogado',
  description:
    'Portfolio of Pedro Ernesto, full stack software engineer working with TypeScript, React, Kotlin, and developer tooling. Currently at Maestro (mobile.dev).',
};

export const bio = {
  /** Frase curta que ancora o rail, sob o nome */
  thesis:
    'I care about diagnosing and engineering reliability into complex automated systems.',
  prefix:
    "I'm from João Pessoa, Brazil, finishing my CS degree at UNIPÊ while building ",
  linkText: 'Maestro',
  linkUrl: 'https://maestro.dev',
  suffix:
    ', the end-to-end testing platform for mobile and web. Full stack, mostly Kotlin and TypeScript, from agent evaluations to developer tools.',
};

export interface TimelineEntry {
  period: string;
  title: string;
  org: string;
  orgUrl?: string;
  description?: string;
  /** Linha visível com a entrada recolhida (entradas expansíveis) */
  summary?: string;
  bullets?: string[];
}

export const workEntries: TimelineEntry[] = [
  {
    period: 'Mar 2026 – Present',
    title: 'Software Engineer',
    org: 'Maestro (mobile.dev)',
    orgUrl: 'https://maestro.dev',
    summary:
      'Full stack across the MCP server, Maestro Studio, and the open-source CLI.',
    bullets: [
      'Led the overhaul of the Maestro MCP server (Kotlin, TypeScript), which lets AI agents write, run, and debug UI tests.',
      'Building agent-reliability evaluation tooling that exercises coding agents like Claude Code and Codex against the live platform.',
      'Ship features and fixes across Maestro Studio and the open-source Maestro CLI, plus Playwright test flows and Android/iOS device automation.',
    ],
  },
  {
    period: 'Aug 2025 – Mar 2026',
    title: 'Software Engineer (Internship)',
    org: 'ServiceNet Tecnologia',
    summary: 'Backend work on two high-volume, data-intensive platforms.',
    bullets: [
      'Worked on two data-intensive platforms: an ERP system and an affiliate/transaction platform.',
      'Built backend modules in TypeScript and Node.js for high-volume transaction processing.',
      'Focused on PostgreSQL performance and data integrity, with AWS S3 storage and Dockerized environments.',
    ],
  },
  {
    period: 'Feb – Jun 2023',
    title: 'Back End Developer',
    org: 'Software Factory (UBTech Office, UNIPÊ)',
    description:
      'Built applications and REST APIs with Django REST Framework in team-based projects.',
  },
];

export const educationEntries: TimelineEntry[] = [
  {
    period: '2023 – 2026',
    title: 'B.S. Computer Science',
    org: 'UNIPÊ',
    description: 'Final year; expected graduation Dec 2026.',
  },
];

export const volunteerEntries: TimelineEntry[] = [
  {
    period: 'Aug – Dec 2023',
    title: 'Computing Tutor',
    org: 'Solidarity Computing School',
    description:
      'Designed and delivered introductory computing courses for young learners: lesson plans, hands-on activities, progress assessment.',
  },
];

export interface ProjectItem {
  name: string;
  url: string;
  description: string;
  /** Prévia exibida no hover-card (quick look) */
  image: string;
  tags: string[];
}

export const projects: ProjectItem[] = [
  {
    name: 'Maestro CLI',
    url: 'https://github.com/mobile-dev-inc/maestro',
    description:
      'Open-source E2E testing framework for mobile and web; I ship features and fixes on the core team.',
    image: '/maestro-cli.png',
    tags: ['Kotlin', 'Open Source', 'CLI'],
  },
  {
    name: 'Maestro MCP Server',
    url: 'https://docs.maestro.dev/getting-started/maestro-mcp',
    description:
      'Lets AI coding agents write, run, and debug UI tests; I led its overhaul.',
    image: '/maestro-mcp.png',
    tags: ['Kotlin', 'TypeScript', 'MCP'],
  },
  {
    name: 'Maestro Studio',
    url: 'https://github.com/mobile-dev-inc/maestro-studio',
    description:
      'Cross-platform desktop app for building and running tests visually.',
    image: '/maestro-studio.png',
    tags: ['Electron', 'React', 'TypeScript'],
  },
];
