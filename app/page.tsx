import { ActivityGraph } from "@/components/activity-graph";
import { ContactForm } from "@/components/contact-form";
import { CopyEmail } from "@/components/copy-email";
import { ExperienceList } from "@/components/experience-list";
import { FloatingNav } from "@/components/floating-nav";
import { ProjectLink } from "@/components/project-link";
import { ProofPull } from "@/components/proof-pull";
import { Rail } from "@/components/rail";
import { Reveal } from "@/components/reveal";
import { Section } from "@/components/section";
import {
  bio,
  educationEntries,
  projects,
  site,
  volunteerEntries,
  workEntries,
  type TimelineEntry,
} from "@/lib/content";
import { getContributions, getProfile } from "@/lib/github";

export const revalidate = 3600; // snapshot horário; o tempo real vem de /api/contributions

/** Linha da linha do tempo: período à esquerda (mono), conteúdo à direita. */
function TimelineRow({ entry }: { entry: TimelineEntry }) {
  return (
    <div className="grid gap-x-6 gap-y-1 sm:grid-cols-[10rem_1fr]">
      <span className="pt-0.5 font-mono text-[0.8125rem] text-faint [font-variant-numeric:tabular-nums]">
        {entry.period}
      </span>
      <div>
        <h3 className="text-[0.9375rem] font-semibold">
          {entry.title}
          <span className="font-normal text-muted-foreground">
            ,{" "}
            {entry.orgUrl ? (
              <a href={entry.orgUrl} target="_blank" rel="noopener noreferrer">
                {entry.org}
              </a>
            ) : (
              entry.org
            )}
          </span>
        </h3>
        {entry.description && (
          <p className="mt-1 text-[0.9375rem] text-muted-foreground">{entry.description}</p>
        )}
      </div>
    </div>
  );
}

export default async function Home() {
  const [contributionData, profile] = await Promise.all([getContributions(), getProfile()]);

  return (
    <>
      {/* A folha (o site inteiro) precisa cobrir a chapa do Proof Pull:
          z-index acima da .proof-plate e fundo próprio opaco */}
      <main id="top" className="relative z-[1] min-h-screen bg-background">
        <FloatingNav name={site.name} github={site.github} linkedin={site.linkedin} />

        {/* Largura do contêiner = rail + gap + coluna de conteúdo (sem vão morto à direita) */}
        <div className="mx-auto grid max-w-[66rem] gap-x-16 px-6 md:grid-cols-[19rem_1fr]">
          {/* min-w-0: impede que o w-max da grade de atividade dite a largura da coluna */}
          <div className="reveal min-w-0">
            <Rail
              name={site.name}
              role={site.role}
              thesis={bio.thesis}
              location={site.location}
              email={site.email}
              github={site.github}
              linkedin={site.linkedin}
            />
          </div>

          <div className="min-w-0 max-w-[40rem] pb-24 pt-10 md:pt-20">
            <Reveal>
              <section aria-label="About" id="about" className="scroll-mt-16">
                <p>
                  {bio.prefix}
                  <a href={bio.linkUrl} target="_blank" rel="noopener noreferrer">
                    {bio.linkText}
                  </a>
                  {bio.suffix}
                </p>
              </section>
            </Reveal>

            <Reveal delay={0.05}>
              <Section label="Work" id="work">
                <ExperienceList entries={workEntries} />
              </Section>
            </Reveal>

            {/* O cabeçalho ACTIVITY vive dentro do ActivityGraph: assim ele
                some junto quando snapshot e fallback ao vivo falham, e o
                caminho de recuperação no cliente continua montado */}
            <Reveal delay={0.1}>
              <ActivityGraph initial={contributionData} profile={profile} />
            </Reveal>

            <Reveal>
              <Section label="Education" id="education">
                <div className="flex flex-col gap-7">
                  {educationEntries.map((entry) => (
                    <TimelineRow key={entry.org} entry={entry} />
                  ))}
                </div>
              </Section>
            </Reveal>

            <Reveal>
              <Section label="Volunteer" id="volunteer">
                <div className="flex flex-col gap-7">
                  {volunteerEntries.map((entry) => (
                    <TimelineRow key={entry.org} entry={entry} />
                  ))}
                </div>
              </Section>
            </Reveal>

            <Reveal>
              <Section label="Projects" id="projects">
                <ul className="flex flex-col gap-3.5">
                  {projects.map((item) => (
                    <ProjectLink key={item.name} item={item} />
                  ))}
                </ul>
              </Section>
            </Reveal>

            <Reveal>
              <Section label="Contact" id="contact">
                <ContactForm />
                <p className="mt-10 flex flex-wrap items-baseline gap-x-2.5 gap-y-1.5 border-t border-border pt-6 font-mono text-[0.8125rem] text-faint">
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                  <CopyEmail email={site.email} />
                </p>
              </Section>
            </Reveal>
          </div>
        </div>
      </main>

      <ProofPull />
    </>
  );
}
