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
  thesis: "I like figuring out why complex systems break, and building them so they don't.",
  prefix:
    "I'm from João Pessoa, Brazil, finishing my CS degree at UNIPÊ. I build whatever the problem needs. Right now I'm doing that at ",
  linkText: 'Maestro',
  linkUrl: 'https://maestro.dev',
  suffix: '.',
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
      'Full stack work across the MCP server, Maestro Studio, and the open-source CLI.',
    bullets: [
      'Rebuilt the Maestro MCP server, the piece that lets AI agents write, run, and debug UI tests.',
      'Building tooling that evaluates how coding agents like Claude Code and Codex hold up against the live platform.',
      'The rest is everyday product work: Maestro Studio, the open-source CLI, Playwright test flows, Android and iOS device automation.',
    ],
  },
  {
    period: 'Aug 2025 – Mar 2026',
    title: 'Software Engineer (Internship)',
    org: 'ServiceNet Tecnologia',
    summary: 'Backend work on two data-heavy platforms.',
    bullets: [
      'Split my time between an ERP system and an affiliate transaction platform.',
      'Built the TypeScript and Node.js modules that handled their transaction processing.',
      'Spent a lot of that time on PostgreSQL performance and keeping data intact, with S3 for storage and everything running in Docker.',
    ],
  },
  {
    period: 'Feb – Jun 2023',
    title: 'Back End Developer',
    org: 'Software Factory (UBTech Office, UNIPÊ)',
    description:
      'First team experience: building apps and REST APIs with Django REST Framework.',
  },
];

export const educationEntries: TimelineEntry[] = [
  {
    period: '2023 – 2026',
    title: 'B.S. Computer Science',
    org: 'UNIPÊ',
    description: 'Final year; I graduate in December 2026.',
  },
];

export const volunteerEntries: TimelineEntry[] = [
  {
    period: 'Aug – Dec 2023',
    title: 'Computing Tutor',
    org: 'Solidarity Computing School',
    description:
      'Taught intro computing to kids: lesson plans, hands-on activities, and keeping track of how everyone was doing.',
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
      'Open-source E2E testing framework for mobile and web. I work on the core team.',
    image: '/maestro-cli.png',
    tags: ['Kotlin', 'Open Source', 'CLI'],
  },
  {
    name: 'Maestro MCP Server',
    url: 'https://docs.maestro.dev/getting-started/maestro-mcp',
    description:
      'Lets AI coding agents write, run, and debug UI tests. I led the rebuild.',
    image: '/maestro-mcp.png',
    tags: ['Kotlin', 'TypeScript', 'MCP'],
  },
  {
    name: 'Maestro Studio',
    url: 'https://github.com/mobile-dev-inc/maestro-studio',
    description:
      'Desktop app for building and running Maestro tests visually.',
    image: '/maestro-studio.png',
    tags: ['Electron', 'React', 'TypeScript'],
  },
];
