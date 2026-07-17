import { site } from "./content";

export interface ContributionDay {
  date: string;
  level: number;
  /** Contagem exata do dia (disponível via GraphQL autenticado) */
  count?: number;
  /** Texto do tooltip do GitHub, ex. "3 contributions on July 14th." */
  label?: string;
}

export interface ContributionData {
  total: string;
  days: ContributionDay[];
}

const CONTRIBUTIONS_URL = `https://github.com/users/${site.githubUser}/contributions`;

/** Interpreta o HTML do calendário público de contribuições do GitHub. */
export function parseContributions(html: string): ContributionData | null {
  const totalMatch = html.match(/([\d,]+)\s+contributions?/);
  if (!totalMatch) return null;

  const days: ContributionDay[] = [];
  const idToDate = new Map<string, string>();

  for (const cell of html.match(/<td[^>]*ContributionCalendar-day[^>]*>/g) ?? []) {
    const date = cell.match(/data-date="([^"]+)"/)?.[1];
    const level = cell.match(/data-level="(\d)"/)?.[1];
    const id = cell.match(/id="([^"]+)"/)?.[1];
    if (date && level !== undefined) {
      days.push({ date, level: Number(level) });
      if (id) idToDate.set(id, date);
    }
  }
  if (!days.length) return null;

  const labels = new Map<string, string>();
  for (const m of html.matchAll(/<tool-tip[^>]*for="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    const date = idToDate.get(m[1]);
    if (date) labels.set(date, m[2].trim());
  }

  days.sort((a, b) => a.date.localeCompare(b.date));
  return {
    total: totalMatch[1],
    days: days.map((d) => ({ ...d, label: labels.get(d.date) })),
  };
}

/** Nível 0–4 no espírito das faixas do próprio GitHub */
function levelFromCount(count: number): number {
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

/**
 * Caminho autenticado (GraphQL): com um GITHUB_TOKEN do próprio Pedro a
 * contagem inclui contribuições em repositórios privados — o número que
 * ele vê logado (783), não só o público (238) — e traz contagens exatas
 * por dia. Sem token, retorna null e o chamador cai no scrape público.
 */
async function getContributionsGraphQL(cache: RequestInit): Promise<ContributionData | null> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;
  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "pedro-dev-portfolio",
      },
      body: JSON.stringify({
        query: `query($login: String!) {
          user(login: $login) {
            contributionsCollection {
              contributionCalendar {
                totalContributions
                weeks { contributionDays { date contributionCount } }
              }
            }
          }
        }`,
        variables: { login: site.githubUser },
      }),
      // GitHub travado (aceita conexão e não responde) não pode prender a
      // invocação inteira: aborta para os caminhos de null existentes
      signal: AbortSignal.timeout(5000),
      ...cache,
    });
    if (!res.ok) return null;
    const json = await res.json();
    const calendar = json?.data?.user?.contributionsCollection?.contributionCalendar;
    if (!calendar?.weeks) return null;

    const days: ContributionDay[] = [];
    for (const week of calendar.weeks) {
      for (const d of week.contributionDays) {
        const pretty = new Date(`${d.date}T00:00:00Z`).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          timeZone: "UTC",
        });
        const n = d.contributionCount;
        days.push({
          date: d.date,
          count: n,
          level: levelFromCount(n),
          label:
            n === 0
              ? `No contributions on ${pretty}`
              : `${n} contribution${n === 1 ? "" : "s"} on ${pretty}`,
        });
      }
    }
    days.sort((a, b) => a.date.localeCompare(b.date));
    return {
      total: calendar.totalContributions.toLocaleString("en-US"),
      days,
    };
  } catch {
    return null;
  }
}

async function getContributionsScrape(cache: RequestInit): Promise<ContributionData | null> {
  try {
    const res = await fetch(CONTRIBUTIONS_URL, {
      signal: AbortSignal.timeout(5000),
      ...cache,
    });
    if (!res.ok) return null;
    return parseContributions(await res.text());
  } catch {
    return null;
  }
}

/**
 * Snapshot para o primeiro paint (ISR horário). O dado "de verdade" em tempo
 * real vem de /api/contributions, buscado no cliente após a hidratação.
 */
export async function getContributions(): Promise<ContributionData | null> {
  const cache = { next: { revalidate: 3600 } } as RequestInit;
  return (await getContributionsGraphQL(cache)) ?? (await getContributionsScrape(cache));
}

/** Busca sem cache nenhum: usada pela rota /api/contributions. */
export async function getContributionsFresh(): Promise<ContributionData | null> {
  const cache = { cache: "no-store" } as RequestInit;
  return (await getContributionsGraphQL(cache)) ?? (await getContributionsScrape(cache));
}

export interface GithubProfile {
  repos: number;
  followers: number;
}

/**
 * Fatos reais do perfil (API pública do GitHub, revalidação horária).
 * A API exige User-Agent; falhas retornam null e a linha se oculta.
 */
export async function getProfile(): Promise<GithubProfile | null> {
  try {
    const res = await fetch(`https://api.github.com/users/${site.githubUser}`, {
      headers: {
        "User-Agent": "pedro-dev-portfolio",
        Accept: "application/vnd.github+json",
      },
      signal: AbortSignal.timeout(5000),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (typeof json.public_repos !== "number") return null;
    return { repos: json.public_repos, followers: json.followers ?? 0 };
  } catch {
    return null;
  }
}
