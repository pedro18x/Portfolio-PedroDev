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

## Interactive layer (v5, ultracode pass 2026-07-15 — build-critique-refine loop)

Stack additions: Tailwind migrated v3→v4 (base-nova shadcn components are v4-native); `motion` as the single JS animation engine; shadcn components pulled: accordion, hover-card, tooltip, field, input, textarea, spinner, command, dialog, kbd, button (+label, separator, input-group as deps); react-bits: Magnet (rebuilt on useSpring) — CountUp was pulled then replaced (broken overdamped physics).

What shipped, post-critique (two workflow rounds: Emil/Apple motion critic, shadcn pattern auditor, restraint judge — 32 findings round 1, 9 round 2, converged round 3):

1. **Scroll reveals** (open state): sections rise 8px + fade on first entry, spring 450ms, staggered; stable motion.div identity (no remount/state loss on collapse); no blur (reserved for the card's own entrance); fail-visible under `@media print`.
2. **Underline draw** on content links (two-layer background, softline base + currentColor draws left→right, 220ms).
3. **Closed card**: hover lift (−2px + deeper shadow), whole card clickable; mobile keeps 1rem inset (`max-width: min(42rem, 100vw − 2rem)`).
4. **Icon row**: Magnet ≤3px on useSpring (velocity-preserving, listeners scoped to the padded element, off for touch/reduced-motion); monochrome tooltips with skip-delay grouping and `data-[instant]:animate-none`.
5. **Contributions**: count-up ~450ms critically damped; card squares use the same gray ramp as the grid (page is fully grayscale — the GitHub greens were cut as the only saturated pixels).
6. **Activity**: 52-week monochrome heat grid, token-derived color-mix ramp, fits the column exactly, native day tooltips.
7. **Work accordion**: zero chrome, one-line summaries, spring height *transitions* (280ms, retargetable mid-flight, not keyframes), rotating single chevron, multiple-open, Maestro open by default; valid heading semantics (no h3-in-button).
8. **Project hover-cards**: image + mono name/tags only (no duplicated description), OG image cropped 2.6:1 to hide GitHub's rainbow language bar and illegible stats.
9. **Contact form**: shadcn Field/Input/Textarea/Button/Spinner composition (`data-invalid`/`aria-invalid`, FieldError, conditional describedby); red confined to the field rule + helper text; invalid focus-line turns destructive (one rule at a time); success = stroke-drawn checkmark in the button.
10. **⌘K palette**: cmdk in dialog, purely typographic, zero open/close animation (keyboard-initiated), chip in floating nav only; hash-based navigation that opens the card (input cancels pending scripted scroll).
11. **Press feedback** on all text pressables (`.press`); floating-nav material densified to 0.82 so under-scroll content never reads as an artifact; scroll-edge blur strip removed.
12. **Reduced motion**: global neutralization of tw-animate translate/zoom for tooltip/hover-card/dialog and accordion height.

Restraint adjudication (user overruled judge's cuts, kept toned): magnet kept at 3px; parallax kept at 12px; palette kept without chip on the card.

## Rail layout (v6, user request 2026-07-15 — replaces the v4 card concept)

The ID-card-that-opens was retired: too close to its reference (ttiago.com). The page is now a **fixed-rail split layout**, chosen by the user from five design directions:

- **Rail (left, sticky, full-height, hairline right border)**: name, role, thesis line ("I care about diagnosing and engineering reliability into complex automated systems."), section nav with scroll-spy (mono uppercase labels, leading rule that grows on hover/active — the site's line vocabulary), social icons (Magnet + tooltips), location/email, ⌘K chip, ©. On <md it becomes a static header; the floating material nav is mobile-only and observes `#site-header`.
- **Content (right, 40rem)**: intro paragraph → Work (accordion) → Activity → Education → Volunteer → Projects (hover-cards) → Contact (form + email/copy footer row). Grid children carry `min-w-0` (the activity grid's `w-max` otherwise dictates column width and overflows mobile).
- **Retired with the card**: CardShell/ShellOpenContext, the header parallax (the restraint judge's cut, now moot), the contributions dl row, hash-open logic (palette navigation is plain `scrollIntoView` + `history.replaceState`).

**Copy rule (user, 2026-07-15): no em dashes anywhere in site copy.** Date ranges use en dash (–); prose restructured with commas/semicolons/colons. Project descriptions are standalone sentences (no dash separators).

**Live GitHub activity**: `/api/contributions` (force-dynamic, no-store) scrapes and parses per request; the page server-renders an hourly ISR snapshot for instant paint and the client silently swaps in the fresh response after hydration. The count animates from the displayed value to the live value (never restarts from zero). Failures keep the snapshot; if neither exists the section hides.

## v6 amendments (user, 2026-07-15)

- **⌘K palette removed entirely** (user: redundant on a one-view page; the restraint judge's original cut, now confirmed). Deleted: command-palette, ui/command, ui/dialog, ui/input-group, ui/kbd, the `cmdk` dependency, and both chips.
- **Contact form redesigned**: iOS-style grouped filled fields (`.field-input`: muted fill, rounded-lg, transparent border; focus = white surface + softline border + 3px monochrome halo; invalid = destructive border/halo). Name and email share a row on ≥sm. The hairline/focus-line treatment retired with the old form.
- **Form validation policy: reward early, punish late** (2026-07-15): required errors only on submit; format errors on blur of non-empty fields; Enter in single-line inputs advances to the next field instead of submitting. Fixes the accidental all-red state.
- **Quick-look card shows real profile facts** (public repos · followers, GitHub API, revalidated hourly) instead of repeating the contribution count; the count appears once, in the grid caption. The invented 'Mostly Maestro' line was removed (Pedro's GitHub is not only Maestro).
- **Activity board is a link**: the whole grid + caption anchors to the GitHub profile (caption gains the ↗ nudge). Hovering opens a quick-look profile card (monogram, @handle, live total, gray ramp) wrapped in `SpotlightCard` — adapted from @react-bits/SpotlightCard to light monochrome with off-render-path pointer tracking. @react-bits/PixelCard was evaluated and rejected (298 lines of canvas, too busy).

## v6 amendments, continued (2026-07-16)

- **Contribution count**: the public endpoint only reports public contributions (238) while Pedro's logged-in view includes private-repo work (783). `lib/github.ts` now prefers an authenticated GraphQL path when `GITHUB_TOKEN` is set (exact per-day counts, private included), falling back to the public scrape. Zero-code alternative: enabling "Private contributions" in GitHub's contribution settings makes the public count complete.
- **Viz (final, 2026-07-16)**: recent-window calendar — last 16 weeks of the same monochrome heatmap at larger cells (13px), with a single delegated day-tooltip ("16 contributions on May 22nd.") that follows the hovered cell, anchored outside the scroll clip and clamped to the column. The bar-strip iteration was rejected by Pedro. Profile quick-look moved to the caption line. Pedro enabled GitHub's "Private contributions" setting, so the public count is complete (783) without a token; GITHUB_TOKEN remains an optional hardening path.

## Harmony pass (2026-07-16)

- Activity calendar is fluid: 26 weeks, square 1fr cells filling the content column at any viewport (no fixed cell size, no horizontal scroll); caption ends align with grid edges.
- Container tightened from 72rem to 66rem (rail 19 + gap 4 + content 40 + padding 3) — no dead column right of the content.

## v7: monogram rail (2026-07-16)

### v7.1: the pixel plate (2026-07-16, supersedes the 3D monogram)

Pedro saw the solid 3D version live and rejected it ("not sure if i like this"). Diagnosis agreed on: a rotating two-letter mark is legible only a fraction of the time; it was the page's only always-moving element (violating the site's own restraint rules); and the fuzzy point-cloud texture fought the machined hairline/typographic character. From a three-option artifact (A settles-legible 3D, B pixel plate, C dither orb) Pedro chose **B: the pixel plate**.

`components/monogram.tsx` now renders the "pe" flat, set in the contribution calendar's own visual language: a coarse grid of rounded cells in the monochrome ink ramp, each cell with a hashed base intensity. Motion is user-caused plus one ambient exception Pedro approved: a very slow per-cell shimmer (sine, ~12s period, amplitude 0.08, disabled under reduced motion). Interactions: ink deepens under the cursor with smoothed falloff (radius 80px); a click sends a gaussian ring ripple through the plate (900ms life). Reduced motion: static plate, hover/click still respond (user-initiated), redrawn on demand. All prior budgets kept: Geist sampling after fonts.ready, 200ms first-paint fade, ResizeObserver fit, IntersectionObserver + visibilitychange loop pause, precomputed 64-step ink table, roundRect with fillRect fallback, hidden on mobile. Cursor stays default (no grab); the plate is decorative, aria-hidden.

The 3D solid/physics work is retired but documented below for the record.

- **Scroll-spy nav removed** (user: pointless on a page readable with almost no scrolling). The `.rnav` styles, `sections` prop, and `SECTIONS` list are gone; deep-link ids on sections remain.
- **The rail's empty middle now holds a 3D dithered "pe" monogram** (`components/monogram.tsx`, zero dependencies, ~200 lines of canvas). The glyph is sampled from an offscreen canvas in the real Geist (after `document.fonts.ready`), extruded as a true solid: front face + back face + continuous side walls wherever the glyph has an edge (a surface shell, ~4k points; DEPTH 54), rotated/projected by hand. The first cut used 4 discrete z-layers and read as stacked cutouts edge-on; Pedro rejected that ("I wanted it to be fully 3d") and the shell replaced it, and shaded by Bayer 4x4 ordered dithering deciding which points draw, so the aesthetic matches the contribution calendar.
- **Physics (apple-design pointer rules)**: idle auto-rotation (0.0045 rad/frame); pointer drag tracks 1:1 with capture; release hands off the gesture velocity (clamped, decayed by friction back into the idle spin; a stalled pointer hands off nothing); vertical tilt is clamped and springs back. Grabbing mid-coast retargets instantly (interruptible).
- **Budgets**: reduced-motion = static frame, drag still works (user-initiated motion); loop pauses when the tab is hidden AND when the stage is offscreen (IntersectionObserver; the stage is display:none on mobile); depth shades come from a precomputed 32-entry rgba table (no per-point string allocation); first paint fades in over 200ms to mask the post-fonts.ready pop; `touch-action: pan-y` keeps vertical scroll native on touch.
- **Rail footer gains the now-block**: LOCAL TIME (live seconds clock, America/Fortaleza, empty on the server and filled after mount) and NOW ("Building Maestro"), mono uppercase, above socials/meta.

## Whole-site animation audit (2026-07-16, review-animations + improve-animations bar)

Applied: `ui/button.tsx` `transition-all` replaced with an explicit property list (the skill's hard trigger; `all` animates unintended properties off-GPU). Monogram perf items above came out of the same pass.

Vetted and accepted as-is (documented so future reviews don't re-litigate): accordion `transition-[height]` (canonical Base UI height-var pattern; content reflows regardless); fnav 454ms spring-gentle entrance (drawer-class scroll response, interruptible, reduced-motion fades); `.reveal` 400ms page-load rise (once per visit, within the 200-500ms budget); tw-animate keyframes on tooltip/hover-card entrances (occasional frequency, reduced-motion neutralized in globals); Reveal's motion `y` shorthand (once-per-load springs on a light page; not worth the churn); submit button press already asymmetric (100ms ease-out down, 272ms spring release).

## v8: ink under pressure (2026-07-16, Plan B "Showpiece" of the component tournament)

Pedro's brief after three ultracode tournaments: "original" means VISUALLY striking (cool components/interactions), never narrative concepts (two concept rounds rejected; see memory). Round three mined the shadcn MCP registries (@react-bits, @shadcn) through 8 visual-domain generators + 24 judges; all directions converged on one voice: **black ink as physical material responding to the hand**. Pedro chose Plan B (showpiece). Palette stays frozen white/ink/gray, light-only, zero new packages (registry items verified via MCP; gsap-dependent ones reimplemented on the site's motion/spring tokens).

Shipped:
- **The Print Plate** (`components/activity-graph.tsx`, full rewrite): the GitHub year as a halftone press plate on canvas. Each day is a circular ink dot whose RADIUS encodes the count (geometry, not opacity; counts parsed from GraphQL field or scrape label). Once per session, on first scroll into view, a 1px printhead sweeps 1.1s and dots materialize column by column with a small pop; a 38px SF Mono odometer total rolls 000 to the real total in sync. Dots swell with spring lag within 70px of the cursor (@react-bits/DotGrid proximity model, no gsap). Single delegated tooltip now driven by cell math over the canvas. Stat rail beneath: LONGEST STREAK / BUSIEST DAY / ACTIVE WEEKS, real values from the same payload, count up once in view; hidden if counts unavailable. Canvas aria-hidden + sr-only summary. Reduced motion: plate pre-printed, counters static, tooltip intact.
- **Shock bridge**: clicking the "pe" monogram dispatches `pe-ink` (viewport coords); if the plate is on screen it ripples from the same point. Two plates, one ink.
- **RollingDigits** (`components/rolling-digits.tsx`): odometer primitive (the @react-bits/Counter pattern on site tokens). Used by the rail clock (LOCAL TIME now rolls per second) and the plate total. RM: plain text.
- **Weight-echo** (`.wecho`/`.wecho-big` in globals): labels and the fnav links gain ink mass on hover via Geist's variable wght axis; the rail masthead is now a two-line lockup (2.125rem) with a bigger echo (600 to 780).
- **InkRow** (`components/ink-row.tsx` + `.ink-row` CSS): inverted spotlight; ink gathers under the cursor (4.5% alpha radial via --mx/--my), rows press down 0.5px on :active. Applied to work accordion rows, education/volunteer timeline rows, project rows.
- **Margin rule draw** (`.exp-rule`): a 1px rule draws top-down along the accordion bullet gutter with the open spring; RM: fades.
- **Magnet extended** to the accordion chevron.
- **Hold-to-send** (`contact-form.tsx`): pointer-down floods the submit with ink via clip-path (700ms); early release rubber-bands back and teaches "Hold to send."; a completed hold submits. Keyboard clicks (detail 0) and reduced motion submit with a plain click; pointer clicks alone never submit.

Verified (production build + Playwright): odometer 000→783 synced to sweep; tooltip by cell math; shock-bridge ripple; abort hint; full-hold submits (stubbed API); keyboard Enter yields the 3 validation errors; second visit in session skips the sweep; RM plate pre-printed + plain click sends; zero em dashes/overflow/console errors on desktop + mobile.

Kitsch-control rules carried from the synthesis: no grain, no crop marks, no print jargon in copy; sweep once per session; dot radii capped; the plate is the page's only canvas moment besides the monogram it extends; spotlight alpha capped at 4.5%; no autonomous motion added.

### v8.1 (2026-07-17): accordion quieted, ink rows retired

Pedro's calls after living with v8: the chevrons, the bullet markers, the accordion gutter rule, and the ink-row hover shade all read as too much. Changes: the expand indicator is now a hairline "+" whose vertical bar spring-rotates 90 degrees into a "-" on open (PlusMinus in experience-list.tsx, softline to ink on hover, snap under reduced motion); expanded details are clean unmarked paragraphs one size-step down (0.875rem) with no rule; InkRow (inverted spotlight) is deleted everywhere (component, CSS, all row usages) along with .exp-rule. The rest of v8 (print plate, odometers, weight-echo, hold-to-send, shock bridge) stands. Content: the unannounced-product line was removed from site copy entirely (even vague phrasing); the eval bullet stays in-progress tense ("Building").

## v9: Proof Pull (2026-07-17, spectacle tournament winner)

Pedro's brief: "visit every famous portfolio", find one addition that makes the site truly stand out; his mid-flight corrections shaped it twice. A first tournament (34 agents) produced a variable-font timing game (Proof Press); Pedro killed it ("thats ass") and chose "not a game, a spectacle: one jaw-drop moment people would screen-record." A second tournament (47 agents: 6-modality corpus of 78 famous spectacle moments, 8 ideation angles, 4 judges per idea with SPECTACLE as the veto axis, games banned by hard constraint) was won by **Proof Pull** (8.15 weighted; spectacle 8.5, cohesion 9): peel the page off its printing plate by a dog-eared corner. Pedro liked the peel but rejected the original reveal (the site mirrored/inverted as a letterpress plate): "it should reveal something more fun." From the offered payloads he chose the **living glyph field**. Prototyped fully in the artifact before any site code; approved ("I love that actually").

Shipped (`components/proof-pull.tsx`, ~640 lines, zero dependencies; CSS in globals `proof-*`; mounted as a sibling of `<main>` in page.tsx):

- **The dog-ear**: a 24px turned corner fixed at the viewport's bottom-right (44px hit target), static at rest with zero rAF cost. Hover lifts it to 1.33x with a deepening drop shadow (snappy spring). No hint, no pulse, no tooltip: found or not found.
- **The peel**: pointer-drag folds the whole `<main>` along the perpendicular bisector of corner-to-pointer (Sutherland-Hodgman clip of the document rect; clip-path polygon on the main element). A full-viewport canvas draws only the curled flap: reflection of the lifted region, crease edge bowed by a quadratic (BOW 0.7 x roll radius), cylindrical gradient (valley #cfcfcf, crest white), a lift drop-shadow separating the flap from the white page, and a cast shadow band on the plate. Rubber-band resistance past 45% of the diagonal. The fixed fnav lives inside main so it peels with the page; the sheet gets only `will-change: clip-path` during the drag (transform/contain would re-anchor the fnav).
- **Bistable release**: release early = damped spring home (K 170 / C 20, slight overshoot) ending in a dog-ear settle pop; release past 40% of the diagonal = the sheet whips away (accelerating open + flap fade) and the field goes full screen. The corner (now folded the other way, white on ink) or Escape crossfades the page back (120ms).
- **The living glyph field**: the plate is a dark (#0a0a0a) canvas of monospace glyphs (the site's --font-mono stack), cell 12x20, drawn via a prerendered atlas (10-glyph ramp " .:-=pe8@" with "pe" mid-ramp, 5 gray shades). Base field = 4-term sine plasma pushed dark by a pow(1.7) curve; a Float32Array wake layer adds cursor energy (decay 0.86 + 4-neighbor diffusion 0.03, per-cell ceiling; the first prototype diverged at gain 1.08 and flooded solid, hence the "must stay < 1" comment). Pointer movement stirs a glowing wake that ripples outward; pointerdown splashes a wide burst (radius 7). During a peel the drag pointer already feeds the field, so the reveal is alive under the curl.
- **Budgets**: DPR clamp 2 on both canvases; rAF only during drag/spring/open and while the field is visible; visibilitychange pauses the field; resize mid-gesture cancels cleanly; zero idle cost at rest (no listeners beyond the button's own).
- **Access**: the dog-ear is a real button (aria-label "Pull a proof: see what lives behind this page" / "Put the page back", aria-pressed); Enter toggles a full field view; Escape exits; plate container is inert + aria-hidden; focus ring flips to white over the plate. **Reduced motion**: no curl, no whip, no ambient flow: the button toggles a static frame of the field where moving the pointer still brightens glyphs locally (flashlight over frozen dunes) and clicks still bloom, redrawn per event.
- **Kitsch control**: no hint affordances, no autoplay, no sound, no color, no gyro, no second corner; the field has no score or goal (games stay banned).

Verified (production build + Playwright): peek release springs home pixel-clean (clip removed, scroll restored); commit release opens (body.plate-view, aria-pressed true); stir wake + splash render; corner and Escape both return; keyboard Enter/Escape toggle; scrolled peel registers correctly (clip offset by locked scrollY); reduced-motion click toggles the static field; mobile 390px peel + spring-back; zero console errors on all runs.

### v9.1 (2026-07-17): Emil-bar motion audit of Proof Pull

Pedro asked for the review-animations/improve-animations pass on the peel. Applied (all verified with production-build gesture probes): (1) the dog-ear hover scale/shadow is now gated behind `@media (hover: hover) and (pointer: fine)` (touch taps were leaving sticky hover at 1.33x; `:focus-visible` stays ungated); (2) the return spring is interruptible — the dog-ear reappears the moment the spring starts, and re-grabbing it cancels the rAF and resumes the drag with no teardown, retargeting the fold to the pointer (same rule as the monogram's coast); (3) momentum release per the gesture standards — smoothed radial velocity (px/ms, 120ms staleness cutoff) now decides alongside the distance line: an outward flick > 0.7 px/ms opens even below 40% of the diagonal (min 90px lifted), a strong inward yank (< -0.5) vetoes an over-the-line open, the return spring inherits the hand's inward momentum (capped 2200 px/s), and a hard flick whips the open faster (capped 3200 px/s).

Vetted and accepted as-is (do not re-litigate): `filter: drop-shadow` transition on the 24px dog-ear svg (paint cost trivial, the deepening shadow sells the lift); the 120ms opacity crossfade on the keyboard Enter toggle (rare action, opacity is the RM-safe channel, an instant full-viewport flip would jar); `proof-settle` keyframes restarting from zero (terminal landing pop after a deliberate gesture, not rapidly re-triggerable); clip-path on `main` during the peel (it IS the effect, gesture-scoped behind `will-change`, zero idle cost). Press/release asymmetry and the reduced-motion triad were already correct.

## Out of scope

- New resume PDF content (separate task; footer link added when it exists).
- Analytics, blog/writing section, CMS — YAGNI.
