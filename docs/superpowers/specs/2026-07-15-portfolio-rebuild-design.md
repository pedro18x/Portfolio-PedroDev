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
3. **Experience** — section label; entries with header row (company — role, left; period in mono, right; stacked on mobile) and 3–4 short bullets. **Tone rule (user decision 2026-07-15): this is not the CV — describe what Pedro works on, qualitatively; no metrics, percentages, or counts anywhere in the section.**
   - **Maestro (mobile.dev) — Software Engineer** · Mar 2026 – Present · Remote
     - Led the overhaul of the Maestro MCP server (Kotlin, TypeScript), which lets AI agents write, run, and debug UI tests.
     - Built agent-reliability evaluation tooling that exercises coding agents like Claude Code and Codex against the live platform.
     - Ship features and fixes across Maestro Studio and the open-source Maestro CLI, plus Playwright test flows and Android/iOS device automation.
   - **ServiceNet Tecnologia — Software Engineer (Internship)** · Aug 2025 – Mar 2026 · João Pessoa
     - Worked on two data-intensive platforms: an ERP system and an affiliate/transaction platform.
     - Built backend modules in TypeScript and Node.js for high-volume transaction processing.
     - Focused on PostgreSQL performance and data integrity, with AWS S3 storage and Dockerized environments.
4. **Education** — B.S. Computer Science, UNIPÊ, João Pessoa · Expected Dec 2026 (final year). Two sub-entries during the degree:
   - Back End Developer, Software Factory (UBTech Office/UNIPÊ) · Feb–Jun 2023 — built applications and REST APIs with Django REST Framework in team-based projects.
   - Computing Tutor, Solidarity Computing School (ECS) · Aug–Dec 2023 — designed and delivered introductory computing courses for young learners; lesson plans, hands-on activities, progress assessment.
5. **Work** — three text rows, no images: Maestro CLI ↗ (github.com/mobile-dev-inc/maestro), Maestro MCP Server ↗ (docs.maestro.dev/getting-started/maestro-mcp), Maestro Studio ↗ (github.com/mobile-dev-inc/maestro-studio). One-line description each; phrasing makes clear these are products Pedro works on, not solo projects.
6. **Contact** — section label + the Resend-backed form (name, email, message, submit). Styling: hairline `1px` bottom borders on inputs (no boxes), same type scale as body; button is the page's one filled element with `:active { transform: scale(0.98) }` at 100ms; inline status text for sending/success/error (English). This is the page's only client component.
7. **Footer** — mono meta row: email (mailto), GitHub, LinkedIn, "© 2026". Resume link intentionally absent until a current PDF exists.

## Type & color

- **Text**: Inter via `next/font` (self-hosted, zero CLS). **Meta/dates**: `ui-monospace` system stack, `font-variant-numeric: tabular-nums`.
- Size-specific tracking (apple-design §15): name `-0.02em`, body `0`, section labels 11–12px uppercase `+0.08em` muted. Leading: 1.1 on the name, 1.6 body. Hierarchy from weight+size+leading; spacing in `rem`.
- **Theme**: light only, as a deliberate choice (user decision 2026-07-15): `#ffffff` bg, `#111111` text, muted `#595959`, faint `#6e6e6e`, hairline `#e5e5e5`; `color-scheme: light`. No dark variant, no toggle, no theme JS. Muted grays pass WCAG AA. Links: underlined, muted `text-decoration-color` darkening on hover. External links suffixed ↗. Styled `::selection` (near-black ground, white text).

## Motion & interaction (total spec — nothing beyond this)

Every item is transform/opacity/color/filter only, uses CSS transitions where the user can interrupt (retargetable, per apple-design §3), and responds on pointer-down (§1). Values follow emil-design-eng's duration table and easing rules.

1. **Entrance** (once per load): each section `opacity 0→1`, `translateY(8px)→0`, `blur(2px)→0`, 400ms `cubic-bezier(0.23, 1, 0.32, 1)`, 45ms per-section stagger. CSS keyframes, non-blocking. Reduced motion: opacity-only 200ms, no delay.
2. **Links**: hover — `text-decoration-color` muted→current, 150ms `ease` (gated `@media (hover:hover) and (pointer:fine)`); press — `opacity 0.55` instantly on `:active` (0ms down), eased 150ms recovery on release. Works for touch taps too (feedback on pointer-down).
3. **Work rows**: hovering a row translates its ↗ suffix 2px up-right, 200ms `cubic-bezier(0.23, 1, 0.32, 1)`; reverts on leave. Hover-gated, transform-only.
4. **Form fields**: static 1px hairline under each field; on focus, a full-strength underline grows `scaleX(0→1)` from the left (`transform-origin: left`, 250ms strong ease-out) and the field label shifts muted→text 150ms. Blur reverses both (mirrored path, §7 spatial consistency).
5. **Submit button**: `:active { transform: scale(0.98) }` 100ms; label morphs "Send message" → "Sending…" → "Sent" via Emil's blur-masked crossfade (2px blur + reduced opacity for ~100ms while the text swaps, 200ms total). Errors render in the inline status line, not on the button. Button resets to idle after ~2.5s.
6. **Footer email**: mailto link plus an adjacent small mono "copy" control; click copies the address and the control morphs to "copied" with the same blur-masked crossfade, reverting after 2s.
7. **Anchor scroll** (header "Email" → contact): `scroll-behavior: smooth`, disabled under reduced motion.
8. `prefers-reduced-motion: reduce`: entrance = opacity-only; all translate/scale effects dropped; color/opacity feedback retained.
9. **Explicitly out**: scroll-triggered reveals, parallax, cursor-followers, JS animation libraries. Rationale: emil-design-eng frequency framework — hovers are frequent so they stay ≤200ms and subtle; the entrance is once so it can be elegant (400ms); apple-design §16 (Purpose, Simplicity, Craft).

## Apple design layer (v3 addition, user request 2026-07-15)

1. **Springs, not beziers, for physical motion** (apple-design §4): transform-based interactions use a critically damped spring (damping 1.0 — no overshoot; hovers/presses carry no momentum) encoded as a CSS `linear()` curve. Tokens: `--spring` (curve) + durations 272ms (`response 0.18` — button release, arrow nudge) and 454ms (`response 0.30` — floating nav). Asymmetric press: button press-down stays 100ms ease-out (instant feedback), release springs back. CSS transitions keep everything interruptible/retargetable mid-flight (§3).
2. **Material floating nav** (§12): a fixed translucent bar (`rgba(255,255,255,0.6)` + `backdrop-filter: blur(20px) saturate(180%)`) that appears only after the page header scrolls out of view (IntersectionObserver on the header; the page's third and final client component). Contains name (scrolls to top) and GitHub · LinkedIn · Contact. Enter/exit along the same path — `translateY(-100%) ↔ 0` with the gentle spring (§7 spatial consistency); `visibility` toggled after exit so hidden links aren't tabbable. Vibrancy: slightly heavier weight + letter-spacing bump for legibility on the material. **Scroll edge effect, not a hard divider**: a 12px gradient-masked blur under the bar instead of a border.
3. **Typography** (§15): `font-optical-sizing: auto` with Inter's `opsz` axis loaded via next/font.
4. **Accessibility triad** (§14): `prefers-reduced-motion` (existing behavior; nav becomes opacity-only), `prefers-reduced-transparency` (nav goes solid white, blur dropped), `prefers-contrast: more` (solid background + defined bottom border).

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

## Card layout (v4, user request 2026-07-15 — reference: ttiago.com)

The page becomes an **ID card that opens**, adapted (not cloned) from ttiago.com:

- **Closed state** (initial): a white card (42rem, rounded-2xl, soft shadow) centered on a light-gray canvas (`#f6f6f6`), containing: name, role, "pe" monogram top-right (**no photo** — standing rule), and a mono definition list: LOCATION → João Pessoa, Brazil; CURRENTLY → Maestro (mobile.dev); CONTRIBUTIONS → live GitHub contribution count (server-fetched from github.com/users/pedro18x/contributions, revalidated daily, row hidden on fetch failure) with three green squares as a nod to the contribution graph. One control: "Open portfolio".
- **Open transition**: the card surface itself expands into the page — margin-top 30vh→0, max-width 42rem→100vw, radius/shadow→0 — while the content unfurls via `grid-template-rows: 0fr→1fr` with an opacity+blur resolve. Gentle spring curve, ~550ms. Collapse reverses along the same path (apple-design §7); CSS transitions keep it interruptible. Collapsed content is `inert` + `aria-hidden` (SEO keeps it in the DOM; keyboard users can't tab into it). Deep links (`#contact`) auto-open on load. Reduced motion: opacity-only crossfade.
- **Open state content** (inner column stays 42rem): bio paragraph (Tiago-style "From João Pessoa…" opener, no metrics) + inline icon links (GitHub, LinkedIn, email — inline SVGs, no icon library); then sections as **date-left two-column rows** (`8.5rem` mono period column, stacked on mobile): WORK (Maestro with bullets, ServiceNet with bullets, Back End Developer — Software Factory one-liner), EDUCATION (B.S. UNIPÊ, 2023 — 2026, expected Dec 2026), VOLUNTEER (Computing Tutor — Solidarity Computing School), PROJECTS (the three Maestro product links), CONTACT (existing form), footer.
- The floating material nav (v3) remains; it observes the card header, so it only ever appears in the open state after scrolling.
- The open/close toggle label morphs ("Open portfolio" ⇄ "Collapse") with the existing blur-masked crossfade.

## Out of scope

- New resume PDF content (separate task; footer link added when it exists).
- Analytics, blog/writing section, CMS — YAGNI.
