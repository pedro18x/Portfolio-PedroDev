# Pedro Ernesto — Portfolio

> Personal portfolio: [pedro-dev-five.vercel.app](https://pedro-dev-five.vercel.app/)

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

</div>

## About

I'm a full stack software engineer at [Maestro (mobile.dev)](https://maestro.dev), working on the open-source [Maestro CLI](https://github.com/mobile-dev-inc/maestro), Maestro Studio, and the Maestro MCP server. This site is where I keep my experience, stack, and current work.

## Tech

- **[Next.js 14](https://nextjs.org/)** (App Router) with **[TypeScript](https://www.typescriptlang.org/)**
- **[TailwindCSS](https://tailwindcss.com/)** for styling; all motion is hand-written CSS (no animation libraries)
- **[Resend](https://resend.com/)** + **[React Email](https://react.email/)** for the contact form

## Structure

```
├── app/               # App Router: layout, page, icon, /api/contact
├── components/        # Section wrapper, contact form, copy-email, morph hook
├── emails/            # Contact notification template (React Email)
├── lib/content.ts     # All site copy and data, typed
└── public/            # og-image.png, resume placeholder
```

## Running locally

```bash
npm ci
RESEND_API_KEY=<your-key> npm run dev
```

`RESEND_API_KEY` is required for the build and for the contact form to send.

## Contact

Use the form on the site or reach me on [LinkedIn](https://www.linkedin.com/in/pedroernestovogado/).
