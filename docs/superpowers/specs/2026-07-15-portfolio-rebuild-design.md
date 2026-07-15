# Portfolio rebuild — design

Date: 2026-07-15
Status: approved direction (minimal & typographic, single page, contact form kept)

## Goal

Rebuild pedro-dev-five.vercel.app from scratch as a minimal, typographic, single-page portfolio about Pedro Ernesto — not about his employer. English-only. No photos of Pedro. Detailed experience is the core content. Design philosophy follows the repo's `emil-design-eng` and `apple-design` skills: restraint, invisible correctness, motion only where it earns its place.

## Constraints (user-set)

- Hero is "Pedro Ernesto — Software Engineer", no company name in headline positions.
- No photos of Pedro anywhere; no stock imagery; no project screenshots.
- Detailed Maestro and ServiceNet entries; college roles and final-year CS degree included.
- Keep the working Resend contact form.
- Old frontend already deleted; rebuild starts from the placeholder skeleton.

## Page composition

One centered column, `max-width: 42rem`, `padding-inline: 1.5rem`, top padding ~6rem, bottom ~8rem, sections separated by ~4rem. Order:

1. **Header** — h1 "Pedro Ernesto"; role line "Software Engineer" (muted); meta row (mono, 13px): "João Pessoa, Brazil · GitHub · LinkedIn · Email". Email in the meta row scrolls to the contact form (anchor), not mailto.
2. **About** — one paragraph, 3 sentences, from the CV summary voice: full stack engineer specialized in diagnosing and engineering reliability into complex automated systems; currently building Maestro (mobile.dev) — single link, only company mention above the fold; final-year CS student at UNIPÊ. AI-native workflow fluency (Claude Code, Codex) lives in the Maestro bullets only, not in About.
3. **Experience** — section label; entries with header row (company — role, left; period in mono, right; stacked on mobile) and 3–5 bullets:
   - **Maestro (mobile.dev) — Software Engineer** · Mar 2026 – Present · Remote
     - Led the technical overhaul of the Maestro MCP server (Kotlin, some TypeScript): −20% token consumption per call, 8 new tools, ~30% faster responses.
     - Tech lead for agent-reliability evaluation: built an eval runner on Inspect AI that exercises Claude Code and Codex harnesses against a live agent, classifying failure modes into a structured taxonomy with end-to-end reliability metrics.
     - Built and maintained Playwright-based automated test flows; Android/iOS device automation via ADB and dadb.
     - Shipped features and fixes across Maestro Studio and the open-source Maestro CLI.
     - Built custom Claude Code skills and agents adopted in the team's daily development loop.
   - **ServiceNet Tecnologia — Software Engineer (Internship)** · Aug 2025 – Mar 2026 · João Pessoa
     - Developed two high-volume platforms: an ERP/business-management system and an affiliate/transaction platform.
     - Built high-performance backend modules (TypeScript, Node.js) for high-volume transaction processing, including commission-calculation pipelines with auditability.
     - Optimized PostgreSQL for high-throughput workloads (query tuning, indexing) and enforced data integrity via constraints, transactions, and validation layers.
     - Integrated third-party APIs and built decoupled integrations between products; AWS S3 file persistence; Docker for dev/prod parity.
4. **Education** — B.S. Computer Science, UNIPÊ, João Pessoa · Expected Dec 2026 (final year). Two sub-entries during the degree:
   - Back End Developer, Software Factory (UBTech Office/UNIPÊ) · Feb–Jun 2023 — built applications and REST APIs with Django REST Framework in team-based projects.
   - Computing Tutor, Solidarity Computing School (ECS) · Aug–Dec 2023 — designed and delivered introductory computing courses for young learners; lesson plans, hands-on activities, progress assessment.
5. **Work** — three text rows, no images: Maestro CLI ↗ (github.com/mobile-dev-inc/maestro), Maestro MCP Server ↗ (docs.maestro.dev/getting-started/maestro-mcp), Maestro Studio ↗ (github.com/mobile-dev-inc/maestro-studio). One-line description each; phrasing makes clear these are products Pedro works on, not solo projects.
6. **Contact** — section label + the Resend-backed form (name, email, message, submit). Styling: hairline `1px` bottom borders on inputs (no boxes), same type scale as body; button is the page's one filled element with `:active { transform: scale(0.98) }` at 100ms; inline status text for sending/success/error (English). This is the page's only client component.
7. **Footer** — mono meta row: email (mailto), GitHub, LinkedIn, "© 2026". Resume link intentionally absent until a current PDF exists.

## Type & color

- **Text**: Inter via `next/font` (self-hosted, zero CLS). **Meta/dates**: `ui-monospace` system stack, `font-variant-numeric: tabular-nums`.
- Size-specific tracking (apple-design §15): name `-0.02em`, body `0`, section labels 11–12px uppercase `+0.08em` muted. Leading: 1.1 on the name, 1.6 body. Hierarchy from weight+size+leading; spacing in `rem`.
- **Theme**: CSS variables + `prefers-color-scheme`; no toggle, no JS. Light `#ffffff` bg / `#111111` text; dark `#0a0a0a` / `#ededed`; muted grays chosen to pass WCAG AA on both. Links: underlined, muted `text-decoration-color` darkening on hover. External links suffixed ↗.

## Motion (total spec — nothing beyond this)

- One-time page-load stagger: each section `opacity 0→1`, `translateY(8px)→0`, 300ms, `cubic-bezier(0.23, 1, 0.32, 1)`, 40ms per-section delay. CSS keyframes (off main thread), non-blocking.
- Hover: `text-decoration-color`/color transitions 150ms `ease`, gated by `@media (hover:hover) and (pointer:fine)`.
- Submit button: `transform: scale(0.98)` on `:active`, 100ms ease-out; transition targets `transform` only (never `all`).
- `prefers-reduced-motion: reduce`: entrance becomes opacity-only 200ms; no translate.
- Explicitly out: scroll-triggered animation, parallax, springs, JS animation libraries. Rationale: emil-design-eng frequency framework — a short static page is "occasional"; apple-design §16 (Purpose, Simplicity).

## Architecture & files

- Next.js 14 App Router (existing), static-first; Tailwind 3.4 (existing config; prune unused custom tokens).
- `lib/content.ts` — single typed content module (header, about, experience[], education, work[], links). Replaces `locales/en.json` + `lib/i18n.ts` (i18n plumbing is dead; bullets need arrays, not a flat `t()`). `lib/data.tsx` deleted.
- `app/page.tsx` — server component composing sections; small presentational components in `components/` (`section-label`, `experience-entry`, `contact-form` — the only `"use client"` file).
- Keep: `app/api/contact/route.ts`, `emails/contact-email.tsx` (already English).
- **Dependency prune** — remove: framer-motion, motion, next-themes, @radix-ui/react-slot, class-variance-authority, clsx, tailwind-merge, lucide-react, react-icons. Keep: next, react, react-dom, resend, react-email, @react-email/components. Build still requires `RESEND_API_KEY` (documented in the verify skill).
- **Assets**: delete `public/maestro-*.png`; add minimal SVG favicon (monogram/dot — fixes the standing 404) and a typographic 1200×630 `og-image.png` matching the site (name + role, same type system); wire both in metadata. `public/resume.pdf` stays unlinked until replaced.
- Metadata: keep current title/description (English, Pedro-first); add OG image + favicon references.
- README: update structure section after rebuild.

## Error handling

- Contact form: client-side required-field check; inline error copy on API failure or network error; button disabled while sending. API route behavior unchanged.
- No other runtime states exist (static content).

## Verification

- `RESEND_API_KEY=<dummy> npm run build` passes.
- Screenshot pass via the repo verify skill: light, dark, 390px mobile, `prefers-reduced-motion` emulation.
- Semantics: one `h1`, sections as `<section>` with real heading hierarchy, lists as `<ul>`, `lang="en"`, AA contrast on muted text, form fields labeled.
- Contact form: exercise the flow against the route (dummy key → expect the route's error path to render the inline error correctly; real send verified by Pedro post-deploy).
- Final polish gate: run `find-animation-opportunities` and `review-animations` skills on the finished UI; act only on findings consistent with the motion spec above.
- Update `.claude/skills/verify/SKILL.md` flows to describe the new page.

## Out of scope

- New resume PDF content (separate task; footer link added when it exists).
- Analytics, blog/writing section, CMS — YAGNI.
